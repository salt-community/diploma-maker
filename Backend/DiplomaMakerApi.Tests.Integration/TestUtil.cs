using FluentAssertions;

namespace DiplomaMakerApi.Tests.Integration
{
    public static class TestUtil
    {
        public static void CheckFileExists(string templateName, string extension, string subDirectory)
        {
            var testProjectBinRoot = Directory.GetCurrentDirectory();
            var expectedFilePath = Path.Combine(testProjectBinRoot, "Blob", subDirectory, $"{templateName}{extension}");

            File.Exists(expectedFilePath).Should().BeTrue($"File {templateName}.{extension} should exist at {expectedFilePath}");
        }
    }
}