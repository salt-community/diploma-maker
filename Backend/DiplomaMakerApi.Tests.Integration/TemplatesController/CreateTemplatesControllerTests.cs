using System.Net.Http.Headers;
using Bogus;
using DiplomaMakerApi.Models;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.TemplatesController
{
    public class CreateTemplatesControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly Faker<TemplatePostRequestDto> _templateGenerator =
            new Faker<TemplatePostRequestDto>()
                .RuleFor(x => x.templateName, faker => Path.GetFileNameWithoutExtension(faker.System.FileName()));
        public CreateTemplatesControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
        }

        [Fact]
        public void PostTemplate_ReturnsTemplate_WhenValidTemplateName()
        {
            // Arrange

            // Act

            // Assert
        }
    }
}