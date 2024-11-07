using AutoMapper;
using Microsoft.AspNetCore.Mvc;

using DiplomaMakerApi.Dtos;
using DiplomaMakerApi.Services;

namespace DiplomaMakerApi.Controllers;

[Route("api/[controller]")]
[ApiController]
// [Authorize]
public class TemplatesController(IMapper _mapper, TemplateService _templateService) : ControllerBase
{
    [HttpGet("GetTemplates")]
    [ProducesResponseType<List<TemplateResponseDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<List<TemplateResponseDto>>> GetTemplates()
    {
        var templates = await _templateService.GetTemplates();

        foreach (var template in templates)
            Console.WriteLine(template.Name);

        var templateResponseDtos = _mapper.Map<List<TemplateResponseDto>>(templates);

        foreach (var template in templateResponseDtos)
            Console.WriteLine(template.TemplateName);

        return Ok(templateResponseDtos);
    }

    [HttpGet("GetTemplate/{id}")]
    [ProducesResponseType<TemplateResponseDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TemplateResponseDto>> GetTemplateById(int id)
    {
        var template = await _templateService.GetTemplate(id);

        return template is not null
            ? _mapper.Map<TemplateResponseDto>(template)
            : NotFound();
    }

    [HttpPost("PostTemplate")]
    [ProducesResponseType<TemplateResponseDto>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TemplateResponseDto>> PostTemplate(TemplatePostRequestDto templateRequestDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var template = await _templateService.PostTemplate(templateRequestDto);
        var templateResponseDto = _mapper.Map<TemplateResponseDto>(template);

        return CreatedAtAction(nameof(GetTemplateById), new { id = template.Id }, templateResponseDto);
    }

    [HttpDelete("DeleteTemplate/{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteTemplate(int id)
    {
        try
        {
            var template = await _templateService.DeleteTemplate(id);
            return template != null
                ? NoContent()
                : NotFound();
        }
        catch (Exception exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [HttpPut("PutTemplate/{id}")]
    [ProducesResponseType<TemplateResponseDto>(StatusCodes.Status200OK)]
    public async Task<ActionResult<TemplateResponseDto>> PutTemplate(int id, TemplateRequestDto templateRequestDto)
    {
        var template = await _templateService.PutTemplate(id, templateRequestDto);

        return template != null
            ? _mapper.Map<TemplateResponseDto>(template)
            : NotFound("Template not found");
    }
}

