using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project.Server.Data;
using Project.Server.Entities;
using System.Security.Claims;

namespace Project.Server.Controllers
{
    [ApiController]
    [Route("api/maintenance")]
    public class MaintenanceController : Controller
    {
        private readonly ApplicationDbContext _db;

        public MaintenanceController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("{carId}")]
        public async Task<ActionResult<IEnumerable<Maintenance_Record>>> GetMaintenanceRecords(int carId)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
            {
                return Unauthorized("User not authenticated.");
            }

            var carExists = await _db.Diary_Car
                .AnyAsync(c => c.User_Car_ID == carId && c.User_ID == userId);

            if (!carExists)
            {
                return NotFound("Car not found");
            }

            var records = await _db.Maintenance_Record
                .Where(r => r.User_Car_ID == carId)
                .OrderByDescending(r => r.Record_Date)
                .ToListAsync();

            return Ok(records);
        }

        [HttpPost("{carId}")]
        public async Task<ActionResult<Maintenance_Record>> AddMaintenanceRecord(int carId, [FromBody] Maintenance_Record record)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
            {
                return Unauthorized("User not authenticated.");
            }

            var car = await _db.Diary_Car
                .FirstOrDefaultAsync(c => c.User_Car_ID == carId && c.User_ID == userId);

            if (car == null)
            {
                return NotFound("Car not found");
            }

            record.User_Car_ID = carId;
            record.Record_Date = DateTime.UtcNow;

            _db.Maintenance_Record.Add(record);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMaintenanceRecords), new { carId = carId }, record);
        }

        [HttpPut("{carId}/{recordId}")]
        public async Task<ActionResult<Maintenance_Record>> UpdateMaintenanceRecord(int carId, int recordId, [FromBody] Maintenance_Record recordUpdate)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
            {
                return Unauthorized("User not authenticated.");
            }

            var existingRecord = await _db.Maintenance_Record
                .Include(r => r.Car)
                .FirstOrDefaultAsync(r => r.Record_ID == recordId &&
                                        r.User_Car_ID == carId &&
                                        r.Car.User_ID == userId);

            if (existingRecord == null)
            {
                return NotFound("Record not found");
            }

            existingRecord.Kilometers = recordUpdate.Kilometers;
            existingRecord.Maintenance_Type = recordUpdate.Maintenance_Type;
            existingRecord.Next_Maintenance_Km = recordUpdate.Next_Maintenance_Km;
            existingRecord.Notes = recordUpdate.Notes;

            await _db.SaveChangesAsync();
            return Ok(existingRecord);
        }

        [HttpDelete("{carId}/{recordId}")]
        public async Task<IActionResult> DeleteMaintenanceRecord(int carId, int recordId)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
            {
                return Unauthorized("User not authenticated.");
            }

            var record = await _db.Maintenance_Record
                .Include(r => r.Car)
                .FirstOrDefaultAsync(r => r.Record_ID == recordId &&
                                        r.User_Car_ID == carId &&
                                        r.Car.User_ID == userId);

            if (record == null)
            {
                return NotFound("Record not found");
            }

            _db.Maintenance_Record.Remove(record);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}