# נראית – PWA

A Hebrew (RTL) progressive web app for postpartum depression: PHQ-9 self-assessment, information, stigma, treatment, tips and Israeli support resources.

## Run locally
Requires Node.js (16+). No install step, no dependencies.

    npm start        # or: node server.js

Then open http://localhost:5173. On Windows you can also double-click `start.bat`.

To test "install" and offline mode, open it in Chrome/Edge: an "התקנה" button appears on the home screen (or use the install icon in the address bar). After the first load the app works offline.

To try it on your phone, run the server on your computer and open `http://<your-computer-IP>:5173` on the same Wi-Fi. Note that install + offline on a phone need HTTPS, so deploy to any static host (Netlify, Vercel, GitHub Pages, Firebase Hosting) for the full PWA experience there.

## Structure
- `index.html` – app shell
- `app.js` – all screens, hash routing (`#/help`, `#/assessment`, …), state
- `styles.css` – design tokens and components
- `sw.js` – service worker (precached shell, offline, cached fonts)
- `manifest.webmanifest`, `icons/` – install metadata
- `images/` – illustrations and logo

## Before launch
- Video list in `app.js` (`VIDEOS`) has placeholder titles; add a `src` for each video.
- Use the official Hebrew PHQ-9 wording from phqscreeners.com.
- Have a clinician review the medical content; verify the phone numbers on the Help screen.
- Bump `VERSION` in `sw.js` whenever you deploy changes, so users get the update.
