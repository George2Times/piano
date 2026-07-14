# Virtual Piano Project

## Overview
This project is a simple virtual piano implemented in HTML, CSS, and JavaScript. It uses Tone.js for generating sounds and allows users to play piano notes by clicking on the keys or by pressing corresponding keys on their keyboard.

The virtual piano supports one-octave and three-octave configurations. The keys are visually represented, and users can enjoy a realistic piano experience by using pre-recorded piano samples.

## Features
- **Keyboard Interaction**: Play piano notes using computer keyboard keys (e.g., 'A', 'S', 'D', etc.).
- **Mouse Interaction**: Play notes by clicking on the visual piano keys.
- **Tone.js Integration**: Uses Tone.js to generate sounds.
- **Real Piano Sound**: Pre-recorded `.mp3` samples are used to provide a realistic piano experience.
- **One-Octave and Three-Octave Modes**: Users can switch between one and three octaves by clicking on the provided buttons.

## Technologies Used
- **HTML/CSS**: For structure and styling of the user interface.
- **JavaScript**: To handle the logic, rendering the piano keys, and mapping keyboard interactions.
- **Tone.js**: For sound synthesis and playback of the piano sounds.
- **MP3 Samples**: Pre-recorded `.mp3` samples of piano notes for a realistic sound.

## Installation and Setup
To run the project locally, follow these steps:

1. Clone the repository from GitHub:
   ```sh
   git clone https://github.com/George2Times/piano.git
   ```

2. Navigate to the project directory:
   ```sh
   cd piano
   ```

3. Make sure you have the required samples directory with `.mp3` files for each note.

4. Serve the project over a local HTTP server — for example, with either of:
   ```sh
   python3 -m http.server 8000
   ```
   ```sh
   npx serve .
   ```

5. Open the address the server prints (e.g. <http://localhost:8000>) in your browser.

> **Do not open `index.html` directly from disk.** Over `file://`, browsers block the
> `fetch()` requests that `Tone.Sampler` uses to load the `.mp3` samples, so the page looks
> completely normal but no key ever makes a sound. Any static HTTP server works.

## Usage
- **Playing Notes**: You can use either the mouse to click on the keys or the keyboard for corresponding notes. The first note may take a moment while the browser resumes its audio context, which it only allows on a user gesture.
- **Keyboard Mapping** (matches `script.js`; the middle octave is always active, and A/L reach one note below/above it — they are only bound in the 3-octave view, the only view that draws a B3 and a C5 key):
  - White keys: A (B3), S (C4), D (D4), F (E4), G (F4), H (G4), J (A4), K (B4), L (C5)
  - Black keys: E (C#4), R (D#4), Y (F#4), U (G#4), I (A#4)
  - Shortcuts ignore Ctrl/Cmd/Alt combinations, so Ctrl+S still just saves the page.
- **Switching Octaves**: Use the "1 Octave Piano" and "3 Octave Piano" buttons to toggle between different views.
- **Accessibility**: The keys are exposed as focusable buttons named after the note they play ("C sharp 4"). Tab to a key and press Enter or Space to sound it.
- **On a phone**: the 3-octave piano keeps full-size keys and scrolls sideways rather than shrinking them below a usable touch target.

## File Structure
- `index.html`: Main HTML file to load the project.
- `styles.css`: Contains all the styles for the piano layout and appearance.
- `piano-logic.js`: Pure, dependency-free key-layout and keyboard-mapping logic shared by `script.js` and the test suite.
- `script.js`: Main JavaScript file handling key rendering, key presses, and sound generation.
- `samples/`: Directory containing piano sound samples (`.mp3` format).
- `tests/`: Node test suite (`node:test`) covering `piano-logic.js`.

## Testing
This project has a small Node-based test suite (no external dependencies, just Node's built-in test runner) covering the key-layout and keyboard-mapping logic in `piano-logic.js`:
```sh
npm test
```
Requires Node.js 18+ (built-in `node:test` module).

## .gitignore
The `.gitignore` file has been set up to exclude unnecessary files from version control:
- `.ogg` and `.wav` files in the `samples` directory are ignored to keep the repository light.

## Future Improvements
- **Responsive Design**: Improve responsiveness for different screen sizes and devices.
- **Volume Control**: Add volume control slider for users to adjust the sound level.
- **Sustain Feature**: Add support for sustain pedal effects for richer sound.

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Acknowledgments
- **Tone.js**: For providing an excellent library to handle audio synthesis in JavaScript.
- **Contributors**: Thanks to everyone who has contributed to improving the project.

