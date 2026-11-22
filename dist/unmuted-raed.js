/* UNMUTED on Salla's free theme Raed (theme copy \u00abUNMUTED \u0639\u0644\u0649 \u0631\u0627\u0626\u062f\u00bb, editor \u2192 \u062a\u062e\u0635\u064a\u0635 \u0645\u062a\u0642\u062f\u0645 \u2192 JavaScript).
   Adds what unmuted-raed.css can't: size tiles over Salla's dropdown, the VOL / \u00abvoice\u00bb / tagline block read from the
   product description, fold-outs, a search button, the home sections, the VOLUME 01 page title,
   each card's voice and its turn to the other side on hover, 4K copies of product photos, \u00ab\u0645\u0646\u062a\u062c\u0627\u062a \u0642\u062f \u062a\u0639\u062c\u0628\u0643\u00bb from the category, the info pages' cards, \u00abWear your voice.\u00bb in the footer and the store's empty-bag words. Every part checks for Raed's markup first and does nothing without it. */
(function () {
  if (window.__umRaed) return;
  window.__umRaed = true;
  var ar = (document.documentElement.lang || 'ar').indexOf('en') !== 0;
  var t = function (a, e) { return ar ? a : e; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var el = function (tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  // the commit of unmutedsa/unmuted-raed whose cdn/ the home page loads (jsDelivr caches a pinned commit for good)
  var CDN_REF = 'db7cc838aab2452ac758823316f8e195d39ed818';   // winter launch: hoodie cut-outs, winter banner, offer card photo
  var COLOURS = { '\u0623\u0633\u0648\u062f': '#1C1A20', '\u0623\u0648\u0641 \u0648\u0627\u064a\u062a': '#E6E2D9', '\u0623\u0628\u064a\u0636': '#F4F2EE', '\u0623\u0632\u0631\u0642 \u0645\u0644\u0643\u064a': '#1F4EA6', '\u0631\u0645\u0627\u062f\u064a': '#A4A5A0', '\u0645\u0648\u0643\u0627': '#62433D', '\u0634\u0648\u0643\u0648\u0644\u0627\u062a\u0629': '#50372F', '\u0631\u0645\u0644\u064a': '#D6BFA4', '\u062d\u062c\u0631\u064a': '#C6BAA8', '\u0628\u064a\u062c': '#F9EBD9',
    // the winter hoodies' colours, from their photos (2026-11-22)
    '\u0623\u062e\u0636\u0631': '#3E6745', '\u0643\u062d\u0644\u064a': '#1C223E', '\u0644\u064a\u0644\u0643\u064a': '#C8AAD3' };
  // the tee's size chart: the maker's spec in inches (owner, 2026-11-03): size, chest width, sleeve length, total length
  var SPEC = [['S', 23, 8.5, 26.5], ['M', 24, 8.75, 27], ['L', 25, 9, 27.5], ['XL', 26, 9.25, 28]];
  // the hoodie's (owner's maker sheet, 2026-11-19), inches: size, chest width, shoulder, sleeve length, total length
  var HOODIE_SPEC = [['S', 22.5, 21, 22.5, 26], ['M', 23.5, 22, 23, 27], ['L', 24.5, 23, 23.5, 28], ['XL', 25.5, 24, 24, 29], ['XXL', 26.5, 25, 24.5, 30]];
  // inch \u2192 cm (\u00d7 2.54, to the half)
  var cmOf = function (i) { return Math.round(i * 5.08) / 2; };
  // the chart a page shows: its columns (chest width first, total length last), sizes, and rows in inches and in cm
  var sizeChart = function (hoodie) {
    var rows = hoodie ? HOODIE_SPEC : SPEC;
    return {
      hoodie: !!hoodie,
      cols: hoodie ? [t('\u0639\u0631\u0636 \u0627\u0644\u0635\u062f\u0631', 'Chest width'), t('\u0639\u0631\u0636 \u0627\u0644\u0643\u062a\u0641', 'Shoulder'), t('\u0637\u0648\u0644 \u0627\u0644\u0643\u0645', 'Sleeve'), t('\u0627\u0644\u0637\u0648\u0644 \u0627\u0644\u0643\u0644\u064a', 'Length')]
        : [t('\u0639\u0631\u0636 \u0627\u0644\u0635\u062f\u0631', 'Chest width'), t('\u0637\u0648\u0644 \u0627\u0644\u0643\u0645', 'Sleeve'), t('\u0627\u0644\u0637\u0648\u0644 \u0627\u0644\u0643\u0644\u064a', 'Length')],
      sizes: rows.map(function (r) { return r[0]; }),
      inch: rows.map(function (r) { return r.slice(1); }),
      cm: rows.map(function (r) { return r.slice(1).map(cmOf); })
    };
  };
  // winter (2026-11-22): a hoodie is told by its name (\u00abVOL.25 After Hours Hoodie\u00bb)
  var isHoodie = function (name) { return /hoodie/i.test(String(name || '')); };
  // designs made for girls only (owner, 2026-11-22: \u00abthis design is not for boys\u00bb): no \u00abunisex\u00bb on them
  var GIRLS = /you.?re my type|matcha pilates/i;
  var pageTitle = function () { return (($('[data-testid="store-product-title"]') || {}).textContent || '').trim(); };
  var pageChart = function () { return sizeChart(isHoodie(pageTitle())); };
  // a tee's \u00abvoice\u00bb and VOL number, as written in its Salla description (\u00ab\u0635\u0648\u062a \u0627\u0644\u0645\u062f\u064a\u0646\u0629\u00bb\u060c \u0627\u0644\u0635\u0648\u062a \u0631\u0642\u0645 03 \u0645\u0646 \u0625\u0635\u062f\u0627\u0631 VOLUME 01)
  var latin = function (s) { return String(s).replace(/[\u0660-\u0669]/g, function (d) { return d.charCodeAt(0) - 0x660; }); };
  var voiceOf = function (p) {
    var d = String((p && p.description) || '').replace(/<[^>]+>/g, ' ');
    return { voice: ((d.match(/\u00ab([^\u00bb]+)\u00bb/) || [])[1] || '').trim(), vol: latin((d.match(/\u0631\u0642\u0645\s+([0-9\u0660-\u0669]{1,3})/) || d.match(/VOL\.?\s*([0-9]{1,3})/i) || [])[1] || '') };
  };
  var pad = function (n) { return ('0' + n).slice(-2); };
  // the owner wants invoices to read 'VOL.05 Dates Season' (2026-11-11), so each Salla name starts with its VOL number.
  // The site keeps the bare name (the product page has its own VOL line): names read from Salla go through bare(),
  // and volNames() takes the prefix off names Salla prints on the page
  var VOL_RE = /^(\s*)VOL\.?\s?\d{1,3}\s+(?=[A-Za-z\u0600-\u06FF])/i;
  var bare = function (n) { return String(n == null ? '' : n).replace(VOL_RE, '$1'); };
  // a product's photos (url, alt, main) from Salla, asked for once per page
  var photoLists = {};
  var photosOf = function (id) {
    if (!photoLists[id]) photoLists[id] = window.salla && salla.product && salla.product.getDetails
      ? salla.product.getDetails(id, ['images']).then(function (r) { return ((r && r.data) || r || {}).images || []; }).catch(function () { return []; })
      : Promise.resolve([]);
    return photoLists[id];
  };
  // a product photo whose ALT (Salla \u2192 product \u2192 photo \u2192 ALT) says \u00ab\u0634\u0645\u0627\u0639\u0629\u00bb is the tee on its hanger: it hangs on the home
  // rail and shows in the tracklist, and the product page leaves it out. \u00ab\u0634\u0645\u0627\u0639\u0629 \u062e\u0644\u0641\u00bb is the back of the tee on the hanger.
  var HANGER = /\u0634\u0645\u0627\u0639[\u0629\u0647]|hanger/i, BACKSIDE = /\u062e\u0644\u0641|\u0638\u0647\u0631|back/i;
  var money = function (n) { return window.salla && salla.money ? salla.money(n) : n + ' ' + t('\u0631.\u0633', 'SAR'); };
  // text from the store's own elements, keeping Salla's icons in it (the riyal sign is an <i class="sicon-sar">)
  var copyText = function (to, from) {
    if (!to || !from) return;
    if (typeof from === 'string') { var tpl = document.createElement('template'); tpl.innerHTML = from; from = tpl.content; }
    to.textContent = '';
    Array.prototype.slice.call(from.childNodes).forEach(function (n) {
      if (n.nodeType === 1 && n.tagName === 'I' && /^sicon-[\w-]+$/.test(n.className)) to.appendChild(el('i', n.className));
      else to.appendChild(document.createTextNode(n.textContent));
    });
  };
  // \u00ab\u0627\u062e\u062a\u0631 \u0635\u0648\u062a\u0643\u00bb: the category that holds every tee (Salla has no all-products page). The shop buttons go there: the menu's
  // link, or Salla's short address of the category (it redirects) while the menu (it loads after the page) isn't there yet.
  var ALL_CAT = '1495831469';
  var allUrl = function () {
    var a = $$('custom-main-menu a').filter(function (x) { return x.textContent.trim() === '\u0627\u062e\u062a\u0631 \u0635\u0648\u062a\u0643' && x.href; })[0];
    return a ? a.href : window.salla && salla.url && salla.url.get ? salla.url.get('-/c' + ALL_CAT) : '/-/c' + ALL_CAT;
  };
  // the winter launch (2026-11-22): \u00ab\u0647\u0648\u062f\u064a\u0627\u062a\u00bb (the hoodies) and \u00ab\u062a\u064a\u0634\u064a\u0631\u062a\u0627\u062a\u00bb (every summer tee), each in the header
  var HOODIE_CAT = '1795231059', TEE_CAT = '1191425196';
  var catUrl = function (id, names) {
    var a = $$('custom-main-menu a').filter(function (x) { return names.test(x.textContent.trim()) && x.href; })[0];
    return a ? a.href : window.salla && salla.url && salla.url.get ? salla.url.get('-/c' + id) : '/-/c' + id;
  };
  var hoodiesUrl = function () { return catUrl(HOODIE_CAT, /^\u0647\u0648\u062f\u064a\u0627\u062a$/); };
  var teesUrl = function () { return catUrl(TEE_CAT, /^\u062a\u064a ?\u0634\u064a\u0631\u062a\u0627\u062a$/); };

  /* fonts: Salla drops @import from custom CSS, so the link goes in the head */
  function fonts() {
    if ($('link[data-um-fonts]')) return;
    var l = el('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Alexandria:wght@300..900&family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&display=swap';
    l.setAttribute('data-um-fonts', '');
    document.head.appendChild(l);
  }

  /* draft preview (salla.sa/<store>?preview=\u2026): Salla writes the menu and product links with the store's own domain,
     and that domain shows the published theme. While previewing, those links stay on the preview so the draft stays in view. */
  function previewLinks() {
    var preview = new URLSearchParams(location.search).get('preview');
    if (location.hostname !== 'salla.sa' || !preview || window.__umPreviewLinks) return;
    window.__umPreviewLinks = true;
    var base = 'https://salla.sa/' + location.pathname.split('/')[1];   // the store's path on salla.sa
    var keep = function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || !/^(www\.)?unmutedsa\.com$/.test(a.hostname)) return;
      var u = new URL(a.href);
      u.searchParams.set('preview', preview);
      a.href = base + u.pathname + u.search + u.hash;
    };
    document.addEventListener('pointerdown', keep, true);
    document.addEventListener('click', keep, true);
  }

  /* header: a search button where Raed's top bar used to be */
  function header() {
    var end = $('#mainnav .justify-end');
    if (!end || $('.um-hsearch')) return;
    var b = el('button', 'um-hsearch', '<i class="sicon-search"></i>');
    b.type = 'button';
    b.setAttribute('aria-label', t('\u0628\u062d\u062b', 'Search'));
    b.addEventListener('click', function () { if (window.salla && salla.event) salla.event.dispatch('search::open'); });
    end.insertBefore(b, end.firstChild);
  }
  // the phone menu opens with \u00ab\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629\u00bb, a way back home (owner's manager: some customers don't know how to get back)
  function homeLink() {
    var ul = $('#mobile-menu ul.main-menu');
    if (!ul || $('.um-home-link', ul)) return;
    var home = window.salla && salla.url && salla.url.get ? salla.url.get('') : '/';
    ul.insertAdjacentHTML('afterbegin', '<li class="lg:hidden text-sm font-bold um-home-link"><a href="' + esc(home) + '" class="text-gray-500"><span>' + t('\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629', 'Home') + '</span></a></li>');
  }

  /* home: the UNMUTED theme's sections (hero poster, rail, tracklist, promises, FAQ) with their animations, built from the Twilight theme
     by build_sections.py and served from the public repo unmutedsa/unmuted-raed. Raed's own home sections stay on the
     page underneath (hidden) and come back if anything fails to load; its product list also names the real products. */
  var CDN = 'https://cdn.jsdelivr.net/gh/unmutedsa/unmuted-raed@' + CDN_REF + '/cdn';
  function sections() {
    if (!document.body.classList.contains('index') || $('.um-home') || window.__umHomeLoading) return;
    var main = $('#main-content');
    if (!main) return;
    window.__umHomeLoading = true;
    var root = document.documentElement;
    if (!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) root.classList.add('um-motion');
    document.body.classList.add('theme-unmuted', 'um-home-on');   // Raed's sections step aside now, so they don't flash first
    var css = el('link');
    css.rel = 'stylesheet';
    css.href = CDN + '/sections.css';
    document.head.appendChild(css);
    var tees = settle(attempt(homeTees), 4000), faq = settle(attempt(homeFaq), 2500), winter = settle(attempt(homeHoodies), 4500);
    Promise.all([fetch(CDN + '/sections.html').then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); }), tees, faq, winter]).then(function (res) {
      var box = el('div', 'um-home', res[0].split('__BASE__').join(CDN));
      // the tees the rail has no cut-out for bring their \u00ab\u0634\u0645\u0627\u0639\u0629\u00bb photos from their product pages
      var cut = {};
      $$('.um-rail [data-um-qv]', box).forEach(function (a) { cut[(a.getAttribute('data-name') || '').toLowerCase()] = 1; });
      var news = res[1] ? res[1].items.filter(function (p) { return !cut[String(p.name).toLowerCase()]; }) : [];
      return settle(Promise.all(news.map(function (p) { return hangerOf(p).catch(function () { return null; }); })), 2000).then(function (found) {
        var photos = {};
        (found || []).forEach(function (h) { if (h) photos[h.id] = h; });
        return [box].concat(res.slice(1), [photos]);
      });
    }).then(function (res) {
      var box = res[0];
      // this copy leaves out the hero's top line (\u00ab\u0647\u0630\u064a \u0625\u0634\u0627\u0631\u062a\u0643 \u0639\u0634\u0627\u0646 \u062a\u0631\u0641\u0639 \u0635\u0648\u062a\u0643.\u00bb) and the squiggle under it, and the rail's count line
      // and the rail's button to every tee (owner, 2026-11-09: hide it; the list below has its own)
      $$('.um-hero__eyebrow, .um-hero .um-fl.is-w, .um-rail .um-rls__sub, .um-rail .um-rls__more', box).forEach(function (n) { n.remove(); });
      // the winter list starts as a copy of the tee list as it was built (before the tees go in)
      var winterSec = $('.um-tracks', box) && $('.um-tracks', box).cloneNode(true);
      // each section takes its words, photos, tees or questions from the store; if that fails it keeps what it was built with
      [function () { bindHero(box); }, function () { heroBanner(box); }, function () { bindRail(box, res[1], res[4]); }, function () { railHoodies(box); },
        function () { bindTracks(box, res[1], res[4]); }, function () { bindPromises(box); }, function () { bindFaq(box, res[2]); }, function () { railTen(box); }, function () { trackTwelve(box); },
        function () { winterTracks(box, res[3], winterSec); }, function () { railShowcase(box); }].forEach(function (f) { try { f(); } catch (e) { /* keeps its own */ } });
      main.insertBefore(box, main.firstChild);
      railTouch(box);
      links(box);
      homeReady(box);
      var js = el('script');
      js.src = CDN + '/sections.js';
      js.defer = true;
      document.body.appendChild(js);
    }).catch(function () {
      css.remove();
      root.classList.remove('um-motion');
      document.body.classList.remove('theme-unmuted', 'um-home-on');
      document.body.classList.add('um-home-off');   // Raed's own sections show instead
      window.__umHomeLoading = false;
      homeReady(null);
    });
  }

  /* What the store's own home elements hold (Raed's sections stay on the page, hidden) is what the UNMUTED sections show, so
     the words, photos, tees and questions are edited in Salla:
       hero      \u2190 \u00ab\u0635\u0648\u0631 \u0645\u062a\u062d\u0631\u0643\u0629\u00bb: first photo, main title, extra text
       rail      \u2190 \u00ab\u0645\u0646\u062a\u062c\u0627\u062a \u062b\u0627\u0628\u062a\u0629\u00bb: its title and its tees (the tees with a cut-out photo here keep it; others use their photo)
       tracklist \u2190 the same tees, with the voice and VOL number from each description
       promises  \u2190 \u00ab\u0645\u0645\u064a\u0632\u0627\u062a \u0627\u0644\u0645\u062a\u062c\u0631\u00bb: icon, title and line of each item
       questions \u2190 the store's page \u00ab\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0634\u0627\u0626\u0639\u0629\u00bb (Salla \u2192 \u0627\u0644\u0635\u0641\u062d\u0627\u062a \u0627\u0644\u062a\u0639\u0631\u064a\u0641\u064a\u0629): an h3 per question, the answer under it */
  var attempt = function (f) { try { return f(); } catch (e) { return null; } };
  var settle = function (p, ms) { return Promise.race([Promise.resolve(p).catch(function () { return null; }), new Promise(function (r) { setTimeout(r, ms, null); })]); };
  // Raed's list and Salla's script can still be on their way when this runs: it looks again every 100ms (the caller
  // gives up after a few seconds and keeps the built-in tees)
  function homeTees() {
    return new Promise(function (done, fail) {
      var tries = 0;
      (function look() {
        var list = $('#main-content > section salla-products-list[source], #main-content > section salla-products-slider[source]');
        if (!list || !window.salla || !salla.product || !salla.product.fetch) return ++tries < 40 ? setTimeout(look, 100) : done(null);
        var value = list.getAttribute('source-value'), head = $('.s-block__title h2', list.closest('section'));
        try { value = JSON.parse(value); } catch (e) { /* one id */ }
        salla.product.fetch({ source: list.getAttribute('source'), source_value: value, limit: Number(list.getAttribute('limit')) || 20 })
          .then(function (r) {
            // this list is the summer's: the hoodies have their own list above it (winter launch, 2026-11-22)
            var items = ((r && r.data) || []).filter(function (p) { return !isHoodie(p.name); });
            // the section's category can come back empty (VOLUME 01 did, 2026-11-09): every tee is on \u00ab\u062a\u064a\u0634\u064a\u0631\u062a\u0627\u062a\u00bb too
            if (items.length) return items;
            return salla.product.fetch({ source: 'categories', source_value: [TEE_CAT], limit: 40 })
              .then(function (r2) { return ((r2 && r2.data) || []).filter(function (p) { return !isHoodie(p.name); }); });
          })
          .then(function (items) {
            items.forEach(function (p) { p.name = bare(p.name); });
            done({ title: head ? head.textContent.trim() : '', items: homeOrder(items) });
          }, fail);
      })();
    });
  }
  // the winter hoodies (category \u00ab\u0647\u0648\u062f\u064a\u0627\u062a\u00bb), in VOL order, each with its photo list (the model photos carry \u00ab\u0645\u0648\u062f\u0644\u00bb in their ALT)
  function homeHoodies() {
    return new Promise(function (done) {
      var tries = 0;
      (function look() {
        if (!window.salla || !salla.product || !salla.product.fetch) return ++tries < 40 ? setTimeout(look, 100) : done(null);
        salla.product.fetch({ source: 'categories', source_value: [HOODIE_CAT], limit: 20 }).then(function (r) {
          var items = ((r && r.data) || []).filter(function (p) { return isHoodie(p.name); });
          items.forEach(function (p) { p.name = bare(p.name); });
          items.sort(function (a, b) { return (+voiceOf(a).vol || 999) - (+voiceOf(b).vol || 999); });
          return Promise.all(items.map(function (p) { return photosOf(p.id); })).then(function (lists) {
            items.forEach(function (p, i) { p.umPhotos = lists[i] || []; });
            done(items);
          });
        }).catch(function () { done(null); });
      })();
    });
  }
  // a hoodie seen from outside (the home list and every product card; owner, 2026-11-22: \u00ab\u0641\u064a \u0627\u0644\u0634\u062a\u0648\u064a \u0641\u0642\u0637 \u064a\u0643\u0648\u0646 \u0627\u0644\u0635\u0648\u0631 \u0627\u0644\u0627\u0648\u0644\u064a
  // \u0645\u0648\u062f\u064a\u0644 \u0648 \u0641\u064a \u0627\u0644\u0627\u062e\u0631 \u0627\u0644\u0645\u0646\u062a\u062c \u0628\u062f\u0648\u0646 \u0634\u064a\u00bb): its model photo first, on the side with the print (Defender's is on its front, the
  // rest on the back), and on hover the hoodie by itself on that side; inside, the product page keeps Salla's order (the
  // hoodie first, then the model, like the tees). Rows and cards take turns between the man's photos and the woman's (the
  // girls-only designs have the woman's only)
  var flatPrint = function (imgs, name) {
    var front = /defender/i.test(name || '');
    return (imgs || []).filter(function (x) { return x.url && /\u0647\u0648\u062f\u064a/.test(x.alt || '') && !/\u0645\u0648\u062f\u0644/.test(x.alt || '') && BACKSIDE.test(x.alt || '') !== front; })[0]
      || (imgs || []).filter(function (x) { return x.url && x.main; })[0];
  };
  var winterPics = function (p, i) {
    var model = (p.umPhotos || []).filter(function (x) { return /\u0645\u0648\u062f\u0644/.test(x.alt || '') && x.url; });
    var pick = function (re) {
      var l = model.filter(function (x) { return re.test(x.alt || ''); });
      return l.length ? (i % 2 ? l[l.length - 1] : l[0]).url : '';
    };
    var flat = flatPrint(p.umPhotos, p.name);
    return { first: pick(/defender/i.test(p.name) ? /\u0623\u0645\u0627\u0645/ : /\u062e\u0644\u0641/), flat: flat ? flat.url : '' };
  };
  // the winter list (owner, 2026-11-22): above the tees, on the page's own colour, each hoodie on its model photo
  // (\u00ab\u0644\u0644\u0634\u062a\u0648\u064a \u0641\u0642\u0637 \u0628\u062a\u0643\u0648\u0646 \u0627\u0644\u0635\u0648\u0631\u0647 \u0645\u0646 \u0628\u0631\u0647 \u0628\u0627\u0644\u0645\u0648\u062f\u0644\u00bb), the summer list under it as before
  function winterTracks(box, items, sec) {
    var summer = $('.um-tracks', box);
    if (!summer || !sec || !items || !items.length || $('.um-winter', box)) return;
    sec.id = 'um-tracks-winter';
    sec.classList.add('um-winter');
    sec.style.setProperty('--sec-bg', 'var(--um-paper)');
    var kick = $('.um-kicker um-t', sec), title = $('.um-title um-t', sec), sub = $('.um-sub', sec);
    if (kick) kick.textContent = 'WINTER COLLECTION';
    if (title) title.textContent = t('\u0647\u0648\u062f\u064a\u0627\u062a \u0627\u0644\u0634\u062a\u0627\u0621', 'Winter hoodies');
    if (sub) sub.remove();
    var list = $('ol.um-tl', sec), first = list && $('li', list);
    if (!first) return;
    var proto = first.cloneNode(true);
    list.textContent = '';
    items.forEach(function (p, i) {
      var li = proto.cloneNode(true), v = voiceOf(p), pic = $('.um-tl__img', li), face = pic && $('img', pic), m = winterPics(p, i);
      $('a.um-tl__row', li).setAttribute('href', p.url);
      $('.um-tl__no', li).textContent = v.vol ? pad(v.vol) : pad(i + 1);
      $('.um-tl__name bdi', li).textContent = p.name;
      $('.um-tl__name small', li).textContent = v.voice;
      copyText($('.um-tl__end > b', li), money(priceOf(p)));
      if (face) {
        face.src = mdOf(m.first) || m.first || imageOf(p);
        face.alt = '';
        pic.classList.add('um-model');
        if (m.flat) {
          var img = el('img', 'um-tl__back um-face-back');
          img.alt = '';
          img.loading = 'lazy';
          img.src = mdOf(m.flat) || m.flat;
          face.classList.add('um-face');
          pic.appendChild(img);
          pic.classList.add('um-turn');
        }
      }
      list.appendChild(li);
    });
    summer.parentNode.insertBefore(sec, summer);
  }
  // the hoodies on the rail (owner, 2026-11-22: \u00ab\u0627\u0636\u0641 \u0627\u0644\u062b\u0645\u0627\u0646\u064a\u0647 \u0627\u0644\u062a\u0635\u0627\u0645\u064a\u0645 \u062f\u064a \u0639\u0644\u064a \u0627\u0644\u0634\u0645\u0627\u0639\u0647\u00bb), first and in her order, before the
  // tees: cut-outs in cdn/images/unmuted/hoodies/ drawn to the tees' scale, hook top on the pole, so one --iw/--hx/--top
  // set fits both sides
  var RAIL_HOODIES = [['drummers', 'Sound of Our Roots', 360.0, 181.0], ['porsche', 'Porsche 911', 356.4, 180.6], ['riyadh', 'Riyadh City', 361.4, 180.6],
    ['after-hours', 'After Hours', 361.9, 182.6], ['keep-calm', 'Keep Calm', 363.3, 182.8], ['queen', 'Queen of Hearts', 356.4, 180.6],
    ['camping', 'Under the Stars', 356.4, 180.6], ['defender', 'Defender', 360.0, 181.0]];
  function railHoodies(box) {
    var track = $('.um-rail [data-um-rail-track]', box);
    var model = track && $$('.um-rls__item', track).filter(function (li) { return $('.um-rls__face.is-back img', li); })[0];
    if (!model || $('.um-rls__item.is-hoodie', track)) return;
    RAIL_HOODIES.slice().reverse().forEach(function (h) {
      var li = model.cloneNode(true), src = CDN + '/images/unmuted/hoodies/' + h[0], a = $('[data-um-qv]', li), imgs = $$('.um-rls__face img', li);
      li.classList.add('is-hoodie');
      li.setAttribute('style', '--iw: ' + h[2] + '; --hx: ' + h[3] + '; --top: 175.2');
      a.setAttribute('data-name', h[1] + ' Hoodie');
      a.setAttribute('aria-label', h[1] + ' Hoodie');
      a.setAttribute('data-img', src + '-front.avif');
      a.setAttribute('data-back', src + '-back.avif');
      a.setAttribute('data-first', 'front');
      a.setAttribute('data-id', '');
      if (imgs[0]) imgs[0].src = src + '-front.avif';
      if (imgs[1]) imgs[1].src = src + '-back.avif';
      track.insertBefore(li, track.firstChild);
    });
  }
  var FAQ_PAGE = '92387200';   // \u00ab\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0634\u0627\u0626\u0639\u0629\u00bb, unless the footer links another one by that name
  function homeFaq() {
    var a = $$('.store-footer a').filter(function (x) { return /\/page-\d+/.test(x.href) && /\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0634\u0627\u0626\u0639\u0629|FAQ/i.test(x.textContent); })[0];
    var id = a ? a.href.match(/\/page-(\d+)/)[1] : FAQ_PAGE;
    var url = window.salla && salla.url && salla.url.get ? salla.url.get('-/page-' + id) : '/-/page-' + id;
    return fetch(url, { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.text() : null; }).then(function (html) {
      return html ? new DOMParser().parseFromString(html, 'text/html').querySelector('.content--single-page .content-entry') : null;
    });
  }
  function hangerOf(p) {
    return photosOf(p.id).then(function (imgs) {
      var front = imgs.filter(function (i) { return HANGER.test(i.alt || '') && !BACKSIDE.test(i.alt || ''); })[0];
      var back = imgs.filter(function (i) { return HANGER.test(i.alt || '') && BACKSIDE.test(i.alt || ''); })[0];
      return front ? { id: String(p.id), front: front.url, back: back ? back.url : '' } : null;
    });
  }
  // the hero's words come from Salla's slide 1 (its photo no longer: the banner below takes the photo's place)
  function bindHero(box) {
    var slide = $('#main-content > .s-block--hero-slider .swiper-slide'), hero = $('.um-hero', box);
    if (!slide || !hero) return;
    var title = $('h2', slide), sub = $('p', slide);
    if (title && title.textContent.trim()) copyText($('.um-hero__title um-t', hero), title);
    if (sub && sub.textContent.trim()) copyText($('.um-hero__sub um-t', hero), sub);
    else if ($('.um-hero__sub', hero)) $('.um-hero__sub', hero).remove();
  }
  // the hero's photo is the owner's \u00abCity Frequency\u00bb banner (3 Nov): the wide one on computers, the tall one on phones,
  // at its own size and edge to edge (it carries its own words, so never cropped; held full-screen it left blurred bands
  // the owner didn't want), no link (owner: not tied to a product). The words and the button still come up over it as
  // the page scrolls (owner: \u00ab\u0645\u0639 scroll animation\u00bb), here as the banner moves up rather than on a pinned stage: from
  // the first scroll, fully in once a fifth of it has gone by (it is the first thing on the page, so by scrollY: the
  // header hiding on scroll doesn't shift it)
  // Since the winter launch (owner, 2026-11-22: \u00ab\u0627\u062b\u0646\u064a\u0646 \u0628\u0627\u0646\u0631 \u0627\u0644\u0642\u062f\u064a\u0645 \u0648\u062f\u0647 \u0644\u0643\u0646 \u0627\u0644\u062c\u062f\u064a\u062f \u0628\u064a\u0643\u0648\u0646 \u0628\u0627\u0644\u0628\u062f\u0627\u064a\u0647\u00bb, \u00abis slider hero section\u00bb)
  // the hero is a slider of two banners: the winter one first, its \u00abShop Now\u00bb a link to the hoodies, then \u00abCity Frequency\u00bb.
  // Each keeps its banner whole and edge to edge, and the slider is as tall as the one in view. It moves on by itself every
  // 6 s (not with reduced motion; it waits while the mouse or a finger is on it), by a swipe, and by its dots. The words
  // and button that come up on scroll belong to \u00abCity Frequency\u00bb: over the winter banner (it has its own) they stay away.
  var HERO_PICS = 'https://cdn.jsdelivr.net/gh/unmutedsa/unmuted-raed@8662dfa2d19b8272922c10d6b5afb4c1f54cdef2/cdn/photos/hero/';
  function heroBanner(box) {
    var hero = $('.um-hero', box), stage = hero && $('[data-um-poster]', hero), photo = stage && $('.um-hero__photo', stage);
    if (!photo) return;
    var W = CDN + '/photos/hero/';
    photo.insertAdjacentHTML('beforebegin', '<div class="um-hero__slider" aria-roledescription="' + t('\u0639\u0631\u0636 \u0634\u0631\u0627\u0626\u062d', 'carousel') + '" aria-label="' + t('\u0627\u0644\u0639\u0631\u0648\u0636', 'Highlights') + '">' +
      '<div class="um-hero__track" dir="ltr">' +
        '<div class="um-hero__slide is-winter" role="group" aria-roledescription="' + t('\u0634\u0631\u064a\u062d\u0629', 'slide') + '" aria-label="1 / 2"><picture class="um-hero__pic">' +
          '<source media="(max-width: 599px)" srcset="' + W + 'winter-tall.webp 941w, ' + W + 'winter-tall-2x.webp 1882w" sizes="100vw" width="941" height="1672">' +
          '<img src="' + W + 'winter-wide-1672.webp" srcset="' + W + 'winter-wide-1672.webp 1672w, ' + W + 'winter-wide.webp 3344w" sizes="100vw" width="3344" height="1882" class="um-hero__photo" fetchpriority="high" alt="' +
            t('UNMUTED Winter Collection: \u0647\u0648\u062f\u064a\u0627\u062a \u0627\u0644\u0634\u062a\u0627\u0621', 'UNMUTED Winter Collection: the winter hoodies') + '"></picture>' +
          '<a class="um-hero__shop" href="' + esc(hoodiesUrl()) + '" aria-label="' + t('\u062a\u0633\u0648\u0651\u0642 \u0627\u0644\u0647\u0648\u062f\u064a\u0627\u062a', 'Shop the hoodies') + '"></a></div>' +
        '<div class="um-hero__slide is-city" role="group" aria-roledescription="' + t('\u0634\u0631\u064a\u062d\u0629', 'slide') + '" aria-label="2 / 2"><picture class="um-hero__pic">' +
          '<source media="(max-width: 599px)" srcset="' + HERO_PICS + 'city-frequency-tall.webp" width="941" height="1672">' +
          '<img src="' + HERO_PICS + 'city-frequency-wide.webp" width="1983" height="793" class="um-hero__photo" loading="lazy" alt="' +
            t('UNMUTED City Frequency: \u062a\u064a\u0634\u064a\u0631\u062a \u0627\u0644\u0631\u064a\u0627\u0636\u060c DROP 01', 'UNMUTED City Frequency: the Riyadh tee, DROP 01') + '"></picture></div>' +
      '</div>' +
      '<div class="um-hero__dots"><button type="button" aria-label="' + t('\u0627\u0644\u0628\u0627\u0646\u0631 \u0661', 'Banner 1') + '" aria-current="true"></button><button type="button" aria-label="' + t('\u0627\u0644\u0628\u0627\u0646\u0631 \u0662', 'Banner 2') + '" aria-current="false"></button></div>' +
    '</div>');
    photo.remove();
    stage.removeAttribute('data-um-poster');   // sections.js's pinned reveal steps aside for the one below
    hero.classList.add('has-banner');
    heroSlider(hero);
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return stage.style.setProperty('--cap', 1);
    var busy = false;
    var reveal = function () {
      busy = false;
      stage.style.setProperty('--cap', Math.min(1, Math.max(0, scrollY / Math.max(80, stage.offsetHeight / 5))).toFixed(3));
    };
    addEventListener('scroll', function () { if (!busy) { busy = true; requestAnimationFrame(reveal); } }, { passive: true });
    requestAnimationFrame(reveal);
  }
  function heroSlider(hero) {
    var track = $('.um-hero__track', hero), slides = track ? $$('.um-hero__slide', track) : [], dots = $$('.um-hero__dots button', hero);
    if (slides.length < 2) return;
    var still = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches), at = 0, held = 0, busy = false;
    var fit = function () { var h = slides[at].offsetHeight; if (h) track.style.height = h + 'px'; };
    var show = function (k) {
      at = k;
      dots.forEach(function (d, i) { d.setAttribute('aria-current', String(i === k)); });
      hero.classList.toggle('is-winter-on', slides[k].classList.contains('is-winter'));
      fit();
    };
    var go = function (k) { track.scrollTo({ left: k * track.clientWidth, behavior: still ? 'auto' : 'smooth' }); show(k); };
    track.addEventListener('scroll', function () {
      if (busy) return;
      busy = true;
      requestAnimationFrame(function () {
        busy = false;
        var k = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / (track.clientWidth || 1))));
        if (k !== at) show(k);
      });
    }, { passive: true });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { held = Date.now(); go(i); }); });
    $$('img', track).forEach(function (img) { img.addEventListener('load', fit); });
    addEventListener('resize', function () { track.scrollLeft = at * track.clientWidth; fit(); });
    // it waits while the mouse is over it or for a while after a finger or a dot moved it
    var over = false;
    track.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') over = true; });
    track.addEventListener('pointerleave', function () { over = false; });
    track.addEventListener('touchstart', function () { held = Date.now(); }, { passive: true });
    show(0);
    if (still) return;
    setInterval(function () {
      if (over || document.hidden || Date.now() - held < 9000 || !document.body.contains(track)) return;
      go((at + 1) % slides.length);
    }, 6000);
  }
  var imageOf = function (p) { return (p.image && p.image.url) || ''; };
  var priceOf = function (p) { return p.is_on_sale && p.sale_price ? p.sale_price : p.price; };
  function bindRail(box, data, photos) {
    var rail = $('.um-rail', box), track = rail && $('[data-um-rail-track]', rail);
    if (!track || !data) return;
    if (data.title && $('.um-rls__title um-t', rail)) $('.um-rls__title um-t', rail).textContent = data.title;
    var lis = $$('.um-rls__item', track), byName = {};
    if (!data.items.length || !lis.length) return;
    lis.forEach(function (li) { var a = $('[data-um-qv]', li); if (a) byName[(a.getAttribute('data-name') || '').toLowerCase()] = li; });
    // only the tees it has its own cut-out for (owner, 2026-11-09: the new tees stay off the rail, \u00ablike before, the old
    // ones only\u00bb; they show in the list below and on \u00ab\u0627\u062e\u062a\u0631 \u0635\u0648\u062a\u0643\u00bb)
    var out = data.items.filter(function (p) { return byName[String(p.name).toLowerCase()]; }).map(function (p) {
      var li = byName[String(p.name).toLowerCase()];
      if (!li) {   // no cut-out here: its \u00ab\u0634\u0645\u0627\u0639\u0629\u00bb photo (front, and back if there is one), else its main photo
        var h = (photos || {})[String(p.id)] || {}, front = h.front || imageOf(p), back = h.back || '';
        li = lis[0].cloneNode(true);
        li.setAttribute('style', '--iw: 346; --hx: 173; --top: 175.5');
        $$('.um-rls__face img', li).forEach(function (img) { img.removeAttribute('data-side'); });
        $('.um-rls__face img', li).src = front;
        if (back) $('.um-rls__face.is-back img', li).src = back;
        else { $$('.um-rls__face.is-back', li).forEach(function (n) { n.remove(); }); $('.um-rls__flip', li).classList.remove('has-back'); }
        $('[data-um-qv]', li).setAttribute('data-img', front);
        $('[data-um-qv]', li).setAttribute('data-back', back);
        $('[data-um-qv]', li).setAttribute('data-first', 'front');
      }
      var a = $('[data-um-qv]', li);
      a.setAttribute('href', p.url);
      a.setAttribute('data-id', p.id);
      a.setAttribute('data-name', p.name);
      a.setAttribute('data-price', money(priceOf(p)));
      a.setAttribute('data-was', p.is_on_sale ? money(p.regular_price) : '');
      a.setAttribute('data-status', p.status || 'sale');
      a.setAttribute('aria-label', p.name + '\u060c ' + priceOf(p) + ' ' + t('\u0631.\u0633', 'SAR'));
      return li;
    });
    track.textContent = '';
    out.forEach(function (li) { track.appendChild(li); });
  }
  // the rail hangs the eight winter hoodies (the tees came off it, 2026-11-22), and its bar counts them
  var RAIL_MAX = 18;
  // the home page shows every tee again (owner, 2026-11-09, later): the first twelve, then \u00ab\u0639\u0631\u0636 \u0627\u0644\u0645\u0632\u064a\u062f\u00bb opens the rest in place
  var TRACK_MAX = 12;
  // \u2026and opens on these six, in this order (owner's screenshots): \u0627\u0644\u0631\u064a\u0627\u0636\u060c Dates Season\u060c Caution\u060c UNMUTED Sticker\u060c Desert Club\u060c
  // Just Padel; the rest follow in Salla's order. The rail takes the same order (its first ten with a cut-out)
  var TRACK_FIRST = ['862344853', '1223062065', '217344331', '1197022782', '696581406', '1501040588'];
  function homeOrder(items) {
    var rank = function (p, i) { var k = TRACK_FIRST.indexOf(String(p.id)); return k > -1 ? k : TRACK_FIRST.length + i; };
    return items.map(function (p, i) { return { p: p, r: rank(p, i) }; }).sort(function (a, b) { return a.r - b.r; })
      .map(function (x) { return x.p; });
  }
  function trackTwelve(box) {
    var list = $('.um-tracks ol.um-tl', box);
    if (!list) return;
    $$('.um-tl__more', box).forEach(function (n) { n.parentNode.removeChild(n); });
    // hidden inline: the list's own CSS sets every row to display:grid
    var later = $$('li', list).slice(TRACK_MAX);
    later.forEach(function (li) { li.style.display = 'none'; });
    if (!later.length) return;
    var p = el('p', 'um-tl__more', '<button type="button" class="um-btn um-btn--ink">' + t('\u0639\u0631\u0636 \u0627\u0644\u0645\u0632\u064a\u062f', 'Show more') + '</button>');
    p.style.cssText = 'display:flex;justify-content:center;margin:32px 0 0';
    $('button', p).addEventListener('click', function () {
      later.forEach(function (li) { li.style.display = ''; });
      p.parentNode.removeChild(p);
    });
    list.parentNode.insertBefore(p, list.nextSibling);
  }
  function railTen(box) {
    var rail = $('.um-rail', box), items = rail ? $$('[data-um-rail-track] > .um-rls__item', rail) : [];
    if (!items.length) return;
    // since the winter launch only the hoodies hang (owner, 2026-11-22: \u00ab\u0648\u0634\u064a\u0644 \u0627\u0644\u062a\u064a\u0634\u0631\u062a\u0627\u062a \u0645\u0646 rail\u00bb); the tees leave after
    // the tracklist has taken their back photos
    var hung = items.filter(function (li) { return li.classList.contains('is-hoodie'); });
    if (hung.length) {
      items.forEach(function (li) { if (hung.indexOf(li) < 0 && li.parentNode) li.parentNode.removeChild(li); });
      items = hung;
    }
    items.slice(RAIL_MAX).forEach(function (li) { li.remove(); });
    var n = Math.min(items.length, RAIL_MAX), ends = $$('.um-rls__progress > span', rail), bar = $('[data-um-rail-bar]', rail);
    if (ends[1]) ends[1].textContent = pad(n);
    if (bar) bar.setAttribute('aria-valuemax', n);
  }
  // tees this list shows by themselves (owner, 2026-11-02): the tee without its hanger on the page's own colour, its
  // model photo on hover, and no number on the picture; the folder under PHOTOS holds {sm,md}/alone-front.webp, which is
  // also the product's main (first) photo in Salla, so the product page and every card open on it; its second photo is
  // the tee by itself from behind ({sm,md}/alone-back.webp), which the hover shows (owner's video, 2026-11-02)
  var ALONE = { '217344331': 'caution/', '1197022782': 'unmuted-sticker/', '862344853': 'riyadh/', '1501040588': 'just-padel/',
    '1223062065': 'dates-season/', '696581406': 'desert-club/', '2123593358': 'love-pop/',
    '299362976': 'carnival/', '372176867': 'good-mood/', '1602505860': 'cherry-market/',
    '17985496': 'play-unmuted/', '226109447': 'vending/', '1987585855': 'call-me/', '157439951': 'kashta/',
    '540602239': 'the-original/', '752858337': 'megaphone/', '955844389': 'ice-cream/',
    '1319907686': 'tape-green/', '285102373': 'speakers/', '1629114231': 'skateboard/', '2058090175': 'coffee-on-my-mind/',
    '620531049': 'tape-yellow/', '1358578306': 'weekend-recovery-club/', '1722444392': 'records/' };
  // tees whose print is on the back: every list shows them from behind first (the tracklist, the product cards, the free
  // tee window), while the product page keeps Salla's photo order (owner, 2026-11-07: \u00ab\u0645\u0646 \u0627\u0644\u062e\u0627\u0631\u062c \u0628\u0633\u060c \u0627\u0644\u0644\u064a \u0645\u0646 \u062c\u0648\u0647 \u0646\u0641\u0633 \u0627\u0644\u062a\u0631\u062a\u064a\u0628\u00bb)
  // \u0627\u0644\u0631\u064a\u0627\u0636\u060c Just Padel\u060c Who Said Kashta? (2026-11-07), then every tee with a back print: The Love Pop Club\u060c Carnival\u060c
  // Good Mood Fast Food\u060c Vending Machine\u060c Play UNMUTED (owner: \u00ab\u0627\u064a \u0634\u064a \u0641\u064a \u0631\u0633\u0645 \u0645\u0646 \u0627\u0644\u0638\u0647\u0631\u00bb)
  var BACK_FIRST = ['862344853', '1501040588', '157439951', '2123593358', '299362976', '372176867', '226109447', '17985496', '285102373', '2058090175', '1358578306', '1722444392'];
  var backFirst = function (id) { return BACK_FIRST.indexOf(String(id)) > -1 && !!ALONE[String(id)]; };
  var backPhoto = function (id, size) { return PHOTOS + ALONE[String(id)] + (size || 'sm') + '/alone-back.webp'; };
  var showBack = function (img, id) {
    var sm = backPhoto(id);
    if (!img || img.getAttribute('src') === sm) return;
    img.setAttribute('srcset', sm + ' 800w, ' + backPhoto(id, 'md') + ' 1600w');
    img.setAttribute('sizes', Math.max(160, Math.round(img.getBoundingClientRect().width || 300)) + 'px');
    img.setAttribute('src', sm);
  };
  function bindTracks(box, data, photos) {
    var list = $('.um-tracks ol.um-tl', box), rows = list ? $$('li', list) : [], byName = {};
    if (!data || !data.items.length || !rows.length) return;
    // new rows copy the first row as it came (the rows are changed in place below: a copy made later would bring along a
    // tee-by-itself row's picture, swipe strip and classes)
    var proto = rows[0].cloneNode(true);
    rows.forEach(function (li) { var b = $('.um-tl__name bdi', li); if (b) byName[b.textContent.trim().toLowerCase()] = li; });
    var out = data.items.map(function (p, i) {
      var li = byName[String(p.name).toLowerCase()], v = voiceOf(p);
      if (!li) { li = proto.cloneNode(true); $('.um-tl__img img', li).src = ((photos || {})[String(p.id)] || {}).front || imageOf(p); }
      $('a.um-tl__row', li).setAttribute('href', p.url);
      $('.um-tl__no', li).textContent = v.vol ? pad(v.vol) : pad(i + 1);
      $('.um-tl__name bdi', li).textContent = p.name;
      $('.um-tl__name small', li).textContent = v.voice;
      copyText($('.um-tl__end > b', li), money(priceOf(p)));
      // its back: the rail's back photo of the same tee (a cut-out, or its \u00ab\u0634\u0645\u0627\u0639\u0629 \u062e\u0644\u0641\u00bb photo)
      var hung = $$('.um-rail [data-um-qv]', box).filter(function (a) { return (a.getAttribute('data-name') || '').toLowerCase() === String(p.name).toLowerCase(); })[0];
      var back = hung && hung.getAttribute('data-back'), pic = $('.um-tl__img', li), model = mdOf(imageOf(p)), alone = ALONE[String(p.id)];
      $$('.um-tl__back', li).forEach(function (n) { n.remove(); });
      li.classList.toggle('um-tl--alone', !!alone);
      // a tee whose print is on its back opens on the back here, and the hover shows the other side
      var first = backFirst(p.id) ? 'back' : 'front';
      if (alone && pic) aloneTrack(pic, p, PHOTOS + alone, first, PHOTOS + alone + 'md/alone-' + (first === 'back' ? 'front' : 'back') + '.webp');
      else if (model && pic) modelTrack(pic, p, model);
      else if (back && pic) {
        var img = el('img', 'um-tl__back um-face-back');
        img.alt = '';
        img.src = back;
        $('img', pic).classList.add('um-face');
        pic.appendChild(img);
        pic.classList.add('um-turn');
      }
      return li;
    });
    list.textContent = '';
    out.forEach(function (li) { list.appendChild(li); });
  }
  // a tee with model photos (the HD list below) shows its main one instead of the cut-out, and its \u00ab\u062e\u0644\u0641\u00bb model photo on hover
  function modelTrack(pic, p, front) {
    var face = $('img', pic);
    face.src = front;
    face.classList.remove('um-face');
    pic.classList.remove('um-turn');
    pic.classList.add('um-model');
    photosOf(p.id).then(function (imgs) {
      var b = imgs.filter(function (i) { return BACKSIDE.test(i.alt || '') && mdOf(i.url); })[0];
      if (!b || $('.um-tl__back', pic)) return;
      var img = el('img', 'um-tl__back um-face-back');
      img.alt = '';
      img.src = mdOf(b.url);
      face.classList.add('um-face');
      pic.appendChild(img);
      pic.classList.add('um-turn');
    });
  }
  // on a computer the model photo comes in on hover; a phone has no hover, so a finger drags through the product's own
  // photos after the tee (owner, 2026-11-02), with dots for where it is
  function aloneTrack(pic, p, dir, first, model) {
    var face = $('img', pic), own = dir + 'sm/alone-' + first + '.webp';
    face.setAttribute('srcset', own + ' 800w, ' + dir + 'md/alone-' + first + '.webp 1600w');
    face.setAttribute('sizes', '(min-width: 768px) 30vw, 46vw');
    face.src = own;
    face.classList.add('um-face');
    pic.classList.remove('um-model');
    pic.classList.add('um-alone');
    if (hoverable) {
      if (!model) return;
      var img = el('img', 'um-tl__back um-face-back');
      img.alt = '';
      img.src = model;
      pic.appendChild(img);
      pic.classList.add('um-turn');
      return;
    }
    photosOf(p.id).then(function (imgs) {
      var urls = imgs.filter(function (i) { return !HANGER.test(i.alt || ''); }).map(function (i) { return smOf(i.url); })
        .filter(function (u) { return u && u !== own; });
      if (!urls.length || $('.um-swipe', pic)) return;
      var strip = el('span', 'um-swipe'), dots = el('span', 'um-swipe__dots');
      strip.appendChild(face);
      urls.forEach(function (u) {
        var im = el('img');
        im.alt = '';
        im.loading = 'lazy';
        im.decoding = 'async';
        im.src = u;
        strip.appendChild(im);
      });
      $$('img', strip).forEach(function (im, i) { dots.appendChild(el('i', i ? '' : 'is-on')); });
      pic.appendChild(strip);
      pic.appendChild(dots);
      strip.addEventListener('scroll', function () {
        var k = Math.round(Math.abs(strip.scrollLeft) / (strip.clientWidth || 1));
        $$('i', dots).forEach(function (d, i) { d.classList.toggle('is-on', i === k); });
      }, { passive: true });
    });
  }
  function bindPromises(box) {
    var feats = $$('#main-content > .s-block--features .s-block--features__item'), list = $('.um-promises ul.um-box', box);
    if (!feats.length || !list) return;
    var lis = $$('li', list), ics = lis.map(function (li) { return ($('.um-box__ic', li) || {}).innerHTML || ''; });
    // the drawn card / truck / box stay for those icons; any other icon picked in the editor shows as Salla's own
    var iconFor = function (cls) {
      if (/card|pay|wallet|cash|money/.test(cls) && ics[0]) return ics[0];
      if (/ship|truck|deliver/.test(cls) && ics[1]) return ics[1];
      if (/box|gift|package/.test(cls) && ics[2]) return ics[2];
      return '<i class="' + cls + '"></i>';
    };
    var out = feats.map(function (f, i) {
      var li = lis[i % lis.length].cloneNode(true), icon = $('i[class*="sicon-"]', f), ic = $('.um-box__ic', li);
      if (icon && ic) ic.innerHTML = iconFor((icon.className.match(/sicon-[\w-]+/) || [''])[0]);
      copyText($('b um-t', li) || $('b', li), $('h2', f));
      copyText($('small um-t', li) || $('small', li), $('p', f));
      return li;
    });
    list.textContent = '';
    out.forEach(function (li) { list.appendChild(li); });
  }
  function bindFaq(box, entry) {
    var wrap = $('.um-faq .um-mics', box), tpl = wrap && $('details.um-mic', wrap), pairs = [], cur = null;
    if (!tpl || !entry) return;
    Array.prototype.slice.call(entry.children).forEach(function (n) {
      if (/^H[2-4]$/.test(n.tagName)) { cur = { q: n.textContent.trim(), a: [] }; pairs.push(cur); }
      else if (cur && n.textContent.trim()) cur.a.push(n);
    });
    pairs = pairs.filter(function (x) { return x.q && x.a.length; });
    if (!pairs.length) return;
    var out = pairs.map(function (x) {
      var d = tpl.cloneNode(true), a = $('.um-mic__a', d);
      d.removeAttribute('open');
      ($('summary b um-t', d) || $('summary b', d)).textContent = x.q;
      a.textContent = '';
      x.a.forEach(function (n) { a.appendChild(document.importNode(n, true)); });
      return d;
    });
    wrap.textContent = '';
    out.forEach(function (d) { wrap.appendChild(d); });
  }

  /* the rail is for looking: a tee there opens nothing (no quick buy, no link); \u00ab\u0643\u0644 \u0627\u0644\u0623\u0635\u0648\u0627\u062a\u00bb under it leads to VOLUME 01 */
  function railShowcase(box) {
    $$('.um-rail .um-rls__swing', box).forEach(function (a) {
      a.removeAttribute('href');
      a.removeAttribute('data-um-qv');
      a.setAttribute('role', 'img');
    });
  }

  /* phones: a sideways swipe on the rail drags it (rail.js follows the finger).
     - A finger belongs to the tee it first touched; when rail.js moves it over to the rail, that tee reports
       \u00ablostpointercapture\u00bb, which rail.js takes as the end of the drag, so only the rail's own one gets through.
     - Once a swipe is clearly sideways the page is held still for it, so the browser doesn't take it over as a scroll;
       an up / down swipe still scrolls the page. */
  function railTouch(box) {
    $$('[data-um-rail-viewport]', box).forEach(function (vp) {
      vp.addEventListener('lostpointercapture', function (e) { if (e.target !== vp) e.stopPropagation(); }, true);
      var x0 = 0, y0 = 0, way = '';
      vp.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; way = ''; }, { passive: true });
      vp.addEventListener('touchmove', function (e) {
        var dx = Math.abs(e.touches[0].clientX - x0), dy = Math.abs(e.touches[0].clientY - y0);
        if (!way && dx + dy > 4) way = dx > dy ? 'x' : 'y';
        if (way === 'x' && e.cancelable) e.preventDefault();
      }, { passive: false });
    });
  }

  /* the sections were rendered with the demo tees: point each one at the real Salla product (matched by name in Raed's
     product list), the shop buttons at \u00ab\u0627\u062e\u062a\u0631 \u0635\u0648\u062a\u0643\u00bb (every tee), the \u00abask us\u00bb buttons at the store's contact, \u00ab\u0637\u0644\u0628\u0627\u062a\u064a\u00bb at the orders */
  function links(box) {
    var volume = allUrl();
    var contact = ($$('.store-footer a').filter(function (a) { return /^(tel:|https:\/\/wa\.me|https:\/\/api\.whatsapp)/.test(a.getAttribute('href') || ''); })[0] || {}).href || '';
    var orders = window.salla && salla.url && salla.url.get ? salla.url.get('orders') : '/orders';
    var set = function (a, url) { if (a && url) a.setAttribute('href', url); };
    $$('.um-hero .um-btn, .um-banner .um-btn, .um-video .um-btn, .um-duo .um-btn, .um-cats a.um-pad, .um-colors a[href="#"], .um-rail a.um-rls__more, .um-rail .um-btn', box).forEach(function (a) { if (a.getAttribute('href') === '#') set(a, volume); });
    $$('.um-faq .um-btn, .um-size .um-btn, .um-track [data-um-track-help]', box).forEach(function (a) { if (contact) set(a, contact); else a.remove(); });
    $$('.um-track a', box).forEach(function (a) { if (!a.hasAttribute('data-um-track-help') && a.getAttribute('href') === '#') set(a, orders); });
    $$('.um-drop .um-btn', box).forEach(function (a) { if (a.getAttribute('href') === '#') a.remove(); });
    var tries = 0;
    (function products() {
      var map = {};
      $$('custom-salla-product-card').forEach(function (c) {
        var a = $('.s-product-card-content-title a', c), name = a && bare(a.textContent.trim());
        var id = a && (a.href.match(/\/p(\d+)/) || [])[1];
        if (name && id) map[name.toLowerCase()] = { url: a.href, id: id };
      });
      if (Object.keys(map).length < 10 && ++tries < 40) return setTimeout(products, 300);
      var find = function (text) {
        text = (text || '').toLowerCase();
        var best = '';
        Object.keys(map).forEach(function (n) { if (text.indexOf(n) >= 0 && n.length > best.length) best = n; });
        return best ? map[best] : null;
      };
      $$('[data-um-qv][data-name]', box).forEach(function (a) {
        var p = map[(a.dataset.name || '').toLowerCase()];
        if (p) { a.dataset.id = p.id; a.setAttribute('href', p.url); }
      });
      $$('.um-tracks a[href="#"], .um-spot a[href="#"]', box).forEach(function (a) {
        var p = find(a.closest('.um-spot') ? a.closest('.um-spot').textContent : a.textContent);
        set(a, p ? p.url : volume);
      });
    })();
  }

  /* product page: name block, colour, sizes as tiles, fold-outs (about the tee, sizes) */
  function product() {
    var form = $('.product-form');
    var title = $('[data-testid="store-product-title"]');
    if (!form || !title || $('.um-pvoice, .um-pvol, .um-folds')) return;
    var box = $('[data-testid="store-product-description"]');
    var lines = box ? $$('p, li', box).map(function (p) { return p.textContent.trim(); }).filter(Boolean) : [];
    if (box && !lines.length) lines = box.textContent.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    var plain = lines.join(' ');
    var voice = (plain.match(/\u00ab([^\u00bb]+)\u00bb/) || [])[1] || '';
    var vol = (plain.match(/\u0631\u0642\u0645\s+([0-9\u0660-\u0669]{1,3})/) || plain.match(/VOL\.?\s*([0-9]{1,3})/i) || [])[1] || '';
    var colour = ((plain.match(/\u0627\u0644\u0644\u0648\u0646:\s*([^.\u060c]+)/) || [])[1] || '').trim();
    var tagline = lines[0] && lines[0].indexOf('\u00ab') < 0 && lines[0].indexOf('\u0627\u0644\u0644\u0648\u0646:') < 0 ? lines[0] : '';
    if (vol) title.insertAdjacentHTML('beforebegin', '<p class="um-pvol" lang="en">VOL.' + esc(vol) + '</p>');
    if (/^[\x00-\x7F]/.test(title.textContent.trim())) title.setAttribute('lang', 'en');
    var after = '';
    if (voice) after += '<p class="um-pvoice">' + esc(voice) + '</p>';
    if (tagline) after += '<p class="um-ptag">' + esc(tagline) + '</p>';
    title.insertAdjacentHTML('afterend', after);
    var price = $('[data-testid="store-product-price"]');
    var hoodie = isHoodie(title.textContent), girls = GIRLS.test(title.textContent), sc = sizeChart(hoodie);
    if (price) {
      var extra = '<p><span class="um-pchip">' + (girls ? t('\u0642\u0635\u0651\u0629 \u0648\u0627\u0633\u0639\u0629', 'Oversized fit') : t('\u064a\u0648\u0646\u064a\u0633\u0643\u0633\u060c \u0642\u0635\u0651\u0629 \u0648\u0627\u0633\u0639\u0629', 'Unisex, oversized fit')) + '</span></p>';
      if (colour) extra += '<div class="um-pcolour"><span>' + t('\u0627\u0644\u0644\u0648\u0646:', 'Colour:') + ' <b>' + esc(colour) + '</b></span>' + (COLOURS[colour] ? '<i style="--c:' + COLOURS[colour] + '" aria-hidden="true"></i>' : '') + '</div>';
      price.insertAdjacentHTML('afterend', extra);
    }
    // the description moves into \u00ab\u0639\u0646 \u0647\u0630\u0627 \u0627\u0644\u0635\u0648\u062a\u00bb
    var aboutHtml = box ? box.innerHTML : '';
    if (box) box.classList.add('um-pdesc-done');
    // fold-outs + share, after the form
    var chart = '<table class="um-chart"><thead><tr><th>' + t('\u0627\u0644\u0645\u0642\u0627\u0633', 'Size') + '</th>' + sc.cols.map(function (c) { return '<th>' + c + t(' (\u0633\u0645)', ' (cm)') + '</th>'; }).join('') + '</tr></thead><tbody>' +
      sc.sizes.map(function (s, k) { return '<tr><td lang="en">' + s + '</td>' + sc.cm[k].map(function (v) { return '<td>' + v + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
    var fitWords = !hoodie ? t('\u0642\u0635\u0651\u0629 \u0648\u0627\u0633\u0639\u0629 (Oversized) \u0628\u0646\u0641\u0633 \u0627\u0644\u0645\u0642\u0627\u0633\u0627\u062a \u0644\u0644\u0628\u0646\u0627\u062a \u0648\u0627\u0644\u0634\u0628\u0627\u0628. \u0627\u062e\u062a\u0631 \u0645\u0642\u0627\u0633\u0643 \u0627\u0644\u0645\u0639\u062a\u0627\u062f \u0644\u0644\u0651\u0628\u0633\u0629 \u0627\u0644\u0648\u0627\u0633\u0639\u0629\u060c \u0623\u0648 \u0623\u0635\u063a\u0631 \u0628\u0645\u0642\u0627\u0633 \u0644\u0648 \u062a\u0628\u064a\u0647 \u0623\u0642\u0631\u0628 \u0644\u0644\u062c\u0633\u0645.', 'One oversized cut, the same sizes for everyone. Take your usual size for a loose fit, or one down for a closer one.')
      : girls ? t('\u0647\u0648\u062f\u064a \u0628\u0642\u0635\u0651\u0629 \u0648\u0627\u0633\u0639\u0629\u060c \u0645\u0646 S \u0625\u0644\u0649 XXL. \u0627\u062e\u062a\u0627\u0631\u064a \u0645\u0642\u0627\u0633\u0643 \u0627\u0644\u0645\u0639\u062a\u0627\u062f \u0644\u0644\u0651\u0628\u0633\u0629 \u0627\u0644\u0648\u0627\u0633\u0639\u0629\u060c \u0623\u0648 \u0623\u0635\u063a\u0631 \u0628\u0645\u0642\u0627\u0633 \u0644\u0648 \u062a\u0628\u064a\u0646\u0647 \u0623\u0642\u0631\u0628 \u0644\u0644\u062c\u0633\u0645.', 'An oversized hoodie, S to XXL. Take your usual size for a loose fit, or one down for a closer one.')
      : t('\u0647\u0648\u062f\u064a \u0628\u0642\u0635\u0651\u0629 \u0648\u0627\u0633\u0639\u0629\u060c \u0628\u0646\u0641\u0633 \u0627\u0644\u0645\u0642\u0627\u0633\u0627\u062a \u0644\u0644\u0628\u0646\u0627\u062a \u0648\u0627\u0644\u0634\u0628\u0627\u0628\u060c \u0645\u0646 S \u0625\u0644\u0649 XXL. \u0627\u062e\u062a\u0631 \u0645\u0642\u0627\u0633\u0643 \u0627\u0644\u0645\u0639\u062a\u0627\u062f \u0644\u0644\u0651\u0628\u0633\u0629 \u0627\u0644\u0648\u0627\u0633\u0639\u0629\u060c \u0623\u0648 \u0623\u0635\u063a\u0631 \u0628\u0645\u0642\u0627\u0633 \u0644\u0648 \u062a\u0628\u064a\u0647 \u0623\u0642\u0631\u0628 \u0644\u0644\u062c\u0633\u0645.', 'An oversized hoodie, the same sizes for everyone, S to XXL. Take your usual size for a loose fit, or one down for a closer one.');
    var folds = el('div', 'um-folds',
      (aboutHtml ? '<details><summary>' + t('\u0639\u0646 \u0647\u0630\u0627 \u0627\u0644\u0635\u0648\u062a', 'About this voice') + '</summary><div class="um-fbody">' + aboutHtml + '</div></details>' : '') +
      '<details id="um-size"><summary>' + t('\u0627\u0644\u0645\u0642\u0627\u0633\u0627\u062a \u0648\u0627\u0644\u0642\u0635\u0651\u0629', 'Sizes and fit') + '</summary><div class="um-fbody"><p>' + fitWords + '</p>' + chart + '</div></details>');
    form.parentNode.insertBefore(folds, form.nextSibling);
    var share = el('button', 'um-share', t('\u0634\u0627\u0631\u0643 \u0647\u0630\u0627 \u0627\u0644\u0635\u0648\u062a', 'Share this voice'));
    share.type = 'button';
    share.addEventListener('click', function () {
      var data = { title: title.textContent.trim(), text: voice ? voice + (tagline ? ': ' + tagline : '') : tagline, url: location.href.split('#')[0] };
      if (navigator.share) navigator.share(data).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(data.url).then(function () { share.textContent = t('\u0646\u0633\u062e\u0646\u0627 \u0627\u0644\u0631\u0627\u0628\u0637.', 'Link copied.'); });
    });
    folds.parentNode.insertBefore(share, folds.nextSibling);
  }

  /* product list pages (VOLUME 01): the name as a poster title with the store's swoosh, the sort beside it as a pill.
     Raed's own title row (it turns the name into \u00ab\u0623\u0643\u062b\u0631 \u0645\u0646 15 \u0645\u0646\u062a\u062c\u00bb) steps aside. */
  function listing() {
    if (!document.body.classList.contains('product-index')) return;
    var main = $('.container--products-list .main-content');
    if (!main || $('.um-plp-head', main)) return;
    var name = document.title.split('|')[0].trim() || (($('#page-main-title') || {}).textContent || '').trim();
    var head = el('header', 'um-plp-head',
      '<div class="um-plp-name"><h1 class="um-plp-title"' + (/^[\x00-\x7F]+$/.test(name) ? ' lang="en"' : '') + '>' + esc(name) +
      '<svg class="um-plp-line" viewBox="0 0 420 44" preserveAspectRatio="none" aria-hidden="true"><path class="um-plp-line-shadow" d="M14 34C120 22 260 16 404 18"/><path d="M10 28C116 16 256 10 400 12"/></svg></h1>' +
      (/^VOLUME/i.test(name) || location.pathname.indexOf('/c' + ALL_CAT) >= 0 ? '<p class="um-plp-sub">' + t('\u0643\u0644 \u062a\u064a\u0634\u064a\u0631\u062a \u0647\u0646\u0627 \u0644\u0647 \u0635\u0648\u062a \u0648\u0644\u0647 \u0634\u062e\u0635\u064a\u0629. \u0627\u062e\u062a\u0631 \u0627\u0644\u0644\u064a \u064a\u0634\u0628\u0647\u0643.', 'Every tee here has a voice and a character. Pick the one that sounds like you.') + '</p>' : '') + '</div>');
    var old = $('#page-main-title') && $('#page-main-title').parentElement;
    var sort = $('#product-filter');
    var tools = sort && sort.parentElement && sort.parentElement.parentElement;
    if (tools && old && old.contains(tools)) { tools.classList.add('um-plp-sort'); head.appendChild(tools); }
    if (old) old.classList.add('um-plp-old');
    main.insertBefore(head, main.firstChild);
    document.body.classList.add('um-plp');
  }

  /* product cards: the tee's voice under its name (from its description) */
  function cards() {
    $$('custom-salla-product-card').forEach(function (c) {
      if ($('.um-cvoice', c) || c.hasAttribute('data-um-plain') || !c.product) return;
      var a = $('.s-product-card-content-title a', c);
      if (!a) return;
      var v = voiceOf(c.product).voice;
      if (!v) { c.setAttribute('data-um-plain', ''); return; }
      a.parentElement.insertAdjacentHTML('afterend', '<p class="um-cvoice">' + esc(v) + '</p>');
    });
  }

  /* product cards: on hover the tee turns round to its other photo (the first one after its main photo that isn't a
     \u00ab\u0634\u0645\u0627\u0639\u0629\u00bb photo). Only where there's a mouse; the photo list is asked for when the card is about to show. */
  var hoverable = !!(window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches);
  var flipIO = hoverable && window.IntersectionObserver ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      flipIO.unobserve(en.target);
      var c = en.target, pic = $('.s-product-card-image', c), front = pic && $('a img', pic);
      if (!c.product || !front || en.boundingClientRect.width < 60) return;
      photosOf(c.product.id).then(function (imgs) {
        // a back-first tee shows its back on the card, so the hover brings its main photo, the front
        // a hoodie's card shows its model photo (hoodieCard), so the hover brings the hoodie by itself, the print side
        var other = isHoodie(c.product.name) ? flatPrint(imgs, c.product.name)
          : backFirst(c.product.id) ? imgs.filter(function (i) { return i.url && i.main; })[0]
          : imgs.filter(function (i) { return i.url && !i.main && !i.video_url && !HANGER.test(i.alt || ''); })[0];
        if (!other || $('.um-cback', pic)) return;
        var back = el('img', 'um-cback um-face-back');
        back.alt = '';
        back.src = other.url;
        back.setAttribute('data-um-url', other.url);
        sharpen(back, other.url);
        front.classList.add('um-face');
        front.parentNode.appendChild(back);
        pic.classList.add('um-turn');
      });
    });
  }, { rootMargin: '300px' }) : null;
  function flips() {
    if (!flipIO) return;
    $$('custom-salla-product-card:not([data-um-flip])').forEach(function (c) {
      if (!c.product) return;
      c.setAttribute('data-um-flip', '');
      flipIO.observe(c);
    });
  }

  /* info pages (\u0627\u0644\u0634\u062d\u0646 \u0648\u0627\u0644\u062a\u0648\u0635\u064a\u0644\u060c \u0627\u0644\u0627\u0633\u062a\u0628\u062f\u0627\u0644 \u0648\u0627\u0644\u0627\u0633\u062a\u0631\u062c\u0627\u0639\u060c \u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629): the Twilight theme's policies look (its js/unmuted/page.js).
     The text written in Salla is regrouped: what comes before the first h2 is the lead under the big title, every h2 opens
     one bold card (shipping, exchange and privacy get their colour, icon and sticker), a list whose points start in bold
     becomes the fact tiles, h3 + list pairs sit side by side as yes / no lists, two or more cards get a pill nav. */
  var ICON = {
    truck: '<path d="M3 6.5h11v9H3zM14 9.5h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    swap: '<path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2.5"/>',
    sound: '<path d="M4 9.5h4l5-4v13l-5-4H4zM16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/>',
    yes: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    no: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'
  };
  var svg = function (name) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICON[name] + '</svg>'; };
  // the store's three topics; any other heading gets the next colour of the rotation (brand book: ink, cream, blue, orange)
  var TOPICS = [
    { id: 'shipping', re: /\u0634\u062d\u0646|\u062a\u0648\u0635\u064a\u0644|shipping|delivery/i, c: 'var(--um-orange)', icon: 'truck', sticker: ['\u0641\u064a \u0627\u0644\u0637\u0631\u064a\u0642 \u0644\u0643', 'On its way'], s: 'var(--um-blue)', nav: ['\u0627\u0644\u0634\u062d\u0646', 'Shipping'] },
    { id: 'exchange', re: /\u0627\u0633\u062a\u0628\u062f\u0627\u0644|\u0627\u0633\u062a\u0631\u062c\u0627\u0639|\u0625\u0631\u062c\u0627\u0639|\u0627\u0631\u062c\u0627\u0639|exchange|return|refund/i, c: 'var(--um-blue)', icon: 'swap', sticker: ['\u0627\u0644\u0645\u0642\u0627\u0633 \u0645\u0627 \u0636\u0628\u0637\u061f', 'Wrong size?'], s: 'var(--um-orange)', nav: ['\u0627\u0644\u0627\u0633\u062a\u0628\u062f\u0627\u0644', 'Exchange'] },
    { id: 'privacy', re: /\u062e\u0635\u0648\u0635\u064a|\u0628\u064a\u0627\u0646\u0627\u062a\u0643|privacy/i, c: 'var(--um-blue)', dark: true, icon: 'lock', sticker: ['\u0628\u064a\u0627\u0646\u0627\u062a\u0643 \u0644\u0643', 'Your data stays yours'], s: 'var(--um-orange)', nav: ['\u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629', 'Privacy'] }
  ];
  var ROTATION = ['var(--um-orange)', 'var(--um-blue)'];
  // a heading that says what we *don't* do turns its list into crosses
  var NEGATIVE = /(^|[\s\u060c,])(\u0645\u0627|\u0644\u0627|\u0644\u0646|\u0645\u0648|\u0645\u0645\u0646\u0648\u0639|not|never|don['\u2019]t|won['\u2019]t)([\s\u060c,:]|$)/i;
  var kids = function (n) { return Array.prototype.slice.call(n.childNodes); };
  var isBlank = function (n) { return n.nodeType === 3 ? !n.textContent.trim() : n.nodeType !== 1; };
  var isList = function (n) { return !!n && n.nodeType === 1 && (n.tagName === 'UL' || n.tagName === 'OL'); };
  var isBold = function (n) { return !!n && n.nodeType === 1 && /^(STRONG|B)$/.test(n.tagName); };
  var leadsWithBold = function (li) { return isBold(kids(li).filter(function (n) { return !isBlank(n); })[0]); };

  // a list whose every point starts in bold \u2192 the fact tiles (bold = the fact, the rest = its note)
  function facts(list) {
    var ul = el('ul', 'um-info-facts');
    Array.prototype.slice.call(list.children).forEach(function (li) {
      var strong = Array.prototype.slice.call(li.children).filter(isBold)[0], tile = el('li'), b = el('b'), note = el('span');
      b.textContent = strong.textContent.trim();
      strong.remove();
      kids(li).forEach(function (n) { note.appendChild(n); });
      if (note.firstChild && note.firstChild.nodeType === 3) note.firstChild.textContent = note.firstChild.textContent.replace(/^[\s:\u060c,\u2013\u2014-]+/, '');
      tile.appendChild(b);
      if (note.textContent.trim()) tile.appendChild(note);
      ul.appendChild(tile);
    });
    return ul;
  }

  function infoCard(title, nodes, i) {
    var text = (title ? title.textContent : '') + ' ' + nodes.map(function (n) { return n.textContent; }).join(' ').slice(0, 200);
    var topic = TOPICS.filter(function (x) { return x.re.test(title ? title.textContent : ''); })[0] || (title ? null : TOPICS.filter(function (x) { return x.re.test(text); })[0]);
    var card = el('section', 'um-info-card' + (topic && topic.dark ? ' is-dark' : ''));
    card.style.setProperty('--c', topic ? topic.c : ROTATION[i % ROTATION.length]);
    card.id = topic ? topic.id : 'part-' + (i + 1);
    if (topic) {
      var st = el('span', 'um-info-sticker');
      st.setAttribute('aria-hidden', 'true');
      st.textContent = t(topic.sticker[0], topic.sticker[1]);
      st.style.setProperty('--s', topic.s);
      card.appendChild(st);
    }
    if (title) {
      var head = el('div', 'um-info-head', '<span class="um-info-icon">' + svg(topic ? topic.icon : 'sound') + '</span>');
      head.appendChild(title);
      card.appendChild(head);
    }
    // h3 + list pairs \u2192 yes / no lists, side by side when there are two or more
    var split = null;
    for (var k = 0; k < nodes.length; k++) {
      var n = nodes[k];
      if (isBlank(n)) continue;
      if (n.nodeType === 1 && /^H[3-6]$/.test(n.tagName)) {
        var j = k + 1;
        while (j < nodes.length && isBlank(nodes[j])) j++;
        if (isList(nodes[j])) {
          var no = NEGATIVE.test(n.textContent), box = el('div', 'um-info-list ' + (no ? 'is-no' : 'is-yes')), h3 = el('h3'), ul = el('ul');
          kids(n).forEach(function (c) { h3.appendChild(c); });
          Array.prototype.slice.call(nodes[j].children).forEach(function (li) { li.insertAdjacentHTML('afterbegin', svg(no ? 'no' : 'yes')); ul.appendChild(li); });
          box.appendChild(h3);
          box.appendChild(ul);
          if (!split) { split = el('div', 'um-info-split'); card.appendChild(split); }
          split.appendChild(box);
          k = j;
          continue;
        }
      }
      split = null;
      if (isList(n) && n.tagName === 'UL' && n.children.length && Array.prototype.slice.call(n.children).every(leadsWithBold)) { card.appendChild(facts(n)); continue; }
      card.appendChild(n);
    }
    return { card: card, topic: topic, label: topic ? t(topic.nav[0], topic.nav[1]) : (title ? title.textContent.trim() : '') };
  }

  function info() {
    var page = $('.page-single .content--single-page');
    if (!page || page.classList.contains('um-info')) return;
    var title = $('h1', page), body = $('.content-entry', page);
    if (!title || !body) return;
    page.classList.add('um-info');
    var hero = el('header', 'um-info-hero');
    page.insertBefore(hero, title);
    hero.appendChild(title);
    try {
      // the lead (before the first h2) and one group per h2
      var lead = [], groups = [], cur = null;
      kids(body).forEach(function (n) {
        if (n.nodeType === 1 && n.tagName === 'H2') { cur = { title: n, nodes: [] }; groups.push(cur); }
        else if (cur) cur.nodes.push(n);
        else lead.push(n);
      });
      // a page with no h2: one card, headed by the page's own title
      if (!groups.length) {
        var h = el('h2');
        h.textContent = title.textContent.trim();
        groups.push({ title: h, nodes: lead.splice(0) });
      }
      var cards = groups.map(function (g, i) { return infoCard(g.title, g.nodes, i); });
      body.textContent = '';
      cards.forEach(function (c) { body.appendChild(c.card); });
      if (lead.some(function (n) { return !isBlank(n); })) {
        var l = el('div', 'um-info-lead');
        lead.forEach(function (n) { l.appendChild(n); });
        hero.appendChild(l);
      }
      if (cards.length > 1) {
        var nav = el('nav', 'um-info-nav');
        nav.setAttribute('aria-label', t('\u0623\u0642\u0633\u0627\u0645 \u0627\u0644\u0635\u0641\u062d\u0629', 'On this page'));
        cards.forEach(function (c) {
          var a = el('a', '', svg(c.topic ? c.topic.icon : 'sound'));
          a.href = '#' + c.card.id;
          a.style.setProperty('--c', c.card.style.getPropertyValue('--c'));
          a.appendChild(document.createTextNode(c.label));
          nav.appendChild(a);
        });
        hero.appendChild(nav);
      }
      // the closing call to shop
      var end = el('div', 'um-info-end', '<p>' + t('\u062c\u0627\u0647\u0632 \u062a\u062e\u062a\u0627\u0631 \u0635\u0648\u062a\u0643\u061f', 'Ready to pick your voice?') + '</p>');
      var go = el('a', 'um-info-btn', t('\u0634\u0648\u0641 \u0643\u0644 \u0627\u0644\u0623\u0635\u0648\u0627\u062a', 'See every voice'));
      go.href = allUrl();
      end.appendChild(go);
      page.insertBefore(end, body.nextSibling);
    } finally {
      body.classList.add('um-info-body');
      page.classList.add('is-ready');
    }
    // a link to \u2026#privacy arrives before the cards exist
    var target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target && body.contains(target)) target.scrollIntoView({ block: 'start' });
  }

  /* product photos in 4K: Salla keeps a product photo at 800x1000 at most, so a photo with a 4K copy in this repo
     (cdn/photos/, WebP, at a pinned commit) shows that copy in the gallery and the full-screen view; the thumbnails stay
     Salla's. The key is the name Salla gave the uploaded file (the last part of its address). A gallery photo turns 4K
     once its copy has loaded, the one showing and its neighbours first, so a slow or missing copy changes nothing. */
  var PHOTOS = 'https://cdn.jsdelivr.net/gh/unmutedsa/unmuted-raed@d75c2a0d63544c59fbe13802f990776c11839ea1/cdn/photos/';
  var HD = {
    'KCxVydtTSY0sxjibvNIK6TV9abolDW1qFBs5SUQe': 'carnival/man-back.webp',
    'mnVpym2DlRAv3SdlP4Wk8hv0I1LxFSrOt3tchbOD': 'carnival/man-front.webp',
    'VtcyHU0lRCLLx6Mudha0s9Buy9548bbV1nxi6vzu': 'carnival/man-side.webp',
    'yNFjOqv11kDABEIURxhgADQo95mLqKux5An3AEpf': 'carnival/woman-back.webp',
    'sbYGoXLxYzRLpiAq1yQ757J8Bm87aiiGuUfwPhov': 'carnival/woman-front.webp',
    'sx6YILleOPJ5wgYZ9Zjki6TNOFLPRt92LSsMI4ck': 'carnival/woman-side.webp',
    'PLaV5nDdBQ0EC79NzFlAv3I6cb6RMdnszgaGgAje': 'love-pop/man-back.webp',
    'nyk2sG0FyACeYvX1BMPliqGzUKisWEG7tB3fZIPK': 'love-pop/man-front.webp',
    'cOaqa0zLAbArwvWbTwbpG3UP8s8CkMrYEYze9G1k': 'love-pop/man-side.webp',
    'Pkstgq769UzN2wLwIzFhJxOaM2tL2VwQd9jOWtBn': 'love-pop/woman-back.webp',
    'ZZw4TgvH2aC4lgXS4foR1rCCbv1RDWqWQSjbHteA': 'love-pop/woman-front.webp',
    'LcE9N1gnMDplV5bP1j0AtX7Zol6bNe99YzC0V1P9': 'love-pop/woman-side.webp',
    'VuH1UxxlKqIqzO1RHKH5wLtbTgdeMH3WyOYD5QbD': 'good-mood/man-back.webp',
    'D28HlCBnnU9ZhyPE35J8ZAQGDmiBVKEebR83FVQZ': 'good-mood/man-front.webp',
    'du1FtJgEdmyhEWNGQDWwSmOYDxEsGXYEMO6dwCW6': 'good-mood/man-side.webp',
    'TchsG1GPu4iBWbUSITYNNKUn6F0oNNdoqC3aZrIw': 'good-mood/woman-back.webp',
    'IQ4U12V6xaifhHGhYV1RdR2SNP4DnIs9f5Apr65T': 'good-mood/woman-front.webp',
    '9VjkDxkzAnAMyuK2O43QxTyuWl19qVV062WnCQQs': 'good-mood/woman-side.webp',
    'zEVSb3k8lpTkoAEmd5zZLG2I8hcKUeSh8qb8ESVM': 'cherry-market/man-back.webp',
    'vdnrBdiJ9eRQGe30FrHqZijqYubu80nCaUhNCm6B': 'cherry-market/man-front.webp',
    'TDfeJIfkbSDssKsocQS4ZalirugGWIPgBBoqWHLY': 'cherry-market/man-side.webp',
    'h89TXxyhNdMGUip5pbzqi9HWKTGu3w7KaIaEEWXU': 'cherry-market/woman-back.webp',
    '97ogpAOKZhHi3yTt0OKonzwGbmcQgqOFu64MFzNd': 'cherry-market/woman-front.webp',
    'ztoy4YILmeJToCPx2EmMKk88FLkjY8MDOzmjOGEG': 'cherry-market/woman-side.webp',
    'TjjVlhy1bcG3CNuIvO64AQjhx05mv86CZybQx8Ld': 'caution/man-back.webp',
    'jdjzJrUgXHyZC6fXMg26gfblxKnQZGpwJJnvdejC': 'caution/man-front.webp',
    '7m1mR1Ys0qjOJObF6DU7UOq2eFjp9TbldG0465Ug': 'caution/man-side.webp',
    'zUHqaq3ZoUwEmTAwZvEyqBKg4yVECiRNUSMdyGhf': 'caution/woman-back.webp',
    'wCrpAN1fHtNr9eVYkD0s43CUUwE9IIBU1Z6u8T72': 'caution/woman-front.webp',
    'WUNd2Rn6DCKsY5th4BO1XUN4yscObuyU21H3ooza': 'caution/woman-side.webp',
    '6pgJ2tDxrLYRPSnjYkBU3smxoRdwBMiqdEuSrmqs': 'play-unmuted/man-back.webp',
    rtdSBUtx7AeK22If2RLe9LgJRG43lxQzEUGYmqm5: 'play-unmuted/man-front.webp',
    V9n4VlOyPcGnY0WkBlnjk2C2LQ9AYlfQQ9mUrGHW: 'play-unmuted/man-side.webp',
    HjIxMZqOBaQkPq9ch6xCi2S7nLBpxVYXaxOS5RCG: 'play-unmuted/woman-back.webp',
    NGlg8TsAh4W7ZfinnPwKyDVbfgxZqhZ9h0BtU1XO: 'play-unmuted/woman-front.webp',
    AX1CZt0G4t1cJ9KUqhOzuQ9IP7Yi87yNXHxaEBSf: 'play-unmuted/woman-side.webp',
    'c7YSOqqwZtK3AHtd8RJifSZTsjJ63kTstGYKf5GQ': 'vending/man-back.webp',
    'K4T13dBbrT99yrpiPbPb4J4MUsKqHmeJiJNRonPz': 'vending/man-front.webp',
    '4L1hB8FfOlPhzARY52Uea8BouBaKPU6IEajq8Z8l': 'vending/man-side.webp',
    'owUNJiLdG7qUU0DxaE6X1tGeCGlxtV6iGuPKmymF': 'vending/woman-back.webp',
    'uiznJQ26BvAytFIOz76Qr5goY3J7CGniY8yDg1FZ': 'vending/woman-front.webp',
    'aYd9Wcrbr18u7djb5mZ8a3gEiwpgm9qrSloHzomI': 'vending/woman-side.webp',
    '0mHsiNaxfp3SAO61Ty35MHy4wLcvhURZscCHB0Gb': 'call-me/man-back.webp',
    '6KGfT4nhFgjbjCvyNsQhn1ZMCjfoiEB9nU8v8Ic6': 'call-me/man-front.webp',
    '3XI68GY7KqJXCUmsw9eOvlQfJNlQb8kxKgmNhgBW': 'call-me/man-side.webp',
    htVip9wTpzTdD0Ky4fRX1BFLVaYWeN5WCiPb9Kvs: 'call-me/woman-back.webp',
    SC9lADMT2f1QUc3q6gbxjo8oPKFmDnUxg6uOY2cA: 'call-me/woman-front.webp',
    UqlgDBwCZUqyb6USFGAy2ZEiFm7QCQXNUrZMTmZb: 'call-me/woman-side.webp',
    '1aacx7I1XKP9vQuZBR2IVC0lAUEsJY4s9ELfSukn': 'kashta/man-back.webp',
    'ijSc7XleslqoKtjl83npgwxsv95hWXqQJnhkqFXS': 'kashta/man-front.webp',
    'VzJTgnkZh4B1aP5WUHoKgSP8MRX6Yi2iF4qLJFKD': 'kashta/man-side.webp',
    'J2sBdzRJswvMVEIVDds3U3QY4IH9fw4Hj35s6zco': 'kashta/woman-back.webp',
    'FGNFbHMi6Cvw9IswsHO0WhZNmqRYsrUlqPegmci6': 'kashta/woman-front.webp',
    'mYVJHZCMaemfktgxjJ6fQ4K8yCYYSfuntnbvPmn8': 'kashta/woman-side.webp',
    'cdzmB9KZG4FnYu9KB1hYM1vwb1tTU81fh1obJhbb': 'the-original/man-back.webp',
    'pCCKZBqvvN0QcfQ59emtjbmdMfDVVi2oYqib0FMt': 'the-original/man-front.webp',
    'dDbOf9Du8jCeOYYCsHlQDzJ25ud9GqE4bHLbspao': 'the-original/man-side.webp',
    '84KyCAiBThqsDwskwtaCFUscvy3hhEbVQhoktNI3': 'the-original/woman-back.webp',
    'hzscXtxRkR0jUuhU0mUy1vtkSQGERL46mkh8WQQ1': 'the-original/woman-front.webp',
    'NtymVFnBgTncpeGUVlB7DWeAz41GVc9L1X2VN1tZ': 'the-original/woman-side.webp',
    wLxIAmv0HIzn5xqhNLWXqAIEeRi3yV1jfKZfvvAo: 'megaphone/man-back.webp',
    ARRbVpEGJG3NPpr80AiqcizSlt3qT4x9n0HlYBlE: 'megaphone/man-front.webp',
    '5xUGSe1MKNutRzta7fB4RC5ngUgQycfHgEJxSQ9t': 'megaphone/man-side.webp',
    ikNdUKZWPssiilRsiOrdg7pPaelqTZh7bNEmr41f: 'megaphone/woman-back.webp',
    N9gENW2Ikl1zQALK2okXvNq6rAVZdTggoQnsYHmR: 'megaphone/woman-front.webp',
    DGNgn8aRmqtYHJj6N5Re1YvLYFNeL8gENo2XZfH0: 'megaphone/woman-side.webp',
    IUOB5Cyqi4rKu11pWBXaySTyKKu9Rl5j2CuXDzhs: 'ice-cream/man-back.webp',
    zbLKKo43r6hyfdZmixY4CBIDCU4jFfGvtWvybduH: 'ice-cream/man-front.webp',
    UCsvHqpCzOhG95Xe5pm3ra4grTOEAZzTvuR81Uky: 'ice-cream/man-side.webp',
    '0jYixIp7B7ikRq8QAJa49FGE0itgaSmEbBkSkIFL': 'ice-cream/woman-back.webp',
    QXzOQsGfc6AXG2Phx4H7yPuMME4Xb1diQ8bU27EB: 'ice-cream/woman-front.webp',
    '84qARGh1t2UWsMXFMUrjmdv0PxkhwUU83WAHzmKB': 'ice-cream/woman-side.webp',
    'nmbz2wFuKIxFGA1ODAbsJ5VZXIH9xqx04dlh2WNv': 'unmuted-sticker/man-back.webp',
    'Z9fV6TZueSsu4AG7TsI8hztLcjcD81gHCQIWaLJZ': 'unmuted-sticker/man-front.webp',
    'TILQlNlBRwxQ7Sg2SvexPN71lwdJocN3lQynMiNI': 'unmuted-sticker/man-side.webp',
    'M1X8CAbxGe94FUDI1IkKAhUDyoj8QUMDXk6jqHbe': 'unmuted-sticker/woman-back.webp',
    'owzor2jNJYqchLZYdp0VFUPpoTW8Las896HIZeCJ': 'unmuted-sticker/woman-front.webp',
    '42J5KBOy9oVp3Bw6YWH3deFTLOBIkCLrMYSZwfea': 'unmuted-sticker/woman-side.webp',
    'pecjral6oR8jx3eYZWHNIjHDMv68KIOozIrPJhNy': 'riyadh/man-back.webp',
    '5iVppEC5XQzGhi3h40tj3Yawj2sCd0v4QqgXvzAL': 'riyadh/man-front.webp',
    'Sdxz4BdFTDWOTBzKpYagn4mA76eAVtm4VFVDUuJJ': 'riyadh/man-side.webp',
    'fLovBBpZ7RtPQYbpKDzcHVbtEHDsFgXux7RPC1sz': 'riyadh/woman-back.webp',
    'Y7MxGU8Y74fSU5WKIiD4KE1L8W034OGFstc4aac5': 'riyadh/woman-front.webp',
    'My1LggIf3pQ4Rip0qVqoBJIXjnBhQGlGdEycwGmv': 'riyadh/woman-side.webp',
    'DI8ThdrnJIxkLdtVeALSmo6TP6geKxFYSrAO6XSt': 'dates-season/man-back.webp',
    'hdhFnRBjYDZJ5jOEdchpA90TSS21ohv6vh9RZP6S': 'dates-season/man-front.webp',
    'x9RyYYX6di00d5xsmwgFgARbkXh3JjZRl6O60HgN': 'dates-season/man-side.webp',
    'AY9edKS8pPidZevGzgKmA1XY9yBs2OtN1P016DfP': 'dates-season/woman-back.webp',
    'HAuq94AId4ea0yAG0lZ1wTFaUuFxIQhhQhL1snZy': 'dates-season/woman-front.webp',
    'f5szBaSyCnJfxVkW2HYdj34trLhwrFfb3jbmwjla': 'dates-season/woman-side.webp',
    'kjTPUzNPJfDgjLcmrGWLjECMwoHM26nUl5vqVbPg': 'desert-club/man-back.webp',
    'vZhsdlcYqGzcTJoy5zDS6W0nU80pbeaty0kjejyT': 'desert-club/man-front.webp',
    '6vGiCRY1cuVUo3bPwfNi8UsS4IxlVFCKFMgBcMkH': 'desert-club/man-side.webp',
    'sH3xDKcTB4e6qT9GeEqSMy2WAS3scfDLRy4JimXy': 'desert-club/woman-back.webp',
    'aOjwTZVMN5xmnsOCMQxgGOlmIbfFDblcE9LcVAxf': 'desert-club/woman-front.webp',
    'tdqKFKz0dmsSwuXBBAs1CLgXmkI9voN8lbZ90une': 'desert-club/woman-side.webp',
    '87NjmmSDRfAZ9t0ktVCut9eMQFKAHitTtm9GBEsF': 'just-padel/man-back.webp',
    'uKnX2eTiWBEczfm0yxyY4WuzAhT6iOhUYHRaYKv8': 'just-padel/man-front.webp',
    'a9Ojh9NwWHNW3wAoZPCQ1hzYqYIDDt5GBLMPGhYM': 'just-padel/man-side.webp',
    'Aw0PF9KKQUYNfN9CAVsOvRgq7QdMCO72y4gGcDN3': 'just-padel/woman-back.webp',
    'Eq5QbP95pYVqXb66JPreJyR48erwrVXfb5bny5PX': 'just-padel/woman-front.webp',
    '52qdamr1R3z4Pz2yDlGYlmbAXv52wDrAL2vLaca6': 'just-padel/woman-side.webp',
    Y2YU24YFhlI3CmH2Bm28udWKYE5iELbG3jNxlico: 'caution/alone-front.webp',
    '0Q2B8NZxRa6XN28DmUbwNsbuREvAtoylJipQ777J': 'caution/alone-back.webp',
    'WfOYB96Bubsn4nPvD1y4N2TwjQQ56FqBVVvWj018': 'desert-club/alone-front.webp',
    'rZVQeeCwVEMq0NyCvTXcGIFt4SIDiwAlfky1uZDh': 'desert-club/alone-back.webp',
    'c7LZUyOo7StMOnNbR4NmSRKt9DVRyrFNdwFE4tZe': 'riyadh/alone-front.webp',
    'qskU2ehlhPTdA634KCHzMbtzaZwCevjPv2nTE41p': 'riyadh/alone-back.webp',
    'sELIOvyCKiSuW9g2BwnHre346IoXd5RAc5qNzNcq': 'unmuted-sticker/alone-front.webp',
    'Ub59s2TOYdUouYEY9bGHyYCcaClT2bfW9PSfmkLl': 'unmuted-sticker/alone-back.webp',
    'KtyNvRrRasc5RsE9QOczVIELCfkBDlg9UJuS1NpK': 'dates-season/alone-front.webp',
    'kwSCUjzRiax57wvIubRf3SmGev6vt7cG5aRI77ca': 'dates-season/alone-back.webp',
    'kVDLjAZmSLh6X76RIEtKO34ISI7h6FIsDFiwnHQo': 'just-padel/alone-front.webp',
    '9GcYEaylOvlsMAlMg2rhYvTEFbgYPYZrQg6u7Kvh': 'just-padel/alone-back.webp',
    'jOX2EgsdodR4YmYEQtm25DaD8dw6hzXy6ME2kyFM': 'love-pop/alone-front.webp',
    'sPCoLWXbYoeA4UqtpqQVjHKtcElkGF53vLoejLfj': 'love-pop/alone-back.webp',
    'jQ8Al1VzwyehEC7jp33AlzvqsmPayhtqWLmzQf1L': 'carnival/alone-front.webp',
    'mKkt7TYkoYEzWKklUNoQhUuejpJjEsYbP7KYa8Eg': 'carnival/alone-back.webp',
    'U5Pmt3lhPWzXY7riGUj4OtgNco2yE6JnbxOwBn1k': 'good-mood/alone-front.webp',
    'hirYTKBy1PRCgrwLfFDYlt23HORSohR97kAsqoeP': 'good-mood/alone-back.webp',
    'aG6bfHFeFf53Wd3pxtviLLHWg9EIm77ADSgsEEzf': 'cherry-market/alone-front.webp',
    '4Gto8X9ToONiyQFMM4zM0CFFNb8rx1FgUzgoaf6o': 'cherry-market/alone-back.webp',
    ygua2Tt1pynUhVktVXwgaw15RrKmoDsS12vjS1dN: 'play-unmuted/alone-front.webp',
    KYMpMZrzfMqDYOwpIOIuVYDfPQBUbOt5KmBd6ksk: 'play-unmuted/alone-back.webp',
    'OPEEgSl6EDHFJ59W7Jgf3o7ThyGglET5Sxa5wX1N': 'vending/alone-front.webp',
    'aDFFeOpa9IPgXR1Q9uK4HvckyUXGkrLqUo9I5fUk': 'vending/alone-back.webp',
    rgD2B9BIYT5JQScLKQ43Y6zCoa7Pr7vQuyJkZ5z7: 'call-me/alone-front.webp',
    jpsdRYhAFiJpZOqy7VuQYa7knDtJdKunjsCySIxw: 'call-me/alone-back.webp',
    'IJpofrxyWv1oZiEDsqB7vbti7V6OXP6AAOx4Fbjd': 'kashta/alone-front.webp',
    '4xQYZ57Uvv3U762fGDy6dFkkoMQo0Gnv5SklNiV4': 'kashta/alone-back.webp',
    'z3cgsk0gooVId5Duu8WwEz2L6dsaAkeNgh35N5QL': 'the-original/alone-front.webp',
    'VnO3gf8gpK0KCr6UndJEftcXzkL9dJK9gMKbDFoe': 'the-original/alone-back.webp',
    tEeeF5QsPxa0ReM7OizCbCylHEF59QU3yoiJCIcA: 'megaphone/alone-front.webp',
    uWWXA9gx5OuiJfWl1ItEo4RsUhAY0JXdHKBopF1z: 'megaphone/alone-back.webp',
    iZ8m9YdntMvoISTbJOj5iYqeBFty0cfk0J81Cx4G: 'ice-cream/alone-front.webp',
    Etz5XE1PB7xIaJIRqCGxGSoYWMW5tJFjou301Uzy: 'ice-cream/alone-back.webp',
    '7cFhze1Lt0lwcU97EHyBH3lLIXpM6dejflpnPge1': 'tape-green/alone-front.webp',
    'av8gfy99s0CnD62bdG0tSfxTFK9P5v8AVjP8buGR': 'tape-green/alone-back.webp',
    'Y8VHVoInodYbkec7cejxY58pAt4VBHPTRfB4yLLl': 'tape-green/man-back.webp',
    '9PMZWbXvYILvKTmySDaujus2yBAozpaW86VrM2uR': 'tape-green/man-front.webp',
    '6jEv7ddcUHP8GUQb91emx2hD33rwrgQqOnJo7Efv': 'tape-green/man-side.webp',
    'pKrsLGTsckc2Li4PpQe8mRF6eLHXj17Tk8R5Peda': 'tape-green/woman-back.webp',
    'thaMesOF9dIn7NYldbmf0am2uU2hbRrzfY28k1Io': 'tape-green/woman-front.webp',
    'Mqf1pPb799A9tv5oelWQ1OCCFT0QEYEFjvTwCWXw': 'tape-green/woman-side.webp',
    'yQmiwwJ40oJsFxPFDaLFv9WglnPs8CKdUDNWGeKQ': 'speakers/alone-front.webp',
    'Ve9iUHWH1ewAZRZGo0JwZKxotrn8Bu3ayR0qFccf': 'speakers/alone-back.webp',
    'eZ4wcwy2qEreZzAr3onRKiMZPtLocnrBgXgd70YA': 'speakers/man-back.webp',
    'L4zLYkucohImozDer1riTlVHz6JDPkcanebpuydz': 'speakers/man-front.webp',
    'fO1J9NxUpbVWmiJcP9GcOS9Tv6G8RyTg4N9vp1V8': 'speakers/man-side.webp',
    'Uxlq2xcA7TMOMgogIqQO7RgHdBTAY5g9bQsDs68q': 'speakers/woman-back.webp',
    '6Bzkk8ObWw36Ds8QKQZtFctLXaeAD6jQV5gqEzXQ': 'speakers/woman-front.webp',
    'fHbN3du0nHMdmbUvVAmGuCy8hYZlrn1v5qfmATLj': 'speakers/woman-side.webp',
    '4L32BywRvgxLvOeCRzWpYfg4jsKdnvqTpK8442PA': 'skateboard/alone-front.webp',
    'AZQCrW4RsyLTLLj10S771pO0NGm1zHdvAcfMX5rg': 'skateboard/alone-back.webp',
    'VCsfR56Fb5ddt1peChbV5bvqzw8urPJ9t3Y7WUHb': 'skateboard/man-back.webp',
    'DfKQGYS7eEd4cdENy28jF32CzQKzwc3qoYXNBKJU': 'skateboard/man-front.webp',
    'Lx316Gc7yRZ8kT0U4qqbgA5t4ZbmX5LfmwDUJQwu': 'skateboard/man-side.webp',
    'B095RHmEAOVnjVobaJbtThjLDgFcnvR0KERJJwTz': 'skateboard/woman-back.webp',
    'FBT0RdCY1iAYFbVTrl9X2M2tpk7vQ3Sowj8nfBRI': 'skateboard/woman-front.webp',
    'RIPf5FBatD8YHsudcxQjKu6zJjSxXvcpRbThfjW6': 'skateboard/woman-side.webp',
    'odFK9eaMLWm1PybGQ1xIbFoh92QBblPj0uBsUTfK': 'coffee-on-my-mind/alone-front.webp',
    'N6Y7U8GqF1cyXllwp6bkiPtL2guNf2qCYcRhkXrR': 'coffee-on-my-mind/alone-back.webp',
    'bLJknQGgiIj0j1beBDFfwnPsCKi9JAuuPcl2qgWj': 'coffee-on-my-mind/man-back.webp',
    'tP5W12mtOp0O0XIoMNKHI4jYo6glT9B4gQVcfoN1': 'coffee-on-my-mind/man-front.webp',
    'yiUL08NLVToCxOB90uoBXDg0BUKL9rQ754odKdgf': 'coffee-on-my-mind/man-side.webp',
    'JIyWO0igOqT0w8AXY6jgvcT35TccRVRBAIPElCUg': 'coffee-on-my-mind/woman-back.webp',
    '7psN3c1tQrm6JdXfT3jRXs88pwR91rwXwbTz1BwM': 'coffee-on-my-mind/woman-front.webp',
    'hTeViQCK74sougyENw9BdvgNGeOEfR1BPtzFBEYI': 'coffee-on-my-mind/woman-side.webp',
    'QxQPteOeIYhMmaaaGcxjtQzP8sHuHjNotuvWwERq': 'tape-yellow/alone-front.webp',
    'q76luxU4N6Oh8d7qh4sMaDtjPfdstmkmz5iVr1d5': 'tape-yellow/alone-back.webp',
    'DEYTfzcfHwpwEUPAmN3Syui0QCpeWxzAcTFKXkpw': 'tape-yellow/man-back.webp',
    'X1Vr0WXZDd1bQNy64H9owBGIlOW7a8lAMfQugGZI': 'tape-yellow/man-front.webp',
    'StLqX2lXKmM6fTgbkpfDYUy33YXP9raYf2m9Duh5': 'tape-yellow/man-side.webp',
    'kY9uOIJXmUqnS62kRtO3tEYAsVjjM7vkFdPIcmBc': 'tape-yellow/woman-back.webp',
    'mZrfy2b7bLusKqtAjsYMLQay1GzhzvmBTPWi6V6o': 'tape-yellow/woman-front.webp',
    '2hz7hX6WsFdrsyp8LiusvRLncI3szo3HMQHs70dm': 'tape-yellow/woman-side.webp',
    '3uEZmee5K4O08sL3zsq2ZnTYSSPsDFwepiQPrPOv': 'weekend-recovery-club/alone-front.webp',
    'i2iYCMSp2DaBuwsSYqN2dsAq46Fv4rKgn4a1I8DM': 'weekend-recovery-club/alone-back.webp',
    '5gnvbZMV5BsCNiM4JZMbid24CjhBZDVDvmAt1oPk': 'weekend-recovery-club/man-back.webp',
    'z6kqPj3CANIToYQeaK0XuwD6jgmZAT6YCfhEHHcM': 'weekend-recovery-club/man-front.webp',
    'X6VAzqIGtvVNSNDK7xwrhxiAXr0bM2sShxWqoCJ8': 'weekend-recovery-club/man-side.webp',
    'b0ebLW2mD6w5PALpY1X845WkrWzlojNO0ivS0zs3': 'weekend-recovery-club/woman-back.webp',
    'dKrAB2Xb46BbXumGXgRcgR0H379Vl6WOjGopmpKa': 'weekend-recovery-club/woman-front.webp',
    'rJxDur8mKgrgkPXDa4R4RPJYfmZ1N2hgzIKVnBLO': 'weekend-recovery-club/woman-side.webp',
    'WD5BWyxmDj2TsH9nHje5CGUTtSkpBnJ6wTgXzQ89': 'records/alone-front.webp',
    'kKBbbwtJs0yljhR32M93zROthZHx9KEEQI4VUIMB': 'records/alone-back.webp',
    '8wcazY64h5XBOvcS3qFmaLJI0MoBDYSYdtuD0oAd': 'records/man-back.webp',
    'lw5S7WNvdMMa7FtAsoKpZ8zSuz95fGzI9wZswP5W': 'records/man-front.webp',
    'rgiIRjGwZyracYCLNU4C2uI22RG0ICF4aP6hCTeR': 'records/man-side.webp',
    '5YWDo5aXH02EFABRu5mTydUtHT0oUxoMyFP86aET': 'records/woman-back.webp',
    'DAJMWCXP9H9nEkKI1KY81q1rq7TJZGSLngNwYx5C': 'records/woman-front.webp',
    'wHgr2KPW34vUswdq2MWs6WxFkioBQeHG90vViwAq': 'records/woman-side.webp'
  };
  // the winter hoodies' photos the same way (owner, 2026-11-22: \u00abi want the quality very high like the t-shirts\u00bb): Salla
  // keeps them at 720x900 and names them by a UUID; our copies are in the public repo unmutedsa/unmuted-winter
  // (photos/<hoodie>/<pose>.webp 3200x4000, md/ 1600x2000, sm/ 800x1000, on the page colour), apart from this repo,
  // which is near jsDelivr's 50 MB
  var WINTER_PICS = 'https://cdn.jsdelivr.net/gh/unmutedsa/unmuted-winter@4e39f647e337dbb648540b40526c2e4011b49b33/photos/';
  var WINTER_HD = {
    'c6d892ba-594f-4ac9-b167-5d114a96ebd4': 'after-hours/flat-back.webp',
    '66dc6a0c-2522-4189-9886-405149b4cf71': 'after-hours/flat-front.webp',
    '908e0ef7-339d-46e2-927f-570077775869': 'after-hours/man-back.webp',
    'b1b5d6ee-be0e-4367-9c59-d7ec99c63b00': 'after-hours/man-front.webp',
    '1b61ab70-c0e9-4c83-a666-07077eb831ec': 'after-hours/man-side.webp',
    '82dfa0ef-62c2-4a23-9daf-72e57678f7d0': 'after-hours/woman-back.webp',
    '5eb04790-6b7b-4531-9a67-62901765349b': 'after-hours/woman-front.webp',
    'ebcbed09-7515-4160-938c-7961ccccebf2': 'after-hours/woman-side.webp',
    'f7d222cc-88f5-4582-b791-1329bd21b853': 'keep-calm/flat-back.webp',
    '84d697da-3db4-45dc-aa89-c6d69f618177': 'keep-calm/flat-front.webp',
    '05e271a4-da37-47ee-a792-4257e2a8cd2d': 'keep-calm/man-back.webp',
    'ef087ab2-5dd9-4e57-a7c9-fd72f628043c': 'keep-calm/man-front.webp',
    '7e57e80b-2098-4d1d-b500-a0a22f039e18': 'keep-calm/man-side.webp',
    'c8115d29-4ba1-495d-9385-9ab53ef3b5df': 'keep-calm/woman-back.webp',
    '78a337a5-b761-4415-9c52-ce834331e93c': 'keep-calm/woman-front.webp',
    '77bc2784-73ab-4ece-8684-e3594b888c6b': 'keep-calm/woman-side.webp',
    '28c230fd-1247-403a-85b1-9b38f42c37cd': 'queen/flat-back.webp',
    'c42ceda3-c69a-401c-bf27-a3b3255af038': 'queen/flat-front.webp',
    '6727739b-a3d8-426f-8bbf-4bf82b05c5f5': 'queen/man-back.webp',
    '557c78ef-de85-458c-9994-356792442c4e': 'queen/man-front.webp',
    'c1a2cb0c-df7d-40dc-baa6-6f7b74066f81': 'queen/man-side.webp',
    '9daa49c1-acb7-42f1-b35b-caa7abe990bd': 'queen/woman-back.webp',
    '76339de6-e675-45b5-aaea-d1ceef45b2fc': 'queen/woman-front.webp',
    'bbd0431d-f1f3-42f8-a09e-57a097ae39dd': 'queen/woman-side.webp',
    '92c1984e-6e06-4783-8bd0-a77658e57266': 'drummers/flat-back.webp',
    'ec388d53-09f5-4ea4-9f52-257044ea4ffe': 'drummers/flat-front.webp',
    'a01200d1-2e97-42b5-a00a-5a9c74f2a8c7': 'drummers/man-back.webp',
    'ca1e83fb-a9d7-4d8e-b5a9-beb4db6897ad': 'drummers/man-front.webp',
    'd06e63d1-02b0-494c-8cf8-faa880e0cc48': 'drummers/man-side.webp',
    'f500f91a-b517-4702-8fdd-18e80735d6b5': 'drummers/woman-back.webp',
    '18f321d7-6628-4a28-80d1-a81d6284b886': 'drummers/woman-front.webp',
    '883e994f-6d97-481b-b84e-5b566446c18b': 'drummers/woman-side.webp',
    '1ec16b9c-fd1d-4ea1-bceb-e484fbaafa94': 'porsche/flat-back.webp',
    'c0ded08e-76a3-4084-968c-5d7a41ed870e': 'porsche/flat-front.webp',
    '14e653a5-b091-4487-9842-878d575cf84c': 'porsche/man-back.webp',
    '35bfc59d-6b11-408b-8138-ab232e6d330b': 'porsche/man-front.webp',
    'c5b1c0d9-1646-4dae-8f4f-1f01465ab10d': 'porsche/man-side.webp',
    '40c5fda2-3dab-46a0-8f45-28a7810e4f5d': 'porsche/woman-back.webp',
    'f3c323f6-de21-46df-bd28-0ff2dcff0766': 'porsche/woman-front.webp',
    'bd5732a1-614b-4fd3-8956-d62b502a7b7e': 'porsche/woman-side.webp',
    '5ae463eb-d1ab-4bf3-9734-a9211a976bbd': 'sandboard/flat-back.webp',
    'efff8972-6391-49a1-9afd-f8c98125eb90': 'sandboard/flat-front.webp',
    '33362a53-cebb-4949-b9c0-89f6aac2c169': 'sandboard/man-back.webp',
    '244c7a7a-b70b-4fd1-b3b8-c4234f7d7130': 'sandboard/man-front.webp',
    '06185ffb-f808-4264-8a7f-93a8cf412822': 'sandboard/man-side.webp',
    '99dd8150-cfe1-4c7b-b0c1-8d55dbd858e7': 'sandboard/woman-back.webp',
    '132ed40b-ae61-43e3-9aa3-917214dd6ad8': 'sandboard/woman-front.webp',
    '9a9156bf-a651-4368-9ad3-55bbff22bec7': 'sandboard/woman-side.webp',
    '04a6488f-7af4-4294-87d2-b4039175b676': 'camping/flat-back.webp',
    'af860437-814b-466a-a72f-a1a82cdb05f2': 'camping/flat-front.webp',
    'e0ed35dd-f28b-4002-822c-6af6cea07f12': 'camping/man-back.webp',
    '9e962c0e-8027-4e07-bd58-ec556498b3bb': 'camping/man-front.webp',
    'e03227a2-fc66-4a9b-912b-ff9970e3939d': 'camping/man-side.webp',
    '6425c646-2265-452a-a29f-9db7af23da16': 'camping/woman-back.webp',
    '5be70a36-d6fc-4157-a6cb-5581b977b6a1': 'camping/woman-front.webp',
    '693e8086-eca1-4516-8e3e-23e7e16160f7': 'camping/woman-side.webp',
    '243c872b-3db5-42ec-9004-9d2c8b572c56': 'defender/flat-back.webp',
    '2c7fa034-337f-4f68-940d-be2f6c9a72b9': 'defender/flat-front.webp',
    'a9f42b3f-b5e1-4c9a-9b38-a6567176dc85': 'defender/man-back.webp',
    'b23b946c-d283-4cbc-8560-9ec9dfd7dd8a': 'defender/man-front.webp',
    '60e1421c-8d44-4c0c-b6c8-be82ac90b50e': 'defender/man-side.webp',
    'ec7558e9-2941-474d-892d-2aea156e403d': 'defender/woman-back.webp',
    'a61cd795-62de-4a66-a398-fc49e38d2a95': 'defender/woman-front.webp',
    'f12ce3ce-cb8f-4528-96ca-c05a76cd8526': 'defender/woman-side.webp',
    '90d802c2-892c-4690-a232-fa17fb622935': 'cards/flat-back.webp',
    '40c2a68b-1331-4e13-a147-19aa2060a206': 'cards/flat-front.webp',
    'b48e7644-4b38-4510-8fb6-272714855b48': 'cards/man-back.webp',
    '0c49cf11-94a8-46b4-ad6f-5e1d76e18ae0': 'cards/man-front.webp',
    '1bf220e1-af2a-412c-8dfe-195c77b17828': 'cards/man-side.webp',
    'e480c66e-8150-4f54-8243-09a83bc41c5d': 'cards/woman-back.webp',
    'f31d30cb-5099-4d8e-abed-9ce908ffba85': 'cards/woman-front.webp',
    '698b869a-55fe-4ce8-b369-b63dfb23c876': 'cards/woman-side.webp',
    '391c6741-b6e3-4b2a-9a11-a2b7bcbc5248': 'typewriter/flat-back.webp',
    '17d10752-d85f-487e-93c4-e2a438eee670': 'typewriter/flat-front.webp',
    '3d5468fa-2644-4391-abd4-0dc41e7b236a': 'typewriter/woman-back.webp',
    'd44b56a7-b97c-47ee-9872-8d1fd6c74e64': 'typewriter/woman-front.webp',
    'd899009f-1ce1-4e41-8a3e-42249bd52ede': 'typewriter/woman-side.webp',
    'b4efc8a9-2509-42fd-9b21-f4f9a46dd581': 'matcha/flat-back.webp',
    'bc622a22-8bcc-42d8-80ea-7e3ca11f3a03': 'matcha/flat-front.webp',
    '6ae2cb49-34cf-4012-b027-a2837ee76082': 'matcha/woman-back.webp',
    '2dbd243a-40d1-4f65-a1f2-7a4476533075': 'matcha/woman-front.webp',
    '18f1dd0c-4353-4519-a874-4d220003f78c': 'matcha/woman-side.webp',
    'c3e4e09c-bc03-46f6-90d0-6650574ab4a9': 'riyadh/flat-back.webp',
    'c04b4ede-1387-43c2-86be-687120993d82': 'riyadh/flat-front.webp',
    'd46a2948-188e-4b7d-82a7-4eb3529dd4e2': 'riyadh/man-back.webp',
    '8bd5677b-53db-408c-a93d-bca1e627ade6': 'riyadh/man-front.webp',
    '3fb3276b-3076-4133-8e64-082f9f714904': 'riyadh/man-side.webp',
    '89ab0dc6-74fb-4749-97f5-e8f1619a66f8': 'riyadh/woman-back.webp',
    '5f1cec32-30d7-4ae5-8980-5945a23c80f0': 'riyadh/woman-front.webp',
    '570aee1f-0abf-441c-8dec-cfb4e1a5c848': 'riyadh/woman-side.webp'
  };
  var hdOf = function (url) {
    var m = String(url || '').match(/([A-Za-z0-9]{40})\.(?:jpe?g|png|webp)(?:[?#]|$)/);
    if (m && HD[m[1]]) return PHOTOS + HD[m[1]];
    // (Salla serves \u00ab\u2026-standard.webp\u00bb on the product page and \u00ab\u2026-thumbnail.webp\u00bb on the cards)
    var u = String(url || '').match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})-[\w-]*\.(?:webp|jpe?g|png)/);
    return u && WINTER_HD[u[1]] ? WINTER_PICS + WINTER_HD[u[1]] : '';
  };
  // the same photo at 1600x2000 (cdn/photos/<tee>/md/, WebP), sharp enough for a card and light enough for the home page
  var mdOf = function (url) { var hd = hdOf(url); return hd ? hd.replace(/([^/]+)$/, 'md/$1') : ''; };
  // and at 800x1000 (cdn/photos/<tee>/sm/) for the product cards: Salla's own copy there is 400x500, soft on phones
  var smOf = function (url) { var hd = hdOf(url); return hd ? hd.replace(/([^/]+)$/, 'sm/$1') : ''; };
  var sharpen = function (img, url) {   // a card photo from our copies: 800 wide, 1600 on sharper screens
    var sm = smOf(url);
    if (!img || !sm || img.getAttribute('src') === sm) return;
    img.setAttribute('srcset', sm + ' 800w, ' + mdOf(url) + ' 1600w');
    img.setAttribute('sizes', Math.max(160, Math.round(img.getBoundingClientRect().width || 300)) + 'px');
    img.setAttribute('src', sm);
  };
  function hdPhotos() {
    var box = $('salla-slider.details-slider .s-slider-container');
    if (!box || !box.swiper || box.hasAttribute('data-um-hd')) return;
    box.setAttribute('data-um-hd', '');
    var links = $$('a[data-fslightbox]', box), swapped = false;
    links.forEach(function (a) { var hd = hdOf(a.getAttribute('href')); if (hd) { a.setAttribute('href', hd); swapped = true; } });
    if (swapped && typeof window.refreshFsLightbox === 'function') window.refreshFsLightbox();
    var upgrade = function (k) {
      var slide = $$('.swiper-wrapper > .swiper-slide', box)[k];   // looked up each time: hangers() may drop slides
      var img = slide && $('img', slide), hd = img && !img.hasAttribute('data-um-hd') && hdOf(img.getAttribute('data-um-orig') || img.getAttribute('src'));
      if (!hd) return;
      img.setAttribute('data-um-hd', '');
      var pre = new Image();
      pre.onload = function () { img.src = hd; };
      pre.src = hd;
    };
    // every slide starts from our 1600-wide copy (Salla's is 800); the one in view and its neighbours get the 4K
    $$('.swiper-wrapper > .swiper-slide img', box).forEach(function (img) {
      var src = img.getAttribute('src'), md = mdOf(src);
      if (md && !img.hasAttribute('data-um-orig')) { img.setAttribute('data-um-orig', src); img.src = md; }
    });
    var near = function () { var k = box.swiper.activeIndex; upgrade(k); upgrade(k + 1); upgrade(k - 1); };
    near();
    box.swiper.on('slideChange', near);
  }
  // and the thumbnails under it: our 800-wide copy of the same photo (Caution's carries the page colour, 2026-11-02)
  function hdThumbs() {
    $$('salla-slider.details-slider .s-slider-thumbs img').forEach(function (img) { sharpen(img, img.getAttribute('src')); });
  }
  // products whose photos are on the page colour (paperbg.py): their gallery frame takes it too, so no white shows
  // around a photo (owner, 2026-11-02: \u00ab\u062d\u062a\u064a \u0645\u0646 \u0627\u0644\u062f\u0627\u062e\u0644 \u062a\u0643\u0648\u0646 \u0627\u0644\u062e\u0644\u0641\u064a\u0647 \u0646\u0641\u0633 \u0644\u0648\u0646 \u0627\u0644\u0645\u0648\u0642\u0639\u00bb)
  var PAPER = ['217344331', '1197022782', '862344853', '1501040588', '1223062065', '696581406', '2123593358', '299362976', '372176867', '1602505860', '17985496',
    '226109447', '1987585855', '157439951', '540602239', '752858337', '955844389', '1319907686', '285102373', '1629114231', '2058090175', '620531049', '1358578306', '1722444392'];
  // (every hoodie's photos are on the page colour too: it is told by its name)
  function paperPage() {
    var m = location.pathname.match(/\/p(\d+)(?:[/?#]|$)/);
    document.documentElement.classList.toggle('um-paper', !!(m && (PAPER.indexOf(m[1]) > -1 || isHoodie(pageTitle()))));
  }

  /* a product card whose photo is one of those model photos fills its frame like the gallery does (cards don't carry
     the photo's ALT, so the file name tells), and shows our sharp copy of it and of its hover photo */
  function modelCards() {
    $$('custom-salla-product-card').forEach(function (c) {
      var box = $('.s-product-card-image', c);
      if (!box || !c.product || !c.product.image || !hdOf(c.product.image.url)) return;
      box.classList.add('um-model');
      if (isHoodie(c.product.name)) hoodieCard(c, box);
      else if (backFirst(c.product.id)) showBack($('a img:not(.um-cback)', box), c.product.id);
      else sharpen($('a img:not(.um-cback)', box), c.product.image.url);
      var back = $('img.um-cback', box);
      if (back && back.getAttribute('data-um-url')) sharpen(back, back.getAttribute('data-um-url'));
    });
  }
  // a hoodie's card opens on its model photo (winterPics: the print side, man and woman by turns), on the page's colour;
  // the hover (flips) brings the hoodie by itself
  var hoodieN = 0;
  function hoodieCard(c, box) {
    var face = $('a img:not(.um-cback)', box);
    if (!face || c.hasAttribute('data-um-hoodie')) return;
    var k = hoodieN++;
    c.setAttribute('data-um-hoodie', String(k));
    photosOf(c.product.id).then(function (imgs) {
      var m = winterPics({ name: c.product.name, umPhotos: imgs }, k), img = $('a img:not(.um-cback)', box);
      if (m.first && img) sharpen(img, m.first);
    });
  }

  /* product photos: the \u00ab\u0634\u0645\u0627\u0639\u0629\u00bb photos are for the home rail, so the gallery leaves them out (never all of them).
     (The \u00ab\u0627\u0644\u0623\u0645\u0627\u0645 / \u0627\u0644\u062e\u0644\u0641\u00bb switch that sat over the photo was removed at the owner's request, 2026-11-01.) */
  function hangers() {
    var slider = $('salla-slider.details-slider');
    var box = slider && $('.swiper.s-slider-container', slider);
    if (!box || !box.swiper || slider.hasAttribute('data-um-hangers')) return;
    slider.setAttribute('data-um-hangers', '');
    var sw = box.swiper, thumbs = $('.swiper.s-slider-thumbs-container', slider), all = $$('.swiper-wrapper > .swiper-slide img', box), drop = [];
    all.forEach(function (img, i) { if (HANGER.test(img.alt || '')) drop.push(i); });
    if (drop.length < all.length) drop.reverse().forEach(function (i) { sw.removeSlide(i); if (thumbs && thumbs.swiper) thumbs.swiper.removeSlide(i); });
  }

  /* \u00ab\u0645\u0646\u062a\u062c\u0627\u062a \u0642\u062f \u062a\u0639\u062c\u0628\u0643\u00bb under the product: Salla's related list comes back empty for these tees, so the slider shows the
     rest of the tee's category instead (every tee, when that album has fewer than five), without the tee itself. When
     Salla has related products, they stay. */
  function related() {
    var old = $('salla-products-slider[source="related"]');
    if (!old || old.hasAttribute('data-um-checked') || !$('[data-testid="store-product-title"]') || !window.salla || !salla.product || !salla.product.fetch) return;
    old.setAttribute('data-um-checked', '');
    var id = old.getAttribute('source-value');
    // since the winter launch it shows the hoodies, on every product page (owner, 2026-11-22: \u00ab\u0642\u062f \u064a\u0639\u062c\u0628\u0643\u00bb = hoodies);
    // before, it was Salla's related list, else the rest of the tee's album
    swap(old, id, HOODIE_CAT, hoodiesUrl());
  }
  function swap(old, id, cat, all) {
    var n = el('salla-products-slider', 's-products-slider-wrapper');
    n.setAttribute('data-testid', old.getAttribute('data-testid') || 'store-product-related');
    n.setAttribute('block-title', old.getAttribute('block-title') || t('\u0645\u0646\u062a\u062c\u0627\u062a \u0642\u062f \u062a\u0639\u062c\u0628\u0643', 'You may also like'));
    n.setAttribute('source', 'categories');
    n.setAttribute('source-value', '[' + cat + ']');
    n.setAttribute('display-all-url', all);
    old.parentNode.replaceChild(n, old);
    // the tee on this page leaves the list (the slider redraws its cards while it settles, so look again for a while)
    var tries = 0;
    (function drop() {
      var own = $('custom-salla-product-card[id="' + id + '"]', n), slide = own && own.closest('.swiper-slide'), box = $('.swiper', n);
      if (slide) { slide.remove(); if (box && box.swiper) box.swiper.update(); }
      if (++tries < 48) setTimeout(drop, 250);
    })();
  }

  /* reviews: Salla's box is an empty block until a tee has reviews (or a signed-in buyer gets the form), so it steps aside till then */
  function reviews() {
    $$('salla-comments').forEach(function (c) { c.classList.toggle('um-empty', !c.textContent.trim() && !$('img, textarea, input, select', c)); });
  }

  /* phones: Raed pins the add-to-bag bar to the bottom of the screen; it becomes a cream dock (um-dock), and the page
     gets room at its end for it, as tall as the dock really is (Apple Pay can add a row) */
  function dock() {
    $$('.sticky-product-bar').forEach(function (bar) {
      var on = getComputedStyle(bar).position === 'fixed';
      bar.classList.toggle('um-dock', on);
      document.body.classList.toggle('um-docked', on);
      if (on) document.body.style.setProperty('--um-dock-h', bar.offsetHeight + 'px');
    });
  }
  /* \u00ab\u0627\u0634\u062a\u0631\u0650 \u0627\u0644\u0622\u0646\u00bb is drawn inside Salla's component, where the page's CSS can't reach: it gets the store's pill there */
  function quickBuy() {
    $$('salla-mini-checkout-widget').forEach(function (w) {
      if (!w.shadowRoot || w.shadowRoot.querySelector('style[data-um]')) return;
      var st = document.createElement('style');
      st.setAttribute('data-um', '');
      st.textContent = '.s-fast-checkout-button.s-fast-checkout-button{width:100%!important;height:100%!important;min-height:48px!important;border:2px solid #101010!important;border-radius:999px!important;background:#FAF5EF!important;color:#101010!important;font-weight:700!important;font-size:14px!important}';
      w.shadowRoot.appendChild(st);
    });
  }

  /* sizes: a tile per option, kept in step with Salla's own dropdown (it stays in the form and does the work) */
  function tiles() {
    $$('.product-form salla-product-options select.s-form-control').forEach(function (sel) {
      var wrap = sel.parentElement;
      if (!wrap || wrap.querySelector('.um-tiles')) return;
      var opts = Array.prototype.slice.call(sel.options).filter(function (o) { return o.value; });
      if (!opts.length || opts.length > 12) return;
      var row = el('div', 'um-tiles');
      row.setAttribute('role', 'group');
      opts.forEach(function (o) {
        var b = el('button', 'um-tile', esc(o.textContent.replace(/\s*[-\u2013(].*$/, '').trim()));
        b.type = 'button';
        b.dataset.v = o.value;
        b.disabled = o.disabled;
        b.setAttribute('aria-pressed', String(sel.value === o.value));
        row.appendChild(b);
      });
      row.addEventListener('click', function (e) {
        var b = e.target.closest('.um-tile');
        if (!b || b.disabled) return;
        var s = wrap.querySelector('select.s-form-control') || sel;
        s.value = b.dataset.v;
        s.dispatchEvent(new Event('input', { bubbles: true }));
        s.dispatchEvent(new Event('change', { bubbles: true }));
        $$('.um-tile', row).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      });
      wrap.appendChild(row);
      wrap.classList.add('um-tiles-on');
    });
  }

  /* \u00ab\u0645\u0633\u0627\u0639\u062f \u0627\u0644\u0645\u0642\u0627\u0633\u00bb under the size tiles: height and weight (with a live guess), then how you like
     this one to sit, then a size with the reasons and the chart (cm or inch); \u00ab\u0627\u062e\u062a\u0631\u00bb picks that tile. The idea is the
     owner's reference (a \u00abFind my size\u00bb advisor); the numbers come from the page's chart (sizeChart: the tee's or the hoodie's). Answers stay in this browser only. */
  var FIT_KEY = 'um-fit';
  var fitLoad = function () { try { return JSON.parse(localStorage.getItem(FIT_KEY)) || {}; } catch (e) { return {}; } };
  var fitSave = function (s) { try { localStorage.setItem(FIT_KEY, JSON.stringify(s)); } catch (e) {} };
  var arNum = function (n) { return ar ? String(n).replace(/[0-9]/g, function (d) { return '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669'[d]; }) : String(n); };
  // body chest round (cm) from height and weight, then the tee that leaves the room this cut is made for
  function fitSize(s, sc) {
    sc = sc || sizeChart(false);
    var chest = s.g === 'w' ? 60 + 0.45 * s.w + 0.05 * (s.h - 165) : 64 + 0.42 * s.w + 0.08 * (s.h - 175);
    // room the tee leaves round the chest (cm): the maker's chart runs wide, so a usual M person still gets M (owner's note: \u00ab\u0627\u062e\u062a\u0631 \u0645\u0642\u0627\u0633\u0643 \u0627\u0644\u0645\u0639\u062a\u0627\u062f\u00bb);
    // the hoodie's chart is half an inch narrower a size, so its room is a little less, to land on the same usual size
    var ease = (sc.hoodie ? { slim: 16, over: 22, more: 28 } : { slim: 18, over: 24, more: 30 })[s.like || 'over'];
    var need = chest + ease, i = 0, last = sc.sizes.length - 1;
    while (i < last && sc.cm[i][0] * 2 < need) i++;
    var tall = s.g === 'w' ? (s.h >= 186 ? 3 : s.h >= 178 ? 2 : 0) : (s.h >= 195 ? 3 : s.h >= 188 ? 2 : 0);
    var byLength = Math.max(i, Math.min(tall, last)) > i;
    if (byLength) i = Math.min(tall, last);
    return { i: i, size: sc.sizes[i], tight: sc.cm[last][0] * 2 < need, roomy: i === 0 && sc.cm[0][0] * 2 - need > 10, byLength: byLength };
  }
  function fitHelper() {
    var row = $('.product-form .um-tiles');
    if (!row || row.parentNode.querySelector('.um-fit-open')) return;
    var open = el('button', 'um-fit-open', '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 15.5 15.5 3l5.5 5.5L8.5 21z"/><path d="M7 11.5l2 2M10 8.5l2 2M13 5.5l2 2"/></svg><span></span>');
    open.type = 'button';
    var label = function () {
      var s = fitLoad();
      $('span', open).textContent = s.size ? t('\u0645\u0642\u0627\u0633\u0643 \u062d\u0633\u0628 \u0625\u062c\u0627\u0628\u0627\u062a\u0643: ', 'Your size from your answers: ') + s.size : t('\u0645\u0627 \u062a\u062f\u0631\u064a \u0648\u0634 \u0645\u0642\u0627\u0633\u0643\u061f \u0646\u062e\u062a\u0627\u0631\u0647 \u0645\u0639\u0643', 'Not sure of your size? Find it here');
    };
    label();
    row.parentNode.insertBefore(open, row.nextSibling);
    open.addEventListener('click', function () { fitOpen(open, label); });
    var fold = $('#um-size .um-fbody');
    if (fold && !$('.um-fit-link', fold)) {
      var l = el('button', 'um-fit-link', t('\u0645\u0627 \u062a\u062f\u0631\u064a \u0648\u0634 \u0645\u0642\u0627\u0633\u0643\u061f \u062c\u0631\u0651\u0628 \u0645\u0633\u0627\u0639\u062f \u0627\u0644\u0645\u0642\u0627\u0633', 'Not sure? Try the size advisor'));
      l.type = 'button';
      l.addEventListener('click', function () { fitOpen(open, label); });
      fold.appendChild(l);
    }
  }
  function fitOpen(opener, relabel) {
    var s = fitLoad();
    s.g = s.g || 'm'; s.h = s.h || (s.g === 'w' ? 163 : 175); s.w = s.w || (s.g === 'w' ? 60 : 75);
    s.hu = s.hu || 'cm'; s.wu = s.wu || 'kg'; s.cu = s.cu || 'cm';
    var step = 1, sc = pageChart();
    var name = bare(($('[data-testid="store-product-title"]') || {}).textContent || '');
    // the price as shown (Salla keeps a hidden sale block beside it), with its riyal icon
    var priceEl = $('[data-testid="store-product-price"]');
    if (priceEl) priceEl = $$('p, span', priceEl).filter(function (n) { return n.offsetParent && $('i[class^="sicon-"]', n); })[0] || priceEl;
    var thumb = $('salla-slider.details-slider .swiper-slide img');
    var veil = el('div', 'um-fit-veil');
    var box = el('div', 'um-fit');
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', t('\u0645\u0633\u0627\u0639\u062f \u0627\u0644\u0645\u0642\u0627\u0633', 'Size advisor'));
    veil.appendChild(box);
    document.body.appendChild(veil);
    document.documentElement.classList.add('um-fit-lock');
    var close = function () { veil.remove(); document.documentElement.classList.remove('um-fit-lock'); removeEventListener('keydown', key); relabel(); opener.focus(); };
    var key = function (e) { if (e.key === 'Escape') close(); };
    addEventListener('keydown', key);
    veil.addEventListener('click', function (e) { if (e.target === veil) close(); });
    var hTxt = function () { if (s.hu === 'cm') return arNum(s.h) + ' <small>' + t('\u0633\u0645', 'cm') + '</small>'; var i = Math.round(s.h / 2.54); return arNum(Math.floor(i / 12)) + '\u2032' + arNum(i % 12) + '\u2033'; };
    var wTxt = function () { return s.wu === 'kg' ? arNum(s.w) + ' <small>' + t('\u0643\u062c\u0645', 'kg') + '</small>' : arNum(Math.round(s.w * 2.2046)) + ' <small>' + t('\u0631\u0637\u0644', 'lb') + '</small>'; };
    var seg = function (k, a, b) { return '<div class="um-fit-seg" data-k="' + k + '">' + [a, b].map(function (o) { return '<button type="button" data-v="' + o[0] + '" aria-pressed="' + (s[k] === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div>'; };
    var choice = function (k, list) { return '<div class="um-fit-choices" role="radiogroup">' + list.map(function (o) { return '<button type="button" role="radio" data-k="' + k + '" data-v="' + o[0] + '" aria-checked="' + (s[k] === o[0]) + '"><b>' + o[1] + '</b>' + (o[2] ? '<span>' + o[2] + '</span>' : '') + '</button>'; }).join('') + '</div>'; };
    var draw = function () {
      var r = fitSize(s, sc), html = '<div class="um-fit-top"><b>' + t('\u0645\u0633\u0627\u0639\u062f \u0627\u0644\u0645\u0642\u0627\u0633', 'Size advisor') + '</b><button type="button" class="um-fit-x" aria-label="' + t('\u0625\u063a\u0644\u0627\u0642', 'Close') + '">\u00d7</button></div>';
      html += '<div class="um-fit-item">' + (thumb ? '<img src="' + esc(thumb.currentSrc || thumb.src) + '" alt="">' : '') + '<div><b>' + esc(name.trim()) + '</b><span></span></div></div>';
      if (step < 3) html += '<div class="um-fit-steps" aria-hidden="true"><i class="on"></i><i' + (step > 1 ? ' class="on"' : '') + '></i></div><p class="um-fit-count">' + t('\u062e\u0637\u0648\u0629 ' + arNum(step) + ' \u0645\u0646 ' + arNum(2), 'Step ' + step + ' of 2') + '</p>';
      if (step === 1) {
        html += '<h3>' + t('\u0646\u0639\u0631\u0641\u0643 \u0628\u062b\u0627\u0646\u064a\u062a\u064a\u0646', 'Two measurements, ten seconds') + '</h3><p class="um-fit-sub">' + t('\u0637\u0648\u0644\u0643 \u0648\u0648\u0632\u0646\u0643 \u0628\u0633.', 'Just your height and weight.') + '</p>' +
          seg('g', ['m', t('\u0634\u0628\u0627\u0628', 'Men')], ['w', t('\u0628\u0646\u0627\u062a', 'Women')]) +
          '<div class="um-fit-dials">' +
          '<label class="um-fit-dial"><span class="um-fit-dial-top">' + t('\u0627\u0644\u0637\u0648\u0644', 'Height') + seg('hu', ['cm', t('\u0633\u0645', 'cm')], ['ft', t('\u0642\u062f\u0645', 'ft')]) + '</span><output>' + hTxt() + '</output>' +
          '<span class="um-fit-range"><button type="button" data-step="h" data-d="-1" aria-label="\u2212">\u2212</button><input type="range" min="140" max="205" step="1" value="' + s.h + '" data-f="h" aria-label="' + t('\u0627\u0644\u0637\u0648\u0644', 'Height') + '"><button type="button" data-step="h" data-d="1" aria-label="+">+</button></span></label>' +
          '<label class="um-fit-dial"><span class="um-fit-dial-top">' + t('\u0627\u0644\u0648\u0632\u0646', 'Weight') + seg('wu', ['kg', t('\u0643\u062c\u0645', 'kg')], ['lb', t('\u0631\u0637\u0644', 'lb')]) + '</span><output>' + wTxt() + '</output>' +
          '<span class="um-fit-range"><button type="button" data-step="w" data-d="-1" aria-label="\u2212">\u2212</button><input type="range" min="40" max="140" step="1" value="' + s.w + '" data-f="w" aria-label="' + t('\u0627\u0644\u0648\u0632\u0646', 'Weight') + '"><button type="button" data-step="w" data-d="1" aria-label="+">+</button></span></label>' +
          '</div><div class="um-fit-live" aria-live="polite"><span>' + t('\u062a\u0642\u062f\u064a\u0631\u0646\u0627 \u0627\u0644\u062d\u064a\u0646', 'Our guess so far') + '<small>' + t('\u064a\u062a\u0623\u0643\u062f \u0641\u064a \u0627\u0644\u062e\u0637\u0648\u0629 \u0627\u0644\u062c\u0627\u064a\u0629', 'Firms up in the next step') + '</small></span><b lang="en">' + r.size + '</b></div>' +
          '<button type="button" class="um-fit-go" data-to="2">' + t('\u0643\u0645\u0651\u0644', 'Continue') + '</button>';
      } else if (step === 2) {
        html += '<h3>' + t('\u0648\u0634 \u062a\u062d\u0628 \u0641\u064a \u0627\u0644\u0644\u0628\u0633\u0629\u061f', 'How do you like it to sit?') + '</h3><p class="um-fit-sub">' + (sc.hoodie ? t('\u0647\u0648\u062f\u064a\u0627\u062a\u0646\u0627 \u0642\u0635\u0651\u0629 \u0648\u0627\u0633\u0639\u0629 \u0645\u0646 \u0627\u0644\u0623\u0633\u0627\u0633.', 'Our hoodies are cut oversized to begin with.') : t('\u062a\u064a\u0634\u064a\u0631\u062a\u0627\u062a\u0646\u0627 \u0642\u0635\u0651\u0629 \u0648\u0627\u0633\u0639\u0629 \u0645\u0646 \u0627\u0644\u0623\u0633\u0627\u0633.', 'Our tees are cut oversized to begin with.')) + '</p>' +
          choice('like', [['over', t('\u0623\u0648\u0641\u0631\u0633\u0627\u064a\u0632 \u0632\u064a \u0645\u0627 \u0627\u0646\u0642\u0635\u0651\u062a', 'Oversized, as cut'), t('\u0646\u0646\u0635\u062d \u0641\u064a\u0647\u0627', 'Our pick')], ['slim', t('\u0623\u0642\u0631\u0628 \u0644\u0644\u062c\u0633\u0645', 'Closer to the body'), t('\u0623\u0642\u0644 \u0627\u062a\u0633\u0627\u0639', 'Less room')], ['more', t('\u0623\u0648\u0633\u0639 \u0628\u0639\u062f', 'Even roomier'), t('\u062a\u0646\u0632\u0644 \u0639\u0644\u0649 \u0627\u0644\u0643\u062a\u0641 \u0623\u0643\u062b\u0631', 'Drops further off the shoulder')]]) +
          '<div class="um-fit-nav"><button type="button" class="um-fit-back" data-to="1">' + t('\u0631\u062c\u0648\u0639', 'Back') + '</button><button type="button" class="um-fit-go" data-to="3"' + (s.like ? '' : ' disabled') + '>' + t('\u0634\u0648\u0641 \u0645\u0642\u0627\u0633\u064a', 'See my size') + '</button></div>';
      } else {
        var why = [];
        var plain = function (x) { return x.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); };
        why.push(t('\u0637\u0648\u0644\u0643 ' + plain(hTxt()) + ' \u0648\u0648\u0632\u0646\u0643 ' + plain(wTxt()) + '.', 'You are ' + plain(hTxt()) + ' and ' + plain(wTxt()) + '.'));
        why.push({ over: t('\u062a\u0628\u064a\u0647\u0627 \u0623\u0648\u0641\u0631\u0633\u0627\u064a\u0632 \u0632\u064a \u0645\u0627 \u0627\u0646\u0642\u0635\u0651\u062a\u060c \u0648\u0647\u0630\u0627 \u0627\u0644\u0645\u0642\u0627\u0633 \u064a\u0639\u0637\u064a\u0643 \u0647\u0627\u0644\u0642\u0635\u0651\u0629.', 'You want it oversized as cut; this size gives you that.'), slim: t('\u062a\u0628\u064a\u0647\u0627 \u0623\u0642\u0631\u0628 \u0644\u0644\u062c\u0633\u0645\u060c \u0641\u0627\u062e\u062a\u0631\u0646\u0627 \u0627\u062a\u0633\u0627\u0639 \u0623\u0642\u0644.', 'You want it closer; we chose less room.'), more: t('\u062a\u0628\u064a\u0647\u0627 \u0623\u0648\u0633\u0639\u060c \u0641\u0643\u0628\u0651\u0631\u0646\u0627 \u0644\u0643.', 'You want it roomier; we went up.') }[s.like]);
        if (r.byLength) why.push(t('\u0648\u0637\u0648\u0644\u0643 \u064a\u0646\u0627\u0633\u0628\u0647 \u0637\u0648\u0644 \u0647\u0627\u0644\u0645\u0642\u0627\u0633 (' + arNum(sc.cm[r.i][sc.cm[r.i].length - 1]) + ' \u0633\u0645).', 'Your height suits this size\u2019s length (' + sc.cm[r.i][sc.cm[r.i].length - 1] + ' cm).'));
        if (r.tight) why.push(t(sc.sizes[r.i] + ' \u0623\u0643\u0628\u0631 \u0645\u0642\u0627\u0633 \u0639\u0646\u062f\u0646\u0627\u060c \u0648\u0628\u064a\u062c\u064a\u0643 \u0623\u0642\u0631\u0628 \u0644\u0644\u062c\u0633\u0645 \u0645\u0646 \u0627\u0644\u0623\u0648\u0641\u0631\u0633\u0627\u064a\u0632.', sc.sizes[r.i] + ' is our largest; it will sit closer than oversized.'));
        if (r.roomy) why.push(t(sc.sizes[0] + ' \u0623\u0635\u063a\u0631 \u0645\u0642\u0627\u0633 \u0639\u0646\u062f\u0646\u0627\u060c \u0648\u0628\u064a\u062c\u064a\u0643 \u0648\u0627\u0633\u0639 \u0634\u0648\u064a.', sc.sizes[0] + ' is our smallest; it will be a little roomy.'));
        var inch = s.cu === 'in';   // inches: the maker's own numbers; cm: those \u00d7 2.54
        var sold = $$('.product-form .um-tile').filter(function (b) { return b.textContent.trim() === r.size && b.disabled; }).length;
        html += '<p class="um-fit-count">' + t('\u0645\u0642\u0627\u0633\u0643', 'Your size') + '</p><div class="um-fit-size"><b lang="en">' + r.size + '</b></div>' +
          '<ul class="um-fit-why">' + why.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul>' +
          '<div class="um-fit-chart-top"><b>' + t('\u062c\u062f\u0648\u0644 \u0627\u0644\u0645\u0642\u0627\u0633\u0627\u062a', 'Size chart') + '</b>' + seg('cu', ['cm', t('\u0633\u0645', 'cm')], ['in', t('\u0625\u0646\u0634', 'in')]) + '</div>' +
          '<table class="um-chart um-fit-chart"><thead><tr><th>' + t('\u0627\u0644\u0645\u0642\u0627\u0633', 'Size') + '</th>' + sc.cols.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr></thead><tbody>' +
          sc.sizes.map(function (size, k) { var v = inch ? sc.inch[k] : sc.cm[k]; return '<tr' + (k === r.i ? ' class="on"' : '') + '><td lang="en">' + size + '</td>' + v.map(function (x) { return '<td>' + arNum(x) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>' +
          (sold ? '<p class="um-fit-sub">' + t('\u0645\u0642\u0627\u0633 ' + r.size + ' \u062e\u0644\u0635 \u062d\u0627\u0644\u064a\u0627\u064b.', 'Size ' + r.size + ' is sold out right now.') + '</p>' : '<button type="button" class="um-fit-go um-fit-pick">' + t('\u0627\u062e\u062a\u0631 \u0645\u0642\u0627\u0633 ' + r.size, 'Choose ' + r.size) + '</button>') +
          '<button type="button" class="um-fit-back um-fit-again" data-to="1">' + t('\u0623\u0639\u062f \u0627\u0644\u0623\u0633\u0626\u0644\u0629', 'Start again') + '</button>';
        s.size = r.size;
        fitSave(s);
      }
      html += '<p class="um-fit-note">' + t('\u0625\u062c\u0627\u0628\u0627\u062a\u0643 \u062a\u0628\u0642\u0649 \u0641\u064a \u062c\u0647\u0627\u0632\u0643 \u0628\u0633.', 'Your answers stay on this device.') + '</p>';
      box.innerHTML = html;
      if (priceEl) copyText($('.um-fit-item span', box), priceEl);
      fitSave(s);
    };
    var live = function () {
      var r = fitSize({ g: s.g, h: s.h, w: s.w }, sc);
      var b = $('.um-fit-live b', box), o = $$('.um-fit-dial output', box);
      if (b) b.textContent = r.size;
      if (o[0]) o[0].innerHTML = hTxt();
      if (o[1]) o[1].innerHTML = wTxt();
    };
    box.addEventListener('input', function (e) { var f = e.target.getAttribute('data-f'); if (f) { s[f] = +e.target.value; live(); fitSave(s); } });
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.classList.contains('um-fit-x')) return close();
      if (b.hasAttribute('data-step')) { var f = b.getAttribute('data-step'), inp = $('input[data-f="' + f + '"]', box); s[f] = Math.max(+inp.min, Math.min(+inp.max, s[f] + +b.getAttribute('data-d'))); inp.value = s[f]; live(); fitSave(s); return; }
      var sg = b.parentNode.getAttribute('data-k');
      if (sg) { s[sg] = b.getAttribute('data-v'); if (sg === 'g' && !fitLoad().h) { s.h = s.g === 'w' ? 163 : 175; s.w = s.g === 'w' ? 60 : 75; } return draw(); }
      if (b.getAttribute('role') === 'radio') { s[b.getAttribute('data-k')] = b.getAttribute('data-v'); return draw(); }
      if (b.classList.contains('um-fit-pick')) {
        var tile = $$('.product-form .um-tile').filter(function (x) { return x.textContent.trim() === s.size; })[0];
        if (tile) tile.click();
        return close();
      }
      if (b.hasAttribute('data-to')) { step = +b.getAttribute('data-to'); draw(); var h = $('h3, .um-fit-size', box); if (h) h.setAttribute('tabindex', '-1'), h.focus(); }
    });
    draw();
    box.setAttribute('tabindex', '-1');
    box.focus();
  }

  /* the add button speaks like the store: \u00ab\u0623\u0636\u0641 \u0635\u0648\u062a\u0643 \u0644\u0644\u0633\u0644\u0629\u00bb (only Salla's default label is swapped) */
  function addLabel() {
    $$('.product-form salla-add-product-button .s-button-text').forEach(function (s) {
      // narrow screens: Salla shows only the cart icon and keeps the words for screen readers; they show beside it
      var sr = $('.s-add-product-button-sr-only', s);
      if (sr) {
        if (/\u0623\u0636\u0641 \u0625\u0644\u0649 \u0627\u0644\u0633\u0644\u0629|\u0625\u0636\u0627\u0641\u0629 \u0644\u0644\u0633\u0644\u0629/.test(sr.textContent)) sr.textContent = '\u0623\u0636\u0641 \u0635\u0648\u062a\u0643 \u0644\u0644\u0633\u0644\u0629';
        else if (/add to cart/i.test(sr.textContent)) sr.textContent = 'Add your voice to the bag';
        sr.classList.add('um-label');
        return;
      }
      var txt = s.textContent.trim();
      if (txt === '\u0623\u0636\u0641 \u0625\u0644\u0649 \u0627\u0644\u0633\u0644\u0629' || txt === '\u0625\u0636\u0627\u0641\u0629 \u0644\u0644\u0633\u0644\u0629') s.textContent = '\u0623\u0636\u0641 \u0635\u0648\u062a\u0643 \u0644\u0644\u0633\u0644\u0629';
      else if (txt === 'Add to cart' || txt === 'Add To Cart') s.textContent = 'Add your voice to the bag';
    });
  }

  /* bag: a \u00ab\u0633\u0644\u062a\u0643\u00bb title, and the store's words when it's empty */
  function cart() {
    if (!/\/cart(\/|$|\?)/.test(location.pathname)) return;
    var crumbs = $('#main-content .breadcrumbs');
    var main = $('#main-content .container') || $('#main-content');
    var title = '<h1 class="um-cart-title">' + t('\u0633\u0644\u062a\u0643', 'Your bag') + '</h1>';
    if (!$('.um-cart-title')) { if (crumbs) crumbs.insertAdjacentHTML('afterend', title); else if (main) main.insertAdjacentHTML('afterbegin', title); }
    // each row: the picked size as words under the name; Salla's picker stays in the form (hidden) unless one is missing
    $$('form[id^="item-"] .cart-item').forEach(function (row) {
      if (row.querySelector('.um-cmeta')) return;
      var picked = [], missing = false;
      $$('salla-product-options .s-product-options-option', row).forEach(function (o) {
        var label = (($('.s-product-options-option-label b', o) || {}).textContent || '').replace('*', '').trim();
        var sel = $('select', o);
        if (!sel) { missing = true; return; }
        var opt = sel.options[sel.selectedIndex];
        if (opt && opt.value) picked.push((label ? label + ': ' : '') + opt.textContent.trim()); else missing = true;
      });
      var opts = $('salla-product-options', row);
      if (!opts || !picked.length) return;
      var name = $('h1', row);
      if (name) name.insertAdjacentHTML('afterend', '<p class="um-cmeta">' + esc(picked.join('\u060c ')) + '</p>');
      if (!missing) opts.closest('salla-product-options').classList.add('um-copts-done');
    });
    var empty = $('.no-content-placeholder');
    if (empty && !$('.um-empty-sub', empty)) {
      var p = $('p', empty);
      if (p) p.textContent = t('\u0633\u0644\u062a\u0643 \u0633\u0627\u0643\u062a\u0629.', 'Your bag is on mute.');
      if (p) p.insertAdjacentHTML('afterend', '<p class="um-empty-sub">' + t('\u0627\u062e\u062a\u0631 \u0635\u0648\u062a \u0648\u062e\u0644\u0651\u0647\u0627 \u062a\u062a\u0643\u0644\u0645.', 'Pick a voice and let it speak.') + '</p>');
      var a = $('a', empty);
      if (a) a.textContent = t('\u062a\u0635\u0641\u0651\u062d \u0627\u0644\u0623\u0635\u0648\u0627\u062a', 'Browse the voices');
    }
  }

  /* footer: the store's closing line */
  function footer() {
    var f = $('.store-footer');
    if (!f) return;
    if (!$('.um-ftr-big')) f.insertBefore(el('div', 'um-ftr-big', '<p lang="en" dir="ltr">Wear your voice.</p><p>' + t('\u0627\u0644\u0628\u0633 \u0635\u0648\u062a\u0643.', '\u0627\u0644\u0628\u0633 \u0635\u0648\u062a\u0643.') + '</p>'), f.firstChild);
    // the brand in a few words under the store's name (owner, 2026-11-09: \u00ab\u0648\u0647\u0630\u0627 \u0627\u062d\u062a\u0627\u062c \u064a\u0646\u0636\u0627\u0641 \u0648\u0635\u0641 \u0644\u0644\u0628\u0631\u0627\u0646\u062f \u062a\u062d\u062a\u00bb)
    var name = $('.store-footer__inner h3'), spot = name && (name.closest('a') || name);
    if (spot && !$('.um-ftr-about')) spot.insertAdjacentHTML('afterend', '<div class="um-ftr-about"><p class="um-ftr-about__t"><span lang="en" dir="ltr">UNMUTED</span> \u2014 ' +
      t('\u0627\u0644\u0628\u0633 \u0635\u0648\u062a\u0643.', 'Wear your voice.') + '</p><p>' +
      t('\u0628\u0631\u0627\u0646\u062f \u0633\u0639\u0648\u062f\u064a \u064a\u0639\u0637\u064a \u0634\u062e\u0635\u064a\u062a\u0643 \u0645\u0633\u0627\u062d\u0629 \u062a\u062a\u0643\u0644\u0645. \u0646\u062d\u0648\u0651\u0644 \u0627\u0644\u0623\u0641\u0643\u0627\u0631 \u0648\u0627\u0644\u0631\u0633\u0648\u0645\u0627\u062a \u0627\u0644\u062c\u0631\u064a\u0626\u0629 \u0625\u0644\u0649 \u0642\u0637\u0639 \u0628\u0642\u0635\u0651\u0627\u062a \u0648\u0627\u0633\u0639\u0629\u060c \u062a\u062e\u062a\u0627\u0631 \u0645\u0646\u0647\u0627 \u0627\u0644\u0644\u064a \u064a\u0634\u0628\u0647\u0643 \u0648\u062a\u0644\u0628\u0633\u0647\u0627 \u0628\u0637\u0631\u064a\u0642\u062a\u0643. \u0643\u0644 \u0642\u0637\u0639\u0629 \u062a\u0639\u0628\u0631 \u0639\u0646\u0643\u060c \u0642\u0628\u0644 \u0644\u0627 \u062a\u0642\u0648\u0644 \u0623\u064a \u0643\u0644\u0645\u0629.',
        'A Saudi brand that gives your personality room to speak. We turn bold ideas and graphics into oversized pieces: pick the one that sounds like you and wear it your way. Every piece speaks for you before you say a word.') +
      '</p></div>');
  }

  /* where a page opens (owner, 2026-11-03): a visit or a refresh opens at the top, and the back button lands where the page
     was left (from a product back to the home: the same spot in the list). The browser's own restore is off: the home's
     sections and Salla's product lists come in after the page loads, so it would stop at the footer of the still-short
     page. On the way back the page (not the header) stays hidden until it sits at the spot, then fades in; the home has
     its loader for that (homeReady). */
  var NAV = (function () { var n = window.performance && performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] : null; return n ? n.type : ''; })();
  var PLACE = 'um-y:' + location.pathname + location.search;
  var savedY = function () { try { return Number(sessionStorage.getItem(PLACE)) || 0; } catch (e) { return 0; } };
  // jump to y once the page is tall enough and keep it there while late parts settle; done() once it sits still, the
  // visitor moves, or 6s go by
  function settleAt(y, done) {
    var root = document.documentElement, stop = false, steady = 0, h = 0, tries = 0, fin = false;
    var end = function () { if (!fin) { fin = true; done(); } };
    ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) { addEventListener(t, function () { stop = true; end(); }, { once: true, passive: true }); });
    (function go() {
      if (stop || ++tries > 60) return end();
      var tall = root.scrollHeight - innerHeight >= y - 2;
      if (tall) scrollTo({ top: y, behavior: 'instant' });   // the theme scrolls smoothly; this must be a jump
      steady = tall && Math.abs(scrollY - y) < 3 && root.scrollHeight === h ? steady + 1 : 0;
      h = root.scrollHeight;
      if (steady >= 3) end();                   // at the spot and the page has stopped growing
      if (steady < 8) setTimeout(go, 100);      // and keep it there while late images settle
    })();
  }
  function keepPlace() {
    var root = document.documentElement;
    addEventListener('pagehide', function () { try { sessionStorage.setItem(PLACE, String(Math.round(scrollY))); } catch (e) { /* private mode */ } });
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (document.body && document.body.classList.contains('index')) return;   // the home: homeReady, once its sections are in
    var y = savedY();
    if (NAV !== 'back_forward' || !y) return;
    root.classList.add('um-restoring');
    var show = function () { root.classList.remove('um-restoring'); };
    setTimeout(show, 3500);   // whatever happens, the page shows
    settleAt(y, show);
  }
  /* the home's loader (CSS, from the first paint) lifts once the sections are in and their photo has come, with the view at
     the top, or, back from a product, where it was left */
  function homeReady(box) {
    var root = document.documentElement;
    if (root.classList.contains('um-ready')) return;
    var img = box && $('.um-hero__photo', box);
    new Promise(function (r) {
      if (!img || (img.complete && img.naturalWidth)) return r();
      img.addEventListener('load', r, { once: true });
      img.addEventListener('error', r, { once: true });
      setTimeout(r, 1500);
    }).then(function () {
      var lift = function () { root.classList.add('um-ready'); };
      var y = NAV === 'back_forward' ? savedY() : 0;
      setTimeout(function () {   // at least .6s from the start, so a quick load doesn't blink
        if (y) return settleAt(y, lift);
        if (!location.hash) scrollTo({ top: 0, behavior: 'instant' });
        requestAnimationFrame(lift);
      }, Math.max(0, 600 - performance.now()));
    });
  }

  /* The offer (from 2026-11-22, the winter launch): one hoodie + one tee, the tee at half price (74.5 instead of 149) and
     free shipping, so the pair is 230 + 74.5 = 304.5 with VAT instead of 379 (owner: \u00ab\u0639\u0631\u0636 \u0661 \u0647\u0648\u062f\u064a \u0648 \u0661 \u062a\u064a \u0634\u064a\u0631\u062a \u0646\u0635 \u0627\u0644\u0633\u0639\u0631 \u0645\u0639
     \u0634\u062d\u0646 \u0645\u062c\u0627\u0646\u064a\u00bb). Salla does the sums itself (a \u00abbuy X get Y\u00bb offer and free shipping); the old tee bundles \u00ab\u0628\u0627\u0642\u0627\u062a UNMUTED\u00bb
     are off. This only tells it: one card above the add button on every product page, a bar in the cart that says what is
     still missing for the offer, and the \u00ab\u0628\u0643\u062c\u0627\u062a\u00bb page (its own page in the header) with the offer as one card */
  var PACK = { price: 149, hoodie: 230, ship: 40, page: '72145634' };   // price: a tee
  // the pair at full price, and with the tee at half
  var DEAL = { was: PACK.hoodie + PACK.price, total: PACK.hoodie + PACK.price / 2 };
  var moneyNum = function (v) {
    var s = Math.round(v * 100) % 100 ? v.toFixed(2) : String(Math.round(v));
    return ar ? arNum(s).replace('.', '\u066b') : s;
  };
  var money = function (v) {
    return '<span class="um-money">' + moneyNum(v) + ' <i class="sicon-sar" aria-hidden="true"></i></span>';
  };
  // the offer's card: its title and its price, the old price struck beside the new one so the saving shows (owner
  // 2026-11-05); marked while the offer is on in the bag
  var packCard = function (on) {
    return '<div class="um-pack' + (on ? ' is-on' : '') + '">' +
      '<b class="um-pack__title">' + t('\u0647\u0648\u062f\u064a + \u062a\u064a\u0634\u064a\u0631\u062a \u0628\u0646\u0635 \u0627\u0644\u0633\u0639\u0631 +\u00a0\u0634\u062d\u0646\u00a0\u0645\u062c\u0627\u0646\u064a', 'Hoodie + a tee at half price +\u00a0free\u00a0shipping') + '</b>' +
      '<span class="um-pack__price"><s aria-label="' + t('\u0628\u062f\u0644 ', 'instead of ') + DEAL.was + '">' + moneyNum(DEAL.was) + '</s>' + money(DEAL.total) + '</span>' +
    '</div>';
  };
  // the bag's count, from the header
  var bagCount = function () {
    var c = $('salla-cart-summary .s-cart-summary-count'), n = c ? amount(c.textContent) : 0;
    return n > 0 ? n : 0;
  };
  // does the bag hold a hoodie and a tee already? The header only has the count, so with 2 pieces or more Salla is asked
  // once for the bag (and again when the count changes); until it answers, or if it can't, the answer is no
  var BAG = { n: -1, both: false };
  var bagBoth = function (n) {
    if (n < 2) return false;
    if (BAG.n === n) return BAG.both;
    BAG.n = n;
    BAG.both = false;
    if (window.salla && salla.cart && salla.cart.api && salla.cart.api.details) salla.cart.api.details().then(function (r) {
      var items = ((r && r.data && (r.data.cart || r.data)) || {}).items || [], h = 0, s = 0;
      items.forEach(function (i) {
        if (isHoodie(i.product_name || i.name || (i.product && i.product.name))) h++; else s++;
      });
      if (BAG.n !== n || BAG.both === (h > 0 && s > 0)) return;
      BAG.both = h > 0 && s > 0;
      packs();
    }, function () { /* stays no */ });
    return false;
  };
  // a product page: the offer as one card above the add button, as information only (Salla applies it in the bag). The
  // line on top says what this piece does: a hoodie's page asks for a tee, a tee's page for a hoodie; with both in the bag
  // already, it says the offer is on
  function packs() {
    var form = $('.product-form'), bar = form && $('.sticky-product-bar', form);
    if (!bar) return;
    var hoodie = isHoodie(pageTitle()), both = bagBoth(bagCount());
    var box = $('.um-packs', form), key = [hoodie, both, ar].join('|');
    if (box && box.getAttribute('data-k') === key) return;
    if (!box) {
      box = el('div', 'um-packs');
      box.setAttribute('aria-live', 'polite');
      bar.parentNode.insertBefore(box, bar);
    }
    box.setAttribute('data-k', key);
    var msg = both ? t('\u0627\u0644\u0639\u0631\u0636 \u0645\u0641\u0639\u0651\u0644 \u0641\u064a \u0633\u0644\u062a\u0643: \u0627\u0644\u062a\u064a\u0634\u064a\u0631\u062a \u0628\u0646\u0635 \u0627\u0644\u0633\u0639\u0631 \u0648\u0627\u0644\u0634\u062d\u0646 \u0645\u062c\u0627\u0646\u064a.', 'The offer is on in your bag: the tee is half price and shipping is free.')
      : hoodie ? t('\u0623\u0636\u0641 \u0623\u064a \u062a\u064a\u0634\u064a\u0631\u062a \u0645\u0639 \u0647\u0630\u0627 \u0627\u0644\u0647\u0648\u062f\u064a\u060c \u0648\u0627\u0644\u062a\u064a\u0634\u064a\u0631\u062a \u0628\u0646\u0635 \u0627\u0644\u0633\u0639\u0631 \u0648\u0627\u0644\u0634\u062d\u0646 \u0645\u062c\u0627\u0646\u064a.', 'Add any tee with this hoodie: the tee is half price and shipping is free.')
      : t('\u0645\u0639 \u0623\u064a \u0647\u0648\u062f\u064a\u060c \u0647\u0630\u0627 \u0627\u0644\u062a\u064a\u0634\u064a\u0631\u062a \u0628\u0646\u0635 \u0627\u0644\u0633\u0639\u0631 \u0648\u0627\u0644\u0634\u062d\u0646 \u0645\u062c\u0627\u0646\u064a.', 'With any hoodie, this tee is half price and shipping is free.');
    box.innerHTML = '<p class="um-packs__head">' + msg + '</p><div class="um-packs__row">' + packCard(both) + '</div>';
  }
  // the cart: how many pieces, what is in the bag (hoodies, tees), what is missing for the offer, and the shipping
  var rowQty = function (q) {
    var i = q && $('input', q);
    return q ? parseInt((i && i.value) || q.getAttribute('value'), 10) || 0 : 0;
  };
  var cartCount = function () {
    return $$('form[id^="item-"] salla-quantity-input').reduce(function (n, q) { return n + rowQty(q); }, 0);
  };
  // each row is a hoodie or a tee, told by the name on it
  var bagMix = function () {
    var mix = { hoodie: 0, tee: 0 };
    $$('form[id^="item-"]').forEach(function (f) {
      var name = ($('.cart-item h1', f) || $('h1', f) || f).textContent;
      mix[isHoodie(name) ? 'hoodie' : 'tee'] += rowQty($('salla-quantity-input', f));
    });
    return mix;
  };
  // a box for a discount code on the cart page (owner, 2026-11-09): Raed's cart has none, Salla only asks at checkout.
  // Whether a code adds to the offer is Salla's call (the offer's own setting); after a code applies or goes, the page
  // reloads so every row, the offer bar and the totals show Salla's new numbers
  function couponBox() {
    if (!/\/cart(\/|$|\?)/.test(location.pathname) || !window.salla || !salla.cart || !salla.cart.api) return;
    var card = $('salla-cart-summary-card'), ship = $('#free-shipping');
    // on phones Salla moves its summary to the end of the page (a fixed bar), so the box goes in the summary's column:
    // before the summary on a computer, under the free-shipping card on a phone
    var col = (card && card.parentNode !== document.body && card.parentNode) || (ship && ship.parentNode);
    if (!col || !cartCount() || $('.um-coupon')) return;
    var box = el('section', 'um-coupon');
    col.insertBefore(box, card && card.parentNode === col ? card : ship && ship.parentNode === col ? ship.nextSibling : col.firstChild);
    var reload = function () { location.reload(); };
    var draw = function (code) {
      box.innerHTML = code
        ? '<p class="um-coupon__on"><span>' + t('\u0643\u0648\u062f \u0627\u0644\u062e\u0635\u0645', 'Discount code') + ' <b dir="ltr">' + esc(code) + '</b> ' + t('\u0645\u0641\u0639\u0651\u0644', 'applied') + '</span>' +
          '<button type="button" class="um-coupon__del">' + t('\u0625\u0632\u0627\u0644\u0629', 'Remove') + '</button></p>'
        : '<label class="um-coupon__label" for="um-coupon-in">' + t('\u0639\u0646\u062f\u0643 \u0643\u0648\u062f \u062e\u0635\u0645\u061f', 'Got a discount code?') + '</label>' +
          '<div class="um-coupon__row"><input id="um-coupon-in" class="um-coupon__in" type="text" dir="ltr" autocomplete="off" spellcheck="false" placeholder="' + t('\u0627\u0643\u062a\u0628 \u0627\u0644\u0643\u0648\u062f', 'Enter the code') + '">' +
          '<button type="button" class="um-coupon__go">' + t('\u062a\u0637\u0628\u064a\u0642', 'Apply') + '</button></div>' +
          '<p class="um-coupon__err" role="alert" hidden></p>';
    };
    var fail = function (e) {
      var m = e && e.response && e.response.data && e.response.data.error && e.response.data.error.message;
      var p = $('.um-coupon__err', box), go = $('.um-coupon__go', box);
      if (go) { go.disabled = false; go.textContent = t('\u062a\u0637\u0628\u064a\u0642', 'Apply'); }
      if (p) { p.textContent = m || t('\u0627\u0644\u0643\u0648\u062f \u063a\u064a\u0631 \u0635\u062d\u064a\u062d \u0623\u0648 \u0627\u0646\u062a\u0647\u0649.', 'This code is not valid.'); p.hidden = false; }
    };
    var apply = function () {
      var inp = $('.um-coupon__in', box), go = $('.um-coupon__go', box), code = inp ? inp.value.trim() : '';
      if (!code) { if (inp) inp.focus(); return; }
      go.disabled = true;
      go.textContent = '\u2026';
      $('.um-coupon__err', box).hidden = true;
      salla.cart.api.addCoupon(code).then(reload, fail);
    };
    box.addEventListener('click', function (e) {
      if (e.target.closest('.um-coupon__go')) apply();
      var del = e.target.closest('.um-coupon__del');
      if (del) { del.disabled = true; salla.cart.api.deleteCoupon().then(reload, reload); }
    });
    box.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.classList.contains('um-coupon__in')) { e.preventDefault(); apply(); } });
    draw('');
    salla.cart.api.details().then(function (r) {
      var c = r && r.data && r.data.cart && r.data.cart.coupon, code = c && (typeof c === 'string' ? c : c.code);
      if (code) draw(code);
    }, function () { /* keeps the empty box */ });
  }
  // the bar under \u00ab\u0633\u0644\u062a\u0643\u00bb: two steps (a hoodie, a tee), lit for what is in the bag; what to add, with a button to the
  // hoodies or the tees; and the shipping, free once both are in
  function offerBar() {
    if (!/\/cart(\/|$|\?)/.test(location.pathname)) return;
    var mix = bagMix(), h = mix.hoodie > 0, s = mix.tee > 0, box = $('.um-offer');
    if (!h && !s) { if (box) box.remove(); return; }
    if (!box) {
      var anchor = $('.um-cart-title');
      if (!anchor) return;
      box = el('section', 'um-offer');
      box.setAttribute('aria-live', 'polite');
      anchor.parentNode.insertBefore(box, anchor.nextSibling);
    }
    var on = h && s, go = on ? '' : s ? hoodiesUrl() : teesUrl();
    var key = [h, s, ar, go].join('|');
    if (box.getAttribute('data-k') === key) return;
    box.setAttribute('data-k', key);
    var msg = on ? t('\u062a\u0645 \u062a\u0641\u0639\u064a\u0644 \u0627\u0644\u0639\u0631\u0636: \u0627\u0644\u062a\u064a\u0634\u064a\u0631\u062a \u0628\u0646\u0635 \u0627\u0644\u0633\u0639\u0631 \u0648\u0627\u0644\u0634\u062d\u0646 \u0645\u062c\u0627\u0646\u064a', 'Offer on: the tee is half price and shipping is free')
      : s ? t('\u0623\u0636\u0641 \u0647\u0648\u062f\u064a\u060c \u0648\u0627\u0644\u062a\u064a\u0634\u064a\u0631\u062a \u0628\u0646\u0635 \u0627\u0644\u0633\u0639\u0631 \u0648\u0627\u0644\u0634\u062d\u0646 \u0645\u062c\u0627\u0646\u064a', 'Add a hoodie: the tee is then half price and shipping is free')
      : t('\u0623\u0636\u0641 \u062a\u064a\u0634\u064a\u0631\u062a\u060c \u0648\u062a\u0627\u062e\u0630\u0647 \u0628\u0646\u0635 \u0627\u0644\u0633\u0639\u0631 \u0648\u0627\u0644\u0634\u062d\u0646 \u0645\u062c\u0627\u0646\u064a', 'Add a tee: you get it at half price, with free shipping');
    var steps = [[h, t('\u0647\u0648\u062f\u064a', 'Hoodie')], [s, t('\u062a\u064a\u0634\u064a\u0631\u062a', 'Tee')]].map(function (k) {
      return '<i class="' + (k[0] ? 'is-on' : '') + '"><span>' + k[1] + '</span></i>';
    }).join('');
    box.innerHTML = '<div class="um-offer__steps" aria-hidden="true">' + steps + '</div>' +
      '<p class="um-offer__msg">' + msg + '</p>' +
      '<p class="um-offer__sum">' + (on ? '<b>' + t('\u0627\u0644\u0634\u062d\u0646 \u0645\u062c\u0627\u0646\u064a', 'Free shipping') + '</b>'
        : t('\u0627\u0644\u0634\u062d\u0646 ', 'Shipping ') + money(PACK.ship) + t('\u060c \u0648\u0645\u062c\u0627\u0646\u064a \u0645\u0639 \u0647\u0648\u062f\u064a + \u062a\u064a\u0634\u064a\u0631\u062a', ', free with a hoodie + a tee')) + '</p>' +
      (on ? '' : '<a class="um-offer__go" href="' + esc(go) + '">' + (s ? t('\u0627\u062e\u062a\u0631 \u0647\u0648\u062f\u064a', 'Pick a hoodie') : t('\u0627\u062e\u062a\u0631 \u062a\u064a\u0634\u064a\u0631\u062a', 'Pick a tee')) + '</a>');
    $('.um-offer__steps', box).style.gridTemplateColumns = 'repeat(2, 1fr)';   // the CSS has room for four steps
  }
  // amounts as Salla writes them (Arabic digits, \u00ab\u066b\u00bb, thousands commas), as numbers
  var amount = function (s) {
    var m = String(s || '').replace(/[\u0660-\u0669]/g, function (d) { return d.charCodeAt(0) - 0x660; }).replace(/\u066b/g, '.').replace(/[\u066c,]/g, '').match(/\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : NaN;
  };
  var flag = function (n, k, on) { if (n.hasAttribute(k) !== on) n.toggleAttribute(k, on); };
  // the cart rows' offer bits (unmuted-raed.css acts on the flags): an offer line worth under a riyal goes whole
  // (data-um-zero); a row at its own price loses the struck old price (data-um-same); a row Salla gives for 0 reads
  // \u00ab\u0647\u062f\u064a\u062a\u0643 \u00b7 \u0645\u062c\u0627\u0646\u0627\u064b\u00bb instead of its price and total, with no quantity buttons (data-um-gift). Only flags and words:
  // Salla's numbers stay. Salla's own offer banner goes for good (CSS): the .um-offer bar says it all already
  function offerZero() {
    if (!/\/cart(\/|$|\?)/.test(location.pathname)) return;
    $$('salla-cart-item-offers').forEach(function (o) {
      var d = $('.s-cart-item-offers-discount', o);
      flag(o, 'data-um-zero', !!d && amount(d.textContent) < 0.01);
    });
    $$('form[id^="item-"]').forEach(function (f) {
      var was = $('.item-regular-price', f), now = $('[data-testid="store-cart-item-price"]', f), tot = $('[data-testid="store-cart-item-total"]', f);
      var gift = !!now && amount(now.textContent) === 0;
      flag(f, 'data-um-same', !!was && !!now && Math.abs(amount(was.textContent) - amount(now.textContent)) < 1);
      flag(f, 'data-um-gift', gift);
      if (gift && !$('.um-gift-tag', f)) now.insertAdjacentHTML('afterend', '<span class="um-gift-tag">' + t('\u0647\u062f\u064a\u062a\u0643 \u00b7 \u0645\u062c\u0627\u0646\u0627\u064b', 'Your gift \u00b7 free') + '</span>');
      if (gift && tot && !$('.um-gift-total', f)) tot.insertAdjacentHTML('afterend', '<span class="um-gift-total">' + t('\u0645\u062c\u0627\u0646\u0627\u064b', 'Free') + '</span>');
    });
    var card = $('salla-cart-summary-card');
    var save = card && ($('.s-cart-summary-card-line--discount b', card) || $('.s-cart-summary-card-bar-savings-badge', card));
    if (card) { flag(card, 'data-um-nosave', !!save && amount(save.textContent) < 1); summaryShip(card); }
  }
  // Salla's summary has every line before VAT, so the 40 shipping (VAT included since 2026-11-04) read \u00ab\u0663\u0664\u066b\u0667\u0668\u00bb (owner: \u00ab\u0644\u064a\u0647 \u0645\u0634
  // \u0645\u0643\u062a\u0648\u0628 40\u00bb). It shows the 40, and the VAT line without shipping's part, so the lines still add up to Salla's total. Only
  // the text in Salla's own nodes changes, so Salla can still redraw them; any other shipping rate keeps Salla's numbers
  function summaryShip(card) {
    var lines = $$('.s-cart-summary-card-line', card);
    var cell = function (re) {
      var l = lines.filter(function (x) { return re.test(($('span', x) || {}).textContent || ''); })[0], n = l && $('b', l) && $('b', l).firstChild;
      return n && n.nodeType === 3 ? n : null;
    };
    var raw = function (n) { if (n.data !== n.umWrote) n.umRaw = amount(n.data); return n.umRaw; };
    var put = function (n, v) { n.umWrote = moneyNum(v) + ' '; if (n.data !== n.umWrote) n.data = n.umWrote; };
    var ship = cell(/^\s*(\u0631\u0633\u0648\u0645 \u0627\u0644\u0634\u062d\u0646|shipping)/i), vat = cell(/^\s*(\u0636\u0631\u064a\u0628\u0629 \u0627\u0644\u0642\u064a\u0645\u0629|vat)/i);
    if (!ship || !vat) return;
    var S = raw(ship), V = raw(vat), on = Math.abs(S * 1.15 - PACK.ship) < 0.02;
    if (!isFinite(S) || !isFinite(V)) return;
    put(ship, on ? PACK.ship : S);
    put(vat, on ? Math.round((V - (PACK.ship - S)) * 100) / 100 : V);
  }
  // the old \u00abpick your free tee\u00bb window (freePick, further down) belonged to the 4th-tee deal, which is off: it opens no more
  if (typeof freePick === 'function') freePick = function () {};
  // the \u00ab\u0628\u0643\u062c\u0627\u062a\u00bb page (Salla's info page #72145634, linked in the header): the offer as the UNMUTED store's Duo card (tilted
  // photos, a big line, the price and one button), a bordered card (owner: no products on this page, our own photos). Its
  // pair: a hoodie from the winter shoot (Riyadh, from the back, so the print shows) and a tee from the couple shots.
  // Made when the page is drawn, so the photo addresses and the hoodies' link are there by then
  var DUO_PICS = 'https://cdn.jsdelivr.net/gh/unmutedsa/unmuted-raed@e4a1e42404b44ff875112a268dd835a8512db142/cdn/photos/duo/';
  // the winter photos for the offer card (the hoodie), in the commit CDN_REF pins
  var DUO_WINTER = CDN + '/photos/duo/';
  var duoCards = function () {
    return [
      { id: 'hoodie-tee', tone: 'blue', pics: [DUO_WINTER + 'hoodie-riyadh.webp', DUO_PICS + 'unmuted-sticker.webp'],
        badge: t('\u0627\u0644\u062a\u064a\u0634\u064a\u0631\u062a<br>\u0628\u0646\u0635 \u0627\u0644\u0633\u0639\u0631', 'The tee<br>half price'),
        // longer words than the old \u00ab\u062e\u0635\u0645 \u0661\u0665\u066a\u00bb: a slightly bigger circle and smaller letters, so they stay inside it
        fit: { width: 'clamp(86px, 8vw, 100px)', height: 'clamp(86px, 8vw, 100px)', fontSize: 'clamp(12px, 1.1vw, 13px)' },
        title: t('\u0647\u0648\u062f\u064a \u0648\u062a\u064a\u0634\u064a\u0631\u062a. \u0627\u0644\u062b\u0627\u0646\u064a \u0628\u0646\u0635 \u0627\u0644\u0633\u0639\u0631.', 'A hoodie and a tee. The second is half price.'),
        deal: t('\u0627\u0634\u062a\u0631\u0650 \u0623\u064a \u0647\u0648\u062f\u064a\u060c \u0648\u0623\u064a \u062a\u064a\u0634\u064a\u0631\u062a \u0645\u0639\u0647 \u0628\u0646\u0635 \u0627\u0644\u0633\u0639\u0631\u060c \u0648\u0627\u0644\u0634\u062d\u0646 \u0645\u062c\u0627\u0646\u064a.', 'Buy any hoodie, and any tee with it is half price, with free shipping.'),
        total: DEAL.total, was: DEAL.was, free: true, go: t('\u0627\u062e\u062a\u0631 \u0647\u0648\u062f\u064a\u0643', 'Pick your hoodie'), href: hoodiesUrl() }
    ];
  };
  function duoPage() {
    if (location.pathname.indexOf('page-' + PACK.page) < 0) return;
    var main = $('#main-content');
    if (!main || $('.um-duo-page')) return;
    var entry = $('.content--single-page .content-entry') || $('.content-entry');
    document.body.classList.add('um-duo-on');
    var cards = duoCards();
    var page = el('div', 'um-duo-page',
      '<header class="um-duo-page__head"><h1>' + t('\u0628\u0643\u062c\u0627\u062a', 'Packages') + '</h1><p>' + t('\u0647\u0648\u062f\u064a \u0648\u062a\u064a\u0634\u064a\u0631\u062a \u0628\u0646\u0635 \u0627\u0644\u0633\u0639\u0631\u060c \u0648\u0627\u0644\u0634\u062d\u0646 \u0645\u062c\u0627\u0646\u064a. \u0627\u0644\u0639\u0631\u0636 \u064a\u062a\u0637\u0628\u0642 \u062a\u0644\u0642\u0627\u0626\u064a\u0627\u064b \u0641\u064a \u0627\u0644\u0633\u0644\u0629.', 'A hoodie and a tee at half price, with free shipping. It applies by itself in your bag.') + '</p></header>' +
      cards.map(function (c, n) {
        return '<section class="um-duo is-' + c.tone + (n % 2 ? ' is-flip' : '') + '" aria-labelledby="um-duo-' + c.id + '">' +
          '<div class="um-duo__pic' + (c.pics.length > 1 ? ' is-pair' : '') + '">' + c.pics.map(function (src) {
            return '<figure class="um-duo__photo"><img src="' + esc(src) + '" alt="" width="880" height="1100" loading="lazy"></figure>';
          }).join('') + '<span class="um-duo__badge" aria-hidden="true">' + c.badge + '</span></div>' +
          '<div class="um-duo__text">' +
            '<h2 id="um-duo-' + c.id + '">' + c.title + '</h2>' +
            '<p class="um-duo__price">' + money(c.total) + '<s aria-label="' + t('\u0628\u062f\u0644 ', 'instead of ') + c.was + '">' + money(c.was) + '</s></p>' +
            '<ul class="um-duo__facts"><li>' + t('\u062a\u0648\u0641\u0651\u0631 ', 'You save ') + money(c.was - c.total) + '</li>' +
              '<li' + (c.free ? ' class="is-free"' : '') + '>' + (c.free ? t('\u0634\u062d\u0646 \u0645\u062c\u0627\u0646\u064a', 'Free shipping') : t('\u0627\u0644\u0634\u062d\u0646 ', 'Shipping ') + money(PACK.ship)) + '</li></ul>' +
            '<p class="um-duo__deal">' + c.deal + ' ' + t('\u0627\u0644\u062e\u0635\u0645 \u064a\u062a\u0637\u0628\u0651\u0642 \u062a\u0644\u0642\u0627\u0626\u064a\u0627\u064b \u0641\u064a \u0627\u0644\u0633\u0644\u0629.', 'It comes off by itself in your bag.') + '</p>' +
            '<a class="um-duo__go" href="' + esc(c.href) + '">' + c.go + '</a>' +
          '</div>' +
        '</section>';
      }).join(''));
    $$('.um-duo__badge', page).forEach(function (b, n) {
      var fit = cards[n].fit || {};
      Object.keys(fit).forEach(function (k) { b.style[k] = fit[k]; });
    });
    main.insertBefore(page, main.firstChild);
    var box = entry && entry.closest('section, .container, article');
    if (box) box.style.display = 'none';
  }

  // Salla's \u00abadded to your bag\u00bb popup (salla-add-product-toast) reads its words once, when it is made; if the store's
  // translations arrive later it can keep the raw keys (owner's screenshot 2026-11-03: \u00abpages.cart.added_to_cart\u00bb,
  // \u00abpages.cart.complete_order\u00bb). Give it the words, and fix any key it has already drawn
  var TOAST = {
    successMessage: ['pages.cart.added_to_cart', t('\u062a\u0645\u062a \u0627\u0644\u0625\u0636\u0627\u0641\u0629 \u0625\u0644\u0649 \u0627\u0644\u0633\u0644\u0629', 'Added to your bag')],
    viewCartText: ['pages.cart.view_cart', t('\u0639\u0631\u0636 \u0627\u0644\u0633\u0644\u0629', 'View bag')],
    checkoutText: ['pages.cart.complete_order', t('\u0625\u062a\u0645\u0627\u0645 \u0627\u0644\u0637\u0644\u0628', 'Checkout')],
    showMoreText: ['pages.checkout.show_more', t('\u0639\u0631\u0636 \u0627\u0644\u0645\u0632\u064a\u062f', 'Show more')]
  };
  var toastWord = function (k) {
    var key = TOAST[k][0], got = window.salla && salla.lang && salla.lang.get ? salla.lang.get(key) : key;
    return got && got !== key ? got : TOAST[k][1];
  };
  function toastText() {
    var box = $('salla-add-product-toast');
    if (!box) return;
    var byKey = {};
    Object.keys(TOAST).forEach(function (k) {
      byKey[TOAST[k][0]] = k;
      if (typeof box[k] === 'string' && box[k].indexOf(TOAST[k][0]) === 0) box[k] = toastWord(k);
    });
    if (!/pages\.(cart|checkout)\./.test(box.textContent)) return;
    var walk = document.createTreeWalker(box, NodeFilter.SHOW_TEXT), n;
    while ((n = walk.nextNode())) {
      var k = byKey[n.nodeValue.trim()];
      if (k) n.nodeValue = toastWord(k);
    }
  }

  // a tee's card in a list (\u0627\u062e\u062a\u0631 \u0635\u0648\u062a\u0643, the albums, the home, \u00abyou may like\u00bb): Salla's add button put the tee in the bag
  // with a size Salla picked itself (owner 2026-11-03: \u00ab\u0644\u0627\u0632\u0645 \u0627\u062e\u062a\u064a\u0627\u0631 \u0627\u0644\u0645\u0642\u0627\u0633 \u0628\u0627\u0644\u0623\u0648\u0644\u00bb). Now the button opens a size picker
  // and the tee goes in only with the size chosen. A product with no required option, or more than one, opens its page
  var OPTS = {};
  var detailsOf = function (id) {
    return OPTS[id] || (OPTS[id] = salla.api.product.getDetails(id, ['options']).then(function (r) { if (r.data) r.data.name = bare(r.data.name); return r.data; }, function (e) { delete OPTS[id]; throw e; }));
  };
  function sizePick(btn) {
    var id = btn.getAttribute('product-id');
    var link = $('a[href*="/p' + id + '"]');
    var page = function (d) { var u = (d && d.url) || (link && link.href); if (u) location.href = u; };
    btn.setAttribute('aria-busy', 'true');
    detailsOf(id).then(function (d) {
      btn.removeAttribute('aria-busy');
      var need = (d.options || []).filter(function (o) { return o.required; });
      if (need.length !== 1 || !(need[0].details || []).length) return page(d);
      var opt = need[0], chosen = null;
      var pic = (d.image && d.image.url) || (d.images && d.images[0] && d.images[0].url) || '';
      var box = el('div', 'um-pick',
        '<div class="um-pick__box" role="dialog" aria-modal="true" aria-labelledby="um-pick-t" tabindex="-1">' +
          '<button type="button" class="um-pick__x" aria-label="' + t('\u0625\u063a\u0644\u0627\u0642', 'Close') + '">&times;</button>' +
          '<div class="um-pick__head">' + (pic ? '<img src="' + esc(pic) + '" alt="">' : '') + '<p class="um-pick__name" id="um-pick-t">' + esc(d.name || '') + '</p></div>' +
          '<p class="um-pick__label" id="um-pick-l">' + esc(opt.name || t('\u0627\u0644\u0645\u0642\u0627\u0633', 'Size')) + '</p>' +
          '<div class="um-pick__sizes" role="radiogroup" aria-labelledby="um-pick-l">' + opt.details.map(function (v) {
            return '<button type="button" class="um-tile" role="radio" aria-checked="false" data-v="' + v.id + '"' + (v.is_out ? ' disabled' : '') + '>' + esc(v.name) + '</button>';
          }).join('') + '</div>' +
          '<p class="um-pick__err" role="alert"></p>' +
          '<button type="button" class="um-pick__add" aria-disabled="true">' + t('\u0623\u0636\u0641 \u0644\u0644\u0633\u0644\u0629', 'Add to bag') + '</button>' +
        '</div>');
      var err = $('.um-pick__err', box), add = $('.um-pick__add', box), tiles = $$('.um-tile', box);
      var close = function () { box.remove(); document.removeEventListener('keydown', key, true); document.documentElement.classList.remove('um-pick-on'); btn.focus && (btn.querySelector('button') || btn).focus(); };
      var key = function (e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
      box.addEventListener('click', function (e) { if (e.target === box || e.target.closest('.um-pick__x')) close(); });
      tiles.forEach(function (b) {
        b.addEventListener('click', function () {
          chosen = b.getAttribute('data-v');
          tiles.forEach(function (x) { x.setAttribute('aria-checked', String(x === b)); });
          add.setAttribute('aria-disabled', 'false');
          err.textContent = '';
        });
      });
      add.addEventListener('click', function () {
        if (!chosen) { err.textContent = t('\u0627\u062e\u062a\u0631 \u0627\u0644\u0645\u0642\u0627\u0633 \u0623\u0648\u0644\u0627\u064b', 'Pick a size first'); (tiles.filter(function (x) { return !x.disabled; })[0] || add).focus(); return; }
        if (add.classList.contains('is-busy')) return;
        add.classList.add('is-busy');
        var options = {}; options[opt.id] = +chosen;
        salla.cart.addItem({ id: +id, quantity: 1, options: options }).then(function () {
          close();
          // Salla's \u00abadded to your bag\u00bb popup only listens to its own button: open it for the line just added
          var toast = $('salla-add-product-toast');
          if (!toast || !toast.handleProductAdded) return;
          salla.cart.api.details(null, ['options']).then(function (r) {
            var items = ((r.data && (r.data.cart || r.data)) || {}).items || [];
            var it = items.filter(function (i) {
              return String(i.product_id) === String(id) && (i.options || []).some(function (o) {
                return (o.details || []).some(function (x) { return x.is_selected && String(x.id) === String(chosen); });
              });
            })[0];
            if (it) toast.handleProductAdded([{ cart_item_id: it.id }]);
          });
        }, function () {
          add.classList.remove('is-busy');
          err.textContent = t('\u0645\u0627 \u0627\u0646\u0636\u0627\u0641\u060c \u062c\u0631\u0651\u0628 \u0645\u0631\u0629 \u062b\u0627\u0646\u064a\u0629', 'It was not added, try again');
        });
      });
      document.addEventListener('keydown', key, true);
      document.body.appendChild(box);
      document.documentElement.classList.add('um-pick-on');
      $('.um-pick__box', box).focus();   // the box, not a size: no size may look picked before the customer picks one
    }, function () { btn.removeAttribute('aria-busy'); page(); });
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('salla-add-product-button');
    if (!btn || btn.closest('.product-form, .um-dock')) return;
    if (btn.getAttribute('product-status') !== 'sale' || (btn.getAttribute('product-type') || 'product') !== 'product') return;
    if (!btn.getAttribute('product-id') || !(window.salla && salla.api && salla.cart)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (btn.getAttribute('aria-busy') !== 'true') sizePick(btn);
  }, true);

  // the free tee (owner's PDF \u00ab\u0645\u0644\u062e\u0635 \u062a\u0646\u0641\u064a\u0630 \u0639\u0631\u0636 Unmuted\u00bb: at 3 tees a window to pick the free one, which the customer can
  // skip): the tees in a grid, then the chosen one's sizes; it goes in the bag as the 4th and the offer makes it free.
  // It opens by itself once a visit when the bag reaches 3 (offerBar), and from the bar's \u00ab\u0627\u062e\u062a\u0631 \u0642\u0637\u0639\u062a\u0643 \u0627\u0644\u0645\u062c\u0627\u0646\u064a\u0629\u00bb
  var TEES = null;
  var teesAll = function () {
    return TEES || (TEES = salla.product.fetch({ source: 'categories', source_value: [ALL_CAT], limit: 30 }).then(function (r) {
      return ((r && r.data) || []).filter(function (p) { return p.status === 'sale' && p.is_available !== false && (p.type || 'product') === 'product'; })
        .map(function (p) { p.name = bare(p.name); return p; });
    }, function (e) { TEES = null; throw e; }));
  };
  function freePick() {
    if ($('.um-pick') || !(window.salla && salla.product && salla.cart)) return;
    var opener = document.activeElement;
    var box = el('div', 'um-pick um-free',
      '<div class="um-pick__box" role="dialog" aria-modal="true" aria-labelledby="um-free-t" tabindex="-1">' +
        '<button type="button" class="um-pick__x" aria-label="' + t('\u0625\u063a\u0644\u0627\u0642', 'Close') + '">&times;</button>' +
        '<div class="um-free__body"></div>' +
        '<button type="button" class="um-free__skip">' + t('\u062a\u062e\u0637\u064e\u0651 \u0627\u0644\u062d\u064a\u0646', 'Skip for now') + '</button>' +
      '</div>');
    var body = $('.um-free__body', box);
    var close = function () { box.remove(); document.removeEventListener('keydown', key, true); document.documentElement.classList.remove('um-pick-on'); if (opener && opener.focus) opener.focus(); };
    var key = function (e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
    box.addEventListener('click', function (e) { if (e.target === box || e.target.closest('.um-pick__x, .um-free__skip')) close(); });
    function grid() {
      body.innerHTML = '<p class="um-pick__name um-free__title" id="um-free-t">' + t('\u0627\u062e\u062a\u0631 \u0642\u0637\u0639\u062a\u0643 \u0627\u0644\u0645\u062c\u0627\u0646\u064a\u0629', 'Pick your free tee') + '</p>' +
        '<p class="um-free__sub">' + t('\u0627\u0644\u0631\u0627\u0628\u0639\u0629 \u0639\u0644\u064a\u0646\u0627. \u0627\u062e\u062a\u0631 \u0627\u0644\u062a\u064a\u0634\u064a\u0631\u062a \u0648\u0628\u0639\u062f\u0647\u0627 \u0627\u0644\u0645\u0642\u0627\u0633.', 'The fourth is on us. Pick the tee, then its size.') + '</p>' +
        '<div class="um-free__grid" aria-busy="true"></div><p class="um-pick__err" role="alert"></p>';
      var g = $('.um-free__grid', body);
      teesAll().then(function (list) {
        g.removeAttribute('aria-busy');
        g.innerHTML = list.map(function (p) {
          return '<button type="button" class="um-free__tee" data-id="' + esc(p.id) + '"><img src="' + esc(backFirst(p.id) ? backPhoto(p.id) : imageOf(p)) + '" alt="" loading="lazy"><span>' + esc(p.name) + '</span></button>';
        }).join('');
        $$('.um-free__tee', g).forEach(function (b) { b.addEventListener('click', function () { sizes(b.getAttribute('data-id')); }); });
      }, function () {
        g.removeAttribute('aria-busy');
        $('.um-pick__err', body).textContent = t('\u0645\u0627 \u0642\u062f\u0631\u0646\u0627 \u0646\u062c\u064a\u0628 \u0627\u0644\u062a\u064a\u0634\u064a\u0631\u062a\u0627\u062a\u060c \u062c\u0631\u0651\u0628 \u0645\u0631\u0629 \u062b\u0627\u0646\u064a\u0629', 'The tees did not load, try again');
      });
    }
    function sizes(id) {
      body.setAttribute('aria-busy', 'true');
      detailsOf(id).then(function (d) {
        body.removeAttribute('aria-busy');
        var need = (d.options || []).filter(function (o) { return o.required; });
        if (need.length !== 1 || !(need[0].details || []).length) { if (d.url) location.href = d.url; return; }
        var opt = need[0], chosen = null, pic = (d.image && d.image.url) || '';
        body.innerHTML = '<button type="button" class="um-free__back">' + t('\u0631\u062c\u0648\u0639 \u0644\u0644\u062a\u064a\u0634\u064a\u0631\u062a\u0627\u062a', 'Back to the tees') + '</button>' +
          '<div class="um-pick__head">' + (pic ? '<img src="' + esc(pic) + '" alt="">' : '') + '<p class="um-pick__name" id="um-free-t">' + esc(d.name || '') + '</p></div>' +
          '<p class="um-pick__label" id="um-free-l">' + esc(opt.name || t('\u0627\u0644\u0645\u0642\u0627\u0633', 'Size')) + '</p>' +
          '<div class="um-pick__sizes" role="radiogroup" aria-labelledby="um-free-l">' + opt.details.map(function (v) {
            return '<button type="button" class="um-tile" role="radio" aria-checked="false" data-v="' + v.id + '"' + (v.is_out ? ' disabled' : '') + '>' + esc(v.name) + '</button>';
          }).join('') + '</div>' +
          '<p class="um-pick__err" role="alert"></p>' +
          '<button type="button" class="um-pick__add" aria-disabled="true">' + t('\u0623\u0636\u0641 \u0642\u0637\u0639\u062a\u0643 \u0627\u0644\u0645\u062c\u0627\u0646\u064a\u0629', 'Add your free tee') + '</button>';
        var err = $('.um-pick__err', body), add = $('.um-pick__add', body), tiles = $$('.um-tile', body);
        $('.um-free__back', body).addEventListener('click', function () { grid(); $('.um-pick__box', box).focus(); });
        tiles.forEach(function (b) {
          b.addEventListener('click', function () {
            chosen = b.getAttribute('data-v');
            tiles.forEach(function (x) { x.setAttribute('aria-checked', String(x === b)); });
            add.setAttribute('aria-disabled', 'false');
            err.textContent = '';
          });
        });
        add.addEventListener('click', function () {
          if (!chosen) { err.textContent = t('\u0627\u062e\u062a\u0631 \u0627\u0644\u0645\u0642\u0627\u0633 \u0623\u0648\u0644\u0627\u064b', 'Pick a size first'); return; }
          if (add.classList.contains('is-busy')) return;
          add.classList.add('is-busy');
          var options = {}; options[opt.id] = +chosen;
          // the bag page draws its rows once, so it comes back with the 4th tee in (the bar then says the offer is on)
          salla.cart.addItem({ id: +id, quantity: 1, options: options }).then(function () { location.reload(); }, function () {
            add.classList.remove('is-busy');
            err.textContent = t('\u0645\u0627 \u0627\u0646\u0636\u0627\u0641\u060c \u062c\u0631\u0651\u0628 \u0645\u0631\u0629 \u062b\u0627\u0646\u064a\u0629', 'It was not added, try again');
          });
        });
        $('.um-pick__box', box).focus();
      }, function () {
        body.removeAttribute('aria-busy');
        var e = $('.um-pick__err', body);
        if (e) e.textContent = t('\u0645\u0627 \u0642\u062f\u0631\u0646\u0627 \u0646\u0641\u062a\u062d \u0627\u0644\u062a\u064a\u0634\u064a\u0631\u062a\u060c \u062c\u0631\u0651\u0628 \u0645\u0631\u0629 \u062b\u0627\u0646\u064a\u0629', 'That tee did not open, try again');
      });
    }
    grid();
    document.addEventListener('keydown', key, true);
    document.body.appendChild(box);
    document.documentElement.classList.add('um-pick-on');
    $('.um-pick__box', box).focus();
  }
  // once a visit, by itself, when the bag reaches 3 (no storage, no asking by itself: only the bar's button)
  var freeOnce = function () {
    try { if (sessionStorage.getItem('um-free-asked')) return; sessionStorage.setItem('um-free-asked', '1'); } catch (e) { return; }
    setTimeout(freePick, 700);
  };
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-um-free]')) { e.preventDefault(); freePick(); }
  });

  /* the welcome code on WhatsApp (owner, 2026-11-03): a popup asks for a mobile number and the code reaches the customer
     on WhatsApp only. whatsapp-coupon/ (a Cloudflare Worker) checks the number and the visitor (Turnstile) and sends it;
     the code itself is never on the site. Off until WA.url is set. It opens once the visitor has looked around a while
     (or, on a computer, heads for the tabs), never on the cart, checkout or account pages, not over the home's loader or
     another dialog; closed \u2192 not again for 14 days, sent \u2192 never again. */
  var WA = { url: '', site: '', pct: 10 };   // url: the Worker's \u2026/coupon; site: the Turnstile site key; pct: the discount (title)
  var WA_KEY = 'um-wa';
  // its photo: the couple in the No Sharing tee by the containers (owner, 2026-11-08), full size beside the form on
  // computers, a smaller copy as a strip over the form on phones
  var WA_PIC = 'https://cdn.jsdelivr.net/gh/unmutedsa/unmuted-raed@f8ae57ddcff63c9de049efb3dde454fefb7133fe/cdn/photos/popup/';
  // a theme's preview (salla.sa/unmuted?preview=true, not the store's own address) shows the popup before WhatsApp is
  // connected, after 3 seconds and every visit, and sends nothing (owner, 2026-11-08: the popup in the draft copy first).
  // On unmutedsa.com it stays off until WA.url is set
  // (not inside the theme editor's frame, where it would cover the page being edited)
  var waDemo = function () { return !WA.url && !/(^|\.)unmutedsa\.com$/i.test(location.hostname) && window.top === window; };
  // a Saudi mobile in any common writing \u2192 9665XXXXXXXX, else '' (the Worker checks it the same way)
  var waPhone = function (raw) {
    var d = String(raw || '').replace(/[\u0660-\u0669]/g, function (c) { return c.charCodeAt(0) - 0x660; }).replace(/\D/g, '');
    if (d.indexOf('00') === 0) d = d.slice(2);
    if (d.indexOf('966') === 0) d = d.slice(3);
    if (d.charAt(0) === '0') d = d.slice(1);
    return /^5\d{8}$/.test(d) ? '966' + d : '';
  };
  function waOffer() {
    var demo = waDemo();
    if ((!WA.url && !demo) || window.__umWa) return;
    window.__umWa = true;
    if (/\/(cart|checkout|profile|orders|wishlist|notifications|login|register|payment|thank)/i.test(location.pathname)) return;
    var st = {};
    try { st = JSON.parse(localStorage.getItem(WA_KEY)) || {}; } catch (e) { /* private mode */ }
    if (!demo && (st.s === 'sent' || (st.s === 'closed' && Date.now() - (st.at || 0) < 14 * 864e5))) return;
    try { if (!demo && sessionStorage.getItem(WA_KEY)) return; } catch (e) { /* private mode */ }
    var shown = false, root = document.documentElement;
    var go = function () {
      if (shown) return;
      if (root.classList.contains('um-fit-lock') || (document.body.classList.contains('index') && !root.classList.contains('um-ready'))) return void setTimeout(go, 1500);
      shown = true;
      waOpen();
    };
    setTimeout(go, demo ? 3000 : 12000);
    document.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY <= 0 && performance.now() > 6000) go(); });
  }
  function waOpen() {
    var root = document.documentElement, prev = document.activeElement, demo = waDemo();
    var keep = function (s) { if (demo) return; try { localStorage.setItem(WA_KEY, JSON.stringify({ s: s, at: Date.now() })); } catch (e) { /* private mode */ } };
    try { sessionStorage.setItem(WA_KEY, '1'); } catch (e) { /* private mode */ }
    var pct = WA.pct ? arNum(WA.pct) + (ar ? '\u066a' : '%') : '';
    var veil = el('div', 'um-wa-veil'), box = el('div', 'um-wa');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-labelledby', 'um-wa-title');
    box.innerHTML = '<button type="button" class="um-wa-x" aria-label="' + t('\u0625\u063a\u0644\u0627\u0642', 'Close') + '">\u00d7</button>' +
      '<div class="um-wa-body"><form class="um-wa-form" novalidate>' +
        '<h2 id="um-wa-title">' + (pct ? t('\u062e\u0635\u0645 ' + pct + ' \u0639\u0644\u0649 \u0623\u0648\u0644 \u0635\u0648\u062a \u062a\u062e\u062a\u0627\u0631\u0647', pct + ' off your first voice') : t('\u0643\u0648\u062f \u062e\u0635\u0645 \u0644\u0623\u0648\u0644 \u0635\u0648\u062a \u062a\u062e\u062a\u0627\u0631\u0647', 'A code for your first voice')) + '</h2>' +
        '<p class="um-wa-sub">' + t('\u0627\u0643\u062a\u0628 \u0631\u0642\u0645 \u062c\u0648\u0627\u0644\u0643 \u0648\u0646\u0631\u0633\u0644 \u0644\u0643 \u0627\u0644\u0643\u0648\u062f \u0639\u0644\u0649 \u0627\u0644\u0648\u0627\u062a\u0633\u0627\u0628. \u0645\u0627 \u064a\u0638\u0647\u0631 \u0641\u064a \u0627\u0644\u0645\u0648\u0642\u0639\u060c \u064a\u0648\u0635\u0644\u0643 \u0623\u0646\u062a \u0628\u0633.', 'Leave your mobile number and we\u2019ll send the code on WhatsApp. It\u2019s not on the site; it\u2019s just for you.') + '</p>' +
        '<label class="um-wa-label" for="um-wa-phone">' + t('\u0631\u0642\u0645 \u0627\u0644\u062c\u0648\u0627\u0644', 'Mobile number') + '</label>' +
        '<div class="um-wa-field" dir="ltr"><span>+966</span><input id="um-wa-phone" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="5X XXX XXXX" maxlength="18"></div>' +
        '<p class="um-wa-err" role="alert" hidden></p>' +
        '<div class="um-wa-ts"></div>' +
        '<button type="submit" class="um-wa-go">' + t('\u0623\u0631\u0633\u0644 \u0627\u0644\u0643\u0648\u062f \u0639\u0644\u0649 \u0627\u0644\u0648\u0627\u062a\u0633\u0627\u0628', 'Send it on WhatsApp') + '</button>' +
        '<p class="um-wa-fine">' + t('\u0628\u0625\u0631\u0633\u0627\u0644 \u0631\u0642\u0645\u0643 \u062a\u0648\u0627\u0641\u0642 \u0625\u0646 UNMUTED \u062a\u0631\u0633\u0644 \u0644\u0643 \u0639\u0644\u0649 \u0627\u0644\u0648\u0627\u062a\u0633\u0627\u0628\u060c \u0648\u062a\u0642\u062f\u0631 \u062a\u0648\u0642\u0641\u0647\u0627 \u0645\u062a\u0649 \u0645\u0627 \u062a\u0628\u064a.', 'By sending your number you agree to hear from UNMUTED on WhatsApp; you can stop it any time.') + '</p>' +
        '<button type="button" class="um-wa-no">' + t('\u0644\u0627\u060c \u0634\u0643\u0631\u0627\u064b', 'No thanks') + '</button>' +
      '</form></div>' +
      '<div class="um-wa-pic" aria-hidden="true"><img alt="" src="' + WA_PIC + 'no-sharing-md.jpg" srcset="' + WA_PIC + 'no-sharing-md.jpg 749w, ' + WA_PIC + 'no-sharing.webp 1499w" sizes="(min-width: 720px) 330px, 100vw">' + (pct ? '<span class="um-wa-stk"><small>' + t('\u062e\u0635\u0645', 'off') + '</small>' + pct + '</span>' : '') + '</div>';
    veil.appendChild(box);
    document.body.appendChild(veil);
    root.classList.add('um-wa-lock');
    var form = $('.um-wa-form', box), input = $('#um-wa-phone', box), errEl = $('.um-wa-err', box), goBtn = $('.um-wa-go', box);
    var sent = false, token = '', wid = null;
    var close = function () {
      if (!sent) keep('closed');
      veil.remove();
      root.classList.remove('um-wa-lock');
      removeEventListener('keydown', key, true);
      if (prev && prev.focus) prev.focus();
    };
    var key = function (e) {
      if (e.key === 'Escape') return close();
      if (e.key !== 'Tab') return;
      var f = $$('button, input, [tabindex="-1"]', box).filter(function (n) { return n.offsetParent; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    };
    addEventListener('keydown', key, true);
    veil.addEventListener('click', function (e) { if (e.target === veil) close(); });
    $('.um-wa-x', box).addEventListener('click', close);
    $('.um-wa-no', box).addEventListener('click', close);
    // Turnstile: shows itself only if it needs the visitor; otherwise a token arrives quietly
    var tsBox = $('.um-wa-ts', box);
    var ts = function () {
      if (!window.turnstile || wid !== null || !WA.site) return;
      wid = turnstile.render(tsBox, { sitekey: WA.site, appearance: 'interaction-only', language: ar ? 'ar' : 'en',
        callback: function (v) { token = v; }, 'expired-callback': function () { token = ''; }, 'error-callback': function () { token = ''; } });
    };
    if (window.turnstile) ts();
    else if (WA.site && !$('script[data-um-ts]')) { var sc = el('script'); sc.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; sc.async = true; sc.setAttribute('data-um-ts', ''); sc.onload = ts; document.head.appendChild(sc); }
    var err = function (m) { errEl.textContent = m; errEl.hidden = !m; };
    var busy = function (on) { goBtn.disabled = on; goBtn.textContent = on ? t('\u0646\u0631\u0633\u0644\u2026', 'Sending\u2026') : t('\u0623\u0631\u0633\u0644 \u0627\u0644\u0643\u0648\u062f \u0639\u0644\u0649 \u0627\u0644\u0648\u0627\u062a\u0633\u0627\u0628', 'Send it on WhatsApp'); };
    var again = function () { busy(false); token = ''; if (window.turnstile && wid !== null) turnstile.reset(wid); };
    var done = function (already, phone) {
      sent = true;
      keep('sent');
      var n = phone.slice(3), shown = '\u2066+966 ' + n.slice(0, 2) + ' \u2022\u2022\u2022 \u2022\u2022' + n.slice(-2) + '\u2069';   // kept left-to-right inside the Arabic line
      $('.um-wa-body', box).innerHTML = '<div class="um-wa-done" tabindex="-1">' +
        '<h2 id="um-wa-title">' + (already ? t('\u0627\u0644\u0643\u0648\u062f \u0648\u0635\u0644\u0643 \u0645\u0646 \u0642\u0628\u0644', 'You already have it') : t('\u062a\u0645! \u0634\u064a\u0651\u0643 \u0639\u0644\u0649 \u0627\u0644\u0648\u0627\u062a\u0633\u0627\u0628', 'Done! Check WhatsApp')) + '</h2>' +
        '<p class="um-wa-sub">' + (already ? t('\u0623\u0631\u0633\u0644\u0646\u0627\u0647 \u0644\u0647\u0630\u0627 \u0627\u0644\u0631\u0642\u0645 \u0642\u0628\u0644\u060c \u062f\u0648\u0651\u0631 \u0639\u0644\u064a\u0647 \u0641\u064a \u0645\u062d\u0627\u062f\u062b\u0629 UNMUTED \u0639\u0644\u0649 \u0627\u0644\u0648\u0627\u062a\u0633\u0627\u0628.', 'We sent it to this number before; look for the UNMUTED chat on WhatsApp.')
          : t('\u0623\u0631\u0633\u0644\u0646\u0627 \u0627\u0644\u0643\u0648\u062f \u0644\u0631\u0642\u0645 ', 'We sent the code to ') + '<b dir="ltr">' + shown + '</b>' + t('. \u0627\u0633\u062a\u062e\u062f\u0645\u0647 \u0639\u0646\u062f \u0627\u0644\u062f\u0641\u0639.', '. Use it at checkout.')) + '</p>' +
        '<button type="button" class="um-wa-go">' + t('\u0643\u0645\u0651\u0644 \u0627\u0644\u062a\u0633\u0648\u0651\u0642', 'Keep shopping') + '</button></div>';
      $('.um-wa-done .um-wa-go', box).addEventListener('click', close);
      $('.um-wa-done', box).focus();
    };
    input.addEventListener('input', function () { err(''); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var phone = waPhone(input.value);
      if (!phone) return err(t('\u0627\u0643\u062a\u0628 \u062c\u0648\u0627\u0644 \u0633\u0639\u0648\u062f\u064a \u064a\u0628\u062f\u0623 \u0628\u0640 5\u060c \u0645\u062b\u0644 5X XXX XXXX.', 'Enter a Saudi mobile that starts with 5, like 5X XXX XXXX.'));
      busy(true);
      // the preview: the thank-you screen, a note that nothing went out, no request
      if (demo) return void setTimeout(function () {
        done(false, phone);
        $('.um-wa-done .um-wa-sub', box).insertAdjacentHTML('afterend', '<p class="um-wa-fine">' + t('\u0645\u0639\u0627\u064a\u0646\u0629: \u0645\u0627 \u0627\u0646\u0631\u0633\u0644 \u0634\u064a. \u0627\u0644\u0625\u0631\u0633\u0627\u0644 \u064a\u0634\u062a\u063a\u0644 \u0628\u0639\u062f \u0631\u0628\u0637 \u0643\u0627\u0631\u062a\u0627\u062a.', 'Preview: nothing was sent. Sending starts once Cartat is connected.') + '</p>');
      }, 600);
      var tries = 0;
      (function send() {
        if (WA.site && !token && tries++ < 24) return void setTimeout(send, 250);   // the check is still on its way
        fetch(WA.url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ phone: phone, token: token }) })
          .then(function (r) { return r.json().catch(function () { return {}; }); })
          .then(function (j) {
            if (j.ok) return done(j.already, phone);
            err({ phone: t('\u0627\u0643\u062a\u0628 \u062c\u0648\u0627\u0644 \u0633\u0639\u0648\u062f\u064a \u064a\u0628\u062f\u0623 \u0628\u0640 5\u060c \u0645\u062b\u0644 5X XXX XXXX.', 'Enter a Saudi mobile that starts with 5, like 5X XXX XXXX.'),
              bot: t('\u0645\u0627 \u0642\u062f\u0631\u0646\u0627 \u0646\u062a\u0623\u0643\u062f \u0625\u0646\u0643 \u0645\u0648 \u0631\u0648\u0628\u0648\u062a\u060c \u062c\u0631\u0651\u0628 \u0645\u0631\u0629 \u062b\u0627\u0646\u064a\u0629.', 'We couldn\u2019t check you\u2019re not a bot; try again.'),
              slow: t('\u0645\u062d\u0627\u0648\u0644\u0627\u062a \u0643\u062b\u064a\u0631\u0629\u060c \u062c\u0631\u0651\u0628 \u0628\u0639\u062f \u0634\u0648\u064a.', 'Too many tries; give it a little while.'),
              send: t('\u0645\u0627 \u0642\u062f\u0631\u0646\u0627 \u0646\u0631\u0633\u0644 \u0644\u0647\u0630\u0627 \u0627\u0644\u0631\u0642\u0645. \u062a\u0623\u0643\u062f \u0625\u0646 \u0639\u0644\u064a\u0647 \u0648\u0627\u062a\u0633\u0627\u0628.', 'We couldn\u2019t send to this number. Check it\u2019s on WhatsApp.') }[j.error] || t('\u0635\u0627\u0631 \u062e\u0644\u0644\u060c \u062c\u0631\u0651\u0628 \u0645\u0631\u0629 \u062b\u0627\u0646\u064a\u0629.', 'Something went wrong; try again.'));
            again();
          })
          .catch(function () { err(t('\u0635\u0627\u0631 \u062e\u0644\u0644 \u0641\u064a \u0627\u0644\u0627\u062a\u0635\u0627\u0644\u060c \u062c\u0631\u0651\u0628 \u0645\u0631\u0629 \u062b\u0627\u0646\u064a\u0629.', 'Connection trouble; try again.')); again(); });
      })();
    });
    setTimeout(function () { input.focus(); }, 60);
  }

  // Salla's own markup (cards, product title, cart rows, search) prints the name with its VOL number: show it bare
  function volNames() {
    if (!document.body) return;
    var walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null), n, hit = [];
    while ((n = walk.nextNode())) {
      if (n.nodeValue.length > 7 && VOL_RE.test(n.nodeValue) && !(n.parentNode && n.parentNode.closest && n.parentNode.closest('script, style, textarea, .um-pvol'))) hit.push(n);
    }
    hit.forEach(function (x) { x.nodeValue = bare(x.nodeValue); });
  }
  function run() { volNames(); previewLinks(); fonts(); header(); homeLink(); sections(); listing(); cards(); modelCards(); flips(); info(); product(); paperPage(); hdPhotos(); hdThumbs(); hangers(); related(); reviews(); dock(); quickBuy(); tiles(); fitHelper(); addLabel(); cart(); footer(); waOffer(); packs(); offerBar(); offerZero(); couponBox(); duoPage(); toastText(); }
  keepPlace();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  // Salla's components render after load (the size dropdown, the cart): look again while they settle
  var n = 0, iv = setInterval(function () { run(); if (++n > 40) clearInterval(iv); }, 250);
  addEventListener('resize', dock);
  new MutationObserver(function () { volNames(); tiles(); fitHelper(); addLabel(); cards(); modelCards(); flips(); hdPhotos(); hdThumbs(); reviews(); quickBuy(); packs(); offerBar(); offerZero(); couponBox(); toastText(); }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
