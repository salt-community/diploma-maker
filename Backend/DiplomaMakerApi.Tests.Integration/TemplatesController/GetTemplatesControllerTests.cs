using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bogus;
using DiplomaMakerApi.Models;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.TemplatesController
{
    public class GetTemplatesControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly Faker<TemplatePostRequestDto> _templateRequestGenerator =
            new Faker<TemplatePostRequestDto>()
                .RuleFor(x => x.templateName, faker => Path.GetFileNameWithoutExtension(faker.System.FileName()));

        public GetTemplatesControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "test-token");
        }

        [Fact]
        public async void GetTemplateById_ReturnsTemplate_WhenIdExists()
        {
            // Arrange
            var template = _templateRequestGenerator.Generate();
            await _client.PostAsJsonAsync("api/Templates", template);

            // Act
            var response = await _client.GetAsync($"api/Templates/{2}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var templateResponse = await response.Content.ReadFromJsonAsync<TemplateResponseDto>();
            templateResponse.Should().NotBeNull();
            templateResponse.BasePdf.Should().Be($"Blob/{template.templateName}.pdf");
        }
    }
}