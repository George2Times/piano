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

4. Open the `index.html` file in your preferred browser to start using the virtual piano.

## Usage
- **Playing Notes**: You can use either the mouse to click on the keys or the keyboard for corresponding notes.
- **Keyboard Mapping**:
  - White keys are mapped to: A, S, D, F, G, H, J
  - Black keys are mapped to: W, E, T, Y, U
- **Switching Octaves**: Use the "1 Octave Piano" and "3 Octave Piano" buttons to toggle between different views.

## File Structure
- `index.html`: Main HTML file to load the project.
- `styles.css`: Contains all the styles for the piano layout and appearance.
- `script.js`: Main JavaScript file handling key rendering, key presses, and sound generation.
- `samples/`: Directory containing piano sound samples (`.mp3` format).

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

