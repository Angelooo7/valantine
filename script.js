const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const questionContainer = document.getElementById('questionContainer');
const heartLoader = document.getElementById('heartLoader');
const mainContent = document.getElementById('mainContent');
const mainImage = document.getElementById('mainImage');
const questionText = document.getElementById('questionText');
const loveSong = document.getElementById('loveSong');
const clickMeContainer = document.getElementById('clickMeContainer');
const clickMeBtn = document.getElementById('clickMeBtn');
const letterOverlay = document.getElementById('letterOverlay');
const letterVideo = document.getElementById('letterVideo');
const closeLetter = document.getElementById('closeLetter');

/**
 * Robust logic to move the 'No' button
 * Works by calculating the safe 'playable area' within the container
 */
const moveButton = (e) => {
    // Prevent default to stop "ghost clicks" on mobile/tabs
    if (e && e.type === 'touchstart') e.preventDefault();

    // Ensure the button is ready to move
    noBtn.style.position = 'absolute';

    // Get real-time dimensions of the container and button
    const containerRect = questionContainer.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    // Padding to ensure the button doesn't hug the very edge
    const padding = 10;

    // Calculate maximum available space within the container
    const maxX = containerRect.width - btnRect.width - padding;
    const maxY = containerRect.height - btnRect.height - padding;

    // Generate random coordinates within those bounds
    const newX = Math.max(padding, Math.floor(Math.random() * maxX));
    const newY = Math.max(padding, Math.floor(Math.random() * maxY));

    // Apply the new position
    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;
};

// PC Support
noBtn.addEventListener("mouseover", moveButton);

// Tablet/Mobile Support
noBtn.addEventListener("touchstart", moveButton, { passive: false });

/**
 * Handle 'Yes' click with transition states
 */
yesBtn.addEventListener("click", () => {
    // 1. Enter Loading State
    mainContent.style.opacity = "0"; // Smooth fade out

    // Prime the audio on user gesture (unlocks autoplay)
    if (loveSong) {
        loveSong.load(); // Ensure it starts loading
        loveSong.muted = true;
        loveSong.play().then(() => {
            loveSong.pause();
            loveSong.muted = false;
        }).catch(e => console.log("Priming audio:", e));
    }

    setTimeout(() => {
        mainContent.style.display = "none";
        heartLoader.style.display = "block";
    }, 300);

    // 2. Process Result
    setTimeout(() => {
        heartLoader.style.display = "none";
        mainContent.style.display = "block";
        mainContent.style.opacity = "1";

        // Update UI
        questionText.textContent = "I knew itttt madam jiiii…..love you toooo🥳🥳🥳";
        questionText.style.color = "#ff4081";

        // Update Image
        mainImage.src = "celebration.png";

        // Play edited song (full length)
        if (loveSong) {
            loveSong.play().catch(e => {
                console.error("Music failed to play:", e);
        
                const playHint = document.createElement('div');
                playHint.innerHTML =
                    '<button style="background:none; border:none; cursor:pointer;">🎵 Tap to hear music</button>';
        
                playHint.onclick = () => {
                    loveSong.play();
                    playHint.remove();
                };
        
                mainContent.appendChild(playHint);
            });
        }



        // Remove the button group entirely to prevent repeat clicks
        const btnGroup = document.querySelector('.btn-group');
        if (btnGroup) btnGroup.remove();

        // Show "Click Me" button
        if (clickMeContainer) {
            clickMeContainer.style.display = 'block';
            clickMeContainer.style.opacity = '0';
            setTimeout(() => clickMeContainer.style.opacity = '1', 100);
        }

        // Trigger Confetti (Ensure the library is loaded in your HTML)
        if (typeof confetti === 'function') {
            launchConfetti();
        }
    }, 2300); // 2 seconds + transition time
});

// Final Letter Logic
clickMeBtn.addEventListener("click", () => {
    letterOverlay.classList.add('active');
    letterVideo.play().catch(e => console.log("Video play failed:", e));
});

closeLetter.addEventListener("click", () => {
    letterOverlay.classList.remove('active');
    letterVideo.pause();
});

/**
 * Confetti implementation
 */
const launchConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);

        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
    }, 250);
};
