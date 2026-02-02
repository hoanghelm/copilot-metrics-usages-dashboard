using System.Text.Json.Serialization;

namespace CopilotMetrics.Models;

public class Metrics
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("date")]
    public DateOnly Date { get; set; }

    [JsonPropertyName("total_active_users")]
    public int TotalActiveUsers { get; set; }

    [JsonPropertyName("total_engaged_users")]
    public int TotalEngagedUsers { get; set; }

    [JsonPropertyName("copilot_ide_code_completions")]
    public IdeCodeCompletions? CopilotIdeCodeCompletions { get; set; }

    [JsonPropertyName("copilot_ide_chat")]
    public IdeChat? CopilotIdeChat { get; set; }

    [JsonPropertyName("copilot_dotcom_chat")]
    public DotcomChat? CopilotDotcomChat { get; set; }

    [JsonPropertyName("copilot_dotcom_pull_requests")]
    public DotcomPullRequests? CopilotDotcomPullRequests { get; set; }

    [JsonPropertyName("enterprise")]
    public string? Enterprise { get; set; }

    [JsonPropertyName("organization")]
    public string? Organization { get; set; }

    [JsonPropertyName("team")]
    public string? Team { get; set; }

    [JsonPropertyName("last_update")]
    public DateTime LastUpdate { get; set; }

    public void GenerateId()
    {
        var parts = new List<string> { Date.ToString("yyyy-MM-dd") };
        if (!string.IsNullOrEmpty(Enterprise)) parts.Add(Enterprise);
        if (!string.IsNullOrEmpty(Organization)) parts.Add(Organization);
        if (!string.IsNullOrEmpty(Team)) parts.Add(Team);
        Id = string.Join("-", parts);
    }
}

public class IdeCodeCompletions
{
    [JsonPropertyName("total_engaged_users")]
    public int TotalEngagedUsers { get; set; }

    [JsonPropertyName("languages")]
    public List<IdeCodeCompletionLanguage> Languages { get; set; } = new();

    [JsonPropertyName("editors")]
    public List<IdeCodeCompletionEditor> Editors { get; set; } = new();
}

public class IdeCodeCompletionLanguage
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("total_engaged_users")]
    public int TotalEngagedUsers { get; set; }
}

public class IdeCodeCompletionEditor
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("total_engaged_users")]
    public int TotalEngagedUsers { get; set; }

    [JsonPropertyName("models")]
    public List<IdeCodeCompletionModel> Models { get; set; } = new();
}

public class IdeCodeCompletionModel
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("is_custom_model")]
    public bool IsCustomModel { get; set; }

    [JsonPropertyName("custom_model_training_date")]
    public string? CustomModelTrainingDate { get; set; }

    [JsonPropertyName("total_engaged_users")]
    public int TotalEngagedUsers { get; set; }

    [JsonPropertyName("languages")]
    public List<IdeCodeCompletionModelLanguage> Languages { get; set; } = new();
}

public class IdeCodeCompletionModelLanguage
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("total_engaged_users")]
    public int TotalEngagedUsers { get; set; }

    [JsonPropertyName("total_code_suggestions")]
    public int TotalCodeSuggestions { get; set; }

    [JsonPropertyName("total_code_acceptances")]
    public int TotalCodeAcceptances { get; set; }

    [JsonPropertyName("total_code_lines_suggested")]
    public int TotalCodeLinesSuggested { get; set; }

    [JsonPropertyName("total_code_lines_accepted")]
    public int TotalCodeLinesAccepted { get; set; }
}

public class IdeChat
{
    [JsonPropertyName("total_engaged_users")]
    public int TotalEngagedUsers { get; set; }

    [JsonPropertyName("editors")]
    public List<IdeChatEditor> Editors { get; set; } = new();
}

public class IdeChatEditor
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("total_engaged_users")]
    public int TotalEngagedUsers { get; set; }

    [JsonPropertyName("models")]
    public List<IdeChatModel> Models { get; set; } = new();
}

public class IdeChatModel
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("is_custom_model")]
    public bool IsCustomModel { get; set; }

    [JsonPropertyName("custom_model_training_date")]
    public string? CustomModelTrainingDate { get; set; }

    [JsonPropertyName("total_engaged_users")]
    public int TotalEngagedUsers { get; set; }

    [JsonPropertyName("total_chats")]
    public int TotalChats { get; set; }

    [JsonPropertyName("total_chat_insertion_events")]
    public int TotalChatInsertionEvents { get; set; }

    [JsonPropertyName("total_chat_copy_events")]
    public int TotalChatCopyEvents { get; set; }
}

public class DotcomChat
{
    [JsonPropertyName("total_engaged_users")]
    public int TotalEngagedUsers { get; set; }

    [JsonPropertyName("models")]
    public List<DotcomChatModel> Models { get; set; } = new();
}

public class DotcomChatModel
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("is_custom_model")]
    public bool IsCustomModel { get; set; }

    [JsonPropertyName("custom_model_training_date")]
    public string? CustomModelTrainingDate { get; set; }

    [JsonPropertyName("total_engaged_users")]
    public int TotalEngagedUsers { get; set; }

    [JsonPropertyName("total_chats")]
    public int TotalChats { get; set; }
}

public class DotcomPullRequests
{
    [JsonPropertyName("total_engaged_users")]
    public int TotalEngagedUsers { get; set; }

    [JsonPropertyName("repositories")]
    public List<DotcomPullRequestRepository> Repositories { get; set; } = new();
}

public class DotcomPullRequestRepository
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("total_engaged_users")]
    public int TotalEngagedUsers { get; set; }

    [JsonPropertyName("models")]
    public List<DotcomPullRequestModel> Models { get; set; } = new();
}

public class DotcomPullRequestModel
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("is_custom_model")]
    public bool IsCustomModel { get; set; }

    [JsonPropertyName("custom_model_training_date")]
    public string? CustomModelTrainingDate { get; set; }

    [JsonPropertyName("total_engaged_users")]
    public int TotalEngagedUsers { get; set; }

    [JsonPropertyName("total_pr_summaries_created")]
    public int TotalPrSummariesCreated { get; set; }
}
