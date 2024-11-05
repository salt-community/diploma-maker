using System.Net;
using System.Net.Http.Headers;
using Bogus;
using DiplomaMakerApi.Dtos;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.TemplatesController
{
    public class DeleteTemplateControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly string _testBlobFolder;
        private readonly Faker<TemplatePostRequestDto> _templateRequestGenerator =
            new Faker<TemplatePostRequestDto>()
                .RuleFor(x => x.templateName, faker => Path.GetFileNameWithoutExtension(faker.System.FileName()));
        public DeleteTemplateControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "test-token");
            _testBlobFolder = apiFactory.TestBlobFolder;
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
            TestUtil.CheckFileDoesNotExist(setupTemplate.templateName, ".pdf", _testBlobFolder, "DiplomaPdfs");
        }

        [Fact]
        public async Task DeleteTemplate_ReturnsNotFound_WhenTemplateDoesNotExist()
        {
            // Act
            var response = await _client.DeleteAsync($"api/Templates/{23109591}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task DeleteTemplate_ReturnsUnathorized_WhenInvalidToken()
        {
            // Arrange
            var setupTemplate = _templateRequestGenerator.Generate();
            var setupTemplateResponse = await TestUtil.CreateAndPostAsync<TemplatePostRequestDto, TemplateResponseDto>(
                _client, setupTemplate, "api/Templates"
            );
            _client.DefaultRequestHeaders.Authorization = null;

            // Act
            var response = await _client.DeleteAsync($"api/Templates/{setupTemplateResponse.Id}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}