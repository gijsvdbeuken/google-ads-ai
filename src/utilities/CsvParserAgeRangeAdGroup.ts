import Papa from "papaparse";

export interface DataRowAgeRangeAdGroup {
  CampagneNaam: string;
  AdvertentiegroepNaam: string;
  Leeftijd: string;
  Impressies: number;
  Kliks: number;
  CTR: number;
  Kosten: number;
  Conversies: number;
  KostenPerConversie: number;
}

export interface DataStructureAgeRangeAdGroup {
  [Campagnenaam: string]: {
    [Advertentiegroepnaam: string]: {
      [Leeftijd: string]: {
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

export const CsvParserAgeRangeAdGroup = (
  file: File,
  setJsonData: (data: DataStructureAgeRangeAdGroup) => void
) => {
  Papa.parse<DataRowAgeRangeAdGroup>(file, {
    header: true,
    dynamicTyping: true,
    complete: (results) => {
      const data = results.data;
      const structuredData: DataStructureAgeRangeAdGroup = {};

      data.forEach((row) => {
        const {
          CampagneNaam,
          AdvertentiegroepNaam,
          Leeftijd,
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

        structuredData[CampagneNaam][AdvertentiegroepNaam][Leeftijd] = {
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
