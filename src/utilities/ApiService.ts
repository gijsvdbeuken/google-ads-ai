export const apiRequest = async (data: String | File | object, prompt: string, model: string, temperature: number, maxTokens: number) => {
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
    console.error('Error while making the API request:', error);
    throw error;
  }
};
