export type LinkItem = {
  label: string;
  value: string;
  href?: string;
};

export type Hackathon = {
  name: string;
  result: string;
  role: string;
  description: string;
};

export type Project = {
  name: string;
  type: string;
  role: string;
  description: string;
  techStack: string[];
  contribution: string;
  image?: string;
  liveUrl?: string;
  sourceUrl?: string;
};

export type Award = {
  name: string;
  result: string;
  description: string;
};

export type AcademicExperience = {
  name: string;
  result?: string;
  date?: string;
  description: string;
};

export type Certification = {
  name: string;
  issuer: string;
  description: string;
};

export const personalInfo = {
  name: "Kittipong Thongnate",
  displayName: "Kittipong Thongnate",
  title: "High School Student | AI & Software Builder",
  school:
    "Horwang School, Digital Innovation Program; incoming Computer Engineering and Digital Technology (CEDT) student at Chulalongkorn University",
  location: "Thailand",
  email: "achikrab@gmail.com",
  github: "Kittipong-Dev",
  discord: "achikrab",
  instagram: "achi.krab.3",
  profileImage: "/images/profile.jpg",
  tagline:
    "AI, software, and innovation builder interested in creating technology that helps people in real life.",
  hero:
    "Hi, I'm Kittipong Thongnate, a high school student from Horwang School's Digital Innovation Program and an incoming Computer Engineering and Digital Technology student at Chulalongkorn University. I'm interested in AI, software development, cybersecurity, and building technology that solves real-world problems.",
  about:
    "I am a high school student passionate about programming, AI, cybersecurity, and digital innovation. I enjoy building real projects, joining hackathons, and learning how to turn ideas into working solutions. My experience includes backend development, Discord applications, web applications, AI camps, cybersecurity competitions, and innovation pitching."
};

export const technicalSkills = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "Express.js",
  "C++",
  "C",
  "PHP",
  "RESTful API",
  "Docker",
  "Linux",
  "GitHub",
  "Postman",
  "AWS",
  "Cloud Architecture",
  "Cloud Computing",
  "Database Design",
  "Web Scraping",
  "Discord Bot Development"
];

export const softSkills = [
  "Teamwork",
  "Problem Solving",
  "Presentation",
  "Team Leadership",
  "Design Thinking",
  "Communication",
  "Pitching",
  "Working under time pressure"
];

export const hackathons: Hackathon[] = [
  {
    name: "Mental Health Hackathon 2024 by KMUTT",
    result: "Semi-finalist, Top 40 teams",
    role: "Business Model Canvas / Solution Design",
    description:
      "My team built a simple game to help people understand how to support someone with mental health problems. I helped with the Business Model Canvas and contributed to shaping the solution idea."
  },
  {
    name: "AI Innovator Awards by CMKL",
    result: "Elevator Pitch & Networking Round, Top 16 teams",
    role:
      "Data Collection, Problem Analysis, Business Model, Tech Stack, Product Positioning",
    description:
      "My team created an idea for a smart fashion display and mirror for retail stores. The display shows clothing that customers are likely to buy, helping fashion stores improve advertising and customer experience."
  },
  {
    name: "AI Thailand Hackathon 2024",
    result: "Participant",
    role: "Team Member / Builder / Presenter",
    description:
      "A 36-hour hackathon where my team built a solution using the event API under a short time limit and presented it to judges. This experience helped me practice teamwork, building under pressure, and pitching."
  }
];

