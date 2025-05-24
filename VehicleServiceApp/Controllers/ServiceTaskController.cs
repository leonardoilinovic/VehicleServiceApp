using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VehicleServiceApp.Data;
using VehicleServiceApp.Models;

namespace VehicleServiceApp.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceTaskController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServiceTaskController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ServiceTask
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceTask>>> GetServiceTasks()
        {
            return await _context.ServiceTasks.ToListAsync();
        }

        // GET: api/ServiceTask/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceTask>> GetServiceTask(int id)
        {
            var serviceTask = await _context.ServiceTasks.FindAsync(id);

            if (serviceTask == null)
            {
                return NotFound();
            }

            return serviceTask;
        }

        // PUT: api/ServiceTask/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutServiceTask(int id, ServiceTask serviceTask)
        {
            if (id != serviceTask.Id)
            {
                return BadRequest();
            }

            _context.Entry(serviceTask).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServiceTaskExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/ServiceTask
        [HttpPost]
        public async Task<ActionResult<ServiceTask>> PostServiceTask(ServiceTask serviceTask)
        {
            _context.ServiceTasks.Add(serviceTask);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetServiceTask", new { id = serviceTask.Id }, serviceTask);
        }

        // DELETE: api/ServiceTask/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServiceTask(int id)
        {
            var serviceTask = await _context.ServiceTasks.FindAsync(id);
            if (serviceTask == null)
            {
                return NotFound();
            }

            _context.ServiceTasks.Remove(serviceTask);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ServiceTaskExists(int id)
        {
            return _context.ServiceTasks.Any(e => e.Id == id);
        }
    }
}
