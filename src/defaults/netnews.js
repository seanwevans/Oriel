export const NETNEWS_GROUPS = [
  {
    id: "tech-daily",
    title: "Tech Briefing",
    description: "Front-page tech and product stories updated throughout the day.",
    feeds: [
      { id: "hn", title: "Hacker News", url: "https://hnrss.org/frontpage" },
      { id: "verge", title: "The Verge", url: "https://www.theverge.com/rss/index.xml" },
      { id: "wired", title: "WIRED", url: "https://www.wired.com/feed/rss" }
    ]
  },
  {
    id: "dev-focus",
    title: "Developer Pulse",
    description: "Programming culture, open source, and platform updates.",
    feeds: [
      { id: "lobsters", title: "Lobsters", url: "https://lobste.rs/rss" },
      { id: "github", title: "GitHub Blog", url: "https://github.blog/feed" },
      { id: "npm", title: "npm Blog", url: "https://blog.npmjs.org/rss" }
    ]
  },
  {
    id: "world-science",
    title: "World & Science",
    description: "Global headlines and discoveries from around the world.",
    feeds: [
      { id: "bbc", title: "BBC World", url: "http://feeds.bbci.co.uk/news/world/rss.xml" },
      { id: "natgeo", title: "National Geographic", url: "http://feeds.nationalgeographic.com/ng/News" },
      { id: "nature", title: "Nature - Science", url: "https://www.nature.com/subjects/science.rss" }
    ]
  },
  {
    id: "design-culture",
    title: "Design & Culture",
    description: "Stories on design, creativity, and thoughtful essays.",
    feeds: [
      { id: "aeon", title: "Aeon Essays", url: "https://aeon.co/feed.rss" },
      { id: "marginalian", title: "The Marginalian", url: "https://www.themarginalian.org/feed" },
      { id: "99pi", title: "99% Invisible", url: "https://feeds.simplecast.com/6G0tcniR" }
    ]
  }
];
