// ─── MOCK DATA ─────────────────────────────────────────────────────────────
// Realistic Indian law school seed data for Lawable MVP demo

export type Role = "student" | "mentor" | "recruiter" | "admin";
export type OpportunityType = "internship" | "research" | "volunteer";
export type ApplicationStatus = "pending" | "shortlisted" | "accepted" | "rejected";
export type SessionStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type SessionType =
  | "career_guidance"
  | "cv_review"
  | "mock_interview"
  | "corporate_law"
  | "litigation";

// ─── USERS ──────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  role: Role;
  name: string;
  email: string;
  mobile: string;
  city: string;
  createdAt: string;
  avatar?: string;
}

export interface Student extends User {
  role: "student";
  college: string;
  year: number;
  graduationYear: number;
  bio: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  skills: string[];
  interests: string[];
  profileCompletion: number;
}

export interface Mentor extends User {
  role: "mentor";
  designation: string;
  organization: string;
  expertise: string[];
  experience: number;
  bio: string;
  isApproved: boolean;
  rating: number;
  totalSessions: number;
  availability: string[];
}

export interface Recruiter extends User {
  role: "recruiter";
  organization: string;
  designation: string;
}

export interface Admin extends User {
  role: "admin";
}

// ─── OPPORTUNITIES ───────────────────────────────────────────────────────────

export interface Opportunity {
  id: string;
  type: OpportunityType;
  title: string;
  organization: string;
  organizationLogo?: string;
  location: string;
  duration: string;
  stipend?: string;
  description: string;
  requirements: string[];
  deliverables?: string;
  responsibilities?: string;
  mentorId?: string;
  isActive: boolean;
  createdAt: string;
  tags: string[];
  applicants: number;
}

// ─── APPLICATIONS ─────────────────────────────────────────────────────────

export interface Application {
  id: string;
  studentId: string;
  opportunityId: string;
  status: ApplicationStatus;
  coverNote: string;
  createdAt: string;
  opportunity?: Opportunity;
}

// ─── SESSIONS ──────────────────────────────────────────────────────────────

export interface Session {
  id: string;
  mentorId: string;
  studentId: string;
  type: SessionType;
  scheduledAt: string;
  status: SessionStatus;
  notes?: string;
  meetLink?: string;
  mentor?: Mentor;
  student?: Student;
}

// ─── RESOURCES ────────────────────────────────────────────────────────────

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  fileType: "pdf" | "doc" | "video" | "slides";
  fileUrl?: string;
  downloads: number;
  createdAt: string;
  tags: string[];
}

// ─── COMMUNITY ────────────────────────────────────────────────────────────

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole: Role;
  channel: string;
  title: string;
  content: string;
  likes: number;
  liked?: boolean;
  createdAt: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SEED DATA
// ═══════════════════════════════════════════════════════════════════════════

export const DEMO_ACCOUNTS: Record<Role, { email: string; password: string; name: string }> = {
  student: { email: "priya@nls.ac.in", password: "demo123", name: "Priya Sharma" },
  mentor: { email: "adv.mehta@lawchambers.in", password: "demo123", name: "Adv. Rohan Mehta" },
  recruiter: { email: "hr@luthra.com", password: "demo123", name: "Neha Kapoor" },
  admin: { email: "admin@lawable.in", password: "demo123", name: "Lawable Admin" },
};

export const MOCK_STUDENTS: Student[] = [
  {
    id: "s1",
    role: "student",
    name: "Priya Sharma",
    email: "priya@nls.ac.in",
    mobile: "+91 98765 43210",
    city: "Bengaluru",
    college: "National Law School of India University",
    year: 3,
    graduationYear: 2027,
    bio: "Third-year law student with a passion for corporate and startup law. I have interned at AZB & Partners and am looking for opportunities in M&A and private equity.",
    resumeUrl: "/mock/resume.pdf",
    linkedinUrl: "https://linkedin.com/in/priyasharma-law",
    skills: ["Legal Research", "Contract Drafting", "Corporate Law", "Due Diligence", "SEBI Regulations"],
    interests: ["Corporate Law", "Startup Law", "M&A", "Private Equity", "IP Law"],
    profileCompletion: 85,
    createdAt: "2025-08-01T10:00:00Z",
  },
  {
    id: "s2",
    role: "student",
    name: "Arjun Nair",
    email: "arjun@nalsar.ac.in",
    mobile: "+91 87654 32109",
    city: "Hyderabad",
    college: "NALSAR University of Law",
    year: 4,
    graduationYear: 2026,
    bio: "Fourth-year student specializing in litigation and constitutional law. Moot court enthusiast — finalist at Jessup 2025.",
    resumeUrl: "/mock/resume.pdf",
    skills: ["Litigation", "Constitutional Law", "Moot Court", "Legal Drafting", "Research"],
    interests: ["Constitutional Law", "Criminal Law", "Human Rights"],
    profileCompletion: 92,
    createdAt: "2025-07-15T10:00:00Z",
  },
  {
    id: "s3",
    role: "student",
    name: "Sneha Iyer",
    email: "sneha@nlu.ac.in",
    mobile: "+91 76543 21098",
    city: "Delhi",
    college: "National Law University, Delhi",
    year: 2,
    graduationYear: 2028,
    bio: "Second-year law student exploring corporate and IP law. Active in legal aid clinics.",
    skills: ["Legal Research", "IP Law", "Contract Review"],
    interests: ["IP Law", "Technology Law", "Startup Law"],
    profileCompletion: 68,
    createdAt: "2025-09-01T10:00:00Z",
  },
];

