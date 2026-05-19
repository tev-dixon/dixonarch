# Dixon Architecture — Jekyll site

Tiny static site. No build step beyond `jekyll build`.

## Run it locally

```bash
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000

## Deploy

```bash
bundle exec jekyll build
```

Upload the contents of _site/ to your host. GitHub Pages, Netlify, and Cloudflare Pages all support Jekyll natively. 
