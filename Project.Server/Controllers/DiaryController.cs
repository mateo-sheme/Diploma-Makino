using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project.Server.Data;
using Project.Server.Entities;
using System.Security.Claims;

namespace Project.Server.Controllers
{
    [ApiController]
    [Route("api/diarycar")]
    public class DiaryCarController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly IWebHostEnvironment _hostEnvironment;

        public DiaryCarController(ApplicationDbContext db, IWebHostEnvironment hostEnvironment)
        {
            _db = db;
            _hostEnvironment = hostEnvironment;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Diary_Car>>> GetUserCars()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
            {
                return Unauthorized("User not authenticated.");
            }

            var cars = await _db.Diary_Car
                .Where(c => c.User_ID == userId)
                .Include(c => c.Maintenance_Record)
                .ToListAsync();

            return Ok(cars);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Diary_Car>> GetCar(int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
            {
                return Unauthorized("User not authenticated.");
            }

            var car = await _db.Diary_Car
                .Include(c => c.Maintenance_Record)
                .FirstOrDefaultAsync(c => c.User_Car_ID == id && c.User_ID == userId);

            if (car == null)
            {
                return NotFound();
            }
            return Ok(car);
        }

        [HttpGet("{id}/image")]
        public IActionResult GetCarImage(int id)
        {
            var car = _db.Diary_Car.FirstOrDefault(c => c.User_Car_ID == id);
            if (car == null || car.Car_Image == null || car.Car_Image.Length == 0)
            {
                return NotFound();
            }

            return File(car.Car_Image, car.Content_Type);
        }

        [HttpPost]
        public async Task<ActionResult<Diary_Car>> AddCar([FromForm] Diary_Car car, [FromForm] IFormFile Car_Image)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
            {
                return Unauthorized("User not authenticated.");
            }

            car.User_ID = userId.Value;

            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Invalid form data",
                    errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                });
            }

            if (Car_Image != null && Car_Image.Length > 0)
            {
                using var memoryStream = new MemoryStream();
                await Car_Image.CopyToAsync(memoryStream);
                car.Car_Image = memoryStream.ToArray();
                car.Content_Type = Car_Image.ContentType;
            }
            else
            {
                car.Car_Image = Array.Empty<byte>();
                car.Content_Type = string.Empty;
            }

            _db.Diary_Car.Add(car);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCar), new { id = car.User_Car_ID }, car);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Diary_Car>> UpdateCar(int id, [FromForm] Diary_Car carUpdate, [FromForm] IFormFile carImage)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
            {
                return Unauthorized("User not authenticated.");
            }

            var existingCar = await _db.Diary_Car
                .FirstOrDefaultAsync(c => c.User_Car_ID == id && c.User_ID == userId);

            if (existingCar == null)
            {
                return NotFound();
            }

            existingCar.Nickname_Car = carUpdate.Nickname_Car ?? existingCar.Nickname_Car;
            existingCar.VIN = carUpdate.VIN ?? existingCar.VIN;
            existingCar.Brand = carUpdate.Brand ?? existingCar.Brand;
            existingCar.Model = carUpdate.Model ?? existingCar.Model;
            existingCar.License_Plate = carUpdate.License_Plate ?? existingCar.License_Plate;
            existingCar.Current_Kilometers = carUpdate.Current_Kilometers > 0
                ? carUpdate.Current_Kilometers
                : existingCar.Current_Kilometers;
            existingCar.Fuel = carUpdate.Fuel ?? existingCar.Fuel;
            existingCar.Insurance_Expiry = carUpdate.Insurance_Expiry ?? existingCar.Insurance_Expiry;
            existingCar.Inspection_Expiry = carUpdate.Inspection_Expiry ?? existingCar.Inspection_Expiry;

            if (carImage != null && carImage.Length > 0)
            {
                using var memoryStream = new MemoryStream();
                await carImage.CopyToAsync(memoryStream);
                existingCar.Car_Image = memoryStream.ToArray();
                existingCar.Content_Type = carImage.ContentType;
            }

            await _db.SaveChangesAsync();
            return Ok(existingCar);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCar(int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
            {
                return Unauthorized("User not authenticated.");
            }

            var car = await _db.Diary_Car
                .FirstOrDefaultAsync(c => c.User_Car_ID == id && c.User_ID == userId);

            if (car == null)
            {
                return NotFound();
            }

            _db.Diary_Car.Remove(car);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("{carId}/maintenance")]
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

        [HttpPost("{carId}/maintenance")]
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

        [HttpPut("{carId}/maintenance/{recordId}")]
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

        [HttpDelete("{carId}/maintenance/{recordId}")]
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