export const MOCK_MENTORS: Mentor[] = [
  {
    id: "m1",
    role: "mentor",
    name: "Adv. Rohan Mehta",
    email: "adv.mehta@lawchambers.in",
    mobile: "+91 98765 11111",
    city: "Mumbai",
    designation: "Senior Associate",
    organization: "AZB & Partners",
    expertise: ["Corporate Law", "M&A", "Private Equity", "SEBI Regulations"],
    experience: 8,
    bio: "Senior Associate at AZB & Partners with 8 years of experience in corporate and M&A transactions. Advised on deals worth over ₹50,000 Cr. Alumni of NLSIU Bengaluru.",
    isApproved: true,
    rating: 4.9,
    totalSessions: 47,
    availability: ["Monday 6PM", "Wednesday 7PM", "Saturday 11AM"],
    createdAt: "2025-06-01T10:00:00Z",
  },
  {
    id: "m2",
    role: "mentor",
    name: "Adv. Preethi Ramachandran",
    email: "preethi@hcadvocates.in",
    mobile: "+91 87654 22222",
    city: "Chennai",
    designation: "Partner",
    organization: "Ramachandran & Associates",
    expertise: ["Litigation", "Constitutional Law", "Criminal Law", "Family Law"],
    experience: 15,
    bio: "Partner at Ramachandran & Associates with 15 years of litigation experience at the Madras High Court and Supreme Court of India. Passionate about mentoring the next generation of litigators.",
    isApproved: true,
    rating: 4.8,
    totalSessions: 63,
    availability: ["Tuesday 5PM", "Thursday 6PM", "Sunday 10AM"],
    createdAt: "2025-05-15T10:00:00Z",
  },
  {
    id: "m3",
    role: "mentor",
    name: "Karan Jotwani",
    email: "karan@legaltech.in",
    mobile: "+91 76543 33333",
    city: "Delhi",
    designation: "Legal Counsel",
    organization: "Zomato (Legal Team)",
    expertise: ["Startup Law", "Technology Law", "IP Law", "Employment Law"],
    experience: 6,
    bio: "In-house Legal Counsel at Zomato. Previously with Nishith Desai Associates. Specializes in startup ecosystem — regulatory, IP, and employment matters. NLU Delhi alumnus.",
    isApproved: true,
    rating: 4.7,
    totalSessions: 38,
    availability: ["Monday 8PM", "Friday 7PM", "Saturday 2PM"],
    createdAt: "2025-07-01T10:00:00Z",
  },
  {
    id: "m4",
    role: "mentor",
    name: "Adv. Anjali Gupta",
    email: "anjali@arbitration.in",
    mobile: "+91 65432 44444",
    city: "Delhi",
    designation: "Independent Arbitrator & Advocate",
    organization: "Delhi High Court",
    expertise: ["Arbitration", "Dispute Resolution", "International Law", "Commercial Law"],
    experience: 12,
    bio: "Independent arbitrator and advocate at Delhi High Court with 12 years of experience in commercial arbitration. Empanelled arbitrator with DIAC and MCIA.",
    isApproved: true,
    rating: 4.9,
    totalSessions: 55,
    availability: ["Wednesday 6PM", "Saturday 10AM", "Sunday 4PM"],
    createdAt: "2025-04-01T10:00:00Z",
  },
  {
    id: "m5",
    role: "mentor",
    name: "Vikram Oberoi",
    email: "vikram@compliance.in",
    mobile: "+91 54321 55555",
    city: "Pune",
    designation: "Chief Compliance Officer",
    organization: "HDFC Bank Legal",
    expertise: ["Banking Law", "Compliance", "RBI Regulations", "FEMA"],
    experience: 18,
    bio: "CCO at HDFC Bank with 18 years in banking and financial regulation. Expert in RBI compliance frameworks and FEMA. NALSAR alumnus, visiting faculty at IIM Ahmedabad.",
    isApproved: false,
    rating: 0,
    totalSessions: 0,
    availability: ["Thursday 7PM", "Sunday 11AM"],
    createdAt: "2025-10-01T10:00:00Z",
  },
];

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: "o1",
    type: "internship",
    title: "Corporate Law Intern",
    organization: "AZB & Partners",
    location: "Mumbai",
    duration: "2 months",
    stipend: "₹15,000/month",
    description: "Join AZB & Partners' corporate team for a 2-month internship focused on M&A transactions, due diligence, and drafting transaction documents. You will work directly with senior associates and partners on live deals.",
    requirements: ["3rd year or above", "Strong research skills", "Corporate law interest", "Excellent drafting ability"],
    isActive: true,
    createdAt: "2025-10-01T10:00:00Z",
    tags: ["Corporate", "M&A", "Mumbai", "Stipend"],
    applicants: 34,
  },
  {
    id: "o2",
    type: "internship",
    title: "Litigation Intern",
    organization: "Ramachandran & Associates",
    location: "Chennai",
    duration: "6 weeks",
    stipend: "₹8,000/month",
    description: "Gain hands-on experience in litigation at the Madras High Court. Work on civil, criminal, and constitutional matters. Draft pleadings, research case law, and attend court hearings.",
    requirements: ["2nd year or above", "Interest in litigation", "Tamil language preferred but not mandatory"],
    isActive: true,
    createdAt: "2025-10-05T10:00:00Z",
    tags: ["Litigation", "Chennai", "High Court", "Stipend"],
    applicants: 21,
  },
  {
    id: "o3",
    type: "internship",
    title: "Legal Tech & Startup Intern",
    organization: "Zomato",
    location: "Gurugram (Hybrid)",
    duration: "3 months",
    stipend: "₹25,000/month",
    description: "Work with Zomato's in-house legal team on regulatory matters, platform policies, employment law, and startup ecosystem issues. Unique opportunity to experience in-house legal at India's largest food-tech company.",
    requirements: ["3rd year or above", "Interest in technology/startup law", "Strong communication skills"],
    isActive: true,
    createdAt: "2025-09-20T10:00:00Z",
    tags: ["Startup Law", "In-house", "Tech", "Gurugram", "High Stipend"],
    applicants: 89,
  },
  {
    id: "o4",
    type: "research",
    title: "Research Project: AI Regulation in India",
    organization: "Lawable Research Initiative",
    location: "Remote",
    duration: "6 weeks",
    description: "Contribute to a comprehensive research paper on India's evolving AI regulation landscape. Analyze global frameworks (EU AI Act, US Executive Order) and propose a regulatory model for India.",
    requirements: ["Any year", "Strong research and writing skills", "Interest in technology law"],
    deliverables: "Research paper (5,000–8,000 words), executive summary, policy recommendations",
    mentorId: "m3",
    isActive: true,
    createdAt: "2025-10-10T10:00:00Z",
    tags: ["Research", "AI", "Technology Law", "Remote", "Publication"],
    applicants: 15,
  },
  {
    id: "o5",
    type: "research",
    title: "Arbitration Clause Analysis Project",
    organization: "Delhi Arbitration Centre",
    location: "Remote",
    duration: "4 weeks",
    description: "Analyze arbitration clauses in 50+ commercial contracts to identify best practices and common pitfalls. Findings will be published in DAC's quarterly journal.",
    requirements: ["3rd year or above", "Understanding of arbitration law", "Document analysis skills"],
    deliverables: "Clause analysis report, comparative table, recommendations guide",
    mentorId: "m4",
    isActive: true,
    createdAt: "2025-10-08T10:00:00Z",
    tags: ["Research", "Arbitration", "Remote", "Publication"],
    applicants: 8,
  },
  {
    id: "o6",
    type: "volunteer",
    title: "Legal Aid Volunteer",
    organization: "iJustice India",
    location: "Delhi (On-site)",
    duration: "Ongoing (Min. 3 months)",
    description: "Provide pro bono legal assistance to underprivileged communities in Delhi. Handle matters related to family law, tenancy disputes, and consumer complaints under supervision of experienced advocates.",
    requirements: ["Any year", "Commitment to social justice", "Available 2 days/week"],
    responsibilities: "Client intake, case research, drafting applications, attending hearings under supervision",
    isActive: true,
    createdAt: "2025-09-01T10:00:00Z",
    tags: ["Pro Bono", "Social Justice", "Delhi", "Legal Aid"],
    applicants: 12,
  },
  {
    id: "o7",
    type: "internship",
    title: "IP & Media Law Intern",
    organization: "Anand and Anand",
    location: "Noida",
    duration: "2 months",
    stipend: "₹12,000/month",
    description: "Join India's premier IP law firm to work on trademark, copyright, and patent matters. Assist in drafting cease and desist notices, trademark applications, and IP strategy documents.",
    requirements: ["2nd year or above", "Interest in IP law", "Detail-oriented"],
    isActive: true,
    createdAt: "2025-10-12T10:00:00Z",
    tags: ["IP Law", "Noida", "Trademark", "Copyright", "Stipend"],
    applicants: 44,
  },
  {
    id: "o8",
    type: "internship",
    title: "Banking & Finance Law Intern",
    organization: "HDFC Bank Legal",
    location: "Mumbai",
    duration: "6 weeks",
    stipend: "₹18,000/month",
    description: "Work with HDFC Bank's in-house legal team on banking regulatory matters, loan documentation, and RBI compliance. Exposure to large-scale financial transactions and regulatory advisory.",
    requirements: ["4th year or above", "Interest in banking/finance law", "Understanding of RBI regulations"],
    isActive: true,
    createdAt: "2025-10-15T10:00:00Z",
    tags: ["Banking Law", "In-house", "Mumbai", "RBI", "Stipend"],
    applicants: 31,
  },
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: "a1",
    studentId: "s1",
    opportunityId: "o1",
    status: "shortlisted",
    coverNote: "I am deeply interested in corporate law and would love the opportunity to work with AZB & Partners...",
    createdAt: "2025-10-03T10:00:00Z",
  },
  {
    id: "a2",
    studentId: "s1",
    opportunityId: "o4",
    status: "pending",
    coverNote: "Having researched India's AI policy landscape, I am excited to contribute to this research project...",
    createdAt: "2025-10-12T10:00:00Z",
  },
  {
    id: "a3",
    studentId: "s1",
    opportunityId: "o7",
    status: "accepted",
    coverNote: "My keen interest in IP law and experience in trademark research makes me a strong fit...",
    createdAt: "2025-09-25T10:00:00Z",
  },
];

