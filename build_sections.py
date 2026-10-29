# Builds cdn/: the UNMUTED home sections of the Twilight theme (../salla-theme-unmuted) for the Raed copy.
#   cdn/sections.html  the sections in ORDER rendered with their default settings, image paths as __BASE__/images/…
#   cdn/sections.css   the sections' styles (06-unmuted layer only; Raed's own CSS is already on the page)
#   cdn/sections.js    the sections' scripts (motion, rail drag, voice, pickers, quick buy…), one file
#   cdn/images/…       every image / video the sections use
# unmuted-raed.js loads them on the home page from jsDelivr (public repo unmutedsa/unmuted-raed).
# Rendering uses the theme's local preview harness (twig.js + Salla stand-ins); set HARNESS if it moved.
# Usage: python3 -I build_sections.py
import os, re, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
THEME = os.path.normpath(os.path.join(HERE, '..', 'salla-theme-unmuted'))
HARNESS = os.environ.get('HARNESS', '/private/tmp/claude-501/-Users-dana-Downloads-Future-Bridge-Full-CMS-V3-3-Clean/96d672f4-d2a4-463a-8c2f-e46bebb237d5/scratchpad/umprev/render.cjs')
OUT = os.path.join(HERE, 'cdn')
# 2026-10-30 the user removed voice, lookbook, duo, colors, cats, spot, drop, video, banner, size and track from the
# Raed copy only (they stay in the Twilight theme)
ORDER = ['hero', 'rail', 'tracks', 'promises', 'faq']
STYLES = ['tokens', 'base', 'motion', 's-hero', 's-voice', 's-rail', 'quickview', 's-tracks', 's-lookbook', 's-colors', 's-duo',
          's-promises', 's-cats', 's-drop', 's-spot', 's-video', 's-size', 's-faq', 's-banner', 's-track', 'text-colors']

def run(cmd, cwd=None):
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f'failed: {" ".join(cmd)}\n{r.stdout[-2000:]}\n{r.stderr[-2000:]}')
    return r.stdout

os.makedirs(OUT, exist_ok=True)

# 1. render every section with the harness, then keep ours in store order
run(['node', HARNESS], cwd=os.path.dirname(HARNESS))
page = open(os.path.join(os.path.dirname(HARNESS), 'site', 'store.html'), encoding='utf-8').read()
main = page[page.index('<main>') + 6:page.index('</main>')]
parts = re.split(r'(?=<section id="um-[a-z-]+-\d+")', main)
by_name = {}
for p in parts:
    m = re.match(r'<section id="um-([a-z-]+)-\d+"', p)
    if m:
        by_name[m.group(1)] = p.strip()
missing = [n for n in ORDER if n not in by_name]
if missing:
    sys.exit(f'sections not rendered: {missing}')
html = '\n'.join(re.sub(r'<section id="um-([a-z-]+)-\d+"', lambda m, i=i: f'<section id="um-{m.group(1)}-{i}"', by_name[n], count=1) for i, n in enumerate(ORDER))
images = sorted(set(re.findall(r'/assets/(images/[^"\')\s]+)', html)))
html = html.replace('/assets/images/', '__BASE__/images/')
open(os.path.join(OUT, 'sections.html'), 'w', encoding='utf-8').write(html)

# 2. the images they use
shutil.rmtree(os.path.join(OUT, 'images'), ignore_errors=True)
for rel in images:
    src = os.path.join(THEME, 'src', 'assets', rel)
    dst = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copyfile(src, dst)

# 3. styles: the section partials compiled on their own
entry = os.path.join(HERE, '.sections-entry.scss')
open(entry, 'w').write(''.join(f"@import '{s}';\n" for s in STYLES))
run([os.path.join(THEME, 'node_modules', '.bin', 'sass'), '--no-source-map', '--style=compressed', '--quiet',
     '--load-path=' + os.path.join(THEME, 'src', 'assets', 'styles', '06-unmuted'), entry, os.path.join(OUT, 'sections.css')])
os.remove(entry)

# 4. scripts: one bundle (webpack from the theme, run outside the theme folder so its own config isn't picked up)
run([os.path.join(THEME, 'node_modules', '.bin', 'webpack'), os.path.join(THEME, 'src', 'assets', 'js', 'unmuted', 'index.js'),
     '--mode', 'production', '--target', 'web', '--output-path', OUT, '--output-filename', 'sections.js'], cwd=HERE)

sizes = {f: os.path.getsize(os.path.join(OUT, f)) for f in ('sections.html', 'sections.css', 'sections.js')}
print('sections:', ', '.join(ORDER))
print('files:', ', '.join(f'{k} {v // 1024} KB' for k, v in sizes.items()), f'| {len(images)} images')
