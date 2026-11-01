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
  list is empty (every tee when that album has fewer than five; never the tee itself), the empty reviews box hidden
  until there are reviews, sizes as tiles over Salla's own dropdown, «أضف صوتك للسلة», fold-outs (about / sizes), share.
- **Product lists (any category):** the name as a poster title in the store's title style (orange, ink shadow, blue
  swoosh), the sort as a pill, «عرض المزيد» as a paper pill; VOLUME 01 and «اختر صوتك» also get the line under it.
  The header menu is the store menu «قائمة رائد UNMUTED», picked in this copy's header settings: «اختر صوتك» (the
  category that holds every tee) and «الألبومات» with the ten album categories under it (ثقافة، عبارات، كاركترز،
  لايف ستايل، قيمنق، أنمي ومانجا، رياضة، موسيقى وترفيه، فن وإبداع، رموز وأيقونات). A new tee goes in «اختر صوتك»
  and its album.
- **Product cards (everywhere):** the tee's voice under its name, read from its description («صوت …»); with a mouse,
  hovering turns the tee round to its other photo (the first after the main one that isn't a «شماعة» photo). The home
  tracklist thumbnails turn to the tee's back the same way.
- **Info pages (الشحن والتوصيل، الاستبدال والاسترجاع، الخصوصية):** the Twilight theme's policies look, built from the
  text written in Salla: big title, the opening line as the lead, one bold card per h2 (orange shipping, blue exchange,
  dark privacy, each with its sticker and icon), a list whose points start in bold as fact tiles, h3 + list pairs as
  yes / no lists, «جاهز تختار صوتك؟» with a button to «اختر صوتك».
- **Bag:** «سلتك», size as words, «احذف», the summary card in ink with the orange button, «سلتك ساكتة.» when empty.
- **Home:** the Twilight theme's sections, rendered with their default settings by `build_sections.py` (hero poster,
  rail, tracklist, promises, FAQ; the rest of the Twilight sections, and the hero's top line with its squiggle, are left
  out of this copy). In this copy the hero is a still photo (no logo zoom, no floating icons) whose words come up as
  the page scrolls, the rail hangs the first ten tees with no count line and is for looking only (no quick buy, no
  links; «كل الأصوات» leads to «اختر صوتك»), on phones its tees hang at ~40% size so three or four show side by side,
  and the tracklist is a grid of big photos (three a row on computers, two on phones).
- **Everywhere:** the browser's back button returns to the place on the page (the content added after load would
  otherwise send it to the top). The tees link to
  the real products by name. Raed's own home sections stay underneath as the fallback.

## Editing the content (no code)

The home sections and the cards take their words, photos and tees from the store, so they are edited in Salla:

| What | Where in Salla |
|---|---|
| Hero photo, «البس صوتك.», the line under it | Theme editor → home → «صور متحركة (محسنة)» → first photo |
| «اختر صوتك» title and which tees hang on the rail (the first ten) and show in the tracklist | Theme editor → home → «منتجات ثابتة» (its category or picked products) |
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