export const MOCK_SESSIONS: Session[] = [
  {
    id: "sess1",
    mentorId: "m1",
    studentId: "s1",
    type: "cv_review",
    scheduledAt: "2025-11-10T18:00:00Z",
    status: "confirmed",
    meetLink: "https://meet.google.com/abc-defg-hij",
    notes: "Please share your resume 24 hours before the session.",
  },
  {
    id: "sess2",
    mentorId: "m3",
    studentId: "s1",
    type: "career_guidance",
    scheduledAt: "2025-11-15T20:00:00Z",
    status: "pending",
  },
  {
    id: "sess3",
    mentorId: "m2",
    studentId: "s1",
    type: "mock_interview",
    scheduledAt: "2025-10-20T17:00:00Z",
    status: "completed",
    notes: "Great session! Focus on structuring your answers better for behavioral questions.",
  },
];

export const MOCK_RESOURCES: Resource[] = [
  {
    id: "r1",
    title: "How to Draft a Shareholders Agreement — A Practical Guide",
    description: "Step-by-step guide for drafting SHA with model clauses for Indian startups. Includes anti-dilution, drag-along, tag-along, and exit provisions.",
    category: "Corporate Law",
    fileType: "pdf",
    downloads: 1247,
    createdAt: "2025-08-01T10:00:00Z",
    tags: ["SHA", "Startup", "Drafting", "Corporate"],
  },
  {
    id: "r2",
    title: "Legal Research Methodology for Law Students",
    description: "Master Manupatra, SCC Online, and WestLaw. Includes case citation formats, judgment analysis frameworks, and research memo templates.",
    category: "Research",
    fileType: "pdf",
    downloads: 2103,
    createdAt: "2025-07-15T10:00:00Z",
    tags: ["Research", "Manupatra", "Case Law", "Memo"],
  },
  {
    id: "r3",
    title: "Interview Prep: Top 50 Questions at Indian Law Firms",
    description: "Compiled from interviews at AZB, Cyril, Shardul, Khaitan, and JSA. Includes model answers and what interviewers actually look for.",
    category: "Career",
    fileType: "pdf",
    downloads: 3891,
    createdAt: "2025-09-01T10:00:00Z",
    tags: ["Interview", "Law Firm", "Placement", "Career"],
  },
  {
    id: "r4",
    title: "Introduction to Arbitration in India — Webinar Recording",
    description: "60-minute webinar by Adv. Anjali Gupta covering the Arbitration & Conciliation Act, institutional arbitration, and career paths in ADR.",
    category: "Arbitration",
    fileType: "video",
    downloads: 876,
    createdAt: "2025-09-20T10:00:00Z",
    tags: ["Arbitration", "ADR", "Webinar", "Career"],
  },
  {
    id: "r5",
    title: "SEBI Regulations: A Student's Handbook",
    description: "Comprehensive overview of SEBI regulations — LODR, ICDR, Insider Trading, and Takeover Code — with case studies and exam notes.",
    category: "Corporate Law",
    fileType: "pdf",
    downloads: 1532,
    createdAt: "2025-08-20T10:00:00Z",
    tags: ["SEBI", "Securities Law", "Corporate", "Notes"],
  },
  {
    id: "r6",
    title: "Moot Court Mastery: From Research to Oral Arguments",
    description: "A complete moot court preparation guide — how to write a memorial, cite correctly, handle rebuttals, and manage bench questions.",
    category: "Litigation",
    fileType: "slides",
    downloads: 2244,
    createdAt: "2025-07-01T10:00:00Z",
    tags: ["Moot Court", "Litigation", "Oral Arguments", "Jessup"],
  },
  {
    id: "r7",
    title: "Startup Law Essentials: Term Sheets & Due Diligence",
    description: "Everything law students need to know about startup transactions — term sheets, cap tables, due diligence checklists, and VC deal structure.",
    category: "Startup Law",
    fileType: "pdf",
    downloads: 1876,
    createdAt: "2025-09-10T10:00:00Z",
    tags: ["Startup", "Term Sheet", "VC", "Due Diligence"],
  },
  {
    id: "r8",
    title: "IP Law: Trademark Registration Process in India",
    description: "End-to-end guide on trademark registration before the Trade Marks Registry — filing, examination, opposition, and maintenance.",
    category: "IP Law",
    fileType: "pdf",
    downloads: 987,
    createdAt: "2025-08-10T10:00:00Z",
    tags: ["Trademark", "IP", "Registration", "TMR"],
  },
];

