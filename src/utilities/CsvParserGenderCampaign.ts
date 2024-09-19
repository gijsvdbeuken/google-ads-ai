import Papa from "papaparse";

export interface DataRowGenderCampaign {
  CampagneNaam: string;
  Gender: string;
  TotaalImpressies: number;
  TotaalKliks: number;
  TotaalKosten: number;
  TotaalConversies: number;
  GemiddeldeCTR: number;
  GemiddeldeCPC: number;
  GemiddeldeKostenPerConversie: number;
}

export interface DataStructureGenderCampaign {
  [Campagnenaam: string]: {
    [Gender: string]: {
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

export const CsvParserGenderCampaign = (
  file: File,
  setJsonData: (data: DataStructureGenderCampaign) => void
) => {
  Papa.parse<DataRowGenderCampaign>(file, {
    header: true,
    dynamicTyping: true,
    complete: (results) => {
      const data = results.data;
      const structuredData: DataStructureGenderCampaign = {};

      data.forEach((row) => {
        const {
          CampagneNaam,
          Gender,
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

        structuredData[CampagneNaam][Gender] = {
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
