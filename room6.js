/* =====================================================
   HIDDEN OBJECTS
   ROOM 06 — THE OLD KITCHEN
===================================================== */

const TOTAL_OBJECTS = 12;

const START_TIME = 180;

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
            new (window.AudioContext ||
                window.webkitAudioContext)();
    }

    if (audioContext.state === "suspended") {

        audioContext.resume();
    }

    return audioContext;
}


/* =====================================================
   WAKE BROWSER AUDIO
===================================================== */

document.addEventListener(
    "pointerdown",
    function () {

        const ctx = getAudioContext();

        const oscillator =
            ctx.createOscillator();

        const gain =
            ctx.createGain();

        gain.gain.value = 0;

        oscillator.connect(gain);

        gain.connect(ctx.destination);

        oscillator.start();

        oscillator.stop(
            ctx.currentTime + 0.01
        );

    },
    { once: true }
);


/* =====================================================
   OBJECT FOUND SOUND
===================================================== */

function playFoundSound() {

    const ctx = getAudioContext();

    const oscillator =
        ctx.createOscillator();

    const gain =
        ctx.createGain();

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(
        520,
        ctx.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        780,
        ctx.currentTime + 0.12
    );

    gain.gain.setValueAtTime(
        0.0001,
        ctx.currentTime
    );

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

    oscillator.stop(
        ctx.currentTime + 0.35
    );
}


/* =====================================================
   HINT SPARKLE SOUND
===================================================== */

function playHintSound() {

    const ctx = getAudioContext();

    const notes = [
        880,
        1175,
        1568
    ];

    notes.forEach(
        function (frequency, index) {

            const oscillator =
                ctx.createOscillator();

            const gain =
                ctx.createGain();

            oscillator.type = "sine";

            const startTime =
                ctx.currentTime +
                index * 0.08;

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

            oscillator.stop(
                startTime + 0.35
            );

        }
    );
}


/* =====================================================
   VICTORY SOUND
===================================================== */

function playWinSound() {

    const ctx = getAudioContext();

    const notes = [
        523,
        659,
        784
    ];

    notes.forEach(
        function (frequency, index) {

            const oscillator =
                ctx.createOscillator();

            const gain =
                ctx.createGain();

            oscillator.type = "sine";

            const startTime =
                ctx.currentTime +
                index * 0.16;

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

            oscillator.stop(
                startTime + 0.45
            );

        }
    );
}


/* =====================================================
   ROOM 06 OBJECT HINTS
===================================================== */

