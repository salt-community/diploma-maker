using Google.Cloud.Storage.V1;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DiplomaMakerApi.Services
{
    public class GoogleCloudStorageService
    {
        private readonly string _bucketName;
        private readonly DiplomaMakingContext _context;
        private readonly StorageClient _storageClient;
        private readonly FileUtilityService _fileUtilityService;
        private readonly IWebHostEnvironment _env;
        private readonly string _basePath;

        public GoogleCloudStorageService(DiplomaMakingContext context, IConfiguration configuration, FileUtilityService fileUtilityService, IWebHostEnvironment env)
        {
            _storageClient = StorageClient.Create();
            _context = context;
            _env = env;
            _fileUtilityService = fileUtilityService;
            _bucketName = _env.IsDevelopment() || _env.IsEnvironment("Test")
                ? configuration["GoogleCloud:BucketName"] ?? throw new ArgumentNullException("GoogleCloud:BucketName configuration is missing")
                : Environment.GetEnvironmentVariable("BucketName") ?? throw new ArgumentNullException("BucketName environment variable is missing");
            _basePath = configuration["Blob:BlobStorageFolder"] ?? "Blob";

            if (!Directory.Exists(_basePath))
            {
                Directory.CreateDirectory(_basePath);
            }
        }

        public async virtual Task<string?> GetFilePath(string templateName, string subDirectory = "DiplomaPdfs")
        {
            var objectName = templateName.Equals("Default.pdf", StringComparison.OrdinalIgnoreCase)
                ? $"{_basePath}/{subDirectory}/{templateName}"
                : $"{_basePath}/{subDirectory}/{templateName}";

            try
            {
                var fileObject = await _storageClient.GetObjectAsync(_bucketName, objectName);
                return fileObject != null ? objectName : null;
            }
            catch (Google.GoogleApiException ex) when (ex.Error.Code == 404)
            {
                var templateNameNoExtension = Path.GetFileNameWithoutExtension(templateName);
                var templateExists = await _context.DiplomaTemplates.FirstOrDefaultAsync(t => t.Name == templateNameNoExtension);

                if (templateExists != null)
                {
                    await InitFileFromNewTemplate(templateNameNoExtension);
                    return $"{_basePath}/{subDirectory}/{templateName}";
                }
                return null;
            }
        }

        public async virtual Task<(byte[] FileBytes, string ContentType)> GetFileFromFilePath(string templateName, string subDirectory = "DiplomaPdfs")
        {
            var filePath = await GetFilePath(templateName, subDirectory);

            if (filePath == null)
            {
                throw new FileNotFoundException("File not found in storage.");
            }

            using (var memoryStream = new MemoryStream())
            {
                await _storageClient.DownloadObjectAsync(_bucketName, filePath, memoryStream);
                return (memoryStream.ToArray(), "application/pdf");
            }
        }

        public async virtual Task<string> SaveFile(IFormFile file, string templateName, string subDirectory = "DiplomaPdfs")
        {
            var fileExtension = Path.GetExtension(file.FileName);
            if (!templateName.EndsWith(fileExtension, StringComparison.OrdinalIgnoreCase))
            {
                templateName += fileExtension;
            }

            var objectName = $"{_basePath}/{subDirectory}/{templateName}";
            using (var stream = file.OpenReadStream())
            {
                await _storageClient.UploadObjectAsync(_bucketName, objectName, file.ContentType, stream);
            }
            return objectName;
        }

        public async virtual Task<bool> DeleteFile(string templateName, string subDirectory = "DiplomaPdfs")
        {
            if (templateName.Equals("Default.pdf", StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("The default template cannot be deleted.");
            }

            var objectName = $"{_basePath}/{subDirectory}/{templateName}.pdf";

            try
            {
                await _storageClient.DeleteObjectAsync(_bucketName, objectName);
                return true;
            }
            catch (Google.GoogleApiException ex) when (ex.Error.Code == 404)
            {
                return false;
            }
        }

        public async virtual Task InitFileFromNewTemplate(string templateName, string subDirectory = "DiplomaPdfs")
        {
            var sourceFileName = $"{_basePath}/{subDirectory}/Default.pdf";
            var destinationFileName = $"{_basePath}/{subDirectory}/{templateName}.pdf";

            try
            {
                using (var sourceStream = new MemoryStream())
                {
                    await _storageClient.DownloadObjectAsync(_bucketName, sourceFileName, sourceStream);
                    sourceStream.Position = 0;

                    await _storageClient.UploadObjectAsync(_bucketName, destinationFileName, "application/pdf", sourceStream);
                }
            }
            catch (Google.GoogleApiException ex) when (ex.Error.Code == 404)
            {
                throw new FileNotFoundException("Source file not found for template initialization.");
            }
        }

        public async virtual Task<string> CreateBackup(string fileName, string subDirectory = "DiplomaPdfs")
        {
            var sourceFileName = $"{_basePath}/{subDirectory}/{fileName}.pdf";
            var version = 1;
            string newFileName;

            try
            {
                await _storageClient.GetObjectAsync(_bucketName, sourceFileName);
            }
            catch (Google.GoogleApiException ex) when (ex.Error.Code == 404)
            {
                throw new FileNotFoundException("Source file not found.");
            }

            using (var sourceStream = new MemoryStream())
            {
                await _storageClient.DownloadObjectAsync(_bucketName, sourceFileName, sourceStream);
                sourceStream.Position = 0;

                do
                {
                    newFileName = $"{_basePath}/{subDirectory}/{fileName}.v{version}.pdf";
                    version++;
                } while (await FileExistsInStorageAsync(newFileName));

                using (var newFileStream = new MemoryStream())
                {
                    sourceStream.CopyTo(newFileStream);
                    newFileStream.Position = 0;
                    await _storageClient.UploadObjectAsync(_bucketName, newFileName, "application/pdf", newFileStream);
                }
            }

            return newFileName;
        }

        private async Task<bool> FileExistsInStorageAsync(string fileName)
        {
            try
            {
                await _storageClient.GetObjectAsync(_bucketName, fileName);
                return true;
            }
            catch (Google.GoogleApiException ex) when (ex.Error.Code == 404)
            {
                return false;
            }
        }

        public async virtual Task<FileContentResult> GetFilesFromPath(string folderPath, string zipFileName, string subDirectory = "DiplomaPdfs")
        {
            var storageObjects = _storageClient.ListObjects(_bucketName, $"{_basePath}/{subDirectory}");
            var files = new List<(Stream Stream, string FileName)>();

            foreach (var storageObject in storageObjects)
            {
                var memoryStream = new MemoryStream();
                await _storageClient.DownloadObjectAsync(_bucketName, storageObject.Name, memoryStream);
                memoryStream.Position = 0;
                var fileName = Path.GetFileName(storageObject.Name);
                if (!string.IsNullOrEmpty(fileName))
                {
                    files.Add((memoryStream, fileName));
                }
            }
            
            var fileBytes = _fileUtilityService.CreateZipFromStreams(files);

            return new FileContentResult(fileBytes, "application/zip")
            {
                FileDownloadName = zipFileName
            };
        }
    }
}
