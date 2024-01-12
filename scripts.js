const grid = document.getElementById("grid");

function setup() {
    const buttonStates = [];

    for(let i=1; i <= 365; i++){
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('not-playing');
        buttonStates.push({ isPlaying: false, source: null });
        button.addEventListener('click', (e) => {
            const currentButton = e.currentTarget;
            toggleSound(buttonStates[i - 1], currentButton);
        });
        grid.appendChild(button);
    }
}

const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", () => {
    window.location.reload();
})

const audioContext = new AudioContext();
const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 1.64, audioContext.sampleRate);
const channelData = buffer.getChannelData(0);

const primaryGainControl = audioContext.createGain();
primaryGainControl.gain.setValueAtTime(0.05, 0);
primaryGainControl.connect(audioContext.destination);

// white noise
for (let i = 0; i < buffer.length; i++){
    channelData[i] = Math.random() * 2 - 1;
}

function toggleSound(buttonState, currentButton){
    if(buttonState.isPlaying){
        buttonState.isPlaying = false;
        buttonState.source.stop();
    } else {
        buttonState.source = audioContext.createBufferSource();
        buttonState.source.buffer = buffer;
        buttonState.source.connect(primaryGainControl);
        buttonState.source.loop = true;
        buttonState.source.start();
        buttonState.isPlaying = true;
    }

    currentButton.classList.toggle('not-playing', !buttonState.isPlaying);
    currentButton.classList.toggle('playing', buttonState.isPlaying);
}

setup();