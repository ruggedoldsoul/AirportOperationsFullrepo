using System;
using System.ComponentModel.DataAnnotations;

namespace AirportOperations.Domain.Entities
{
    public enum StateChangeOutcome
    {
        ACCEPTED,
        REJECTED
    }

    public class StateChangeLog
    {
        [Key]
        public int Id { get; set; }

        public string CallSign { get; set; }
        public Aircraft Aircraft { get; set; }

        public AircraftState RequestedState { get; set; }
        public AircraftState? PreviousState { get; set; }
        public StateChangeOutcome Outcome { get; set; }
        public string RejectReason { get; set; }
        public DateTime Timestamp { get; set; }
    }
} 