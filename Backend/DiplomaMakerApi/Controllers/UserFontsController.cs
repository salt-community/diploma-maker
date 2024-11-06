using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;

using DiplomaMakerApi.Dtos;
using DiplomaMakerApi.Services;

namespace DiplomaMakerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserFontsController(
    UserFontService _userFontService,
    IMapper _mapper
) : ControllerBase
{

    [HttpGet("GetUserFonts")]
    [ProducesResponseType<List<UserFontResponseDto>>(StatusCodes.Status200OK)]
    [AllowAnonymous]
    public async Task<ActionResult<List<UserFontResponseDto>>> GetUserFonts()
    {
        var userFonts = await _userFontService.GetUserFonts();
        return _mapper.Map<List<UserFontResponseDto>>(userFonts);
    }

    [HttpPost("PostUserFonts")]
    [AllowAnonymous]
    [ProducesResponseType<List<UserFontResponseDto>>(StatusCodes.Status201Created)]
    [ProducesResponseType<List<UserFontResponseDto>>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<List<UserFontResponseDto>>> PostUserFonts([FromBody] List<UserFontRequestDto> userFonts)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var newFonts = await _userFontService.PostUserFonts(userFonts);
        var createdFonts = _mapper.Map<List<UserFontResponseDto>>(newFonts);

        return CreatedAtAction(nameof(GetUserFonts), null, createdFonts);
    }
}