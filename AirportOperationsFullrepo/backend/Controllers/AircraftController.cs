using AirportOperations.Domain.Entities;
using AirportOperations.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AirportOperations.Controllers
{
    [ApiController]
    [Route("api")]
    public class AircraftController : ControllerBase
    {
        private readonly IAircraftService _aircraftService;
        private readonly IAuthService _authService;

        public AircraftController(IAircraftService aircraftService, IAuthService authService)
        {
            _aircraftService = aircraftService;
            _authService = authService;
        }

        [HttpPut("{callSign}/location")]
        [Authorize]
        public async Task<IActionResult> UpdateLocation(string callSign, [FromBody] LocationUpdateRequest request)
        {
            if (!_authService.ValidateAircraftIdentity(callSign, Request.Headers["Authorization"]))
            {
                return Unauthorized();
            }

            await _aircraftService.UpdateLocationAsync(callSign, request);
            return NoContent();
        }

        [HttpPost("{callSign}/intent")]
        [Authorize]
        public async Task<IActionResult> UpdateState(string callSign, [FromBody] StateChangeRequest request)
        {
            if (!_authService.ValidateAircraftIdentity(callSign, Request.Headers["Authorization"]))
            {
                return Unauthorized();
            }

            var result = await _aircraftService.RequestStateChangeAsync(callSign, request.State);
            
            if (!result.IsSuccess)
            {
                return Conflict(new { message = result.Message });
            }

            return NoContent();
        }

        [HttpGet("admin/aircraft")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllAircraft()
        {
            var aircraft = await _aircraftService.GetAllAircraftAsync();
            return Ok(aircraft);
        }

        [HttpGet("admin/statechanges")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetStateChanges()
        {
            var changes = await _aircraftService.GetStateChangeLogsAsync();
            return Ok(changes);
        }

        [HttpGet("admin/parking")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetParkingStatus()
        {
            var status = await _aircraftService.GetParkingStatusAsync();
            return Ok(status);
        }
    }

    public class LocationUpdateRequest
    {
        public AircraftType Type { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double Altitude { get; set; }
        public int Heading { get; set; }
    }

    public class StateChangeRequest
    {
        public AircraftState State { get; set; }
    }
} 