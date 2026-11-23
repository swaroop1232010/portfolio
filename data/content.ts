// All site content in one place. Facts come from the resume, LinkedIn, GitHub and Medium.

export const profile = {
  name: "Swaroop Reddy",
  role: "Senior Full Stack Engineer",
  location: "Hyderabad, India",
  email: "swaroop1232010@gmail.com",
  resume: "assets/doc/Swaroop_Resume_Fullstack.pdf",
  photo: "images/u1.jpg",
  links: {
    linkedin: "https://www.linkedin.com/in/swaroop-reddy-dev/",
    github: "https://github.com/swaroop1232010",
    medium: "https://medium.com/@swaroop1232010",
  },
};

export const heroLines = ["I build products", "that scale —", "and now, think."];

export const marquee = [
  "Java",
  "Spring Boot",
  "React",
  "Next.js",
  "TypeScript",
  "Kafka",
  "Redis",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Kubernetes",
  "Spring AI",
  "LangChain",
  "LangGraph",
  "MCP",
  "RAG",
];

export const aboutText =
  "I'm a senior full-stack engineer who has spent 9+ years turning ideas into production software — secure Spring Boot APIs, fast React and Next.js interfaces, real-time systems on Kafka and WebSockets, and the cloud plumbing that keeps them running. Today I also build AI agents and LLM-powered features, and I measure them before I trust them.";

export const stats = [
  { value: 9, suffix: "+", label: "years shipping software" },
  { value: 4, suffix: "", label: "years focused on e-commerce platforms" },
  { value: 100, suffix: "%", label: "top-1 accuracy in my latest RAG experiment" },
  { value: 667, suffix: "", label: "followers on LinkedIn" },
];

export const experience = [
  {
    period: "Oct 2023 — Now",
    role: "Senior Full Stack Engineer",
    company: "Ensar Solutions",
    points: [
      "Lead full-stack development of e-commerce platforms — UI, APIs, data and deployment",
      "Build AI agents and LLM workflows with LangChain, LangGraph, n8n, OpenAI & Claude APIs and MCP",
      "Event-driven features with Kafka and WebSockets; API performance with Redis",
    ],
    stack: ["Java", "Spring Boot", "Next.js", "Kafka", "AI Agents"],
  },
  {
    period: "Mar 2022 — Sep 2023",
    role: "Full Stack Engineer · ENCART",
    company: "Ensar Solutions",
    points: [
      "Built a scalable e-commerce platform with Spring Boot, Next.js and TypeScript",
      "Real-time order tracking and live chat with Kafka and WebSockets",
      "Stripe, PayPal and Razorpay payments; Docker + Kubernetes; ELK monitoring",
    ],
    stack: ["Spring Boot", "Next.js", "Kafka", "MongoDB", "K8s"],
  },
  {
    period: "Jan 2022 — Mar 2022",
    role: "Full Stack Engineer · ENAUDIT",
    company: "Ensar Solutions",
    points: [
      "Auditing platform with React, Next.js (SSR), Spring Boot and MySQL",
      "Secure REST APIs with Spring Security, JPA and JWT role-based access",
    ],
    stack: ["React", "Spring Security", "MySQL"],
  },
  {
    period: "Dec 2018 — Jan 2022",
    role: "Senior Software Engineer",
    company: "Delite Software Technologies",
    points: [
      "Full-stack features across front and back end, from design to deployment",
      "APIs connecting client software with external services; data import/export tooling",
    ],
    stack: ["PHP · Yii2", ".NET C#", "JavaScript"],
  },
  {
    period: "Jun 2017 — Jul 2018",
    role: "Associate Software Engineer",
    company: "Ensar Solutions",
    points: [
      "Reusable, testable back-end modules and data-storage integrations",
      "Performance fixes and responsive front-end integration",
    ],
    stack: ["PHP", "jQuery", "MySQL"],
  },
];

export type Project = {
  title: string;
  tag: string;
  blurb: string;
  image: string;
  href?: string;
  stack: string[];
};

