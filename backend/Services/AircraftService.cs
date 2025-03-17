using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using AirportOperations.Domain.Configuration;
using AirportOperations.Domain.Entities;
using AirportOperations.Infrastructure;

namespace AirportOperations.Services
{
    public class AircraftService : IAircraftService
    {
        private readonly AppDbContext _context;
        private readonly AirportConfig _config;
        private readonly ILogger<AircraftService> _logger;

        public AircraftService(
            AppDbContext context,
            IOptions<AirportConfig> config,
            ILogger<AircraftService> logger)
        {
            _context = context;
            _config = config.Value;
            _logger = logger;
        }

        public async Task<bool> ValidateStateChange(string callSign, AircraftState newState)
        {
            var aircraft = await _context.Aircraft.FindAsync(callSign);
            if (aircraft == null) return false;

            // Check runway occupancy
            if (newState == AircraftState.LANDED || newState == AircraftState.TAKE_OFF)
            {
                var runwayOccupied = await _context.Aircraft
                    .AnyAsync(a => a.CallSign != callSign && 
                                 (a.State == AircraftState.LANDED || 
                                  a.State == AircraftState.TAKE_OFF));
                if (runwayOccupied) return false;
            }

            // Check approach slot
            if (newState == AircraftState.APPROACH)
            {
                var approachOccupied = await _context.Aircraft
                    .AnyAsync(a => a.CallSign != callSign && 
                                 a.State == AircraftState.APPROACH);
                if (approachOccupied) return false;

                // Check runway availability for approach
                var runwayOccupied = await _context.Aircraft
                    .AnyAsync(a => a.State == AircraftState.LANDED || 
                                 a.State == AircraftState.TAKE_OFF);
                if (runwayOccupied) return false;

                // Check parking availability
                var availableSpots = aircraft.Type == AircraftType.AIRLINER
                    ? await GetAvailableLargeParkingSpotsAsync()
                    : await GetAvailableSmallParkingSpotsAsync();
                if (availableSpots == 0) return false;
            }

            return true;
        }

        public async Task<int> GetAvailableLargeParkingSpotsAsync()
        {
            var occupiedSpots = await _context.Aircraft
                .CountAsync(a => a.Type == AircraftType.AIRLINER && 
                               a.State == AircraftState.PARKED);
            return _config.LargeParkingSpots - occupiedSpots;
        }

        public async Task<int> GetAvailableSmallParkingSpotsAsync()
        {
            var occupiedSpots = await _context.Aircraft
                .CountAsync(a => a.Type == AircraftType.PRIVATE && 
                               a.State == AircraftState.PARKED);
            return _config.SmallParkingSpots - occupiedSpots;
        }

        public async Task<IEnumerable<Aircraft>> GetLandedAircraftAsync()
        {
            return await _context.Aircraft
                .Where(a => a.State == AircraftState.LANDED)
                .ToListAsync();
        }

        public async Task AssignParkingSpotAsync(string callSign)
        {
            var aircraft = await _context.Aircraft.FindAsync(callSign);
            if (aircraft == null || aircraft.State != AircraftState.LANDED)
                throw new InvalidOperationException("Aircraft not found or not in LANDED state");

            // Find available parking spot
            var occupiedSpots = await _context.Aircraft
                .Where(a => a.Type == aircraft.Type && 
                           a.State == AircraftState.PARKED)
                .Select(a => a.ParkingSpot)
                .ToListAsync();

            var maxSpots = aircraft.Type == AircraftType.AIRLINER
                ? _config.LargeParkingSpots
                : _config.SmallParkingSpots;

            var availableSpot = Enumerable.Range(1, maxSpots)
                .FirstOrDefault(i => !occupiedSpots.Contains(i));

            if (availableSpot == 0)
                throw new InvalidOperationException("No parking spots available");

            aircraft.State = AircraftState.PARKED;
            aircraft.ParkingSpot = availableSpot;
            await _context.SaveChangesAsync();
        }

        public async Task<StateChangeResult> RequestStateChangeAsync(string callSign, AircraftState newState)
        {
            var aircraft = await _context.Aircraft.FindAsync(callSign);
            if (aircraft == null)
                return new StateChangeResult { IsSuccess = false, Message = "Aircraft not found" };

            if (!await ValidateStateChange(callSign, newState))
                return new StateChangeResult { IsSuccess = false, Message = "State change not allowed" };

            var previousState = aircraft.State;
            aircraft.State = newState;
            aircraft.LastUpdated = DateTime.UtcNow;

            var log = new StateChangeLog
            {
                CallSign = callSign,
                RequestedState = newState,
                PreviousState = previousState,
                Timestamp = DateTime.UtcNow,
                Outcome = true
            };

            _context.StateChangeLog.Add(log);
            await _context.SaveChangesAsync();

            return new StateChangeResult { IsSuccess = true };
        }
    }

    public class StateChangeResult
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }
} 