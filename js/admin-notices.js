async function loadAdminNotices() {
  const [noticeResponse, adminResponse] = await Promise.all([
    fetch("data/notices.json"),
    fetch("data/notices-admin.json")
  ]);
  const noticesData = await noticeResponse.json();
  const adminData = await adminResponse.json();
  const target = document.getElementById("adminNoticeCards");
  if (!target) return;
  target.innerHTML = noticesData.notices.map((notice) => `
    <article class="notice-card ${notice.theme}">
      <div class="card-top">
        <span class="notice-icon">${notice.icon}</span>
        <span class="status-badge">${notice.status}</span>
      </div>
      <h3>${notice.title}</h3>
      <p>${notice.category} / ${notice.priority} / ${notice.date}</p>
      <p>Admin permissions prepared: ${Object.keys(adminData.permissions).length} roles</p>
      <button type="button" data-admin-action="Edit ${notice.title}">Edit</button>
      <button type="button" data-admin-action="Publish or unpublish ${notice.title}">Publish/Unpublish</button>
      <button type="button" data-admin-action="Archive ${notice.title}">Archive</button>
    </article>
  `).join("");
}

loadAdminNotices().catch((error) => {
  document.body.insertAdjacentHTML("afterbegin", `<div class="access-strip">Unable to load admin notices: ${error.message}</div>`);
});
