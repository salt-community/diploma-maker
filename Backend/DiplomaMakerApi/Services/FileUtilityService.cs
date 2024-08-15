using System.IO.Compression;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;
using Aspose.Pdf;
using Aspose.Pdf.Devices;

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
                    Size = new Size(92, 129),
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
            if (string.IsNullOrWhiteSpace(base64String))
            {
                throw new ArgumentException("Invalid file. The file cannot be null or empty.");
            }

            const string base64Prefix = "data:application/pdf;base64,";
            if (base64String.StartsWith(base64Prefix))
            {
                base64String = base64String.Substring(base64Prefix.Length);
            }

            try
            {
                byte[] pdfBytes = Convert.FromBase64String(base64String);

                var tempPdfPath = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.pdf");
                await File.WriteAllBytesAsync(tempPdfPath, pdfBytes);

                var document = new Aspose.Pdf.Document(tempPdfPath);

                var pngFilePath = Path.Combine(Path.GetTempPath(), $"{fileName}.png");
                using (FileStream imageStream = new FileStream(pngFilePath, FileMode.Create))
                {
                    var resolution = new Resolution(300);
                    var pngDevice = new PngDevice(resolution);
                    pngDevice.Process(document.Pages[1], imageStream);
                    imageStream.Close();
                }

                var pngBytes = await File.ReadAllBytesAsync(pngFilePath);

                File.Delete(tempPdfPath);
                File.Delete(pngFilePath);

                var pngStream = new MemoryStream(pngBytes);
                var formFilePng = new FormFile(pngStream, 0, pngStream.Length, "file", $"{fileName}.png")
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "image/png"
                };

                return formFilePng;
            }
            catch (FormatException ex)
            {
                throw new ArgumentException("The input is not a valid Base64 string.", ex);
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

    }
}