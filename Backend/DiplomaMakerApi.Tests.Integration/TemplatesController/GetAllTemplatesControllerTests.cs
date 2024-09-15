using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bogus;
using DiplomaMakerApi.Models;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.TemplatesController
{
    public class GetAllTemplatesControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly Faker<TemplatePostRequestDto> _templateRequestGenerator =
            new Faker<TemplatePostRequestDto>()
                .RuleFor(x => x.templateName, faker => Path.GetFileNameWithoutExtension(faker.System.FileName()));
        public GetAllTemplatesControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "test-token");
        }

        [Fact]
        public async void GetTemplates_ReturnsAllTemplates_WhenAuthorized()
        {
            // Arrange
            var templateRequests = new List<TemplatePostRequestDto>();
            for (int i = 0; i < 5; i++)
            {
                var templateRequest = _templateRequestGenerator.Generate();
                templateRequests.Add(templateRequest);
                await _client.PostAsJsonAsync("api/Templates", templateRequest);
            }
            
            // Act
            var response = await _client.GetAsync("api/Templates");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var templatesResponse = await response.Content.ReadFromJsonAsync<List<TemplateResponseDto>>();
            templateRequests.All(tr => TestUtil.CheckFileExists(tr.templateName, ".pdf", "DiplomaPdfs"));
            templateRequests.All(tr => templatesResponse!.Any(r => r.Name == tr.templateName)).Should().BeTrue();
        }
    }
}