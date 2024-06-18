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

    public TemplateController( IMapper mapper)
    {
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult> GetTemplates()
    {
        throw new NotImplementedException();
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

