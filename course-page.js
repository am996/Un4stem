function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Splits the plain-text schedule from course-data.js into one object per session.
// Lines starting with 🗓 / ⏰ / 📍 become dates / time / days; "Total Classes: N" becomes
// the class count; a leading plain line is the session label; anything else is a note.
function parseSchedule(text) {
  if (!text) return [];

  return String(text)
    .split(/\n\s*\n/)
    .map(group => {
      const session = { label: "", dates: "", time: "", days: "", total: "", notes: [] };

      group
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean)
        .forEach(line => {
          if (line.startsWith("\u{1F5D3}")) session.dates = line.replace(/^\u{1F5D3}\uFE0F?\s*/u, "");
          else if (line.startsWith("\u23F0")) session.time = line.replace(/^\u23F0\uFE0F?\s*/u, "");
          else if (line.startsWith("\u{1F4CD}")) session.days = line.replace(/^\u{1F4CD}\uFE0F?\s*/u, "");
          else if (/^Total Classes:/i.test(line)) session.total = line.replace(/^Total Classes:\s*/i, "");
          else if (!session.label && !session.dates && !session.time && !session.days) session.label = line;
          else session.notes.push(line);
        });

      return session;
    });
}

function renderSchedule(text) {
  const sessions = parseSchedule(text);
  if (!sessions.length) return "";

  const hasRealSchedule = sessions.some(s => s.dates || s.time || s.days);
  if (!hasRealSchedule) {
    // e.g. "Scheduling will be provided soon"
    return `<p class="schedule-pending">${escapeHtml(sessions.map(s => [s.label, ...s.notes].filter(Boolean).join(" ")).join(" "))}</p>`;
  }

  // Blocks with no dates/time/days (e.g. "Sessions 1-4: ...") are extra notes, not sessions.
  const extraNotes = sessions
    .filter(s => !(s.dates || s.time || s.days))
    .flatMap(s => [s.label, ...s.notes].filter(Boolean));
  const realSessions = sessions.filter(s => s.dates || s.time || s.days);

  const cards = realSessions.map(s => {
    const facts = [
      s.dates ? `<li><span class="fact-icon" aria-hidden="true">\u{1F5D3}\uFE0F</span><span class="sr-only">Dates: </span>${escapeHtml(s.dates)}</li>` : "",
      s.time ? `<li><span class="fact-icon" aria-hidden="true">\u23F0</span><span class="sr-only">Time: </span>${escapeHtml(s.time.replace(" - ", " \u2013 "))}</li>` : "",
      s.days ? `<li><span class="fact-icon" aria-hidden="true">\u{1F4CD}</span><span class="sr-only">Days: </span>${escapeHtml(s.days)}</li>` : ""
    ].join("");

    return `
      <article class="session-card">
        ${s.label ? `<h3 class="session-label">${escapeHtml(s.label)}</h3>` : ""}
        <ul class="session-facts">${facts}</ul>
        ${s.total ? `<p class="session-total">Total Classes: <strong>${escapeHtml(s.total)}</strong></p>` : ""}
        ${s.notes.map(n => `<p class="session-note">${escapeHtml(n)}</p>`).join("")}
      </article>`;
  }).join("");

  return `
    <div class="session-grid session-count-${realSessions.length}">${cards}</div>
    ${extraNotes.length ? `<div class="schedule-extra">${extraNotes.map(n => `<p>${escapeHtml(n)}</p>`).join("")}</div>` : ""}
    <p class="schedule-reminder"><strong>Reminder:</strong> All program schedules are listed in <strong>Eastern Daylight Time (EDT)</strong>. Students are expected to meet all stated <strong>prerequisites</strong> prior to sign-up. For any questions or clarifications, please contact us at <a href="https://un4stem.org/">un4stem.org</a>.</p>`;
}

