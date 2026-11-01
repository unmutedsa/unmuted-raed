/* UNMUTED on Salla's free theme Raed (theme copy «UNMUTED على رائد», editor → تخصيص متقدم → JavaScript).
   Adds what unmuted-raed.css can't: size tiles over Salla's dropdown, the VOL / «voice» / tagline block read from the
   product description, fold-outs, a search button, the home sections, the VOLUME 01 page title,
   each card's voice and its turn to the other side on hover, 4K copies of product photos, «منتجات قد تعجبك» from the category, the info pages' cards, «Wear your voice.» in the footer and the store's empty-bag words. Every part checks for Raed's markup first and does nothing without it. */
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
  var CDN_REF = 'db6b0a06c52f42f34460008b367f434bbb60b1f5';
  var COLOURS = { 'أسود': '#1C1A20', 'أوف وايت': '#E6E2D9', 'أبيض': '#F4F2EE', 'أزرق ملكي': '#1F4EA6', 'رمادي': '#A4A5A0', 'موكا': '#62433D', 'شوكولاتة': '#50372F', 'رملي': '#D6BFA4', 'حجري': '#C6BAA8' };
  // the size chart and fit note from the store (placeholders until the owner confirms the numbers)
  var CHART = [['S', 54, 70], ['M', 57, 72], ['L', 60, 74], ['XL', 63, 76]];
  // a tee's «voice» and VOL number, as written in its Salla description («صوت المدينة»، الصوت رقم 03 من إصدار VOLUME 01)
  var latin = function (s) { return String(s).replace(/[٠-٩]/g, function (d) { return d.charCodeAt(0) - 0x660; }); };
  var voiceOf = function (p) {
    var d = String((p && p.description) || '').replace(/<[^>]+>/g, ' ');
    return { voice: ((d.match(/«([^»]+)»/) || [])[1] || '').trim(), vol: latin((d.match(/رقم\s+([0-9٠-٩]{1,3})/) || d.match(/VOL\.?\s*([0-9]{1,3})/i) || [])[1] || '') };
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
  // a product photo whose ALT (Salla → product → photo → ALT) says «شماعة» is the tee on its hanger: it hangs on the home
  // rail and shows in the tracklist, and the product page leaves it out. «شماعة خلف» is the back of the tee on the hanger.
  var HANGER = /شماع[ةه]|hanger/i, BACKSIDE = /خلف|ظهر|back/i;
  var money = function (n) { return window.salla && salla.money ? salla.money(n) : n + ' ' + t('ر.س', 'SAR'); };
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
  // «اختر صوتك»: the category that holds every tee (Salla has no all-products page). The shop buttons go there: the menu's
  // link, or Salla's short address of the category (it redirects) while the menu (it loads after the page) isn't there yet.
  var ALL_CAT = '1495831469';
  var allUrl = function () {
    var a = $$('custom-main-menu a').filter(function (x) { return x.textContent.trim() === 'اختر صوتك' && x.href; })[0];
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

  /* draft preview (salla.sa/<store>?preview=…): Salla writes the menu and product links with the store's own domain,
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
    b.setAttribute('aria-label', t('بحث', 'Search'));
    b.addEventListener('click', function () { if (window.salla && salla.event) salla.event.dispatch('search::open'); });
    end.insertBefore(b, end.firstChild);
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
      // the tees the rail has no cut-out for bring their «شماعة» photos from their product pages
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
      // this copy leaves out the hero's top line («هذي إشارتك عشان ترفع صوتك.») and the squiggle under it, and the rail's count line
      $$('.um-hero__eyebrow, .um-hero .um-fl.is-w, .um-rail .um-rls__sub', box).forEach(function (n) { n.remove(); });
      // each section takes its words, photos, tees or questions from the store; if that fails it keeps what it was built with
      [function () { bindHero(box); }, function () { bindRail(box, res[1], res[3]); }, function () { bindTracks(box, res[1], res[3]); },
        function () { bindPromises(box); }, function () { bindFaq(box, res[2]); }, function () { railTen(box); }, function () { railShowcase(box); }].forEach(function (f) { try { f(); } catch (e) { /* keeps its own */ } });
      main.insertBefore(box, main.firstChild);
      railTouch(box);
      links(box);
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
    });
  }

  /* What the store's own home elements hold (Raed's sections stay on the page, hidden) is what the UNMUTED sections show, so
     the words, photos, tees and questions are edited in Salla:
       hero      ← «صور متحركة»: first photo, main title, extra text
       rail      ← «منتجات ثابتة»: its title and its tees (the tees with a cut-out photo here keep it; others use their photo)
       tracklist ← the same tees, with the voice and VOL number from each description
       promises  ← «مميزات المتجر»: icon, title and line of each item
       questions ← the store's page «الأسئلة الشائعة» (Salla → الصفحات التعريفية): an h3 per question, the answer under it */
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
  var FAQ_PAGE = '92387200';   // «الأسئلة الشائعة», unless the footer links another one by that name
  function homeFaq() {
    var a = $$('.store-footer a').filter(function (x) { return /\/page-\d+/.test(x.href) && /الأسئلة الشائعة|FAQ/i.test(x.textContent); })[0];
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
  function bindHero(box) {
    var slide = $('#main-content > .s-block--hero-slider .swiper-slide'), hero = $('.um-hero', box);
    if (!slide || !hero) return;
    var title = $('h2', slide), sub = $('p', slide), bg = $('[style*="background-image"]', slide);
    if (title && title.textContent.trim()) copyText($('.um-hero__title um-t', hero), title);
    if (sub && sub.textContent.trim()) copyText($('.um-hero__sub um-t', hero), sub);
    else if ($('.um-hero__sub', hero)) $('.um-hero__sub', hero).remove();
    var url = bg && (bg.style.backgroundImage.match(/url\(["']?([^"')]+)/) || [])[1];
    if (url) $('.um-hero__photo', hero).src = url;
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
      if (!li) {   // no cut-out here: its «شماعة» photo (front, and back if there is one), else its main photo
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
      a.setAttribute('aria-label', p.name + '، ' + priceOf(p) + ' ' + t('ر.س', 'SAR'));
      return li;
    });
    track.textContent = '';
    out.forEach(function (li) { track.appendChild(li); });
  }
  // the rail hangs the first ten tees of the list (the section's «كل الأصوات» button leads to the rest), and its bar counts them
  var RAIL_MAX = 10;
  function railTen(box) {
    var rail = $('.um-rail', box), items = rail ? $$('[data-um-rail-track] > .um-rls__item', rail) : [];
    if (!items.length) return;
    items.slice(RAIL_MAX).forEach(function (li) { li.remove(); });
    var n = Math.min(items.length, RAIL_MAX), ends = $$('.um-rls__progress > span', rail), bar = $('[data-um-rail-bar]', rail);
    if (ends[1]) ends[1].textContent = pad(n);
    if (bar) bar.setAttribute('aria-valuemax', n);
  }
  function bindTracks(box, data, photos) {
    var list = $('.um-tracks ol.um-tl', box), rows = list ? $$('li', list) : [], byName = {};
    if (!data || !data.items.length || !rows.length) return;
    rows.forEach(function (li) { var b = $('.um-tl__name bdi', li); if (b) byName[b.textContent.trim().toLowerCase()] = li; });
    var out = data.items.map(function (p, i) {
      var li = byName[String(p.name).toLowerCase()], v = voiceOf(p);
      if (!li) { li = rows[0].cloneNode(true); $('.um-tl__img img', li).src = ((photos || {})[String(p.id)] || {}).front || imageOf(p); }
      $('a.um-tl__row', li).setAttribute('href', p.url);
      $('.um-tl__no', li).textContent = v.vol ? pad(v.vol) : pad(i + 1);
      $('.um-tl__name bdi', li).textContent = p.name;
      $('.um-tl__name small', li).textContent = v.voice;
      copyText($('.um-tl__end > b', li), money(priceOf(p)));
      // its back: the rail's back photo of the same tee (a cut-out, or its «شماعة خلف» photo)
      var hung = $$('.um-rail [data-um-qv]', box).filter(function (a) { return (a.getAttribute('data-name') || '').toLowerCase() === String(p.name).toLowerCase(); })[0];
      var back = hung && hung.getAttribute('data-back'), pic = $('.um-tl__img', li), model = mdOf(imageOf(p));
      $$('.um-tl__back', li).forEach(function (n) { n.remove(); });
      if (model && pic) modelTrack(pic, p, model);
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
  // a tee with model photos (the HD list below) shows its main one instead of the cut-out, and its «خلف» model photo on hover
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

  /* the rail is for looking: a tee there opens nothing (no quick buy, no link); «كل الأصوات» under it leads to VOLUME 01 */
  function railShowcase(box) {
    $$('.um-rail .um-rls__swing', box).forEach(function (a) {
      a.removeAttribute('href');
      a.removeAttribute('data-um-qv');
      a.setAttribute('role', 'img');
    });
  }

  /* phones: a sideways swipe on the rail drags it (rail.js follows the finger).
     - A finger belongs to the tee it first touched; when rail.js moves it over to the rail, that tee reports
       «lostpointercapture», which rail.js takes as the end of the drag, so only the rail's own one gets through.
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
     product list), the shop buttons at «اختر صوتك» (every tee), the «ask us» buttons at the store's contact, «طلباتي» at the orders */
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
    var voice = (plain.match(/«([^»]+)»/) || [])[1] || '';
    var vol = (plain.match(/رقم\s+([0-9٠-٩]{1,3})/) || plain.match(/VOL\.?\s*([0-9]{1,3})/i) || [])[1] || '';
    var colour = ((plain.match(/اللون:\s*([^.،]+)/) || [])[1] || '').trim();
    var tagline = lines[0] && lines[0].indexOf('«') < 0 && lines[0].indexOf('اللون:') < 0 ? lines[0] : '';
    if (vol) title.insertAdjacentHTML('beforebegin', '<p class="um-pvol" lang="en">VOL.' + esc(vol) + '</p>');
    if (/^[\x00-\x7F]/.test(title.textContent.trim())) title.setAttribute('lang', 'en');
    var after = '';
    if (voice) after += '<p class="um-pvoice">' + esc(voice) + '</p>';
    if (tagline) after += '<p class="um-ptag">' + esc(tagline) + '</p>';
    title.insertAdjacentHTML('afterend', after);
    var price = $('[data-testid="store-product-price"]');
    if (price) {
      var extra = '<p><span class="um-pchip">' + t('يونيسكس، قصّة واسعة', 'Unisex, oversized fit') + '</span></p>';
      if (colour) extra += '<div class="um-pcolour"><span>' + t('اللون:', 'Colour:') + ' <b>' + esc(colour) + '</b></span>' + (COLOURS[colour] ? '<i style="--c:' + COLOURS[colour] + '" aria-hidden="true"></i>' : '') + '</div>';
      price.insertAdjacentHTML('afterend', extra);
    }
    // the description moves into «عن هذا الصوت»
    var aboutHtml = box ? box.innerHTML : '';
    if (box) box.classList.add('um-pdesc-done');
    // fold-outs + share, after the form
    var chart = '<table class="um-chart"><thead><tr><th>' + t('المقاس', 'Size') + '</th><th>' + t('عرض الصدر (سم)', 'Chest (cm)') + '</th><th>' + t('الطول (سم)', 'Length (cm)') + '</th></tr></thead><tbody>' +
      CHART.map(function (r) { return '<tr><td lang="en">' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>'; }).join('') + '</tbody></table>';
    var folds = el('div', 'um-folds',
      (aboutHtml ? '<details><summary>' + t('عن هذا الصوت', 'About this voice') + '</summary><div class="um-fbody">' + aboutHtml + '</div></details>' : '') +
      '<details id="um-size"><summary>' + t('المقاسات والقصّة', 'Sizes and fit') + '</summary><div class="um-fbody"><p>' + t('قصّة واسعة (Oversized) بنفس المقاسات للبنات والشباب. اختر مقاسك المعتاد للّبسة الواسعة، أو أصغر بمقاس لو تبيه أقرب للجسم.', 'One oversized cut, the same sizes for everyone. Take your usual size for a loose fit, or one down for a closer one.') + '</p>' + chart + '</div></details>');
    form.parentNode.insertBefore(folds, form.nextSibling);
    var share = el('button', 'um-share', t('شارك هذا الصوت', 'Share this voice'));
    share.type = 'button';
    share.addEventListener('click', function () {
      var data = { title: title.textContent.trim(), text: voice ? voice + (tagline ? ': ' + tagline : '') : tagline, url: location.href.split('#')[0] };
      if (navigator.share) navigator.share(data).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(data.url).then(function () { share.textContent = t('نسخنا الرابط.', 'Link copied.'); });
    });
    folds.parentNode.insertBefore(share, folds.nextSibling);
  }

  /* product list pages (VOLUME 01): the name as a poster title with the store's swoosh, the sort beside it as a pill.
     Raed's own title row (it turns the name into «أكثر من 15 منتج») steps aside. */
  function listing() {
    if (!document.body.classList.contains('product-index')) return;
    var main = $('.container--products-list .main-content');
    if (!main || $('.um-plp-head', main)) return;
    var name = document.title.split('|')[0].trim() || (($('#page-main-title') || {}).textContent || '').trim();
    var head = el('header', 'um-plp-head',
      '<div class="um-plp-name"><h1 class="um-plp-title"' + (/^[\x00-\x7F]+$/.test(name) ? ' lang="en"' : '') + '>' + esc(name) +
      '<svg class="um-plp-line" viewBox="0 0 420 44" preserveAspectRatio="none" aria-hidden="true"><path class="um-plp-line-shadow" d="M14 34C120 22 260 16 404 18"/><path d="M10 28C116 16 256 10 400 12"/></svg></h1>' +
      (/^VOLUME/i.test(name) || location.pathname.indexOf('/c' + ALL_CAT) >= 0 ? '<p class="um-plp-sub">' + t('كل تيشيرت هنا له صوت وله شخصية. اختر اللي يشبهك.', 'Every tee here has a voice and a character. Pick the one that sounds like you.') + '</p>' : '') + '</div>');
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
     «شماعة» photo). Only where there's a mouse; the photo list is asked for when the card is about to show. */
  var hoverable = !!(window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches);
  var flipIO = hoverable && window.IntersectionObserver ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      flipIO.unobserve(en.target);
      var c = en.target, pic = $('.s-product-card-image', c), front = pic && $('a img', pic);
      if (!c.product || !front || en.boundingClientRect.width < 60) return;
      photosOf(c.product.id).then(function (imgs) {
        var other = imgs.filter(function (i) { return i.url && !i.main && !i.video_url && !HANGER.test(i.alt || ''); })[0];
        if (!other || $('.um-cback', pic)) return;
        var back = el('img', 'um-cback um-face-back');
        back.alt = '';
        back.src = other.url;
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

  /* info pages (الشحن والتوصيل، الاستبدال والاسترجاع، الخصوصية): the Twilight theme's policies look (its js/unmuted/page.js).
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
    { id: 'shipping', re: /شحن|توصيل|shipping|delivery/i, c: 'var(--um-orange)', icon: 'truck', sticker: ['في الطريق لك', 'On its way'], s: 'var(--um-blue)', nav: ['الشحن', 'Shipping'] },
    { id: 'exchange', re: /استبدال|استرجاع|إرجاع|ارجاع|exchange|return|refund/i, c: 'var(--um-blue)', icon: 'swap', sticker: ['المقاس ما ضبط؟', 'Wrong size?'], s: 'var(--um-orange)', nav: ['الاستبدال', 'Exchange'] },
    { id: 'privacy', re: /خصوصي|بياناتك|privacy/i, c: 'var(--um-blue)', dark: true, icon: 'lock', sticker: ['بياناتك لك', 'Your data stays yours'], s: 'var(--um-orange)', nav: ['الخصوصية', 'Privacy'] }
  ];
  var ROTATION = ['var(--um-orange)', 'var(--um-blue)'];
  // a heading that says what we *don't* do turns its list into crosses
  var NEGATIVE = /(^|[\s،,])(ما|لا|لن|مو|ممنوع|not|never|don['’]t|won['’]t)([\s،,:]|$)/i;
  var kids = function (n) { return Array.prototype.slice.call(n.childNodes); };
  var isBlank = function (n) { return n.nodeType === 3 ? !n.textContent.trim() : n.nodeType !== 1; };
  var isList = function (n) { return !!n && n.nodeType === 1 && (n.tagName === 'UL' || n.tagName === 'OL'); };
  var isBold = function (n) { return !!n && n.nodeType === 1 && /^(STRONG|B)$/.test(n.tagName); };
  var leadsWithBold = function (li) { return isBold(kids(li).filter(function (n) { return !isBlank(n); })[0]); };

  // a list whose every point starts in bold → the fact tiles (bold = the fact, the rest = its note)
  function facts(list) {
    var ul = el('ul', 'um-info-facts');
    Array.prototype.slice.call(list.children).forEach(function (li) {
      var strong = Array.prototype.slice.call(li.children).filter(isBold)[0], tile = el('li'), b = el('b'), note = el('span');
      b.textContent = strong.textContent.trim();
      strong.remove();
      kids(li).forEach(function (n) { note.appendChild(n); });
      if (note.firstChild && note.firstChild.nodeType === 3) note.firstChild.textContent = note.firstChild.textContent.replace(/^[\s:،,–—-]+/, '');
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
    // h3 + list pairs → yes / no lists, side by side when there are two or more
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
        nav.setAttribute('aria-label', t('أقسام الصفحة', 'On this page'));
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
      var end = el('div', 'um-info-end', '<p>' + t('جاهز تختار صوتك؟', 'Ready to pick your voice?') + '</p>');
      var go = el('a', 'um-info-btn', t('شوف كل الأصوات', 'See every voice'));
      go.href = allUrl();
      end.appendChild(go);
      page.insertBefore(end, body.nextSibling);
    } finally {
      body.classList.add('um-info-body');
      page.classList.add('is-ready');
    }
    // a link to …#privacy arrives before the cards exist
    var target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target && body.contains(target)) target.scrollIntoView({ block: 'start' });
  }

  /* product photos in 4K: Salla keeps a product photo at 800x1000 at most, so a photo with a 4K copy in this repo
     (cdn/photos/, at a pinned commit) shows that copy in the gallery and the full-screen view; the thumbnails stay
     Salla's. The key is the name Salla gave the uploaded file (the last part of its address). A gallery photo turns 4K
     once its copy has loaded, the one showing and its neighbours first, so a slow or missing copy changes nothing. */
  var PHOTOS = 'https://cdn.jsdelivr.net/gh/unmutedsa/unmuted-raed@fe9fc0f99bccd4cc52509e818355bb0c0104201f/cdn/photos/';
  var HD = {
    ZHKr1xwBcqjn4PhV2sBf7GdedXuSdHN8vUFVq3rP: 'carnival/duo-front.jpg',
    '6maPE9bIuKJHIrCi9DEi5MdzBgy4PxuZzFsx8TGE': 'carnival/man-back.jpg',
    O2J1KSm16jfmdbYxjB8CE5udQMKmnHEd7P2sWr66: 'carnival/man-front.jpg',
    yRK6JbRtqM2PSeKNLkKL98Gw408w4p3pTLOzOhhR: 'carnival/man-side.jpg',
    SBiJ4SI7cmXZRtMnQNVT1VNpyBRlDVxh64gCrHvs: 'carnival/woman-back.jpg',
    VGwt08zFmP0jkVT29XRkV7NETQtryGLxdTyhynqH: 'carnival/woman-front.jpg',
    f11fWsFMDntU5hIoZSVuIupK6xSHSGlCeE6kXIWu: 'carnival/woman-side.jpg'
  };
  var hdOf = function (url) {
    var m = String(url || '').match(/([A-Za-z0-9]{40})\.(?:jpe?g|png|webp)(?:[?#]|$)/);
    return m && HD[m[1]] ? PHOTOS + HD[m[1]] : '';
  };
  // the same photo at 1600x2000 (cdn/photos/<tee>/md/), sharp enough for a card and light enough for the home page
  var mdOf = function (url) { var hd = hdOf(url); return hd ? hd.replace(/([^/]+)$/, 'md/$1') : ''; };
  function hdPhotos() {
    var box = $('salla-slider.details-slider .s-slider-container');
    if (!box || !box.swiper || box.hasAttribute('data-um-hd')) return;
    box.setAttribute('data-um-hd', '');
    var links = $$('a[data-fslightbox]', box), swapped = false;
    links.forEach(function (a) { var hd = hdOf(a.getAttribute('href')); if (hd) { a.setAttribute('href', hd); swapped = true; } });
    if (swapped && typeof window.refreshFsLightbox === 'function') window.refreshFsLightbox();
    var upgrade = function (k) {
      var slide = $$('.swiper-wrapper > .swiper-slide', box)[k];   // looked up each time: hangers() may drop slides
      var img = slide && $('img', slide), hd = img && !img.hasAttribute('data-um-hd') && hdOf(img.getAttribute('src'));
      if (!hd) return;
      img.setAttribute('data-um-hd', '');
      var pre = new Image();
      pre.onload = function () { img.src = hd; };
      pre.src = hd;
    };
    var near = function () { var k = box.swiper.activeIndex; upgrade(k); upgrade(k + 1); upgrade(k - 1); };
    near();
    box.swiper.on('slideChange', near);
  }

  /* a product card whose photo is one of those model photos fills its frame like the gallery does (cards don't carry
     the photo's ALT, so the file name tells) */
  function modelCards() {
    $$('custom-salla-product-card').forEach(function (c) {
      var box = $('.s-product-card-image', c);
      if (box && c.product && c.product.image && hdOf(c.product.image.url)) box.classList.add('um-model');
    });
  }

  /* product photos: the «شماعة» photos are for the home rail, so the gallery leaves them out (never all of them).
     (The «الأمام / الخلف» switch that sat over the photo was removed at the owner's request, 2026-11-01.) */
  function hangers() {
    var slider = $('salla-slider.details-slider');
    var box = slider && $('.swiper.s-slider-container', slider);
    if (!box || !box.swiper || slider.hasAttribute('data-um-hangers')) return;
    slider.setAttribute('data-um-hangers', '');
    var sw = box.swiper, thumbs = $('.swiper.s-slider-thumbs-container', slider), all = $$('.swiper-wrapper > .swiper-slide img', box), drop = [];
    all.forEach(function (img, i) { if (HANGER.test(img.alt || '')) drop.push(i); });
    if (drop.length < all.length) drop.reverse().forEach(function (i) { sw.removeSlide(i); if (thumbs && thumbs.swiper) thumbs.swiper.removeSlide(i); });
  }

  /* «منتجات قد تعجبك» under the product: Salla's related list comes back empty for these tees, so the slider shows the
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
    n.setAttribute('block-title', old.getAttribute('block-title') || t('منتجات قد تعجبك', 'You may also like'));
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
  /* «اشترِ الآن» is drawn inside Salla's component, where the page's CSS can't reach: it gets the store's pill there */
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
        var b = el('button', 'um-tile', esc(o.textContent.replace(/\s*[-–(].*$/, '').trim()));
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

  /* the add button speaks like the store: «أضف صوتك للسلة» (only Salla's default label is swapped) */
  function addLabel() {
    $$('.product-form salla-add-product-button .s-button-text').forEach(function (s) {
      // narrow screens: Salla shows only the cart icon and keeps the words for screen readers; they show beside it
      var sr = $('.s-add-product-button-sr-only', s);
      if (sr) {
        if (/أضف إلى السلة|إضافة للسلة/.test(sr.textContent)) sr.textContent = 'أضف صوتك للسلة';
        else if (/add to cart/i.test(sr.textContent)) sr.textContent = 'Add your voice to the bag';
        sr.classList.add('um-label');
        return;
      }
      var txt = s.textContent.trim();
      if (txt === 'أضف إلى السلة' || txt === 'إضافة للسلة') s.textContent = 'أضف صوتك للسلة';
      else if (txt === 'Add to cart' || txt === 'Add To Cart') s.textContent = 'Add your voice to the bag';
    });
  }

  /* bag: a «سلتك» title, and the store's words when it's empty */
  function cart() {
    if (!/\/cart(\/|$|\?)/.test(location.pathname)) return;
    var crumbs = $('#main-content .breadcrumbs');
    var main = $('#main-content .container') || $('#main-content');
    var title = '<h1 class="um-cart-title">' + t('سلتك', 'Your bag') + '</h1>';
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
      if (name) name.insertAdjacentHTML('afterend', '<p class="um-cmeta">' + esc(picked.join('، ')) + '</p>');
      if (!missing) opts.closest('salla-product-options').classList.add('um-copts-done');
    });
    var empty = $('.no-content-placeholder');
    if (empty && !$('.um-empty-sub', empty)) {
      var p = $('p', empty);
      if (p) p.textContent = t('سلتك ساكتة.', 'Your bag is on mute.');
      if (p) p.insertAdjacentHTML('afterend', '<p class="um-empty-sub">' + t('اختر صوت وخلّها تتكلم.', 'Pick a voice and let it speak.') + '</p>');
      var a = $('a', empty);
      if (a) a.textContent = t('تصفّح الأصوات', 'Browse the voices');
    }
  }

  /* footer: the store's closing line */
  function footer() {
    var f = $('.store-footer');
    if (!f || $('.um-ftr-big')) return;
    f.insertBefore(el('div', 'um-ftr-big', '<p lang="en" dir="ltr">Wear your voice.</p><p>' + t('البس صوتك.', 'البس صوتك.') + '</p>'), f.firstChild);
  }

  /* back to a page (the browser's back button) lands where it was left. The home's sections and Salla's product lists
     are added after the page loads, so on the way back the page is short at first: the browser's own restore would stop
     at the footer, the sections would then push the view up to the top, and only then would it reach the spot. So the
     page (not the header) stays hidden until it sits at the spot, then fades in. */
  function keepPlace() {
    var key = 'um-y:' + location.pathname + location.search, root = document.documentElement;
    addEventListener('pagehide', function () { try { sessionStorage.setItem(key, String(Math.round(scrollY))); } catch (e) { /* private mode */ } });
    var nav = window.performance && performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] : null, y = 0;
    try { y = Number(sessionStorage.getItem(key)) || 0; } catch (e) { /* private mode */ }
    if (!nav || nav.type !== 'back_forward' || !y) return;
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    root.classList.add('um-restoring');
    var stop = false, steady = 0, h = 0, tries = 0;
    var show = function () { root.classList.remove('um-restoring'); };
    ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) { addEventListener(t, function () { stop = true; show(); }, { once: true, passive: true }); });
    setTimeout(show, 3500);   // whatever happens, the page shows
    (function go() {
      if (stop || ++tries > 60) return show();   // the visitor moved, or 6s went by
      var tall = root.scrollHeight - innerHeight >= y - 2;
      if (tall) scrollTo({ top: y, behavior: 'instant' });   // the theme scrolls smoothly; this must be a jump
      steady = tall && Math.abs(scrollY - y) < 3 && root.scrollHeight === h ? steady + 1 : 0;
      h = root.scrollHeight;
      if (steady >= 3) show();                  // at the spot and the page has stopped growing: show it
      if (steady < 8) setTimeout(go, 100);      // and keep it there while late images settle
    })();
  }

  function run() { previewLinks(); fonts(); header(); sections(); listing(); cards(); modelCards(); flips(); info(); product(); hdPhotos(); hangers(); related(); reviews(); dock(); quickBuy(); tiles(); addLabel(); cart(); footer(); }
  keepPlace();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  // Salla's components render after load (the size dropdown, the cart): look again while they settle
  var n = 0, iv = setInterval(function () { run(); if (++n > 40) clearInterval(iv); }, 250);
  addEventListener('resize', dock);
  new MutationObserver(function () { tiles(); addLabel(); cards(); modelCards(); flips(); reviews(); quickBuy(); }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
