async function loadAdminEvents() {
  const [eventsResponse, adminResponse] = await Promise.all([
    fetch("data/events.json"),
    fetch("data/events-admin.json")
  ]);
  const eventsData = await eventsResponse.json();
  const adminData = await adminResponse.json();

  const roleTarget = document.getElementById("adminRoleCards");
  if (roleTarget) {
    roleTarget.innerHTML = adminData.roles.map((role) => `
      <article class="summary-card meetings"><strong>${role}</strong><span>${(adminData.permissions[role] || []).length}</span><small>permissions</small></article>
    `).join("");
  }

  const eventTarget = document.getElementById("adminEventCards");
  if (eventTarget) {
    eventTarget.innerHTML = eventsData.events.map((eventItem) => `
      <article class="event-card ${eventItem.theme}">
        <div class="card-banner"><strong>${eventItem.title}</strong><br>${eventItem.status}</div>
        <p>${eventItem.category} / ${eventItem.date}</p>
        <button type="button" data-admin-action="Edit ${eventItem.title}">Edit Placeholder</button>
        <button type="button" data-admin-action="Upload MOM for ${eventItem.title}">Upload MOM</button>
      </article>
    `).join("");
  }
}

loadAdminEvents().catch((error) => {
  document.body.insertAdjacentHTML("afterbegin", `<div class="admin-strip">Unable to load admin events: ${error.message}</div>`);
});
