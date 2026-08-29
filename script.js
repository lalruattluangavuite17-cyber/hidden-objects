/* ===================================================== 
   HIDDEN OBJECTS 
   ROOM 01 
===================================================== */ 
 
const TOTAL_OBJECTS = 12; 
 
const START_TIME = 180; 
 
/* ===================================================== 
   ECHOES IN THE DUST — TITLE / OPENING 
===================================================== */ 
 
const titleScreen = 
    document.getElementById("title-screen"); 
 
const startGameButton = 
    document.getElementById("start-game"); 
 
const openingTransition = 
    document.getElementById("opening-transition"); 
 
 
startGameButton.addEventListener( 
    "click", 
    function () { 
 
        /* Hide title screen */ 
 
        titleScreen.classList.add("hide"); 
 
 
        /* Show Room 01 transition */ 
 
        openingTransition.classList.add("show"); 
 
 
        /* Start game after transition */ 
 
        setTimeout(function () { 
 
            openingTransition.classList.remove("show"); 
 
        }, 3200); 
 
    } 
); 
 
let timeLeft = START_TIME; 
 
let foundObjects = 0; 
 
let gameRunning = true; 
 
let timerInterval; 
 
let hintAvailable = false; 
let hintUnlockTimer; 
 
/* ===================================================== 
   SOUND EFFECTS 
===================================================== */ 
 
let audioContext; 
 
function getAudioContext() { 
 
    if (!audioContext) { 
        audioContext = 
            new (window.AudioContext || window.webkitAudioContext)(); 
    } 
 
    if (audioContext.state === "suspended") { 
        audioContext.resume(); 
    } 
 
    return audioContext; 
} 
 
document.addEventListener("pointerdown", function () { 
 
    const ctx = getAudioContext(); 
 
    /* Wake up the browser audio system */ 
 
    const oscillator = ctx.createOscillator(); 
    const gain = ctx.createGain(); 
 
    gain.gain.value = 0; 
 
    oscillator.connect(gain); 
    gain.connect(ctx.destination); 
 
    oscillator.start(); 
    oscillator.stop(ctx.currentTime + 0.01); 
 
}, { once: true }); 
 
 
/* Object discovered */ 
 
function playFoundSound() { 
 
    const ctx = getAudioContext(); 
    const oscillator = ctx.createOscillator(); 
    const gain = ctx.createGain(); 
 
    oscillator.type = "sine"; 
 
    oscillator.frequency.setValueAtTime(520, ctx.currentTime); 
    oscillator.frequency.exponentialRampToValueAtTime( 
        780, 
        ctx.currentTime + 0.12 
    ); 
 
    gain.gain.setValueAtTime(0.0001, ctx.currentTime); 
 
    gain.gain.exponentialRampToValueAtTime( 
        0.12, 
        ctx.currentTime + 0.02 
    ); 
 
    gain.gain.exponentialRampToValueAtTime( 
        0.0001, 
        ctx.currentTime + 0.35 
    ); 
 
    oscillator.connect(gain); 
    gain.connect(ctx.destination); 
 
    oscillator.start(); 
    oscillator.stop(ctx.currentTime + 0.35); 
} 
 
/* Hint sparkle sound */ 
 
function playHintSound() { 
 
    const ctx = getAudioContext(); 
 
    const notes = [880, 1175, 1568]; 
 
    notes.forEach(function (frequency, index) { 
 
        const oscillator = ctx.createOscillator(); 
        const gain = ctx.createGain(); 
 
        oscillator.type = "sine"; 
 
        const startTime = 
            ctx.currentTime + index * 0.08; 
 
        oscillator.frequency.setValueAtTime( 
            frequency, 
            startTime 
        ); 
 
        gain.gain.setValueAtTime( 
            0.0001, 
            startTime 
        ); 
 
        gain.gain.exponentialRampToValueAtTime( 
            0.07, 
            startTime + 0.015 
        ); 
 
        gain.gain.exponentialRampToValueAtTime( 
            0.0001, 
            startTime + 0.35 
        ); 
 
        oscillator.connect(gain); 
        gain.connect(ctx.destination); 
 
        oscillator.start(startTime); 
        oscillator.stop(startTime + 0.35); 
 
    }); 
} 
 
 
/* Victory sound */ 
 
