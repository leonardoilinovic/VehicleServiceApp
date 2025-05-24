using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Logging;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace VehicleServiceApp.Services
{
    public class TokenService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<TokenService> _logger;

        public TokenService(IConfiguration configuration, ILogger<TokenService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public string GenerateJwtToken(string email)
        {
            try
            {
                var secretKey = _configuration["Jwt:Key"];
                if (string.IsNullOrWhiteSpace(secretKey) || Encoding.UTF8.GetBytes(secretKey).Length < 16) // Provjeravamo minimalnu dužinu ključa
                {
                    _logger.LogError("JWT ključ nije ispravno postavljen ili je prekratak.");
                    throw new ArgumentException("JWT ključ mora biti najmanje 16 znakova dug.");
                }

                var issuer = _configuration["Jwt:Issuer"];
                var audience = _configuration["Jwt:Audience"];

                if (string.IsNullOrEmpty(issuer) || string.IsNullOrEmpty(audience))
                {
                    _logger.LogError("JWT postavke za Issuer ili Audience nisu postavljene.");
                    throw new ArgumentException("JWT postavke za Issuer i Audience moraju biti definirane.");
                }

                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Aud, audience)
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: issuer,
                    audience: audience,
                    claims: claims,
                    expires: DateTime.UtcNow.AddHours(2),
                    signingCredentials: creds
                );

                var generatedToken = new JwtSecurityTokenHandler().WriteToken(token);
                _logger.LogInformation($"JWT token za {email} uspješno generiran.");
                return generatedToken;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Greška prilikom generiranja JWT tokena za {email}: {ex.Message}");
                throw;
            }
        }
    }
}
