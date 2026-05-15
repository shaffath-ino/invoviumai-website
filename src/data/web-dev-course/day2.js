export const day2Content = {
  title: "Day 2: CSS Fundamentals",
  description: "Learn how to style your HTML pages with CSS.",
  scope: [
    "Understand the CSS Box Model.",
    "Learn about classes and IDs.",
    "Style colors, fonts, and basic layouts.",
    "Link an external CSS file to your HTML."
  ],
  routine: [
    "30 minutes: Concept reading on CSS.",
    "1 hour: Build a styled personal profile page."
  ],
  compiler: {
    initialCode: '<style>\n  h1 { color: blue; }\n</style>\n<h1>Styled Heading</h1>\n<p>This is a paragraph.</p>',
    testCases: [
      { label: "Contains a <style> tag", regex: /<style[^>]*>[\s\S]*?<\/style>/i },
      { label: "Modifies color", regex: /color\s*:\s*[a-zA-Z]+;/i }
    ]
  },
  mcqs: [
    {
      question: "What does CSS stand for?",
      options: ["Cascading Style Sheets", "Colorful Style Sheets", "Computer Style Sheets", "Creative Style System"],
      answer: 0
    }
  ]
};
