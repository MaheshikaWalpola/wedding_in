# Maheshika & Moksha — Indian Wedding Website

Static site (plain HTML/CSS/JS, no framework) with a Google Apps Script +
Google Sheets backend for RSVPs, seat lookups and personalised invitation links.

**Tirupati, Andhra Pradesh · 10–13 December 2026**

| Date | Event |
|---|---|
| Thursday 10 December | Mehendi and Haldi |
| Friday 11 December | Wedding ceremony |
| Sunday 13 December | Sangeet and reception |

Seeded from the Sri Lankan site on 20 August 2026 and retargeted. It is a
**separate project with its own repository** — not a clone of the Sri Lankan
one — so a change to one wedding can never redeploy the other.

## It runs right now in demo mode

`DEMO_MODE` is `true` in [js/config.js](js/config.js), so every page works with
six sample guests and no backend:

```bash
python3 -m http.server 8788
# open http://localhost:8788
```

Try the seat finder with `Arjun Reddy` or `Priya`, or open a personalised
invitation at `http://localhost:8788/index.html?g=arjun01`.

## Before this goes live

Everything still to be decided is marked `<!-- EDIT: ... -->` in the source.
Search for `EDIT:` to find all of them. The ones that matter most:

1. **The venue.** `location.html` says "Venue to be confirmed" and the map
   points at Tirupati generally. Change the `q=` parameter in the map iframe
   once it is booked, and the venue lines in `index.html`.
2. **Times.** Every time on `info.html` is a placeholder, including the
   muhurtham. The countdown in `js/main.js` is set to 10:00 IST on 11 December
   — correct the hour.
3. **The RSVP deadline**, currently a placeholder in `rsvp.html` and `faq.html`.
4. **The backend.** `js/config.js` has an empty `SCRIPT_URL`. Deploy the Apps
   Script against the *Indian* Google Sheet, paste the URL in, and set
   `DEMO_MODE` to `false`.
5. **Hotels** in `location.html` are three empty placeholders.

## The one thing that will break both weddings if you skip it

`apps-script/Code.gs` has already been changed for you:

```js
var PHOTOS_FOLDER_NAME = 'Indian Wedding Guest Photos';
```

The script finds its Drive folder **by name**, searching your whole Drive. If
this ever goes back to `Wedding Guest Photos`, both weddings' guest uploads
land in the same folder and each gallery shows the other's pictures.

## Deploying

Push to `github.com/MaheshikaWalpola/wedding_in`, then connect it as its own
Cloudflare Pages project — framework preset **None**, no build command, output
directory `/`.

Changing `apps-script/Code.gs` is not enough to update the live backend. You
must redeploy: **Deploy → Manage deployments → Edit → Version: New version →
Deploy.**