const hints = {

    "old-glasses":
        "Something used to see clearly has been left behind in the dusty kitchen.",

    "kerosene-lantern":
        "Look for an old light that once helped someone see through the darkness.",

    "lonely-banana":
        "A piece of fruit seems strangely out of place among the forgotten kitchenware.",

    "steel-can":
        "Something made of metal is hiding among the old kitchen supplies.",

    "yarn-balls":
        "Look for tangled little balls of thread waiting somewhere in the room.",

    "broken-plate":
        "Something once used for serving food has seen better days.",

    "odd-cup":
        "One cup doesn't quite belong with the rest of the forgotten things.",

    "sealed-envelope":
        "A message that was never opened is waiting somewhere nearby.",

    "ghost-face":
        "Something that looks almost like a face is hiding in the shadows.",

    "brown-butterfly":
        "A small winged visitor has somehow found its way into the old kitchen.",

    "golden-bracelet":
        "Something shiny and precious has been forgotten among the dust.",

    "tailor-pin":
        "A tiny object once used for sewing is hiding somewhere in the kitchen."

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
   START GAME
===================================================== */

updateTimer();

hintAvailable = false;

hintButton.disabled = true;

hintButton.textContent =
    "Hint available in 30s";

startTimer();


hintUnlockTimer =
    setTimeout(
        function () {

            unlockHint();

        },
        30000
    );


/* =====================================================
   TIMER
===================================================== */

function startTimer() {

    clearInterval(timerInterval);

    timerInterval =
        setInterval(
            function () {

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

            },
            1000
        );
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
        seconds
            .toString()
            .padStart(2, "0");


    timeDisplay.textContent =
        `${minutes}:${formattedSeconds}`;


    const timer =
        document.getElementById("timer");


    if (
        timeLeft <= 30 &&
        timeLeft > 0
    ) {

        timer.classList.add(
            "warning"
        );

    } else {

        timer.classList.remove(
            "warning"
        );
    }
}


/* =====================================================
   HIDDEN OBJECT CLICK
===================================================== */

hotspots.forEach(
    function (hotspot) {

        hotspot.addEventListener(
            "click",
            function (event) {

                if (!gameRunning) {
                    return;
                }


                const objectName =
                    hotspot.dataset.object;


                if (
                    hotspot.classList.contains(
                        "found"
                    )
                ) {

                    return;
                }


                event.preventDefault();


                /* Mark hotspot */

                hotspot.classList.add(
                    "found"
                );

                hotspot.classList.remove(
    "hint"
);


                playFoundSound();


                /* Find matching list item */

                const card =
                    document.querySelector(
                        `.object[data-object="${objectName}"]`
                    );


                if (card) {

                    card.classList.add(
                        "found"
                    );
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

                if (
                    foundObjects >=
                    TOTAL_OBJECTS
                ) {

                    winGame();
                }

            }
        );

    }
);


/* =====================================================
   HINT SYSTEM
   30 SECOND COOLDOWN
===================================================== */

function startHintCooldown() {

    hintAvailable = false;

    hintButton.disabled = true;

    hintButton.textContent =
        "Hint available in 30s";


    let secondsLeft = 30;


    const cooldown =
        setInterval(
            function () {

                secondsLeft--;


                if (secondsLeft > 0) {

                    hintButton.textContent =
                        `Hint available in ${secondsLeft}s`;
                }


                if (secondsLeft <= 0) {

                    clearInterval(
                        cooldown
                    );

                    unlockHint();
                }

            },
            1000
        );


    hintUnlockTimer =
        cooldown;
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

hintButton.addEventListener(
    "click",
    function () {

        if (!gameRunning) {
            return;
        }


        if (!hintAvailable) {
            return;
        }


        const remaining =
            Array.from(hotspots)
                .filter(
                    function (hotspot) {

                        return !hotspot.classList.contains(
                            "found"
                        );

                    }
                );


        if (remaining.length === 0) {

            hintText.textContent =
                "You found everything!";

            return;
        }


        playHintSound();


        /* Pick random object */

        const randomIndex =
            Math.floor(
                Math.random() *
                remaining.length
            );


        const chosen =
            remaining[randomIndex];


        const objectName =
            chosen.dataset.object;


        /* Show clue */

        hintText.textContent =
            hints[objectName];


        /* Highlight object */

        chosen.classList.add(
            "hint"
        );


        setTimeout(
            function () {

                chosen.classList.remove(
                    "hint"
                );

            },
            3000
        );


        /* Start cooldown */

        startHintCooldown();

    }
);


/* =====================================================
   RESTART BUTTONS
===================================================== */

restartButton.addEventListener(
    "click",
    function() {

        window.location.href = "index.html";

    }
);


playAgainButton.addEventListener(
    "click",
    function() {

        window.location.href = "index.html";

    }
);




/* =====================================================
   RESTART GAME
===================================================== */

function restartGame() {

    clearInterval(
        timerInterval
    );


    clearInterval(
        hintUnlockTimer
    );


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

    hintButton.textContent =
        "Hint available in 30s";


    /* Reset win screen */

    winScreen.classList.remove(
        "show"
    );


    /* Reset hotspots */

    hotspots.forEach(
        function (hotspot) {

            hotspot.classList.remove(
                "found"
            );

            hotspot.classList.remove(
                "hint"
            );

        }
    );


    /* Reset object list */

    objectCards.forEach(
        function (card) {

            card.classList.remove(
                "found"
            );

        }
    );


    /* Reset timer */

    updateTimer();

    startTimer();


    /* New 30-second hint countdown */

    let restartHintSeconds = 30;


    hintButton.textContent =
        `Hint available in ${restartHintSeconds}s`;


    hintUnlockTimer =
        setInterval(
            function () {

                restartHintSeconds--;


                if (
                    restartHintSeconds > 0
                ) {

                    hintButton.textContent =
                        `Hint available in ${restartHintSeconds}s`;
                }


                if (
                    restartHintSeconds <= 0
                ) {

                    clearInterval(
                        hintUnlockTimer
                    );

                    unlockHint();

                }

            },
            1000
        );

}


/* =====================================================
   WIN GAME
===================================================== */

function winGame() {

    gameRunning = false;


    clearInterval(
        timerInterval
    );


    clearInterval(
        hintUnlockTimer
    );


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


    winScreen.classList.add(
        "show"
    );

}


/* =====================================================
   GAME OVER
===================================================== */

function gameOver() {

    gameRunning = false;


    clearInterval(
        timerInterval
    );


    clearInterval(
        hintUnlockTimer
    );


    hintText.textContent =
        "The old kitchen is still hiding things...";


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