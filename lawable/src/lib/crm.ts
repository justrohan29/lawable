import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { Lead, LeadStatus } from "@/types/lead";

const leadsCollection = collection(db, "leads");

type CreateLeadInput = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source?: string;
};

function normalizeStatus(status: unknown): LeadStatus {
  if (status === "contacted" || status === "interested" || status === "converted" || status === "closed") {
    return status;
  }

  return "new";
}

export async function createLead(input: CreateLeadInput) {
  return addDoc(leadsCollection, {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || "",
    message: input.message.trim(),
    source: input.source || "Contact Form",
    status: "new",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getLeads(): Promise<Lead[]> {
  const leadsQuery = query(leadsCollection, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(leadsQuery);

  return snapshot.docs.map((leadDoc) => {
    const data = leadDoc.data();

    return {
      id: leadDoc.id,
      name: String(data.name ?? "Unknown"),
      email: String(data.email ?? ""),
      phone: typeof data.phone === "string" ? data.phone : undefined,
      message: String(data.message ?? ""),
      source: String(data.source ?? data.type ?? "Contact Form"),
      status: normalizeStatus(data.status),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  });
}

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  await updateDoc(doc(db, "leads", leadId), {
    status,
    updatedAt: serverTimestamp(),
  });
}