document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("mentors-grid");
  if (!container || !window.UN4STEM_COURSES) return;

  const mentorMap = new Map();

  // Aggregate unique mentors from all course data
  Object.values(window.UN4STEM_COURSES).forEach(course => {
    if (course.mentors && Array.isArray(course.mentors)) {
      course.mentors.forEach(mentor => {
        if (!mentorMap.has(mentor.name)) {
          mentorMap.set(mentor.name, {
            ...mentor,
            teaching: [course.title]
          });
        } else {
          mentorMap.get(mentor.name).teaching.push(course.title);
        }
      });
    }
  });

  const mentors = Array.from(mentorMap.values());

  container.innerHTML = mentors.map(m => {
    // Adjust path for root level
    const imagePath = m.image.replace('../', '');
    
    return `
      <div class="card mentor-card">
        <img src="${imagePath}" alt="${m.name}" class="mentor-photo">
        <h3>${m.name}</h3>
        <p class="mentor-role">${m.role}</p>
        <p class="mentor-bio">${m.bio}</p>
        <div class="mentor-footer">Mentoring: ${m.teaching.join(', ')}</div>
      </div>
    `;
  }).join('');
});