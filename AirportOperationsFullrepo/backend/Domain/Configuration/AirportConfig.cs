namespace AirportOperations.Domain.Configuration
{
    public class AirportConfig
    {
        public const string SectionName = "AirportConfig";

        public int LargeParkingSpots { get; set; } = 5;  // For AIRLINER
        public int SmallParkingSpots { get; set; } = 10; // For PRIVATE
        public string Location { get; set; } = "Belgrade";
        public int RunwayCount { get; set; } = 1;
        public string WeatherApiKey { get; set; } = "1a1f91e2241e9056cf2dd4f9cf66e8da";
    }
} 