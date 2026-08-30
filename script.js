const game = document.querySelector(".game");
const map = document.querySelector(".map");
const coordinates = document.querySelector(".coordinates");

const playerNameInput = document.querySelector("#player-name");
const startButton = document.querySelector("#start-button");
const nextButton = document.querySelector("#next-button");

const intro = document.querySelector("#intro");
const nameScreen = document.querySelector("#name-screen");

const tutorialScreen = document.querySelector("#tutorial-screen");
const dialogueText = document.querySelector("#dialogue-text");

let isDragging = false;

let startMouseX = 0;
let startMouseY = 0;

let mapStartX = -500;
let mapStartY = -500;

let mapX = -500;
let mapY = -500;

let playerName = "";
let tutorialStep = 0;

/* MAP MOVEMENT */

game.addEventListener("mousedown", (event) => {
    if (event.target.closest(".intro")) return;
    isDragging = true;

    startMouseX = event.clientX;
    startMouseY = event.clientY;

    mapStartX = mapX;
    mapStartY = mapY;
});

window.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - startMouseX;
    const deltaY = event.clientY - startMouseY;

    mapX = mapStartX + deltaX;
    mapY = mapStartY + deltaY;

    map.style.left = mapX + "px";
    map.style.top = mapY + "px";
});

window.addEventListener("mouseup", () => {
    isDragging = false;
});

/* COORDINATES */

game.addEventListener("mousemove", (event) => {
    const rect = game.getBoundingClientRect();
    const x = Math.floor(
        (event.clientX - rect.left - mapX) / 80
    );

    const y = Math.floor(
        (event.clientY - rect.top - mapY) / 80
    );

    coordinates.textContent = `X: ${x} | Y: ${y}`;
});

/* START INTRO */

startButton.addEventListener("click", () => {
    playerName = playerNameInput.value.trim();
    if (playerName === "") {
        playerName = "Bürgermeister";
    }

    nameScreen.classList.add("hidden");
    tutorialScreen.classList.remove("hidden");
    dialogueText.textContent = `Hallo, ${playerName}. Willkommen bei City of Code.`;
});

/* BARBARA TUTORIAL */

const dialogueSteps = [
    "Bevor wir anfangen, muss ich dir etwas zeigen.",
    "Das hier sollte einmal eine Stadt werden.",
    "Aber bisher wurde sie noch nicht gebaut.",
    "Und genau deshalb bist du hier.",
    `Du bist der neue Bürgermeister, ${playerName}.`,
    "Deine Aufgabe ist es, aus dieser leeren Fläche eine richtige Stadt zu machen.",
    "Und dein wichtigstes Werkzeug dafür wird Python sein."
];

nextButton.addEventListener("click", () => {
    tutorialStep++;
    if (tutorialStep >= dialogueSteps.length) {
        dialogueText.textContent = "Jetzt können wir mit dem Bau deiner Stadt beginnen.";
        tutorialScreen.classList.add("hidden");

        setTimeout(() => {
            intro.style.display = "none";
        }, 1500);
        return;
    }

    // Da der Name dynamisch ist, wird Schritt index 4 im Array zur Laufzeit aktualisiert
    if (tutorialStep === 4) {
        dialogueText.textContent = `Du bist der neue Bürgermeister, ${playerName}.`;
    } else {
        dialogueText.textContent = dialogueSteps[tutorialStep];
    }
});