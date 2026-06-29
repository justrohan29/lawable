export type LeadStatus = "new" | "contacted" | "interested" | "converted" | "closed";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: string;
  status: LeadStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "interested", label: "Interested" },
  { value: "converted", label: "Converted" },
  { value: "closed", label: "Closed" },
];