using System.Text.Json.Serialization;

namespace CopilotMetrics.Models;

public class CopilotSeats
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("date")]
    public DateOnly Date { get; set; }

    [JsonPropertyName("total_seats")]
    public int TotalSeats { get; set; }

    [JsonPropertyName("seats")]
    public List<Seat> Seats { get; set; } = new();

    [JsonPropertyName("enterprise")]
    public string? Enterprise { get; set; }

    [JsonPropertyName("organization")]
    public string? Organization { get; set; }

    [JsonPropertyName("page")]
    public int Page { get; set; }

    [JsonPropertyName("has_next_page")]
    public bool HasNextPage { get; set; }

    [JsonPropertyName("last_update")]
    public DateTime LastUpdate { get; set; }

    public void GenerateId()
    {
        var parts = new List<string> { Date.ToString("yyyy-MM-dd") };
        if (!string.IsNullOrEmpty(Enterprise)) parts.Add(Enterprise);
        if (!string.IsNullOrEmpty(Organization)) parts.Add(Organization);
        parts.Add($"page-{Page}");
        Id = string.Join("-", parts);
    }
}

public class Seat
{
    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("updated_at")]
    public DateTime UpdatedAt { get; set; }

    [JsonPropertyName("pending_cancellation_date")]
    public DateTime? PendingCancellationDate { get; set; }

    [JsonPropertyName("last_activity_at")]
    public DateTime? LastActivityAt { get; set; }

    [JsonPropertyName("last_activity_editor")]
    public string? LastActivityEditor { get; set; }

    [JsonPropertyName("plan_type")]
    public string PlanType { get; set; } = string.Empty;

    [JsonPropertyName("assignee")]
    public GitHubUser Assignee { get; set; } = new();

    [JsonPropertyName("assigning_team")]
    public GitHubTeam? AssigningTeam { get; set; }

    [JsonPropertyName("organization")]
    public GitHubOrganization Organization { get; set; } = new();
}

public class GitHubUser
{
    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("login")]
    public string Login { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("avatar_url")]
    public string AvatarUrl { get; set; } = string.Empty;

    [JsonPropertyName("html_url")]
    public string HtmlUrl { get; set; } = string.Empty;

    [JsonPropertyName("type")]
    public string Type { get; set; } = string.Empty;
}

public class GitHubTeam
{
    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("slug")]
    public string Slug { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("privacy")]
    public string Privacy { get; set; } = string.Empty;

    [JsonPropertyName("html_url")]
    public string HtmlUrl { get; set; } = string.Empty;
}

public class GitHubOrganization
{
    [JsonPropertyName("login")]
    public string Login { get; set; } = string.Empty;

    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("avatar_url")]
    public string AvatarUrl { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string? Description { get; set; }
}
