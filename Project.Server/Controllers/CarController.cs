using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project.Server.Data;
using Project.Server.Entities;

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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cars_Sale>>> GetCars ()
        {
            return await _db.Cars_Sale
                .Include(c => c.Images)
                .Include(c => c.User)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Cars_Sale>> GetCar(int id)
        {
            var car = await _db.Cars_Sale
                .Include(c => c.Images)
                .Include(c => c.User)
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
                return BadRequest(ModelState);
            }

            var carImages = new List<Car_Image>();  //empty list to store image records
            foreach (var imageFile in images) //loops through each uploaded image from images 
            {
                if (imageFile.Length>0)
                { 
                    var imagePath = $"images/cars/{Guid.NewGuid()}{Path.GetExtension(imageFile.FileName)}"; //gjeneron file name dhe extension

                carImages.Add(new Car_Image
                {
                    ImagePath = imagePath,
                    IsPrimary = carImages.Count == 0 // First image is primary
                });
            }
        }

            car.Images = carImages;
            car.User_ID = 1; 


            _db.Cars_Sale.Add(car);  //lidh application db context me metoden async qe te shtoje rresht tek tabela
            await _db.SaveChangesAsync(); //pret ndryshimin ne sql
            return CreatedAtAction(nameof(GetCar), new { ID = car.Car_ID }, car); //rikthen id te ruajtur
        }

    }
}
