/* UNMUTED on Salla's free theme Raed (theme copy «UNMUTED على رائد», editor → تخصيص متقدم → JavaScript).
   Adds what unmuted-raed.css can't: size tiles over Salla's dropdown, the VOL / «voice» / tagline block read from the
   product description, fold-outs, the reassurance line, a search button, the home sections, «Wear your voice.» in the
   footer and the store's empty-bag words. Every part checks for Raed's markup first and does nothing without it. */
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
  var CDN_REF = '785ff0ae3be4e6320092b43f96efc8d6892855e9';
  var COLOURS = { 'أسود': '#1C1A20', 'أوف وايت': '#E6E2D9', 'أبيض': '#F4F2EE', 'أزرق ملكي': '#1F4EA6', 'رمادي': '#A4A5A0', 'موكا': '#62433D', 'شوكولاتة': '#50372F', 'رملي': '#D6BFA4', 'حجري': '#C6BAA8' };
  // the size chart and fit note from the store (placeholders until the owner confirms the numbers)
  var CHART = [['S', 54, 70], ['M', 57, 72], ['L', 60, 74], ['XL', 63, 76]];
  var exchangeUrl = function () {
    var a = $$('a').filter(function (x) { return /الاستبدال|exchange/i.test(x.textContent) && x.href; })[0];
    return a ? a.href : '';
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
    fetch(CDN + '/sections.html').then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); }).then(function (html) {
      var box = el('div', 'um-home', html.split('__BASE__').join(CDN));
      main.insertBefore(box, main.firstChild);
      links(box);
      var js = el('script');
      js.src = CDN + '/sections.js';
      js.defer = true;
      document.body.appendChild(js);
    }).catch(function () {
      css.remove();
      root.classList.remove('um-motion');
      document.body.classList.remove('theme-unmuted', 'um-home-on');
      window.__umHomeLoading = false;
    });
  }

  /* the sections were rendered with the demo tees: point each one at the real Salla product (matched by name in Raed's
     product list), the shop buttons at VOLUME 01, the «ask us» buttons at the store's contact, «طلباتي» at the orders */
  function links(box) {
    var volume = ($$('custom-main-menu a, .store-footer a').filter(function (a) { return /VOLUME\s*01/i.test(a.textContent) && a.href; })[0] || {}).href || '/';
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
      $$('.um-tracks a.um-tl__row, .um-tracks a[href="#"], .um-spot a[href="#"]', box).forEach(function (a) {
        var p = find(a.closest('.um-spot') ? a.closest('.um-spot').textContent : a.textContent);
        set(a, p ? p.url : volume);
      });
    })();
  }

  /* product page: name block, colour, sizes as tiles, reassurance line, fold-outs */
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
    // reassurance line under the add button
    var add = $('salla-add-product-button', form);
    var ex = exchangeUrl();
    if (add && !$('.um-trust')) add.insertAdjacentHTML('afterend', '<p class="um-trust"><span>' + t('الاستبدال خلال ٧ أيام، ونوصل لكل مدن المملكة.', '7-day exchange, delivery across Saudi Arabia.') + (ex ? ' <a href="' + esc(ex) + '">' + t('التفاصيل', 'Details') + '</a>' : '') + '</span></p>');
    // fold-outs + share, after the form
    var chart = '<table class="um-chart"><thead><tr><th>' + t('المقاس', 'Size') + '</th><th>' + t('عرض الصدر (سم)', 'Chest (cm)') + '</th><th>' + t('الطول (سم)', 'Length (cm)') + '</th></tr></thead><tbody>' +
      CHART.map(function (r) { return '<tr><td lang="en">' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>'; }).join('') + '</tbody></table>';
    var folds = el('div', 'um-folds',
      (aboutHtml ? '<details><summary>' + t('عن هذا الصوت', 'About this voice') + '</summary><div class="um-fbody">' + aboutHtml + '</div></details>' : '') +
      '<details id="um-size"><summary>' + t('المقاسات والقصّة', 'Sizes and fit') + '</summary><div class="um-fbody"><p>' + t('قصّة واسعة (Oversized) بنفس المقاسات للبنات والشباب. اختر مقاسك المعتاد للّبسة الواسعة، أو أصغر بمقاس لو تبيه أقرب للجسم.', 'One oversized cut, the same sizes for everyone. Take your usual size for a loose fit, or one down for a closer one.') + '</p>' + chart + '</div></details>' +
      '<details><summary>' + t('التوصيل والاستبدال', 'Delivery and exchange') + '</summary><div class="um-fbody"><p>' + t('نوصل لكل مدن المملكة، ورسوم الشحن تظهر في السلة قبل الدفع.', 'We deliver across Saudi Arabia; shipping shows in the bag before you pay.') + '</p><p>' + t('المقاس ما ضبط؟ تقدر تستبدله حسب ', 'Wrong size? Swap it under our ') + (ex ? '<a href="' + esc(ex) + '">' + t('سياسة الاستبدال', 'exchange policy') + '</a>' : t('سياسة الاستبدال', 'exchange policy')) + '.</p></div></details>');
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

  function run() { fonts(); header(); sections(); product(); tiles(); addLabel(); cart(); footer(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  // Salla's components render after load (the size dropdown, the cart): look again while they settle
  var n = 0, iv = setInterval(function () { run(); if (++n > 40) clearInterval(iv); }, 250);
  new MutationObserver(function () { tiles(); addLabel(); }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