function playWinSound() { 
 
    const ctx = getAudioContext(); 
 
    const notes = [523, 659, 784]; 
 
    notes.forEach(function (frequency, index) { 
 
        const oscillator = ctx.createOscillator(); 
        const gain = ctx.createGain(); 
 
        oscillator.type = "sine"; 
 
        const startTime = 
            ctx.currentTime + index * 0.16; 
 
        oscillator.frequency.setValueAtTime( 
            frequency, 
            startTime 
        ); 
 
        gain.gain.setValueAtTime( 
            0.0001, 
            startTime 
        ); 
 
        gain.gain.exponentialRampToValueAtTime( 
            0.14, 
            startTime + 0.03 
        ); 
 
        gain.gain.exponentialRampToValueAtTime( 
            0.0001, 
            startTime + 0.45 
        ); 
 
        oscillator.connect(gain); 
        gain.connect(ctx.destination); 
 
        oscillator.start(startTime); 
        oscillator.stop(startTime + 0.45); 
 
    }); 
} 
 
 
/* ===================================================== 
   OBJECT HINTS 
===================================================== */ 
 
const hints = { 
 
    wrench: 
        "Something small has fallen among the things scattered near the floor.", 
 
    candle: 
        "A little light is waiting quietly near the old fireplace.", 
 
    teddy: 
        "Someone's forgotten companion is sitting among the clutter.", 
 
    ball: 
        "Look for something round hiding among the objects on the right.", 
 
    train: 
        "A tiny journey is waiting somewhere near the bottom of the room.", 
 
    fan: 
        "Something once used on a warm afternoon is lying among the old belongings.", 
 
    horn: 
        "A forgotten instrument is hiding close to the lower-right corner.", 
 
    bottle: 
        "Look around the old shelves and fireplace area.", 
 
    camera: 
        "Someone once used this to capture memories in this room.", 
 
    watch: 
        "Time seems to have stopped somewhere near the staircase.", 
 
    ribbon: 
        "A small piece of red is hiding among the clutter.", 
 
    "machine-fan": 
        "A machine from another time is standing quietly in the middle of the room." 
 
}; 
 
 
/* ===================================================== 
   GET ELEMENTS 
===================================================== */ 
 
const timeDisplay = 
    document.getElementById("time"); 
 
const foundDisplay = 
    document.getElementById("found-count"); 
 
const hintButton = 
    document.getElementById("hint-button"); 
 
const hintText = 
    document.getElementById("hint-text"); 
 
const restartButton = 
    document.getElementById("restart"); 
 
const playAgainButton = 
    document.getElementById("play-again"); 
 
const finalFound = 
    document.getElementById("final-found"); 
 
const finalTime = 
    document.getElementById("final-time"); 
 
const winScreen = 
    document.getElementById("win-screen"); 
 
const bottomMessage = 
    document.getElementById("bottom-message"); 
 
const hotspots = 
    document.querySelectorAll(".hotspot"); 
 
const objectCards = 
    document.querySelectorAll(".object"); 
 
/* ===================================================== 
   ROOM 01 → ROOM 02 
   NO TRANSITION 
===================================================== */ 
 
const nextRoomButton = 
    document.getElementById("next-room"); 
 
nextRoomButton.addEventListener( 
    "click", 
    function () { 
 
        window.location.href = 
            "room2.html"; 
 
    } 
); 
 
 
/* ===================================================== 
   START 
===================================================== */ 
 
updateTimer(); 
 
hintAvailable = true; 
 
hintButton.disabled = false; 
 
hintButton.textContent = 
    "✨ Show Hint"; 
 
 
/* Don't start timer yet */ 
gameRunning = false; 
 
 
/* Start after opening sequence */ 
 
startGameButton.addEventListener( 
    "click", 
    function () { 
 
        titleScreen.classList.add("hide"); 
 
        openingTransition.classList.add("show"); 
 
        setTimeout(function () { 
 
            openingTransition.classList.remove("show"); 
 
            gameRunning = true; 
 
            startTimer(); 
 
        }, 3200); 
 
    } 
); 
 
/* ===================================================== 
   TIMER 
===================================================== */ 
 
