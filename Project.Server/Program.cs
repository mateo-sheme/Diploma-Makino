using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Project.Server.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(option => option.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDistributedMemoryCache(); // Required for session storage
builder.Services.AddSession(options => {
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true; // Make session cookie essential
    options.IdleTimeout = TimeSpan.FromMinutes(30);
});

builder.Services.AddSession(options => {
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.IdleTimeout = TimeSpan.FromMinutes(30);
});

var app = builder.Build();

app.UseHttpsRedirection();

app.UseSession();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");


app.Run();
