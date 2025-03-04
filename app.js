// Basic game interaction setup

let health = 100;
let mana = 50;
let lives = 3;

function logMessage(message) {
    const logBox = document.getElementById('log');
    const entry = document.createElement('p');
    entry.textContent = message;
    logBox.appendChild(entry);
}
//OpenAI integration to use it as a chatbot game
async function getAdventureResponse(prompt) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + OPENAI_API_KEY
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a fantasy adventure game narrator.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 150,
                temperature: 0.8
            })
        });

        const data = await response.json();
        const aiReply = data.choices[0].message.content;
        logMessage("AI: " + aiReply);

    } catch (error) {
        console.error("OpenAI error:", error);
        logMessage("No response from AI... something went wrong.");
    }
}
