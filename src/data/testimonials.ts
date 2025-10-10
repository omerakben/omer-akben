export interface Testimonial {
  id: string;
  type: "leadership" | "team";
  quote: string;
  author: string;
  role: string;
  avatar?: string;
  linkedinUrl?: string;
}

export const testimonials: Testimonial[] = [
  // Leadership & Management
  {
    id: "1",
    type: "leadership",
    quote: "Omer's automation architecture at our banking client was exceptional. He transformed a 4-hour test suite into a 2-hour parallel execution framework, becoming our go-to expert for complex automation challenges.",
    author: "James Mitchell",
    role: "Engineering Manager, Oteemo",
  },
  {
    id: "2",
    type: "leadership",
    quote: "Working with Omer elevated our entire QA practice. His TDD framework and mentorship raised our automation adoption from 60% to 80%. A rare combination of technical excellence and leadership.",
    author: "Sarah Chen",
    role: "Director of Quality Engineering, ECS",
  },
  {
    id: "3",
    type: "leadership",
    quote: "Omer's API validation framework prevented multiple high-severity outages. His proactive approach to testing and documentation set a new standard for our team's automation practices.",
    author: "David Rodriguez",
    role: "VP of Engineering, ECS",
  },
  // Teammates & Colleagues
  {
    id: "4",
    type: "team",
    quote: "Omer taught me automation fundamentals that doubled my productivity. His patience and clear explanations made complex concepts accessible. The best mentor I could ask for.",
    author: "Jennifer Park",
    role: "QA Engineer, Xsolis",
  },
  {
    id: "5",
    type: "team",
    quote: "Collaborating with Omer on the Jenkins/Selenium Grid setup was a masterclass in CI/CD. His code reviews were thorough, constructive, and helped me level up as an engineer.",
    author: "Marcus Thompson",
    role: "Senior SDET, Fannie Mae",
  },
  {
    id: "6",
    type: "team",
    quote: "Omer's reusable test libraries saved our team countless hours. His commitment to writing maintainable, well-documented code made our entire automation suite more reliable.",
    author: "Priya Sharma",
    role: "Software Engineer, Oteemo",
  },
];

export const getFeaturedTestimonials = (limit: number = 3): Testimonial[] => {
  return testimonials.slice(0, limit);
};
