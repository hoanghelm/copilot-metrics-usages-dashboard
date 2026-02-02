using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using CopilotMetrics.Models;

namespace CopilotMetrics.Controllers;

[ApiController]
[Route("api/copilot")]
public class CopilotMetricsController : ControllerBase
{
    private readonly IMetricsRepository _metricsRepository;

    public CopilotMetricsController(IMetricsRepository metricsRepository)
    {
        _metricsRepository = metricsRepository;
    }

    [HttpGet("metrics")]
    public async Task<ActionResult<List<Metrics>>> GetMetrics(
        [FromQuery] DateOnly startDate,
        [FromQuery] DateOnly endDate,
        [FromQuery] string? enterprise = null,
        [FromQuery] string? organization = null,
        [FromQuery] string? team = null)
    {
        try
        {
            var metrics = await _metricsRepository.GetMetricsAsync(
                startDate, endDate, enterprise, organization, team);
            return Ok(metrics);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<List<Metrics>>.Fail(ex.Message));
        }
    }

    [HttpGet("seats")]
    public async Task<ActionResult<CopilotSeats>> GetSeats(
        [FromQuery] string? enterprise = null,
        [FromQuery] string? organization = null)
    {
        try
        {
            var seats = await _metricsRepository.GetSeatsAsync(enterprise, organization);
            if (seats == null)
            {
                return NotFound(ApiResponse<CopilotSeats>.Fail("No seats data found"));
            }
            return Ok(seats);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<CopilotSeats>.Fail(ex.Message));
        }
    }

    [HttpGet("languages")]
    public async Task<ActionResult<List<string>>> GetLanguages()
    {
        try
        {
            var languages = await _metricsRepository.GetDistinctLanguagesAsync();
            return Ok(languages);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<List<string>>.Fail(ex.Message));
        }
    }

    [HttpGet("editors")]
    public async Task<ActionResult<List<string>>> GetEditors()
    {
        try
        {
            var editors = await _metricsRepository.GetDistinctEditorsAsync();
            return Ok(editors);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<List<string>>.Fail(ex.Message));
        }
    }
}

public interface IMetricsRepository
{
    Task<List<Metrics>> GetMetricsAsync(
        DateOnly startDate,
        DateOnly endDate,
        string? enterprise,
        string? organization,
        string? team);

    Task<CopilotSeats?> GetSeatsAsync(string? enterprise, string? organization);
    Task<List<string>> GetDistinctLanguagesAsync();
    Task<List<string>> GetDistinctEditorsAsync();
    Task UpsertMetricsAsync(Metrics metrics);
    Task UpsertSeatsAsync(CopilotSeats seats);
}