export const projects: Project[] = [
  {
    title: "Spring AI Reranker Lab",
    tag: "AI · RAG",
    blurb: "Measured Spring AI 2.1's new reranker on a local RAG app: 70% → 25% → 100%.",
    image: "images/v2/rag-reranker.webp",
    href: "https://github.com/swaroop1232010/spring-ai-reranker-demo",
    stack: ["Spring AI", "pgvector", "Ollama"],
  },
  {
    title: "ENCART Commerce",
    tag: "E-commerce",
    blurb: "Multi-gateway e-commerce platform with live order tracking and chat.",
    image: "images/v2/encart.webp",
    stack: ["Spring Boot", "Next.js", "Kafka"],
  },
  {
    title: "Real-time Delivery Tracking",
    tag: "Event-driven",
    blurb: "Kafka + WebSockets pushing live delivery updates to a React map.",
    image: "images/v2/delivery-tracking.webp",
    href: "https://medium.com/@swaroop1232010/building-a-real-time-delivery-tracking-system-using-kafka-with-spring-boot-and-react-js-6aa2779081f6",
    stack: ["Kafka", "WebSocket", "React"],
  },
  {
    title: "ENAUDIT",
    tag: "Enterprise",
    blurb: "Auditing platform with server-rendered UI and secured microservices.",
    image: "images/v2/enaudit.webp",
    stack: ["React", "Spring Security", "MySQL"],
  },
  {
    title: "Business Card Extractor",
    tag: "AI · Vision",
    blurb: "Turns photos of business cards into clean, structured contacts.",
    image: "images/v2/card-extractor.webp",
    href: "https://github.com/swaroop1232010/business-card-extractor",
    stack: ["Python", "LLM"],
  },
  {
    title: "Chat with CSV",
    tag: "AI · LLM",
    blurb: "Ask questions about any spreadsheet in plain English.",
    image: "images/v2/chat-csv.webp",
    href: "https://github.com/swaroop1232010/Chat_with_CSV_Huggingface",
    stack: ["Python", "Hugging Face"],
  },
  {
    title: "Redis Caching Playbook",
    tag: "Performance",
    blurb: "Spring Boot caching patterns that cut repeated database reads.",
    image: "images/v2/redis-cache.webp",
    href: "https://github.com/swaroop1232010/spring_data_redis_cache",
    stack: ["Spring Boot", "Redis"],
  },
  {
    title: "IoT Cloud Platform",
    tag: "Cloud · IoT",
    blurb: "Sensor data on AWS IoT with Lambda automation and CloudWatch alarms.",
    image: "images/v2/iot-cloud.webp",
    stack: ["AWS IoT", "Lambda", "EC2"],
  },
  {
    title: "Staff Management",
    tag: "SaaS",
    blurb: "Scheduling and team management web app.",
    image: "images/v2/staff-mgmt.webp",
    href: "https://github.com/swaroop1232010/staff_management",
    stack: ["TypeScript", "Next.js"],
  },
];

export const services = [
  {
    no: "01",
    title: "Full-stack products",
    text: "From the first screen to production: React and Next.js interfaces on top of secure, well-tested Spring Boot APIs.",
    tags: ["React", "Next.js", "Spring Boot", "REST"],
  },
  {
    no: "02",
    title: "Real-time & scale",
    text: "Event-driven systems with Kafka and WebSockets, Redis caching, and databases designed for growth.",
    tags: ["Kafka", "WebSocket", "Redis", "PostgreSQL"],
  },
  {
    no: "03",
    title: "AI engineering",
    text: "AI agents, RAG and LLM features wired into real business data — with evaluations, not vibes.",
    tags: ["Spring AI", "LangGraph", "MCP", "RAG"],
  },
  {
    no: "04",
    title: "Cloud & delivery",
    text: "Docker, Kubernetes and AWS deployments with logging and monitoring that catch problems early.",
    tags: ["AWS", "Docker", "K8s", "ELK"],
  },
];

export const articles = [
  {
    title: "I Tested Spring AI 2.1's New Reranker Locally. The Small Model Made My RAG Worse.",
    date: "Nov 2026",
    href: "https://medium.com/@swaroop1232010/i-tested-spring-ai-2-1s-new-reranker-locally-the-small-model-made-my-rag-worse-ff970ce0de65",
    image: "images/v2/rag-reranker.webp",
  },
  {
    title: "Building a Real-Time Delivery Tracking System Using Kafka with Spring Boot and React",
    date: "Sep 2024",
    href: "https://medium.com/@swaroop1232010/building-a-real-time-delivery-tracking-system-using-kafka-with-spring-boot-and-react-js-6aa2779081f6",
    image: "images/v2/delivery-tracking.webp",
  },
  {
    title: "Implementing Redis Caching in Spring Boot with Gradle",
    date: "Sep 2024",
    href: "https://medium.com/@swaroop1232010/implementing-redis-caching-in-spring-boot-with-gradle-a-step-by-step-guide-876884df0bb6",
    image: "images/v2/redis-cache.webp",
  },
  {
    title: "Setting Up SonarQube for a Java Spring Boot Project",
    date: "Aug 2024",
    href: "https://medium.com/@swaroop1232010/step-by-step-guide-to-setting-up-sonarqube-for-your-java-spring-boot-project-on-windows-8f062498751a",
    image: "images/v2/enaudit.webp",
  },
  {
    title: "3 New APIs Every Developer Should Know in React 18",
    date: "Apr 2023",
    href: "https://medium.com/@swaroop1232010/every-developer-should-know-3-new-apis-in-react-18-a8fd2f622643",
    image: "images/v2/chat-csv.webp",
  },
];
