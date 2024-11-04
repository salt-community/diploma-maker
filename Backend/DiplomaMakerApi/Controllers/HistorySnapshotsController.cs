using AutoMapper;
using DiplomaMakerApi.Models;
using DiplomaMakerApi.Services;
using Microsoft.AspNetCore.Authorization;
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
        // [Authorize]
        public async Task<ActionResult<List<DiplomaSnapshotResponseDto>>> GetHistory()
        {    
            var snapshots = await _historySnapShotService.GetHistorySnapshots();
            return _mapper.Map<List<DiplomaSnapshotResponseDto>>(snapshots);
        }

        [HttpGet("{verificationCode}")]
        [AllowAnonymous]
        public async Task<ActionResult<List<DiplomaSnapshotResponseDto>>> GetHistoryByVerificationCode(string verificationCode)
        {
            var snapshots = await _historySnapShotService.GetHistorySnapshotsByVerificationCode(verificationCode);
            return _mapper.Map<List<DiplomaSnapshotResponseDto>>(snapshots);
        }

        [HttpPut("/api/make-active-historysnapshot")]
        // [Authorize]
        public async Task<ActionResult<List<DiplomaSnapshotResponseDto>>> MakeActiveHistorySnapshot([FromBody] MakeActiveSnapshotRequestDto makeActiveSnapshotRequestDto)
        {
            var changedHistorySnapshot = await _historySnapShotService.MakeActiveHistorySnapshot(makeActiveSnapshotRequestDto);
            return _mapper.Map<List<DiplomaSnapshotResponseDto>>(changedHistorySnapshot);
        }
    }
}