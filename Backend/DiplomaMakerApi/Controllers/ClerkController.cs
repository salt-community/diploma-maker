using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Clerk.Net.Client;
using System.Security.Claims;
using System.Net.Http.Headers;
using System.Text.Json;
using DiplomaMakerApi.Models.Clerk;

namespace DiplomaMakerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ClerkController : ControllerBase
    {
        private readonly ClerkApiClient _clerkClient;
        private readonly HttpClient _httpClient;

        public ClerkController(ClerkApiClient clerkClient, HttpClient httpClient)
        {
            _clerkClient = clerkClient;
            _httpClient = httpClient;
        }

        [HttpGet("google-email-token")]
        public async Task<IActionResult> GetGoogleOAuthToken()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User ID not found in the token.");
                }

                var bearerToken = Request.Headers["Authorization"].ToString();

                var url = $"https://api.clerk.com/v1/users/{userId}/oauth_access_tokens/oauth_google";
                
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "sk_test_RnPycpXxQ91IdqPmx8BQwmVG1haGoUGpdXxa1f3xUt");

                var response = await _httpClient.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, "Failed to retrieve Google OAuth token from Clerk.");
                }
                var responseData = await response.Content.ReadAsStringAsync();
                var serializedData = JsonSerializer.Deserialize<List<ClerkOauthGoogleResponse>>(responseData);
                return Ok(new {GoogleToken = serializedData[0]!.Token});
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}