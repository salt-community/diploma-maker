using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DiplomaMakerApi.Services
{
    public class LocalFileStorageService
    {
        private readonly string _basePath = Path.Combine(Directory.GetCurrentDirectory(), "Blob/");
        private readonly DiplomaMakingContext _context;
        private readonly FileUtilityService _fileUtilityService;

        public LocalFileStorageService(DiplomaMakingContext context, FileUtilityService fileUtilityService)
        {
            _context = context;
            _fileUtilityService = fileUtilityService;
        }

        public async Task<string> GetFilePath(string templateName, string subDirectory = "DiplomaPdfs")
        {
            var directoryPath = Path.Combine(_basePath, subDirectory ?? string.Empty);
            var filePath = Path.Combine(directoryPath, templateName);
            
            if (File.Exists(filePath))
            {
                return filePath;
            }

            var templateNameNoExtension = Path.GetFileNameWithoutExtension(templateName);
            var templateExists = await _context.DiplomaTemplates.FirstOrDefaultAsync(t => t.Name == templateNameNoExtension);

            if (templateExists != null)
            {
                await InitFileFromNewTemplate(Path.GetFileNameWithoutExtension(templateName), "DiplomaPdfs");
                return Path.Combine(directoryPath, templateName);
            }
            return null;
        }

        public async Task<FileContentResult> GetFilesFromPath(string zipFileName, string subDirectory)
        {
            var directoryPath = Path.Combine(_basePath, subDirectory);
            var files = Directory.GetFiles(directoryPath);

            if (files.Length == 0)
            {
                throw new FileNotFoundException("No files found in the directory.");
            }

            var fileBytes = _fileUtilityService.CreateZipFromFiles(files, zipFileName);

            return new FileContentResult(fileBytes, "application/zip")
            {
                FileDownloadName = zipFileName
            };
        }

        public async Task<string> SaveFile(IFormFile file, string templateName, string subDirectory = "DiplomaPdfs")
        {
            var fileExtension = Path.GetExtension(file.FileName);

            if (!templateName.EndsWith(fileExtension, StringComparison.OrdinalIgnoreCase))
            {
                templateName += fileExtension;
            }

            var directoryPath = Path.Combine(_basePath, subDirectory ?? string.Empty);
            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }
            
            var filePath = Path.Combine(directoryPath, templateName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return filePath;
        }

        public async Task<bool> DeleteFile(string templateName, string subDirectory = "DiplomaPdfs")
        {
            if (templateName == "Default")
            {
                throw new InvalidOperationException("The default template cannot be deleted.");
            }

            var directoryPath = Path.Combine(_basePath, subDirectory ?? string.Empty);
            var filePath = Path.Combine(directoryPath, templateName + ".pdf");

            if (File.Exists(filePath))
            {
                await Task.Run(() => File.Delete(filePath));
                return true;
            }
            return false;
        }

        public async Task InitFileFromNewTemplate(string templateName, string subDirectory = "DiplomaPdfs")
        {
            var sourceFilePath = Path.Combine($"{_basePath}{subDirectory}", "Default.pdf");
            var destinationDirectoryPath = Path.Combine(_basePath, subDirectory ?? string.Empty);
            var destinationFilePath = Path.Combine(destinationDirectoryPath, templateName + ".pdf");

            if (!File.Exists(sourceFilePath))
            {
                throw new FileNotFoundException("The default template file does not exist.");
            }

            if (!Directory.Exists(destinationDirectoryPath))
            {
                Directory.CreateDirectory(destinationDirectoryPath);
            }

            await Task.Run(() => File.Copy(sourceFilePath, destinationFilePath, overwrite: true));
        }

        public async Task<string> CreateBackup(string fileName, string subDirectory = "DiplomaPdfs")
        {
            var filePath = Path.Combine(_basePath, subDirectory ?? string.Empty, fileName + ".pdf");
            
            int version = 1;
            string newFileName;
            string newFilePath;

            do
            {
                newFileName = $"{fileName}.v{version}.pdf";
                newFilePath = Path.Combine(_basePath, subDirectory ?? string.Empty, newFileName);
                version++;
            } 
            while (File.Exists(newFilePath));

            await Task.Run(() => File.Copy(filePath, newFilePath));

            var relativePath = Path.Combine(subDirectory ?? string.Empty, newFileName);

            return relativePath;
        }

        public void ClearFolderExceptDefault(string subDirectory = "DiplomaPdfs")
        {
            var clearDiplomasPath = Path.Combine(_basePath, subDirectory ?? string.Empty);
            var defaultFile = "Default.pdf";

            foreach (var file in Directory.GetFiles(clearDiplomasPath))
            {
                if (Path.GetFileName(file) != defaultFile)
                {
                    File.Delete(file);
                }
            }
        }
    }
}