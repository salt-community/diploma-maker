using System.Net.Http.Headers;
using System.Net.Http.Json;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Gmail.v1;
public class GoogleAuthService
{
    public async Task<string> GetGoogleOAuthTokenAsync()
    {
        GoogleCredential credential = await GoogleCredential.GetApplicationDefaultAsync();
        if (credential.IsCreateScopedRequired)
        {
            credential = credential.CreateScoped(new[]
            {
                GmailService.Scope.GmailSend,
                "https://www.googleapis.com/auth/userinfo.email",
                "https://www.googleapis.com/auth/userinfo.profile"
            });
        }
        var token = await credential.UnderlyingCredential.GetAccessTokenForRequestAsync();
        return token;
    }

    public async Task<string> GetGoogleEmailAsync()
    {
        GoogleCredential credential = await GoogleCredential.GetApplicationDefaultAsync();
        if (credential.IsCreateScopedRequired)
        {
            credential = credential.CreateScoped(new[]
            {
                GmailService.Scope.GmailSend,
                "https://www.googleapis.com/auth/userinfo.email",
                "https://www.googleapis.com/auth/userinfo.profile"
            });
        }
        var token = await credential.UnderlyingCredential.GetAccessTokenForRequestAsync();

        using (var httpClient = new HttpClient())
        {
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await httpClient.GetAsync("https://www.googleapis.com/oauth2/v2/userinfo");

            if (response.IsSuccessStatusCode)
            {
                var userInfo = await response.Content.ReadFromJsonAsync<GoogleUserInfo>();
                return userInfo!.Email;
            }

            throw new Exception("Unable to retrieve Google user info.");
        }
    }

    public class GoogleUserInfo
    {
        public required string Email { get; set; }
    }
}
