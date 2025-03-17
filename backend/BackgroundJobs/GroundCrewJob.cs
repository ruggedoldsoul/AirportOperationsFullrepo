using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using AirportOperations.Services;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AirportOperations.BackgroundJobs
{
    public class GroundCrewJob : BackgroundService
    {
        private readonly ILogger<GroundCrewJob> _logger;
        private readonly IServiceProvider _services;

        public GroundCrewJob(ILogger<GroundCrewJob> logger, IServiceProvider services)
        {
            _logger = logger;
            _services = services;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _services.CreateScope())
                    {
                        var aircraftService = scope.ServiceProvider.GetRequiredService<IAircraftService>();
                        await HandleLandedAircraft(aircraftService);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while processing landed aircraft");
                }

                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }

        private async Task HandleLandedAircraft(IAircraftService aircraftService)
        {
            var landedAircraft = await aircraftService.GetLandedAircraftAsync();
            foreach (var aircraft in landedAircraft)
            {
                try
                {
                    await aircraftService.AssignParkingSpotAsync(aircraft.CallSign);
                    _logger.LogInformation($"Ground crew assigned parking spot to aircraft {aircraft.CallSign}");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Failed to assign parking spot to aircraft {aircraft.CallSign}");
                }
            }
        }
    }
} 