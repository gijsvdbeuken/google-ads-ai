import { useState, useEffect } from 'react';
import { rapportGenerator } from './utilities/RapportGenerator';
import { CsvParserGenderAdGroup, DataStructureGenderAdGroup } from './utilities/CsvParserGenderAdGroup';
import { CsvParserGenderCampaign, DataStructureGenderCampaign } from './utilities/CsvParserGenderCampaign';
import { CsvParserAgeRangeCampaign, DataStructureAgeRangeCampaign } from './utilities/CsvParserAgeRangeCampaign';
import { CsvParserAgeRangeAdGroup, DataStructureAgeRangeAdGroup } from './utilities/CsvParserAgeRangeAdGroup';
import { createSummaryPrompt, createParagraphPrompt, getDebriefingPrompt } from './utilities/CreatePrompts';
import './App.css';

function App() {
  const [companyName, setCompanyName] = useState<string>('');
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
  const [csvAdGroupAlias, setCsvAdGroupAlias] = useState<File>();

  const [process, setProcess] = useState<string>('Verwerken...');

  const summaryPrompt: string = createSummaryPrompt(parameterLanguage, parameterTone, companyName, parameterAdditions);
  const paragraphPrompt: string = createParagraphPrompt(parameterLanguage, parameterTone, parameterKpc, parameterAdditions);
  const debriefingPrompt: string = getDebriefingPrompt();

  const [errorMessage, setErrorMessage] = useState<string>('');

  const [dots, setDots] = useState('.');
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const apiRequest = async (data: String | File | DataStructureGenderCampaign | DataStructureGenderAdGroup | DataStructureAgeRangeCampaign | DataStructureAgeRangeAdGroup, prompt: string, model: string, temperature: number, maxTokens: number) => {
    let csvText: string = '';
    if (data instanceof String) {
      csvText += await data;
    }
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
          message: prompt + (data instanceof File || data instanceof String ? csvText : JSON.stringify(data, null, 2)),
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
            setProcess('Samenvatting creëren');
            const resSummary = await apiRequest(csvSummaryAlias, summaryPrompt, 'gpt-4o-mini', 0.5, 250);
            setProcess(`Alinea's over leeftijden genereren`);
            const resAge = await apiRequest(jsonAgeRangeCampaign, paragraphPrompt, 'gpt-4o', 0.2, 2000);
            setProcess(`Alinea's over geslacht genereren`);
            const resGender = await apiRequest(jsonGenderCampaign, paragraphPrompt, 'gpt-4o', 0.2, 2000);
            setProcess(`Alinea's over apparaten genereren`);
            const resDevices = await apiRequest(csvDeviceAlias, paragraphPrompt, 'gpt-4o', 0.2, 2000);
            setProcess(`Alinea's over weekdagen genereren`);
            const responsePromptDay = await apiRequest(csvDayAlias, paragraphPrompt, 'gpt-4o', 0.2, 2000);
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
      } else if (parameterAnalyzeLevel === 'adGroupLevel') {
        if (jsonAgeRangeAdGroup && Object.keys(jsonAgeRangeAdGroup).length > 0 && jsonGenderAdGroup && Object.keys(jsonGenderAdGroup).length > 0) {
          try {
            if (!csvAdGroupAlias) {
              console.log('Een van de aliassen was leeg.');
              return;
            }
            setProcess('Samenvatting creëren' + dots);
            const responsePromptAdGroup = await apiRequest(csvAdGroupAlias, paragraphPrompt, 'gpt-4o-2024-08-06', 0.2, 3000);
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
        rapportGenerator(response, companyName, currentDate);
      } catch (error) {
        setErrorMessage('Rapport uitschrijven mislukt.');
        console.error('Error:', error);
      }
    }
  }, [response, companyName, currentDate]);

  const prepareData = async () => {
    setErrorMessage('');

    const getFileByName = (fileName: string) => {
      const file = dataBatch.find((file) => file.name === fileName);
      return file;
    };

    setIsUploading(true);

    if (dataBatch.length === 0) {
      setErrorMessage('Geen bestanden geselecteerd.');
      setIsUploading(false);
      return;
    }

    const csvSummary = getFileByName('report_summary.csv');
    setCsvSummaryAlias(csvSummary);
    const csvDevice = getFileByName('report_device.csv');
    setCsvDeviceAlias(csvDevice);
    const csvDay = getFileByName('report_day.csv');
    setCsvDayAlias(csvDay);
    const csvAdGroup = getFileByName('report_adgroup.csv');
    setCsvAdGroupAlias(csvAdGroup);

    const csvGenderCampaign = getFileByName('report_gender_campaign.csv');
    const csvGenderAdGroup = getFileByName('report_gender_adgroup.csv');
    const csvAgeRangeCampaign = getFileByName('report_age_range_campaign.csv');
    const csvAgeRangeAdGroup = getFileByName('report_age_range_adgroup.csv');

    if (!csvGenderCampaign || !csvGenderAdGroup || !csvAgeRangeCampaign || !csvAgeRangeAdGroup) {
      setErrorMessage('Bestanden voldoen niet aan bestandsnaamcriteriaa.');
      return;
    }

    if (parameterAnalyzeLevel == 'campaignLevel') {
      CsvParserGenderCampaign(csvGenderCampaign, setJsonGenderCampaign);
      CsvParserAgeRangeCampaign(csvAgeRangeCampaign, setJsonAgeRangeCampaign);
    } else if (parameterAnalyzeLevel == 'adGroupLevel') {
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
            setCompanyName(e.target.value);
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
            <label>
              Teksttoon<span style={{ color: '#e74764' }}>*</span>
            </label>
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
            <label>
              Analyseniveau<span style={{ color: '#e74764' }}>*</span>
            </label>
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
            <label>Gem. CPA account</label>
            <input
              placeholder="Bijv. 5.50"
              onChange={(e) => {
                setParameterKpc(e.target.value);
              }}
            ></input>
          </div>
        </div>
        <label>Toevoegingen</label>
        <input
          placeholder="Context, informatie, etc."
          onChange={(e) => {
            setParameterAdditions(e.target.value);
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
