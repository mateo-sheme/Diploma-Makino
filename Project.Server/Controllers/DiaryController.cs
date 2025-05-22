/*using Microsoft.AspNetCore.Mvc;
using Project.Server.Data;
using Project.Server.Entities;
using System.Security.Claims;

namespace Project.Server.Controllers
{
    [ApiController]
    [Route("api/diary")]
    public class DiaryController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly IWebHostEnvironment _hostEnvironment;

        public DiaryController(ApplicationDbContext db, IWebHostEnvironment hostEnvironment)
        {
            _db = db;
            _hostEnvironment = hostEnvironment;
        }

        [HttpGet("mycars")]
        public async Task<ActionResult<IEnumerable<Diary_Car>>> GetUserCars()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var cars = await _db.Diary_Cars
                .Where(c => c.User_ID == userId)
                .Include(c => c.MaintenanceRecords)
                .ToListAsync();

            return Ok(cars);
        }

        [HttpPost("addcar")]
        public async Task<ActionResult<Diary_Car>> AddCar([FromForm] Diary_Car car, [FromForm] IFormFile carImage)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            car.User_ID = userId;

            if (carImage != null && carImage.Length > 0)
            {
                using var memoryStream = new MemoryStream();
                await carImage.CopyToAsync(memoryStream);
                car.CarImage = memoryStream.ToArray();
                car.ContentType = carImage.ContentType;
            }

            _db.Diary_Cars.Add(car);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCar), new { id = car.User_Car_ID }, car);
        }

        [HttpPost("addmaintenance")]
        public async Task<ActionResult> AddMaintenanceRecord([FromBody] Maintenance_Record record)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            // Verify the car belongs to the user
            var car = await _db.Diary_Cars
                .FirstOrDefaultAsync(c => c.User_Car_ID == record.User_Car_ID && c.User_ID == userId);

            if (car == null) return NotFound("Car not found");

            // Update car's current kilometers if the new value is higher
            if (record.Kilometers > car.Current_Kilometers)
            {
                car.Current_Kilometers = record.Kilometers;
            }

            _db.MaintenanceRecords.Add(record);
            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("maintenance/{carId}")]
        public async Task<ActionResult<IEnumerable<MaintenanceRecord>>> GetMaintenanceHistory(int carId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var car = await _db.Diary_Cars
                .FirstOrDefaultAsync(c => c.User_Car_ID == carId && c.User_ID == userId);

            if (car == null) return NotFound("Car not found");

            var records = await _db.MaintenanceRecords
                .Where(r => r.User_Car_ID == carId)
                .OrderByDescending(r => r.RecordDate)
                .ToListAsync();

            return Ok(records);
        }

        [HttpGet("upcomingmaintenance")]
        public async Task<ActionResult> GetUpcomingMaintenance()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var cars = await _db.Diary_Cars
                .Where(c => c.User_ID == userId)
                .Include(c => c.MaintenanceRecords)
                .ToListAsync();

            var result = cars.Select(c => new
            {
                Car = c,
                NextOilChange = GetNextMaintenanceDue(c, "OilChange", 10000),
                NextEngineCheck = GetNextMaintenanceDue(c, "EngineCheck", 100000),
                InsuranceDue = c.InsuranceExpiry.HasValue && c.InsuranceExpiry < DateTime.UtcNow.AddMonths(1),
                InspectionDue = c.InspectionExpiry.HasValue && c.InspectionExpiry < DateTime.UtcNow.AddMonths(1)
            });

            return Ok(result);
        }

        private (int? kmDue, DateTime? dateDue) GetNextMaintenanceDue(Diary_Car car, string maintenanceType, int interval)
        {
            var lastRecord = car.MaintenanceRecords
                .Where(r => r.MaintenanceType == maintenanceType)
                .OrderByDescending(r => r.RecordDate)
                .FirstOrDefault();

            if (lastRecord == null) return (interval, null); // First maintenance due at interval

            var kmDue = lastRecord.Kilometers + interval;
            return (kmDue, null);
        }
    }
}
*/