function startTimer() { 
 
    clearInterval(timerInterval); 
 
    timerInterval = setInterval(function () { 
 
        if (!gameRunning) { 
            return; 
        } 
 
        timeLeft--; 
 
        updateTimer(); 
 
        if (timeLeft <= 0) { 
 
            timeLeft = 0; 
 
            updateTimer(); 
 
            gameOver(); 
        } 
 
    }, 1000); 
} 
 
 
/* ===================================================== 
   UPDATE TIMER 
===================================================== */ 
 
function updateTimer() { 
 
    const minutes = 
        Math.floor(timeLeft / 60); 
 
    const seconds = 
        timeLeft % 60; 
 
    const formattedSeconds = 
        seconds.toString().padStart(2, "0"); 
 
    timeDisplay.textContent = 
        `${minutes}:${formattedSeconds}`; 
 
    if (timeLeft <= 30 && timeLeft > 0) { 
    document 
        .getElementById("timer") 
        .classList.add("warning"); 
    }   else  { 
    document 
        .getElementById("timer") 
        .classList.remove("warning"); 
    } 
} 
 
 
/* ===================================================== 
   HIDDEN OBJECT CLICK 
===================================================== */ 
 
hotspots.forEach(function (hotspot) { 
 
    hotspot.addEventListener("click", function (event) { 
 
        if (!gameRunning) { 
            return; 
        } 
 
        const objectName = 
            hotspot.dataset.object; 
 
        if (hotspot.classList.contains("found")) { 
            return; 
        } 
 
        event.preventDefault(); 
 
        /* Mark hotspot */ 
 
        hotspot.classList.add("found"); 
        
        hotspot.classList.remove(
    "hint"
);
        playFoundSound(); 
 
 
        /* Mark list item */ 
 
        const card = 
            document.querySelector( 
                `.object[data-object="${objectName}"]` 
            ); 
 
        if (card) { 
            card.classList.add("found"); 
        } 
 
 
        /* Increase score */ 
 
        foundObjects++; 
 
        foundDisplay.textContent = 
            foundObjects; 
 
 
        /* Message */ 
 
        bottomMessage.textContent = 
            "You found something..."; 
 
        hintText.textContent = 
            "Good eye. Keep searching..."; 
 
 
        /* Victory */ 
 
        if (foundObjects >= TOTAL_OBJECTS) { 
 
            winGame(); 
        } 
 
    }); 
 
}); 
 
/* ===================================================== 
   HINT SYSTEM — 30 SECOND COOLDOWN 
===================================================== */ 
 
function startHintCooldown() { 
 
    hintAvailable = false; 
 
    hintButton.disabled = true; 
 
    let firstHintSeconds = 30; 
 
    hintButton.textContent = 
        `Hint available in ${firstHintSeconds}s`; 
 
    hintUnlockTimer = 
        setInterval(function () { 
 
            firstHintSeconds--; 
 
            if (firstHintSeconds > 0) { 
 
                hintButton.textContent = 
                    `Hint available in ${firstHintSeconds}s`; 
 
            } 
 
            if (firstHintSeconds <= 0) { 
 
                clearInterval(hintUnlockTimer); 
 
                unlockHint(); 
            } 
 
        }, 1000); 
 
} 
 
 
    
 
 
 
/* ===================================================== 
   UNLOCK HINT 
===================================================== */ 
 
function unlockHint() { 
 
    hintAvailable = true; 
 
    hintButton.disabled = false; 
 
    hintButton.textContent = 
        "✨ Show Hint"; 
 
    hintText.textContent = 
        "A clue is available..."; 
 
    playHintSound(); 
} 
 
 
/* ===================================================== 
   HINT BUTTON 
===================================================== */ 
 
