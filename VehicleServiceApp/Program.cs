using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Text;
using System.Text.Json.Serialization;
using VehicleServiceApp.Data;
using VehicleServiceApp.Models;
using FluentValidation;
using FluentValidation.AspNetCore;
using VehicleServiceApp.Services;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks; // Dodano za Task.CompletedTask

namespace VehicleServiceApp
{
    public class Program
    {
        public static async Task Main(string[] args) // PROMJENA: Main metoda postaje async Task
        {
            var builder = WebApplication.CreateBuilder(args);

            // 1. Dodaj povezivanje s bazom podataka koristeći Npgsql
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

            // 2. Dodaj Identity za korisnike (autentifikacija i autorizacija)
            builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<AppDbContext>()
                .AddDefaultTokenProviders();

            builder.Logging.ClearProviders();
            builder.Logging.AddConsole();

            // 3. Dodaj FluentValidation za validaciju podataka
            // Važno: Treba dodati FluentValidation services kao MVC filter
            builder.Services.AddFluentValidationAutoValidation(); // Dodano za automatsku validaciju
            builder.Services.AddValidatorsFromAssemblyContaining<ServiceRecordValidator>(); // OVO JE ISPRAVNO

            // 4. Omogući CORS za frontend aplikaciju
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend",
                    policy => policy.WithOrigins("http://localhost:3000") // Adresa tvog frontend app-a
                                    .AllowAnyMethod()
                                    .AllowAnyHeader()
                                    .AllowCredentials()); // Dodano AllowCredentials za slanje tokena/cookies, ako ih koristiš
            });

            // 5. Konfiguracija JWT autentifikacije (JWT token)
            // Uklonjen je Convert.FromBase64String(jwtKey) jer SymmetricSecurityKey radi s UTF8.GetBytes direktno.
            // Provjeri da ti je Jwt:Key u appsettings.json string, ne base64 encoded.
            // Ako je ključ predugačak zbog Base64 encodinga, može biti problem.
            // Najbolje je da je u appsettings.json ključ samo dugačak string.
            // Npr. "Jwt:Key": "OvoJeTakoTajnaSifraZaJWTTokeneKojaMoraBitiDugackaNajmanje16Znakova"

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false; // Za razvojnu verziju - ok
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
                    ValidateIssuer = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"], // Provjera Issuera
                    ValidateAudience = true,
                    ValidAudience = builder.Configuration["Jwt:Audience"], // Provjera Audience
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero // Bez pomaka u životnom vijeku tokena
                };

                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        context.Response.Headers.Add("AuthenticationFailed", "True");
                        return Task.CompletedTask;
                    },
                    OnTokenValidated = context =>
                    {
                        context.Response.Headers.Add("TokenValidated", "True");
                        return Task.CompletedTask;
                    }
                };
            });

            // 6. Dodaj autorizaciju (kako bi koristili [Authorize] atribute na kontrolerima)
            builder.Services.AddAuthorization();

            // 7. Dodaj TokenService za generiranje JWT tokena
            builder.Services.AddSingleton<TokenService>(); // Dodano za TokenService

            // 8. Dodaj kontrolere i JSON opcije
            builder.Services.AddControllers()
                .AddJsonOptions(x =>
                {
                    x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                    x.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
                });

            // 9. Konfiguracija Swagger-a za testiranje API-ja i JWT autentifikaciju
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Upiši 'Bearer {token}' za autorizaciju"
                });
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                        },
                        new string[] {}
                    }
                });
            });

            var app = builder.Build();

            // ************************************************************************************************
            // ***** KLJUČNA PROMJENA: AUTOMATSKA PRIMJENA MIGRACIJA (Prebačeno OVDJE, PRIJE app.Run()) *****
            // ************************************************************************************************
            // Ovo osigurava da se migracije pokušaju primijeniti ODMAH nakon što se app izgradi,
            // ali PRIJE nego što aplikacija počne prihvaćati HTTP zahtjeve.
            // To omogućuje bazi podataka da se inicijalizira prije nego što se pokušaju obraditi prvi zahtjevi (npr. registracija).
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<AppDbContext>();
                    // Provjeravamo je li baza podataka već u redu, a ako nije, čekamo kratko i pokušavamo ponovno.
                    // Ovo je korisno jer db kontejner možda nije odmah potpuno spreman.
                    // Npgsql.NpgsqlException (0x80004005): Failed to connect ... Connection refused
                    // Ovo je greška koju smo dobili, a događa se kada backend pokuša pristupiti bazi,
                    // ali db kontejner još nije spreman.
                    await Task.Delay(5000); // Čekaj 5 sekundi prije prve migracije
                    context.Database.Migrate();
                    Console.WriteLine("Database migrations applied successfully."); // Dodao sam Console.WriteLine
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occurred while migrating the database.");
                    // Razmisli o tome da li želiš da se aplikacija zaustavi ovdje,
                    // ili da nastavi s radom s greškom migracije. Za Docker, često se želi zaustaviti.
                    // throw; // Ako želiš da se aplikacija sruši ako migracije ne uspiju
                }
            }
            // ************************************************************************************************


            // 10. Omogući Swagger UI za razvojni okoliš
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger(); // Omogućava Swagger
                app.UseSwaggerUI(); // Omogućava Swagger UI za testiranje API-ja
            }

            // 11. Konfiguracija HTTP request pipeline-a
            // Postavi CORS prije Authentication i Authorization middleware-a
            app.UseRouting(); // Dodano UseRouting explicitno ovdje jer je dobra praksa
            app.UseCors("AllowFrontend"); // Omogući CORS za našu domenu

            app.UseHttpsRedirection(); // Omogući HTTPS redirekciju (može se zakomentirati ako ne koristiš HTTPS)
            app.UseAuthentication(); // Omogućava autentifikaciju (MORA BITI PRIJE UseAuthorization)
            app.UseAuthorization(); // Omogućava autorizaciju (MORA BITI POSLIJE UseAuthentication)

            // 12. Mapiranje API ruta (kontroleri)
            app.MapControllers();

            // 13. Testna ruta za provjeru API-ja
            app.MapGet("/", () => "Vehicle Service API");

            // 14. Pokreni aplikaciju
            app.Run();
        }
    }
}