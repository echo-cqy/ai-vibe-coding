import { LucideIcon, Rocket, Terminal, Code2, BookOpen, Globe, Megaphone } from 'lucide-react';

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: BlogCategory;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  date: string;
  readTime: string;
  image?: string;
  tags: string[];
}

export type BlogCategory = 
  | "Product Updates"
  | "Community & OpenSource"
  | "Tech Insights"
  | "Use Cases & Tutorials"
  | "Industry Perspectives"
  | "Announcements";

export const BLOG_CATEGORIES: { label: BlogCategory; icon?: any }[] = [
  { label: "Product Updates", icon: Rocket },
  { label: "Community & OpenSource", icon: Globe },
  { label: "Tech Insights", icon: Code2 },
  { label: "Use Cases & Tutorials", icon: BookOpen },
  { label: "Industry Perspectives", icon: Terminal },
  { label: "Announcements", icon: Megaphone },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "introducing-vibe-coding",
    title: "Introducing Vibe Coding: A New Way to Build Software",
    summary: "Today we are launching AI Vibe Coding Platform, a revolutionary tool that transforms natural language into production-ready code with the power of LLMs.",
    content: `
      <h2>The Future of Coding is Here</h2>
      <p>We believe that coding should be as natural as speaking. With Vibe Coding, we are bridging the gap between human intent and machine execution.</p>
      
      <h3>Key Features</h3>
      <ul>
        <li><strong>Natural Language Processing:</strong> Describe your app in plain English.</li>
        <li><strong>Real-time Preview:</strong> See your changes instantly as you type.</li>
        <li><strong>Full-Stack Generation:</strong> From UI to backend logic, we cover it all.</li>
      </ul>

      <h3>Why Vibe Coding?</h3>
      <p>Traditional coding requires deep syntax knowledge and boilerplate management. Vibe Coding handles the heavy lifting, allowing you to focus on logic and design.</p>
      
      <p>Start building your dream application today!</p>
    `,
    category: "Product Updates",
    author: {
      name: "Alex Chen",
      role: "Founder & CEO"
    },
    date: "Dec 28, 2025",
    readTime: "5 min read",
    tags: ["AI", "Coding", "Launch"],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2070"
  },
  {
    id: "open-manus-integration",
    title: "Deep Dive into OpenManus Integration",
    summary: "Learn how we integrated OpenManus agents to provide autonomous coding capabilities within the Vibe platform.",
    content: `
      <h2>Empowering Agents with OpenManus</h2>
      <p>OpenManus brings autonomous agent capabilities to Vibe Coding. This integration allows our platform to not just generate code, but to understand complex multi-step tasks.</p>

      <h3>How it Works</h3>
      <p>The integration leverages the agentic workflow of OpenManus to break down complex user requests into manageable sub-tasks.</p>

      <pre><code>// Example configuration
const agent = new OpenManusAgent({
  capabilities: ['code-gen', 'file-system'],
  model: 'gpt-4-turbo'
});
</code></pre>

      <p>Stay tuned for more updates on our agent ecosystem.</p>
    `,
    category: "Tech Insights",
    author: {
      name: "Sarah Jones",
      role: "Lead Engineer"
    },
    date: "Dec 25, 2025",
    readTime: "8 min read",
    tags: ["Agents", "OpenManus", "Architecture"],
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1965"
  },
  {
    id: "community-showcase-dec",
    title: "December Community Showcase",
    summary: "Highlighting the amazing applications built by our community members this month using Vibe Coding.",
    content: `
      <h2>Community Creations</h2>
      <p>This month has been incredible for the Vibe Coding community. We've seen everything from e-commerce dashboards to complex data visualization tools.</p>

      <h3>Top Picks</h3>
      <ul>
        <li><strong>CryptoTracker:</strong> A real-time cryptocurrency dashboard.</li>
        <li><strong>TaskFlow:</strong> A collaborative project management tool.</li>
        <li><strong>HealthVibe:</strong> A personal wellness tracker.</li>
      </ul>

      <p>Join our Discord to share your own creations!</p>
    `,
    category: "Community & OpenSource",
    author: {
      name: "Community Team",
      role: "Vibe Platform"
    },
    date: "Dec 20, 2025",
    readTime: "3 min read",
    tags: ["Community", "Showcase", "Projects"],
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2071"
  }
];

export function getBlogPost(id: string): BlogPost | undefined {
  return BLOG_POSTS.find(post => post.id === id);
}

export function getRelatedPosts(category: string, currentId: string): BlogPost[] {
  return BLOG_POSTS
    .filter(post => post.category === category && post.id !== currentId)
    .slice(0, 3);
}
