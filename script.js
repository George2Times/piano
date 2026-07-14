document.addEventListener('DOMContentLoaded', () => {
    renderPiano(1);

    // Add event listeners for key press and release
    document.addEventListener('keydown', (event) => handleKeyDown(event));
    document.addEventListener('keyup', (event) => handleKeyUp(event));
});

// Tracks the notes currently held down: tracking key -> note id being played.
// The note id is stored (rather than just a truthy flag) so every held note can
// be released without the caller having to hand it back to us.
const activeSynths = {};

let samplesLoaded = false;
let audioStartPromise = null;

// Browsers create the AudioContext "suspended" and only let a user gesture
// resume it, so Tone.js needs an explicit Tone.start() from inside a gesture
// handler. Without one the first notes after page load attack into a suspended
// context and are silently dropped. Every caller below runs from a real gesture
// (mousedown / touchstart / keydown), so this is a valid place to start it.
function startAudioContext() {
    if (!audioStartPromise) {
        audioStartPromise = Tone.start().catch((error) => {
            // Let a later gesture try again rather than wedging the piano.
            audioStartPromise = null;
            throw error;
        });
    }
    return audioStartPromise;
}

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
    baseUrl: "samples/", // Update with your folder path
    onload: () => {
        // The 38 samples are fetched over the network. Until they arrive,
        // triggerAttack has no buffer to play, so the keys stay disabled and
        // say so rather than silently swallowing an early click.
        samplesLoaded = true;
        applyLoadingState();
    }
}).toDestination();

function setStatus(message) {
    const status = document.getElementById('piano-status');
    if (status) {
        status.textContent = message;
    }
}

// Reflects sample-loading state on the piano: while loading, the keys are
// dimmed and marked aria-disabled so both sighted and screen-reader users can
// tell the piano is not playable yet.
function applyLoadingState() {
    const pianoContainer = document.getElementById('piano');
    if (!pianoContainer) {
        return;
    }

    pianoContainer.classList.toggle('is-loading', !samplesLoaded);
    pianoContainer.querySelectorAll('.key').forEach((keyDiv) => {
        keyDiv.setAttribute('aria-disabled', String(!samplesLoaded));
    });

    setStatus(samplesLoaded ? '' : 'Loading piano samples…');
}

// The keyboard-key -> note lookup for the view currently on screen. Rebuilt on
// every render because the A/L shortcuts only exist in the 3-octave view.
let keyMap = PianoLogic.buildKeyMap(1);

