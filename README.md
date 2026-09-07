# Maheshika & Moksha — Tirupati wedding website

A one-page guest site for the Indian celebrations, plus a photos page where
guests add their own pictures. Plain HTML, CSS and JavaScript, no build step,
hosted on Cloudflare Pages. Every push to `main` goes live within a minute.

**Live:** https://maheshika-moksha-in.pages.dev · **Code:** github.com/MaheshikaWalpola/wedding_in
**Sister site (Sri Lanka):** https://maheshika-moksha.pages.dev — linked from the fixed 🇱🇰 pill.

| Date | Event | Who |
|---|---|---|
| Thu 10 Dec 2026 | Mehendi & Haldi, 10 AM to 6 PM, Tirupati | close family & friends |
| Fri 11 Dec 2026 | Wedding, Subha Muhurtham, T.T.D, Tirumala | close family & friends |
| Sun 13 Dec 2026 | Reception & Dinner from 5 PM, S.R. Convention Hall, Old Tiruchanoor Road | everyone, RSVP by 15 Oct 2026 on WhatsApp |

## Files

```
index.html            the whole site; every section starts with a banner comment
photos.html           the album page: upload panel + the wall of guest photos (upload only, nothing can delete)
css/styles.css        design tokens at the top (colour, type, radius, shadow, motion), then one block per section
js/main.js            PIN gate, nav, text reveals, countdown, language tabs, garlands, parallax, tilt, petals
js/photos.js          upload (shrinks photos in the browser) + album loader + save-to-phone button
js/config.js          PHOTO_UPLOAD_URL: the deployed Apps Script web-app URL
apps-script/Code.gs   the backend that receives uploads and lists the album (Google Apps Script)
assets/*.ics          "Add to calendar" files: mehendi-haldi, wedding-ceremony, wedding (reception)
images/               couple photos and the temple sketch in blue and gold
robots.txt            asks search engines not to index
```

## Run it locally

```bash
python3 -m http.server 8789
```

Open http://localhost:8789. The PIN is **1312**; the device remembers it.

## Things you may want to change

- **Words and names** — everything is in `index.html`. Search for the text you
  see on the page and edit it there.
- **Reception time** — appears in four places: the invitation card and the
  13 Dec card in `index.html`, the countdown target in `js/main.js`, and
  `assets/wedding.ics`. The printed card says 7 PM; the site says 5 PM.
- **RSVP message** — the prefilled WhatsApp text is in the RSVP links in
  `index.html` (hero button, reception panel, quick actions).
- **Telugu text** — transcribed from the printed card. Have someone in the
  family read it once.
- **Palette** — v3 (5 Sep 2026): ivory, royal blue, champagne gold, a touch of
  saffron. Playfair Display + Manrope + Noto Serif Telugu.
- **PIN** — change `PIN_HASH` in `js/main.js` to the SHA-256 of the new code:
  `printf '1234' | shasum -a 256`.

## Deploy

Push to `main`. Cloudflare Pages rebuilds the live site within a minute.
Framework preset *None*, output directory `/`. Tags `v1`, `v2`, `v3` are
earlier designs; `git checkout v3 -- . && git commit` rolls back.

## Guest photos

Uploads are live (since 6 Sep 2026). Photos go to the Drive folder
**Indian Wedding Guest Photos** and every upload is listed in the
**Guest Photos** tab of the sheet *Wedding Planner India*. To hide a photo from
the album, set its **Show** cell to `no`. Guests can only add photos; nothing
on the site can edit or delete them. The save button on each album tile opens
the share sheet on phones (Save Image goes to the camera roll) and downloads a
file on computers.

If the backend ever needs redeploying: open the sheet, **Extensions → Apps
Script**, paste `apps-script/Code.gs`, save, then **Deploy → Manage deployments
→ Edit → Version: New version → Deploy**. Saving alone does not update the live
web app. If the URL changes, put the new one in `js/config.js` and push.
