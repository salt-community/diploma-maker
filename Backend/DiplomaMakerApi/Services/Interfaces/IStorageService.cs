using Microsoft.AspNetCore.Mvc;

namespace DiplomaMakerApi.Services.Interfaces;

public interface IStorageService
{
    public Task<string?> GetFilePath(string templateName, string subDirectory = "DiplomaPdfs");
    public Task<string> SaveFile(IFormFile file, string templateName, string subDirectory = "DiplomaPdfs");
    public Task<bool> DeleteFile(string templateName, string subDirectory = "DiplomaPdfs");
    public Task InitFileFromNewTemplate(string templateName, string subDirectory = "DiplomaPdfs");
    public Task<string> CreateBackup(string fileName, string subDirectory = "DiplomaPdfs");
    public Task<FileContentResult> GetFilesFromPath(string zipFileName, string subDirectory);
    public Task<byte[]?> GetFileFromPath(string fileName, string subDirectory = "DiplomaPdfs");

    // public async Task<string?> GetFilePath(string templateName, string subDirectory = "DiplomaPdfs");
    // public async virtual Task<string?> GetFilePath(string templateName, string subDirectory = "DiplomaPdfs");


    // public async virtual Task<(byte[] FileBytes, string ContentType)> GetFileFromFilePath(string templateName, string subDirectory = "DiplomaPdfs");

    // public async Task<string> SaveFile(IFormFile file, string templateName, string subDirectory = "DiplomaPdfs");
    // public async virtual Task<string> SaveFile(IFormFile file, string templateName, string subDirectory = "DiplomaPdfs");

    // public async Task<bool> DeleteFile(string templateName, string subDirectory = "DiplomaPdfs");
    // public async virtual Task<bool> DeleteFile(string templateName, string subDirectory = "DiplomaPdfs");

    // public async Task InitFileFromNewTemplate(string templateName, string subDirectory = "DiplomaPdfs");
    // public async virtual Task InitFileFromNewTemplate(string templateName, string subDirectory = "DiplomaPdfs");

    // public async Task<string> CreateBackup(string fileName, string subDirectory = "DiplomaPdfs");
    // public async virtual Task<string> CreateBackup(string fileName, string subDirectory = "DiplomaPdfs");

    // public void ClearFolderExceptDefault(string subDirectory = "DiplomaPdfs");

    // public async Task<FileContentResult> GetFilesFromPath(string zipFileName, string subDirectory);
    // public async virtual Task<FileContentResult> GetFilesFromPath(string folderPath, string zipFileName, string subDirectory = "DiplomaPdfs");
}