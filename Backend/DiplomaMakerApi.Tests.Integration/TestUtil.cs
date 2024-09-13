using FluentAssertions;

namespace DiplomaMakerApi.Tests.Integration
{
    public static class TestUtil
    {
        public static void CheckFileExists(string templateName, string extension, string subDirectory)
        {
            var filePath = GetFilePath(templateName, extension, subDirectory);
            File.Exists(filePath).Should().BeTrue($"File {templateName}.{extension} should exist at {filePath}");
        }

        public static void CheckFileDoesNotExist(string templateName, string extension, string subDirectory)
        {
            var filePath = GetFilePath(templateName, extension, subDirectory);
            File.Exists(filePath).Should().BeFalse($"File {templateName}.{extension} should not exist at {filePath}");
        }
        public static void CheckNumberOfFilesInFolder(int expectedCount, string subDirectory)
        {
            var folderPath = GetFolderPath(subDirectory);
            var actualFileCount = Directory.Exists(folderPath) 
                ? Directory.GetFiles(folderPath).Length 
                : 0;

            actualFileCount.Should().Be(expectedCount, $"There should be {expectedCount} file(s) in {folderPath}, but found {actualFileCount}.");
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