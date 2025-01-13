# Google Ads AI

## Inhoudsopgave

1. [Vereisten](#vereisten)  
2. [Setup](#setup)  
3. [Gebruik](#gebruik)

## Vereisten

Voor dit project is het aan te raden om de volgende software te installeren:

1. **Node.js** – Een JavaScript runtime-omgeving die nodig is om het project te draaien.  
   - Download het hier: [Node.js](https://nodejs.org/en/download/package-manager)
3. **Visual Studio Code (optioneel maar aanbevolen)** – Een krachtige editor voor het bewerken van code.  
   - Download het hier: [Visual Studio Code](https://code.visualstudio.com/download)

## Setup

Volg de onderstaande stappen om het project op te zetten:

### Stap 1: Downloaden van het project

1. Ga naar de GitHub-pagina van het project.
2. Klik op de groene knop **"Code"** en kies **"Download ZIP"**.
3. Zet het ZIP-bestand op je bureaublad of een andere locatie op je computer.

### Stap 2: Het project openen in Visual Studio Code (optioneel)

1. Open **Visual Studio Code** (VSCode).
2. Sleep de gedownloade folder (de uitgepakte ZIP-bestanden) naar VSCode om het project te openen.

### Stap 3: Installeren van de benodigde afhankelijkheden

1. Zorg ervoor dat je in VSCode de **Terminal** opent (via **View > Terminal** of `Ctrl + ~`).
2. Voer het volgende commando uit om de benodigde afhankelijkheden te installeren:

   ```bash
   npm install
   ```

3. Voer daarna het volgende commando uit om de bestanden te bouwen:

   ```bash
   npm run build
   ```

### Stap 4: Chrome-extensie toevoegen

1. Na het uitvoeren van de bouwopdracht, wordt er een `dist` map aangemaakt.
2. Open **Chrome** en ga naar de extensiespagina via `chrome://extensions/`.
3. Zet de "Developer mode" aan rechtsboven in het scherm.
4. Klik op de knop **"Load unpacked"** en selecteer de `dist` map die zojuist is aangemaakt.

### Stap 5: Server starten

1. Na het toevoegen van de extensie kun je de server starten door het volgende commando uit te voeren in de terminal:

   ```bash
   node server/server.js
   ```

2. Dit start een lokale server waarop de extensie draait.

## Gebruik

Na een succesvolle installatie van de Chrome-extensie, kan de extensie worden gebruikt voor het genereren van Google Ads-rapporten. Volg de onderstaande stappen:

### Stap 1: Data ophalen

1. Open de extensie in **Google Chrome**.
2. Vul de bedrijfsnaam en de gewenste CSV-gegevens in het daarvoor bestemde veld.
3. Klik op **"Analyse uitvoeren"** en wacht enkele minuten tot het rapport in je inbox wordt afgeleverd.

   Voorbeeld van configuratie in het script:

   ```javascript
   // Email van ontvanger
   var emailReceiver = "example@gmail.com";
   // Periode van data
   var startDate = new Date("2024-09-01"); // Formaat: JJJJ-MM-DD
   var endDate = new Date("2024-09-14"); // Formaat: JJJJ-MM-DD
   ```

### Stap 2: ChatGPT-model wijzigen (optioneel)

Mocht het nodig zijn om het gebruikte ChatGPT-model te wijzigen, dan kan dit eenvoudig in de `server/server.js` door de modelnaam te aanpassen:

```javascript
const completion = await openai.chat.completions.create({
  messages: [{ role: "user", content: message }],
  model: "gpt-4o-mini",  // Dit kan worden aangepast naar een ander model
});
```

### Stap 3: Server starten

1. In de terminal, voer het volgende commando uit om de server te starten:

   ```bash
   node server/server.js
   ```

2. De server draait nu lokaal, en de extensie kan worden gebruikt om de gewenste gegevens te verwerken en rapporten te genereren.
