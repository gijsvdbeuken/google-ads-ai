import Papa from "papaparse";

export interface DataRowAgeRangeCampaign {
  CampagneNaam: string;
  Leeftijd: string;
  TotaalImpressies: number;
  TotaalKliks: number;
  TotaalKosten: number;
  TotaalConversies: number;
  GemiddeldeCTR: number;
  GemiddeldeCPC: number;
  GemiddeldeKostenPerConversie: number;
}

export interface DataStructureAgeRangeCampaign {
  [Campagnenaam: string]: {
    [Leeftijd: string]: {
      TotaalImpressies: number;
      TotaalKliks: number;
      TotaalKosten: number;
      TotaalConversies: number;
      GemiddeldeCTR: number;
      GemiddeldeCPC: number;
      GemiddeldeKostenPerConversie: number;
    };
  };
}

export const CsvParserAgeRangeCampaign = (
  file: File,
  setJsonData: (data: DataStructureAgeRangeCampaign) => void
) => {
  Papa.parse<DataRowAgeRangeCampaign>(file, {
    header: true,
    dynamicTyping: true,
    complete: (results) => {
      const data = results.data;
      const structuredData: DataStructureAgeRangeCampaign = {};

      data.forEach((row) => {
        const {
          CampagneNaam,
          Leeftijd,
          TotaalImpressies,
          TotaalKliks,
          TotaalKosten,
          TotaalConversies,
          GemiddeldeCTR,
          GemiddeldeCPC,
          GemiddeldeKostenPerConversie,
        } = row;

        if (!structuredData[CampagneNaam]) {
          structuredData[CampagneNaam] = {};
        }

        structuredData[CampagneNaam][Leeftijd] = {
          TotaalImpressies,
          TotaalKliks,
          TotaalKosten,
          TotaalConversies,
          GemiddeldeCTR,
          GemiddeldeCPC,
          GemiddeldeKostenPerConversie,
        };
      });

      setJsonData(structuredData);
    },
    error: (error) => {
      console.error("Error parsing CSV:", error);
    },
  });
};
