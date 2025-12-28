export type Opportunity = {
  id: string;
  title: string;
  description: string;
  skills: string[]; // skill tags
  location: string; // free text (village / district / state)
  duration?: string; // e.g., "part-time", "6 months training"
  pay?: string; // e.g., "₹8,000/month", "project-based"
  contact?: string;
  source?: string;
};

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "tailoring_001",
    title: "Tailoring / Stitching work (local cooperative)",
    description: "Part-time stitching work producing garments for local shop. Training available.",
    skills: ["tailoring", "sewing", "measurement"],
    location: "Tirunelveli, Tamil Nadu",
    duration: "part-time",
    pay: "₹6,000–₹10,000/month",
    contact: "Village Cooperative Office: 044-xxxx-xxxx",
    source: "",
  },
  {
    id: "mobile_repair_001",
    title: "Mobile phone repair apprentice",
    description: "Apprenticeship with a local mobile repair shop. Learn and earn.",
    skills: ["mobile repair", "electronics", "basic soldering"],
    location: "Madurai, Tamil Nadu",
    duration: "6 months training",
    pay: "₹7,000–₹12,000/month",
    contact: "Mr. Ramesh: 98xxxxxxx",
    source: "",
  },
  {
    id: "goat_farming_001",
    title: "Goat rearing and small animal husbandry",
    description: "Community group looking for helpers and trainees for goat rearing.",
    skills: ["animal care", "farming", "livestock"],
    location: "Villupuram, Tamil Nadu",
    duration: "seasonal",
    pay: "event/project based",
    contact: "",
    source: "https://example.gov/schemes",
  },
  {
    id: "street_food_001",
    title: "Street food vendor (tea/snacks)",
    description: "Low-capital micro-business opportunity; microloan schemes available.",
    skills: ["cooking", "customer service", "hygiene"],
    location: "Coimbatore, Tamil Nadu",
    duration: "ongoing",
    pay: "₹8,000+/month",
    contact: "",
    source: "https://mudra.gov.in",
  },
  {
    id: "driving_001",
    title: "Delivery / Driver opportunities",
    description: "Drivers needed for local delivery services; license preferred.",
    skills: ["driving", "navigation"],
    location: "Chennai, Tamil Nadu",
    duration: "full-time",
    pay: "₹10,000–₹15,000/month",
    contact: "",
    source: "",
  },
];
