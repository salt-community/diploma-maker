using Microsoft.AspNetCore.Mvc;

namespace DiplomaMakerApi.Services;

public interface IStorageService
{
    public Task<string?> GetFilePath(string templateName, string subDirectory = "DiplomaPdfs");
    public Task<string> SaveFile(IFormFile file, string templateName, string subDirectory = "DiplomaPdfs");
    public Task<bool> DeleteFile(string templateName, string subDirectory = "DiplomaPdfs");
    public Task InitFileFromNewTemplate(string templateName, string subDirectory = "DiplomaPdfs");
    public Task<string> CreateBackup(string fileName, string subDirectory = "DiplomaPdfs");
    public Task<FileContentResult> GetFilesFromPath(string zipFileName, string subDirectory);
    public Task<byte[]?> GetFileFromPath(string fileName, string subDirectory = "DiplomaPdfs");
}