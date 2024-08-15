using System.IO.Compression;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;

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

        public async Task<IFormFile> ConvertPngToWebP(byte[] pngBytes, string fileName, bool lowQuality = false)
        {
            if (pngBytes == null || pngBytes.Length == 0)
            {
                throw new ArgumentException("Invalid image data. Must be a non-empty PNG byte array.");
            }

            using (var inStream = new MemoryStream(pngBytes))
            {
                var myImage = await Image.LoadAsync(inStream);

                using (var outStream = new MemoryStream())
                {
                    if (lowQuality)
                    {
                        myImage.Mutate(x => x.Resize(new ResizeOptions
                        {
                            Size = new Size(92, 129),
                            Mode = ResizeMode.Max
                        }));

                        await myImage.SaveAsync(outStream, new WebpEncoder()
                        {
                            FileFormat = WebpFileFormatType.Lossy,
                            Quality = 0,
                        });
                    }
                    else
                    {
                        await myImage.SaveAsync(outStream, new WebpEncoder()
                        {
                            FileFormat = WebpFileFormatType.Lossy,
                        });
                    }

                    var webpBytes = outStream.ToArray();
                    var webpFileName = Path.ChangeExtension(fileName, ".webp");

                    return ConvertByteArrayToIFormFile(webpBytes, webpFileName, "image/webp");
                }
            }
        }
        public IFormFile ConvertByteArrayToIFormFile(byte[] fileBytes, string fileName, string contentType)
        {
            if (fileBytes == null || fileBytes.Length == 0)
            {
                throw new ArgumentException("File data cannot be null or empty.");
            }

            var stream = new MemoryStream(fileBytes);
            return new FormFile(stream, 0, stream.Length, "file", fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = contentType
            };
        }

        public Task<string> GetRelativePathAsync(string fullFilePath, string directoryName)
        {
            var startIndex = fullFilePath.IndexOf(directoryName);

            if (startIndex == -1)
            {
                throw new ArgumentException("Directory name not found in the path.");
            }

            var relativePath = fullFilePath.Substring(startIndex);
            var normalizedPath = relativePath.Replace('\\', '/');

            return Task.FromResult(normalizedPath);
        }

        public async Task<byte[]> ConvertPdfToPng(byte[] pdfBytes, string fileName)
        {
            var tempPdfPath = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.pdf");
            await File.WriteAllBytesAsync(tempPdfPath, pdfBytes);

            var pngFilePath = Path.Combine(Path.GetTempPath(), $"{fileName}.png");
            PDFtoImage.Conversion.SavePng(pngFilePath, tempPdfPath);

            var pngBytes = await File.ReadAllBytesAsync(pngFilePath);

            File.Delete(tempPdfPath);
            File.Delete(pngFilePath);

            return pngBytes;
        }

    }
}