using DiplomaMakerApi._2.Database;
using DiplomaMakerApi._2.Models;
using Microsoft.AspNetCore.Mvc;

namespace DiplomaMakerApi._2.Controllers;

public record StringFileDto(string FileType, string Content);

[Route("api/[controller]")]
[ApiController]
public class FileController(DiplomaMakerContext _context) : ControllerBase
{
    [HttpPost("UploadFile")]
    [ProducesResponseType<string>(StatusCodes.Status201Created)]
    public ActionResult<string> UploadFile(StringFileDto file)
    {
        var stringFile = new StringFile()
        {
            Type = file.FileType,
            Content = file.Content
        };

        _context.Files.Add(stringFile);
        _context.SaveChanges();

        return Ok(stringFile.Guid);
    }

    [HttpGet("GetFile/{guid}")]
    [ProducesResponseType<StringFile>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<List<StringFile>> GetFile(string guid)
    {
        var file = _context.Files.FirstOrDefault(file => file.Guid.ToString() == guid);
        return file is not null
            ? Ok(file)
            : NotFound($"A file with guid {guid} doesn't exist");
    }
}
