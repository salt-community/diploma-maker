using System.Text.Json.Serialization;

namespace DiplomaMakerApi.Models;

public class ClerkOauthGoogleResponse
{
    [JsonPropertyName("object")]
    public string? Object { get; set; }

    [JsonPropertyName("external_account_id")]
    public string? ExternalAccountId { get; set; }

    [JsonPropertyName("provider_user_id")]
    public string? JsonPropertyNameProviderUserId { get; set; }

    [JsonPropertyName("token")]
    public string? Token { get; set; }

    [JsonPropertyName("provider")]
    public string? Provider { get; set; }

    [JsonPropertyName("public_metadata")]
    public Dictionary<string, object>? PublicMetadata { get; set; }

    [JsonPropertyName("label")]
    public string? Label { get; set; }

    [JsonPropertyName("scopes")]
    public List<string>? Scopes { get; set; }
}