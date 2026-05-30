# IBP Windsor Valley Welfare Society Portal

Static GitHub Pages compatible society management portal for IBP Windsor Valley Welfare Society, an under-development residential society with Blocks A to H.

## Features

- Dashboard with plots, occupancy, RWA membership, complaints, dues, workers, visitors, notices, events, expenses and maintenance task metrics.
- Society block layout and property status filters.
- Public resident directory with privacy-safe fields only.
- RWA office bearers, executive members, block coordinators, AGM and meeting schedule.
- Maintenance collection, paid/pending status, expenses, vendor bills and work history.
- Utilities for water, submersible, tank, pipeline, street light, common electricity, NPCL, CCTV, sewage and garbage tracking.
- Complaints with category, status, assignee and work-order style history.
- Security gate entries, visitor/delivery/worker/vehicle records and masked vehicle numbers.
- Worker attendance, duty shift, assigned area and payment status with contacts hidden.
- Documents, notices, WhatsApp links, reports and emergency help placeholders.
- Community Activities, Meetings & Events Center with RWA meetings, AGM, builder follow-up, MOM repository, galleries, event documents and admin management placeholders.
- Reports & Analytics Center with auto-generated reports, uploaded report repository, KPI cards, charts, filters, details modal and admin placeholders.
- Emergency & Services help center with colorful service cards, search, category filters, details modal, quick actions, sticky emergency contacts and dark mode.
- PWA-ready manifest and service worker.
- Dockerfile using nginx.

## Navigation

Home, Society, Residents, RWA, Maintenance, Utilities, Complaints, Security, Workers, Documents, Notices, Community Activities, Reports & Analytics, Emergency & Services.

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
- `data/events.json` contains public event, MOM, gallery and event document data.
- `data/events-public.json` documents the public event access model.
- `data/events-admin.json` contains admin-only sample role and permission structures for future login-based access.
- `reports-data.json` contains public report metadata, upload placeholders and admin/auth placeholders.
- `emergency-services.json` contains public emergency and service directory data.
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
- `events.html` - Community Activities, Meetings & Events Center.
- `events.css` - responsive event center design.
- `events.js` - event filters, cards, MOM repository, gallery and details modal.
- `admin-login.html` - future admin authentication placeholder.
- `admin-dashboard.html` - future event admin dashboard placeholder.
- `admin-events.html` - future event management list placeholder.
- `admin-event-form.html` - future create/edit event form placeholder.
- `js/admin-auth.js` - static admin authentication placeholder behavior.
- `js/admin-events.js` - static admin event placeholder behavior.
- `uploads/` - event upload folder structure for future MOM, gallery, videos, attendance and documents.
- `reports.html` - Reports & Analytics Center.
- `reports.css` - responsive reporting dashboard design.
- `reports.js` - report analytics, filters, charts and modal details.
- `reports-data.json` - report category, upload and admin placeholder data.
- `reports/` - report repository folder structure for future uploaded files.
- `emergency-services.html` - standalone emergency and services help center.
- `emergency-services.css` - responsive help center design.
- `emergency-services.js` - help center search, filters, modal details and quick actions.
- `emergency-services.json` - dummy emergency and services data.
- `data/public-data.json` - public dummy data.
- `data/private-sample.json` - private placeholder structure.
- `manifest.json` - PWA manifest.
- `service-worker.js` - offline cache.
- `Dockerfile` - nginx static hosting.
