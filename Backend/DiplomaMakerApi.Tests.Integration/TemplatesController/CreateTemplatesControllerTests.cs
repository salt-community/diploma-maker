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

            // Act
            var response = await _client.PostAsJsonAsync("api/Templates", templateRequest);

            // Assert
            // var templateResponse = await response.Content.ReadFromJsonAsync<TemplateResponseDto>();
            response.StatusCode.Should().Be(HttpStatusCode.Created);
        }
    }
}