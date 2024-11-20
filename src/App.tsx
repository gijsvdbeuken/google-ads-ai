import { useState, useEffect } from 'react';
import { rapportGenerator } from './utilities/RapportGenerator';
import { CsvParserGenderAdGroup, DataStructureGenderAdGroup } from './utilities/CsvParserGenderAdGroup';
import { CsvParserGenderCampaign, DataStructureGenderCampaign } from './utilities/CsvParserGenderCampaign';
import { CsvParserAgeRangeCampaign, DataStructureAgeRangeCampaign } from './utilities/CsvParserAgeRangeCampaign';
import { CsvParserAgeRangeAdGroup, DataStructureAgeRangeAdGroup } from './utilities/CsvParserAgeRangeAdGroup';
import { createSummaryPrompt, createParagraphPrompt, getDebriefingPrompt } from './utilities/CreatePrompts';
import { apiRequest } from './utilities/ApiService';
import './App.css';

function App() {
  const [company, setCompany] = useState<string>('');
  const [date] = useState<string>(new Date().toISOString().split('T')[0]);
  const [language, setLanguage] = useState<string>('');
  const [tone, setTone] = useState<string>('');
  const [analyzeLevel, setAnalyzeLevel] = useState<string>('campaignLevel');
  const [kpc, setKpc] = useState<string>('');
  const [additions, setAdditions] = useState<string>('');
  const [dataBatch, setDataBatch] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [response, setResponse] = useState('');
  const [jsonGenderAdGroup, setJsonGenderAdGroup] = useState<DataStructureGenderAdGroup>({});
  const [jsonGenderCampaign, setJsonGenderCampaign] = useState<DataStructureGenderCampaign>({});
  const [jsonAgeRangeAdGroup, setJsonAgeRangeAdGroup] = useState<DataStructureAgeRangeAdGroup>({});
  const [jsonAgeRangeCampaign, setJsonAgeRangeCampaign] = useState<DataStructureAgeRangeCampaign>({});
  const [process, setProcess] = useState<string>('Verwerken...');
  const [dots, setDots] = useState('.');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const summaryPrompt: string = createSummaryPrompt(language, tone, company, additions);
  const paragraphPrompt: string = createParagraphPrompt(language, tone, kpc, additions);
  const debriefingPrompt: string = getDebriefingPrompt();

  const getFileByName = (fileName: string) => {
    const file = dataBatch.find((file) => file.name === fileName);
    return file;
  };

  const csvSummary = getFileByName('report_summary.csv');
  const csvDevice = getFileByName('report_device.csv');
  const csvDay = getFileByName('report_day.csv');
  const csvAdGroup = getFileByName('report_adgroup.csv');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const makeApiRequests = async () => {
      if (analyzeLevel === 'campaignLevel') {
        if (jsonAgeRangeCampaign && Object.keys(jsonAgeRangeCampaign).length > 0 && jsonGenderCampaign && Object.keys(jsonGenderCampaign).length > 0) {
          if (!csvSummary || !csvDevice || !csvDay) {
            console.log('Een van de aliassen was leeg.');
            return;
          }
          try {
            setProcess('Samenvatting creëren');
            const resSummary = await apiRequest(csvSummary, summaryPrompt, 'gpt-4o-mini', 0.5, 250);
            setProcess(`Alinea's over leeftijden genereren`);
            const resAge = await apiRequest(jsonAgeRangeCampaign, paragraphPrompt, 'gpt-4o-mini', 0.2, 2000);
            setProcess(`Alinea's over geslacht genereren`);
            const resGender = await apiRequest(jsonGenderCampaign, paragraphPrompt, 'gpt-4o-mini', 0.2, 2000);
            setProcess(`Alinea's over apparaten genereren`);
            const resDevices = await apiRequest(csvDevice, paragraphPrompt, 'gpt-4o-mini', 0.2, 2000);
            setProcess(`Alinea's over weekdagen genereren`);
            const responsePromptDay = await apiRequest(csvDay, paragraphPrompt, 'gpt-4o-mini', 0.2, 2000);
            setProcess(`Debriefing aanmaken`);
            const responseOverview = await apiRequest('Samenvatting' + resSummary.content + 'Leeftijden' + resAge.content + 'Geslacht' + resGender.content + 'Apparaten' + resDevices.content + 'Dag en Tijd' + responsePromptDay.content, debriefingPrompt, 'gpt-4o-2024-08-06', 0.2, 2000);

            setResponse('Samenvatting' + '\n\n' + resSummary.content + '\n\n' + 'Leeftijden' + '\n\n' + resAge.content + '\n\n' + 'Geslacht' + '\n\n' + resGender.content + '\n\n' + 'Apparaten' + '\n\n' + resDevices.content + '\n\n' + 'Dag en Tijd' + '\n\n' + responsePromptDay.content + '\n\n' + 'Debriefing' + '\n\n' + responseOverview.content);
          } catch (error) {
            setErrorMessage('Verzoek naar OpenAI API mislukt. Controleer of de server actief is en of de API correct is verbonden.');
            console.error('Error:', error);
          } finally {
            setIsUploading(false);
          }
        }
      } else if (analyzeLevel === 'adGroupLevel') {
        if (jsonAgeRangeAdGroup && Object.keys(jsonAgeRangeAdGroup).length > 0 && jsonGenderAdGroup && Object.keys(jsonGenderAdGroup).length > 0) {
          try {
            if (!csvAdGroup) {
              console.log('Een van de aliassen was leeg.');
              return;
            }
            setProcess('Samenvatting creëren' + dots);
            const responsePromptAdGroup = await apiRequest(csvAdGroup, paragraphPrompt, 'gpt-4o-2024-08-06', 0.2, 3000);
            setResponse('Samenvatting' + '\n\n' + responsePromptAdGroup.content);
          } catch (error) {
            setErrorMessage('Verzoek naar OpenAI API mislukt. Controleer of de server actief is en of de API correct is verbonden.');
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
      try {
        rapportGenerator(response, company, date);
      } catch (error) {
        setErrorMessage('Rapport uitschrijven mislukt.');
        console.error('Error:', error);
      }
    }
  }, [response, company, date]);

  const prepareData = async () => {
    setErrorMessage('');
    setIsUploading(true);

    if (dataBatch.length === 0) {
      setErrorMessage('Geen bestanden geselecteerd.');
      setIsUploading(false);
      return;
    }

    const csvGenderCampaign = getFileByName('report_gender_campaign.csv');
    const csvGenderAdGroup = getFileByName('report_gender_adgroup.csv');
    const csvAgeRangeCampaign = getFileByName('report_age_range_campaign.csv');
    const csvAgeRangeAdGroup = getFileByName('report_age_range_adgroup.csv');

    if (!csvGenderCampaign || !csvGenderAdGroup || !csvAgeRangeCampaign || !csvAgeRangeAdGroup) {
      setErrorMessage('Bestanden voldoen niet aan bestandsnaamcriteriaa.');
      return;
    }

    if (analyzeLevel == 'campaignLevel') {
      CsvParserGenderCampaign(csvGenderCampaign, setJsonGenderCampaign);
      CsvParserAgeRangeCampaign(csvAgeRangeCampaign, setJsonAgeRangeCampaign);
    } else if (analyzeLevel == 'adGroupLevel') {
      CsvParserGenderAdGroup(csvGenderAdGroup, setJsonGenderAdGroup);
      CsvParserAgeRangeAdGroup(csvAgeRangeAdGroup, setJsonAgeRangeAdGroup);
    } else {
      setErrorMessage('Niveau van analyse niet gevonden.');
    }
  };

  return (
    <div className="container">
      <div className="titleContainer">
        <h1>Google Ads Rapport Generator</h1>
      </div>
      {errorMessage ? <div className="errorMessage">Error: {errorMessage}</div> : null}
      <div className="dataForm">
        <label>
          Bedrijfsnaam<span style={{ color: '#e74764' }}>*</span>
        </label>
        <input
          placeholder="Bijv. Geen Gedoe"
          onChange={(e) => {
            setCompany(e.target.value);
          }}
        ></input>
        <label>
          Data<span style={{ color: '#e74764' }}>*</span>
        </label>
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
            <label>
              Teksttaal<span style={{ color: '#e74764' }}>*</span>
            </label>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
              }}
            >
              <option value="In het nederlands, ">Nederlands</option>
              <option value="In het engels, ">Engels</option>
            </select>
          </div>
          <div className="textTone">
            <label>
              Teksttoon<span style={{ color: '#e74764' }}>*</span>
            </label>
            <select
              value={tone}
              onChange={(e) => {
                setTone(e.target.value);
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
            <label>
              Analyseniveau<span style={{ color: '#e74764' }}>*</span>
            </label>
            <select
              value={analyzeLevel}
              onChange={(e) => {
                setAnalyzeLevel(e.target.value);
              }}
            >
              <option value="campaignLevel">Campagne</option>
              <option value="adGroupLevel">Advertentiegroep</option>
            </select>
          </div>
          <div className="costPerConversion">
            <label>Gem. CPA account</label>
            <input
              placeholder="Bijv. 5.50"
              onChange={(e) => {
                setKpc(e.target.value);
              }}
            ></input>
          </div>
        </div>
        <label>Toevoegingen</label>
        <input
          placeholder="Context, informatie, etc."
          onChange={(e) => {
            setAdditions(e.target.value);
          }}
        ></input>
      </div>
      <button onClick={prepareData} disabled={isUploading}>
        {isUploading === true ? `${process}${dots}` : 'Analyse uitvoeren'}
      </button>
    </div>
  );
}

export default App;
