export interface WorkspaceCase {
  id: string;
  title: string;
  initialPrompt: string;
  description: string;
}

export const WORKSPACE_CASES: Record<string, WorkspaceCase> = {
  "ecommerce": {
    id: "ecommerce",
    title: "E-commerce Dashboard",
    description: "A complete e-commerce admin dashboard with charts and product management.",
    initialPrompt: "Build a modern e-commerce dashboard with a sidebar navigation, a sales overview chart using recharts, and a product list table. Use Tailwind CSS for styling and ensure it's responsive."
  },
  "landing-page": {
    id: "landing-page",
    title: "SaaS Landing Page",
    description: "High-converting SaaS landing page with hero section and pricing.",
    initialPrompt: "Create a high-converting SaaS landing page. Include a hero section with a gradient background, a features grid, social proof logos, and a pricing table with 3 tiers. Use framer-motion for simple animations."
  },
  "portfolio": {
    id: "portfolio",
    title: "Developer Portfolio",
    description: "Minimalist developer portfolio with project showcase.",
    initialPrompt: "Design a minimalist developer portfolio. It should have an 'About' section, a 'Skills' list, and a 'Projects' grid. The design should be clean, monochromatic, and use large typography."
  }
};
