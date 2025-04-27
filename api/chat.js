// api/chat.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Solo se permiten solicitudes POST.' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Falta el mensaje en la solicitud.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Eres Julius 9000: un asistente técnico, lógico, algo torpe en lo social pero entrañable, que ayuda a resolver dudas técnicas de forma clara y ordenada. Evitas hablar de emociones complejas y llevas todo al terreno lógico.' },
          { role: 'user', content: message }
        ],
        temperature: 0.4
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ message: 'Error en OpenAI', details: data.error });
    }

    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    return res.status(500).json({ message: 'Error de servidor', error: error.message });
  }
}
