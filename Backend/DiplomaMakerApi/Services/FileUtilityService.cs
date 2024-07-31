using System.IO.Compression;

namespace DiplomaMakerApi.Services
{
    public class FileUtilityService
    {
        public byte[] CreateZipFromFiles(IEnumerable<string> filePaths, string zipFileName)
        {
            using (var memoryStream = new MemoryStream())
            {
                using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
                {
                    foreach (var filePath in filePaths)
                    {
                        var entry = archive.CreateEntry(Path.GetFileName(filePath));
                        using (var entryStream = entry.Open())
                        using (var fileStream = new FileStream(filePath, FileMode.Open))
                        {
                            fileStream.CopyTo(entryStream);
                        }
                    }
                }

                return memoryStream.ToArray();
            }
        }

        public byte[] CreateZipFromStreams(IEnumerable<(Stream Stream, string FileName)> files)
        {
            using (var memoryStream = new MemoryStream())
            {
                using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
                {
                    foreach (var file in files)
                    {
                        var entry = archive.CreateEntry(file.FileName);
                        using (var entryStream = entry.Open())
                        {
                            file.Stream.CopyTo(entryStream);
                        }
                    }
                }

                return memoryStream.ToArray();
            }
        }
    }
}