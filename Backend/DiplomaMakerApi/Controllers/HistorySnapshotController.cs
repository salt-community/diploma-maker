using DiplomaMakerApi.Models;
using DiplomaMakerApi.Services;
using Microsoft.AspNetCore.Mvc;


namespace DiplomaMakerApi.Controllers
{
    [Route("api/[controller]")]
    public class HistorySnapshotController : ControllerBase
    {
        private readonly HistorySnapshotService _historySnapShotService;

        public HistorySnapshotController(HistorySnapshotService historySnapShotService)
        {
            _historySnapShotService = historySnapShotService;
        }

        [HttpGet]
        public async Task<ActionResult<List<DiplomaGenerationLog>>> GetHistory()
        {    
            // var students = await _historySnapShotService.;
            // return _mapper.Map<List<StudentResponseDto>>(students);
            return Ok();
        }
    }
}