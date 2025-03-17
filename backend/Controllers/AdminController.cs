using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AirportOperations.Services;
using AirportOperations.Domain.DTOs;

namespace AirportOperations.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly ILogger<AdminController> _logger;

        public AdminController(IAdminService adminService, ILogger<AdminController> logger)
        {
            _adminService = adminService;
            _logger = logger;
        }

        [HttpGet("dashboard/stats")]
        public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
        {
            try
            {
                var stats = await _adminService.GetDashboardStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting dashboard stats");
                return StatusCode(500, new { message = "Failed to retrieve dashboard statistics" });
            }
        }

        [HttpGet("dashboard/activity")]
        public async Task<ActionResult<List<ActivityItemDto>>> GetRecentActivity()
        {
            try
            {
                var activities = await _adminService.GetRecentActivityAsync();
                return Ok(activities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting recent activity");
                return StatusCode(500, new { message = "Failed to retrieve recent activity" });
            }
        }

        [HttpPost("reports/generate")]
        public async Task<ActionResult<ReportUrlDto>> GenerateReport()
        {
            try
            {
                var report = await _adminService.GenerateReportAsync();
                return Ok(report);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating report");
                return StatusCode(500, new { message = "Failed to generate report" });
            }
        }
    }
} 