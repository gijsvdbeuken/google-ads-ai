import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

export const rapportGenerator = (text: string, companyName: string | null, currentDate: string) => {
  const paragraphs = text.split('\n\n');

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                font: 'Arial',
                text: 'Google Ads Optimalisatie',
                bold: true,
                size: 48,
                color: 'E74764',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                font: 'Arial',
                text: `${companyName}`,
                bold: true,
                size: 20,
                color: 'E74764',
              }),
            ],
          }),
          new Paragraph({}),
          new Paragraph({
            children: [
              new TextRun({
                font: 'Arial',
                text: `Geen Gedoe - Media & Marketing - ${currentDate}`,
                size: 20,
                color: '113676',
              }),
            ],
          }),
          new Paragraph({}),
          new Paragraph({
            children: [
              new TextRun({
                font: 'Arial',
                text: 'Inleiding',
                bold: true,
                size: 20,
                color: 'E74764',
              }),
            ],
          }),
          new Paragraph({}),
          new Paragraph({
            children: [
              new TextRun({
                font: 'Arial',
                text: `Bij deze sturen wij je de maandelijkse rapportage van de Google Ads optimalisatie van de lopende campagne(s).`,
                size: 20,
                color: '113676',
              }),
            ],
          }),
          new Paragraph({}),
          ...paragraphs.flatMap((paragraph) => {
            const isTitle = paragraph === 'Samenvatting' || paragraph === 'Leeftijden' || paragraph === 'Geslacht' || paragraph === 'Apparaten' || paragraph === 'Dag en Tijd';

            return [
              new Paragraph({
                children: [
                  new TextRun({
                    font: 'Arial',
                    text: paragraph,
                    size: 20,
                    bold: isTitle,
                    color: isTitle ? 'E74764' : '113676',
                  }),
                ],
              }),
              new Paragraph({ text: '' }),
            ];
          }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, 'analyse.docx');
  });
};
