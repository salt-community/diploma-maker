using System.Net.Http.Json;
using FluentAssertions;

namespace DiplomaMakerApi.Tests.Integration
{
    public static class TestUtil
    {
        public static bool CheckFileExists(string templateName, string extension, string subDirectory)
        {
            var filePath = GetFilePath(templateName, extension, subDirectory);
            bool fileExists = File.Exists(filePath);
            fileExists.Should().BeTrue($"File {templateName}.{extension} should exist at {filePath}");
            return fileExists;
        }

        public static void CheckFileDoesNotExist(string templateName, string extension, string subDirectory)
        {
            var filePath = GetFilePath(templateName, extension, subDirectory);
            File.Exists(filePath).Should().BeFalse($"File {templateName}.{extension} should not exist at {filePath}");
        }

        private static string GetFilePath(string templateName, string extension, string subDirectory)
        {
            var testProjectBinRoot = Directory.GetCurrentDirectory();
            return Path.Combine(testProjectBinRoot, "Blob", subDirectory, $"{templateName}{extension}");
        }

        private static string GetFolderPath(string subDirectory)
        {
            var testProjectBinRoot = Directory.GetCurrentDirectory();
            return Path.Combine(testProjectBinRoot, "Blob", subDirectory);
        }
    }
}