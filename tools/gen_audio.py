"""Synthesize background audio for each invitation scene into audio/*.m4a (macOS: needs afconvert).

Run from the project root: python3 tools/gen_audio.py
"""
import subprocess
import tempfile
import wave
from pathlib import Path

import numpy as np

SR = 44100
rng = np.random.default_rng(5)


def freq(midi):
    """Convert a MIDI note number to Hz."""
    return 440.0 * 2 ** ((midi - 69) / 12)


def silence(sec):
    """Return a silent buffer of the given length."""
    return np.zeros(int(SR * sec))


def music_box(midi, dur=1.2, amp=0.3):
    """Bright decaying music-box tone."""
    t = np.arange(int(SR * dur)) / SR
    f = freq(midi)
    tone = np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * 2 * f * t) + 0.15 * np.sin(2 * np.pi * 4.2 * f * t)
    return amp * tone * np.exp(-t * 4)


def pluck(midi, dur=0.5, amp=0.35):
    """Karplus-Strong plucked string (ukulele-like)."""
    n = int(SR * dur)
    period = int(SR / freq(midi))
    buf = rng.uniform(-1, 1, period)
    out = np.empty(n)
    for i in range(n):
        out[i] = buf[i % period]
        buf[i % period] = 0.497 * (buf[i % period] + buf[(i + 1) % period])
    return amp * out


def pad(midis, dur, amp=0.06):
    """Soft sustained chord with slow attack and release."""
    t = np.arange(int(SR * dur)) / SR
    tone = sum(np.sin(2 * np.pi * freq(m) * t) for m in midis)
    env = np.minimum(1, t / 0.8) * np.minimum(1, (dur - t) / 0.8)
    return amp * tone * env


def drum(pitch=90, dur=0.5, amp=0.6):
    """Dhak-style drum hit: pitch-dropping sine plus slap noise."""
    t = np.arange(int(SR * dur)) / SR
    f = pitch * (1 + 1.5 * np.exp(-t * 30))
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)
    slap = rng.uniform(-1, 1, len(t)) * np.exp(-t * 60) * 0.4
    return amp * (body + slap)


def bell(midi, dur=2.5, amp=0.2):
    """Temple-bell tone with inharmonic partials."""
    t = np.arange(int(SR * dur)) / SR
    f = freq(midi)
    parts = [(1, 1), (2.76, 0.5), (5.4, 0.25), (8.9, 0.12)]
    tone = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * (1.5 + r)) for r, a in parts)
    return amp * tone


def whoosh(dur, amp=0.35):
    """Airplane wind swell: low-passed noise rising then falling."""
    n = int(SR * dur)
    noise = rng.uniform(-1, 1, n)
    k = 60
    smooth = np.convolve(noise, np.ones(k) / k, mode="same")
    t = np.linspace(0, 1, n)
    return amp * smooth * np.sin(np.pi * t) ** 1.5 * 4


def sparkle(dur, count, amp=0.12):
    """Random high chimes for a magical shimmer."""
    out = silence(dur)
    for _ in range(count):
        start = rng.uniform(0, dur - 0.6)
        add(out, music_box(int(rng.integers(84, 100)), 0.6, amp), start)
    return out


def add(track, clip, at):
    """Mix clip into track starting at `at` seconds (in place)."""
    i = int(SR * at)
    end = min(len(track), i + len(clip))
    track[i:end] += clip[: end - i]


def melody(track, notes, beat, voice, start=0.0, **kw):
    """Place (midi, beats) notes sequentially; midi None is a rest."""
    t = start
    for midi, beats in notes:
        if midi is not None:
            add(track, voice(midi, **kw), t)
        t += beats * beat
    return t


def finish(track, fade=0.6):
    """Fade edges and normalize to a gentle background level."""
    n = int(SR * fade)
    track[:n] *= np.linspace(0, 1, n)
    track[-n:] *= np.linspace(1, 0, n)
    return track / np.max(np.abs(track)) * 0.6


