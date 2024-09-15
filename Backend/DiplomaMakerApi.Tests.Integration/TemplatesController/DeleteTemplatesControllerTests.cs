using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bogus;
using DiplomaMakerApi.Models;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.TemplatesController
{
    public class DeleteTemplatesControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly Faker<TemplatePostRequestDto> _templateRequestGenerator =
            new Faker<TemplatePostRequestDto>()
                .RuleFor(x => x.templateName, faker => Path.GetFileNameWithoutExtension(faker.System.FileName()));
        public DeleteTemplatesControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "test-token");
        }

        [Fact]
        public async void DeleteTemplate_ReturnsNoContent_WhenValidRequest()
        {
            // Arrange
            var setupTemplate = _templateRequestGenerator.Generate();
            var setupTemplateResponse = await TestUtil.CreateAndPostAsync<TemplatePostRequestDto, TemplateResponseDto>(
                _client, setupTemplate, "api/Templates"
            );
            // Act
            var response = await _client.DeleteAsync($"api/Templates/{setupTemplateResponse.Id}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);
            TestUtil.CheckFileDoesNotExist(setupTemplate.templateName, ".pdf", "DiplomaPdfs");
        }
    }
}