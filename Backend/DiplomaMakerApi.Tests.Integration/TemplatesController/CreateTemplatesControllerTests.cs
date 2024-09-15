using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bogus;
using DiplomaMakerApi.Models;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.TemplatesController
{
    public class CreateTemplatesControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly Faker<TemplatePostRequestDto> _templateRequestGenerator =
            new Faker<TemplatePostRequestDto>()
                .RuleFor(x => x.templateName, faker => Path.GetFileNameWithoutExtension(faker.System.FileName()));
        public CreateTemplatesControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
        }

        [Fact]
        public async void PostTemplate_ReturnsTemplate_WhenValidTemplateName()
        {
            // Arrange
            var templateRequest = _templateRequestGenerator.Generate();
            var newTemplate = new DiplomaTemplate()
            {
                Id = 2,
                Name = templateRequest.templateName,
            };

            // Act
            var response = await _client.PostAsJsonAsync("api/Templates", templateRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Created);
            var templateResponse = await response.Content.ReadFromJsonAsync<TemplateResponseDto>();
            templateResponse!.BasePdf.Should().Be($"Blob/{templateRequest.templateName}.pdf");
            TestUtil.CheckFileExists(templateRequest.templateName, ".pdf", "DiplomaPdfs");
            templateResponse.Should().BeEquivalentTo(newTemplate, options => options
                .Excluding(t => t.PdfBackgroundLastUpdated)
                .Excluding(t => t.LastUpdated));
        }

        [Fact]
        public async Task PostTemplate_ReturnsUnathorized_WhenInvalidToken()
        {
            // Arrange
            var templateRequest = _templateRequestGenerator.Generate();
            var newTemplate = new DiplomaTemplate()
            {
                Id = 2,
                Name = templateRequest.templateName,
            };
            _client.DefaultRequestHeaders.Authorization = null;

            // Act
            var response = await _client.PostAsJsonAsync("api/Templates", templateRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}