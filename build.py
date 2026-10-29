# Builds dist/unmuted-raed.css: the stylesheet with the header logo inlined (Salla's custom CSS has no file hosting).
# Usage: python3 -I build.py   (from this folder)
import base64, os

here = os.path.dirname(os.path.abspath(__file__))
logo = base64.b64encode(open(os.path.join(here, 'logo-300.png'), 'rb').read()).decode()
css = open(os.path.join(here, 'unmuted-raed.css'), encoding='utf-8').read().replace('__LOGO__', '"data:image/png;base64,' + logo + '"')
os.makedirs(os.path.join(here, 'dist'), exist_ok=True)
open(os.path.join(here, 'dist', 'unmuted-raed.css'), 'w', encoding='utf-8').write(css)
print('dist/unmuted-raed.css', len(css), 'chars')
