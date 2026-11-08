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
  var CDN_REF = '8cf377fb54eb72499de369d5ac98485d719052e3';
  var COLOURS = { '\u0623\u0633\u0648\u062f': '#1C1A20', '\u0623\u0648\u0641 \u0648\u0627\u064a\u062a': '#E6E2D9', '\u0623\u0628\u064a\u0636': '#F4F2EE', '\u0623\u0632\u0631\u0642 \u0645\u0644\u0643\u064a': '#1F4EA6', '\u0631\u0645\u0627\u062f\u064a': '#A4A5A0', '\u0645\u0648\u0643\u0627': '#62433D', '\u0634\u0648\u0643\u0648\u0644\u0627\u062a\u0629': '#50372F', '\u0631\u0645\u0644\u064a': '#D6BFA4', '\u062d\u062c\u0631\u064a': '#C6BAA8', '\u0628\u064a\u062c': '#F9EBD9' };
  // the size chart: the maker's spec in inches (owner, 2026-11-03): size, chest width, sleeve length, total length
  var SPEC = [['S', 23, 8.5, 26.5], ['M', 24, 8.75, 27], ['L', 25, 9, 27.5], ['XL', 26, 9.25, 28]];
  // the same in cm (inch \u00d7 2.54, to the half): [size, chest width, total length, sleeve length]
  var cmOf = function (i) { return Math.round(i * 5.08) / 2; };
  var CHART = SPEC.map(function (r) { return [r[0], cmOf(r[1]), cmOf(r[3]), cmOf(r[2])]; });
  // a tee's \u00abvoice\u00bb and VOL number, as written in its Salla description (\u00ab\u0635\u0648\u062a \u0627\u0644\u0645\u062f\u064a\u0646\u0629\u00bb\u060c \u0627\u0644\u0635\u0648\u062a \u0631\u0642\u0645 03 \u0645\u0646 \u0625\u0635\u062f\u0627\u0631 VOLUME 01)
  var latin = function (s) { return String(s).replace(/[\u0660-\u0669]/g, function (d) { return d.charCodeAt(0) - 0x660; }); };
  var voiceOf = function (p) {
    var d = String((p && p.description) || '').replace(/<[^>]+>/g, ' ');
    return { voice: ((d.match(/\u00ab([^\u00bb]+)\u00bb/) || [])[1] || '').trim(), vol: latin((d.match(/\u0631\u0642\u0645\s+([0-9\u0660-\u0669]{1,3})/) || d.match(/VOL\.?\s*([0-9]{1,3})/i) || [])[1] || '') };
  };
  var pad = function (n) { return ('0' + n).slice(-2); };
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
    var tees = settle(attempt(homeTees), 4000), faq = settle(attempt(homeFaq), 2500);
    Promise.all([fetch(CDN + '/sections.html').then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); }), tees, faq]).then(function (res) {
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
      $$('.um-hero__eyebrow, .um-hero .um-fl.is-w, .um-rail .um-rls__sub', box).forEach(function (n) { n.remove(); });
      // each section takes its words, photos, tees or questions from the store; if that fails it keeps what it was built with
      [function () { bindHero(box); }, function () { heroBanner(box); }, function () { bindRail(box, res[1], res[3]); },
        function () { bindTracks(box, res[1], res[3]); }, function () { bindPromises(box); }, function () { bindFaq(box, res[2]); }, function () { railTen(box); }, function () { railShowcase(box); }].forEach(function (f) { try { f(); } catch (e) { /* keeps its own */ } });
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
          .then(function (r) { done({ title: head ? head.textContent.trim() : '', items: (r && r.data) || [] }); }, fail);
      })();
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
  var HERO_PICS = 'https://cdn.jsdelivr.net/gh/unmutedsa/unmuted-raed@8662dfa2d19b8272922c10d6b5afb4c1f54cdef2/cdn/photos/hero/';
  function heroBanner(box) {
    var hero = $('.um-hero', box), stage = hero && $('[data-um-poster]', hero), photo = stage && $('.um-hero__photo', stage);
    if (!photo) return;
    photo.insertAdjacentHTML('beforebegin', '<picture class="um-hero__pic">' +
      '<source media="(max-width: 599px)" srcset="' + HERO_PICS + 'city-frequency-tall.webp" width="941" height="1672">' +
      '<img src="' + HERO_PICS + 'city-frequency-wide.webp" width="1983" height="793" class="um-hero__photo" fetchpriority="high" alt="' +
        t('UNMUTED City Frequency: \u062a\u064a\u0634\u064a\u0631\u062a \u0627\u0644\u0631\u064a\u0627\u0636\u060c DROP 01', 'UNMUTED City Frequency: the Riyadh tee, DROP 01') + '"></picture>');
    photo.remove();
    stage.removeAttribute('data-um-poster');   // sections.js's pinned reveal steps aside for the one below
    hero.classList.add('has-banner');
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return stage.style.setProperty('--cap', 1);
    var busy = false;
    var reveal = function () {
      busy = false;
      stage.style.setProperty('--cap', Math.min(1, Math.max(0, scrollY / Math.max(80, stage.offsetHeight / 5))).toFixed(3));
    };
    addEventListener('scroll', function () { if (!busy) { busy = true; requestAnimationFrame(reveal); } }, { passive: true });
    requestAnimationFrame(reveal);
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
    var out = data.items.map(function (p) {
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
  // the rail hangs the first ten tees of the list (the section's \u00ab\u0643\u0644 \u0627\u0644\u0623\u0635\u0648\u0627\u062a\u00bb button leads to the rest), and its bar counts them
  var RAIL_MAX = 10;
  function railTen(box) {
    var rail = $('.um-rail', box), items = rail ? $$('[data-um-rail-track] > .um-rls__item', rail) : [];
    if (!items.length) return;
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
    '540602239': 'the-original/', '752858337': 'megaphone/', '955844389': 'ice-cream/' };
  // tees whose print is on the back: every list shows them from behind first (the tracklist, the product cards, the free
  // tee window), while the product page keeps Salla's photo order (owner, 2026-11-07: \u00ab\u0645\u0646 \u0627\u0644\u062e\u0627\u0631\u062c \u0628\u0633\u060c \u0627\u0644\u0644\u064a \u0645\u0646 \u062c\u0648\u0647 \u0646\u0641\u0633 \u0627\u0644\u062a\u0631\u062a\u064a\u0628\u00bb)
  // \u0627\u0644\u0631\u064a\u0627\u0636\u060c Just Padel\u060c Who Said Kashta? (2026-11-07), then every tee with a back print: The Love Pop Club\u060c Carnival\u060c
  // Good Mood Fast Food\u060c Vending Machine\u060c Play UNMUTED (owner: \u00ab\u0627\u064a \u0634\u064a \u0641\u064a \u0631\u0633\u0645 \u0645\u0646 \u0627\u0644\u0638\u0647\u0631\u00bb)
  var BACK_FIRST = ['862344853', '1501040588', '157439951', '2123593358', '299362976', '372176867', '226109447', '17985496'];
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
        var a = $('.s-product-card-content-title a', c), name = a && a.textContent.trim();
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
    if (price) {
      var extra = '<p><span class="um-pchip">' + t('\u064a\u0648\u0646\u064a\u0633\u0643\u0633\u060c \u0642\u0635\u0651\u0629 \u0648\u0627\u0633\u0639\u0629', 'Unisex, oversized fit') + '</span></p>';
      if (colour) extra += '<div class="um-pcolour"><span>' + t('\u0627\u0644\u0644\u0648\u0646:', 'Colour:') + ' <b>' + esc(colour) + '</b></span>' + (COLOURS[colour] ? '<i style="--c:' + COLOURS[colour] + '" aria-hidden="true"></i>' : '') + '</div>';
      price.insertAdjacentHTML('afterend', extra);
    }
    // the description moves into \u00ab\u0639\u0646 \u0647\u0630\u0627 \u0627\u0644\u0635\u0648\u062a\u00bb
    var aboutHtml = box ? box.innerHTML : '';
    if (box) box.classList.add('um-pdesc-done');
    // fold-outs + share, after the form
    var chart = '<table class="um-chart"><thead><tr><th>' + t('\u0627\u0644\u0645\u0642\u0627\u0633', 'Size') + '</th><th>' + t('\u0639\u0631\u0636 \u0627\u0644\u0635\u062f\u0631 (\u0633\u0645)', 'Chest width (cm)') + '</th><th>' + t('\u0637\u0648\u0644 \u0627\u0644\u0643\u0645 (\u0633\u0645)', 'Sleeve (cm)') + '</th><th>' + t('\u0627\u0644\u0637\u0648\u0644 \u0627\u0644\u0643\u0644\u064a (\u0633\u0645)', 'Length (cm)') + '</th></tr></thead><tbody>' +
      CHART.map(function (r) { return '<tr><td lang="en">' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[3] + '</td><td>' + r[2] + '</td></tr>'; }).join('') + '</tbody></table>';
    var folds = el('div', 'um-folds',
      (aboutHtml ? '<details><summary>' + t('\u0639\u0646 \u0647\u0630\u0627 \u0627\u0644\u0635\u0648\u062a', 'About this voice') + '</summary><div class="um-fbody">' + aboutHtml + '</div></details>' : '') +
      '<details id="um-size"><summary>' + t('\u0627\u0644\u0645\u0642\u0627\u0633\u0627\u062a \u0648\u0627\u0644\u0642\u0635\u0651\u0629', 'Sizes and fit') + '</summary><div class="um-fbody"><p>' + t('\u0642\u0635\u0651\u0629 \u0648\u0627\u0633\u0639\u0629 (Oversized) \u0628\u0646\u0641\u0633 \u0627\u0644\u0645\u0642\u0627\u0633\u0627\u062a \u0644\u0644\u0628\u0646\u0627\u062a \u0648\u0627\u0644\u0634\u0628\u0627\u0628. \u0627\u062e\u062a\u0631 \u0645\u0642\u0627\u0633\u0643 \u0627\u0644\u0645\u0639\u062a\u0627\u062f \u0644\u0644\u0651\u0628\u0633\u0629 \u0627\u0644\u0648\u0627\u0633\u0639\u0629\u060c \u0623\u0648 \u0623\u0635\u063a\u0631 \u0628\u0645\u0642\u0627\u0633 \u0644\u0648 \u062a\u0628\u064a\u0647 \u0623\u0642\u0631\u0628 \u0644\u0644\u062c\u0633\u0645.', 'One oversized cut, the same sizes for everyone. Take your usual size for a loose fit, or one down for a closer one.') + '</p>' + chart + '</div></details>');
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
        var other = backFirst(c.product.id) ? imgs.filter(function (i) { return i.url && i.main; })[0]
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
  var PHOTOS = 'https://cdn.jsdelivr.net/gh/unmutedsa/unmuted-raed@8cf377fb54eb72499de369d5ac98485d719052e3/cdn/photos/';
  var HD = {
    '8HhtAyjzz6MSHqzfZSwoDcodwTgDkRrBBus4IIdu': 'carnival/man-back.webp',
    'NY1XDTbbDdRIwwC49VEQDnNBeCPzUW8jrgertphn': 'carnival/man-front.webp',
    'NJLNfeRESpRE9XcAeV4fhzAjUjyymQK52ETnM8x8': 'carnival/man-side.webp',
    'ngupLFtVj2x0zMlgEVAG9UAoCa7dZSyn811UzdZf': 'carnival/woman-back.webp',
    'ELJvm8ScjxgSwrW0nW109zfDTm8MAO5Uwdfw8Qqv': 'carnival/woman-front.webp',
    'qN2SFaP49xC0wxGiDNBvOAuAusDZuo9bxvL6Sxgg': 'carnival/woman-side.webp',
    'YRVDDZey35yv7LVYTdiGqk1xqkGmwINKBFRTJedy': 'love-pop/man-back.webp',
    'bOZroOxZRn3HEqtxEywWj58tEVRa9A7mepqJzri6': 'love-pop/man-front.webp',
    'Lg4G32SJfG62CbP4qZGAa9wbo9ofiLF1Dtrs5UgX': 'love-pop/man-side.webp',
    'Gkk5W5hzJi5X109cOHFYS1mrINJq7ZfnjamU2VJE': 'love-pop/woman-back.webp',
    'CgzdwygtH3NQfREVXRARYtZh5DTTtFfXrTkUZ47M': 'love-pop/woman-front.webp',
    'ZvfynuDg8xxLdrQWpWMqG6G12XChb2HyYnhVF5iS': 'love-pop/woman-side.webp',
    'X1b1d1CBqNS72pnT64fDNWxNEVmsHOUAjgErhuRY': 'good-mood/man-back.webp',
    'IdmdygcJR2dYOAXbr9wp5tbrNj8xTSF9MEIfkm8J': 'good-mood/man-front.webp',
    '9VSfhIsxIieXVUqS9CMO87AC4YEzS7wxcEKHWtI6': 'good-mood/man-side.webp',
    'QPTH5jthGdTaukF4lAOK6ncoRV95OCh39OLSgcOz': 'good-mood/woman-back.webp',
    'YDBrh1CiO2eo6iAyPELnCUs5aH6kmbVRPS9sWteI': 'good-mood/woman-front.webp',
    'plVq35aDHXwD2BG6tQCWA1rb58zCERLcxyrNgwEo': 'good-mood/woman-side.webp',
    'fBs25oGldzsHpfzi6twXEvFxCAyI4MzGynBIFeQV': 'cherry-market/man-back.webp',
    '8huaRooSs9RgxLaP04HwzPvv5bFP4zSLnYaROyu4': 'cherry-market/man-front.webp',
    'rqhtyI6TB5dwV6qJWJFoD1kcInYEm7ZgFVddblg3': 'cherry-market/man-side.webp',
    '8FG5eLJKt1iVIh44WILyupbCMgRiSz7ttAbafYfX': 'cherry-market/woman-back.webp',
    'XaVF7gQnhqE6gZYfzdE48VDakuDUwYb3cCna6L5z': 'cherry-market/woman-front.webp',
    'K8ZdKGYcoIHD9fiOtBevy0siNVVpsDcDky5VRJ9z': 'cherry-market/woman-side.webp',
    'wjw2k0JhXJ0pLprgG2TQbhFErgGxyqr767XBYEWs': 'caution/man-back.webp',
    'I4uqZTvvDuLhpWkwmxKJF0mAa4YJA0P3r3HxuFvv': 'caution/man-front.webp',
    'jUgpERuTDfOHXyU0HeWruR1ikhOEpEmMwxd6pOig': 'caution/man-side.webp',
    'XQQ3mNyPonm5rTopVDIdofAx9HdHKr3gGpxmadVC': 'caution/woman-back.webp',
    'a6cJGC3dmB2awt2agad8dLgdBlvTKXILyr04hGRf': 'caution/woman-front.webp',
    'gM43mdbXrnCoKmjRbjoKbXeJz3LQo7Rwgonsg48N': 'caution/woman-side.webp',
    '6pgJ2tDxrLYRPSnjYkBU3smxoRdwBMiqdEuSrmqs': 'play-unmuted/man-back.webp',
    rtdSBUtx7AeK22If2RLe9LgJRG43lxQzEUGYmqm5: 'play-unmuted/man-front.webp',
    V9n4VlOyPcGnY0WkBlnjk2C2LQ9AYlfQQ9mUrGHW: 'play-unmuted/man-side.webp',
    HjIxMZqOBaQkPq9ch6xCi2S7nLBpxVYXaxOS5RCG: 'play-unmuted/woman-back.webp',
    NGlg8TsAh4W7ZfinnPwKyDVbfgxZqhZ9h0BtU1XO: 'play-unmuted/woman-front.webp',
    AX1CZt0G4t1cJ9KUqhOzuQ9IP7Yi87yNXHxaEBSf: 'play-unmuted/woman-side.webp',
    '3w0uC4YwZBNnDHU3Gh39Yb8g6kVdt7MF2gX9TFgD': 'vending/man-back.webp',
    QReF88U2eVej0UMPgcLpKs3aYklH9sRq2DgDk4XA: 'vending/man-front.webp',
    j3I83fv6fXWDPFzl8iBOcitC2fTtFO0Ts39gGyWS: 'vending/man-side.webp',
    Xdgxz9LzuzC0DDXvmTThhQ0eXLRJ2D0mS0QOjn02: 'vending/woman-back.webp',
    N7SSbRtVMtf2Vj9d5b7jH24Ai2omswsKuUQJrZew: 'vending/woman-front.webp',
    X0Y63bSz88Cha8e90GzmdXZgtWfvG4Cm5aKwckxZ: 'vending/woman-side.webp',
    '0mHsiNaxfp3SAO61Ty35MHy4wLcvhURZscCHB0Gb': 'call-me/man-back.webp',
    '6KGfT4nhFgjbjCvyNsQhn1ZMCjfoiEB9nU8v8Ic6': 'call-me/man-front.webp',
    '3XI68GY7KqJXCUmsw9eOvlQfJNlQb8kxKgmNhgBW': 'call-me/man-side.webp',
    htVip9wTpzTdD0Ky4fRX1BFLVaYWeN5WCiPb9Kvs: 'call-me/woman-back.webp',
    SC9lADMT2f1QUc3q6gbxjo8oPKFmDnUxg6uOY2cA: 'call-me/woman-front.webp',
    UqlgDBwCZUqyb6USFGAy2ZEiFm7QCQXNUrZMTmZb: 'call-me/woman-side.webp',
    'LIxLWH3jMyfigjehR7YQQ4PtNg2zqGFsbbC4Adrh': 'kashta/man-back.webp',
    'h0WjylAbwIH9LJ79eFNbc3WaMTjakMjUvnEaCsRF': 'kashta/man-front.webp',
    '5ua75q7ZHFwLkbur4yoGyJKC9qlkNXjQySdbvqvv': 'kashta/man-side.webp',
    'bd788XtEd0piv6VyOirqqEDuBMudKmUMHa2UvlVB': 'kashta/woman-back.webp',
    'L5Mz513QGM0c86CdcFgAJ9Tf23dGXr8S7vRp5RzM': 'kashta/woman-front.webp',
    'nGe3eKGnfXQ8YA7k8of2iC6J0MKjWzSg7Oj1Jc39': 'kashta/woman-side.webp',
    Ghhln3q589Ku10AIKadmqn0UZowgGCcSB6oDiJBR: 'the-original/man-back.webp',
    fdpJeclPWyARb153uK5rAd8HXPybLtXXS9GSF7Na: 'the-original/man-front.webp',
    kxs1dqgX42U4kJmEZhzKxyEbXHsqYe6UH2Ne6Oku: 'the-original/man-side.webp',
    Uht7CfUwBvLhItbjkuO1G9C7sAScoQLT2Rw4BG8g: 'the-original/woman-back.webp',
    '1aYXQoll6ClS3HoTnZLh4Zvy88qc1ChDxz8MEMnk': 'the-original/woman-front.webp',
    pjFTzv8AkGhD34AFm2JUmWC98MTwQKj4xgCTV8pN: 'the-original/woman-side.webp',
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
    'd0rtnb3CsC6gHH2giqEbRDGFQ5obslv5cF8f11L5': 'unmuted-sticker/man-back.webp',
    'gpqsKBWmauPYxYUivaxYKggSqXpQaPwL3U4tQTwx': 'unmuted-sticker/man-front.webp',
    'jdpaRlMo16SUbHJNWpbLvoc8uQkUjj1UEEAg8LEU': 'unmuted-sticker/man-side.webp',
    'quU3UynY1FQp1EUPNza3faaY6Jff7DP2wvNAcmbi': 'unmuted-sticker/woman-back.webp',
    '5DHlPIkwpYcnlrtyBaKzLsZTrssYJRQAQLLsGWAj': 'unmuted-sticker/woman-front.webp',
    'JhI5jBfUqa459qGYvYlypQE27crNCul55vNX42EZ': 'unmuted-sticker/woman-side.webp',
    'utDh83gpuxy6XcLLwzXiGnNOTnYZAN4Lsk2sHwhJ': 'riyadh/man-back.webp',
    's7R71w70jq5HDrTzRkVEyYehuneo3UOZiAv4cL0H': 'riyadh/man-front.webp',
    'v6itdoY8dCbS248EXx2R9fR6LmozMKFExBe1Y1s4': 'riyadh/man-side.webp',
    'fDnnFGT6DIC1Eufrd7MnJCy1jyix7KP4MZsFGeiG': 'riyadh/woman-back.webp',
    'Nf1F50wpTy8qMRWJluQVEbNiptpwZXprOdJDRjI5': 'riyadh/woman-front.webp',
    'Qe9VAAlFII0elUEC50adkaz6SAIKAyn3IF6WcSob': 'riyadh/woman-side.webp',
    'UYmjcc1Wtut9lX6l06UfOSPFHZS7l2hGeWpH461L': 'dates-season/man-back.webp',
    'GkSmBkiPKDBDJhim43xNFF5xfNSG6UvLd01sPP9R': 'dates-season/man-front.webp',
    'OHrMVfcvl9ccRavdRihPQ0ni5H5icKyZXd8SXFj8': 'dates-season/man-side.webp',
    'atDa1QaM16XO7hbcs9ldKdk3AlEAlJCWI4MPcwgu': 'dates-season/woman-back.webp',
    'OffxNW20JUnPr2AYqBAGAIqXhR1FDGkB7g6qza4d': 'dates-season/woman-front.webp',
    'MPE4Ym4Y0z3iaBI0d4Krcw6wzLY1Cg7Bhsdz6kLw': 'dates-season/woman-side.webp',
    'n99wORzh68Go6tNlAsthsCvNdRzANneOGlOCJK9Y': 'desert-club/man-back.webp',
    'r9wAUbrF5IliYzJC3wxbkGHJik4WN541GCil42Fw': 'desert-club/man-front.webp',
    'ZjIyjEhoOwN54NOOeIUojgQtNoD5ML6kmLx0jWN9': 'desert-club/man-side.webp',
    'k7vZKVMywdPBbRXxdwi5eQHGp6rqnKLLcMaHpGbw': 'desert-club/woman-back.webp',
    'lR5ZUnL5FmTEM5pcB1i1qDVZnlHx3PTY8k1pOH9Z': 'desert-club/woman-front.webp',
    'uIt4i7X5nkjh7MPi2H6ROrRPmeqZXSoy8UfsExsJ': 'desert-club/woman-side.webp',
    'yoHIwW1mrTJZOzvsnWgjM0W5pxggdfLjPnheFpUn': 'just-padel/man-back.webp',
    'gvBzIBlGVggqi1yoMUwoDlpRBlU5aTP1EzkD1YjK': 'just-padel/man-front.webp',
    'Qe8RKzJqleIUwarPzC8iCHml1TRK496zCKqQLysW': 'just-padel/man-side.webp',
    'yj6KbUB2dTa5CJhstktkHtyH9QBwtcjCBlfdUXR8': 'just-padel/woman-back.webp',
    '5sghv6832XXNBBbl5LgvvDaNT9S9BurW8ABk1QmN': 'just-padel/woman-front.webp',
    'T7Mw3jqhkODCCpZc9jSp2L7L7qiryAZAe1c0Gs23': 'just-padel/woman-side.webp',
    Y2YU24YFhlI3CmH2Bm28udWKYE5iELbG3jNxlico: 'caution/alone-front.webp',
    '0Q2B8NZxRa6XN28DmUbwNsbuREvAtoylJipQ777J': 'caution/alone-back.webp',
    'ulN6dKqmIiQEVWHBmttoRfAbH3bBjueWLzOyx7Lu': 'desert-club/alone-front.webp',
    'iA9j9IG2i7uCMslqTFtqsxtTbdhQF4ZCFarsHv6m': 'desert-club/alone-back.webp',
    '6UTlIxxOK449tF8PROtn0jxC6Pe9eldsAqLkckSo': 'riyadh/alone-front.webp',
    'FZC7yUEXHwn2cpPzKrK1JFWrXwX3Cll8QH3xaCvv': 'riyadh/alone-back.webp',
    'sELIOvyCKiSuW9g2BwnHre346IoXd5RAc5qNzNcq': 'unmuted-sticker/alone-front.webp',
    'Ub59s2TOYdUouYEY9bGHyYCcaClT2bfW9PSfmkLl': 'unmuted-sticker/alone-back.webp',
    '0GPNiQA5ew6Nt6JsliSaG6QPjQvWZDwn3GmJvBfR': 'dates-season/alone-front.webp',
    '8c8psurGa5hR3QjmknZkQjp1CqieF8ocKZ2jPLok': 'dates-season/alone-back.webp',
    '0rQP2JF4OfRNpWTRc16XwPywkfG5uTLnH0LEoOHC': 'just-padel/alone-front.webp',
    '0Mi9JcSfxS2060wN96kR36WTA3pUVfjdCcE9C9uf': 'just-padel/alone-back.webp',
    'jOX2EgsdodR4YmYEQtm25DaD8dw6hzXy6ME2kyFM': 'love-pop/alone-front.webp',
    'sPCoLWXbYoeA4UqtpqQVjHKtcElkGF53vLoejLfj': 'love-pop/alone-back.webp',
    VGfYngwaE3iFwOSuiskVxOtqkIkGYVId3IiDmFck: 'carnival/alone-front.webp',
    uXqwvlSHMp3TYUDIFazB62PnaoIUWXOocw5L7vhK: 'carnival/alone-back.webp',
    'jTgCLeWo15ZMmz7g68Nk4chzV9IrUSVPo6MT8d3Q': 'good-mood/alone-front.webp',
    'paa7iX89JHEYKG06YRMvZXO6YBK2DESSQ2HnS3ns': 'good-mood/alone-back.webp',
    'WdkahiludBagpKcyp4PNQjW2QYC6Zl7MfCrQ8Fmr': 'cherry-market/alone-front.webp',
    'f6lVUyaFfTideYKup289mp7vnvjfINB4n1lCOW56': 'cherry-market/alone-back.webp',
    ygua2Tt1pynUhVktVXwgaw15RrKmoDsS12vjS1dN: 'play-unmuted/alone-front.webp',
    KYMpMZrzfMqDYOwpIOIuVYDfPQBUbOt5KmBd6ksk: 'play-unmuted/alone-back.webp',
    uSRTzc2GuYHJxkQxO6KwsfquzVR6IiLjOZdoFcus: 'vending/alone-front.webp',
    Q9bRHZxe0K5hPuNxwOV20E7xXmgnyhKx1oPpfBvL: 'vending/alone-back.webp',
    rgD2B9BIYT5JQScLKQ43Y6zCoa7Pr7vQuyJkZ5z7: 'call-me/alone-front.webp',
    jpsdRYhAFiJpZOqy7VuQYa7knDtJdKunjsCySIxw: 'call-me/alone-back.webp',
    'xIJ6mmWigs0cRgfwqXDrxKM0Y1mQWy0oUgJw8m44': 'kashta/alone-front.webp',
    '5JjACysdoVvEdcto3QUrrwuxpa5e64YLJbw9BfKf': 'kashta/alone-back.webp',
    xvch0LdtD40mqsyO83btCQIxmN2uNyJYKZhFDzT8: 'the-original/alone-front.webp',
    sqbTmQ2OEZyZSO2fHBdOiy2VaXYE7Ylhs64nWjDR: 'the-original/alone-back.webp',
    tEeeF5QsPxa0ReM7OizCbCylHEF59QU3yoiJCIcA: 'megaphone/alone-front.webp',
    uWWXA9gx5OuiJfWl1ItEo4RsUhAY0JXdHKBopF1z: 'megaphone/alone-back.webp',
    iZ8m9YdntMvoISTbJOj5iYqeBFty0cfk0J81Cx4G: 'ice-cream/alone-front.webp',
    Etz5XE1PB7xIaJIRqCGxGSoYWMW5tJFjou301Uzy: 'ice-cream/alone-back.webp'
  };
  var hdOf = function (url) {
    var m = String(url || '').match(/([A-Za-z0-9]{40})\.(?:jpe?g|png|webp)(?:[?#]|$)/);
    return m && HD[m[1]] ? PHOTOS + HD[m[1]] : '';
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
    '226109447', '1987585855', '157439951', '540602239', '752858337', '955844389'];
  function paperPage() {
    var m = location.pathname.match(/\/p(\d+)(?:[/?#]|$)/);
    document.documentElement.classList.toggle('um-paper', !!(m && PAPER.indexOf(m[1]) > -1));
  }

  /* a product card whose photo is one of those model photos fills its frame like the gallery does (cards don't carry
     the photo's ALT, so the file name tells), and shows our sharp copy of it and of its hover photo */
  function modelCards() {
    $$('custom-salla-product-card').forEach(function (c) {
      var box = $('.s-product-card-image', c);
      if (!box || !c.product || !c.product.image || !hdOf(c.product.image.url)) return;
      box.classList.add('um-model');
      if (backFirst(c.product.id)) showBack($('a img:not(.um-cback)', box), c.product.id);
      else sharpen($('a img:not(.um-cback)', box), c.product.image.url);
      var back = $('img.um-cback', box);
      if (back && back.getAttribute('data-um-url')) sharpen(back, back.getAttribute('data-um-url'));
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
    salla.product.fetch({ source: 'related', source_value: id }).then(function (r) {
      if (r && r.data && r.data.length) return;
      var crumb = $$('.breadcrumbs a').filter(function (a) { return /\/c\d+/.test(a.href); }).pop();
      var cat = crumb ? crumb.href.match(/\/c(\d+)/)[1] : ALL_CAT;
      var big = cat === ALL_CAT ? Promise.resolve(true) : salla.product.fetch({ source: 'categories', source_value: [cat], limit: 6 })
        .then(function (r2) { return !!(r2 && r2.data && r2.data.length >= 5); }).catch(function () { return false; });
      return big.then(function (ok) { swap(old, id, ok ? cat : ALL_CAT, ok && crumb ? crumb.href : allUrl()); });
    }).catch(function () {});
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
     owner's reference (a \u00abFind my size\u00bb advisor); the numbers come from CHART. Answers stay in this browser only. */
  var FIT_KEY = 'um-fit';
  var fitLoad = function () { try { return JSON.parse(localStorage.getItem(FIT_KEY)) || {}; } catch (e) { return {}; } };
  var fitSave = function (s) { try { localStorage.setItem(FIT_KEY, JSON.stringify(s)); } catch (e) {} };
  var arNum = function (n) { return ar ? String(n).replace(/[0-9]/g, function (d) { return '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669'[d]; }) : String(n); };
  // body chest round (cm) from height and weight, then the tee that leaves the room this cut is made for
  function fitSize(s) {
    var chest = s.g === 'w' ? 60 + 0.45 * s.w + 0.05 * (s.h - 165) : 64 + 0.42 * s.w + 0.08 * (s.h - 175);
    // room the tee leaves round the chest (cm): the maker's chart runs wide, so a usual M person still gets M (owner's note: \u00ab\u0627\u062e\u062a\u0631 \u0645\u0642\u0627\u0633\u0643 \u0627\u0644\u0645\u0639\u062a\u0627\u062f\u00bb)
    var ease = { slim: 18, over: 24, more: 30 }[s.like || 'over'];
    var need = chest + ease, i = 0;
    while (i < CHART.length - 1 && CHART[i][1] * 2 < need) i++;
    var tall = s.g === 'w' ? (s.h >= 186 ? 3 : s.h >= 178 ? 2 : 0) : (s.h >= 195 ? 3 : s.h >= 188 ? 2 : 0);
    var byLength = Math.max(i, Math.min(tall, CHART.length - 1)) > i;
    if (byLength) i = Math.min(tall, CHART.length - 1);
    return { i: i, size: CHART[i][0], tight: CHART[CHART.length - 1][1] * 2 < need, roomy: i === 0 && CHART[0][1] * 2 - need > 10, byLength: byLength };
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
    var step = 1;
    var name = ($('[data-testid="store-product-title"]') || {}).textContent || '';
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
      var r = fitSize(s), html = '<div class="um-fit-top"><b>' + t('\u0645\u0633\u0627\u0639\u062f \u0627\u0644\u0645\u0642\u0627\u0633', 'Size advisor') + '</b><button type="button" class="um-fit-x" aria-label="' + t('\u0625\u063a\u0644\u0627\u0642', 'Close') + '">\u00d7</button></div>';
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
        html += '<h3>' + t('\u0648\u0634 \u062a\u062d\u0628 \u0641\u064a \u0627\u0644\u0644\u0628\u0633\u0629\u061f', 'How do you like it to sit?') + '</h3><p class="um-fit-sub">' + t('\u062a\u064a\u0634\u064a\u0631\u062a\u0627\u062a\u0646\u0627 \u0642\u0635\u0651\u0629 \u0648\u0627\u0633\u0639\u0629 \u0645\u0646 \u0627\u0644\u0623\u0633\u0627\u0633.', 'Our tees are cut oversized to begin with.') + '</p>' +
          choice('like', [['over', t('\u0623\u0648\u0641\u0631\u0633\u0627\u064a\u0632 \u0632\u064a \u0645\u0627 \u0627\u0646\u0642\u0635\u0651\u062a', 'Oversized, as cut'), t('\u0646\u0646\u0635\u062d \u0641\u064a\u0647\u0627', 'Our pick')], ['slim', t('\u0623\u0642\u0631\u0628 \u0644\u0644\u062c\u0633\u0645', 'Closer to the body'), t('\u0623\u0642\u0644 \u0627\u062a\u0633\u0627\u0639', 'Less room')], ['more', t('\u0623\u0648\u0633\u0639 \u0628\u0639\u062f', 'Even roomier'), t('\u062a\u0646\u0632\u0644 \u0639\u0644\u0649 \u0627\u0644\u0643\u062a\u0641 \u0623\u0643\u062b\u0631', 'Drops further off the shoulder')]]) +
          '<div class="um-fit-nav"><button type="button" class="um-fit-back" data-to="1">' + t('\u0631\u062c\u0648\u0639', 'Back') + '</button><button type="button" class="um-fit-go" data-to="3"' + (s.like ? '' : ' disabled') + '>' + t('\u0634\u0648\u0641 \u0645\u0642\u0627\u0633\u064a', 'See my size') + '</button></div>';
      } else {
        var why = [];
        var plain = function (x) { return x.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); };
        why.push(t('\u0637\u0648\u0644\u0643 ' + plain(hTxt()) + ' \u0648\u0648\u0632\u0646\u0643 ' + plain(wTxt()) + '.', 'You are ' + plain(hTxt()) + ' and ' + plain(wTxt()) + '.'));
        why.push({ over: t('\u062a\u0628\u064a\u0647\u0627 \u0623\u0648\u0641\u0631\u0633\u0627\u064a\u0632 \u0632\u064a \u0645\u0627 \u0627\u0646\u0642\u0635\u0651\u062a\u060c \u0648\u0647\u0630\u0627 \u0627\u0644\u0645\u0642\u0627\u0633 \u064a\u0639\u0637\u064a\u0643 \u0647\u0627\u0644\u0642\u0635\u0651\u0629.', 'You want it oversized as cut; this size gives you that.'), slim: t('\u062a\u0628\u064a\u0647\u0627 \u0623\u0642\u0631\u0628 \u0644\u0644\u062c\u0633\u0645\u060c \u0641\u0627\u062e\u062a\u0631\u0646\u0627 \u0627\u062a\u0633\u0627\u0639 \u0623\u0642\u0644.', 'You want it closer; we chose less room.'), more: t('\u062a\u0628\u064a\u0647\u0627 \u0623\u0648\u0633\u0639\u060c \u0641\u0643\u0628\u0651\u0631\u0646\u0627 \u0644\u0643.', 'You want it roomier; we went up.') }[s.like]);
        if (r.byLength) why.push(t('\u0648\u0637\u0648\u0644\u0643 \u064a\u0646\u0627\u0633\u0628\u0647 \u0637\u0648\u0644 \u0647\u0627\u0644\u0645\u0642\u0627\u0633 (' + arNum(CHART[r.i][2]) + ' \u0633\u0645).', 'Your height suits this size\u2019s length (' + CHART[r.i][2] + ' cm).'));
        if (r.tight) why.push(t(CHART[r.i][0] + ' \u0623\u0643\u0628\u0631 \u0645\u0642\u0627\u0633 \u0639\u0646\u062f\u0646\u0627\u060c \u0648\u0628\u064a\u062c\u064a\u0643 \u0623\u0642\u0631\u0628 \u0644\u0644\u062c\u0633\u0645 \u0645\u0646 \u0627\u0644\u0623\u0648\u0641\u0631\u0633\u0627\u064a\u0632.', CHART[r.i][0] + ' is our largest; it will sit closer than oversized.'));
        if (r.roomy) why.push(t(CHART[0][0] + ' \u0623\u0635\u063a\u0631 \u0645\u0642\u0627\u0633 \u0639\u0646\u062f\u0646\u0627\u060c \u0648\u0628\u064a\u062c\u064a\u0643 \u0648\u0627\u0633\u0639 \u0634\u0648\u064a.', CHART[0][0] + ' is our smallest; it will be a little roomy.'));
        var inch = s.cu === 'in';   // inches: the maker's own numbers (SPEC); cm: CHART
        var sold = $$('.product-form .um-tile').filter(function (b) { return b.textContent.trim() === r.size && b.disabled; }).length;
        html += '<p class="um-fit-count">' + t('\u0645\u0642\u0627\u0633\u0643', 'Your size') + '</p><div class="um-fit-size"><b lang="en">' + r.size + '</b></div>' +
          '<ul class="um-fit-why">' + why.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul>' +
          '<div class="um-fit-chart-top"><b>' + t('\u062c\u062f\u0648\u0644 \u0627\u0644\u0645\u0642\u0627\u0633\u0627\u062a', 'Size chart') + '</b>' + seg('cu', ['cm', t('\u0633\u0645', 'cm')], ['in', t('\u0625\u0646\u0634', 'in')]) + '</div>' +
          '<table class="um-chart um-fit-chart"><thead><tr><th>' + t('\u0627\u0644\u0645\u0642\u0627\u0633', 'Size') + '</th><th>' + t('\u0639\u0631\u0636 \u0627\u0644\u0635\u062f\u0631', 'Chest width') + '</th><th>' + t('\u0637\u0648\u0644 \u0627\u0644\u0643\u0645', 'Sleeve') + '</th><th>' + t('\u0627\u0644\u0637\u0648\u0644 \u0627\u0644\u0643\u0644\u064a', 'Length') + '</th></tr></thead><tbody>' +
          CHART.map(function (c, k) { var v = inch ? [SPEC[k][1], SPEC[k][2], SPEC[k][3]] : [c[1], c[3], c[2]]; return '<tr' + (k === r.i ? ' class="on"' : '') + '><td lang="en">' + c[0] + '</td><td>' + arNum(v[0]) + '</td><td>' + arNum(v[1]) + '</td><td>' + arNum(v[2]) + '</td></tr>'; }).join('') + '</tbody></table>' +
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
      var r = fitSize({ g: s.g, h: s.h, w: s.w });
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
    if (!f || $('.um-ftr-big')) return;
    f.insertBefore(el('div', 'um-ftr-big', '<p lang="en" dir="ltr">Wear your voice.</p><p>' + t('\u0627\u0644\u0628\u0633 \u0635\u0648\u062a\u0643.', '\u0627\u0644\u0628\u0633 \u0635\u0648\u062a\u0643.') + '</p>'), f.firstChild);
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

  /* Duo: the packages (owner, 2026-11-03, \u00ab\u0645\u0644\u062e\u0635 \u062a\u0646\u0641\u064a\u0630 \u0639\u0631\u0636 Unmuted \u0639\u0644\u0649 \u0627\u0644\u0645\u0648\u0642\u0639\u00bb). The prices themselves come from Salla: the
     cart offer \u00ab\u0628\u0627\u0642\u0627\u062a UNMUTED\u00bb (#1573603771: 2 tees 15% off; 3 tees full price (a 0.001 SAR step, Salla takes no 0 and
     rounds it away); 4 tees and up 129.56 off, 149 with VAT: one free tee per order, the price split over the tees as the
     PDF has it (111.75 each with 4); no coupon with it) and free shipping from 400 SAR (3 tees and up). This only shows them: three package cards on each
     tee's page (information, marked by the bag's count), a bar in the cart that says what the next tee gets, and the Duo page
     (its own page in the header) with the packages and every tee under them. */
  var PACK = { price: 149, ship: 40, page: '72145634' };
  var PACKS = [
    { n: 1, title: t('\u0642\u0637\u0639\u0629 \u0648\u0627\u062d\u062f\u0629', 'One tee'), total: 149, was: 0, free: false },
    { n: 2, title: t('\u0642\u0637\u0639\u062a\u064a\u0646 \u0628\u062e\u0635\u0645\u00a0\u0661\u0665\u066a', 'Two tees, 15% off'), total: 253.30, was: 298, free: false },
    { n: 4, title: t('\u0627\u0634\u062a\u0631\u0650 \u0663 \u0648\u0627\u0644\u0631\u0627\u0628\u0639\u0629 \u0645\u062c\u0627\u0646\u0627\u064b +\u00a0\u0634\u062d\u0646\u00a0\u0645\u062c\u0627\u0646\u064a', 'Buy 3, the 4th is free +\u00a0free\u00a0shipping'), total: 447, was: 596, free: true, best: true }
  ];
  var moneyNum = function (v) {
    var s = Math.round(v * 100) % 100 ? v.toFixed(2) : String(Math.round(v));
    return ar ? arNum(s).replace('.', '\u066b') : s;
  };
  var money = function (v) {
    return '<span class="um-money">' + moneyNum(v) + ' <i class="sicon-sar" aria-hidden="true"></i></span>';
  };
  // each card is its title and its price, nothing under them (owner 2026-11-04: no shipping on the first two cards);
  // the old price struck beside the new one, so the saving shows (owner 2026-11-05)
  var packCard = function (p, tag) {
    return '<' + tag + ' class="um-pack' + (p.best ? ' is-best' : '') + '" data-n="' + p.n + '"' + (tag === 'button' ? ' type="button" role="radio" aria-checked="false"' : '') + '>' +
      (p.best ? '<i class="um-pack__tag">' + t('\u0627\u0644\u0623\u0643\u062b\u0631 \u062a\u0648\u0641\u064a\u0631\u0627\u064b', 'Best value') + '</i>' : '') +
      '<b class="um-pack__title">' + p.title + '</b>' +
      '<span class="um-pack__price">' + (p.was ? '<s aria-label="' + t('\u0628\u062f\u0644 ', 'instead of ') + p.was + '">' + moneyNum(p.was) + '</s>' : '') + money(p.total) + '</span>' +
    '</' + tag + '>';
  };
  // a tee's page: the three packages above the add button, as information only (owner's manager, 3 Nov: picking a
  // package on every tee wore customers out; they just fill the bag and see what each count gives). The line on top
  // says what this tee does to the bag they have now, and the card that count reaches is marked; the quantity stays theirs
  var bagCount = function () {
    var c = $('salla-cart-summary .s-cart-summary-count'), n = c ? amount(c.textContent) : 0;
    return n > 0 ? n : 0;
  };
  function packs() {
    var form = $('.product-form'), bar = form && $('.sticky-product-bar', form);
    if (!bar) return;
    var box = $('.um-packs', form), n = bagCount(), key = n + '|' + ar;
    if (box && box.getAttribute('data-k') === key) return;
    if (!box) {
      box = el('div', 'um-packs');
      box.setAttribute('aria-live', 'polite');
      bar.parentNode.insertBefore(box, bar);
    }
    box.setAttribute('data-k', key);
    var msg = n === 0 ? t('\u0623\u064a \u062a\u064a\u0634\u064a\u0631\u062a\u064a\u0646 \u0628\u062e\u0635\u0645 \u0661\u0665\u066a\u060c \u0648\u0627\u0634\u062a\u0631\u0650 \u0663 \u0648\u0627\u0644\u0631\u0627\u0628\u0639 \u0645\u062c\u0627\u0646\u0627\u064b. \u0627\u0644\u0639\u0631\u0636 \u064a\u062a\u0637\u0628\u0642 \u0641\u064a \u0627\u0644\u0633\u0644\u0629 \u0644\u062d\u0627\u0644\u0647.', 'Any two tees 15% off; buy 3 and the 4th is free. It applies in your bag by itself.')
      : n === 1 ? t('\u0641\u064a \u0633\u0644\u062a\u0643 \u0642\u0637\u0639\u0629. \u0623\u0636\u0641 \u0647\u0630\u0627 \u0627\u0644\u062a\u064a\u0634\u064a\u0631\u062a \u0648\u062a\u0635\u064a\u0631 \u0627\u0644\u0642\u0637\u0639\u062a\u064a\u0646 \u0628\u062e\u0635\u0645 \u0661\u0665\u066a.', 'One tee in your bag. Add this one and the two are 15% off.')
      : n === 2 ? t('\u0641\u064a \u0633\u0644\u062a\u0643 \u0642\u0637\u0639\u062a\u064a\u0646. \u0623\u0636\u0641 \u0647\u0630\u0627 \u0627\u0644\u062a\u064a\u0634\u064a\u0631\u062a \u0648\u0627\u0644\u0634\u062d\u0646 \u0645\u062c\u0627\u0646\u064a\u060c \u0648\u0627\u0644\u0631\u0627\u0628\u0639 \u0628\u0639\u062f\u0647 \u0639\u0644\u064a\u0646\u0627.', 'Two tees in your bag. Add this one for free shipping; the 4th is then on us.')
      : n === 3 ? t('\u0641\u064a \u0633\u0644\u062a\u0643 \u0663 \u0642\u0637\u0639. \u0623\u0636\u0641 \u0647\u0630\u0627 \u0627\u0644\u062a\u064a\u0634\u064a\u0631\u062a \u0648\u0627\u0644\u0631\u0627\u0628\u0639 \u0639\u0644\u064a\u0646\u0627.', 'Three tees in your bag. Add this one and the 4th is on us.')
      : t('\u0627\u0644\u0639\u0631\u0636 \u0645\u0641\u0639\u0651\u0644 \u0641\u064a \u0633\u0644\u062a\u0643: \u0642\u0637\u0639\u0629 \u0645\u062c\u0627\u0646\u064a\u0629 \u0648\u0634\u062d\u0646 \u0645\u062c\u0627\u0646\u064a.', 'The offer is on in your bag: a free tee and free shipping.');
    var at = n + 1 >= 3 ? 4 : n + 1;
    box.innerHTML = '<p class="um-packs__head">' + msg + '</p>' +
      '<div class="um-packs__row">' + PACKS.map(function (p) { return packCard(p, 'div').replace('class="um-pack', 'class="um-pack' + (p.n === at ? ' is-on' : '')); }).join('') + '</div>';
  }
  // the cart: how many tees, what the next one gets, what's saved, and the shipping
  var rowQty = function (q) {
    var i = q && $('input', q);
    return q ? parseInt((i && i.value) || q.getAttribute('value'), 10) || 0 : 0;
  };
  var cartCount = function () {
    return $$('form[id^="item-"] salla-quantity-input').reduce(function (n, q) { return n + rowQty(q); }, 0);
  };
  function offerBar() {
    if (!/\/cart(\/|$|\?)/.test(location.pathname)) return;
    var n = cartCount(), box = $('.um-offer');
    if (!n) { if (box) box.remove(); return; }
    if (!box) {
      var anchor = $('.um-cart-title');
      if (!anchor) return;
      box = el('section', 'um-offer');
      box.setAttribute('aria-live', 'polite');
      anchor.parentNode.insertBefore(box, anchor.nextSibling);
    }
    var save = n >= 4 ? PACK.price : n === 2 ? PACK.price * 2 * 0.15 : 0, free = n >= 3;
    var msg = n === 1 ? t('\u0623\u0636\u0641 \u0642\u0637\u0639\u0629 \u062b\u0627\u0646\u064a\u0629 \u0648\u0627\u062d\u0635\u0644 \u0639\u0644\u0649 \u062e\u0635\u0645 \u0661\u0665\u066a', 'Add a second tee for 15% off')
      : n === 2 ? t('\u0623\u0636\u0641 \u0642\u0637\u0639\u0629 \u062b\u0627\u0644\u062b\u0629: \u0627\u0644\u0642\u0637\u0639\u0629 \u0627\u0644\u0631\u0627\u0628\u0639\u0629 \u0645\u062c\u0627\u0646\u064a\u0629 \u0648\u0627\u0644\u0634\u062d\u0646 \u0645\u062c\u0627\u0646\u064a', 'Add a third: the 4th is free, and shipping too')
      : n === 3 ? t('\u0628\u0627\u0642\u064a \u0644\u0643 \u062a\u062e\u062a\u0627\u0631 \u0642\u0637\u0639\u062a\u0643 \u0627\u0644\u0645\u062c\u0627\u0646\u064a\u0629', 'Now pick your free tee')
      : n === 4 ? t('\u062a\u0645 \u062a\u0641\u0639\u064a\u0644 \u0627\u0644\u0639\u0631\u0636: \u0642\u0637\u0639\u0629 \u0645\u062c\u0627\u0646\u064a\u0629 \u0648\u0634\u062d\u0646 \u0645\u062c\u0627\u0646\u064a', 'Offer on: a free tee and free shipping')
      : t('\u0642\u0637\u0639\u0629 \u0645\u062c\u0627\u0646\u064a\u0629 \u0648\u062d\u062f\u0629 \u0644\u0643\u0644 \u0637\u0644\u0628', 'One free tee per order');
    var key = n + '|' + ar;
    if (box.getAttribute('data-k') === key) return;
    box.setAttribute('data-k', key);
    var steps = [1, 2, 3, 4].map(function (k) { return '<i class="' + (k <= n ? 'is-on' : '') + '"><span>' + arNum(k) + '</span></i>'; }).join('');
    box.innerHTML = '<div class="um-offer__steps" aria-hidden="true">' + steps + '</div>' +
      '<p class="um-offer__msg">' + msg + '</p>' +
      '<p class="um-offer__sum">' + (save ? t('\u0648\u0641\u0651\u0631\u062a ', 'You save ') + money(save) + ' \u00b7 ' : '') +
        (free ? '<b>' + t('\u0627\u0644\u0634\u062d\u0646 \u0645\u062c\u0627\u0646\u064a', 'Free shipping') + '</b>' : t('\u0627\u0644\u0634\u062d\u0646 ', 'Shipping ') + money(PACK.ship) + t('\u060c \u0648\u0645\u062c\u0627\u0646\u064a \u0645\u0646 \u0663 \u0642\u0637\u0639', ', free from 3 tees')) + '</p>' +
      (n === 3 ? '<button type="button" class="um-offer__go" data-um-free>' + t('\u0627\u062e\u062a\u0631 \u0642\u0637\u0639\u062a\u0643 \u0627\u0644\u0645\u062c\u0627\u0646\u064a\u0629', 'Pick your free tee') + '</button>'
        : n < 3 ? '<a class="um-offer__go" href="' + esc(allUrl()) + '">' + t('\u0623\u0636\u0641 \u0635\u0648\u062a', 'Add a voice') + '</a>' : '');
    if (n === 3) freeOnce();
  }
  // Salla takes no 0 discount, so the offer's 3-tee step is 0.01 SAR (the PDF wants 3 tees at full price), and Salla's
  // cart then shows \u00ab\u062d\u0635\u0644\u062a \u0639\u0644\u0649 \u0639\u0631\u0636\u2026 \u062e\u0635\u0645 \u0660\u066b\u0660\u0660\u00bb, 149 struck by 149 (or 148.99), 447 struck by 446.99 and \u00ab\u0648\u0641\u0651\u0631\u062a \u0660\u066b\u0660\u0661\u00bb
  // (owner, 3 Nov). Under a riyal those go. Salla's own offer banner goes for good (CSS): at 2 tees it says \u00ab\u0623\u0636\u0641 \u0645\u0646\u062a\u062c
  // \u0648\u0627\u062d\u062f \u0648\u0627\u062d\u0635\u0644 \u0639\u0644\u0649 \u062e\u0635\u0645 \u0660\u066b\u0660\u0661\u00bb, and the .um-offer bar above says it all already
  var amount = function (s) {
    var m = String(s || '').replace(/[\u0660-\u0669]/g, function (d) { return d.charCodeAt(0) - 0x660; }).replace(/\u066b/g, '.').replace(/[\u066c,]/g, '').match(/\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : NaN;
  };
  var flag = function (n, k, on) { if (n.hasAttribute(k) !== on) n.toggleAttribute(k, on); };
  function offerZero() {
    if (!/\/cart(\/|$|\?)/.test(location.pathname)) return;
    // the free tee at 4 and up: the offer splits its 149 over the tees (the PDF wants that in the order: 111.75 each), so no
    // row said which tee is free (owner's screenshot 2026-11-04: \u00ab\u0645\u0634 \u0645\u0643\u062a\u0648\u0628 \u0639\u0644\u064a\u0647 \u0645\u062c\u0627\u0646\u064a\u00bb). While the bag's total is one tee
    // less than its count, the rows say it: every tee at its full price and the last one free. Only these words change: the
    // order keeps Salla's split, and with a coupon or another product in the bag the sums differ and Salla's numbers stay
    var rows = $$('form[id^="item-"]'), count = cartCount(), bar = $('salla-cart-summary-card .s-cart-summary-card-bar-total');
    var oneFree = count >= 4 && !!bar && Math.abs(amount(bar.textContent) - (count - 1) * PACK.price) < 0.05 && rows.every(function (f) {
      var w = $('.item-regular-price', f);
      return !!w && amount(w.textContent) === PACK.price;
    });
    var setMoney = function (node, v) {
      var n = node && node.firstChild, s = moneyNum(v) + ' ';
      if (n && n.nodeType === 3 && n.data !== s) n.data = s;
    };
    // the 4th tee given free (\u00ab\u0627\u0644\u0631\u0627\u0628\u0639 \u0639\u0644\u064a\u0646\u0627\u00bb, buy 3 get 1) shows 0 with 149 struck; Salla's line under it says
    // \u00ab\u062e\u0635\u0645 129.57\u00bb (the 149 before VAT), so on a free tee only the offer's name stays
    $$('salla-cart-item-offers').forEach(function (o) {
      var d = $('.s-cart-item-offers-discount', o), f = o.closest('form'), now = f && $('[data-testid="store-cart-item-price"]', f);
      flag(o, 'data-um-zero', oneFree || (!!d && amount(d.textContent) < 0.01));
      flag(o, 'data-um-free', !!now && amount(now.textContent) === 0);
    });
    // the free tee's own line: \u00ab\u0647\u062f\u064a\u062a\u0643 \u00b7 \u0645\u062c\u0627\u0646\u0627\u064b\u00bb instead of its price and total, and no quantity buttons (one gift; more
    // tees go in as paid ones) (owner). A last row of several tees keeps them: \u00ab\u0642\u0637\u0639\u0629 \u0645\u0646\u0647\u0627 \u0645\u062c\u0627\u0646\u064a\u0629\u00bb
    rows.forEach(function (f, i) {
      var was = $('.item-regular-price', f), now = $('[data-testid="store-cart-item-price"]', f), tot = $('[data-testid="store-cart-item-total"]', f);
      var qty = rowQty($('salla-quantity-input', f)), last = oneFree && i === rows.length - 1;
      if (oneFree) { setMoney(now, PACK.price); setMoney(tot, (qty - (last ? 1 : 0)) * PACK.price); }
      var gift = !!now && (amount(now.textContent) === 0 || (last && qty === 1)), part = last && qty > 1;
      flag(f, 'data-um-same', !!was && !!now && Math.abs(amount(was.textContent) - amount(now.textContent)) < 1);
      flag(f, 'data-um-gift', gift);
      flag(f, 'data-um-part', part);
      if ((gift || part) && !$('.um-gift-tag', f)) now.insertAdjacentHTML('afterend', '<span class="um-gift-tag"></span>');
      var tag = $('.um-gift-tag', f), words = part ? t('\u0642\u0637\u0639\u0629 \u0645\u0646\u0647\u0627 \u0645\u062c\u0627\u0646\u064a\u0629', 'One of them is free') : t('\u0647\u062f\u064a\u062a\u0643 \u00b7 \u0645\u062c\u0627\u0646\u0627\u064b', 'Your gift \u00b7 free');
      if (tag && tag.textContent !== words) tag.textContent = words;
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
  // the Duo page (Salla's info page #72145634, linked in the header): each offer as the UNMUTED store's Duo card (a
  // tilted photo of our couple shots, a big line, the price and one button), as bordered cards one under the other
  // (owner: no products on this page, our own couple photos, cards with a border). Two tees: one couple; buy 3 get the
  // 4th: two couples in different colours, each in its own frame, four voices
  var DUO_PICS = 'https://cdn.jsdelivr.net/gh/unmutedsa/unmuted-raed@e4a1e42404b44ff875112a268dd835a8512db142/cdn/photos/duo/';
  var DUO_CARDS = [
    { pack: PACKS[1], tone: 'blue', pics: ['unmuted-sticker'], badge: t('\u062e\u0635\u0645<br>\u0661\u0665\u066a', '15%<br>off'),
      title: t('\u0635\u0648\u062a\u064a\u0646. \u0648\u0627\u062d\u062f \u0644\u0643 \u0648\u0648\u0627\u062d\u062f \u0644\u0635\u0627\u062d\u0628\u0643.', 'Two voices. One for you, one for a friend.'),
      deal: t('\u0623\u064a \u062a\u064a\u0634\u064a\u0631\u062a\u064a\u0646 \u062a\u062e\u062a\u0627\u0631\u0647\u0645 \u0628\u062e\u0635\u0645 \u0661\u0665\u066a.', 'Any two tees you pick, 15% off.'), go: t('\u0627\u062e\u062a\u0631 \u0635\u0648\u062a\u064a\u0646', 'Pick two voices') },
    { pack: PACKS[2], tone: 'orange', pics: ['cherry-market', 'caution'], badge: t('\u0627\u0644\u0631\u0627\u0628\u0639<br>\u0645\u062c\u0627\u0646\u0627\u064b', '4th<br>free'),
      title: t('\u062b\u0644\u0627\u062b \u0623\u0635\u0648\u0627\u062a. \u0627\u0644\u0631\u0627\u0628\u0639 \u0639\u0644\u064a\u0646\u0627.', 'Three voices. The fourth is on us.'),
      deal: t('\u0627\u0634\u062a\u0631\u0650 \u0663 \u062a\u064a\u0634\u064a\u0631\u062a\u0627\u062a \u0648\u0627\u0644\u0631\u0627\u0628\u0639 \u0645\u062c\u0627\u0646\u0627\u064b.', 'Buy 3 tees, the 4th is free.'), go: t('\u0627\u062e\u062a\u0631 \u0664 \u0623\u0635\u0648\u0627\u062a', 'Pick four voices') }
  ];
  function duoPage() {
    if (location.pathname.indexOf('page-' + PACK.page) < 0) return;
    var main = $('#main-content');
    if (!main || $('.um-duo-page')) return;
    var entry = $('.content--single-page .content-entry') || $('.content-entry');
    document.body.classList.add('um-duo-on');
    var shop = esc(allUrl());
    var page = el('div', 'um-duo-page',
      '<header class="um-duo-page__head"><h1>' + t('\u0628\u0643\u062c\u0627\u062a', 'Packages') + '</h1><p>' + t('\u0643\u0644 \u0645\u0627 \u0632\u0627\u062f\u062a \u0623\u0635\u0648\u0627\u062a\u0643 \u0632\u0627\u062f \u062a\u0648\u0641\u064a\u0631\u0643. \u0627\u0644\u0639\u0631\u0636 \u064a\u062a\u0637\u0628\u0642 \u062a\u0644\u0642\u0627\u0626\u064a\u0627\u064b \u0641\u064a \u0627\u0644\u0633\u0644\u0629 \u0639\u0644\u0649 \u0623\u064a \u062a\u064a\u0634\u064a\u0631\u062a\u0627\u062a \u062a\u062e\u062a\u0627\u0631\u0647\u0627.', 'The more voices, the more you save. It applies by itself in your bag, on any tees you pick.') + '</p></header>' +
      DUO_CARDS.map(function (c, n) {
        var p = c.pack;
        return '<section class="um-duo is-' + c.tone + (n % 2 ? ' is-flip' : '') + '" aria-labelledby="um-duo-' + p.n + '">' +
          '<div class="um-duo__pic' + (c.pics.length > 1 ? ' is-pair' : '') + '">' + c.pics.map(function (s) {
            return '<figure class="um-duo__photo"><img src="' + DUO_PICS + s + '.webp" alt="" width="880" height="1100" loading="lazy"></figure>';
          }).join('') + '<span class="um-duo__badge" aria-hidden="true">' + c.badge + '</span></div>' +
          '<div class="um-duo__text">' +
            '<h2 id="um-duo-' + p.n + '">' + c.title + '</h2>' +
            '<p class="um-duo__price">' + money(p.total) + '<s aria-label="' + t('\u0628\u062f\u0644 ', 'instead of ') + p.was + '">' + money(p.was) + '</s></p>' +
            '<ul class="um-duo__facts"><li>' + t('\u062a\u0648\u0641\u0651\u0631 ', 'You save ') + money(p.was - p.total) + '</li>' +
              '<li' + (p.free ? ' class="is-free"' : '') + '>' + (p.free ? t('\u0634\u062d\u0646 \u0645\u062c\u0627\u0646\u064a', 'Free shipping') : t('\u0627\u0644\u0634\u062d\u0646 ', 'Shipping ') + money(PACK.ship)) + '</li></ul>' +
            '<p class="um-duo__deal">' + c.deal + ' ' + t('\u0627\u0644\u062e\u0635\u0645 \u064a\u062a\u0637\u0628\u0651\u0642 \u062a\u0644\u0642\u0627\u0626\u064a\u0627\u064b \u0641\u064a \u0627\u0644\u0633\u0644\u0629.', 'It comes off by itself in your bag.') + '</p>' +
            '<a class="um-duo__go" href="' + shop + '">' + c.go + '</a>' +
          '</div>' +
        '</section>';
      }).join(''));
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
    return OPTS[id] || (OPTS[id] = salla.api.product.getDetails(id, ['options']).then(function (r) { return r.data; }, function (e) { delete OPTS[id]; throw e; }));
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
      return ((r && r.data) || []).filter(function (p) { return p.status === 'sale' && p.is_available !== false && (p.type || 'product') === 'product'; });
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

  function run() { previewLinks(); fonts(); header(); homeLink(); sections(); listing(); cards(); modelCards(); flips(); info(); product(); paperPage(); hdPhotos(); hdThumbs(); hangers(); related(); reviews(); dock(); quickBuy(); tiles(); fitHelper(); addLabel(); cart(); footer(); waOffer(); packs(); offerBar(); offerZero(); duoPage(); toastText(); }
  keepPlace();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  // Salla's components render after load (the size dropdown, the cart): look again while they settle
  var n = 0, iv = setInterval(function () { run(); if (++n > 40) clearInterval(iv); }, 250);
  addEventListener('resize', dock);
  new MutationObserver(function () { tiles(); fitHelper(); addLabel(); cards(); modelCards(); flips(); hdPhotos(); hdThumbs(); reviews(); quickBuy(); packs(); offerBar(); offerZero(); toastText(); }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
