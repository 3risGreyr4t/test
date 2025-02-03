const {VertexAI} = require('@google-cloud/vertexai');

// Initialize Vertex with your Cloud project and location cambio hecho 2
const vertex_ai = new VertexAI({project: 'qwiklabs-gcp-00-9c1911dd6113', location: 'us-east4'});
const model = 'gemini-1.5-pro-001';


// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 1,
    topP: 0.95,
    seed: 0,
  },
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'OFF',
    }
  ],
});

const text1 = {text: `como experto jefe de unidad tecnica pedagogica de una escuela publica en Chile, llamada Gabriela Mistral, necesito que una lista de oportunidades de mejora para el criterio de acompañamiento al aula "objetivos claros y alineados con el curriculum", que tiene un puntaje de 30 en un máximo de 60 puntos`};

async function generateContent() {
  const req = {
    contents: [
      {role: 'user', parts: [text1]}
    ],
  };

  const streamingResp = await generativeModel.generateContentStream(req);

  for await (const item of streamingResp.stream) {
    process.stdout.write('stream chunk: ' + JSON.stringify(item) + '\n');
  }

  process.stdout.write('aggregated response: ' + JSON.stringify(await streamingResp.response));
}

generateContent();