function renderPrerequisites(text) {
  const items = String(text || "")
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  if (!items.length) return "";
  if (items.length === 1 && /^(n\/a|none)$/i.test(items[0])) {
    return `<p class="prereq-none">N/A</p>`;
  }

  return `<ul class="prereq-list">${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

document.addEventListener("DOMContentLoaded", () => {
  // Safety check: ensure the data object exists
  if (!window.UN4STEM_COURSES) {
    console.error("UN4STEM_COURSES is not defined. Make sure course-data.js is loaded before course-page.js.");
    return;
  }

  const key = document.body.dataset.course;
  const course = window.UN4STEM_COURSES[key];

  if (!course) {
    document.title = "Course Not Found - UN4STEM";
    const titleEl = document.getElementById("course-title");
    const subEl = document.getElementById("course-subtitle");
    if (titleEl) titleEl.textContent = "Course Not Found";
    if (subEl) subEl.textContent = "Please return to Programs and choose a course.";
    return;
  }

  // Populate text content with safety checks for IDs
  document.title = `${course.title} - UN4STEM`;
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setText("course-title", course.title);
  setText("course-subtitle", course.short);
  setText("course-overview", course.overview);

  const subtitleEl = document.getElementById("course-subtitle");
  if (subtitleEl) {
    const formatEl = document.createElement("p");
    formatEl.className = "course-format-badge";
    formatEl.textContent = "💻 Live online class · 100% free";
    subtitleEl.insertAdjacentElement("afterend", formatEl);
  }

  const scheduleEl = document.getElementById("course-schedule");
  if (scheduleEl) {
    scheduleEl.innerHTML = renderSchedule(course.schedule);
  }

  const prerequisitesEl = document.getElementById("course-prerequisites");
  if (prerequisitesEl) {
    prerequisitesEl.innerHTML = renderPrerequisites(course.prerequisites);
  }

  const detailGrid = document.querySelector(".detail-grid");
  const registerContainer = document.getElementById("course-registration");
  if (detailGrid && registerContainer && registerContainer.parentNode) {
    registerContainer.parentNode.insertBefore(detailGrid, registerContainer);
  }

  const illustration = document.getElementById("course-illustration");
  if (illustration) {
    illustration.src = course.image;
    illustration.alt = course.imageAlt;
  }

  // Render Mentors
  const mentorContainer = document.getElementById("course-mentors");
  if (mentorContainer && Array.isArray(course.mentors) && course.mentors.length) {
    mentorContainer.innerHTML = course.mentors.map(m => `
      <div class="card mentor-card">
        <img src="${m.image}" alt="${m.name}" class="mentor-photo">
        <h3>${m.name}</h3>
        <p class="mentor-role">${m.role}</p>
        <p class="mentor-bio">${m.bio}</p>
      </div>
    `).join("");
  } else if (mentorContainer && mentorContainer.parentElement) {
    mentorContainer.parentElement.hidden = true;
  }

  // Render Registration CTA
  if (registerContainer) {
    if (course.registrationClosed || course.registrationClosedMessage) {
      registerContainer.innerHTML = `
        <div class="course-registration-cta course-registration-closed">
          <h3>Registration Closed</h3>
          <p>Registration for this class has officially closed, as we have either reached maximum capacity or the registration deadline has passed.</p>
          <p>Thank you for your interest and support!</p>
          <p>Please visit <a href="https://un4stem.org/">un4stem.org</a> to explore our other available courses and opportunities. For any questions, please email <a href="mailto:un4stem@gmail.com">un4stem@gmail.com</a>.</p>
          <p>We hope to see you in another class!</p>
        </div>
      `;
    } else if (course.registrationLink) {
      registerContainer.innerHTML = `
        <div class="course-registration-cta">
          <h3>Ready to start learning?</h3>
          <p>Secure your spot in this course by filling out our student registration form.</p>
          <a class="btn btn-red" href="${course.registrationLink}" target="_blank">Register for Class</a>
        </div>
      `;
    } else {
      registerContainer.innerHTML = `
        <div class="course-registration-cta">
          <h3>Ready to join us?</h3>
          <a class="btn btn-red" href="../apply.html">Volunteer Now</a>
        </div>
      `;
    }
  }
});
