function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatCourseInfo(text) {
  if (!text) return "";

  return String(text)
    .split(/\n\s*\n/)
    .map(group => {
      const rows = group
        .split("\n")
        .filter(Boolean)
        .map(line => `<span>${escapeHtml(line)}</span>`)
        .join("");

      return `<span class="course-info-row">${rows}</span>`;
    })
    .join("");
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
  const scheduleEl = document.getElementById("course-schedule");
  if (scheduleEl) {
    scheduleEl.innerHTML = `<div class="course-info-list">${formatCourseInfo(course.schedule)}</div>`;
  }

  const prerequisitesEl = document.getElementById("course-prerequisites");
  if (prerequisitesEl) {
    prerequisitesEl.innerHTML = `<div class="course-info-list">${formatCourseInfo(course.prerequisites)}</div>`;
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
    if (course.registrationLink) {
      registerContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 50px;">
          <h3>Ready to start learning?</h3>
          <p style="margin-bottom: 20px; margin-left: auto; margin-right: auto;">Secure your spot in this course by filling out our student registration form.</p>
          <a class="btn btn-red" href="${course.registrationLink}" target="_blank">Register for Class</a>
        </div>
      `;
    } else {
      registerContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 50px;">
          <h3>Ready to join us?</h3>
          <a class="btn btn-red" href="../apply.html">Volunteer Now</a>
        </div>
      `;
    }
  }
});
