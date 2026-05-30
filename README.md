# IBP Windsor Valley Connect

A static, mobile-responsive society dashboard for an under-development residential community. The public property list is generated from the local `Residance-Block.xlsx` resident/block record.

## Modules

- Interactive society overview dashboard for Blocks A to H.
- Block-wise property status with plot/house number, occupancy status, RWA membership, occupant label, and water source.
- Maintenance tracker for water motor repair, street lights, sewage, cleaning, security, common electricity, and expense history.
- Monthly maintenance records with expected collection, received money, pending amount, expenses, and closing balance.
- Payment collection register with house, resident, month, amount, mode, and payment status.
- IBP RWA bank account and UPI scan-and-pay card using the published QR asset.
- RWA certificate PDF, policy documents, and gate pass entry rules.
- NPCL prepaid common meter account details with recharge manual and account screenshot.
- RWA team cards with only public name and post.
- Know About RWA, common motor, common light, and helpline portal tabs.
- Web layout diagram for Blocks A to H, roads, Phase II, and main entry reference.
- Events section for Holi, Diwali, Jagran, meetings, photos, and videos.
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

Bank account details in the public site are masked demo details. Replace them only after confirming what should be publicly visible.

The UPI QR image is included because it is intended for public maintenance payment collection. Resident phone numbers, email IDs, full vehicle numbers, and private documents remain excluded.

NPCL account values shown publicly are taken from the masked account screenshot. RWA team mobile numbers are also masked for public display.

The RWA team section intentionally shows only name and post. The registration certificate remains embedded on the page and can also be opened as a PDF.

## Running Locally

Open `index.html` in a browser. No backend or package installation is required.

For GitHub Pages, publish the repository root or `/docs` only if these files are copied there. The current structure is root-ready because `index.html`, `css/style.css`, and `js/app.js` use relative paths.

## Files

- `index.html` - dashboard layout and module sections.
- `css/style.css` - responsive visual design, cards, tables, charts, and badges.
- `js/app.js` - resident-derived public data, dummy finance records, filters, search, metrics, and rendering.
- `manifest.json` - basic PWA metadata.
- `assets/images/RWA-Society-Account-UPI.jpeg` - UPI scan-and-pay image.
- `assets/images/ibp-windsor-valley-logo.svg` - site logo.
- `assets/images/Prepaid-meter-Account-details.png` - NPCL common meter account screenshot.
- `assets/documents/RWA_Windsor_Valley_Certificate.pdf` - RWA certificate PDF.
- `assets/documents/Prepaid_recharge_manual.pdf` - NPCL prepaid recharge manual.
