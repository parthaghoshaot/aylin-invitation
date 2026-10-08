# Aylin's 5th Birthday Invitation - Project Memory

## Project Overview
This project is a static, mobile-first web application designed as an interactive, story-driven video birthday invitation for Aylin's 5th birthday. It sequences a series of AI-generated vertical (9:16) videos, telling a narrative story from her home in Stuttgart to her birthday celebration in Bengal.

## Current State (as of Oct 2026)
- **Core Logic Complete:** The HTML, CSS, and Vanilla JavaScript are fully functional.
- **Videos Uploaded:** 8 video files are placed in the `videos/` directory and successfully mapped to the code.
- **Hosting Ready:** The project requires no backend or build steps. It is 100% ready to be dragged-and-dropped into GitHub Pages for public hosting.

## Technical Architecture & Features
- **Mobile-First Layout:** The app uses a locked viewport (`100vw`/`100vh`) with hidden scrollbars and a flexbox UI that feels like a native mobile app (similar to Instagram Reels).
- **Seamless Video Stitching:** The JavaScript engine (`script.js`) can accept arrays of videos for a single scene. It seamlessly plays `scene1_1.mp4` followed by `scene1_2.mp4` without revealing the UI transition to the user.
- **Dynamic Pastel Backgrounds:** The background gradient dynamically updates across scenes to match the visual mood (Peach/Pink in Stuttgart -> Airy Blue for Travel -> Gold/Red for Puja -> Pink/Lavender for the Birthday).
- **Auto-Transitions:** Once a scene completes, a 5-second timer automatically progresses the story if the user does not manually click "Next".
- **Narrative Storytelling:** A beautifully styled text box sits below the video, updating with a first-person narrative ("Hi, I am Aylin!...") for each scene.
- **Final HTML Overlay:** The invitation details (Date, Venue, Time) are overlaid natively using HTML/CSS on the final scene to keep the text crisp and avoid AI video text distortion.

## Scene Configuration
The story is mapped in `script.js` into 6 logical blocks using the 8 uploaded videos:
- **Scene 1:** `scene1_1.mp4` & `scene1_2.mp4` (Introduction & Stuttgart)
- **Scene 2:** `scene2.mp4` (The Birthday Wish)
- **Scene 3:** `scene3_1mp4.mp4` & `scene3_2.mp4` (Parents packing)
- **Scene 4:** `scene4.mp4` (Emirates flight)
- **Scene 5:** `scene5.mp4` (Arrival in Bengal)
- **Scene 6:** `scene6.mp4` (Durga Puja & Final Invitation)

## Next Steps to Pick Up Later
1. **Audio Integration:** The code is perfectly set up to play matching audio tracks. You need to generate or download the audio files and place them in the `audio/` folder (named `scene1.mp3`, `scene2.mp3`, etc., matching the references in `script.js`).
2. **Review Invitation Details:** Ensure the date (06.11.2026), time (11:00 am), and venue (Mankundu, Dighi Gardens) in `index.html` are still accurate.
3. **Optional RSVP Addition:** An RSVP button (linking to WhatsApp or a Google Form) can easily be added to the final screen if desired.
4. **Deploy:** Push this folder to a GitHub repository and turn on GitHub Pages to generate your live shareable link.

## How to Run Locally
Run the following command inside this project folder:
```bash
python3 -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.
