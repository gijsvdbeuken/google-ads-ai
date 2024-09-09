# Geen Gedoe | Google Ads AI

## Omgeving klaarzetten

### OpenAI API opzetten en gereed maken

Zorg ervoor dat je een OpenAI API-account hebt. Ga naar [OpenAI API](https://openai.com/index/openai-api/) en maak een account aan. Zodra je bent ingelogd, kom je op het OpenAI API-dashboard.

In het dashboard ga je naar je profiel en klik je op "User API Keys". Maak hier een nieuwe API-sleutel aan, bijvoorbeeld met de naam "OpenAI API Key". Bewaar de gegenereerde API-sleutel (een lange tekstreeks) op een veilige plek. Via je profiel kun je ook naar "Billing" gaan om tegoed toe te voegen. Meestal is €5 tot €10 voldoende om te beginnen.

### React project opzetten

Om de Chrome extensie te gebruiken dien je deze lokaal op je computer te hebben staan. Dit gaan we doen door het project vanuit GitHub te importeren.

Begin met het aanmaken van een folder op een locatie die je zelf fijn vindt. Geef deze folder een duidelijke naam zoals "Google Ads AI" of dergelijk.

Open vervolgens de terminal vanuit de locatie van deze folder, en initialiseer een git omgeving door het volgende commando in te typen.

```
git init
// Druk nu op ENTER
```

Hierna zorg je dat je de locatie van het project dat je wilt opvraagd koppeld aan de folderlocatie.

```
git remote add origin https://github.com/gijsvdbeuken/google-ads-ai.git
// Druk nu op ENTER
```

Hierna importeer je het project vanuit GitHub naar jouw lokale computer.

```
git pull origin main
```