export const MOCK_POSTS: CommunityPost[] = [
  {
    id: "p1",
    userId: "s2",
    userName: "Arjun Nair",
    userRole: "student",
    channel: "internships",
    title: "AZB & Partners Summer Internship Experience — My Honest Review",
    content: "Just finished my 2-month stint at AZB Mumbai and wanted to share an honest review for everyone applying this season. The work is intense — expect 10-12 hour days during busy periods — but the quality of learning is unmatched. I worked on 3 live M&A transactions and drafted actual transaction documents that went to clients. The partners are approachable and genuinely invest in interns. Stipend: ₹15,000/month. Highly recommend for anyone serious about corporate law.",
    likes: 47,
    createdAt: "2025-10-05T10:00:00Z",
    comments: [
      {
        id: "c1",
        postId: "p1",
        userId: "s3",
        userName: "Sneha Iyer",
        content: "Thanks for this! Did they require a writing sample during the application process?",
        createdAt: "2025-10-05T12:00:00Z",
      },
      {
        id: "c2",
        postId: "p1",
        userId: "s2",
        userName: "Arjun Nair",
        content: "Yes! A 1-page cover letter and a 1,000-word writing sample on a corporate law topic of your choice. They take the writing sample very seriously.",
        createdAt: "2025-10-05T13:00:00Z",
      },
    ],
  },
  {
    id: "p2",
    userId: "m1",
    userName: "Adv. Rohan Mehta",
    userRole: "mentor",
    channel: "corporate_law",
    title: "5 Things I Wish Someone Told Me Before My First M&A Deal",
    content: "After 8 years in corporate law, here are the 5 things nobody tells you before your first live M&A transaction:\n\n1. Due diligence is 80% of the job — learn to work fast and be thorough simultaneously.\n2. Client calls are as important as legal skills — your communication determines your career trajectory.\n3. Tax and regulatory overlap is where junior lawyers add the most value — know your FEMA and Competition Act.\n4. Build relationships with the other side's lawyers — the legal world in India is smaller than you think.\n5. Rest is not optional — burnout is real, manage your energy.",
    likes: 112,
    createdAt: "2025-10-08T10:00:00Z",
    comments: [
      {
        id: "c3",
        postId: "p2",
        userId: "s1",
        userName: "Priya Sharma",
        content: "Point 5 is so important. Thank you for sharing this, sir!",
        createdAt: "2025-10-08T11:00:00Z",
      },
    ],
  },
  {
    id: "p3",
    userId: "s1",
    userName: "Priya Sharma",
    userRole: "student",
    channel: "moot_courts",
    title: "Jessup 2026 — Looking for Team Members (NLS)",
    content: "Hey everyone! I am forming a team for the Philip C. Jessup Moot Court Competition 2026 from NLS Bengaluru. We need 2 more members — ideally someone with strong oral advocacy skills and someone with exceptional research ability. The compromis will be released in November and we plan to start prep immediately. If interested, DM me with your previous moot court experience.",
    likes: 23,
    createdAt: "2025-10-10T10:00:00Z",
    comments: [],
  },
  {
    id: "p4",
    userId: "s3",
    userName: "Sneha Iyer",
    userRole: "student",
    channel: "general",
    title: "Best resources to start learning about SEBI regulations?",
    content: "Hi all! I am a 2nd year student and want to start exploring securities law. I have a basic understanding of corporate law but SEBI regulations feel overwhelming. Where should I start? Any books, courses, or websites you would recommend?",
    likes: 18,
    createdAt: "2025-10-11T10:00:00Z",
    comments: [
      {
        id: "c4",
        postId: "p4",
        userId: "m1",
        userName: "Adv. Rohan Mehta",
        content: "Start with the SEBI Act and then move to LODR and ICDR regulations. Check the Resource Library on Lawable — I uploaded a student handbook on SEBI regulations last month!",
        createdAt: "2025-10-11T14:00:00Z",
      },
    ],
  },
  {
    id: "p5",
    userId: "m4",
    userName: "Adv. Anjali Gupta",
    userRole: "mentor",
    channel: "arbitration",
    title: "The Future of Arbitration in India — My Take on the 2024 Amendments",
    content: "The 2024 Arbitration Act amendments have generated a lot of debate. Here is my practitioner's take: The amendment strengthening institutional arbitration is long overdue. DIAC and MCIA are finally getting the push they need. However, the provision on emergency arbitrators still has gaps — the enforceability question remains murky.\n\nFor students interested in ADR: this is genuinely an exciting time. India is positioning itself as an arbitration hub. Learn the Arbitration Act inside out, understand UNCITRAL Model Law, and get any exposure to institutional rules you can.",
    likes: 89,
    createdAt: "2025-10-09T10:00:00Z",
    comments: [],
  },
];

