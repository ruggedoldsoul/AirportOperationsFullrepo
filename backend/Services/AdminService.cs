using AirportOperations.Domain.DTOs;
using AirportOperations.Domain.Entities;
using AirportOperations.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace AirportOperations.Services
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AdminService> _logger;

        public AdminService(AppDbContext context, ILogger<AdminService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var now = DateTime.UtcNow;
            var hourAgo = now.AddHours(-1);
            var weekAgo = now.AddDays(-7);

            // Get current stats
            var activeFlights = await _context.Aircraft
                .CountAsync(a => a.State != AircraftState.PARKED);

            var totalUsers = await _context.Users.CountAsync();

            var pendingRequests = await _context.StateChangeLog
                .CountAsync(s => !s.Outcome.HasValue);

            var availableSpots = await _context.ParkingSpots
                .CountAsync(p => !p.IsOccupied);

            // Get trends
            var previousHourFlights = await _context.Aircraft
                .CountAsync(a => a.LastUpdated >= hourAgo && a.State != AircraftState.PARKED);

            var previousWeekUsers = await _context.Users
                .CountAsync(u => u.CreatedAt <= weekAgo);

            return new DashboardStatsDto
            {
                ActiveFlights = activeFlights,
                TotalUsers = totalUsers,
                PendingRequests = pendingRequests,
                AvailableSpots = availableSpots,
                FlightsTrend = activeFlights - previousHourFlights,
                UsersTrend = totalUsers - previousWeekUsers
            };
        }

        public async Task<List<ActivityItemDto>> GetRecentActivityAsync()
        {
            var recentActivity = await _context.StateChangeLog
                .OrderByDescending(l => l.Timestamp)
                .Take(10)
                .Select(log => new ActivityItemDto
                {
                    Id = log.Id.ToString(),
                    Action = $"{log.CallSign} requested {log.RequestedState} state change - {(log.Outcome == true ? "ACCEPTED" : "REJECTED")}",
                    Time = log.Timestamp,
                    AircraftCallSign = log.CallSign,
                    Type = log.RequestedState.ToString()
                })
                .ToListAsync();

            return recentActivity;
        }

        public async Task<ReportUrlDto> GenerateReportAsync()
        {
            try
            {
                // Generate a unique report name
                var reportName = $"airport-report-{DateTime.UtcNow:yyyyMMddHHmmss}.pdf";
                var reportPath = Path.Combine("wwwroot", "reports", reportName);

                // Ensure the reports directory exists
                Directory.CreateDirectory(Path.Combine("wwwroot", "reports"));

                // Get report data
                var stats = await GetDashboardStatsAsync();
                var activities = await GetRecentActivityAsync();

                // Generate report content
                var reportContent = new List<string>
                {
                    "Airport Operations Report",
                    $"Generated at: {DateTime.UtcNow}",
                    "",
                    "Dashboard Statistics:",
                    $"Active Flights: {stats.ActiveFlights}",
                    $"Total Users: {stats.TotalUsers}",
                    $"Pending Requests: {stats.PendingRequests}",
                    $"Available Spots: {stats.AvailableSpots}",
                    "",
                    "Recent Activity:"
                };

                reportContent.AddRange(activities.Select(a => 
                    $"{a.Time}: {a.Action}"));

                await File.WriteAllLinesAsync(reportPath, reportContent);

                // Return the URL to access the report
                return new ReportUrlDto
                {
                    Url = $"/reports/{reportName}"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating report");
                throw;
            }
        }
    }
} 