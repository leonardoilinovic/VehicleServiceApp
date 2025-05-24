# Vehicle Service App

Ovo je .NET-based web aplikacija za servisiranje vozila, sa front-end dijelom te bazom podataka koja se hosta u Docker-u.

---

## 📦 Sadržaj repozitorija

- `.vs/`  
  Konfiguracija Visual Studio-a (ignore-ati u `.gitignore`).
- `VehicleServiceApp.sln`  
  .NET Solution file.
- `VehicleServiceApp/`  
  Backend projekti (API, Data, Core, WebUI).
- `frontend_backup/`  
  (Backup) Front-end aplikacija, npr. Angular/React/Vue.
- `docker-compose.yml`  
  Definicija za podizanje baze podataka (i eventualno drugih servisa).

---

## 🔧 Preduvjeti

- [Git](https://git-scm.com)  
- [.NET 7 SDK](https://dotnet.microsoft.com/download)  
- [Docker & Docker Compose](https://docs.docker.com/compose/)  
- (ako koristiš front-end) [Node.js + npm](https://nodejs.org)

---

## 🚀 Pokretanje lokalno

1. **Klone repo**  
   ```bash
   git clone https://github.com/<tvoj-user>/vehicle-service-app.git
   cd vehicle-service-app