export const COMMUNITY_CHANNELS = [
  { id: "internships", label: "Internships", icon: "💼", description: "Internship experiences, tips, and reviews" },
  { id: "moot_courts", label: "Moot Courts", icon: "⚖️", description: "Moot competitions, team search, prep tips" },
  { id: "corporate_law", label: "Corporate Law", icon: "🏢", description: "Corporate, M&A, startup law discussions" },
  { id: "litigation", label: "Litigation", icon: "🔨", description: "Court practice, litigation tips, case law" },
  { id: "arbitration", label: "Arbitration", icon: "🤝", description: "ADR, arbitration law, practice updates" },
  { id: "research", label: "Research", icon: "📚", description: "Legal research, writing, publications" },
  { id: "general", label: "General", icon: "💬", description: "General discussion and announcements" },
];

export const RESOURCE_CATEGORIES = [
  "Corporate Law",
  "Litigation",
  "Arbitration",
  "IP Law",
  "Startup Law",
  "Compliance",
  "Research",
  "Career",
];

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  career_guidance: "Career Guidance",
  cv_review: "CV Review",
  mock_interview: "Mock Interview",
  corporate_law: "Corporate Law Mentorship",
  litigation: "Litigation Mentorship",
};

export const OPPORTUNITY_TYPE_LABELS: Record<OpportunityType, string> = {
  internship: "Internship",
  research: "Research Project",
  volunteer: "Volunteer",
};

export const PLATFORM_STATS = {
  students: 1284,
  mentors: 96,
  opportunities: 237,
  applications: 4821,
  sessions: 312,
  organizations: 78,
};
