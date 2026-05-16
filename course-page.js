function fillList(elementId, items) {
  const list = document.getElementById(elementId);
  if (!list) return; // Safety check: skip if element is missing

  list.innerHTML = "";

  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
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
  setText("course-category", course.category);
  setText("course-level", course.level);
  setText("course-overview", course.overview);
  setText("course-project", course.project);
  setText("course-best-for", course.bestFor);

  const illustration = document.getElementById("course-illustration");
  if (illustration) {
    illustration.src = course.image;
    illustration.alt = course.imageAlt;
  }

  fillList("course-outcomes", course.outcomes);
  fillList("course-topics", course.topics);

  // Render Mentors
  const mentorContainer = document.getElementById("course-mentors");
  if (mentorContainer && course.mentors) {
    const getGradeNum = (role) => {
      const r = role.toLowerCase();
      if (r.includes("president") && !r.includes("vice")) return -2;
      if (r.includes("vice president")) return -1;
      const match = role.match(/Grade\s+(\d+)/i);
      return match ? parseInt(match[1], 10) : 100;
    };

    // Sort: Lead vs Assistant, then Grade (9 to 12), then Alphabetical
    const sortedMentors = [...course.mentors].sort((a, b) => {
      const aIsAssistant = a.role.toLowerCase().includes("assistant");
      const bIsAssistant = b.role.toLowerCase().includes("assistant");

      if (aIsAssistant !== bIsAssistant) return aIsAssistant ? 1 : -1;

      const gradeA = getGradeNum(a.role);
      const gradeB = getGradeNum(b.role);
      if (gradeA !== gradeB) return gradeA - gradeB;

      return a.name.localeCompare(b.name);
    });

    mentorContainer.innerHTML = sortedMentors.map(m => `
      <div class="card mentor-card" style="text-align: center;">
        <img src="${m.image}" alt="${m.name}" class="mentor-photo">
        <h3>${m.name}</h3>
        <p class="mentor-role">${m.role}</p>
        <p class="mentor-bio">${m.bio}</p>
      </div>
    `).join("");
  }
});
