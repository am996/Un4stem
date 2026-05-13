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
  requestAnimationFrame(() => {
    document.body.classList.add("loaded");
  });

  const key = document.body.dataset.course;
  const course = window.UN4STEM_COURSES[key];

  if (!course) {
    document.title = "Course Not Found - UN4STEM";
    document.getElementById("course-title").textContent = "Course Not Found";
    document.getElementById("course-subtitle").textContent = "Please return to Programs and choose a course.";
    return;
  }

  document.title = `${course.title} - UN4STEM`;
  document.getElementById("course-title").textContent = course.title;
  document.getElementById("course-subtitle").textContent = course.short;
  document.getElementById("course-category").textContent = course.category;
  document.getElementById("course-level").textContent = course.level;
  document.getElementById("course-overview").textContent = course.overview;
  document.getElementById("course-project").textContent = course.project;
  document.getElementById("course-best-for").textContent = course.bestFor;

  fillList("course-outcomes", course.outcomes);
  fillList("course-topics", course.topics);

  document.querySelectorAll("a").forEach(link => {
    const href = link.getAttribute("href");

    if (!href || href.startsWith("#") || href.startsWith("http")) return;

    link.addEventListener("click", (e) => {
      e.preventDefault();

      document.body.classList.add("fade-out");

      setTimeout(() => {
        window.location.href = href;
      }, 250);
    });
  });
});
