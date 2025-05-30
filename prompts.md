Plan out a quizlet style learning platform called Hackademy for learning cybersecurity and penetration testing concepts. It will be a React based web app written in typescript. It will be hosted with github pages and should pull it's quizzes from json files that are in folders for different categories. The users progress should be stored locally in the browser. Think through any features it may need for a great user experience.

Think through and plan out everything need for a navigation menu on the left side of the screen with a light/dark mode toggle as well as a dashboard (as the main page) with graphs (circle graph: overall course completion) and recommended categories/sections to practice. The navigation menu should have icons on the left edge of the screen and be expandable with a hamburger menu to show the labels. Design these changes with a refined and modern look with a focus on improving the user experience. The goal is to create a beautiful and fun to use cybersecurity and penetration testing learning platform that will be hosted on github pages, pull the quizzes from json files and store progress locally in the browser.

Can you look through this web app and see what can be optimized or reused to make the codebase better and the web app look and work better?

https://uiverse.io/switches?page=2

@/src/components/QuizBrowser.tsx 
@/src/components/QuizBrowser.module.css 
@/src/components/CategoryView.tsx 
@/src/components/CategoryView.module.css 
@/src/components/CircularProgress.tsx 
@/src/components/Progress/CircularProgress.module.css 
@/src/components/Card/Card.tsx 
@/src/components/Card/Card.module.css 
@/src/Styles/global.css 

 Think of a few better layout options for the category view and the browse page