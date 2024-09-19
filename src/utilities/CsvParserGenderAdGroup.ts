import Papa from "papaparse";

export interface DataRowGenderAdGroup {
  CampagneNaam: string;
  AdvertentiegroepNaam: string;
  Gender: string;
  Impressies: number;
  Kliks: number;
  CTR: number;
  Kosten: number;
  Conversies: number;
  KostenPerConversie: number;
}

export interface DataStructureGenderAdGroup {
  [Campagnenaam: string]: {
    [Advertentiegroepnaam: string]: {
      [Gender: string]: {
        Impressies: number;
        Kliks: number;
        CTR: number;
        Kosten: number;
        Conversies: number;
        KostenPerConversie: number;
      };
    };
  };
}

export const CsvParserGenderAdGroup = (
  file: File,
  setJsonData: (data: DataStructureGenderAdGroup) => void
) => {
  Papa.parse<DataRowGenderAdGroup>(file, {
    header: true,
    dynamicTyping: true,
    complete: (results) => {
      const data = results.data;
      const structuredData: DataStructureGenderAdGroup = {};

      data.forEach((row) => {
        const {
          CampagneNaam,
          AdvertentiegroepNaam,
          Gender,
          Impressies,
          Kliks,
          CTR,
          Kosten,
          Conversies,
          KostenPerConversie,
        } = row;

        if (!structuredData[CampagneNaam]) {
          structuredData[CampagneNaam] = {};
        }

        if (!structuredData[CampagneNaam][AdvertentiegroepNaam]) {
          structuredData[CampagneNaam][AdvertentiegroepNaam] = {};
        }

        structuredData[CampagneNaam][AdvertentiegroepNaam][Gender] = {
          Impressies,
          Kliks,
          CTR,
          Kosten,
          Conversies,
          KostenPerConversie,
        };
      });

      setJsonData(structuredData);
    },
    error: (error) => {
      console.error("Error parsing CSV:", error);
    },
  });
};
