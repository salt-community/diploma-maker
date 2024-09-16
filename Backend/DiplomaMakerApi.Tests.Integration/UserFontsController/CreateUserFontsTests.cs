using System.Net;
using System.Text;
using Xunit;
using FluentAssertions;
using System.Net.Http.Json;
using DiplomaMakerApi.Dtos.UserFont;

namespace DiplomaMakerApi.Tests.Integration.UserFontsController
{
    public class CreateUserFontsTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly string _testBlobFolder;

        public CreateUserFontsTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _testBlobFolder = apiFactory.TestBlobFolder;
        }

        [Fact]
        public async Task PostUserFonts_ReturnsUserFont_WhenValidFontRequest()
        {
            // Arrange
            var userFontFormData = new MultipartFormDataContent
            {
                { new StringContent("testFont"), "UserFontRequests[0].Name" },
                { new StringContent("regular"), "UserFontRequests[0].FontType" },
                { new StreamContent(new MemoryStream(Encoding.UTF8.GetBytes("fontMockData"))), "UserFontRequests[0].File", "testFont.woff" }
            };
            // Act
            var response = await _client.PostAsync("/api/UserFonts", userFontFormData);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Created);
            var fontResponse = await response.Content.ReadFromJsonAsync<List<UserFontResponseDto>>();
            fontResponse![0].Name.Should().Be("testFont");
            fontResponse![0].FontType.Should().Be(Models.FontType.regular);
            TestUtil.CheckFileExists(fontResponse![0].Name, ".woff", _testBlobFolder, $"UserFonts/{fontResponse![0].Name}");
        }
    }
}