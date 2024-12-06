document.addEventListener('DOMContentLoaded', () => {
    renderPiano(1);

    // Add event listeners for key press and release
    document.addEventListener('keydown', (event) => handleKeyDown(event));
    document.addEventListener('keyup', (event) => handleKeyUp(event));
});

const activeSynths = {}; // Object to keep track of active notes

// Initialize a Tone.Sampler with piano note samples
const piano = new Tone.Sampler({
    urls: {
        "B2": "B2.mp3",
        "C3": "C3.mp3",
        "C#3": "Cs3.mp3",
        "D3": "D3.mp3",
        "D#3": "Ds3.mp3",
        "E3": "E3.mp3",
        "F3": "F3.mp3",
        "F#3": "Fs3.mp3",
        "G3": "G3.mp3",
        "G#3": "Gs3.mp3",
        "A3": "A3.mp3",
        "A#3": "As3.mp3",
        "B3": "B3.mp3",
        "C4": "C4.mp3",
        "C#4": "Cs4.mp3",
        "D4": "D4.mp3",
        "D#4": "Ds4.mp3",
        "E4": "E4.mp3",
        "F4": "F4.mp3",
        "F#4": "Fs4.mp3",
        "G4": "G4.mp3",
        "G#4": "Gs4.mp3",
        "A4": "A4.mp3",
        "A#4": "As4.mp3",
        "B4": "B4.mp3",
        "C5": "C5.mp3",
        "C#5": "Cs5.mp3",
        "D5": "D5.mp3",
        "D#5": "Ds5.mp3",
        "E5": "E5.mp3",
        "F5": "F5.mp3",
        "F#5": "Fs5.mp3",
        "G5": "G5.mp3",
        "G#5": "Gs5.mp3",
        "A5": "A5.mp3",
        "A#5": "As5.mp3",
        "B5": "B5.mp3",
        "C6": "C6.mp3",
    },
    release: 1, // Release time of the notes
    baseUrl: "samples/" // Update with your folder path
}).toDestination();

function renderPiano(octaves) {
    const pianoContainer = document.getElementById('piano');
    pianoContainer.innerHTML = ''; // Clear previous piano keys

    const notes = [
        // { note: 'B', key: 'A', black: false }, // New left key
        { note: 'C', key: 'S', black: false },
        { note: 'C#', key: 'E', black: true }, // Updated to be bound to 'E'
        { note: 'D', key: 'D', black: false },
        { note: 'D#', key: 'R', black: true }, // Updated to be bound to 'R'
        { note: 'E', key: 'F', black: false },
        { note: 'F', key: 'G', black: false },
        { note: 'F#', key: 'Y', black: true }, // Updated to be bound to 'Y'
        { note: 'G', key: 'H', black: false },
        { note: 'G#', key: 'U', black: true },
        { note: 'A', key: 'J', black: false },
        { note: 'A#', key: 'I', black: true }, // Updated to be bound to 'I'
        { note: 'B', key: 'K', black: false },
        // { note: 'C', key: 'L', black: false } // New right key
    ];

    for (let i = 0; i < octaves; i++) {
        const octaveNumber = octaves === 1 ? i + 4 : i + 3; // Start from C4 for 1 octave, C3 for 3 octaves
        notes.forEach(({ note, key, black }) => {
            const keyDiv = document.createElement('div');
            keyDiv.classList.add('key');
            keyDiv.classList.add(black ? 'black-key' : 'white-key');
            keyDiv.dataset.note = `${note}${octaveNumber}`;

            // Set key label only for the main octave or if there is only one octave
            if (octaves === 1 || (octaves === 3 && i === 1)) {
                keyDiv.textContent = key;

                // Set different text colors for black and white keys
                keyDiv.style.color = black ? 'white' : 'black';
            } 
            else if (octaves === 3 && i === 0 && note === 'B') {
                keyDiv.textContent = 'A';
                keyDiv.style.color = 'black';
            } 
            else if (octaves === 3 && i === 2 && note === 'C') {
                keyDiv.textContent = 'L';
                keyDiv.style.color = 'black';
            }

            // Add mouse event listeners
            keyDiv.addEventListener('mousedown', () => startNotePlaying(note + octaveNumber, key));
            keyDiv.addEventListener('mouseup', () => stopNotePlaying(note + octaveNumber, key));
            keyDiv.addEventListener('mouseleave', () => stopNotePlaying(note + octaveNumber, key));

            // Add touch event listeners for mobile
            keyDiv.addEventListener('touchstart', (event) => {
                event.preventDefault(); // Prevent touch from triggering mouse events
                startNotePlaying(note + octaveNumber, key);
            });
            keyDiv.addEventListener('touchend', (event) => {
                event.preventDefault(); // Prevent touch from triggering mouse events
                stopNotePlaying(note + octaveNumber, key);
            });
            keyDiv.addEventListener('touchcancel', (event) => {
                event.preventDefault(); // Prevent touch from triggering mouse events
                stopNotePlaying(note + octaveNumber, key);
            });

            pianoContainer.appendChild(keyDiv);
        });
    }
}

function handleKeyDown(event) {
    const keyMap = {
        'a': 'B3', // Bind B3 to 'A'
        's': 'C4',
        'e': 'C#4', // Bind C#4 to 'E'
        'd': 'D4',
        'r': 'D#4', // Bind D#4 to 'R'
        'f': 'E4',
        'g': 'F4',
        'y': 'F#4', // Bind F#4 to 'Y'
        'h': 'G4',
        'u': 'G#4',
        'j': 'A4',
        'i': 'A#4', // Bind A#4 to 'I'
        'k': 'B4',
        'l': 'C5' // Bind C5 to 'L'
    };

    const note = keyMap[event.key.toLowerCase()];
    if (note && !activeSynths[event.key]) {
        startNotePlaying(note, event.key);
    }
}

function handleKeyUp(event) {
    const keyMap = {
        'a': 'B3',
        's': 'C4',
        'e': 'C#4',
        'd': 'D4',
        'r': 'D#4',
        'f': 'E4',
        'g': 'F4',
        'y': 'F#4',
        'h': 'G4',
        'u': 'G#4',
        'j': 'A4',
        'i': 'A#4',
        'k': 'B4',
        'l': 'C5'
    };

    const note = keyMap[event.key.toLowerCase()];
    if (note && activeSynths[event.key]) {
        stopNotePlaying(note, event.key);
    }
}

function startNotePlaying(note, key) {
    if (!activeSynths[key]) {
        piano.triggerAttack(note);
        activeSynths[key] = piano;
    }
}

function stopNotePlaying(note, key) {
    if (activeSynths[key]) {
        piano.triggerRelease(note);
        delete activeSynths[key];
    }
}
