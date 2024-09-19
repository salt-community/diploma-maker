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
}
