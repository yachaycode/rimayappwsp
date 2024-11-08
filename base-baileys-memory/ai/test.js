const { askChatGpt } = require('./chatgpt');

(async () => {
    const question = "¿Qué hora es en brisbane Australia?";
    const answer = await askChatGpt(question);
    console.log('Respuesta de ChatGPT:', answer);
})();