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
- **Product page:** «الأمام / الخلف» over the photo (a photo's alt text can name its side; otherwise the first two photos
  are front then back, or back then front for the back-print tees in `BACK_FIRST`), VOL.xx, name, «voice» and tagline
  read from the description, chip, colour swatch, «منتجات قد تعجبك» filled from the tee's category when Salla's related
  list is empty (without the tee itself), the empty reviews box hidden until there are reviews, sizes as tiles
  over Salla's own dropdown, «أضف صوتك للسلة», the reassurance line, fold-outs (about / sizes / delivery), share.
- **VOLUME 01 (any product list):** the name as a poster title in the store's title style (orange, ink shadow, blue
  swoosh), one line under it, the sort as a pill, «عرض المزيد» as a paper pill. The header menu is the store menu
  «قائمة رائد UNMUTED» (VOLUME 01 only), picked in this copy's header settings.
- **Product cards (everywhere):** the tee's voice under its name, read from its description («صوت …»).
- **Info pages (الشحن والتوصيل، الاستبدال والاسترجاع، الخصوصية):** the Twilight theme's policies look, built from the
  text written in Salla: big title, the opening line as the lead, one bold card per h2 (orange shipping, blue exchange,
  dark privacy, each with its sticker and icon), a list whose points start in bold as fact tiles, h3 + list pairs as
  yes / no lists, «جاهز تختار صوتك؟» with a button to VOLUME 01.
- **Bag:** «سلتك», size as words, «احذف», the summary card in ink with the orange button, «سلتك ساكتة.» when empty.
- **Home:** the Twilight theme's sections, rendered with their default settings by `build_sections.py` (hero poster,
  rail, tracklist, promises, FAQ; the rest of the Twilight sections, and the hero's top line with its squiggle, are left
  out of this copy) with their animations. The tees link to
  the real products by name. Raed's own home sections stay underneath as the fallback.

## Editing the content (no code)

The home sections and the cards take their words, photos and tees from the store, so they are edited in Salla:

| What | Where in Salla |
|---|---|
| Hero photo, «البس صوتك.», the line under it | Theme editor → home → «صور متحركة (محسنة)» → first photo |
| «اختر صوتك» title and which tees hang on the rail (and the tracklist) | Theme editor → home → «منتجات ثابتة» (its category or picked products) |
| The three promises (icon, title, line) | Theme editor → home → «مميزات المتجر» |
| The questions | Salla → الصفحات التعريفية → «الأسئلة الشائعة» (each question as Heading 3, the answer under it) |
| A tee's voice and VOL number (cards, tracklist, product page) | The product's description: «صوت …» and «الصوت رقم NN» |

Tees with a cut-out photo in `cdn/` (the 17 of VOLUME 01) keep it on the rail and tracklist, whatever their product
photos become. A new tee hangs by the product photo whose ALT says «شماعة» (Salla → product → photo → ALT; «شماعة خلف»
for its back, shown on hover); that photo is left out of the product page's gallery. Without one it uses its main photo.
Best: a PNG with no background, the hanger's hook at the top middle. If a source doesn't answer within 2.5s, that
section shows what it was built with.

## Previewing the draft

The draft opens from the theme list («…» → «معاينة») at `salla.sa/unmuted?preview=…`. Salla writes the menu and product
links with the store's domain, and unmutedsa.com always shows the **published** theme, so while previewing the script
keeps those clicks on the preview. Once this copy is published, unmutedsa.com itself shows the new design.

## Updating

1. Change the Twilight sections or styles in `../salla-theme-unmuted`, then `python3 -I build_sections.py`.
2. Commit and push (GitHub Desktop), then set `CDN_REF` in `unmuted-raed.js` to the new commit.
3. `python3 -I build.py`, then paste `dist/unmuted-raed.css` and `unmuted-raed.js` into the theme editor and save.
