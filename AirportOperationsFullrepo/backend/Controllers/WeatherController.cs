using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using AirportOperations.Services;

namespace AirportOperations.Controllers
{
    [ApiController]
    [Route("api/public")]
    public class WeatherController : ControllerBase
    {
        private readonly IWeatherService _weatherService;

        public WeatherController(IWeatherService weatherService)
        {
            _weatherService = weatherService;
        }

        [HttpGet("{callSign}/weather")]
        public async Task<IActionResult> GetWeather(string callSign)
        {
            var weather = await _weatherService.GetCurrentWeatherAsync();
            return Ok(weather);
        }
    }
} 