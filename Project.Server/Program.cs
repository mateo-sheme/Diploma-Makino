using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Project.Server.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(option =>
    option.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options => {
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.IdleTimeout = TimeSpan.FromMinutes(30);
});

var app = builder.Build();


app.UseDefaultFiles(); 
app.UseStaticFiles(); 

app.UseHttpsRedirection();
app.UseSession();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("/index.html"); 

app.Run();
