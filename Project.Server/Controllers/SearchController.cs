using Microsoft.AspNetCore.Mvc;

namespace Project.Server.Controllers
{
    public class SearchController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
