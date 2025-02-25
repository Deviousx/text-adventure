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
