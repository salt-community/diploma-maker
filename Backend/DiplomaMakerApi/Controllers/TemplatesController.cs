using Microsoft.AspNetCore.Mvc;
using DiplomaMakerApi.Models;
using DiplomaMakerApi.Services;
using AutoMapper;
using DiplomaMakerApi.Exceptions;
using Microsoft.AspNetCore.Authorization;
namespace DiplomaMakerApi.Controllers;

[Route("api/[controller]")]
[ApiController]
// [Authorize]
public class TemplatesController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly TemplateService _templateService;
    public TemplatesController(IMapper mapper, TemplateService templateService)
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
        return _mapper.Map<TemplateResponseDto>(template);
     
    }

    [HttpPost]
    public async Task<ActionResult<TemplateResponseDto>> PostTemplate(TemplatePostRequestDto templateRequestDto)
    {
        var template = await _templateService.PostTemplate(templateRequestDto);
        var templateResponseDto = _mapper.Map<TemplateResponseDto>(template);
        return CreatedAtAction(nameof(GetTemplateById), new { id = template.Id }, templateResponseDto);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<TemplateResponseDto>> DeleteTemplate(int id)
    {
        if(id == 1){
            throw new NotFoundByIdException("Student", id);
        }
        var template = await _templateService.DeleteTemplate(id);
        return _mapper.Map<TemplateResponseDto>(template);
        
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TemplateResponseDto>> PutTemplate(int id, TemplateRequestDto templateRequestDto)
    {
        var template = await _templateService.PutTemplate(id, templateRequestDto);
        return _mapper.Map<TemplateResponseDto>(template);
        
    }
}

