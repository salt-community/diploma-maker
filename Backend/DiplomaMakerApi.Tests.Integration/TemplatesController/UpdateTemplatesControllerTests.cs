using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bogus;
using DiplomaMakerApi.Models;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.TemplatesController
{
    public class UpdateTemplatesControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly Faker<TemplatePostRequestDto> _templateRequestGenerator =
            new Faker<TemplatePostRequestDto>()
                .RuleFor(x => x.templateName, faker => Path.GetFileNameWithoutExtension(faker.System.FileName()));

        public UpdateTemplatesControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "test-token");
        }
        
        [Fact]
        public async Task PutTemplate_UpdatesTemplate_WhenDataIsValid()
        {
            // Arrange
            var setupTemplate = _templateRequestGenerator.Generate();
            var setupTemplateResponse = await TestUtil.CreateAndPostAsync<TemplatePostRequestDto, TemplateResponseDto>(
                _client, setupTemplate, "api/Templates"
            );

            // Act
            var putTemplateRequest = TestData.getPutTemplateData();
            var response = await _client.PutAsJsonAsync($"api/Templates/{setupTemplateResponse.Id}", putTemplateRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var templateResponse = await response.Content.ReadFromJsonAsync<TemplateResponseDto>();
            templateResponse!.LinkStyling.Should().BeEquivalentTo(putTemplateRequest.LinkStyling, opt => opt.Excluding(ls => ls!.Id));
            templateResponse!.Footer.Should().BeEquivalentTo(putTemplateRequest.footer);
        }

        [Fact]
        public async Task PutTemplate_ReturnsUnathorized_WhenInvalidToken()
        {
            // Arrange
            var setupTemplate = _templateRequestGenerator.Generate();
            var setupTemplateResponse = await TestUtil.CreateAndPostAsync<TemplatePostRequestDto, TemplateResponseDto>(
                _client, setupTemplate, "api/Templates"
            );

            // Act
            _client.DefaultRequestHeaders.Authorization = null;
            var putTemplateRequest = TestData.getPutTemplateData();
            var response = await _client.PutAsJsonAsync($"api/Templates/{setupTemplateResponse.Id}", putTemplateRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}