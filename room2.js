    /* =====================================================
    HIDDEN OBJECTS
    ROOM 02 — THE ABANDONED SITTING ROOM
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


    /* Wake browser audio */

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
    ROOM 02 OBJECT HINTS
    ===================================================== */

    const hints = {

        pineapple:
            "Something tropical has been left among the decorations.",

        parrot:
            "Look somewhere higher up. A colourful visitor is watching quietly.",

        cat:
            "Something with four paws is hiding where the room grows dark.",

        feather:
            "A beautiful feather has been forgotten somewhere in the room.",

        "logo-63":
            "A strange number seems to have found its way into this room.",

        grapes:
            "A bunch of something sweet is hiding near the other decorations.",

        lantern:
            "Something once used to bring light is standing quietly in the room.",

        "n-shape":
            "Look carefully around the room. Something has the shape of a letter.",

        vase:
            "Something silver is holding its place among the old furniture.",

        telephone:
            "An old device waits quietly... perhaps it once rang in this room.",

        elephant:
            "A tiny animal from far away is hiding among the decorations.",

        teapot:
            "Someone once used this to serve a warm drink. Look carefully around the room."

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

    const nextRoomButton =
        document.getElementById("next-room");

    nextRoomButton.addEventListener(
        "click",
        function () {
            window.location.href = "room3.html";
        }
    );


    /* =====================================================
    START GAME
    ===================================================== */

    updateTimer();


    /*
    First hint becomes available
    after the first 30 seconds.
    */

    hintAvailable = false;

    hintButton.disabled = true;

    hintButton.textContent =
        "Hint available in 30s";


    startTimer();


    hintUnlockTimer =
        setTimeout(function () {

            unlockHint();

        }, 30000);


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
                    "hint");


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


            /* Sparkle sound */

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
    RESTART BUTTON
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

                if (restartHintSeconds > 0) {

                    hintButton.textContent =
                        `Hint available in ${restartHintSeconds}s`;

                }

                if (restartHintSeconds <= 0) {

                    clearInterval(hintUnlockTimer);

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

