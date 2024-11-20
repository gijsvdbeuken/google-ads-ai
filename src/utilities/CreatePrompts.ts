function summaryInstructions(company: string) {
  return `Schrijf een korte samenvatting op basis van de volgende data. Dit is Google Ads data van alle campagnes van het bedrijf ${company}. Schrijf eerst op één regel enkel de cijfers als concrete waarders met een label ervoor, en schrijf daaronder een korte alinea ter samenvatting van bovenstaande cijfers. Schrijf geen titel boven de tekst, en vermijd markdown syntax. Geef bij elke waarde de eenheid aan, bijvoorbeeld "€5" of "10%"`;
}

function paragraphInstructions(kpc: string): string {
  let instructions = `
  Schrijf één korte alinea per campagne op basis van de volgende data. 
  Je vertelt voornamelijk over de conversie-cijfers indien je hier data van hebt, wanneer dit niet het geval is vertel je voornamelijk over de CTR cijfers. 
  Onthoud dat "Onbekend" ook een valide categorie is, en dat je deze moet meerekenen.
  Geef tot slot advies m.b.t. procentuele bodaanpassing aan het eind van de alinea. 
  Refereer alleen naar cijfers die je kan aflezen, ga dus niet zelf berekeningen maken. 
  Schrijf geen titel boven de tekst, en vermijd markdown syntax. 
  Geef bij elke waarde de eenheid aan, bijvoorbeeld "€5" of "10%"`;

  if (kpc.length > 0) {
    instructions += ` De gemiddelde kosten per conversie over het gehele bedrijf bedragen ${kpc}, gebruik die waarde als ankerpunt.`;
  }

  return instructions;
}

export const createSummaryPrompt = (language: string, tone: string, company: string, additions: string): string => `
  ${language}${tone}${summaryInstructions(company)}${additions}`;

export const createParagraphPrompt = (language: string, tone: string, kpc: string, additions: string): string => `
  ${language}${tone}${paragraphInstructions(kpc)}${additions}`;

export const getDebriefingPrompt = (): string => {
  return `Geef een zo compact mogelijke samenvatting m.b.t. de bodaanpassingen van het volgende rapport, door er over heen te gaan wat er zowel is toegepast. Bijvoorbeeld "Bij campagne X is op basis van X en X een X% bodaanpassing geadviseerd." en vertel ook kort op basis waarvan deze bodaanpassing is toegepast. Mocht je geen bodaanpassing kunnen vinden, citeer je "Geen bodaanpassing gevonden". Vermijd markdown syntax, en zet geen titel boven deze gehele samenvatting.`;
};
