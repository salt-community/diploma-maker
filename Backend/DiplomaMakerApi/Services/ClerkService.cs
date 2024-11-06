using System.Text.Json;
using System.Net.Http.Headers;

using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Services;

public class ClerkService(HttpClient _httpClient)
{
    public async Task<string> GetGoogleOAuthTokenAsync(string userId, string key)
    {
        //TODO: Put url in app settings
        var url = $"https://api.clerk.com/v1/users/{userId}/oauth_access_tokens/oauth_google";

        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", key);

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
            throw new Exception("Failed to retrieve Google OAuth token from Clerk.");

        var responseData = await response.Content.ReadAsStringAsync();
        var serializedData = JsonSerializer.Deserialize<List<ClerkOauthGoogleResponse>>(responseData);

        return serializedData![0].Token
            ?? throw new Exception("Token not found in response.");
    }
}