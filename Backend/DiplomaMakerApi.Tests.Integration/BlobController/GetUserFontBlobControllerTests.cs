using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using DiplomaMakerApi.Dtos.UserFont;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.BlobController
{
    public class GetUserFontBlobControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        public GetUserFontBlobControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
        }
        private MultipartFormDataContent GetSetupUserFontsFormData()
        {
            return new MultipartFormDataContent
            {
                { new StringContent("testFont"), "UserFontRequests[0].Name" },
                { new StringContent("regular"), "UserFontRequests[0].FontType" },
                { new StreamContent(new MemoryStream(TestData.GetFileMockData())), "UserFontRequests[0].File", "testFont-regular.woff" },

                { new StringContent("testFont"), "UserFontRequests[1].Name" },
                { new StringContent("bold"), "UserFontRequests[1].FontType" },
                { new StreamContent(new MemoryStream(TestData.GetFileMockData())), "UserFontRequests[1].File", "testFont-bold.woff" },

                { new StringContent("testFont"), "UserFontRequests[2].Name" },
                { new StringContent("italic"), "UserFontRequests[2].FontType" },
                { new StreamContent(new MemoryStream(TestData.GetFileMockData())), "UserFontRequests[2].File", "testFont-italic.woff" }
            };
        }

        [Fact]
        public async Task GetFonts_ReturnsCorrectFont_WhenFontExists()
        {
            // Arrange
            var setupUserFontsFormData = GetSetupUserFontsFormData();
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
                fontContent.Should().BeEquivalentTo(TestData.GetFileMockData());
            }
        }

        [Fact]
        public async Task GetFonts_ReturnsNotFound_WhenFontDoesNotExist()
        {
                // Act
                var response = await _client.GetAsync($"api/Blob/UserFonts/{Guid.NewGuid()}?fontType={0}");

                // Assert
                response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task GetFontsHeadRequest_ReturnsCorrectHeader_WhenFontExists()
        {
            // Arrange
            var setupUserFontsFormData = GetSetupUserFontsFormData();
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

        [Fact]
        public async Task GetFontsHeadRequest_ReturnsNotFound_WhenFontDoesNotExist()
        {
            // Act
            var response = await _client.SendAsync(new HttpRequestMessage(HttpMethod.Head, $"api/Blob/UserFonts/{Guid.NewGuid()}?fontType={0}"));

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}