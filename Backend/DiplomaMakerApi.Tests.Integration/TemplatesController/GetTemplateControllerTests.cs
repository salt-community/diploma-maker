using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bogus;
using DiplomaMakerApi.Dtos;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.TemplatesController
{
    public class GetTemplateControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly Faker<TemplatePostRequestDto> _templateRequestGenerator =
            new Faker<TemplatePostRequestDto>()
                .RuleFor(x => x.TemplateName, faker => Path.GetFileNameWithoutExtension(faker.System.FileName()));

        public GetTemplateControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "test-token");
        }

        [Fact]
        public async void GetTemplateById_ReturnsTemplate_WhenIdExists()
        {
            // Arrange
            var setupTemplate = _templateRequestGenerator.Generate();
            var setupTemplateResponse = await TestUtil.CreateAndPostAsync<TemplatePostRequestDto, TemplateResponseDto>(
                _client, setupTemplate, "api/Templates"
            );

            // Act
            var response = await _client.GetAsync($"api/Templates/{setupTemplateResponse.Id}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var templateResponse = await response.Content.ReadFromJsonAsync<TemplateResponseDto>();
            templateResponse.Should().NotBeNull();
            templateResponse.TemplateName.Should().Be(setupTemplateResponse.TemplateName);
        }

        [Fact]
        public async Task GetTemplateById_ReturnsNotFound_WhenTemplateDoesNotExist()
        {
            // Act
            var response = await _client.GetAsync($"api/Templates/{21491053}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task GetTemplateById_ReturnsUnathorized_WhenInvalidToken()
        {
            // Arrange
            var setupTemplate = _templateRequestGenerator.Generate();
            var setupTemplateResponse = await TestUtil.CreateAndPostAsync<TemplatePostRequestDto, TemplateResponseDto>(
                _client, setupTemplate, "api/Templates"
            );
            _client.DefaultRequestHeaders.Authorization = null;

            // Act
            var response = await _client.GetAsync($"api/Templates/{setupTemplateResponse.Id}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}