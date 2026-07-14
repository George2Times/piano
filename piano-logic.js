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
    //
    // The A/L shortcuts are only included for the 3-octave layout, which is
    // the only view that renders a B3 and a C5 key. In the 1-octave view they
    // are left out on purpose: including them there made a/l play a note with
    // no on-screen key to show it had happened.
    function buildKeyMap(octaves) {
        var map = {};
        NOTE_LAYOUT.forEach(function (entry) {
            map[entry.key.toLowerCase()] = entry.note + '4';
        });
        if (octaves === 3) {
            Object.keys(EXTRA_KEY_MAP).forEach(function (key) {
                map[key] = EXTRA_KEY_MAP[key];
            });
        }
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

    // Spoken form of a note id, for the accessible name of a key.
    // "C#4" -> "C sharp 4"; a screen reader reads the raw id as "C pound 4"
    // or just "C4" with the sharp silently dropped, which makes the black
    // keys indistinguishable from the white ones.
    function getNoteLabel(noteId) {
        var octave = noteId.slice(-1);
        var name = noteId.slice(0, -1);
        var isSharp = name.indexOf('#') !== -1;
        return name.charAt(0) + (isSharp ? ' sharp ' : ' ') + octave;
    }

    return {
        NOTE_LAYOUT: NOTE_LAYOUT,
        EXTRA_KEY_MAP: EXTRA_KEY_MAP,
        buildKeyMap: buildKeyMap,
        getStartOctave: getStartOctave,
        getNoteId: getNoteId,
        getNoteLabel: getNoteLabel
    };
});
