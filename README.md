# शुभ विवाह • Aman & Deepa — Royal Wedding Invitation

A royal, animated Indian wedding invitation website.

## ✨ Features
- **Envelope opening animation** — tap the gold **A&D monogram seal** (your `stamp.png`) to open, with a conch (shankh) sound.
- **"Wow" scroll animations** on every slide (GSAP ScrollTrigger): gold shimmer headings, staggered reveals, parallax floral sprays, floating petals.
- **Prominent date plaque + live countdown** (one row) to 11 December 2026, 5:00 PM IST.
- **Soulful flute (bansuri) background music** with an on/off button (top-right); it also starts on the final *Directions* slide.
- **Directions slide** with an embedded Google Map and one-tap *Get Directions*.
- Royal gold + maroon + emerald palette, regal fonts (Cinzel Decorative, Rozha One, Yatra One, Tiro Devanagari Hindi, Great Vibes), and real flower images as feathered corner sprays.

## 🖼️ Images 
- **Couple photo:** `assets/img/main-image.png` (shown in the arched gold frame). Replace this file anytime.
- **Seal monogram:** `assets/img/stamp.png` (the gold A&D medallion on the opening seal).

## 📁 Structure
```
index.html              # all content
css/styles.css          # royal design system + animations
js/script.js            # envelope, audio, countdown, animations, petals
assets/img/             # flower images, main-image.png, stamp.png
assets/audio/           # devotional.mp3 (flute), conch.mp3
```

## ▶️ Preview locally
```bash
python3 -m http.server 8000     # then open http://localhost:8000
```
> Use a server (don't open the file directly) so fonts, audio and the map load.

## 🎵 / 🌸 Credits
- Flower photos & the flute track: Wikimedia Commons (flute converted to MP3 for iPhone/Safari).
- Map: Google Maps embed.
