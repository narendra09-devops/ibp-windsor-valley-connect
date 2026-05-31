async function loadAdminDocuments() {
  const [documentResponse, adminResponse] = await Promise.all([
    fetch("data/documents.json"),
    fetch("data/documents-admin.json")
  ]);
  const documentsData = await documentResponse.json();
  const adminData = await adminResponse.json();
  const target = document.getElementById("adminDocumentCards");
  if (!target) return;
  target.innerHTML = documentsData.documents.map((doc) => `
    <article class="document-card ${doc.theme}">
      <div class="card-top">
        <span class="doc-icon">${doc.icon}</span>
        <span class="status-badge">${doc.status}</span>
      </div>
      <h3>${doc.title}</h3>
      <p>${doc.category} / ${doc.access} / ${doc.fileType}</p>
      <p>Admin permissions prepared: ${Object.keys(adminData.permissions).length} roles</p>
      <button type="button" data-admin-action="Edit ${doc.title}">Edit</button>
      <button type="button" data-admin-action="Replace version for ${doc.title}">Replace Version</button>
      <button type="button" data-admin-action="Archive ${doc.title}">Archive</button>
    </article>
  `).join("");
}

loadAdminDocuments().catch((error) => {
  document.body.insertAdjacentHTML("afterbegin", `<div class="access-strip">Unable to load admin documents: ${error.message}</div>`);
});
