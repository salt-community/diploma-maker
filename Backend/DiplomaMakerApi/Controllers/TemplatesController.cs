using Microsoft.AspNetCore.Mvc;
using DiplomaMakerApi.Models;
using DiplomaMakerApi.Services;
using AutoMapper;
namespace DiplomaMakerApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TemplatesController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly TemplateService _templateService;
    private readonly LocalFileStorageService _localFileStorageService;

    public TemplatesController(IMapper mapper, TemplateService templateService, LocalFileStorageService localFileStorageService)
    {
        _mapper = mapper;
        _templateService = templateService;
        _localFileStorageService = localFileStorageService;
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
    public async Task<ActionResult<TemplateResponseDto>> PostTemplate(TemplateRequestDto templateRequestDto)
    {
        var template = await _templateService.PostTemplate(templateRequestDto);
        var templateResponseDto = _mapper.Map<TemplateResponseDto>(template);
        return CreatedAtAction(nameof(GetTemplateById), new { id = template.Id }, templateResponseDto);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTemplate(int id)
    {
        if(id == 1){
            return BadRequest("You are not allowed to delete the base template");
        }
        var template = await _templateService.DeleteTemplate(id);
        if (template == null)
        {
            return NotFound();
        }
        var templateResponseDto = _mapper.Map<TemplateResponseDto>(template);
        return Ok(templateResponseDto);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TemplateResponseDto>> PutTemplate(int id, TemplateRequestDto templateRequestDto)
    {
        var template = await _templateService.PutTemplate(id, templateRequestDto);
        if (template == null)
        {
            return NotFound();
        }
        var templateResponseDto = _mapper.Map<TemplateResponseDto>(template);
        return Ok(templateResponseDto);
    }
}

