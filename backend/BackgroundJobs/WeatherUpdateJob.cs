using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using AirportOperations.Domain.Configuration;
using AirportOperations.Services;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AirportOperations.BackgroundJobs
{
    public class WeatherUpdateJob : BackgroundService
    {
        private readonly ILogger<WeatherUpdateJob> _logger;
        private readonly IServiceProvider _services;
        private readonly AirportConfig _config;

        public WeatherUpdateJob(
            ILogger<WeatherUpdateJob> logger,
            IServiceProvider services,
            IOptions<AirportConfig> config)
        {
            _logger = logger;
            _services = services;
            _config = config.Value;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _services.CreateScope())
                    {
                        var weatherService = scope.ServiceProvider.GetRequiredService<IWeatherService>();
                        await weatherService.UpdateWeatherDataAsync(_config.WeatherApiKey);
                        _logger.LogInformation("Weather data updated successfully");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while updating weather data");
                }

                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }
        }
    }
} 