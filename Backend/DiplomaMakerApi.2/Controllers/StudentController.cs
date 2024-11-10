/*
    CrudControllerBase

    Defines a base controller from which all crud controllers inherit.
    The base provides basic crud functionality for one specific 
    entity/entityDto pair.

    TODO: Find a what to annotate each method specific to the entity type in the derived controller
*/

using Microsoft.AspNetCore.Mvc;
using AutoMapper;

using DiplomaMakerApi._2.Database;
using DiplomaMakerApi._2.Models;

namespace DiplomaMakerApi._2.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentController(DiplomaMakerContext _context)
: ControllerBase
{
    [HttpGet("GetEntities")]
    public IEnumerable<Student> GetEntities()
    {
        var entities = _context.Set<Student>();

        foreach (var entity in entities)
        {
            entity.Id = -1;
        }

        return entities;
    }

    [HttpGet("GetEntityByGuid/{guid}")]
    public ActionResult<Student> GetEntity(string guid)
    {
        var entity = _context
            .Set<Student>()
            .FirstOrDefault(entity => entity.Guid.ToString() == guid);

        return entity is not null
            ? entity
            : NotFound($"Entity with guid {guid} could not be found");
    }

    [HttpPost("PostEntity")]
    public ActionResult<Student> PostEntity([FromBody] Student dto)
    {
        var entity = dto;

        _context.Add(entity);
        _context.SaveChanges();

        return Ok(dto);
    }

    [HttpPut("PutEntity")]
    public ActionResult<Student> PutEntity(Student dto)
    {
        var entity = _context
            .Set<Student>()
            .FirstOrDefault(entity => entity.Guid == dto.Guid);

        if (entity is null)
            return NotFound($"Entity with guid {dto.Guid} could not be found");

        entity.Patch(dto);

        _context.SaveChanges();

        return Ok(entity);
    }

    [HttpDelete("DeleteEntity/{guid}")]
    public IActionResult DeleteEntity(string guid)
    {
        var entity = _context
            .Set<Student>()
            .FirstOrDefault(entity => entity.Guid.ToString() == guid);

        if (entity is null)
            return NotFound($"Entity with guid {guid} could not be found");

        _context.Remove(entity);
        _context.SaveChanges();

        return NoContent();
    }
}