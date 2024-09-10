export const dataUploader = async (
  campaignData: File[],
  overviewPrompt: string,
  detailedPrompt: string,
  setResponse: (response: string) => void
) => {
  if (campaignData.length === 0) {
    return;
  }

  try {
    const combineTextAndAnalyze = async (files: File[], prompt: string) => {
      let combinedText = "";
      for (const file of files) {
        combinedText += await file.text();
      }

      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: prompt + combinedText }),
      });

      return await response.json();
    };

    const analyzedCampagne = await combineTextAndAnalyze(
      campaignData,
      overviewPrompt
    );

    const analyzedCampaignOne = await combineTextAndAnalyze(
      campaignData,
      detailedPrompt
    );

    setResponse(
      analyzedCampagne.content + "\n\n" + analyzedCampaignOne.content
    );
  } catch (err) {
    console.log(err);
  }
};
