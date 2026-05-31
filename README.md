# IBP Windsor Valley Welfare Society Portal

Static GitHub Pages compatible society management portal for IBP Windsor Valley Welfare Society, an under-development residential society with Blocks A to H.

## Features

- Dashboard with plots, occupancy, RWA membership, complaints, dues, workers, visitors, notices, events, expenses and maintenance task metrics.
- Society block layout and property status filters.
- Public resident directory with privacy-safe fields only.
- RWA office bearers, executive members, block coordinators, AGM and meeting schedule.
- Maintenance collection, paid/pending status, expenses, vendor bills and work history.
- Utilities for water, submersible, tank, pipeline, street light, common electricity, NPCL, CCTV, sewage and garbage tracking.
- Complaint Center with resident complaint form, colorful status cards, timeline/details modal, masked resident data and Admin/RWA work-order placeholders.
- Visitor Records & Gate Pass module with masked public visitor cards, approval workflow placeholders, gate passes, notifications and Admin/Security Guard management placeholders.
- Workforce Management module with public-safe worker directory, attendance status, monthly calendar, leave/holiday records, payment tracking and admin placeholders.
- Documents Repository, Notice Board, published WhatsApp links, reports and emergency help placeholders.
- Documents Repository module with public document viewing, search/filter, detail modal, public downloads, restricted/private access rules and admin document management placeholders.
- Notice Board module with public published notices, search/filter, detail modal, attachment placeholders, WhatsApp actions and admin notice management placeholders.
- Community Activities, Meetings & Events Center with RWA meetings, AGM, builder follow-up, MOM repository, galleries, event documents and admin management placeholders.
- Reports & Analytics Center with auto-generated reports, uploaded report repository, KPI cards, charts, filters, details modal and admin placeholders.
- Emergency & Services help center with colorful service cards, search, category filters, details modal, quick actions, sticky emergency contacts and dark mode.
- PWA-ready manifest and service worker.
- Dockerfile using nginx.

## Navigation

Home, Society, Residents, RWA, Maintenance, Utilities, Complaint Center, Visitor Records, Workforce Management, Documents Repository, Notice Board, Community Activities, Reports & Analytics, Emergency & Services.

## Privacy Rules

The public app must never display resident mobile numbers, emails, Aadhaar, full vehicle numbers, family details or private documents.

The public resident directory only shows:

- Block
- House number
- Resident name
- Owner/Tenant status
- RWA member status

Private sample structures are kept separately in `data/private-sample.json` for future login-based access.

## Complaint Center Workflow

Residents can open the Complaint Center, raise a complaint with category, block, house, title, description, priority and photo placeholder, then track the public status lifecycle: Open, Assigned, In Progress, On Hold, Resolved, Reopened and Closed.

Admin/RWA users will need future secure login before real management actions are enabled. The current static admin pages demonstrate assignment, status updates, remarks, proof upload placeholders, reopen/close/archive actions, work-order generation and complaint reports. Real upload, notification, delete/archive and resident contact workflows require Firebase or Supabase authentication, database and storage.

## Data

- `data/public-data.json` contains dummy public JSON for the portal.
- `data/visitor-records.json`, `data/gate-passes.json`, and `data/visitor-notifications.json` contain dummy visitor, gate pass and notification placeholder data.
- `data/visitor-public.json` documents the public visitor privacy model.
- `data/visitor-admin.json` contains Admin/Security Guard role placeholders for future login-based access.
- `data/workers.json` contains public-safe worker role, attendance and payment status data.
- `data/workers-public.json` documents the public worker access model.
- `data/workers-admin.json` contains admin-only sample worker role and permission structures.
- `data/worker-attendance.json`, `data/worker-payments.json`, and `data/worker-holidays.json` contain dummy workforce operations data.
- `data/complaints.json` contains dummy complaint, status, priority, timeline, assignment and work-proof placeholder data.
- `data/complaints-public.json` documents the public complaint privacy model.
- `data/complaints-admin.json` contains Admin/RWA permission and future backend placeholders.
- `data/documents.json` contains public and restricted document repository data.
- `data/documents-public.json` documents the public document access model.
- `data/documents-admin.json` contains admin-only sample document role and permission structures for future login-based access.
- `data/notices.json` contains public notice board data, attachment placeholders and published WhatsApp links.
- `data/notices-public.json` documents the public notice access model.
- `data/notices-admin.json` contains admin-only sample notice role and permission structures for future login-based access.
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
- `visitor-records.html` - public Visitor Records & Gate Pass module.
- `visitor-records.css` - responsive visitor records design.
- `visitor-records.js` - visitor filters, cards, gate passes, reports and details modal.
- `admin-visitor-records.html`, `visitor-entry-form.html`, `gate-pass-form.html`, `visitor-approval-requests.html` - future Admin/Security Guard placeholders.
- `js/admin-visitors.js` - static admin visitor placeholder behavior.
- `workforce-management.html` - public Workforce Attendance & Payment Management Center.
- `workforce-management.css` - responsive workforce dashboard design.
- `workforce-management.js` - worker filters, tabs, attendance calendar, payments and modal details.
- `admin-workers.html`, `worker-form.html`, `worker-attendance.html`, `worker-payment.html` - future admin workforce placeholders.
- `js/admin-workers.js` - static admin worker placeholder behavior.
- `uploads/workers/` - future worker document, contract and ID proof upload folders.
- `complaints.html` - public Complaint & Work Order Management Center.
- `complaints.css` - responsive colorful complaint dashboard design.
- `complaints.js` - complaint search, filters, summary cards, modal details and report placeholders.
- `admin-complaints.html`, `complaint-form.html`, `complaint-details.html`, `complaint-workorder.html` - future Admin/RWA complaint and resident form placeholders.
- `js/admin-complaints.js` - static admin complaint, form and work-order placeholder behavior.
- `uploads/complaints/` - future complaint photo and work-proof upload folders.
- `documents-repository.html` - public Documents Repository module.
- `documents-repository.css` - responsive document repository design.
- `documents-repository.js` - document search, filters, cards, public downloads and detail modal.
- `admin-documents.html` - future document admin list placeholder.
- `document-form.html` - future upload/edit document form placeholder.
- `js/admin-documents.js` - static admin document placeholder behavior.
- `uploads/documents/` - future public, restricted, private, meeting minutes, bills, legal and utility document folders.
- `notice-board.html` - public Notice Board module.
- `notice-board.css` - responsive notice board design.
- `notice-board.js` - notice search, filters, cards, modal and WhatsApp actions.
- `admin-notices.html` - future notice admin list placeholder.
- `notice-form.html` - future create/edit notice form placeholder.
- `js/admin-notices.js` - static admin notice placeholder behavior.
- `uploads/notices/` - future notice attachment folders for PDF, image and document uploads.
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
