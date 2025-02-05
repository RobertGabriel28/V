// Constante și variabile globale
const correctFirstWord = ['E', 'S', 'T', 'I'];
const correctSecondWord = ['S', 'U', 'P', 'E', 'R', 'B', 'A'];
let selectedLetters = [];
let hintIndex = 0;
let remainingHints = 3;
let currentWord = 1;
let score = 0;
let timeLeft = 30;
let timer;
let heartRainInterval;

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
});

function initializeGame() {
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('letsGoBtn').addEventListener('click', showInstructions);
    document.getElementById('startGameBtn').addEventListener('click', startMiniGame);
    document.getElementById('submitBtn').addEventListener('click', checkWord);
    document.getElementById('hintBtn').addEventListener('click', giveHint);
    document.getElementById('nextBtn').addEventListener('click', showValentine);
    document.getElementById('yesBtn').addEventListener('click', showYey);
    document.getElementById('noBtn').addEventListener('mouseover', makeNoRun);
}

function startGame() {
    document.getElementById('game-content').style.display = 'none';
    document.getElementById('introMessage').style.display = 'block';
}

function showInstructions() {
    document.getElementById('introMessage').style.display = 'none';
    document.getElementById('gameInstructions').style.display = 'block';
}

function startMiniGame() {
    document.getElementById('gameInstructions').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    shuffleLetters(correctFirstWord);
    startTimer();
}

function startTimer() {
    timeLeft = 30;
    updateTimerDisplay();
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert('Timpul a expirat! Încearcă din nou.');
            resetGame();
        }
    }, 1000);
}

function updateTimerDisplay() {
    document.getElementById('time').textContent = timeLeft;
}

function shuffleLetters(wordArray) {
    const lettersContainer = document.getElementById('letters-container');
    let shuffledLetters = [...wordArray].sort(() => Math.random() - 0.5);
    
    lettersContainer.innerHTML = '';
    shuffledLetters.forEach(letter => {
        const letterElement = document.createElement('div');
        letterElement.classList.add('letter');
        letterElement.textContent = letter;
        letterElement.addEventListener('click', () => selectLetter(letterElement));
        lettersContainer.appendChild(letterElement);
    });
}

function selectLetter(letterElement) {
    const letterText = letterElement.textContent;
    if (!selectedLetters.includes(letterText)) {
        if (validateLetter(letterText)) {
            letterElement.classList.add('correct');
            document.getElementById('errorMessage').style.display = 'none';
            score += 10;
            selectedLetters.push(letterText);
        } else {
            letterElement.classList.add('wrong');
            document.getElementById('errorMessage').style.display = 'block';
            score = Math.max(0, score - 5);
            setTimeout(() => {
                resetLetters();
            }, 500);
        }
        updateScoreDisplay();
    }
}

function resetLetters() {
    selectedLetters = [];
    const letters = document.querySelectorAll('.letter');
    letters.forEach(letter => {
        letter.classList.remove('correct', 'wrong');
    });
    document.getElementById('errorMessage').style.display = 'none';
}

function updateScoreDisplay() {
    document.getElementById('score').textContent = score;
}

function validateLetter(letter) {
    const validLetters = currentWord === 1 ? correctFirstWord : correctSecondWord;
    return validLetters.includes(letter);
}

function checkWord() {
    const correctWord = currentWord === 1 ? correctFirstWord : correctSecondWord;
    const isCorrect = selectedLetters.length === correctWord.length &&
        selectedLetters.every((letter, i) => letter === correctWord[i]);

    if (isCorrect) {
        document.getElementById('result').textContent = "Bravo! Ai completat cuvântul!";
        document.getElementById('result').style.display = 'block';
        score += 50;
        updateScoreDisplay();
        proceedToNextWord();
    } else {
        alert("Cuvântul este greșit! Încearcă din nou.");
        resetLetters();
    }
}

function proceedToNextWord() {
    clearInterval(timer);
    setTimeout(() => {
        if (currentWord === 1) {
            currentWord = 2;
            selectedLetters = [];
            hintIndex = 0;
            remainingHints = 3;
            document.getElementById('result').style.display = 'none';
            document.getElementById('indication').style.display = 'none';
            document.getElementById('question').textContent = "Al doilea cuvânt:";
            updateHintDisplay();
            shuffleLetters(correctSecondWord);
            startTimer();
        } else {
            showFinalMessage();
        }
    }, 2000);
}

function giveHint() {
    if (remainingHints > 0) {
        const correctWord = currentWord === 1 ? correctFirstWord : correctSecondWord;
        document.getElementById('indication').style.display = 'block';
        document.getElementById('indication').textContent = 
            `Indiciu: Primele ${hintIndex + 1} litere sunt: ${correctWord.slice(0, hintIndex + 1).join('')}`;
        hintIndex++;
        remainingHints--;
        updateHintDisplay();
    } else {
        alert("Nu mai ai hint-uri rămase!");
    }
}

function updateHintDisplay() {
    document.getElementById('remainingHints').textContent = remainingHints;
    document.getElementById('hintBtn').disabled = remainingHints === 0;
}

function showFinalMessage() {
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('message-container').style.display = 'block';
}

function showValentine() {
    document.getElementById('message-container').style.display = 'none';
    document.getElementById('valentine-container').style.display = 'block';
    document.getElementById('buttons-container').style.display = 'flex';
}

function showYey() {
    document.getElementById('buttons-container').style.display = 'none';
    document.getElementById('yeyMessage').style.display = 'block';
    startHeartRain();
}

function startHeartRain() {
    // Creează mai multe inimioare la început
    for(let i = 0; i < 10; i++) {
        setTimeout(() => createHeart(), i * 100);
    }
    
    // Continuă cu ploaia de inimioare
    heartRainInterval = setInterval(createHeart, 100);
}

function createHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = getRandomHeart();
    heart.classList.add('heart');
    
    // Poziție random pe axa X
    heart.style.left = Math.random() * 100 + 'vw';
    
    // Viteză random pentru cădere
    const duration = Math.random() * 3 + 2;
    heart.style.animationDuration = duration + 's';
    
    // Mărime random
    const size = Math.random() * 30 + 10;
    heart.style.fontSize = size + 'px';
    
    // Culoare random
    heart.style.color = getRandomColor();
    
    // Rotație random
    heart.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    document.body.appendChild(heart);
    
    // Curățare
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

function getRandomHeart() {
    const hearts = ['❤', '💖', '💗', '💓', '💕', '💝', '💘', '💞'];
    return hearts[Math.floor(Math.random() * hearts.length)];
}

function getRandomColor() {
    const colors = [
        '#ff66b2', // roz
        '#ff3399', // roz închis
        '#ff99cc', // roz deschis
        '#ff0066', // magenta
        '#ff1a75'  // roz aprins
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function makeNoRun() {
    const noBtn = document.getElementById('noBtn');
    const container = document.getElementById('valentine-container');
    const containerRect = container.getBoundingClientRect();
    const buttonRect = noBtn.getBoundingClientRect();

    const newLeft = Math.random() * (containerRect.width - buttonRect.width);
    const newTop = Math.random() * (containerRect.height - buttonRect.height);

    noBtn.style.position = 'absolute';
    noBtn.style.left = `${newLeft}px`;
    noBtn.style.top = `${newTop}px`;
}

function resetGame() {
    resetLetters();
    selectedLetters = [];
    shuffleLetters(currentWord === 1 ? correctFirstWord : correctSecondWord);
    startTimer();
}
