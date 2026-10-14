# Onwardpath Website

Static website for [onwardpath.com](https://onwardpath.com), hosted on Bluehost.
Changes pushed to the `main` branch are automatically minified and deployed via Bitbucket Pipelines.

---

## Prerequisites

Install these once on your machine before getting started:

- **Git** — https://git-scm.com/downloads
- **Node.js (v20 or later)** — https://nodejs.org

Verify both are installed by opening a terminal and running:

```
git --version
node --version
```

---

## First-Time Setup

### 1. Clone the repository

```
git clone https://bitbucket.org/onwardpath/onwardpath-site.git
cd onwardpath-site
```

### 2. Install dependencies

```
npm install
```

---

## Running Locally

```
npm start
```

Opens the site at **http://localhost:3000** with auto-reload on file save.

The local server processes the header and footer partials so the site looks the same as the live site.

---

## Making Changes

### Everyday workflow

```
1. Make changes to HTML, CSS, or JS files
2. Preview at http://localhost:3000
3. git add .
4. git commit -m "describe what you changed"
5. git push
```

After pushing, the pipeline runs automatically (~2-3 minutes) and the live site is updated.

### File structure

```
onwardpath-site/
├── css/                  # Stylesheets
│   ├── style.css
│   ├── timeline.css
│   └── perzo-overrides.css
├── js/                   # JavaScript
│   ├── scripts.js
│   └── content-manager.js
├── images/               # All images
├── partials/             # Shared header and footer
│   ├── header.html
│   └── footer.html
├── index.html
├── about.html
├── consulting.html
├── aem-staffing.html
├── ourwork.html
├── perzo.html
├── privacy.html
├── open-roles.html
└── 404.html
```

### Updating the header or footer

Edit `partials/header.html` or `partials/footer.html` — changes apply to all pages automatically.

---

## Deployment

Deployment is fully automated. Every push to `main`:

1. Installs npm packages
2. Minifies all CSS and JS files
3. Uploads changed files to Bluehost via FTP

**Never edit files directly in Bluehost File Manager** — any direct changes will be overwritten on the next deploy.

### Checking pipeline status

```
https://bitbucket.org/onwardpath/onwardpath-site/pipelines
```

---

## Important Notes

- **Do not run `npm run build` locally** — it minifies files in-place and overwrites your source. The pipeline handles this automatically.
- **Always work from the repository** — Bluehost is the destination, not the source.
- If the pipeline fails, check the pipeline logs in Bitbucket for the error details.

---

## Access

- **Bitbucket repository** — https://bitbucket.org/onwardpath/onwardpath-site
- **Live site** — https://onwardpath.com
- **Bluehost cPanel** — https://box2377.bluehost.com:2083
