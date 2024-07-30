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

        public GoogleCloudStorageService(DiplomaMakingContext context, IConfiguration configuration, FileUtilityService fileUtilityService)
        {
            _storageClient = StorageClient.Create();
            _context = context;
            _bucketName = configuration["GoogleCloud:BucketName"];
            _fileUtilityService = fileUtilityService;
        }

        public async Task<string> SaveFile(IFormFile file, string templateName)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            if (!templateName.EndsWith(fileExtension, StringComparison.OrdinalIgnoreCase))
            {
                templateName += fileExtension;
            }

            var objectName = $"Blob/DiplomaPdfs/{templateName}";
            using (var stream = file.OpenReadStream())
            {
                await _storageClient.UploadObjectAsync(_bucketName, objectName, file.ContentType, stream);
            }
            return objectName;
        }

        public async Task<string> GetFilePath(string templateName)
        {
            var objectName = templateName.Equals("Default.pdf", StringComparison.OrdinalIgnoreCase)
                ? $"Blob/DiplomaPdfs/{templateName}"
                : $"Blob/DiplomaPdfs/{templateName}";

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
                    return $"Blob/DiplomaPdfs/{templateName}";
                }
                return null;
            }
        }

        public async Task<(byte[] FileBytes, string ContentType)> GetFileFromFilePath(string templateName)
        {
            var filePath = await GetFilePath(templateName);

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

        public async Task<bool> DeleteFile(string templateName)
        {
            if (templateName.Equals("Default.pdf", StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("The default template cannot be deleted.");
            }

            var objectName = $"Blob/DiplomaPdfs/{templateName}.pdf";

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

        public async Task InitFileFromNewTemplate(string templateName)
        {
            var sourceFileName = "Blob/DiplomaPdfs/Default.pdf";
            var destinationFileName = $"Blob/DiplomaPdfs/{templateName}.pdf";

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

        public async Task<string> CreateBackup(string fileName)
        {
            var sourceFileName = $"Blob/DiplomaPdfs/{fileName}.pdf";
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
                    newFileName = $"Blob/DiplomaPdfs/{fileName}.v{version}.pdf";
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

        public async Task<FileContentResult> GetFilesFromPath(string folderPath, string zipFileName)
        {
            var storageObjects = _storageClient.ListObjects(_bucketName, folderPath);
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
