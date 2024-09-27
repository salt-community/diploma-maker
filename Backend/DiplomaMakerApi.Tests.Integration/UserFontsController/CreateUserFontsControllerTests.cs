using System.Net;
using System.Text;
using Xunit;
using FluentAssertions;
using System.Net.Http.Json;
using DiplomaMakerApi.Dtos.UserFont;
using Microsoft.AspNetCore.Mvc;

namespace DiplomaMakerApi.Tests.Integration.UserFontsController
{
    public class CreateUserFontsControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly string _testBlobFolder;

        public CreateUserFontsControllerTests(DiplomaMakerApiFactory apiFactory)
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
                { new StreamContent(new MemoryStream(Encoding.UTF8.GetBytes("fontMockData"))), "UserFontRequests[0].File", "testFont.woff" },

                { new StringContent("testFont"), "UserFontRequests[1].Name" },
                { new StringContent("bold"), "UserFontRequests[1].FontType" },
                { new StreamContent(new MemoryStream(Encoding.UTF8.GetBytes("fontMockData"))), "UserFontRequests[1].File", "testFont.woff" },

                { new StringContent("testFont"), "UserFontRequests[2].Name" },
                { new StringContent("italic"), "UserFontRequests[2].FontType" },
                { new StreamContent(new MemoryStream(Encoding.UTF8.GetBytes("fontMockData"))), "UserFontRequests[2].File", "testFont.woff" }
            };
            // Act
            var response = await _client.PostAsync("api/UserFonts", userFontFormData);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Created);
            var fontResponse = await response.Content.ReadFromJsonAsync<List<UserFontResponseDto>>();
            fontResponse![0].Name.Should().Be("testFont");
            fontResponse![0].FontType.Should().Be(Models.FontType.regular);
            fontResponse![1].Name.Should().Be("testFont");
            fontResponse![1].FontType.Should().Be(Models.FontType.bold);
            fontResponse![2].Name.Should().Be("testFont");
            fontResponse![2].FontType.Should().Be(Models.FontType.italic);

            TestUtil.CheckFileExists(fontResponse![0].Name, ".woff", _testBlobFolder, $"UserFonts/{fontResponse![0].Name}");
            TestUtil.CheckFileExists($"{fontResponse![0].Name}-bold", ".woff", _testBlobFolder, $"UserFonts/{fontResponse![0].Name}");
            TestUtil.CheckFileExists($"{fontResponse![0].Name}-italic", ".woff", _testBlobFolder, $"UserFonts/{fontResponse![0].Name}");
        }

        [Fact]
        public async Task PostUserFonts_ReturnsValidationError_WhenDataIsInvalid()
        {
            // Arrange
            var badRequests = new List<(MultipartFormDataContent data, string[] expectedErrorMessages)>()
            {
                (new MultipartFormDataContent
                    {
                        { new StringContent(""), "UserFontRequests[0].Name" },
                        { new StringContent("regular"), "UserFontRequests[0].FontType" }
                    }, 
                    new[] { "The Name field is required." }),

                (new MultipartFormDataContent
                    {
                        { new StringContent("testFont"), "UserFontRequests[0].Name" }, 
                        { new StringContent("invalidType"), "UserFontRequests[0].FontType" },
                    }, 
                    new[] { "The value 'invalidType' is not valid for FontType." }),

                (new MultipartFormDataContent
                    {
                        { new StringContent("testFont"), "UserFontRequests[0].Name" },
                    },
                    new[] { "The File field is required." })
            };

            foreach (var (data, expectedErrorMessages) in badRequests)
            {
                // Act
                var response = await _client.PostAsync("api/UserFonts", data);

                // Assert
                response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
                var error = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
                error!.Status.Should().Be(400);
                error.Title.Should().Be("One or more validation errors occurred.");

                var allErrorMessages = error.Errors.SelectMany(kvp => kvp.Value).ToArray();
                allErrorMessages.Should().Contain(message => expectedErrorMessages.Any(errorMessage => message.Contains(errorMessage)));
            }
        }
    }
}