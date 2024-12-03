document.addEventListener('DOMContentLoaded', () => {
    renderPiano(1);
});

function renderPiano(octaves) {
    const pianoContainer = document.getElementById('piano');
    pianoContainer.innerHTML = ''; // Clear previous piano keys

    const notes = [
        { note: 'C', key: 'A', black: false },
        { note: 'C#', key: 'W', black: true },
        { note: 'D', key: 'S', black: false },
        { note: 'D#', key: 'E', black: true },
        { note: 'E', key: 'D', black: false },
        { note: 'F', key: 'F', black: false },
        { note: 'F#', key: 'T', black: true },
        { note: 'G', key: 'G', black: false },
        { note: 'G#', key: 'Y', black: true },
        { note: 'A', key: 'H', black: false },
        { note: 'A#', key: 'U', black: true },
        { note: 'B', key: 'J', black: false },
    ];

    for (let i = 0; i < octaves; i++) {
        notes.forEach(({ note, key, black }) => {
          const keyDiv = document.createElement('div');
          keyDiv.classList.add('key');
          keyDiv.classList.add(black ? 'black-key' : 'white-key');
          keyDiv.dataset.note = `${note}${i + 1}`;
      
          // Set key label only for the main octave or if there is only one octave
          if (octaves === 1 || (octaves === 3 && i === 1)) {
            keyDiv.textContent = key;
      
            // Set different text colors for black and white keys
            keyDiv.style.color = black ? 'white' : 'black';
          }
      
          keyDiv.addEventListener('mousedown', () => playNote(note + (i + 1)));
          pianoContainer.appendChild(keyDiv);
        });
    }
}

function playNote(note) {
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease(note, '8n');
}
