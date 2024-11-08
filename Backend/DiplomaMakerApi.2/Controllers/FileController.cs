using DiplomaMakerApi._2.Database;
using DiplomaMakerApi._2.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DiplomaMakerApi._2.Controllers;

public record StringFileDto(string Content);

[Route("api/[controller]")]
[ApiController]
public class FileController(DiplomaMakerContext _context) : ControllerBase
{
    [HttpPost("SaveTemplate")]
    public IActionResult SaveTemplate(StringFileDto file)
    {
        Console.WriteLine(file);
        var stringFile = new StringFile()
        {
            Content = file.Content
        };
        _context.Add(stringFile);
        _context.SaveChanges();
        return Ok();
    }

    [HttpGet("GetTemplates")]
    public ActionResult<List<StringFile>> GetTemplates()
    {
        return _context.StringFiles.ToList();
    }
}
