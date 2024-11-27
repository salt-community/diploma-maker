using DiplomaMakerApi.Database;
using DiplomaMakerApi.Dto;
using DiplomaMakerApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace DiplomaMakerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TemplateController(
    DiplomaMakerContext _context)
    : CrudControllerBase<Template>(_context)
{
    [HttpGet("PeekTemplates")]
    public List<TemplatePeek> PeekTemplates() =>
        _context.Templates.Select(template => new TemplatePeek(template)).ToList();

    [HttpPut("ChangeTemplateName/{templateGuid}")]
    public IActionResult ChangeTemplateName(string templateGuid, [FromQuery] string newName)
    {
        var template = _context.Templates.FirstOrDefault(template => template.Guid.ToString() == templateGuid);

        if (template is null)
            return NotFound($"A template with guid {templateGuid} could not be found");

        template.Name = newName;
        _context.SaveChanges();

        return Ok();
    }
}