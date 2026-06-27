document.addEventListener("DOMContentLoaded", () => {
  const adminContainer = document.getElementById("admin-grid");
  const container = document.getElementById("mentors-grid");
  if (!container || !window.UN4STEM_COURSES) return;

  const mentorMap = new Map();

  Object.values(window.UN4STEM_COURSES).forEach(course => {
    if (!course || !Array.isArray(course.mentors)) return;

    course.mentors.forEach(mentor => {
      if (!mentor || !mentor.name) return;

      if (!mentorMap.has(mentor.name)) {
        mentorMap.set(mentor.name, {
          ...mentor,
          image: (mentor.image || "").replace("../", ""),
          teaching: []
        });
      }

      if (course.title) {
        mentorMap.get(mentor.name).teaching.push(course.title);
      }
    });
  });

  const mentors = Array.from(mentorMap.values());
  const adminsOrder = ["Elliot Chang", "Emma Florence", "Lyla Rodrigues", "Aryan Mantena"];

  const getGrade = (role) => {
    const match = String(role || "").match(/Grade\s+(\d+)/i);
    return match ? parseInt(match[1], 10) : 13;
  };

  const sortMentors = (a, b) => {
    const aIsAssistant = String(a.role || "").toLowerCase().includes("assistant");
    const bIsAssistant = String(b.role || "").toLowerCase().includes("assistant");

    if (aIsAssistant !== bIsAssistant) {
      return aIsAssistant ? 1 : -1;
    }

    const aGrade = getGrade(a.role);
    const bGrade = getGrade(b.role);
    if (aGrade !== bGrade) {
      return bGrade - aGrade;
    }

    return a.name.localeCompare(b.name);
  };

  const renderCard = (m) => `
      <div class="card mentor-card" style="text-align: center;">
        <img src="${m.image}" alt="${m.name}" class="mentor-photo">
        <h3>${m.name}</h3>
        <p class="mentor-role">${m.role}</p>
        <p class="mentor-bio">${m.shortBio || m.bio}</p>
        ${m.teaching.length ? `<div class="mentor-footer">Mentoring: ${m.teaching.join(", ")}</div>` : ""}
      </div>
    `;

  const adminList = mentors
    .filter(m => adminsOrder.includes(m.name))
    .sort((a, b) => adminsOrder.indexOf(a.name) - adminsOrder.indexOf(b.name));
  const mentorList = mentors
    .filter(m => !adminsOrder.includes(m.name))
    .sort(sortMentors);

  if (adminContainer) {
    adminContainer.innerHTML = adminList.map(renderCard).join("");
  }

  container.innerHTML = mentorList.map(renderCard).join("");
});
