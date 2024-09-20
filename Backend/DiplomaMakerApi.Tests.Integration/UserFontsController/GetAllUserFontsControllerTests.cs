using System.Net;
using System.Net.Http.Json;
using System.Text;
using DiplomaMakerApi.Dtos.UserFont;
using DiplomaMakerApi.Models;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.UserFontsController
{
    public class GetAllUserFontsControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;

        public GetAllUserFontsControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
        }

        [Fact(Skip = "Skipping this test for now.")]
        public async Task GetUserFonts_ReturnsUserFonts_WhenUserFontExists()
        {
            // Arrange
            var setupUserFontFormData = new MultipartFormDataContent
            {
                { new StringContent("testFont"), "UserFontRequests[0].Name" },
                { new StringContent("bold"), "UserFontRequests[0].FontType" },
                { new StreamContent(new MemoryStream(Encoding.UTF8.GetBytes("fontMockData"))), "UserFontRequests[0].File", "testFont.woff" }
            };
            await _client.PostAsync("api/UserFonts", setupUserFontFormData);

            // Act
            var response = await _client.GetAsync("api/UserFonts");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var userFontResponse = await response.Content.ReadFromJsonAsync<List<UserFontResponseDto>>();
            userFontResponse![0].FileName.Should().Be("testFont-bold");
            userFontResponse![0].FontType.Should().Be(FontType.bold);
            userFontResponse![0].FileName.Should().Be("testFont-bold");
        }
    }
}