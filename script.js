let timerInterval;
let timeRemaining = 0;

// If running in Electron with nodeIntegration enabled, get ipcRenderer
let ipcRenderer;
try {
    const electron = require('electron');
    ipcRenderer = electron.ipcRenderer;
} catch (e) {
    // not running in Electron or nodeIntegration disabled
    ipcRenderer = null;
}

// Show selection screen
function showSelection() {
    document.getElementById('homeScreen').classList.remove('active');
    document.getElementById('selectionScreen').classList.add('active');
}

// Start the timer
function startTimer(seconds) {
    timeRemaining = seconds;
    
    // Hide selection, show timer
    document.getElementById('selectionScreen').classList.remove('active');
    document.getElementById('timerScreen').classList.add('active');
    
    // Update display immediately
    updateTimerDisplay();
    
    // Start countdown
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        // When timer reaches 0, show complete screen
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            showComplete();
        }
    }, 1000);
}

// Update the timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById('timerDisplay').textContent = display;
}

// Show complete screen
function showComplete() {
    document.getElementById('timerScreen').classList.remove('active');
    document.getElementById('completeScreen').classList.add('active');
}

// Snooze - add 1 more minute
function snooze() {
    document.getElementById('completeScreen').classList.remove('active');
    document.getElementById('timerScreen').classList.add('active');
    startTimer(60);
}

// Reset to home screen
function reset() {
    clearInterval(timerInterval);
    document.getElementById('completeScreen').classList.remove('active');
    document.getElementById('homeScreen').classList.add('active');
}
// Typing effect function
function typeText(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Update showSelection function to include typing
// Typing effect function - now returns a promise so we can wait for it
function typeText(element, text, speed = 100) {
    return new Promise((resolve) => {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                resolve(); // Done typing!
            }
        }
        
        type();
    });
}

// Update showSelection to wait between typing
async function showSelection() {
    document.getElementById('homeScreen').classList.remove('active');
    document.getElementById('selectionScreen').classList.add('active');
    
    const title = document.querySelector('#selectionScreen h2');
    
    // Type dots first
    await typeText(title, '...', 300); // Wait for this to finish
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 500)); // 0.5 second pause
    
    // Then type the actual text
    await typeText(title, 'what are you making today?', 50);
}

// Close window (renderer) - sends IPC to main process if available
function closeWindow() {
    if (ipcRenderer) {
        ipcRenderer.send('close-window');
    } else {
        // fallback for browser: try to close window/tab
        window.close();
    }
}