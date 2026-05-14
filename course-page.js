function fillList(elementId, items) {
  const list = document.getElementById(elementId);
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
});
