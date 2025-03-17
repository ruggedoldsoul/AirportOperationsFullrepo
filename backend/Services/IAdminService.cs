using AirportOperations.Domain.DTOs;

namespace AirportOperations.Services
{
    public interface IAdminService
    {
        Task<DashboardStatsDto> GetDashboardStatsAsync();
        Task<List<ActivityItemDto>> GetRecentActivityAsync();
        Task<ReportUrlDto> GenerateReportAsync();
    }
} 