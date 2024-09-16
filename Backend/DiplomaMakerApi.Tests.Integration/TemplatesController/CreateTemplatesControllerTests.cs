using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bogus;
using DiplomaMakerApi.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.TemplatesController
{
    public class CreateTemplatesControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly string _testBlobFolder;
        private readonly Faker<TemplatePostRequestDto> _templateRequestGenerator =
            new Faker<TemplatePostRequestDto>()
                .RuleFor(x => x.templateName, faker => Path.GetFileNameWithoutExtension(faker.System.FileName()));
        public CreateTemplatesControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
            _testBlobFolder = apiFactory.TestBlobFolder;
        }
        
        [Fact]
        public async void PostTemplate_ReturnsTemplate_WhenValidTemplateName()
        {
            // Arrange
            var templateRequest = _templateRequestGenerator.Generate();

            // Act
            var response = await _client.PostAsJsonAsync("api/Templates", templateRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Created);
            var templateResponse = await response.Content.ReadFromJsonAsync<TemplateResponseDto>();
            templateResponse!.Name.Should().Be(templateRequest.templateName);
            templateResponse!.BasePdf.Should().Be($"{_testBlobFolder}/{templateRequest.templateName}.pdf");
            TestUtil.CheckFileExists(templateRequest.templateName, ".pdf", _testBlobFolder, "DiplomaPdfs");  
        }

        [Fact]
        public async Task PostTemplate_ReturnsValidationError_WhenDataIsInvalid()
        {
            // Arrange
            var badRequests = new List<(object data, string[] expectedErrorMessages)>()
            {
                (new { templateName = "" }, new[] { 
                    "The templateName field is required and cannot be empty.", 
                }),
                (new { randomField = "jfs2025"}, new[] {
                    "The templateRequestDto field is required."
                }),
                (new { templateName = 12345}, new[] {
                    "The templateRequestDto field is required."
                }),
            };

            foreach (var (data, expectedErrorMessages) in badRequests)
            {
                // Act
                var response = await _client.PostAsJsonAsync("api/templates", data);

                // Assert
                response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
                var error = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
                error!.Status.Should().Be(400);
                error.Title.Should().Be("One or more validation errors occurred.");

                var allErrorMessages = error.Errors.SelectMany(kvp => kvp.Value).ToArray();
                allErrorMessages.Should().Contain(message => expectedErrorMessages.Any(expected => message.Contains(expected)));
            }
        }

        [Fact]
        public async Task PostTemplate_ReturnsUnathorized_WhenInvalidToken()
        {
            // Arrange
            var templateRequest = _templateRequestGenerator.Generate();
            _client.DefaultRequestHeaders.Authorization = null;

            // Act
            var response = await _client.PostAsJsonAsync("api/Templates", templateRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}