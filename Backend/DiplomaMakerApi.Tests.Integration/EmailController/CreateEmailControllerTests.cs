using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.EmailController
{
    public class CreateEmailControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;

        public CreateEmailControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
        }

        [Fact]
        public async Task CreateEmailControllerTests_ReturnsUnathorized_WhenInvalidToken()
        {
            // Arrange
            _client.DefaultRequestHeaders.Authorization = null;
            // Act
            var response = await _client.PostAsJsonAsync($"api/Email/email-student/{Guid.NewGuid()}", new object{});

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}