using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;

using DiplomaMakerApi.Dtos;
using DiplomaMakerApi.Services;
using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BlobController(
    IStorageService _storageService,
    BootcampService _bootcampService,
    IMapper _mapper
    ) : Controller
{
    private async Task<ActionResult<FileContentResult>> GetFile(string fileName, string subDirectory)
    {
        var extension = Path.GetExtension(fileName);
        fileName = Path.GetFileName(fileName);

        if (!string.Equals(extension, "pdf", StringComparison.OrdinalIgnoreCase) ||
            !string.Equals(extension, "wepb", StringComparison.OrdinalIgnoreCase) ||
            !string.Equals(extension, "woff", StringComparison.OrdinalIgnoreCase))
            return BadRequest("Invalid file type.");

        var fileBytes = await _storageService.GetFileFromPath(fileName, subDirectory);

        if (fileBytes == null) return NotFound($"File {fileName} not found.");

        return File(fileBytes, $"application/{extension}", fileName);
    }

    [HttpGet("GetTemplateBackground/{filename}")]
    [ProducesResponseType<FileContentResult>(StatusCodes.Status200OK)]
    [AllowAnonymous]
    public async Task<ActionResult<FileContentResult>> GetTemplateBackground(string filename) =>
        await GetFile(filename, "DiplomaPdfs");

    [HttpGet("GetTemplateBackgrounds")]
    [ProducesResponseType<FileContentResult>(StatusCodes.Status200OK)]
    // [Authorize]
    public async Task<ActionResult<FileContentResult>> GetTemplateBackgrounds() =>
        await _storageService.GetFilesFromPath("TemplateBackgroundPdfs.zip", "DiplomaPdfs");

    [HttpGet("GetDiploma/{filename}")]
    [ProducesResponseType<FileContentResult>(StatusCodes.Status200OK)]
    [AllowAnonymous]
    public async Task<ActionResult<FileContentResult>> GetDiploma(string filename) =>
        await GetFile(filename, "ImagePreview");

    [HttpGet("GetDiplomaThumbnail/{filename}")]
    [ProducesResponseType<FileContentResult>(StatusCodes.Status200OK)]
    [AllowAnonymous]
    public async Task<ActionResult<FileContentResult>> GetDiplomaThumbnail(string filename) =>
        await GetFile(filename, "ImagePreviewLQIP");

    [HttpPut("PutDiploma")]
    [ProducesResponseType<StudentResponseDto>(StatusCodes.Status200OK)]
    [AllowAnonymous]
    public async Task<ActionResult<StudentResponseDto>> PutDiploma([FromBody] DiplomaPutRequestDto diplomaPutRequest)
    {
        var studentResponse = await _bootcampService.PutDiploma(diplomaPutRequest);
        return _mapper.Map<StudentResponseDto>(studentResponse);
    }

    [HttpGet("GetFont/{fontName}/{fontType}"), HttpHead("GetFont/{fontName}/{fontType}")]
    [ProducesResponseType<FileContentResult>(StatusCodes.Status200OK)]
    [AllowAnonymous]
    public async Task<ActionResult<FileContentResult>> GetFont(string fontName, FontType fontType)
    {
        var fontNameUsed = fontType == FontType.regular ? $"{fontName}" : $"{fontName}-{fontType}";
        return await GetFile($"{fontNameUsed}.woff", $"UserFonts/{fontName}");
    }
}