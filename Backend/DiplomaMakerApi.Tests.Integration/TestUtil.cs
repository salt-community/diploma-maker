using System.Net.Http.Json;
using FluentAssertions;

namespace DiplomaMakerApi.Tests.Integration
{
    public static class TestUtil
    {
        public static async Task<TResponse> CreateAndPostAsync<TRequest, TResponse>(HttpClient client, TRequest request, string endpoint)
        {
            var response = await client.PostAsJsonAsync(endpoint, request);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<TResponse>() 
                ?? throw new InvalidOperationException($"Failed to deserialize {request} at {endpoint}");
        }
        public static bool CheckFileExists(string templateName, string extension, string testBlobDirectory, string subDirectory)
        {
            var filePath = GetFilePath(templateName, extension, testBlobDirectory, subDirectory);
            bool fileExists = File.Exists(filePath);
            fileExists.Should().BeTrue($"File {templateName}{extension} should exist at {filePath}");
            return fileExists;
        }
        public static void CheckFileDoesNotExist(string templateName, string extension, string testBlobDirectory, string subDirectory)
        {
            var filePath = GetFilePath(templateName, extension, testBlobDirectory, subDirectory);
            File.Exists(filePath).Should().BeFalse($"File {templateName}{extension} should not exist at {filePath}");
        }

        private static string GetFilePath(string templateName, string extension, string testBlobDirectory, string subDirectory)
        {
            var testProjectBinRoot = Directory.GetCurrentDirectory();
            return Path.Combine(testProjectBinRoot, testBlobDirectory, subDirectory, $"{templateName}{extension}");
        }
    }
}