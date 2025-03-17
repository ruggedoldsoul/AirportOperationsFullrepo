namespace AirportOperations.Domain.Configuration
{
    public class AirportConfig
    {
        public const string SectionName = "AirportConfig";
        
        public string Name { get; set; } = "Belgrade Airport";
        public string Location { get; set; } = "Belgrade, Serbia";
        public string WeatherApiKey { get; set; } = string.Empty;
        public int LargeParkingSpots { get; set; } = 5;
        public int SmallParkingSpots { get; set; } = 10;
    }
} 