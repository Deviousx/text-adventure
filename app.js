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
//Hugging Face integration to use it as a chatbot game
async function getAdventureResponse(prompt) {
    try {
        const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-large', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: `You are a fantasy adventure narrator. Continue the story: ${prompt}`
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("HF API error:", data.error);
            logMessage("AI error: " + data.error.message);
        } else {
            const aiReply = data[0]?.generated_text || "The AI was quiet this time.";
            logMessage("AI: " + aiReply);
        }

    } catch (err) {
        console.error("Fetch error:", err);
        logMessage("Something went wrong talking to the AI.");
    }
}
