using System.Text.Json.Serialization;

namespace CopilotMetrics.Models;

public class MetricsQueryParams
{
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string? Enterprise { get; set; }
    public string? Organization { get; set; }
    public string? Team { get; set; }
}

public class SeatsQueryParams
{
    public string? Enterprise { get; set; }
    public string? Organization { get; set; }
}

public class ApiResponse<T>
{
    [JsonPropertyName("data")]
    public T? Data { get; set; }

    [JsonPropertyName("error")]
    public string? Error { get; set; }

    [JsonPropertyName("success")]
    public bool Success { get; set; }

    public static ApiResponse<T> Ok(T data) => new()
    {
        Data = data,
        Success = true
    };

    public static ApiResponse<T> Fail(string error) => new()
    {
        Error = error,
        Success = false
    };
}
