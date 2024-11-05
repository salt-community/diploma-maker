using AutoMapper;
using Microsoft.AspNetCore.Mvc;

using DiplomaMakerApi.Models;
using DiplomaMakerApi.Services;

namespace DiplomaMakerApi.Controllers;

[Route("api/[controller]")]
[ApiController]
// [Authorize]
public class TemplatesController(IMapper _mapper, TemplateService _templateService) : ControllerBase
{
    [HttpGet("GetTemplates")]
    public async Task<ActionResult<List<TemplatesResponseDto>>> GetTemplates()
    {
        var templates = await _templateService.GetTemplates();
        var templateResponseDtos = _mapper.Map<List<TemplateResponseDto>>(templates);

        return Ok(templateResponseDtos);
    }

    [HttpGet("GetTemplate/{id}")]
    public async Task<ActionResult<TemplateResponseDto>> GetTemplateById(int id)
    {
        var template = await _templateService.GetTemplate(id);

        return template != null
            ? _mapper.Map<TemplateResponseDto>(template)
            : NotFound();
    }

    [HttpPost("PostTemplate")]
    public async Task<ActionResult<TemplateResponseDto>> PostTemplate(TemplatePostRequestDto templateRequestDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var template = await _templateService.PostTemplate(templateRequestDto);
        var templateResponseDto = _mapper.Map<TemplateResponseDto>(template);

        return CreatedAtAction(nameof(GetTemplateById), new { id = template.Id }, templateResponseDto);
    }

    [HttpDelete("DeleteTemplate/{id}")]
    public async Task<IActionResult> DeleteTemplate(int id)
    {
        var template = await _templateService.DeleteTemplate(id);

        return template != null
            ? NoContent()
            : NotFound();
    }

    [HttpPut("PutTemplate/{id}")]
    public async Task<ActionResult<TemplateResponseDto>> PutTemplate(int id, TemplateRequestDto templateRequestDto)
    {
        var template = await _templateService.PutTemplate(id, templateRequestDto);
        return _mapper.Map<TemplateResponseDto>(template);
    }
}

