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

  // Helper to extract grade number from role string
  const getGrade = (role) => {
    const match = role.match(/Grade (\d+)/);
    return match ? parseInt(match[1]) : 13; // Default for non-grade roles like Founder/VP
  };

  const sortedMentors = mentors.sort((a, b) => {
    const aIsAssistant = a.role.toLowerCase().includes("assistant");
    const bIsAssistant = b.role.toLowerCase().includes("assistant");

    // Rule: Assistant mentors at the bottom
    if (aIsAssistant !== bIsAssistant) {
      return aIsAssistant ? 1 : -1;
    }

    // Rule: Sort by grade descending (12 down to 9)
    const aGrade = getGrade(a.role);
    const bGrade = getGrade(b.role);
    if (aGrade !== bGrade) {
      return bGrade - aGrade;
    }

    // Tertiary sort: Alphabetical by name
    return a.name.localeCompare(b.name);
  });

  container.innerHTML = sortedMentors.map(m => {
    // Adjust path for root level
    const imagePath = m.image.replace('../', '');
    
    return `
      <div class="card mentor-card">
        <img src="${imagePath}" alt="${m.name}" class="mentor-photo">
        <h3>${m.name}</h3>
        <p class="mentor-role">${m.role}</p>
        <p class="mentor-bio">${m.shortBio || m.bio}</p>
        <div class="mentor-footer">Mentoring: ${m.teaching.join(', ')}</div>
      </div>
    `;
  }).join('');
});