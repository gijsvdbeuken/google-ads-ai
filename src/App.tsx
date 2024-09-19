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

  const [dataBatch, setDataBatch] = useState<File[]>([]);
  const [amountOfCampaigns, setAmountOfCampaigns] = useState<number>(0);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [response, setResponse] = useState('');

  const [jsonGenderAdGroup, setJsonGenderAdGroup] = useState<DataStructureGenderAdGroup>({});
  const [jsonGenderCampaign, setJsonGenderCampaign] = useState<DataStructureGenderCampaign>({});
  const [jsonAgeRangeAdGroup, setJsonAgeRangeAdGroup] = useState<DataStructureAgeRangeAdGroup>({});
  const [jsonAgeRangeCampaign, setJsonAgeRangeCampaign] = useState<DataStructureAgeRangeCampaign>({});

  const promptSummary: string = `${parameterLanguage}` + `${parameterTone}` + `Schrijf een korte samenvatting op basis van de volgende data. Dit is Google Ads data van alle campagnes van het bedrijf ${companyName}. Schijf eerst op één regel enkel de cijfers als concrete waarders met een label ervoor, en schrijf daaronder een korte alinea ter samenvatting van bovenstaande cijfers. Schrijf geen titel boven de tekst, en vermijd markdown syntax.`;
  const promptAge: string =
    `${parameterLanguage}` +
    `${parameterTone}` +
    `Schrijf één korte alinea over de leeftijden data voor elk van de volgende campagnes. Je verteld voornamelijk over de conversie-cijfers indien je hier data van hebt, wanneer dit niet het geval is vertel je voornamelijk over de CTR cijfers. Geef tot slot advies m.b.t. procentuele bodaanpassing aan het eind van de alinea. Refereer alleen naar cijfers die je kan aflezen, ga dus niet zelf berekeningen maken. Schrijf geen titel boven de tekst maar duid deze in de alinea aan, en vermijd markdown syntax.`;
  const promptGender: string =
    `${parameterLanguage}` +
    `${parameterTone}` +
    `Schrijf één korte alinea over de gender data voor elk van de volgende campagnes. Je verteld voornamelijk over de conversie-cijfers indien je hier data van hebt, wanneer dit niet het geval is vertel je voornamelijk over de CTR cijfers. Geef tot slot advies m.b.t. procentuele bodaanpassing aan het eind van de alinea. Refereer alleen naar cijfers die je kan aflezen, ga dus niet zelf berekeningen maken. Schrijf geen titel boven de tekst maar duid deze in de alinea aan, en vermijd markdown syntax.`;
  const promptDevice: string =
    `${parameterLanguage}` +
    `${parameterTone}` +
    `Schrijf één korte alinea over de apparaten data voor elk van de volgende campagnes. Je verteld voornamelijk over de conversie-cijfers indien je hier data van hebt, wanneer dit niet het geval is vertel je voornamelijk over de CTR cijfers. Geef tot slot advies m.b.t. procentuele bodaanpassing aan het eind van de alinea. Refereer alleen naar cijfers die je kan aflezen, ga dus niet zelf berekeningen maken. Schrijf geen titel boven de tekst maar duid deze in de alinea aan, en vermijd markdown syntax.`;
  const promptDay: string =
    `${parameterLanguage}` +
    `${parameterTone}` +
    `Schrijf één korte alinea over de weekdagen data voor elk van de volgende campagnes. Je verteld voornamelijk over de conversie-cijfers indien je hier data van hebt, wanneer dit niet het geval is vertel je voornamelijk over de CTR cijfers. Geef tot slot advies m.b.t. procentuele bodaanpassing aan het eind van de alinea. Refereer alleen naar cijfers die je kan aflezen, ga dus niet zelf berekeningen maken. Schrijf geen titel boven de tekst maar duid deze in de alinea aan, en vermijd markdown syntax.`;

  useEffect(() => {
    if (response) {
      rapportGenerator(response, companyName, currentDate);
    }
  }, [response, companyName, currentDate]);

  const handleClick = async () => {
    setIsUploading(true);
    if (dataBatch.length === 0) {
      alert('Geen bestanden geselecteerd.');
      setIsUploading(false);
      return;
    }

    const getFileByName = (fileName: string) => {
      const file = dataBatch.find((file) => file.name === fileName);
      return file;
    };
    const csvSummary = getFileByName('report_summary.csv');
    const csvGenderCampaign = getFileByName('report_gender_campaign.csv');
    const csvGenderAdGroup = getFileByName('report_gender_adgroup.csv');
    const csvAgeRangeCampaign = getFileByName('report_age_range_campaign.csv');
    const csvAgeRangeAdGroup = getFileByName('report_age_range_adgroup.csv');
    const csvDevice = getFileByName('report_device.csv');
    const csvDay = getFileByName('report_day.csv');

    if (!csvSummary || !csvGenderCampaign || !csvGenderAdGroup || !csvAgeRangeCampaign || !csvAgeRangeAdGroup || !csvDevice || !csvDay) {
      if (!csvSummary) {
        console.log(`Bestand "report_summary.csv" niet gevonden.`);
      } else if (!csvGenderCampaign) {
        console.log(`Bestand "report_gender_campaign.csv" niet gevonden.`);
      } else if (!csvGenderAdGroup) {
        console.log(`Bestand "report_gender_adgroup.csv" niet gevonden.`);
      } else if (!csvAgeRangeCampaign) {
        console.log(`Bestand "report_age_range_campaign.csv" niet gevonden.`);
      } else if (!csvAgeRangeAdGroup) {
        console.log(`Bestand "report_age_range_adgroup.csv" niet gevonden.`);
      } else if (!csvDevice) {
        console.log(`Bestand "report_device.csv" niet gevonden.`);
      } else if (!csvDay) {
        console.log(`Bestand "report_day.csv" niet gevonden.`);
      } else {
        console.log(`Er ging iets mis bij het vinden van de bestanden op basis van bestandsnaam.`);
      }
      return;
    }
    if (parameterAnalyzeLevel == 'campaignLevel') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvData = e.target?.result as string;
          const rows = csvData.split('\n');
          const firstDataRow = rows[1].split(',');
          const value = parseFloat(firstDataRow[0]);
          setAmountOfCampaigns(value);
        } catch (error) {
          console.error('Er ging iets mis bij het ophalen van het aantal campagnes: ', error);
        }
      };
      CsvParserGenderCampaign(csvGenderCampaign, setJsonGenderCampaign);
      CsvParserAgeRangeCampaign(csvAgeRangeCampaign, setJsonAgeRangeCampaign);
    } else if (parameterAnalyzeLevel == 'adGroupLevel') {
      CsvParserGenderAdGroup(csvGenderAdGroup, setJsonGenderAdGroup);
      CsvParserAgeRangeAdGroup(csvAgeRangeAdGroup, setJsonAgeRangeAdGroup);
    } else {
      alert('Niveau van analyse niet gevonden.');
    }

    try {
      const request = async (data: File | DataStructureGenderCampaign | DataStructureGenderAdGroup | DataStructureAgeRangeCampaign | DataStructureAgeRangeAdGroup, prompt: string, model: string, temperature: number, maxTokens: number) => {
        if (data instanceof File) {
          if (data.name === 'report_summary.csv' || data.name === 'report_device.csv' || data.name === 'report_day.csv') {
            let csvText: string = '';
            csvText += await data.text();
            console.log('---');
            console.log('Prompt: ' + prompt);
            console.log('Given data: ' + csvText);
            const response = await fetch('http://localhost:3001/chat', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                message: prompt + csvText,
                model: model,
                temperature: temperature,
                max_tokens: maxTokens,
                data: data,
              }),
            });
            const fileResponse = await response.json();
            return fileResponse;
          } else {
            console.log('Er ging iets mis bij het request met ' + data.name);
            return;
          }
        } else {
          console.log('---');
          console.log('Prompt: ' + prompt);
          console.log('Given data: ' + JSON.stringify(data));
          const response = await fetch('http://localhost:3001/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: prompt + '\n\nInterpreteer het als JSON formaat:\n' + (JSON.stringify(data), null, 2),
              model: model,
              temperature: temperature,
              max_tokens: maxTokens,
              data: data,
            }),
          });
          const jsonResponse = await response.json();
          return jsonResponse;
        }
      };

      const responseSummaryPrompt = await request(csvSummary, promptSummary, 'gpt-4o-2024-08-06', 0.5, 250);
      const responsePromptAge = await request(jsonAgeRangeCampaign, promptAge, 'gpt-4o-2024-08-06', 0.2, 2000);
      const responsePromptGender = await request(jsonGenderCampaign, promptGender, 'gpt-4o-2024-08-06', 0.2, 2000);
      const responsePromptDevices = await request(csvDevice, promptDevice, 'gpt-4o-2024-08-06', 0.2, 2000);
      const responsePromptDay = await request(csvDay, promptDay, 'gpt-4o-2024-08-06', 0.2, 2000);

      setResponse('Samenvatting' + '\n\n' + responseSummaryPrompt.content + '\n\n' + 'Leeftijden' + '\n\n' + responsePromptAge.content + '\n\n' + 'Geslacht' + '\n\n' + responsePromptGender.content + '\n\n' + 'Apparaten' + '\n\n' + responsePromptDevices.content + '\n\n' + 'Dag en Tijd' + '\n\n' + responsePromptDay.content);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsUploading(false);
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
        <div className="x">
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
        <label>Toevoegingen (optioneel)</label>
        <input></input>
      </div>
      <button onClick={handleClick} disabled={isUploading}>
        {isUploading === true ? 'Verwerken, even geduld...' : 'Analyse uitvoeren'}
      </button>
      <p>Aantal campagnes: {amountOfCampaigns}</p>
      <pre>{JSON.stringify(jsonGenderAdGroup, null, 2)}</pre>
      <pre>{JSON.stringify(jsonAgeRangeAdGroup, null, 2)}</pre>
    </div>
  );
}

export default App;
