using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Services;
using AutoMapper;
namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TemplateController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly TemplateService _templateService;

    public TemplateController(IMapper mapper, TemplateService templateService)
    {
        _mapper = mapper;
        _templateService = templateService;
    }

    [HttpGet]
    public async Task<ActionResult<List<TemplatesResponseDto>>> GetTemplates()
    {
        var templates = await _templateService.GetTemplates();
        var templateResponseDtos = _mapper.Map<List<TemplateResponseDto>>(templates);
        return Ok(templateResponseDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TemplateResponseDto>> GetTemplateById(int id)
    {
        var template = await _templateService.GetTemplate(id);
        if (template == null)
        {
            return NotFound();
        }
        var templateResponseDto = _mapper.Map<TemplateResponseDto>(template);
        return Ok(templateResponseDto);
    }

    [HttpPost]
    public async Task<ActionResult> PostTemplate()
    {
        throw new NotImplementedException();
    }

    [HttpDelete("{guidId}")]
    public async Task<IActionResult> DeleteTemplate(Guid guidId)
    {
        throw new NotImplementedException();
    }

    [HttpPut("{guidId}")]
    public async Task<ActionResult> PutTemplate()
    {
        throw new NotImplementedException();
    }
}

