export const day1Content = {
  title: "Preview: Day 1 Crash Course",
  description: "Experience our focused, bite-sized learning approach.",
  scope: [
    "Explain what \"frontend\", \"backend\", and \"full‑stack\" mean in your own words.",
    "Set up your tools: VS Code, browser, basic folder structure.",
    "Build one static HTML page with headings, paragraphs, lists, links, and maybe an image.",
    "Optionally add very light CSS (colors, fonts) and understand where CSS fits."
  ],
  routine: [
    "30–60 minutes: Concept reading (5–10 pages per topic).",
    "1–2 hours: Coding practice on those concepts (mini projects, exercises).",
    "Repeat daily for 30+ days."
  ],
  bonusTitle: "Bonus: What is a Prompt?",
  bonusText: "In AI and coding, a prompt is simply the instruction or question you give to a system so it knows what to do. It tells the AI the task, context, and constraints. This skill is called Prompt Engineering: designing prompts that reliably give you the outputs you want.",
  compiler: {
    initialCode: '<h1>Hello World</h1>\n<p>Welcome to Day 1 of Full-Stack Web Dev!</p>\n<ul>\n  <li>Learn HTML</li>\n  <li>Build UI</li>\n</ul>\n<a href="#">Click here</a>',
    testCases: [
      { label: "Contains an <h1> tag", regex: /<h1[^>]*>[\s\S]*?<\/h1>/i },
      { label: "Contains a <p> tag", regex: /<p[^>]*>[\s\S]*?<\/p>/i },
      { label: "Contains an <ul> tag", regex: /<ul[^>]*>/i },
      { label: "Contains an <li> tag", regex: /<li[^>]*>[\s\S]*?<\/li>/i },
      { label: "Contains an <a> (link) tag", regex: /<a[^>]*href=["'][^"']*["'][^>]*>[\s\S]*?<\/a>/i },
    ]
  },
  mcqs: [
    {
      question: "What does HTML stand for?",
      options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink and Text Markup Language", "Home Tool Markup Language"],
      answer: 0
    },
    {
      question: "Which of the following is considered 'Frontend'?",
      options: ["Database", "Server", "Web Browser UI", "API"],
      answer: 2
    },
    {
      question: "What is the main purpose of a 'Prompt' in AI?",
      options: ["To compile code", "To instruct the system on what to do", "To design databases", "To style a webpage"],
      answer: 1
    },
    {
      question: "Which tag is used for the largest heading in HTML?",
      options: ["<heading>", "<h6>", "<head>", "<h1>"],
      answer: 3
    },
    {
      question: "What does 'Full-Stack' development refer to?",
      options: ["Only writing HTML and CSS", "Working on both Frontend and Backend", "Managing servers only", "Designing UI mockups"],
      answer: 1
    }
  ]
};