def scene1():
    """Intro: gentle music-box lullaby over a soft pad (16s)."""
    tr = silence(16)
    add(tr, sparkle(3, 8), 0)
    tune = [(72, 1), (76, 1), (79, 1), (76, 1), (77, 1), (81, 1), (79, 2),
            (76, 1), (79, 1), (84, 1), (83, 1), (81, 1), (79, 1), (77, 1), (76, 1),
            (74, 1), (77, 1), (81, 1), (79, 1), (76, 1), (74, 1), (72, 2)]
    melody(tr, tune, 0.5, music_box, start=1.5)
    for i, chord in enumerate([[60, 64, 67], [65, 69, 72], [60, 64, 67], [67, 71, 74]]):
        add(tr, pad(chord, 4.2), i * 4)
    return finish(tr)


def scene2():
    """Wish: rising chime arpeggio into a shimmer (4s)."""
    tr = silence(4)
    arp = [(72, 1), (76, 1), (79, 1), (84, 1), (88, 1), (91, 1), (96, 3)]
    melody(tr, arp, 0.18, music_box, amp=0.3)
    add(tr, sparkle(3, 14, 0.1), 1.0)
    add(tr, pad([72, 76, 79, 84], 3.5, 0.05), 0.3)
    return finish(tr, 0.3)


def scene3():
    """Packing: bouncy ukulele tune with light ticks (12s)."""
    tr = silence(12)
    beat = 0.25
    bar = [(67, 1), (None, 1), (72, 1), (74, 1), (76, 2), (74, 1), (72, 1),
           (69, 1), (None, 1), (72, 1), (74, 1), (72, 2), (None, 2)]
    t = 0.2
    for _ in range(3):
        t = melody(tr, bar, beat, pluck, start=t)
    for i in range(int(12 / (beat * 2))):
        add(tr, drum(400, 0.08, 0.15), 0.2 + i * beat * 2)
    for i, root in enumerate([48, 53, 48, 55, 48, 53]):
        add(tr, pluck(root, 1.9, 0.25), 0.2 + i * 2)
    return finish(tr)


def scene4():
    """Flight to Bengal: wind swell with a happy travelling tune (12s)."""
    tr = silence(12)
    add(tr, whoosh(12), 0)
    tune = [(76, 1), (79, 1), (84, 2), (83, 1), (79, 1), (81, 2),
            (79, 1), (76, 1), (77, 1), (79, 1), (76, 4)]
    melody(tr, tune, 0.4, music_box, start=1.0, amp=0.25)
    melody(tr, tune, 0.4, music_box, start=7.0, amp=0.25)
    for i, chord in enumerate([[60, 64, 67], [65, 69, 72], [67, 71, 74]]):
        add(tr, pad(chord, 4.2, 0.05), i * 4)
    add(tr, sparkle(2, 6), 10)
    return finish(tr)


def scene6():
    """Finale: dhak drums, temple bell and Happy Birthday (public domain) (14s)."""
    tr = silence(14)
    beat = 0.45
    for i in range(int(14 / beat)):
        t = i * beat
        add(tr, drum(85 if i % 2 == 0 else 120, 0.4, 0.45), t)
        if i % 4 == 3:
            add(tr, drum(120, 0.3, 0.3), t + beat / 2)
    add(tr, bell(81), 0)
    add(tr, bell(81), 7)
    hb = [(67, 0.75), (67, 0.25), (69, 1), (67, 1), (72, 1), (71, 2),
          (67, 0.75), (67, 0.25), (69, 1), (67, 1), (74, 1), (72, 2),
          (67, 0.75), (67, 0.25), (79, 1), (76, 1), (72, 1), (71, 1), (69, 2),
          (77, 0.75), (77, 0.25), (76, 1), (72, 1), (74, 1), (72, 3)]
    melody(tr, [(m + 12, b) for m, b in hb], beat, music_box, start=0.9, amp=0.35)
    add(tr, sparkle(2, 10), 12)
    return finish(tr)


def write_wav(path, data):
    """Write mono 16-bit WAV."""
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((data * 32767).astype(np.int16).tobytes())


if __name__ == "__main__":
    out_dir = Path(__file__).resolve().parent.parent / "audio"
    with tempfile.TemporaryDirectory() as tmp:
        for name, fn in [("scene1", scene1), ("scene2", scene2), ("scene3", scene3), ("scene4", scene4), ("scene6", scene6)]:
            wav = f"{tmp}/{name}.wav"
            write_wav(wav, fn())
            subprocess.run(["afconvert", "-f", "m4af", "-d", "aac", "-b", "128000", wav, str(out_dir / f"{name}.m4a")], check=True)
            print("wrote", name)
