namespace AirportOperations.Domain.Entities
{
    public enum AircraftType
    {
        AIRLINER,
        PRIVATE
    }

    public enum AircraftState
    {
        PARKED,
        TAKE_OFF,
        AIRBORNE,
        APPROACH,
        LANDED
    }

    public class Aircraft
    {
        public string CallSign { get; set; } = string.Empty;
        public AircraftType Type { get; set; }
        public AircraftState State { get; set; }
        public Location? Location { get; set; }
        public int? ParkingSpot { get; set; }
        public DateTime LastUpdated { get; set; }
    }

    public class Location
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double Altitude { get; set; }
    }
} 