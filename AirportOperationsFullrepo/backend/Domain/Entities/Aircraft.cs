using System;
using System.ComponentModel.DataAnnotations;

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
        [Key]
        public string CallSign { get; set; }

        public AircraftType Type { get; set; }
        public AircraftState State { get; set; }

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public double? Altitude { get; set; }
        public int? Heading { get; set; }

        public string PublicKey { get; set; }
        public DateTime LastUpdated { get; set; }
        public int? ParkingSpot { get; set; }
    }
} 