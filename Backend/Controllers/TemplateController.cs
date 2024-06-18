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
        var templates = await _templateService.GetDiplomas();
        var templateResponseDtos = _mapper.Map<List<TemplateResponseDto>>(templates);
        return Ok(templateResponseDtos);
    }

    [HttpGet("{guidId}")]
    public async Task<ActionResult> GetTemplateById(Guid guidId)
    {
        throw new NotImplementedException();
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

