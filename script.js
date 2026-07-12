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

    const notes = PianoLogic.NOTE_LAYOUT;

    for (let i = 0; i < octaves; i++) {
        notes.forEach(({ note, key, black }) => {
            const noteId = PianoLogic.getNoteId(note, octaves, i);

            const keyDiv = document.createElement('div');
            keyDiv.classList.add('key');
            keyDiv.classList.add(black ? 'black-key' : 'white-key');
            keyDiv.dataset.note = noteId;

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

            // Add mouse event listeners.
            // NOTE: the tracking key passed to start/stopNotePlaying must be
            // the full note id (e.g. "C3"), not the bare letter label (e.g.
            // "S"). The letter label is shared by every octave of the same
            // note, so using it as the activeSynths key previously made
            // pressing e.g. C3 block C4 and C5 from playing at the same time.
            keyDiv.addEventListener('mousedown', () => startNotePlaying(noteId, noteId));
            keyDiv.addEventListener('mouseup', () => stopNotePlaying(noteId, noteId));
            keyDiv.addEventListener('mouseleave', () => stopNotePlaying(noteId, noteId));

            // Add touch event listeners for mobile
            keyDiv.addEventListener('touchstart', (event) => {
                event.preventDefault(); // Prevent touch from triggering mouse events
                startNotePlaying(noteId, noteId);
            });
            keyDiv.addEventListener('touchend', (event) => {
                event.preventDefault(); // Prevent touch from triggering mouse events
                stopNotePlaying(noteId, noteId);
            });
            keyDiv.addEventListener('touchcancel', (event) => {
                event.preventDefault(); // Prevent touch from triggering mouse events
                stopNotePlaying(noteId, noteId);
            });

            pianoContainer.appendChild(keyDiv);
        });
    }
}

// Single source of truth for the keyboard-key -> note mapping, shared by
// both handlers below so they can't drift out of sync with each other
// (previously each kept its own copy of this object).
const KEY_MAP = PianoLogic.buildKeyMap();

function handleKeyDown(event) {
    const note = KEY_MAP[event.key.toLowerCase()];
    if (note && !activeSynths[event.key]) {
        startNotePlaying(note, event.key);
    }
}

function handleKeyUp(event) {
    const note = KEY_MAP[event.key.toLowerCase()];
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
