using AutoMapper;
using DiplomaMakerApi.Dtos.UserFont;
using DiplomaMakerApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace DiplomaMakerApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
        public async Task<ActionResult<UserFontsResponseDto>> PostUserFonts(UserFontRequestsDto userFonts)
        {
            return Ok();
        }
    }
}