using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiplomaMakerApi.Services;

public class ClerkService
{
    // public async Task<string> GetGoogleOAuthTokenAsync(string userId, string key)
    // {
    //     var url = $"https://api.clerk.com/v1/users/{userId}/oauth_access_tokens/oauth_google";

    //     _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", key);

    //     var response = await _httpClient.GetAsync(url);

    //     if (!response.IsSuccessStatusCode)
    //     {
    //         throw new Exception("Failed to retrieve Google OAuth token from Clerk.");
    //     }

    //     var responseData = await response.Content.ReadAsStringAsync();
    //     var serializedData = JsonSerializer.Deserialize<List<ClerkOauthGoogleResponse>>(responseData);

    //     return serializedData![0].Token ?? throw new Exception("Token not found in response.");
    // }
}