using DiplomaMakerApi.Data;
using DiplomaMakerApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DiplomaMakerApi.Services;
public class LocalFileStorageService : IStorageService
{
    private readonly string _basePath;
    private readonly DiplomaMakingContext _context;
    private readonly FileUtilityService _fileUtilityService;
    private readonly ILogger<LocalFileStorageService> _logger;
    public LocalFileStorageService(DiplomaMakingContext context, FileUtilityService fileUtilityService, IConfiguration configuration, ILogger<LocalFileStorageService> logger)
    {
        _context = context;
        _fileUtilityService = fileUtilityService;
        _basePath = Path.Combine(Directory.GetCurrentDirectory(), configuration["Blob:BlobStorageFolder"] ?? "Blob");
        _logger = logger;

        if (!Directory.Exists(_basePath))
        {
            SetupBlobFolder();
        }
    }

    public async Task<string?> GetFilePath(string templateName, string subDirectory = "DiplomaPdfs")
    {
        var directoryPath = Path.Combine(_basePath, subDirectory ?? string.Empty);
        var filePath = Path.Combine(directoryPath, templateName);
        _logger.LogInformation($"\nGetFilePath directoryPath: {directoryPath}\n");

        if (File.Exists(filePath))
        {
            return filePath;
        }

        var templateNameNoExtension = Path.GetFileNameWithoutExtension(templateName);
        var templateExists = await _context.DiplomaTemplates.FirstOrDefaultAsync(t => t.Name == templateNameNoExtension);

        if (templateExists != null)
        {
            await InitFileFromNewTemplate(templateNameNoExtension, subDirectory!);
            return Path.Combine(directoryPath, templateName);
        }
        return null;
    }

    public async Task<FileContentResult> GetFilesFromPath(string zipFileName, string subDirectory)
    {
        var directoryPath = Path.Combine(_basePath, subDirectory);
        var files = Directory.GetFiles(directoryPath);
        _logger.LogInformation($"\nGetFilesFromPath directoryPath: {directoryPath}\n");

        if (files.Length == 0)
        {
            throw new FileNotFoundException("No files found in the directory.");
        }

        var fileBytes = await Task.Run(() => _fileUtilityService.CreateZipFromFiles(files, zipFileName));

        return new FileContentResult(fileBytes, "application/zip")
        {
            FileDownloadName = zipFileName
        };
    }

    public async Task<byte[]?> GetFileFromPath(string fileName, string subDirectory)
    {
        var filePath = await GetFilePath(fileName, subDirectory);

        if (filePath == null) return null;

        return await File.ReadAllBytesAsync(filePath);
    }

    public async Task<string> SaveFile(IFormFile file, string templateName, string subDirectory = "DiplomaPdfs")
    {
        var fileExtension = Path.GetExtension(file.FileName);

        if (!templateName.EndsWith(fileExtension, StringComparison.OrdinalIgnoreCase))
        {
            templateName += fileExtension;
        }

        var directoryPath = Path.Combine(_basePath, subDirectory ?? string.Empty);
        _logger.LogInformation($"\nSaveFile directoryPath: {directoryPath}\n");

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
        _logger.LogInformation($"\nDeleteFile directoryPath: {directoryPath}\n");
        _logger.LogInformation($"\nDeleteFile filePath: {filePath}\n");

        if (File.Exists(filePath))
        {
            await Task.Run(() => File.Delete(filePath));
            return true;
        }
        return false;
    }

    public async Task InitFileFromNewTemplate(string templateName, string subDirectory = "DiplomaPdfs")
    {
        var sourceFilePath = Path.Combine(_basePath, subDirectory, "Default.pdf");
        var destinationDirectoryPath = Path.Combine(_basePath, subDirectory ?? string.Empty);
        var destinationFilePath = Path.Combine(destinationDirectoryPath, templateName + ".pdf");
        _logger.LogInformation($"\nInitFileFromNewTemplate sourceFilePath: {sourceFilePath}\n");
        _logger.LogInformation($"\nInitFileFromNewTemplate destinationDirectoryPath: {destinationDirectoryPath}\n");
        _logger.LogInformation($"\nInitFileFromNewTemplate destinationFilePath: {destinationFilePath}\n");

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
        _logger.LogInformation($"\nCreateBackup: {filePath}\n");

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

        return Path.Combine(subDirectory ?? string.Empty, newFileName);
    }

    public void ClearFolderExceptDefault(string subDirectory = "DiplomaPdfs")
    {
        var clearDiplomasPath = Path.Combine(_basePath, subDirectory ?? string.Empty);
        var defaultFile = "Default.pdf";
        _logger.LogInformation($"\nClearFolderExceptDefault: {clearDiplomasPath}\n");

        foreach (var file in Directory.GetFiles(clearDiplomasPath))
        {
            if (Path.GetFileName(file) != defaultFile)
            {
                File.Delete(file);
            }
        }
    }

    private void SetupBlobFolder()
    {
        var sourceFolder = Path.Combine(Directory.GetCurrentDirectory(), "Blob");
        _logger.LogInformation($"\nSetupBlobFolder: {sourceFolder}\n");
        if (Directory.Exists(sourceFolder))
        {
            DirectoryCopy(sourceFolder, _basePath, copySubDirs: true);
        }
    }

    private void DirectoryCopy(string sourceDirName, string destDirName, bool copySubDirs)
    {
        DirectoryInfo dir = new DirectoryInfo(sourceDirName);
        DirectoryInfo[] dirs = dir.GetDirectories();

        if (!dir.Exists)
        {
            throw new DirectoryNotFoundException("Source directory does not exist or could not be found: " + sourceDirName);
        }

        if (!Directory.Exists(destDirName))
        {
            Directory.CreateDirectory(destDirName);
        }

        FileInfo[] files = dir.GetFiles();
        foreach (FileInfo file in files)
        {
            string tempPath = Path.Combine(destDirName, file.Name);
            file.CopyTo(tempPath, false);
        }

        if (copySubDirs)
        {
            foreach (DirectoryInfo subdir in dirs)
            {
                string tempPath = Path.Combine(destDirName, subdir.Name);
                DirectoryCopy(subdir.FullName, tempPath, copySubDirs);
            }
        }
    }
}