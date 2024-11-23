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
}