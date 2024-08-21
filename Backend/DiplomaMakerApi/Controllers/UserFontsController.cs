using AutoMapper;
using DiplomaMakerApi.Dtos.UserFont;
using DiplomaMakerApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DiplomaMakerApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    /* [Authorize] */
    public class UserFontsController : ControllerBase
    {
        private readonly UserFontService _userFontService;
        private readonly IMapper _mapper;

        public UserFontsController(UserFontService userFontService, IMapper mapper)
        {
            _userFontService = userFontService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<UserFontResponseDto>>> GetUserFonts()
        {
            var userFonts = await _userFontService.GetUserFonts();
            return _mapper.Map<List<UserFontResponseDto>>(userFonts);
        }

        [HttpPost]
        public async Task<ActionResult<List<UserFontResponseDto>>> PostUserFonts([FromForm] UserFontRequestsDto userFonts)
        {
            var newFonts = await _userFontService.PostUserFonts(userFonts);
            return _mapper.Map<List<UserFontResponseDto>>(newFonts);
        }
    }
}