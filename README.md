# Maheshika & Moksha — Tirupati wedding website

A single-page, information-only site for the Indian celebrations. Auto-deploys from GitHub on every push to main; v1 and v2 are kept as tags and branches for easy rollback. No RSVP,
no backend: plain HTML, CSS and JavaScript, hosted on Cloudflare Pages.

**Live:** https://maheshika-moksha-in.pages.dev · **Code:** github.com/MaheshikaWalpola/wedding_in
**Sister site (Sri Lanka):** https://maheshika-moksha.pages.dev — linked from the fixed 🇱🇰 button.

| Date | Event | Who |
|---|---|---|
| Thu 10 Dec 2026 | Mehendi & Haldi, Tirupati | close family |
| Fri 11 Dec 2026 | Wedding — Subha Muhurtham 9:00–10:30 AM, T.T.D. Cottage, Shankumitta, Tirumala | close family |
| Sun 13 Dec 2026 | Reception & Dinner from 5 PM, S.R. Convention Hall, Old Tiruchanoor Road, Tirupati | everyone, RSVP by 15 Oct via WhatsApp |

## Files

```
index.html          the whole site — every section is marked with a banner comment
css/styles.css      design system at the top (colour, type, radius, shadow, motion), then one block per section
js/main.js          PIN gate, nav, text reveals, countdown, language tabs, garland, parallax, tilt, petals
assets/wedding.ics  the "Add to calendar" file (reception, 5–11 PM IST)
images/             couple photos + the MM logo set copied from ../Branding
apps-script/Code.gs the guest-photo upload backend (Google Apps Script). Deploy it once, paste the URL in js/config.js
js/config.js        PHOTO_UPLOAD_URL: the deployed Apps Script web-app URL (empty = uploads say "open soon")
js/upload.js        picks photos, shrinks them in the browser, posts them to the script. Upload only, nothing can delete
robots.txt          asks search engines not to index
```

## Run it locally

```bash
python3 -m http.server 8789
```

Open http://localhost:8789. The PIN is **1312**; the device remembers it.

## Things you will want to change

- **Photos** — the two "photo coming soon" arches in *The Couple* and the six in
  *Gallery* are placeholders. Drop images into `images/` and replace each
  `<div class="arch ph …">` with `<div class="arch"><img src="images/…" alt="…"></div>`.
- **Reception time** — appears in four places: `index.html` (invitation card
  and the 13 Dec scene), `js/main.js` (countdown target), `assets/wedding.ics`.
  The printed invitation says 7 PM; the site currently says 5 PM.
- **Telugu text** — the invitation's Telugu tab was transcribed from the
  printed card. Have someone in the family read it once.
- **Palette** — v3 (5 Sep 2026): ivory, royal blue, champagne gold, a touch of saffron. Bodoni Moda + Manrope + Noto Serif Telugu (5 Sep 2026, evening pass).
- **PIN** — change `PIN_HASH` in `js/main.js` to the SHA-256 of the new code:
  `printf '1234' | shasum -a 256`.

## Deploy

Push to `main`. Cloudflare Pages rebuilds the live site within a minute. There
is no build step — framework preset *None*, output directory `/`.

## Switching on guest photo uploads (one-time, about five minutes)

1. Go to https://sheets.new and name the sheet **Wedding Planner — India**.
2. In the sheet: **Extensions → Apps Script**. Delete whatever is in the editor,
   paste the whole of `apps-script/Code.gs`, and save (Ctrl/Cmd + S).
3. **Deploy → New deployment → gear icon → Web app.**
   Execute as: **Me**. Who has access: **Anyone**. Click **Deploy**.
   Google will ask you to authorise the script once (Review permissions → your
   account → Advanced → Go to project → Allow).
4. Copy the **Web app URL** (ends in `/exec`) and send it to Claude, or paste it
   into `js/config.js` as `PHOTO_UPLOAD_URL` and push.

Photos land in a Drive folder called **Indian Wedding Guest Photos** (created
automatically on the first upload) and every upload is listed in the sheet's
**Guest Photos** tab. Guests can only add photos; nothing on the site can list,
edit or delete what is in the folder.
