let currentChapter = 1;
let storyTurns = 0;
let inBattle = false;
let playerHP = 100;
let bossHP = 100;

let messageHistory = [
  {
    role: "system",
    content:
      "You are a dark fantasy narrator for a text-based adventure game. The player wakes up in a hospital which is burning down. The player is escaping a burning town and uncovering the truth about their past. Narrate in an immersive, dramatic way based on the player's actions. Always end your response with a question asking what they do next, and suggest 2–3 vivid actions they could take. After 5 choices, a chapter boss appears. Wait for the player to defeat the boss before continuing the story or starting the next chapter."
  }
];

// Logging messages
function logMessage(message) {
  const logBox = document.getElementById("log");
  const entry = document.createElement("p");
  const time = new Date().toLocaleTimeString();
  entry.innerHTML = `<span style="color:gray;">[${time}]</span> ${message}`;
  logBox.appendChild(entry);
  logBox.scrollTop = logBox.scrollHeight;
}

// AI call
async function getAdventureResponse(playerAction) {
  try {
    messageHistory.push({ role: "user", content: playerAction });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://yourdomain.com", // optional
        "X-Title": "AI Text Adventure Game"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: messageHistory,
        temperature: 0.85,
        max_tokens: 600
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenRouter API error:", data.error);
      logMessage("AI error: " + data.error.message);
    } else {
      const aiReply = data.choices?.[0]?.message?.content || "The AI said nothing.";
      messageHistory.push({ role: "assistant", content: aiReply });
      logMessage("AI: " + aiReply);

      if (messageHistory.length > 20) {
        messageHistory.splice(1, 2);
      }
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
// Chapter-based player input
function playerChoice(prompt) {
    if (inBattle) {
      logMessage("You can't explore right now — you're in battle!");
      return;
    }
  
    storyTurns++;
  
    logMessage(`<b>You:</b> ${prompt}`);
    getAdventureResponse(prompt);
  
    if (storyTurns === 5) {
      setTimeout(() => {
        startBossBattle();
      }, 2000);
      logMessage(`You feel a sinister presence building... Something is coming.`);
    } else if (storyTurns < 5) {
      logMessage(`(${storyTurns}/5 turns until boss appears)`);
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
      messageHistory.push({
        role: "system",
        content: `The player has completed Chapter ${currentChapter - 1}. Begin Chapter ${currentChapter}.`
      });
      setTimeout(startChapter, 3000);
    } else {
      endGame();
    }
    return;
  }

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
      messageHistory = messageHistory.slice(0, 1);
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
    logMessage("You wake up surrounded by flames and ash in a hospital. Your house, town... all gone. You remember nothing. The hospital is on fire. What do you do?");
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
    messageHistory = messageHistory.slice(0, 1);
    startChapter();
  }, 9000);
}

// Start the game
startChapter();
