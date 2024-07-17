using AutoMapper;
using DiplomaMakerApi.Models;
using DiplomaMakerApi.Services;
using Microsoft.AspNetCore.Mvc;


namespace DiplomaMakerApi.Controllers
{
    [Route("api/[controller]")]
    public class HistorySnapshotsController : ControllerBase
    {
        private readonly HistorySnapshotService _historySnapShotService;
        private readonly IMapper _mapper;

        public HistorySnapshotsController(HistorySnapshotService historySnapShotService, IMapper mapper)
        {
            _historySnapShotService = historySnapShotService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<DiplomaGenerationLogResponseDto>>> GetHistory()
        {    
            var snapshots = await _historySnapShotService.GetHistorySnapshots();
            return _mapper.Map<List<DiplomaGenerationLogResponseDto>>(snapshots);
        }
    }
}