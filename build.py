# Builds what goes into Salla's theme editor:
#   dist/unmuted-raed.css: the stylesheet with the header logo inlined (Salla's custom CSS has no file hosting)
#   dist/unmuted-raed.js:  the script as it is
# Both are written in pure ASCII (every Arabic letter as an escape: CSS \000627, JS ا). Salla serves the custom
# CSS/JS with no charset, and a browser that guesses Latin-1 showed «السلة» as «Ø§Ù„Ø³Ù„Ø©» (2026-11-03); ASCII reads
# the same in every encoding. The sources stay readable; upload the dist copies.
# Usage: python3 -I build.py   (from this folder)
import base64, os

here = os.path.dirname(os.path.abspath(__file__))


def ascii_css(s):
    # a 6-digit escape needs no space after it
    return ''.join(c if ord(c) < 128 else '\\%06X' % ord(c) for c in s)


def ascii_js(s):
    out = []
    for c in s:
        n = ord(c)
        if n < 128:
            out.append(c)
        elif n <= 0xFFFF:
            out.append('\\u%04x' % n)
        else:
            n -= 0x10000
            out.append('\\u%04x\\u%04x' % (0xD800 + (n >> 10), 0xDC00 + (n & 0x3FF)))
    return ''.join(out)


logo = base64.b64encode(open(os.path.join(here, 'logo-300.png'), 'rb').read()).decode()
css = open(os.path.join(here, 'unmuted-raed.css'), encoding='utf-8').read().replace('__LOGO__', '"data:image/png;base64,' + logo + '"')
js = open(os.path.join(here, 'unmuted-raed.js'), encoding='utf-8').read()
os.makedirs(os.path.join(here, 'dist'), exist_ok=True)
open(os.path.join(here, 'dist', 'unmuted-raed.css'), 'w', encoding='ascii').write(ascii_css(css))
open(os.path.join(here, 'dist', 'unmuted-raed.js'), 'w', encoding='ascii').write(ascii_js(js))
print('dist/unmuted-raed.css', len(css), 'chars; dist/unmuted-raed.js', len(js), 'chars')
