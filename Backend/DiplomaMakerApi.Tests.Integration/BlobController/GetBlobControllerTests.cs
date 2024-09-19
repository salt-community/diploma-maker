using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using DiplomaMakerApi.Dtos.UserFont;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.BlobController
{
    public class GetBlobControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        public GetBlobControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
        }

        [Fact]
        public async Task GetFonts_ReturnsCorrectFont_WhenFontExists()
        {
            // Arrange
            var fileMockData = Encoding.UTF8.GetBytes("fontMockData");
            var setupUserFontsFormData = new MultipartFormDataContent
            {
                { new StringContent("testFont"), "UserFontRequests[0].Name" },
                { new StringContent("regular"), "UserFontRequests[0].FontType" },
                { new StreamContent(new MemoryStream(fileMockData)), "UserFontRequests[0].File", "testFont.woff" },

                { new StringContent("testFont"), "UserFontRequests[1].Name" },
                { new StringContent("bold"), "UserFontRequests[1].FontType" },
                { new StreamContent(new MemoryStream(fileMockData)), "UserFontRequests[1].File", "testFont.woff" },

                { new StringContent("testFont"), "UserFontRequests[2].Name" },
                { new StringContent("italic"), "UserFontRequests[2].FontType" },
                { new StreamContent(new MemoryStream(fileMockData)), "UserFontRequests[2].File", "testFont.woff" }
            };
            var setupResponse = await _client.PostAsync("api/UserFonts", setupUserFontsFormData);
            var setupUserFontsResponse = await setupResponse.Content.ReadFromJsonAsync<List<UserFontResponseDto>>();

            foreach (var fontType in new[] { "regular", "bold", "italic" })
            {
                // Act
                var response = await _client.GetAsync($"api/Blob/UserFonts/{setupUserFontsResponse![0].Name}?fontType={fontType}");

                // Assert
                response.StatusCode.Should().Be(HttpStatusCode.OK);
                response.Content.Headers.ContentType!.MediaType.Should().Be("font/woff");

                var fontContent = await response.Content.ReadAsByteArrayAsync();
                fontContent.Should().BeEquivalentTo(fileMockData);
            }
        }

        [Fact]
        public async Task GetFontsHeadRequest_ReturnsCorrectHeader_WhenFontExists()
        {
            // Arrange
            var fileMockData = Encoding.UTF8.GetBytes("fontMockData");
            var setupUserFontsFormData = new MultipartFormDataContent
            {
                { new StringContent("testFont"), "UserFontRequests[0].Name" },
                { new StringContent("regular"), "UserFontRequests[0].FontType" },
                { new StreamContent(new MemoryStream(fileMockData)), "UserFontRequests[0].File", "testFont.woff" },

                { new StringContent("testFont"), "UserFontRequests[1].Name" },
                { new StringContent("bold"), "UserFontRequests[1].FontType" },
                { new StreamContent(new MemoryStream(fileMockData)), "UserFontRequests[1].File", "testFont.woff" },

                { new StringContent("testFont"), "UserFontRequests[2].Name" },
                { new StringContent("italic"), "UserFontRequests[2].FontType" },
                { new StreamContent(new MemoryStream(fileMockData)), "UserFontRequests[2].File", "testFont.woff" }
            };
            var setupResponse = await _client.PostAsync("api/UserFonts", setupUserFontsFormData);
            var setupUserFontsResponse = await setupResponse.Content.ReadFromJsonAsync<List<UserFontResponseDto>>();

            foreach (var fontType in new[] { "regular", "bold", "italic" })
            {
                // Act
                var response = await _client.SendAsync(new HttpRequestMessage(HttpMethod.Head, $"api/Blob/UserFonts/{setupUserFontsResponse![0].Name}?fontType={fontType}"));

                // Assert
                response.StatusCode.Should().Be(HttpStatusCode.OK);
                response.Content.Headers.ContentType!.MediaType.Should().Be("font/woff");
            }
        }
    }
}