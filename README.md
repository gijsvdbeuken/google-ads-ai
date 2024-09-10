# Geen Gedoe | Google Ads AI

## 1. Voorbereiding

### 1.1 Benodigde Software Installeren

Download deze software-onderdelen om de Chrome-extensie te kunnen laten functioneren:

- [Node.js](https://nodejs.org/en/download/package-manager)
- [Git](https://git-scm.com/downloads)
- [Visual Studio Code (optioneel maar aanbevolen)](https://code.visualstudio.com/download)

### 1.2 Verbinden met OpenAI API

Volg deze stappen om verbinding te maken met de OpenAI API:

1. **OpenAI API-account aanmaken**  
   Ga naar [OpenAI API](https://openai.com/index/openai-api/) en registreer een account.

2. **API-sleutel genereren**  
   In je dashboard, ga naar "User API Keys" en maak een nieuwe API-sleutel aan. Sla deze sleutel veilig op.

3. **Tegoed toevoegen**  
   Voeg in de "Billing"-sectie van je profiel tegoed toe (meestal volstaat €5 - €10).

### 1.3 Chrome-extensie Installeren

Volg deze stappen om de Chrome-extensie lokaal te gebruiken:

1. **Map aanmaken**  
   Creëer een nieuwe map, bijvoorbeeld "Google Ads AI".

2. **Terminal openen**  
   Ga in de terminal naar je nieuw aangemaakte map.

3. **Project importeren**  
   Voer de volgende commando's een-voor-een uit:

   ```bash
   npm install
   ```

   ```bash
   git init
   ```

   ```bash
   git remote add origin https://github.com/gijsvdbeuken/google-ads-ai.git
   ```

   ```bash
   git pull origin main
   ```

4. **OpenAI API-sleutel toevoegen**  
   Maak in de hoofdmap een `.env`-bestand aan en voeg je OpenAI-sleutel op de volgende manier:

   ```bash
   OPENAI_API_KEY="jouw_api_sleutel"
   ```

Houd er rekening mee dat de variabele exact als `OPENAI_API_KEY=""` genoteerd moet zijn zonder spelfouten of andere wijzigingen.

5. **Extensie in Chrome laden**  
   Ga naar **Chrome** > **Extensies beheren**, schakel "Ontwikkelaarsmodus" in, klik op "Uitgepakte extensie laden" en selecteer de "dist"-map.

### 1.4 Google Ads Script Configureren

1. **Kopieer het script**  
   Kopieer de code uit `script/script.js`.

2. **Voeg script toe aan Google Ads**  
   In Google Ads, ga naar **Tools** > **Bulkacties** > **Scripts** en plak de code hierin. Mogelijk wordt je gevraagd om je te autoriseren bij het plakken en uitvoeren van het script.

## 2. Gebruik

1. **Data ophalen**  
    Pas de specificaties aan in het Google Ads script en klik op "Uitvoeren". Je ontvangt vervolgens de data ná enkele minuten bij je opgegeven email inbox.

   ```javascript
   // Email van ontvanger
   var emailReceiver = "example@gmail.com";
   // Periode van data
   var startDate = new Date("2024-09-01"); // Formaat: JJJJ-MM-DD
   var endDate = new Date("2024-09-14"); // Formaat: JJJJ-MM-DD
   ```

2. **ChatGPT model wijzigen (optioneel)**
   Mocht je ooit het ChatGPT model willen wijzigen, dan kan dat in `server/server.js`.

   ```javascript
   const completion = await openai.chat.completions.create({
     messages: [{ role: "user", content: message }],
     model: "gpt-4o-mini",
   });
   ```

3. **Server starten**
   In de terminal, voer dit commando uit:

   ```bash
   node server/server.js
   ```

4. **Chrome-extensie gebruiken**
   Open de extensie en voer de bedrijfsnaam en CSV-data in. klik daarna op "Analyze uitvoeren", waarna je het rapport in minder dan één minuut ontvangt.
