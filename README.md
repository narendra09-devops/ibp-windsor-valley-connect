# IBP Windsor Valley Connect

A static, mobile-responsive society dashboard for an under-development residential community. The public property list is generated from the local `Residance-Block.xlsx` resident/block record.

## Modules

- Interactive society overview dashboard for Blocks A to H.
- Block-wise property status with plot/house number, occupancy status, RWA membership, occupant label, and water source.
- Maintenance tracker for water motor repair, street lights, sewage, cleaning, security, common electricity, and expense history.
- Worker attendance for security guard, sweeper, electrician, plumber, carpenter, labour, and technician roles.
- Visitor and vehicle attendance with purpose categories for guest, delivery, worker, and vendor.
- WhatsApp Connect page buttons for society group, security, RWA core team, and maintenance helpdesk.

## Resident Data Source

- Source workbook: `D:\10-IBP-Society-Documents-Maintenance-Details\Projects\Residance-Block.xlsx`
- Sheet used: `Resident Block List`
- Public fields used on GitHub Pages: block/plot number and family-head name where available.
- Blank resident names are shown as `Resident details pending`.
- Contact numbers and email IDs from the workbook are intentionally not copied into the published site files.

## Privacy Rules

The public dashboard does not display mobile numbers, email IDs, full vehicle numbers, private documents, or family details.

Public data is stored in `publicData` inside `js/app.js`. Future login-only fields are represented separately in `privateData`, but real private values should stay outside GitHub Pages until authentication exists.

## Running Locally

Open `index.html` in a browser. No backend or package installation is required.

For GitHub Pages, publish the repository root or `/docs` only if these files are copied there. The current structure is root-ready because `index.html`, `css/style.css`, and `js/app.js` use relative paths.

## Files

- `index.html` - dashboard layout and module sections.
- `css/style.css` - responsive visual design, cards, tables, charts, and badges.
- `js/app.js` - dummy JSON data, filters, search, metrics, and rendering.
- `manifest.json` - basic PWA metadata.
