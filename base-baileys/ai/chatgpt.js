const axios = require('axios');

const askChatGpt = async (messages) => {
    try {
        console.log('messages:', messages);
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o-mini',
            messages: messages, 
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 
                'Content-Type': 'application/json',
            },
        });
        console.log('Respuesta GPT:', response.data.choices[0].message.content);
        return response.data.choices[0].message.content; 
    } catch (error) {
        console.error('Error al consultar a ChatGPT:', error);
        throw new Error('Error al consultar a ChatGPT');
    }
};

module.exports = { askChatGpt };
