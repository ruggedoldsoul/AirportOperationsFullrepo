using System;

namespace AirportOperations.Domain.DTOs
{
    public class DashboardStatsDto
    {
        public int ActiveFlights { get; set; }
        public int TotalUsers { get; set; }
        public int PendingRequests { get; set; }
        public int AvailableSpots { get; set; }
        public int FlightsTrend { get; set; }
        public int UsersTrend { get; set; }
    }

    public class ActivityItemDto
    {
        public string Id { get; set; }
        public string Action { get; set; }
        public DateTime Time { get; set; }
        public string AircraftCallSign { get; set; }
        public string Type { get; set; }
    }

    public class ReportUrlDto
    {
        public string Url { get; set; }
    }
} 