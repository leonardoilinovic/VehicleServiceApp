using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Text;
using System.Text.Json.Serialization; // Dodano za ReferenceHandler
using VehicleServiceApp.Data;
using VehicleServiceApp.Models;
using FluentValidation;
using FluentValidation.AspNetCore;
using VehicleServiceApp.Services; // Dodano za TokenService
using Microsoft.Extensions.Logging; // Za logiranje
using System.Text.Json.Serialization;


namespace VehicleServiceApp
{
    public class Program
    {
        public static void Main(string[] args)
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
            builder.Services.AddValidatorsFromAssemblyContaining<ServiceRecordValidator>();

            // 4. Omogući CORS za frontend aplikaciju
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend",
                    builder => builder.WithOrigins("http://localhost:3000")  // Adresa tvog frontend app-a
                                      .AllowAnyMethod()
                                      .AllowAnyHeader());
            });

            // 5. Konfiguracija JWT autentifikacije (JWT token)
            var jwtKey = builder.Configuration["Jwt:Key"]; // Preuzmi ključ iz appsettings.json

            // Prebacivanje Base64 ključa u bajtove
            var keyBytes = Convert.FromBase64String(jwtKey);

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;  // Za razvojnu verziju
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
            builder.Services.AddSingleton<TokenService>();  // Dodano za TokenService

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

            // 10. Omogući Swagger UI za razvojni okoliš
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger(); // Omogućava Swagger
                app.UseSwaggerUI(); // Omogućava Swagger UI za testiranje API-ja
            }

            // 11. Konfiguracija HTTP request pipeline-a
            // Postavi CORS prije Authentication i Authorization middleware-a
            app.UseCors("AllowFrontend"); // Omogući CORS za našu domenu

            app.UseHttpsRedirection();  // Omogući HTTPS redirekciju
            app.UseAuthentication();  // Omogućava autentifikaciju
            app.UseAuthorization();  // Omogućava autorizaciju

            // 12. Mapiranje API ruta (kontroleri)
            app.MapControllers();

            // 13. Testna ruta za provjeru API-ja
            app.MapGet("/", () => "Vehicle Service API");

            // 14. Pokreni aplikaciju
            app.Run();
        }
    }
}
