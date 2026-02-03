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
    id: "brice-dardel",
    type: "leadership",
    quote:
      "Ozzy is a great Software Engineer with a natural ease in collaboration - always receptive to ideas and quick to turn them into meaningful progress. Even when faced with blockers, he navigates challenges with resilience, professionalism and care. His ability to drive test automation in .NET and thoughtfully leverage AI in development makes him a standout partner for any engineering team.",
    author: "Brice Dardel",
    role: "Principal Consultant, Oteemo",
    avatar: "/linkedin_img/Brice_D.jpeg",
  },
  {
    id: "saleh-sadat",
    type: "leadership",
    quote:
      "Omer made a significant and lasting contribution to our automation team at ECS. He undertook a large-scale refactor of our existing codebase, transforming it into a more efficient, maintainable, and scalable framework that the entire team benefited from. His attention to detail, thoughtful design decisions, and commitment to clean automation practices set a higher standard for how we approached our work. In addition, the generic helper utilities he developed quickly became foundational components adopted across the SDET team. His initiative in exploring the most advanced capabilities within Postman also enabled us to modernize and streamline our API testing workflows.",
    author: "Saleh Sadat",
    role: "Automation Team, ECS",
    avatar: "/linkedin_img/Saleh_s.jpeg",
  },
  // Teammates & Colleagues
  {
    id: "justin-glotzbach",
    type: "team",
    quote:
      "I was lucky enough to be paired with Omer for our GitSub project at Nashville Software School, where, as a team, we had to build a full GitHub clone. Omer quickly stood out as an expert in his craft, proving to be an invaluable member of our team. I was amazed at his work ethic and his ability to write large amounts of code in short time frames. My other teammates and I would often use Omer as a sounding board as we evaluated technical decisions, and his expertise ended up being a huge advantage for the team. He has an innate ability to explain complex topics in an approachable way, and is a fantastic team player. Anyone would be lucky to have him on their teams in the future, and I hope to be able to work with him again.",
    author: "Justin Glotzbach",
    role: "Software Engineer, React · Django · Tailwind · Python · JavaScript",
    avatar: "/linkedin_img/Justin_G.jpeg",
  },
  {
    id: "landon-borrego",
    type: "team",
    quote:
      "Omer's contributions to our team projects were consistently outstanding. His ability to quickly assimilate and apply new software development concepts, combined with his proactive approach to learning, sets him apart. He not only inspired me to explore the full potential of application development but also instilled practical, industry-relevant teaching methods. Omer's collaborative spirit and dedication to team success made him a highly valued member of our projects. I highly recommend Omer for any software engineering role. His continuous commitment to adopting a developer-centric approach, as he has stated as one of his goals, reflects his ongoing dedication to professional growth and excellence.",
    author: "Landon Borrego",
    role: "Full-Stack Software Developer, React · Python · Django",
    avatar: "/linkedin_img/Landon_B.jpeg",
  },
  {
    id: "alyssa-cleland",
    type: "team",
    quote:
      "I had the pleasure of working with Ozzy on a restaurant order management web app at Nashville Software School, and he quickly proved himself to be a natural leader. He helped our team collaborate effectively, bringing everyone's ideas together to strengthen our final product. His deep understanding of various technical concepts made him an invaluable resource, and he was always eager to explain things in a way that made them easy to grasp. During our project, Ozzy helped me navigate git commands and taught me how to handle merge conflicts efficiently, which has been a skill I've relied on ever since. I also asked him for help on a different project when I needed to implement a user access functionality I had seen him use before. He took the time to break down his approach in detail, making sure I fully understood the process, which helped me tremendously. Beyond his technical expertise, Ozzy has a natural talent for styling and UI design. The landing page he created for our restaurant app tied everything together beautifully, going beyond what was expected to create an intuitive and visually appealing experience. Any team would be lucky to have someone like Ozzy, who not only excels at development but also elevates those around him.",
    author: "Alyssa Cleland",
    role: "Full Stack Developer, JavaScript · React · Next.js · Python · Django",
    avatar: "/linkedin_img/Alyssa_C.jpeg",
  },
  {
    id: "mike-mcgee",
    type: "team",
    quote:
      "I had the privilege of working with Omer to create an Itinerary Planning app as part of a group at Nashville Software School. His knowledge of SCRUM methodology, React, Tailwind, and Google Firebase user authentication was extremely beneficial to the team and he is an excellent communicator and excellent teammate. He also freely shared his experience with us to help us grow in our own personal projects. His approach to front-end development is very dedicated and clear. He is very good at writing concise and readable code and using all available technologies and assets to assist in development as well as showing us how to use other libraries and frameworks that we were often unfamiliar with. Omer would be a fantastic asset to any development team and is a highly skilled, motivated, and logical individual.",
    author: "Mike McGee",
    role: "Full-Stack Software Developer, JavaScript · React · Python · Django",
    avatar: "/linkedin_img/Mike_M.jpeg",
  },
];

export const getFeaturedTestimonials = (limit: number = 3): Testimonial[] => {
  return testimonials.slice(0, limit);
};
