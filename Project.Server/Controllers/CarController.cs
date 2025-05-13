using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project.Server.Data;
using Project.Server.Entities;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Project.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")] //routeri i api qe ben te dali te url id e makines
    public class CarController : Controller
    {
        private readonly ApplicationDbContext _db;

        public CarController(ApplicationDbContext db)
        {
            _db= db;
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Cars_Sale>>> SearchCars(
            [FromQuery] string brand = null,
            [FromQuery] string model = null,
            [FromQuery] string fuelType = null,
            [FromQuery] string transmission = null,
            [FromQuery] int? minPrice = null,
            [FromQuery] int? maxPrice = null,
            [FromQuery] int? minKm = null,
            [FromQuery] int? maxKm = null,
            [FromQuery] int? minYear = null,
            [FromQuery] int? maxYear = null)
        {
            try
            {
                var query = _db.Cars_Sale
                    .Include(c => c.Images)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(brand))
                query = query.Where(c => c.Brand.Contains(brand));
                if (!string.IsNullOrEmpty(model))
                    query = query.Where(c => c.Model.Contains(model));
                if (!string.IsNullOrEmpty(fuelType))
                    query = query.Where(c => c.Fuel == fuelType);
                if (!string.IsNullOrEmpty(transmission))
                    query = query.Where(c => c.Transmission == transmission);
                if (minPrice.HasValue)
                    query = query.Where(c => c.Price >= minPrice.Value);
                if (maxPrice.HasValue)
                    query = query.Where(c => c.Price <= maxPrice.Value);
                if (minKm.HasValue)
                    query = query.Where(c => c.Kilometers >= minKm.Value);
                if (maxKm.HasValue)
                    query = query.Where(c => c.Kilometers <= maxKm.Value);
                if (minYear.HasValue)
                    query = query.Where(c => c.Year >= minYear.Value);
                if (maxYear.HasValue)
                    query = query.Where(c => c.Year <= maxYear.Value);

            var results = await query.ToListAsync();
            return Ok(results);
        }
         catch (Exception ex)
    {
        return StatusCode(500, $"Error searching cars: {ex.Message}");
    }
}

        [HttpGet("{id}")]
        public async Task<ActionResult<Cars_Sale>> GetCar(int id)
        {
            var car = await _db.Cars_Sale
                .Include(c => c.Images)
                .FirstOrDefaultAsync(c => c.Car_ID == id);
            if (car == null)
            {
                return NotFound();
            }
            return Ok(car);
        }

        [HttpPost]
        public async Task<ActionResult<Cars_Sale>> CreateCar([FromForm] Cars_Sale car, [FromForm] List<IFormFile> images)
        {

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

            if (images == null || !images.Any())
            {
                return BadRequest(new { message = "At least one image is required" });
            }

            var carImages = new List<Car_Image>();  //empty list to store image records
            foreach (var imageFile in images) //loops through each uploaded image from images 
            {
                if (imageFile.Length>0)
                {
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "cars");
                    Directory.CreateDirectory(uploadsFolder);
                    var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(fileStream);
                    }

                carImages.Add(new Car_Image
                {
                    ImagePath = $"/images/cars/{uniqueFileName}",
                    IsPrimary = carImages.Count == 0 // First image is primary
                });
            }
        }

            car.Images = carImages;

            _db.Cars_Sale.Add(car);  //lidh application db context me metoden async qe te shtoje rresht tek tabela
            await _db.SaveChangesAsync(); //pret ndryshimin ne sql
            return CreatedAtAction(nameof(GetCar), new { ID = car.Car_ID }, car); //rikthen id te ruajtur
        }

    }
}
