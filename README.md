# Sustav za Upravljanje Servisom Vozila (Vehicle Service Management System)

Ovo je web aplikacija razvijena za upravljanje servisima vozila, klijentima i vozilima. Uključuje funkcionalnosti za autentifikaciju (registraciju i prijavu), dodavanje klijenata i vozila, te zakazivanje i pregled servisnih zapisa putem interaktivnog kalendara.

## Tehnologije Korištene

* **Frontend:** React, TypeScript, Axios, React Hook Form, React Query, FullCalendar, React Toastify, Framer Motion, Tailwind CSS
* **Backend:** ASP.NET Core Web API (C#)
* **Baza Podataka:** PostgreSQL
* **Kontejnerizacija:** Docker, Docker Compose

## Preduvjeti

Da biste pokrenuli ovaj projekt, trebat će vam sljedeće instalirano na vašem računalu:

1.  **Git:**
    * Preuzmite i instalirajte s [Git web stranice](https://git-scm.com/downloads).
    * Provjerite radi li Git tako da otvorite terminal/Command Prompt i upišete:
        ```bash
        git --version
        ```
        Trebali biste vidjeti broj verzije.
2.  **Docker Desktop** (ili Docker Engine):
    * Preuzmite i instalirajte s [Docker web stranice](https://www.docker.com/products/docker-desktop/).
    * Provjerite radi li Docker tako da otvorite terminal/Command Prompt i upišete:
        ```bash
        docker --version
        docker compose version
        ```
        Trebali biste vidjeti brojeve verzija.
3.  **(Opcionalno za lokalni frontend/backend razvoj, ali preporučeno):**
    * **Node.js i npm:** Za pokretanje React frontenda lokalno. Preuzmite s [Node.js web stranice](https://nodejs.org/en/download/). Provjerite s `node -v` i `npm -v`.
    * **.NET SDK:** Za pokretanje ASP.NET Core backenda lokalno. Preuzmite s [Microsoft .NET web stranice](https://dotnet.microsoft.com/download). Provjerite s `dotnet --version`.

## Struktura Projekta

Projekt je organiziran u sljedeće glavne mape:

* `VehicleServiceApp/`: Sadrži ASP.NET Core backend API projekt.
* `frontend/`: Sadrži React frontend aplikaciju.
* `docker-compose.yml`: Konfiguracijska datoteka za Docker Compose koja definira kako pokrenuti sve servise (backend, bazu podataka, frontend) zajedno.

---

## 🚀 Pokretanje Aplikacije s Docker Compose (Preporučeno za Brzo Postavljanje)

Ovo je najjednostavniji način za pokretanje cijele aplikacije, jer ne zahtijeva zasebnu instalaciju .NET-a, Node.js-a ili PostgreSQL-a na vašem sustavu.

1.  **Klonirajte ili preuzmite projekt:**
    Ako još niste, preuzmite cijeli projekt na svoje računalo. Ako koristite Git:
    ```bash
    git clone <URL_vašeg_GitHub_repozitorija>
    cd NazivVašegProjektnogFoldera
    ```
    (Zamijenite `<URL_vašeg_GitHub_repozitorija>` sa stvarnim URL-om vašeg repozitorija na GitHubu).

2.  **Navigirajte do korijena projekta:**
    Otvorite terminal (Command Prompt na Windows, Terminal na macOS/Linux) i navigirajte do glavnog foldera projekta (onog koji sadrži `VehicleServiceApp`, `frontend` i `docker-compose.yml`).
    ```bash
    cd /putanja/do/NazivVašegProjektnogFoldera
    ```

3.  **Pokrenite servise:**
    Iz korijena projekta, izvršite sljedeću naredbu:
    ```bash
    docker-compose up --build -d
    ```
    * `up`: Pokreće sve servise definirane u `docker-compose.yml`.
    * `--build`: Osigurava da se Docker slike izgrade iz vašeg koda (backend i frontend) prije pokretanja. Ovo je važno kada prvi put pokrećete ili kada ste napravili promjene u kodu.
    * `-d`: Pokreće kontejnere u "detached" načinu (u pozadini), tako da možete nastaviti koristiti terminal.

    Ovo će potrajati nekoliko minuta dok se preuzmu potrebne Docker slike (PostgreSQL), izgrade vaše aplikacije i pokrenu svi servisi. Pratite ispis u terminalu.

4.  **Pristup aplikaciji:**
    Nakon što su svi servisi uspješno pokrenuti, aplikacija će biti dostupna u vašem web pregledniku na adresi:
    [http://localhost:3000](http://localhost:3000)

5.  **Perzistencija Podataka (Važno!)**
    Aplikacija koristi PostgreSQL bazu podataka koja se pokreće unutar Dockera. Podaci baze pohranjuju se u Docker "volumenu" nazvanom `pgdata`.

    * **Zaustavljanje aplikacije bez brisanja podataka:**
        Ako želite zaustaviti kontejnere, ali zadržati sve podatke koje ste unijeli (registracije, klijenti, vozila), koristite:
        ```bash
        docker-compose down
        ```
        Sljedeći put kada pokrenete `docker-compose up -d`, baza podataka će biti u istom stanju u kojem ste je ostavili.

    * **Potpuno brisanje i resetiranje aplikacije (uključujući podatke):**
        Ako želite potpuno resetirati aplikaciju na "svježe" stanje (uključujući brisanje svih podataka iz baze), zaustavite kontejnere i obrišite volumene pomoću:
        ```bash
        docker-compose down -v
        ```
        Sljedeći put kada pokrenete `docker-compose up --build -d`, pokrenut će se s praznom bazom podataka.

---

## 💻 Pokretanje Aplikacije Lokalno (Za Razvoj)

Ova metoda zahtijeva da imate Node.js, npm i .NET SDK instalirane na vašem računalu. Baza podataka će i dalje raditi u Dockeru.

1.  **Pokrenite PostgreSQL bazu podataka u Dockeru:**
    Otvorite terminal u korijenu projekta i pokrenite samo `db` servis:
    ```bash
    docker-compose up db -d
    ```
    Ovo će pokrenuti samo PostgreSQL bazu podataka.

2.  **Pokrenite Backend (ASP.NET Core API):**
    * Otvorite **novi terminal** (držite onaj za Docker otvoren).
    * Navigirajte do backend foldera:
        ```bash
        cd VehicleServiceApp
        ```
    * Pokrenite backend API:
        ```bash
        dotnet run
        ```
        Backend će se pokrenuti, vjerojatno na `http://localhost:5026` (provjerite ispis u terminalu).

3.  **Pokrenite Frontend (React App):**
    * Otvorite **još jedan novi terminal** (držite prethodna dva otvorena).
    * Navigirajte do frontend foldera:
        ```bash
        cd frontend
        ```
    * **Instalirajte ovisnosti (samo prvi put):**
        ```bash
        npm install
        ```
    * **Konfigurirajte varijable okruženja:**
        Kreirajte datoteku naziva `.env` u folderu `frontend/`.
        Kopirajte sadržaj iz `frontend/.env.example` u nju.
        Osigurajte da imate sljedeću liniju u vašoj novoj `.env` datoteci:
        ```
        REACT_APP_API_URL=http://localhost:5026
        ```
        (Ako vaš backend radi na drugom portu, prilagodite ovu vrijednost.)

    * **Pokrenite frontend aplikaciju:**
        ```bash
        npm start
        ```
        Ovo će pokrenuti razvojni server i automatski otvoriti aplikaciju u vašem pregledniku na adresi:
        [http://localhost:3000](http://localhost:3000)

4.  **Zaustavljanje lokalnog razvoja:**
    * U svakom terminalu gdje se nešto pokreće (backend, frontend), pritisnite `Ctrl + C` da zaustavite proces.
    * Kada završite, možete zaustaviti i Docker kontejner za bazu podataka:
        ```bash
        cd /putanja/do/NazivVašegProjektnogFoldera
        docker-compose down db
        ```
        (Ponovno, ne koristite `-v` ako želite zadržati podatke u bazi.)

---

## Česta Pitanja (FAQ)

* **Zašto dobivam "401 Unauthorized" grešku nakon prijave?**
    Ovo se obično događa ako token za autentifikaciju nije ispravno spremljen ili poslan s naknadnim zahtjevima. Provjerite da je `REACT_APP_API_URL` ispravno konfiguriran i da vaša aplikacija ispravno rukuje tokenima u `localStorage`.
* **Zašto se moji podaci iz baze gube svaki put kada pokrenem Docker Compose?**
    Vjerojatno koristite `docker-compose down -v` što briše Docker volumene (gdje se podaci baze pohranjuju). Koristite samo `docker-compose down` da biste zadržali podatke.
* **Aplikacija ne radi, a u konzoli preglednika vidim "CORS error"?**
    To znači da vaš backend (ASP.NET Core) ne dopušta zahtjeve s domene na kojoj se frontend nalazi. Provjerite CORS konfiguraciju u vašem ASP.NET Core startup kodu da dopušta `http://localhost:3000`. (U ovom projektu bi to trebalo biti već konfigurirano, ali ako naiđete na problem, ovo je čest uzrok.)