export const projects: Project[] = [
  {
    name: "Dishcovery",
    type: "AI Food Matchmaker for Thai Tourism",
    role: "Full-stack / Backend Developer",
    description:
      "Dishcovery helps tourists discover Thai local food and restaurants based on preferences, allergies, budget, distance, transport mode, and menu-level matching. The system uses restaurant and menu data, bilingual embeddings, and recommendation scoring to suggest safer and more relevant local food options.",
    techStack: [
      "Node.js",
      "Express.js",
      "Supabase",
      "PostgreSQL",
      "pgvector",
      "PostGIS",
      "RESTful API",
      "OpenAI/OpenRouter",
      "Google Maps",
      "Recommendation System"
    ],
    contribution:
      "Built the backend API foundation, database schema, menu-first recommendation flow, preference and group APIs, match history learning, review APIs, dashboard insight APIs, and deployment-ready demo polish.",
    image: "/images/dishcovery.jpg",
    liveUrl: "https://local-eat-1097931224321.asia-southeast1.run.app/",
    sourceUrl:
      "https://github.com/Kittipong-Dev/AI-Food-Matchmaker-for-Thai-Tourism"
  },
  {
    name: "Planify",
    type: "Discord Activity / Project Management Tool",
    role: "Backend Developer",
    description:
      "Planify is a Discord Activity designed to help teams manage projects directly inside Discord without relying on external tools. It includes task management, task history, Kanban boards, and task reminders through Discord DM.",
    techStack: [
      "Node.js",
      "Express.js",
      "TypeScript",
      "Discord SDK",
      "Discord Bot",
      "API",
      "Database"
    ],
    contribution:
      "Developed backend systems, worked with Discord SDK, built task reminder features, and helped deploy the system on a server.",
    image: "/images/planify.jpg",
    sourceUrl: "https://github.com/Discord-Activity-Planify"
  },
  {
    name: "Raynia Book",
    type: "Book Recommendation / Review Website",
    role: "Backend Developer",
    description:
      "Raynia Book is a website that helps students find books that match their interests. It includes book categories and a rating system to help users understand book characteristics.",
    techStack: [
      "Node.js",
      "Express.js",
      "TypeScript",
      "React",
      "RESTful API",
      "Database"
    ],
    contribution:
      "Built RESTful APIs, designed backend structure, connected the database, and created API documentation.",
    image: "/images/raynia-book.jpg",
    sourceUrl: "https://github.com/Raynia-Book"
  },
  {
    name: "DIP Sharing Board",
    type: "Student Opportunity Display Board",
    role: "Backend Developer / Discord Bot Developer",
    description:
      "DIP Sharing Board collects useful links shared by students in Discord, such as competitions, camps, activities, and opportunities, then displays them on a digital board in the student workspace.",
    techStack: [
      "Node.js",
      "Python",
      "JavaScript",
      "Discord Bot",
      "Web Scraping",
      "API"
    ],
    contribution:
      "Developed a Discord bot to collect links, built web scraping logic, prepared categorized data, and created APIs for the display website.",
    image: "/images/dip-sharing-board.jpg",
    sourceUrl: "https://github.com/DIP-Sharing-Board"
  }
];

export const awards: Award[] = [
  {
    name: "Thailand Cyber Talent 2025",
    result: "Ranked 19th out of 518 teams",
    description:
      "My first cybersecurity CTF competition. The contest included Web Application, Digital Forensics, Reverse Engineering & Pwnable, Network Security, Mobile Security, Programming, and Cryptography."
  },
  {
    name: "Web Application Competition",
    result: "Gold Medal, 2nd Runner-up",
    description:
      "Built a web application under provided requirements, UI, and database constraints. I worked on the backend using PHP and database queries."
  },
  {
    name: "IT Clash 68",
    result: "Coding Track Finalist, ranked 5th out of 16 finalist teams",
    description:
      "Competitive programming competition focused on solving algorithmic problems under time pressure."
  },
  {
    name: "Thailand Robot & Coding Challenge 2024",
    result: "Selected participant, Top 12 teams",
    description: "Selected to join the coding track of the competition."
  }
];

export const certifications: Certification[] = [
  {
    name: "AWS Certified Solutions Architect - Associate",
    issuer: "Amazon Web Services",
    description:
      "Validated knowledge in designing secure, resilient, high-performing, and cost-optimized cloud architectures on AWS."
  }
];

export const academicExperiences: AcademicExperience[] = [
  {
    name: "NextGen AI Camp #2 by KMITL",
    result:
      "Selected from over 1,000 online applicants and ranked among the top 10 out of 30 participants",
    description:
      "Learned AI, Machine Learning, Deep Learning, Neural Networks, and CNNs. Built models for tasks such as food image classification, image quality and engagement prediction, and price prediction from multimodal data."
  },
  {
    name: "Computer Olympiad Camp 2",
    description:
      "Learned C++, data structures, algorithms, graph algorithms, dynamic programming, greedy algorithms, divide and conquer, time complexity analysis, debugging, and competitive programming problem solving."
  },
  {
    name: "Cyber Security Internship at ECOP",
    date: "March 12, 2024 - April 30, 2024",
    description:
      "Interned in a Cyber Security Blue Team role. Learned about threat analysis, prevention, networking, Nmap, Wireshark, Netcat, intrusion detection/prevention systems, and real cybersecurity tools."
  }
];

export const contactLinks: LinkItem[] = [
  {
    label: "Email",
    value: personalInfo.email,
    href: `mailto:${personalInfo.email}`
  },
  {
    label: "GitHub",
    value: personalInfo.github,
    href: "https://github.com/Kittipong-Dev"
  },
  {
    label: "Discord",
    value: personalInfo.discord
  },
  {
    label: "Instagram",
    value: personalInfo.instagram,
    href: "https://instagram.com/achi.krab.3"
  }
];

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Hackathons", href: "#hackathons" },
  { label: "Projects", href: "#projects" },
  { label: "Certifications", href: "#certifications" },
  { label: "Awards", href: "#awards" },
  { label: "AI Experience", href: "#academic" },
  { label: "Contact", href: "#contact" }
];
