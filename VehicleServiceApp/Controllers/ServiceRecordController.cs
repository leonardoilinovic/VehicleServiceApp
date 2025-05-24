using Microsoft.AspNetCore.Mvc;
using VehicleServiceApp.Data;
using VehicleServiceApp.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace VehicleServiceApp.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceRecordController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ServiceRecordController> _logger;

        public ServiceRecordController(AppDbContext context, ILogger<ServiceRecordController> logger)
        {
            _context = context;
            _logger = logger;
        }

        public class ServiceRecordDto
        {
            public int Id { get; set; }
            public DateTime ServiceStart { get; set; }
            public DateTime ServiceEnd { get; set; }
            public decimal TotalCost { get; set; }
            public int VehicleId { get; set; }
            public List<ServiceTaskDto> Tasks { get; set; }
        }

        public class ServiceTaskDto
        {
            public int Id { get; set; }
            public string Description { get; set; }
            public decimal Cost { get; set; }
        }

        public class CreateServiceRecordDto
        {
            public DateTime ServiceStart { get; set; }
            public DateTime ServiceEnd { get; set; }
            public decimal TotalCost { get; set; }
            public int VehicleId { get; set; }
            public List<int> TaskIds { get; set; }
        }

        public class UpdateServiceTasksDto
        {
            public List<int> TaskIds { get; set; }
        }

        // GET: api/ServiceRecord
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceRecordDto>>> GetServiceRecords()
        {
            var serviceRecords = await _context.ServiceRecords
                .Include(sr => sr.Tasks)
                .Select(sr => new ServiceRecordDto
                {
                    Id = sr.Id,
                    ServiceStart = sr.ServiceStart,
                    ServiceEnd = sr.ServiceEnd,
                    TotalCost = sr.TotalCost,
                    VehicleId = sr.VehicleId,
                    Tasks = sr.Tasks.Select(t => new ServiceTaskDto
                    {
                        Id = t.Id,
                        Description = t.Description,
                        Cost = t.Cost
                    }).ToList()
                })
                .ToListAsync();

            return Ok(serviceRecords);
        }

        // GET: api/ServiceRecord/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceRecordDto>> GetServiceRecord(int id)
        {
            var serviceRecord = await _context.ServiceRecords
                .Include(sr => sr.Tasks)
                .FirstOrDefaultAsync(sr => sr.Id == id);

            if (serviceRecord == null) return NotFound();

            return new ServiceRecordDto
            {
                Id = serviceRecord.Id,
                ServiceStart = serviceRecord.ServiceStart,
                ServiceEnd = serviceRecord.ServiceEnd,
                TotalCost = serviceRecord.TotalCost,
                VehicleId = serviceRecord.VehicleId,
                Tasks = serviceRecord.Tasks.Select(t => new ServiceTaskDto
                {
                    Id = t.Id,
                    Description = t.Description,
                    Cost = t.Cost
                }).ToList()
            };
        }

        // POST: api/ServiceRecord
        [HttpPost]
        public async Task<ActionResult<ServiceRecord>> PostServiceRecord([FromBody] CreateServiceRecordDto dto)
        {
            try
            {
                var vehicle = await _context.Vehicles.FindAsync(dto.VehicleId);
                if (vehicle == null) return NotFound("Vehicle not found.");

                var tasks = await _context.ServiceTasks
                    .Where(t => dto.TaskIds.Contains(t.Id))
                    .ToListAsync();

                var serviceRecord = new ServiceRecord
                {
                    ServiceStart = dto.ServiceStart.ToUniversalTime(),
                    ServiceEnd = dto.ServiceEnd.ToUniversalTime(),
                    TotalCost = dto.TotalCost,
                    VehicleId = dto.VehicleId,
                    Vehicle = vehicle,
                    Tasks = tasks
                };

                _context.ServiceRecords.Add(serviceRecord);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetServiceRecord", new { id = serviceRecord.Id }, serviceRecord);
            }
            catch (Exception ex)
            {
                // Log full error (inner exception)
                _logger.LogError(ex, "Error saving service record");
                return StatusCode(500, $"Internal server error: {ex.Message} --- Inner: {ex.InnerException?.Message}");
            }
        }


        // PUT: api/ServiceRecord/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutServiceRecord(int id, [FromBody] CreateServiceRecordDto dto)
        {
            var serviceRecord = await _context.ServiceRecords
                .Include(sr => sr.Tasks)
                .FirstOrDefaultAsync(sr => sr.Id == id);

            if (serviceRecord == null) return NotFound();

            serviceRecord.ServiceStart = dto.ServiceStart;
            serviceRecord.ServiceEnd = dto.ServiceEnd;
            serviceRecord.TotalCost = dto.TotalCost;
            serviceRecord.VehicleId = dto.VehicleId;

            var tasks = await _context.ServiceTasks
                .Where(t => dto.TaskIds.Contains(t.Id))
                .ToListAsync();

            serviceRecord.Tasks = tasks;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/ServiceRecord/{id}/tasks
        [HttpPut("{id}/tasks")]
        public async Task<IActionResult> UpdateServiceTasks(int id, [FromBody] UpdateServiceTasksDto dto)
        {
            var serviceRecord = await _context.ServiceRecords
                .Include(sr => sr.Tasks)
                .FirstOrDefaultAsync(sr => sr.Id == id);

            if (serviceRecord == null) return NotFound();

            var tasks = await _context.ServiceTasks
                .Where(t => dto.TaskIds.Contains(t.Id))
                .ToListAsync();

            serviceRecord.Tasks = tasks;
            await _context.SaveChangesAsync();

            return Ok(serviceRecord);
        }

        // DELETE: api/ServiceRecord/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServiceRecord(int id)
        {
            var serviceRecord = await _context.ServiceRecords
                .Include(sr => sr.Tasks)
                .FirstOrDefaultAsync(sr => sr.Id == id);

            if (serviceRecord == null) return NotFound();

            _context.ServiceRecords.Remove(serviceRecord);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ServiceRecordExists(int id)
        {
            return _context.ServiceRecords.Any(e => e.Id == id);
        }
    }
}
