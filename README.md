# ALAS

Sitio web de **ALAS · Asesoría Legal de Artistas y Sellos**.

Una sola página, HTML/CSS/JS puros. Sin frameworks, sin build step.

## Estructura

```
.
├── index.html      ← toda la página (incluido CSS + JS inline)
├── hero.mp4        ← vídeo de la fase inicial (mármol)
├── clouds.mp4      ← vídeo de la fase final (nubes)
└── vercel.json     ← configuración mínima de cacheo
```

## Desarrollo local

No hay nada que compilar. Para verlo en local:

```bash
# con Python instalado
python3 -m http.server 8000
# o con Node
npx serve .
```

Y abre <http://localhost:8000>.

## Deploy a Vercel

1. Crea un repo nuevo en GitHub con estos archivos.
2. En [vercel.com](https://vercel.com) → **Add New Project** → importa el repo.
3. Framework Preset: **Other** (es un sitio estático, no detecta nada).
4. Build Command: dejar vacío. Output Directory: dejar vacío (raíz).
5. Deploy.

Vercel servirá `index.html` en la raíz directamente.

## Edición rápida

- **Email** y **link de calendario**: busca `hola@alaslegal.com` y `cal.com/alaslegal` en `index.html` y reemplaza.
- **Vídeos**: sustituye `hero.mp4` y `clouds.mp4` por archivos del mismo nombre (recomendado <2 MB cada uno, codec H.264, sin audio).
- **Copy del manifiesto** (`para los que firman / componen / …`): busca `swap-list` en `index.html`.
- **Copy del hero final** (`Asesoría legal de artistas y sellos`): busca `data-line=` en `index.html`.

## Tipografía

Se cargan **Geist** y **Geist Mono** desde Google Fonts vía `<link>`. Si quieres servirlas localmente, descarga los `.woff2` y reemplaza el `<link>` por `@font-face` en el `<style>`.
