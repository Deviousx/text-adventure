
let currentChapter = 1;
let storyTurns = 0;
let inBattle = false;
let playerHP = 100;
let bossHP = 100;

// Logging messages
function logMessage(message) {
    const logBox = document.getElementById('log');
    const entry = document.createElement('p');
    const time = new Date().toLocaleTimeString();
    entry.innerHTML = `<span style="color:gray;">[${time}]</span> ${message}`;
    logBox.appendChild(entry);
    logBox.scrollTop = logBox.scrollHeight;
}

// AI call
async function getAdventureResponse(prompt) {
    try {
        const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-large', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: `Narrate a dark fantasy adventure story. The player is trying to escape a burning village and uncover the truth about their past. Respond in a dramatic and immersive way, continuing the story based on this action: "${prompt}"`
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

// Handle player input
function submitChoice() {
    const input = document.getElementById("player-input").value;
    if (input.trim() !== "") {
        playerChoice(input);
        document.getElementById("player-input").value = "";
    }
}

// Chapter-based player input
function playerChoice(prompt) {
    if (inBattle) {
        logMessage("You can't explore right now — you're in battle!");
        return;
    }

    storyTurns++;
    getAdventureResponse(`Chapter ${currentChapter}, Turn ${storyTurns}: ${prompt}`);

    if (storyTurns >= 5) {
        setTimeout(() => {
            startBossBattle();
        }, 1500);
    }
}

// Boss battle starts
function startBossBattle() {
    inBattle = true;
    bossHP = 100;
    document.getElementById("enemy-name").textContent = `Chapter ${currentChapter} Boss`;
    updateEnemyUI();
    logMessage(` A shadow emerges... The Chapter ${currentChapter} boss has appeared!`);
}

// Player attacks boss
function playerAttack() {
    if (!inBattle) {
        logMessage("There is no enemy to attack.");
        return;
    }

    const dmg = Math.floor(Math.random() * 20) + 5;
    bossHP -= dmg;
    logMessage(`You strike the boss for ${dmg} damage!`);
    updateEnemyUI();

    if (bossHP <= 0) {
        logMessage(`You defeated the Chapter ${currentChapter} boss!`);
        inBattle = false;
        currentChapter++;
        storyTurns = 0;
        updateChapterTitle();

        if (currentChapter <= 5) {
            setTimeout(startChapter, 3000);
        } else {
            endGame();
        }
        return;
    }

    // Boss strikes back
    const bossHit = Math.floor(Math.random() * 15) + 3;
    playerHP -= bossHit;
    logMessage(`The boss counterattacks! You lose ${bossHit} HP.`);

    if (playerHP <= 0) {
        logMessage("You have fallen... but something strange happens...");
        setTimeout(() => {
            currentChapter = 1;
            storyTurns = 0;
            playerHP = 100;
            inBattle = false;
            startChapter();
        }, 3000);
    }
}

// Display enemy health
function updateEnemyUI() {
    const bar = document.getElementById("enemy-health-bar");
    const hpText = document.getElementById("enemy-health-text");
    const percent = Math.max(0, (bossHP / 100) * 100);
    bar.style.width = `${percent}%`;
    hpText.textContent = `${Math.max(0, bossHP)} / 100 HP`;
}

// Display chapter number
function updateChapterTitle() {
    document.getElementById("chapter-title").textContent = `Chapter ${currentChapter}`;
}

// Start a new chapter
function startChapter() {
    playerHP = 100;
    bossHP = 0;
    storyTurns = 0;
    inBattle = false;
    updateEnemyUI();
    updateChapterTitle();

    if (currentChapter === 1) {
        logMessage("You wake up surrounded by flames and ash. Your village... gone. You remember nothing.");
    } else {
        logMessage(` Chapter ${currentChapter} begins. What will you do?`);
    }
}

// Final twist ending
function endGame() {
    inBattle = false;
    logMessage("You land the final blow... and suddenly feel dizzy.");
    setTimeout(() => {
        logMessage(" You awaken in a hospital. Sirens blare. Red light pours through the window.");
    }, 3000);
    setTimeout(() => {
        logMessage("There's a fire outside. You remember now... You caused all of this.");
    }, 6000);
    setTimeout(() => {
        logMessage("The loop begins again...");
        currentChapter = 1;
        storyTurns = 0;
        startChapter();
    }, 9000);
}

// Start the game
startChapter();
