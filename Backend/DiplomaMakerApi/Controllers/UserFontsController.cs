using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;

using DiplomaMakerApi.Dtos;
using DiplomaMakerApi.Services;

namespace DiplomaMakerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserFontsController(UserFontService _userFontService, IMapper _mapper) : ControllerBase
{

    [HttpGet("GetUserFonts")]
    [AllowAnonymous]
    public async Task<ActionResult<List<UserFontResponseDto>>> GetUserFonts()
    {
        var userFonts = await _userFontService.GetUserFonts();
        return _mapper.Map<List<UserFontResponseDto>>(userFonts);
    }

    [HttpPost("PostUserFonts")]
    [AllowAnonymous]
    public async Task<ActionResult<List<UserFontResponseDto>>> PostUserFonts([FromForm] List<UserFontRequestDto> userFonts)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var newFonts = await _userFontService.PostUserFonts(userFonts);
        var createdFonts = _mapper.Map<List<UserFontResponseDto>>(newFonts);

        return CreatedAtAction(nameof(GetUserFonts), null, createdFonts);
    }
}