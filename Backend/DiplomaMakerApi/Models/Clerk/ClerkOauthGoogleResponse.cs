namespace DiplomaMakerApi.Models.Clerk
{
    public class ClerkOauthGoogleResponse
    {
        public string? Object { get; set; }
        public string? ExternalAccountId { get; set; }
        public string? ProviderUserId { get; set; }
        public string? Token { get; set; }
        public string? Provider { get; set; }
        public Dictionary<string, object>? PublicMetadata { get; set; }
        public string? Label { get; set; }
        public List<string>? Scopes { get; set; }
    }
}