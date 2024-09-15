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
            var setupTemplates = new List<TemplateResponseDto>();
            for (int i = 0; i < 5; i++)
            {
                var setupTemplate = _templateRequestGenerator.Generate();
                var setupTemplateResponse = await TestUtil.CreateAndPostAsync<TemplatePostRequestDto, TemplateResponseDto>(
                    _client, setupTemplate, "api/Templates"
                );
                setupTemplates.Add(setupTemplateResponse);
            }
            
            // Act
            var response = await _client.GetAsync("api/Templates");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var templatesResponse = await response.Content.ReadFromJsonAsync<List<TemplateResponseDto>>();
            setupTemplates.All(tr => TestUtil.CheckFileExists(tr.Name, ".pdf", "DiplomaPdfs"));
            setupTemplates.All(tr => templatesResponse!.Any(r => r.Name == tr.Name)).Should().BeTrue();
        }
    }
}