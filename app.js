// Basic game interaction setup

let health = 100;
let mana = 50;
let lives = 3;
// Enemy setup
let enemy = {
    name: "Shadow Warlock",
    health: 100,
    maxHealth: 100
};


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
function getRandomLoot() {
    const lootTable = [
        { item: "Rusty Sword", rarity: "Basic", chance: 50 },
        { item: "Iron Dagger", rarity: "Basic", chance: 50 },
        { item: "Enchanted Staff", rarity: "Rare", chance: 25 },
        { item: "Dragonbone Shield", rarity: "Epic", chance: 10 },
        { item: "Ring of Immortality", rarity: "Legendary", chance: 5 }
    ];

    const roll = Math.random() * 100;
    let cumulative = 0;

    for (let loot of lootTable) {
        cumulative += loot.chance;
        if (roll <= cumulative) {
            return loot;
        }
    }

    return null; // No loot if unlucky
}

function giveLoot() {
    const loot = getRandomLoot();
    if (loot) {
        logMessage(`You found a ${loot.rarity} item: ${loot.item}`);
    } else {
        logMessage("No loot this time... D:");
    }
}
function attackEnemy() {
    const damage = Math.floor(Math.random() * 20) + 5; // 5–24 damage
    enemy.health -= damage;

    if (enemy.health <= 0) {
        enemy.health = 0;
        logMessage(`⚔️ You dealt ${damage} damage and defeated the ${enemy.name}! Congrats`);
        // Reset for now
        setTimeout(() => {
            enemy.health = enemy.maxHealth;
            logMessage(`A new ${enemy.name} appears! Prepare to fight again.`);
        }, 3000);
    } else {
        logMessage(`⚔️ You dealt ${damage} damage to the ${enemy.name}. (${enemy.health}/${enemy.maxHealth} HP left)`);
    }
}

