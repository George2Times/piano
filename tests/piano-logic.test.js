'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const PianoLogic = require('../piano-logic.js');

test('NOTE_LAYOUT has one entry per semitone, in order, C..B', () => {
    const expectedNotes = [
        'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
    ];
    assert.equal(PianoLogic.NOTE_LAYOUT.length, 12);
    assert.deepEqual(
        PianoLogic.NOTE_LAYOUT.map((entry) => entry.note),
        expectedNotes
    );
});

test('NOTE_LAYOUT flags exactly the sharps as black keys', () => {
    for (const entry of PianoLogic.NOTE_LAYOUT) {
        assert.equal(
            entry.black,
            entry.note.includes('#'),
            `${entry.note} black flag should match whether it is a sharp`
        );
    }
});

test('NOTE_LAYOUT keys are unique, single letters', () => {
    const keys = PianoLogic.NOTE_LAYOUT.map((entry) => entry.key);
    assert.equal(new Set(keys).size, keys.length, 'key letters must be unique');
    for (const key of keys) {
        assert.match(key, /^[A-Za-z]$/);
    }
});

test('buildKeyMap matches the documented keyboard layout', () => {
    // This is a regression lock on the mapping described in README.md:
    // white keys A S D F G H J K L, black keys E R Y U I.
    assert.deepEqual(PianoLogic.buildKeyMap(), {
        a: 'B3',
        s: 'C4',
        e: 'C#4',
        d: 'D4',
        r: 'D#4',
        f: 'E4',
        g: 'F4',
        y: 'F#4',
        h: 'G4',
        u: 'G#4',
        j: 'A4',
        i: 'A#4',
        k: 'B4',
        l: 'C5'
    });
});

test('getStartOctave centers 1-octave mode on C4 and 3-octave mode on C3', () => {
    assert.equal(PianoLogic.getStartOctave(1), 4);
    assert.equal(PianoLogic.getStartOctave(3), 3);
});

test('getNoteId produces C4..B4 for 1-octave mode', () => {
    const ids = PianoLogic.NOTE_LAYOUT.map((entry) => PianoLogic.getNoteId(entry.note, 1, 0));
    assert.deepEqual(ids, [
        'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4'
    ]);
});

test('getNoteId produces unique note ids across all three octaves in 3-octave mode', () => {
    // Regression test for a bug where the same note letter in different
    // octaves (e.g. C3, C4, C5) collapsed to one tracking key, so clicking
    // C3 with the mouse silently blocked C4/C5 from also sounding.
    const ids = [];
    for (let octaveOffset = 0; octaveOffset < 3; octaveOffset++) {
        for (const entry of PianoLogic.NOTE_LAYOUT) {
            ids.push(PianoLogic.getNoteId(entry.note, 3, octaveOffset));
        }
    }
    assert.equal(ids.length, 36);
    assert.equal(new Set(ids).size, 36, 'every note id across the 3 octaves must be unique');
    assert.ok(ids.includes('C3'));
    assert.ok(ids.includes('C4'));
    assert.ok(ids.includes('C5'));
});

test('getNoteId matches the note ids embedded in the Tone.Sampler sample map', () => {
    // script.js's Tone.Sampler is configured with samples from B2 to C6.
    // Every note the 3-octave layout can produce must fall inside that
    // range, otherwise clicking a key would try to play a sample that
    // was never loaded.
    const samplerLow = { note: 'B', octave: 2 };
    const samplerHigh = { note: 'C', octave: 6 };
    for (let octaveOffset = 0; octaveOffset < 3; octaveOffset++) {
        for (const entry of PianoLogic.NOTE_LAYOUT) {
            const id = PianoLogic.getNoteId(entry.note, 3, octaveOffset);
            const octave = Number(id.slice(-1));
            assert.ok(
                octave > samplerLow.octave && octave < samplerHigh.octave,
                `${id} should fall within the sampler's loaded range`
            );
        }
    }
});
