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
public class CrudControllerBase<TEntity, TEntityDto>(DiplomaMakerContext _context, IMapper _mapper)
: ControllerBase
where TEntity : BaseEntity<TEntity>
where TEntityDto : TEntity
{
    [HttpGet("GetEntities")]
    public IEnumerable<TEntityDto> GetEntities() =>
        _mapper.Map<List<TEntityDto>>(_context.Set<TEntity>());

    [HttpGet("GetEntityByGuid/{guid}")]
    public ActionResult<TEntityDto> GetEntity(string guid)
    {
        var entity = _context
            .Set<TEntity>()
            .FirstOrDefault(entity => entity.Guid.ToString() == guid);

        return entity is not null
            ? Ok(_mapper.Map<TEntityDto>(entity))
            : NotFound($"Entity with guid {guid} could not be found");
    }

    [HttpPost("PostEntity")]
    public ActionResult<TEntityDto> PostEntity(TEntityDto dto)
    {
        var entity = _mapper.Map<TEntity>(dto);

        _context.Add(entity);
        _context.SaveChanges();

        return CreatedAtAction(nameof(GetEntity), entity);
    }

    [HttpPut("PutEntity")]
    public ActionResult<TEntityDto> PutEntity(TEntity dto)
    {
        var entity = _context
            .Set<TEntity>()
            .FirstOrDefault(entity => entity.Guid == dto.Guid);

        if (entity is null)
            return NotFound($"Entity with guid {dto.Guid} could not be found");

        entity.Patch(dto);

        _context.SaveChanges();

        return Ok(_mapper.Map<TEntityDto>(entity));
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