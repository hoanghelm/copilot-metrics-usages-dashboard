using System.Data;
using System.Text.Json;
using Microsoft.Data.SqlClient;
using CopilotMetrics.Models;
using CopilotMetrics.Controllers;

namespace CopilotMetrics.Repositories;

public class MetricsRepository : IMetricsRepository
{
    private readonly string _connectionString;

    public MetricsRepository(string connectionString)
    {
        _connectionString = connectionString;
    }

    public async Task<List<Metrics>> GetMetricsAsync(
        DateOnly startDate,
        DateOnly endDate,
        string? enterprise,
        string? organization,
        string? team)
    {
        var metrics = new List<Metrics>();

        using var connection = new SqlConnection(_connectionString);
        using var command = new SqlCommand("GetCopilotMetrics", connection)
        {
            CommandType = CommandType.StoredProcedure
        };

        command.Parameters.AddWithValue("@StartDate", startDate);
        command.Parameters.AddWithValue("@EndDate", endDate);
        command.Parameters.AddWithValue("@Enterprise", (object?)enterprise ?? DBNull.Value);
        command.Parameters.AddWithValue("@Organization", (object?)organization ?? DBNull.Value);
        command.Parameters.AddWithValue("@Team", (object?)team ?? DBNull.Value);

        await connection.OpenAsync();
        using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            var metricsJson = reader.GetString("MetricsJson");
            var metric = JsonSerializer.Deserialize<Metrics>(metricsJson);
            if (metric != null)
            {
                metric.Id = reader.GetString("Id");
                metric.Date = DateOnly.FromDateTime(reader.GetDateTime("Date"));
                metric.TotalActiveUsers = reader.GetInt32("TotalActiveUsers");
                metric.TotalEngagedUsers = reader.GetInt32("TotalEngagedUsers");
                metric.Enterprise = reader.IsDBNull("Enterprise") ? null : reader.GetString("Enterprise");
                metric.Organization = reader.IsDBNull("Organization") ? null : reader.GetString("Organization");
                metric.Team = reader.IsDBNull("Team") ? null : reader.GetString("Team");
                metric.LastUpdate = reader.GetDateTime("LastUpdate");
                metrics.Add(metric);
            }
        }

        return metrics;
    }

    public async Task<CopilotSeats?> GetSeatsAsync(string? enterprise, string? organization)
    {
        using var connection = new SqlConnection(_connectionString);
        using var command = new SqlCommand("GetCopilotSeats", connection)
        {
            CommandType = CommandType.StoredProcedure
        };

        command.Parameters.AddWithValue("@Enterprise", (object?)enterprise ?? DBNull.Value);
        command.Parameters.AddWithValue("@Organization", (object?)organization ?? DBNull.Value);

        await connection.OpenAsync();
        using var reader = await command.ExecuteReaderAsync();

        if (await reader.ReadAsync())
        {
            var seatsJson = reader.GetString("SeatsJson");
            var seats = JsonSerializer.Deserialize<CopilotSeats>(seatsJson);
            if (seats != null)
            {
                seats.Id = reader.GetString("Id");
                seats.Date = DateOnly.FromDateTime(reader.GetDateTime("Date"));
                seats.TotalSeats = reader.GetInt32("TotalSeats");
                seats.Enterprise = reader.IsDBNull("Enterprise") ? null : reader.GetString("Enterprise");
                seats.Organization = reader.IsDBNull("Organization") ? null : reader.GetString("Organization");
                seats.Page = reader.GetInt32("Page");
                seats.HasNextPage = reader.GetBoolean("HasNextPage");
                seats.LastUpdate = reader.GetDateTime("LastUpdate");
                return seats;
            }
        }

        return null;
    }

    public async Task<List<string>> GetDistinctLanguagesAsync()
    {
        var languages = new HashSet<string>();

        using var connection = new SqlConnection(_connectionString);
        var query = @"
            SELECT DISTINCT MetricsJson
            FROM CopilotMetrics
            WHERE Date >= DATEADD(day, -30, GETDATE())";

        using var command = new SqlCommand(query, connection);
        await connection.OpenAsync();
        using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            var metricsJson = reader.GetString(0);
            var metrics = JsonSerializer.Deserialize<Metrics>(metricsJson);
            if (metrics?.CopilotIdeCodeCompletions?.Languages != null)
            {
                foreach (var lang in metrics.CopilotIdeCodeCompletions.Languages)
                {
                    languages.Add(lang.Name);
                }
            }
        }

        return languages.OrderBy(l => l).ToList();
    }

    public async Task<List<string>> GetDistinctEditorsAsync()
    {
        var editors = new HashSet<string>();

        using var connection = new SqlConnection(_connectionString);
        var query = @"
            SELECT DISTINCT MetricsJson
            FROM CopilotMetrics
            WHERE Date >= DATEADD(day, -30, GETDATE())";

        using var command = new SqlCommand(query, connection);
        await connection.OpenAsync();
        using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            var metricsJson = reader.GetString(0);
            var metrics = JsonSerializer.Deserialize<Metrics>(metricsJson);
            if (metrics?.CopilotIdeCodeCompletions?.Editors != null)
            {
                foreach (var editor in metrics.CopilotIdeCodeCompletions.Editors)
                {
                    editors.Add(editor.Name);
                }
            }
        }

        return editors.OrderBy(e => e).ToList();
    }

    public async Task UpsertMetricsAsync(Metrics metrics)
    {
        metrics.GenerateId();
        var metricsJson = JsonSerializer.Serialize(metrics);

        using var connection = new SqlConnection(_connectionString);
        using var command = new SqlCommand("UpsertCopilotMetrics", connection)
        {
            CommandType = CommandType.StoredProcedure
        };

        command.Parameters.AddWithValue("@Id", metrics.Id);
        command.Parameters.AddWithValue("@Date", metrics.Date);
        command.Parameters.AddWithValue("@TotalActiveUsers", metrics.TotalActiveUsers);
        command.Parameters.AddWithValue("@TotalEngagedUsers", metrics.TotalEngagedUsers);
        command.Parameters.AddWithValue("@Enterprise", (object?)metrics.Enterprise ?? DBNull.Value);
        command.Parameters.AddWithValue("@Organization", (object?)metrics.Organization ?? DBNull.Value);
        command.Parameters.AddWithValue("@Team", (object?)metrics.Team ?? DBNull.Value);
        command.Parameters.AddWithValue("@MetricsJson", metricsJson);

        await connection.OpenAsync();
        await command.ExecuteNonQueryAsync();
    }

    public async Task UpsertSeatsAsync(CopilotSeats seats)
    {
        seats.GenerateId();
        var seatsJson = JsonSerializer.Serialize(seats);

        using var connection = new SqlConnection(_connectionString);
        using var command = new SqlCommand("UpsertCopilotSeats", connection)
        {
            CommandType = CommandType.StoredProcedure
        };

        command.Parameters.AddWithValue("@Id", seats.Id);
        command.Parameters.AddWithValue("@Date", seats.Date);
        command.Parameters.AddWithValue("@TotalSeats", seats.TotalSeats);
        command.Parameters.AddWithValue("@Enterprise", (object?)seats.Enterprise ?? DBNull.Value);
        command.Parameters.AddWithValue("@Organization", (object?)seats.Organization ?? DBNull.Value);
        command.Parameters.AddWithValue("@Page", seats.Page);
        command.Parameters.AddWithValue("@HasNextPage", seats.HasNextPage);
        command.Parameters.AddWithValue("@SeatsJson", seatsJson);

        await connection.OpenAsync();
        await command.ExecuteNonQueryAsync();
    }
}
