/*
    CrudControllerBase

    Defines a base controller from which all crud controllers inherit.
    The base provides basic crud functionality for one specific 
    entity/entityDto pair.

    TODO: Find a what to annotate each method specific to the entity type in the derived controller
*/

using Microsoft.AspNetCore.Mvc;

using DiplomaMakerApi._2.Database;
using DiplomaMakerApi._2.Models;

namespace DiplomaMakerApi._2.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CrudControllerBase<TEntity>(DiplomaMakerContext _context)
: ControllerBase
where TEntity : BaseEntity<TEntity>
{
    [HttpGet("GetEntities")]
    public IEnumerable<TEntity> GetEntities()
    {
        var entities = _context.Set<TEntity>();

        return entities.Select(entity => entity.HideIds());
    }

    [HttpGet("GetEntityByGuid/{guid}")]
    public ActionResult<TEntity> GetEntity(string guid)
    {
        var entity = _context
            .Set<TEntity>()
            .FirstOrDefault(entity => entity.Guid.ToString() == guid);

        if (entity is null)
            return NotFound($"Entity with guid {guid} could not be found");

        return entity;
    }

    [HttpPost("PostEntity")]
    public ActionResult<TEntity> PostEntity(TEntity dto)
    {
        var entity = dto;

        _context.Add(entity);
        _context.SaveChanges();

        return Ok(entity);
    }

    [HttpPut("PutEntity")]
    public ActionResult<TEntity> PutEntity(TEntity dto)
    {
        var entity = _context
            .Set<TEntity>()
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
            .Set<TEntity>()
            .FirstOrDefault(entity => entity.Guid.ToString() == guid);

        if (entity is null)
            return NotFound($"Entity with guid {guid} could not be found");

        _context.Remove(entity);
        _context.SaveChanges();

        return NoContent();
    }
}