hintButton.addEventListener("click", function () { 
 
    if (!gameRunning) { 
        return; 
    } 
 
    if (!hintAvailable) { 
        return; 
    } 
 
    const remaining = 
        Array.from(hotspots).filter(function (hotspot) { 
 
            return !hotspot.classList.contains("found"); 
 
        }); 
 
 
    if (remaining.length === 0) { 
 
        hintText.textContent = 
            "You found everything!"; 
 
        return; 
    } 
 
 
    /* Play sparkle */ 
 
    playHintSound(); 
 
    /* Pick random object */ 
 
    const randomIndex = 
        Math.floor( 
            Math.random() * remaining.length 
        ); 
 
 
    const chosen = 
        remaining[randomIndex]; 
 
 
    const objectName = 
        chosen.dataset.object; 
 
 
    /* Show clue */ 
 
    hintText.textContent = 
        hints[objectName]; 
 
 
    /* Highlight object */ 
 
    chosen.classList.add("hint"); 
 
 
    setTimeout(function () { 
 
        chosen.classList.remove("hint"); 
 
    }, 3000); 
 
 
    /* Start 30 second cooldown */ 
 
    startHintCooldown(); 
 
}); 
 
/* ===================================================== 
   RESTART 
===================================================== */ 
 
restartButton.addEventListener( 
    "click", 
    restartGame 
); 
 
 
playAgainButton.addEventListener( 
    "click", 
    restartGame 
); 
 
 
/* ===================================================== 
   RESTART FUNCTION 
===================================================== */ 
 
function restartGame() { 
 
    /* Reset game state */ 
 
    foundObjects = 0; 
    timeLeft = START_TIME; 
    gameRunning = true; 
 
 
    /* Reset score */ 
 
    foundDisplay.textContent = 
        "0"; 
 
 
    /* Reset messages */ 
 
    bottomMessage.textContent = 
        "Look carefully..."; 
 
    hintText.textContent = 
        "Some things are easier to find when you know where to look."; 
 
 
    /* Reset hint */ 
 
    hintAvailable = false; 
 
    hintButton.disabled = true; 
 
    let restartHintSeconds = 30; 
 
    hintButton.textContent = 
        `Hint available in ${restartHintSeconds}s`; 
 
 
    /* Clear old hint timer */ 
 
    clearInterval(hintUnlockTimer); 
 
 
    /* Reset win screen */ 
 
    winScreen.classList.remove("show"); 
 
 
    /* Reset hotspots */ 
 
    hotspots.forEach(function (hotspot) { 
 
        hotspot.classList.remove("found"); 
 
        hotspot.classList.remove("hint"); 
 
    }); 
 
 
    /* Reset object list */ 
 
    objectCards.forEach(function (card) { 
 
        card.classList.remove("found"); 
 
    }); 
 
 
    /* Reset timer */ 
 
    updateTimer(); 
 
    startTimer(); 
 
 
    /* ===================================================== 
       30 SECOND HINT COUNTDOWN 
    ===================================================== */ 
 
    hintUnlockTimer = 
        setInterval(function () { 
 
            restartHintSeconds--; 
 
 
            if (restartHintSeconds > 0) { 
 
                hintButton.textContent = 
                    `Hint available in ${restartHintSeconds}s`; 
 
            } 
 
 
            if (restartHintSeconds <= 0) { 
 
                clearInterval(hintUnlockTimer); 
 
                unlockHint(); 
 
            } 
 
        }, 1000); 
 
} 
 
/* ===================================================== 
   WIN GAME 
===================================================== */ 
 
function winGame() { 
 
    gameRunning = false; 
 
    clearInterval(timerInterval); 
 
    bottomMessage.textContent = 
        "Everything has been found."; 
 
    finalFound.textContent = 
        `${foundObjects} / ${TOTAL_OBJECTS}`; 
 
    const minutes = 
        Math.floor(timeLeft / 60); 
 
    const seconds = 
        timeLeft % 60; 
 
    finalTime.textContent = 
        `${minutes}:${seconds 
            .toString() 
            .padStart(2, "0")}`; 
 
    playWinSound(); 
 
    winScreen.classList.add("show"); 
} 
 
 
/* ===================================================== 
   GAME OVER 
===================================================== */ 
 
function gameOver() { 
 
    gameRunning = false; 
 
    clearInterval(timerInterval); 
 
 
    hintText.textContent = 
        "The room is still hiding things..."; 
 
 
    bottomMessage.textContent = 
        "Time's up!"; 
 
 
    alert( 
        "Time's up!\n\n" + 
        "You found " + 
        foundObjects + 
        " out of " + 
        TOTAL_OBJECTS + 
        " objects." 
    ); 
 
} 