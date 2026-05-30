# IBP Windsor Valley Welfare Society Portal

Static GitHub Pages compatible society management portal for IBP Windsor Valley Welfare Society, an under-development residential society with Blocks A to H.

## Features

- Dashboard with plots, occupancy, RWA membership, complaints, dues, workers, visitors, notices, expenses and maintenance task metrics.
- Society block layout and property status filters.
- Public resident directory with privacy-safe fields only.
- RWA office bearers, executive members, block coordinators, AGM and meeting schedule.
- Maintenance collection, paid/pending status, expenses, vendor bills and work history.
- Utilities for water, submersible, tank, pipeline, street light, common electricity, NPCL, CCTV, sewage and garbage tracking.
- Complaints with category, status, assignee and work-order style history.
- Security gate entries, visitor/delivery/worker/vehicle records and masked vehicle numbers.
- Worker attendance, duty shift, assigned area and payment status with contacts hidden.
- Documents, notices, WhatsApp links, reports and emergency help placeholders.
- PWA-ready manifest and service worker.
- Dockerfile using nginx.

## Navigation

Home, Dashboard, Society, Residents, RWA, Maintenance, Utilities, Complaints, Security, Workers, Documents, Notices, Reports, Help.

## Privacy Rules

The public app must never display resident mobile numbers, emails, Aadhaar, full vehicle numbers, family details or private documents.

The public resident directory only shows:

- Block
- House number
- Resident name
- Owner/Tenant status
- RWA member status

Private sample structures are kept separately in `data/private-sample.json` for future login-based access.

## Data

- `data/public-data.json` contains dummy public JSON for the portal.
- `data/private-sample.json` contains private-data placeholders only.
- Existing public assets are under `assets/`.

## Run Locally

Because the app uses `fetch()` to load JSON, run it with a local static server:

```powershell
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Docker

Build and run with nginx:

```powershell
docker build -t ibp-windsor-valley-connect .
docker run --rm -p 8080:80 ibp-windsor-valley-connect
```

Open `http://localhost:8080`.

## GitHub Pages

The app is root-ready for GitHub Pages. Publish from the repository root on the `main` branch.

## File Structure

- `index.html` - static app shell and module containers.
- `css/style.css` - responsive visual design.
- `js/app.js` - JSON loading, filters and rendering.
- `data/public-data.json` - public dummy data.
- `data/private-sample.json` - private placeholder structure.
- `manifest.json` - PWA manifest.
- `service-worker.js` - offline cache.
- `Dockerfile` - nginx static hosting.
