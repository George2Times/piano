/**
 * Pure piano layout/mapping logic, shared between the browser UI (script.js)
 * and the Node test suite (tests/piano-logic.test.js).
 *
 * No DOM or Tone.js dependency here on purpose, so it can run in any
 * JavaScript environment: it is exposed as `window.PianoLogic` in the
 * browser and via `module.exports` under Node/CommonJS.
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.PianoLogic = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // One octave, in left-to-right key order. `key` is both the on-screen
    // label for the middle octave and the computer-keyboard shortcut for
    // that note in the default (4th) octave.
    var NOTE_LAYOUT = [
        { note: 'C', key: 'S', black: false },
        { note: 'C#', key: 'E', black: true },
        { note: 'D', key: 'D', black: false },
        { note: 'D#', key: 'R', black: true },
        { note: 'E', key: 'F', black: false },
        { note: 'F', key: 'G', black: false },
        { note: 'F#', key: 'Y', black: true },
        { note: 'G', key: 'H', black: false },
        { note: 'G#', key: 'U', black: true },
        { note: 'A', key: 'J', black: false },
        { note: 'A#', key: 'I', black: true },
        { note: 'B', key: 'K', black: false }
    ];

    // Extra keyboard shortcuts that only make sense in the 3-octave layout,
    // reaching one note below and one note above the main NOTE_LAYOUT range.
    var EXTRA_KEY_MAP = {
        a: 'B3',
        l: 'C5'
    };

    // Builds the single keyboard-key -> note lookup used by both the
    // keydown and keyup handlers, so the two handlers can never drift
    // out of sync with each other.
    function buildKeyMap() {
        var map = {};
        NOTE_LAYOUT.forEach(function (entry) {
            map[entry.key.toLowerCase()] = entry.note + '4';
        });
        Object.keys(EXTRA_KEY_MAP).forEach(function (key) {
            map[key] = EXTRA_KEY_MAP[key];
        });
        return map;
    }

    // The octave number of the first rendered octave for a given octave count.
    // 1-octave mode is centered on C4; 3-octave mode starts at C3.
    function getStartOctave(octaves) {
        return octaves === 1 ? 4 : 3;
    }

    // Full note id (e.g. "C#3") for `note` at octave offset `octaveOffset`
    // (0-based, i.e. the i-th rendered octave) within a layout of `octaves`
    // total octaves.
    function getNoteId(note, octaves, octaveOffset) {
        return note + (getStartOctave(octaves) + octaveOffset);
    }

    return {
        NOTE_LAYOUT: NOTE_LAYOUT,
        EXTRA_KEY_MAP: EXTRA_KEY_MAP,
        buildKeyMap: buildKeyMap,
        getStartOctave: getStartOctave,
        getNoteId: getNoteId
    };
});
