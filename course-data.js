const UN4STEM_COURSES = {
  "cellular-biology": {
    title: "Cellular Biology",
    short: "Cell structure and biological systems",
    category: "Biology",
    level: "Introductory to intermediate",
    overview: "Cellular Biology helps students understand life at its smallest working scale. Students study how cells are organized, how organelles work together, how materials move across membranes, and how cellular processes support larger biological systems.",
    outcomes: [
      "Identify major cell structures and explain their functions.",
      "Compare plant, animal, and bacterial cells.",
      "Explain diffusion, osmosis, active transport, and cell signaling.",
      "Connect cellular processes to health, growth, and disease."
    ],
    topics: [
      "Cell theory and microscopes",
      "Organelles and membranes",
      "Photosynthesis and cellular respiration",
      "DNA, proteins, and cell division"
    ],
    project: "Students build a visual model of a cell pathway and explain how one disruption can affect the whole system.",
    bestFor: "Students who like biology, medicine, lab science, or understanding how living systems work."
  },
  "anatomy": {
    title: "Anatomy and Physiology",
    short: "Human body systems",
    category: "Biology",
    level: "Introductory",
    overview: "Anatomy and Physiology introduces the structure and function of the human body. Students learn how major body systems work independently and how they coordinate to keep the body stable, active, and healthy.",
    outcomes: [
      "Describe the roles of major organs and body systems.",
      "Explain how body systems maintain homeostasis.",
      "Use correct anatomical terms for location and movement.",
      "Connect body functions to real health and exercise examples."
    ],
    topics: [
      "Skeletal and muscular systems",
      "Circulatory and respiratory systems",
      "Nervous and endocrine systems",
      "Digestive, immune, and reproductive systems"
    ],
    project: "Students trace one everyday activity, such as running or eating, through multiple body systems.",
    bestFor: "Students interested in medicine, sports science, biology, or health careers."
  },
  "psychology": {
    title: "Psychology",
    short: "Mind and behavior",
    category: "Life Science",
    level: "Introductory",
    overview: "Psychology explores how people think, feel, learn, remember, and interact. The course connects major psychological ideas to school, relationships, motivation, stress, and decision-making.",
    outcomes: [
      "Explain basic concepts in cognition, emotion, and behavior.",
      "Recognize how memory, attention, and learning work.",
      "Discuss social influence and human development.",
      "Apply psychology concepts to everyday student life."
    ],
    topics: [
      "Brain basics and behavior",
      "Learning, memory, and attention",
      "Emotion, motivation, and personality",
      "Social psychology and development"
    ],
    project: "Students design a small observation or survey and present what it suggests about behavior.",
    bestFor: "Students curious about people, the brain, communication, education, or mental health."
  },
  "physics": {
    title: "Physics",
    short: "Motion and forces",
    category: "Physical Science",
    level: "Introductory to intermediate",
    overview: "Physics gives students a clear foundation in the rules that describe motion, energy, forces, and waves. Lessons focus on intuitive explanations first, then build toward equations and problem solving.",
    outcomes: [
      "Interpret motion using position, velocity, and acceleration.",
      "Use Newton's laws to analyze forces.",
      "Explain energy transfer and conservation.",
      "Solve multi-step problems with units and diagrams."
    ],
    topics: [
      "Kinematics and graphing motion",
      "Forces and Newton's laws",
      "Work, energy, and momentum",
      "Waves, sound, and electricity basics"
    ],
    project: "Students analyze a real motion scenario, create diagrams, and explain the physics behind it.",
    bestFor: "Students preparing for physical science, engineering, robotics, or advanced STEM courses."
  },
  "chemistry": {
    title: "Chemistry",
    short: "Matter and reactions",
    category: "Physical Science",
    level: "Introductory",
    overview: "Chemistry helps students understand matter, atoms, bonding, and reactions. The course emphasizes patterns, models, and practical examples so students can make sense of formulas instead of memorizing them blindly.",
    outcomes: [
      "Describe atomic structure and periodic table trends.",
      "Explain ionic and covalent bonding.",
      "Balance chemical equations and identify reaction types.",
      "Connect chemistry to materials, medicine, and the environment."
    ],
    topics: [
      "Atoms, elements, and the periodic table",
      "Bonding and molecular structure",
      "Chemical reactions and equations",
      "Acids, bases, and solutions"
    ],
    project: "Students investigate a household material and explain its properties using chemistry concepts.",
    bestFor: "Students who want stronger chemistry foundations for school, biology, medicine, or engineering."
  },
  "mental-health": {
    title: "Mental Health Awareness",
    short: "Well-being and awareness",
    category: "Health",
    level: "Introductory",
    overview: "Mental Health Awareness gives students language and tools for understanding stress, emotional well-being, and support systems. The course is educational, practical, and focused on awareness rather than diagnosis.",
    outcomes: [
      "Recognize common signs of stress and emotional overload.",
      "Understand protective habits that support well-being.",
      "Discuss stigma and respectful mental health language.",
      "Identify when and how to seek trusted support."
    ],
    topics: [
      "Stress and coping strategies",
      "Anxiety, mood, and resilience",
      "Sleep, routines, and academic pressure",
      "Support networks and communication"
    ],
    project: "Students create a realistic student wellness plan with routines, resources, and support steps.",
    bestFor: "Students who want practical tools for school stress, self-awareness, and peer support."
  },
  "computer-science": {
    title: "Computer Science",
    short: "Coding and logic",
    category: "Technology",
    level: "Beginner friendly",
    overview: "Computer Science introduces students to programming, algorithms, logic, and problem solving. Students learn to break problems into steps, test their thinking, and build small programs with clear purpose.",
    outcomes: [
      "Write readable code using variables, loops, and conditionals.",
      "Use functions to organize repeated logic.",
      "Debug errors using step-by-step reasoning.",
      "Explain how algorithms solve practical problems."
    ],
    topics: [
      "Programming fundamentals",
      "Logic, loops, and functions",
      "Data, lists, and simple algorithms",
      "Debugging and project design"
    ],
    project: "Students build a small interactive program, such as a quiz, calculator, or study tool.",
    bestFor: "Students interested in coding, apps, robotics, math, or computational thinking."
  },
  "engineering": {
    title: "Engineering",
    short: "Design and systems",
    category: "Design",
    level: "Introductory",
    overview: "Engineering teaches students how to define problems, design solutions, test ideas, and improve prototypes. The course connects science and math to real-world systems and creative problem solving.",
    outcomes: [
      "Use the engineering design process from problem to prototype.",
      "Compare tradeoffs in cost, strength, safety, and usability.",
      "Create diagrams and communicate design decisions.",
      "Test and revise a solution based on evidence."
    ],
    topics: [
      "Design process and constraints",
      "Structures, forces, and materials",
      "Systems thinking",
      "Prototyping and iteration"
    ],
    project: "Students design, sketch, and present a solution to a real community or school problem.",
    bestFor: "Students who enjoy building, inventing, robotics, architecture, or applied science."
  },
  "quantum-physics": {
    title: "Quantum Physics",
    short: "Advanced physics",
    category: "Physical Science",
    level: "Advanced introduction",
    overview: "Quantum Physics introduces students to the strange rules that describe matter and energy at tiny scales. The course focuses on conceptual clarity before math, helping students understand why quantum ideas changed modern science.",
    outcomes: [
      "Explain wave-particle duality and quantized energy.",
      "Describe uncertainty and probability in quantum systems.",
      "Connect atomic structure to spectra and energy levels.",
      "Discuss real technologies influenced by quantum physics."
    ],
    topics: [
      "Light, photons, and energy packets",
      "Electron behavior and atomic models",
      "Probability and uncertainty",
      "Quantum technologies and applications"
    ],
    project: "Students create a concept presentation that explains one quantum idea with visuals and analogies.",
    bestFor: "Students who already like physics or math and want a challenging conceptual extension."
  },
  "arithmetic": {
    title: "Elementary Arithmetic",
    short: "Basic math skills",
    category: "Mathematics",
    level: "Foundational",
    overview: "Elementary Arithmetic builds confidence with numbers, operations, and problem solving. Students practice accuracy while also learning why the operations work and how to choose the right strategy.",
    outcomes: [
      "Add, subtract, multiply, and divide with confidence.",
      "Use place value to understand larger numbers.",
      "Work with fractions, decimals, and percentages.",
      "Translate word problems into clear steps."
    ],
    topics: [
      "Place value and number sense",
      "Operations and estimation",
      "Fractions and decimals",
      "Percentages and word problems"
    ],
    project: "Students solve a real budgeting or measurement challenge using arithmetic skills.",
    bestFor: "Students who need a stronger base before pre-algebra or want more math confidence."
  },
  "pre-algebra": {
    title: "Pre Algebra",
    short: "Intro to algebra",
    category: "Mathematics",
    level: "Foundational to intermediate",
    overview: "Pre Algebra bridges arithmetic and algebra by introducing variables, expressions, equations, ratios, and graphs. Students learn to see patterns and represent relationships symbolically.",
    outcomes: [
      "Simplify expressions using order of operations.",
      "Solve one-step and two-step equations.",
      "Work with ratios, proportions, and integers.",
      "Graph simple relationships on a coordinate plane."
    ],
    topics: [
      "Variables and expressions",
      "Equations and inequalities",
      "Ratios, rates, and proportions",
      "Coordinate plane and graphing basics"
    ],
    project: "Students model a real pattern, such as pricing or distance over time, with tables, equations, and graphs.",
    bestFor: "Students preparing for Algebra 1 or looking to make math feel more organized."
  },
  "algebra-1": {
    title: "Algebra 1",
    short: "Core algebra",
    category: "Mathematics",
    level: "Intermediate",
    overview: "Algebra 1 develops the core language of modern math: equations, functions, graphs, and systems. Students learn how to represent relationships and solve problems in multiple ways.",
    outcomes: [
      "Solve linear equations and inequalities.",
      "Graph and interpret linear functions.",
      "Solve systems of equations.",
      "Work with exponents, quadratics, and data patterns."
    ],
    topics: [
      "Linear equations and slope",
      "Functions and graphing",
      "Systems of equations",
      "Exponents and introductory quadratics"
    ],
    project: "Students use a linear model to analyze a real-world trend and explain what the slope and intercept mean.",
    bestFor: "Students taking Algebra 1, preparing for exams, or strengthening high school math foundations."
  },
  "algebra-2": {
    title: "Algebra 2",
    short: "Advanced algebra",
    category: "Mathematics",
    level: "Advanced high school",
    overview: "Algebra 2 expands students' function toolkit with polynomials, exponentials, logarithms, rational expressions, and complex numbers. The course emphasizes connections between equations, graphs, and applications.",
    outcomes: [
      "Analyze polynomial, exponential, logarithmic, and rational functions.",
      "Solve equations using factoring, transformations, and inverse operations.",
      "Understand complex numbers and advanced graph behavior.",
      "Choose appropriate models for real data and scenarios."
    ],
    topics: [
      "Polynomials and factoring",
      "Exponential and logarithmic functions",
      "Rational expressions and equations",
      "Complex numbers and function transformations"
    ],
    project: "Students compare two types of functions and decide which better models a real growth or change scenario.",
    bestFor: "Students currently in Algebra 2 or preparing for precalculus, science, or standardized tests."
  },
  "abstract-algebra": {
    title: "Abstract Algebra",
    short: "Advanced theory",
    category: "Mathematics",
    level: "Advanced enrichment",
    overview: "Abstract Algebra introduces students to mathematical structures such as groups, rings, and fields. Instead of focusing only on calculation, students learn how mathematicians define systems and prove general truths about them.",
    outcomes: [
      "Understand sets, operations, identity elements, and inverses.",
      "Recognize examples of groups, rings, and fields.",
      "Write and follow basic mathematical proofs.",
      "Connect abstract structures to symmetry, numbers, and algebra."
    ],
    topics: [
      "Sets, operations, and closure",
      "Groups and symmetry",
      "Rings and fields",
      "Proof strategies and structure"
    ],
    project: "Students analyze the symmetries of an object and describe the group structure behind them.",
    bestFor: "Students who enjoy advanced math, proofs, contests, or theoretical problem solving."
  }
};

window.UN4STEM_COURSES = UN4STEM_COURSES;