function renderPiano(octaves) {
    const pianoContainer = document.getElementById('piano');

    // Switching views throws away the key elements, so anything still held
    // would sustain forever with no key left to release it.
    releaseAllNotes();

    pianoContainer.innerHTML = ''; // Clear previous piano keys
    keyMap = PianoLogic.buildKeyMap(octaves);

    const notes = PianoLogic.NOTE_LAYOUT;

    for (let i = 0; i < octaves; i++) {
        notes.forEach(({ note, key, black }) => {
            const noteId = PianoLogic.getNoteId(note, octaves, i);

            const keyDiv = document.createElement('div');
            keyDiv.classList.add('key');
            keyDiv.classList.add(black ? 'black-key' : 'white-key');
            keyDiv.dataset.note = noteId;

            // Which keyboard shortcut, if any, plays this particular key in
            // this view. It is also what gets printed on the key.
            let shortcut = null;

            // Set key label only for the main octave or if there is only one octave
            if (octaves === 1 || (octaves === 3 && i === 1)) {
                shortcut = key;

                // Set different text colors for black and white keys
                keyDiv.style.color = black ? 'white' : 'black';
            }
            else if (octaves === 3 && i === 0 && note === 'B') {
                shortcut = 'A';
                keyDiv.style.color = 'black';
            }
            else if (octaves === 3 && i === 2 && note === 'C') {
                shortcut = 'L';
                keyDiv.style.color = 'black';
            }

            if (shortcut) {
                keyDiv.textContent = shortcut;
                keyDiv.setAttribute('aria-keyshortcuts', shortcut.toUpperCase());
            }

            // Without these the keys are anonymous, unfocusable <div>s: they
            // never appear in the accessibility tree and cannot be reached by
            // Tab, so keyboard-only and screen-reader users cannot play a note.
            keyDiv.setAttribute('role', 'button');
            keyDiv.tabIndex = 0;
            keyDiv.setAttribute('aria-label', PianoLogic.getNoteLabel(noteId));

            // Play a focused key with Enter/Space, the standard activation keys
            // for role="button". Neither is in the note key map, so this cannot
            // collide with the letter shortcuts handled on `document`.
            keyDiv.addEventListener('keydown', (event) => {
                if (!isActivationKey(event) || hasModifier(event)) {
                    return;
                }
                event.preventDefault(); // Space would otherwise scroll the page
                startNotePlaying(noteId, noteId);
            });
            keyDiv.addEventListener('keyup', (event) => {
                if (!isActivationKey(event)) {
                    return;
                }
                stopNotePlaying(noteId, noteId);
            });

            // Tabbing away mid-note would otherwise leave it sustaining, since
            // the keyup lands on whatever got focus next.
            keyDiv.addEventListener('blur', () => stopNotePlaying(noteId, noteId));

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

    applyLoadingState();
}

function isActivationKey(event) {
    return event.key === 'Enter' || event.key === ' ';
}

function hasModifier(event) {
    return event.ctrlKey || event.metaKey || event.altKey;
}

function handleKeyDown(event) {
    // Ctrl/Cmd/Alt combinations belong to the browser and the OS: Ctrl+S and
    // Ctrl+F would otherwise fire C4 and E4 alongside Save and Find. Shift is
    // deliberately not in this list — it only changes the letter's case, which
    // the lookup below already normalizes away.
    if (hasModifier(event)) {
        return;
    }

    // NOTE: the tracking key must be the lowercased key, matching the keyMap
    // lookup. Shift can be pressed or released mid-chord, so the same physical
    // key can arrive as 's' on keydown and 'S' on keyup; tracking the raw
    // event.key would then leave the note sustaining forever.
    const key = event.key.toLowerCase();
    const note = keyMap[key];
    if (note && !activeSynths[key]) {
        startNotePlaying(note, key);
    }
}

function handleKeyUp(event) {
    // Deliberately no modifier check here: a note started before Ctrl went down
    // still has to be releasable, otherwise pressing Ctrl mid-note sticks it.
    const key = event.key.toLowerCase();
    const note = keyMap[key];
    if (note && activeSynths[key]) {
        stopNotePlaying(note, key);
    }
}

function startNotePlaying(note, key) {
    if (activeSynths[key] || !samplesLoaded) {
        return;
    }

    activeSynths[key] = note;

    if (Tone.context.state === 'running') {
        piano.triggerAttack(note);
        return;
    }

    // First note of the session: the context is still suspended, so the attack
    // has to wait for it to resume. A quick tap can be over before that
    // happens, and dropping the attack in that case would silently swallow the
    // very first note — the exact symptom this is meant to fix. So attack
    // regardless, and if the key is no longer held by then, release it right
    // away: a short note with the usual release tail, like any other quick tap.
    startAudioContext()
        .then(() => {
            piano.triggerAttack(note);
            if (activeSynths[key] !== note) {
                piano.triggerRelease(note);
            }
        })
        .catch(() => {
            delete activeSynths[key];
        });
}

function stopNotePlaying(note, key) {
    if (activeSynths[key]) {
        piano.triggerRelease(note);
        delete activeSynths[key];
    }
}

function releaseAllNotes() {
    Object.keys(activeSynths).forEach((key) => {
        stopNotePlaying(activeSynths[key], key);
    });
}
