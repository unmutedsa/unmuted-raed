# UNMUTED on Salla's free theme Raed

The UNMUTED look on a copy of Salla's free theme Raed («UNMUTED على رائد» in the store's theme list), for when the
Twilight theme (`../salla-theme-unmuted`) isn't the one in use. Nothing here touches the published theme.

## What goes where

| File | Where it goes |
|---|---|
| `dist/unmuted-raed.css` | Theme editor → تخصيص متقدم → CSS (built by `build.py`: `unmuted-raed.css` + the logo as a data URI) |
| `unmuted-raed.js` | Theme editor → تخصيص متقدم → JavaScript |
| `cdn/` | Served from this public repo by jsDelivr; `unmuted-raed.js` loads it on the home page (`CDN_REF` = the commit) |

Salla allows custom CSS / JavaScript only once the store has its own domain (unmutedsa.com), and it drops `@import`
from custom CSS, so the script adds the Google Fonts link (Alexandria, Bricolage Grotesque).

## What the custom code does

- **Everywhere:** cream page, ink lines, orange pill buttons, the UNMUTED logo in the header, menu in the middle,
  «السلة» pill, search button, product cards with the tee on the wall colour, «Wear your voice.» in the footer.
- **Product page:** VOL.xx, name, «voice» and tagline read from the description, chip, colour swatch, sizes as tiles
  over Salla's own dropdown, «أضف صوتك للسلة», the reassurance line, fold-outs (about / sizes / delivery), share.
- **Bag:** «سلتك», size as words, «احذف», the summary card in ink with the orange button, «سلتك ساكتة.» when empty.
- **Home:** the Twilight theme's sections, rendered with their default settings by `build_sections.py` (hero poster,
  rail, manifesto, lookbook, tracklist, duo, colours, cats, spot, promises, drop, film, banner, size guide, FAQ,
  order tracking; reviews and vouchers are left out until there are real ones) with their animations. The tees link to
  the real products by name. Raed's own home sections stay underneath as the fallback.

## Updating

1. Change the Twilight sections or styles in `../salla-theme-unmuted`, then `python3 -I build_sections.py`.
2. Commit and push (GitHub Desktop), then set `CDN_REF` in `unmuted-raed.js` to the new commit.
3. `python3 -I build.py`, then paste `dist/unmuted-raed.css` and `unmuted-raed.js` into the theme editor and save.
