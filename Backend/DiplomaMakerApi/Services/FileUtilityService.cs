using System.IO.Compression;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;
using Syncfusion.PdfToImageConverter;
using Microsoft.Extensions.Logging;
using SixLabors.ImageSharp;
using System.Drawing;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Formats.Png;
using System.Text.RegularExpressions;

namespace DiplomaMakerApi.Services
{
    public class FileUtilityService
    {
        private readonly ILogger<FileUtilityService> _logger;

        public FileUtilityService(ILogger<FileUtilityService> logger)
        {
            _logger = logger;
        }

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

        public async Task<IFormFile> ConvertPngToWebP(IFormFile formFile, string fileName, bool lowQuality = false)
        {
            if (formFile == null || !formFile.ContentType.Contains("image/png"))
            {
                throw new ArgumentException("Invalid file format. Must be .png");
            }

            using var inStream = new MemoryStream();
            await formFile.CopyToAsync(inStream);
            inStream.Position = 0;

            using var myImage = await SixLabors.ImageSharp.Image.LoadAsync(inStream);

            using var outStream = new MemoryStream();

            if(lowQuality)
            {
                myImage.Mutate(x => x.Resize(new ResizeOptions
                {
                    Size = new SixLabors.ImageSharp.Size(92, 129),
                    Mode = ResizeMode.Max
                }));

                await myImage.SaveAsync(outStream, new WebpEncoder(){
                    FileFormat = WebpFileFormatType.Lossy,
                    Quality = 0,
                });
            }
            else
            {
                await myImage.SaveAsync(outStream, new WebpEncoder(){
                    FileFormat = WebpFileFormatType.Lossy,
                });
            }

            outStream.Position = 0;

            var webpFileName = Path.ChangeExtension(fileName, ".webp");
           
            var webpStreamCopy = new MemoryStream(outStream.ToArray());  // To fix "Cannot access a closed Stream." error

            var webpFormFile = new FormFile(webpStreamCopy, 0, webpStreamCopy.Length, "file", webpFileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/webp"
            };

            return webpFormFile;
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

        public async Task<IFormFile> ConvertPdfToPng(string base64String, string fileName)
        {
            _logger.LogInformation("Starting PDF to PNG conversion process.");

            byte[] pdfBytes = Convert.FromBase64String(base64String);
            _logger.LogInformation("Converted base64 string to byte array. Length: {Length}", pdfBytes.Length);

            using (MemoryStream pdfStream = new MemoryStream(pdfBytes))
            {
                _logger.LogInformation("Created MemoryStream for PDF. Stream length: {Length}", pdfStream.Length);

                PdfToImageConverter imageConverter = new PdfToImageConverter();

                imageConverter.Load(pdfStream);
                _logger.LogInformation("Loaded PDF into PdfToImageConverter.");

                using (Stream imageStream = imageConverter.Convert(0, false, false))
                {
                    _logger.LogInformation("Converted PDF to image stream. Stream length: {Length}", imageStream.Length);
                    imageStream.Position = 0;

                    using (MemoryStream pngStream = new MemoryStream())
                    {
                        using (Image<Rgba32> image = await SixLabors.ImageSharp.Image.LoadAsync<Rgba32>(imageStream))
                        {
                            _logger.LogInformation("Loaded image from stream.");
                            await image.SaveAsync(pngStream, new PngEncoder());
                        }

                        _logger.LogInformation("Saved image as PNG to memory stream. Stream length: {Length}", pngStream.Length);
                        pngStream.Position = 0;

                        var pngStreamCopy = new MemoryStream(pngStream.ToArray());

                        IFormFile formFile = new FormFile(pngStreamCopy, 0, pngStreamCopy.Length, "image", fileName)
                        {
                            Headers = new HeaderDictionary(),
                            ContentType = "image/png"
                        };

                        _logger.LogInformation("Created IFormFile object with name {FileName}.", fileName);

                        return formFile;
                    }
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

        public bool IsValidBase64Pdf(string base64String)
        {
            if (!IsBase64String(base64String))
            {
                return false;
            }
            var pdfBytes = Convert.FromBase64String(base64String);
            return pdfBytes.Length > 4 && pdfBytes[0] == 0x25 && pdfBytes[1] == 0x50 && pdfBytes[2] == 0x44 && pdfBytes[3] == 0x46;
        }

        private bool IsBase64String(string base64String)
        {
            return (base64String.Length % 4 == 0) && Regex.IsMatch(base64String, @"^[a-zA-Z0-9\+/]*={0,2}$");
        }
    }
}