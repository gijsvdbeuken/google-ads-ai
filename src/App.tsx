import { useState, useEffect } from 'react';
import { rapportGenerator } from './utilities/RapportGenerator';
import { CsvParserGenderAdGroup, DataStructureGenderAdGroup } from './utilities/CsvParserGenderAdGroup';
import { CsvParserGenderCampaign, DataStructureGenderCampaign } from './utilities/CsvParserGenderCampaign';
import { CsvParserAgeRangeCampaign, DataStructureAgeRangeCampaign } from './utilities/CsvParserAgeRangeCampaign';
import { CsvParserAgeRangeAdGroup, DataStructureAgeRangeAdGroup } from './utilities/CsvParserAgeRangeAdGroup';
import logo from '/logo.png';
import './App.css';

function App() {
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [currentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [parameterLanguage, setParameterLanguage] = useState<string>('');
  const [parameterTone, setParameterTone] = useState<string>('');
  const [parameterAnalyzeLevel, setParameterAnalyzeLevel] = useState<string>('campaignLevel');
  const [parameterKpc, setParameterKpc] = useState<string>('');
  const [parameterAdditions, setParameterAdditions] = useState<string>('');
  const [dataBatch, setDataBatch] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [response, setResponse] = useState('');
  const [jsonGenderAdGroup, setJsonGenderAdGroup] = useState<DataStructureGenderAdGroup>({});
  const [jsonGenderCampaign, setJsonGenderCampaign] = useState<DataStructureGenderCampaign>({});
  const [jsonAgeRangeAdGroup, setJsonAgeRangeAdGroup] = useState<DataStructureAgeRangeAdGroup>({});
  const [jsonAgeRangeCampaign, setJsonAgeRangeCampaign] = useState<DataStructureAgeRangeCampaign>({});
  const [csvSummaryAlias, setCsvSummaryAlias] = useState<File>();
  const [csvDeviceAlias, setCsvDeviceAlias] = useState<File>();
  const [csvDayAlias, setCsvDayAlias] = useState<File>();

  const promptSummary: string =
    `${parameterLanguage}` +
    `${parameterTone}` +
    `Schrijf een korte samenvatting op basis van de volgende data. Dit is Google Ads data van alle campagnes van het bedrijf ${companyName}. Schijf eerst op één regel enkel de cijfers als concrete waarders met een label ervoor, en schrijf daaronder een korte alinea ter samenvatting van bovenstaande cijfers. Schrijf geen titel boven de tekst, en vermijd markdown syntax. Geef bij elke waarde de eenheid aan, bijvoorbeeld "€5" of "10%".` +
    `${parameterAdditions}`;
  const promptAge: string =
    `${parameterLanguage}` +
    `${parameterTone}` +
    `Schrijf één korte alinea per campagne aanwezig in de volgende dataset over leeftijden. Je verteld voornamelijk over de conversie-cijfers indien je hier data van hebt, wanneer dit niet het geval is vertel je voornamelijk over de CTR cijfers. Onthoud dat "Onbekend" ook een vaide categorie is, en dat je deze moet meerekenen. ` +
    (parameterKpc.length > 0 ? ` Onthoud dat de gemiddelde kosten per conversie over het gehele bedrijf ${parameterKpc} bedragen, dus gebruik die waarde als ankerpunt.` : '') +
    `Geef tot slot advies m.b.t. Refereer alleen naar cijfers die je kan aflezen, ga dus niet zelf berekeningen maken. Schrijf geen titel boven de tekst maar duid deze in de alinea aan, en vermijd markdown syntax. Geef bij elke waarde de eenheid aan, bijvoorbeeld "€5" of "10%".` +
    `${parameterAdditions}`;
  const promptGender: string =
    `${parameterLanguage}` +
    `${parameterTone}` +
    `Schrijf één korte alinea per campagne aanwezig in de volgende dataset over genders. Je verteld voornamelijk over de conversie-cijfers indien je hier data van hebt, wanneer dit niet het geval is vertel je voornamelijk over de CTR cijfers.` +
    (parameterKpc.length > 0 ? ` Onthoud dat de gemiddelde kosten per conversie over het gehele bedrijf ${parameterKpc} bedragen, dus gebruik die waarde als ankerpunt.` : '') +
    `Geef tot slot advies m.b.t. procentuele bodaanpassing aan het eind van de alinea. Refereer alleen naar cijfers die je kan aflezen, ga dus niet zelf berekeningen maken. Schrijf geen titel boven de tekst maar duid deze in de alinea aan, en vermijd markdown syntax. Geef bij elke waarde de eenheid aan, bijvoorbeeld "€5" of "10%".` +
    `${parameterAdditions}`;
  const promptDevice: string =
    `${parameterLanguage}` +
    `${parameterTone}` +
    `Schrijf één korte alinea per campagne aanwezig in de volgende dataset over apparaten. Je verteld voornamelijk over de conversie-cijfers indien je hier data van hebt, wanneer dit niet het geval is vertel je voornamelijk over de CTR cijfers.` +
    (parameterKpc.length > 0 ? ` Onthoud dat de gemiddelde kosten per conversie over het gehele bedrijf ${parameterKpc} bedragen, dus gebruik die waarde als ankerpunt.` : '') +
    `Geef tot slot advies m.b.t. procentuele bodaanpassing aan het eind van de alinea. Refereer alleen naar cijfers die je kan aflezen, ga dus niet zelf berekeningen maken. Schrijf geen titel boven de tekst maar duid deze in de alinea aan, en vermijd markdown syntax. Geef bij elke waarde de eenheid aan, bijvoorbeeld "€5" of "10%".` +
    `${parameterAdditions}`;
  const promptDay: string =
    `${parameterLanguage}` +
    `${parameterTone}` +
    `Schrijf één korte alinea per campagne aanwezig in de volgende dataset over dagen. Je verteld voornamelijk over de conversie-cijfers indien je hier data van hebt, wanneer dit niet het geval is vertel je voornamelijk over de CTR cijfers.` +
    (parameterKpc.length > 0 ? ` Onthoud dat de gemiddelde kosten per conversie over het gehele bedrijf ${parameterKpc} bedragen, dus gebruik die waarde als ankerpunt.` : '') +
    `Geef tot slot advies m.b.t. procentuele bodaanpassing aan het eind van de alinea. Refereer alleen naar cijfers die je kan aflezen, ga dus niet zelf berekeningen maken. Schrijf geen titel boven de tekst maar duid deze in de alinea aan, en vermijd markdown syntax. Geef bij elke waarde de eenheid aan, bijvoorbeeld "€5" of "10%".` +
    `${parameterAdditions}`;

  const adGroupPrompt: string = `${parameterLanguage}` + `${parameterTone}` + `Schrijf een analyze van alle advertentiegroepen binnen het bedrijf ${companyName} op basis van de volgende data.` + `${parameterAdditions}`;

  const apiRequest = async (data: File | DataStructureGenderCampaign | DataStructureGenderAdGroup | DataStructureAgeRangeCampaign | DataStructureAgeRangeAdGroup, prompt: string, model: string, temperature: number, maxTokens: number) => {
    let csvText: string = '';
    if (data instanceof File) {
      csvText += await data.text();
    }
    try {
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt + (data instanceof File ? csvText : JSON.stringify(data, null, 2)),
          model: model,
          temperature: temperature,
          max_tokens: maxTokens,
          data: data,
        }),
      });
      const dataResponse = await response.json();
      return dataResponse;
    } catch (error) {
      console.error('Something went wrong while making the request: ' + error);
    }
  };

  useEffect(() => {
    const makeApiRequests = async () => {
      if (parameterAnalyzeLevel === 'campaignLevel') {
        if (jsonAgeRangeCampaign && Object.keys(jsonAgeRangeCampaign).length > 0 && jsonGenderCampaign && Object.keys(jsonGenderCampaign).length > 0) {
          if (!csvSummaryAlias || !csvDeviceAlias || !csvDayAlias) {
            console.log('Een van de aliassen was leeg.');
            return;
          }
          try {
            const responseSummaryPrompt = await apiRequest(csvSummaryAlias, promptSummary, 'gpt-4o-mini', 0.5, 250);
            const responsePromptAge = await apiRequest(jsonAgeRangeCampaign, promptAge, 'gpt-4o-2024-08-06', 0.2, 2000);
            const responsePromptGender = await apiRequest(jsonGenderCampaign, promptGender, 'gpt-4o-2024-08-06', 0.2, 2000);
            const responsePromptDevices = await apiRequest(csvDeviceAlias, promptDevice, 'gpt-4o-mini', 0.2, 2000);
            const responsePromptDay = await apiRequest(csvDayAlias, promptDay, 'gpt-4o-mini', 0.2, 2000);

            setResponse('Samenvatting' + '\n\n' + responseSummaryPrompt.content + '\n\n' + 'Leeftijden' + '\n\n' + responsePromptAge.content + '\n\n' + 'Geslacht' + '\n\n' + responsePromptGender.content + '\n\n' + 'Apparaten' + '\n\n' + responsePromptDevices.content + '\n\n' + 'Dag en Tijd' + '\n\n' + responsePromptDay.content);
          } catch (error) {
            console.error('Error:', error);
          } finally {
            setIsUploading(false);
          }
        }
      } else if (parameterAnalyzeLevel === 'adGroupLevel') {
        if (jsonAgeRangeAdGroup && Object.keys(jsonAgeRangeAdGroup).length > 0 && jsonGenderAdGroup && Object.keys(jsonGenderAdGroup).length > 0) {
          try {
            // DOESN'T RECEIVE RIGHT DATA YET
            const responsePromptAdGroup = await apiRequest(jsonAgeRangeAdGroup, adGroupPrompt, 'gpt-4o-2024-08-06', 0.2, 225);
            setResponse('Samenvatting' + '\n\n' + responsePromptAdGroup.content);
          } catch (error) {
            console.error('Error:', error);
          } finally {
            setIsUploading(false);
          }
        }
      } else {
        console.error('Analysis level not found.');
        return;
      }
    };
    makeApiRequests();
  }, [jsonAgeRangeCampaign, jsonGenderCampaign, jsonAgeRangeCampaign, jsonGenderAdGroup]);

  useEffect(() => {
    if (response) {
      rapportGenerator(response, companyName, currentDate);
    }
  }, [response, companyName, currentDate]);

  const prepareData = async () => {
    const getFileByName = (fileName: string) => {
      const file = dataBatch.find((file) => file.name === fileName);
      return file;
    };

    setIsUploading(true);

    if (dataBatch.length === 0) {
      alert('Geen bestanden geselecteerd.');
      setIsUploading(false);
      return;
    }

    const csvSummary = getFileByName('report_summary.csv');
    setCsvSummaryAlias(csvSummary);
    const csvDevice = getFileByName('report_device.csv');
    setCsvDeviceAlias(csvDevice);
    const csvDay = getFileByName('report_day.csv');
    setCsvDayAlias(csvDay);

    const csvGenderCampaign = getFileByName('report_gender_campaign.csv');
    const csvGenderAdGroup = getFileByName('report_gender_adgroup.csv');
    const csvAgeRangeCampaign = getFileByName('report_age_range_campaign.csv');
    const csvAgeRangeAdGroup = getFileByName('report_age_range_adgroup.csv');

    if (!csvGenderCampaign || !csvGenderAdGroup || !csvAgeRangeCampaign || !csvAgeRangeAdGroup) {
      console.log('Files do not match filename criteria.');
      return;
    }

    if (parameterAnalyzeLevel == 'campaignLevel') {
      CsvParserGenderCampaign(csvGenderCampaign, setJsonGenderCampaign);
      CsvParserAgeRangeCampaign(csvAgeRangeCampaign, setJsonAgeRangeCampaign);
    } else if (parameterAnalyzeLevel == 'adGroupLevel') {
      CsvParserGenderAdGroup(csvGenderAdGroup, setJsonGenderAdGroup);
      CsvParserAgeRangeAdGroup(csvAgeRangeAdGroup, setJsonAgeRangeAdGroup);
    } else {
      console.error('Analysis level not found.');
    }
  };

  return (
    <div className="container">
      <div className="logoContainer">
        <h1>Google Ads AI</h1>
        <img src={logo} className="logo" alt="Geen Gedoe Google Ads logo" />
      </div>
      <div className="dataForm">
        <label>Bedrijfsnaam</label>
        <input
          placeholder="Bijv. Geen Gedoe"
          onChange={(e) => {
            setCompanyName(e.target.value);
          }}
        ></input>
        <label>Data</label>
        <input
          className="fileInput"
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              setDataBatch(Array.from(e.target.files));
            }
          }}
        ></input>
        <div className="fineTuneContainer">
          <div className="textLanguage">
            <label>Teksttaal</label>
            <select
              value={parameterLanguage}
              onChange={(e) => {
                setParameterLanguage(e.target.value);
              }}
            >
              <option value="In het nederlands, ">Nederlands</option>
              <option value="In het engels, ">Engels</option>
            </select>
          </div>
          <div className="textTone">
            <label>Teksttoon</label>
            <select
              value={parameterTone}
              onChange={(e) => {
                setParameterTone(e.target.value);
              }}
            >
              <option value="in formele stijl, ">Formeel</option>
              <option value="in informele stijl, ">Informeel</option>
              <option value="in zakelijke stijl, ">Zakelijk</option>
              <option value="in behapzaam en eenvoudigere stijl, ">Behapzaam</option>
              <option value="in enthausiaste en vrolijke stijl, ">Enthousiast</option>
              <option value="in inspirerende en motiverende stijl, ">Inspirerend</option>
              <option value="in humoristische stijl, ">Humoristisch</option>
              <option value="in humoristische en neerbuigende stijl, ">Neerbuigend</option>
            </select>
          </div>
        </div>
        <div className="fineTuneContainer">
          <div className="analyzeLevel">
            <label>Analyseniveau</label>
            <select
              value={parameterAnalyzeLevel}
              onChange={(e) => {
                setParameterAnalyzeLevel(e.target.value);
              }}
            >
              <option value="campaignLevel">Campagne</option>
              <option value="adGroupLevel">Advertentiegroep</option>
            </select>
          </div>
          <div className="costPerConversion">
            <label>Gem. KPC account</label>
            <input
              placeholder="Bijv. 5.50"
              onChange={(e) => {
                setParameterKpc(e.target.value);
              }}
            ></input>
          </div>
        </div>
        <label>Toevoegingen (optioneel)</label>
        <input
          placeholder="Context, informatie, etc."
          onChange={(e) => {
            setParameterAdditions(e.target.value);
          }}
        ></input>
      </div>
      <button onClick={prepareData} disabled={isUploading}>
        {isUploading === true ? 'Verwerken, even geduld...' : 'Analyse uitvoeren'}
      </button>
    </div>
  );
}

export default App;
