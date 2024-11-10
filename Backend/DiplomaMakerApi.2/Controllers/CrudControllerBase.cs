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
    private static readonly string _entityName = typeof(TEntity).Name;

    [HttpGet("GetEntities")]
    public IEnumerable<TEntity> GetEntities() =>
        _context.Set<TEntity>()
            .Select(entity => entity.HideIds());


    [HttpGet("GetEntityByGuid/{guid}")]
    public ActionResult<TEntity> GetEntity(string guid)
    {
        var entity = _context
            .Set<TEntity>()
            .FirstOrDefault(entity => entity.Guid.ToString() == guid);

        return entity is not null
            ? entity.HideIds()
            : NotFound($"{_entityName} with guid {guid} could not be found");
    }

    [HttpPost("PostEntity")]
    public ActionResult<TEntity> PostEntity(TEntity dto)
    {
        var entity = dto;

        _context.Add(entity);
        _context.SaveChanges();

        return Ok(entity.HideIds());
    }

    [HttpPut("PutEntity")]
    public ActionResult<TEntity> PutEntity(TEntity dto)
    {
        var entity = _context
            .Set<TEntity>()
            .FirstOrDefault(entity => entity.Guid == dto.Guid);

        if (entity is null)
            return NotFound($"{_entityName} with guid {dto.Guid} could not be found");

        entity.Patch(dto);

        _context.SaveChanges();

        return Ok(entity.HideIds());
    }

    [HttpDelete("DeleteEntity/{guid}")]
    public IActionResult DeleteEntity(string guid)
    {
        var entity = _context
            .Set<TEntity>()
            .FirstOrDefault(entity => entity.Guid.ToString() == guid);

        if (entity is null)
            return NotFound($"{_entityName} with guid {guid} could not be found");

        _context.Remove(entity);
        _context.SaveChanges();

        return NoContent();
    }
}