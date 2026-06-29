import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";

import { db, storage } from "./firebase";
import { Blog } from "@/types/blog";

const blogCollection = collection(db, "blogs");
const FIREBASE_OPERATION_TIMEOUT_MS = 20000;

function createAssetId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

async function withTimeout<T>(operation: Promise<T>, label: string, timeoutMs = FIREBASE_OPERATION_TIMEOUT_MS): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label} timed out. Check Firebase permissions, network, or Storage setup.`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([operation, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export async function createBlog(blog: Omit<Blog, "id" | "createdAt" | "updatedAt">) {
  try {
    return await withTimeout(
      addDoc(blogCollection, {
        ...blog,
        deleted: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }),
      "Creating blog"
    );
  } catch (error) {
    console.error("Failed to create blog:", error);
    throw error;
  }
}

export async function uploadBlogImage(file: File) {
  try {
    const imageRef = storageRef(storage, `blogs/${createAssetId()}-${sanitizeFileName(file.name)}`);
    const snapshot = await withTimeout(uploadBytes(imageRef, file), "Uploading cover image");
    return await withTimeout(getDownloadURL(snapshot.ref), "Getting cover image URL");
  } catch (error) {
    console.error("Failed to upload blog image:", error);
    throw error;
  }
}

export async function getBlogs() {
  try {
    const blogsQuery = query(blogCollection, orderBy("createdAt", "desc"));
    const snapshot = await withTimeout(getDocs(blogsQuery), "Loading blogs");

    return snapshot.docs
      .map((blogDoc) => ({
        id: blogDoc.id,
        ...(blogDoc.data() as Omit<Blog, "id">),
      }))
      .filter((blog) => !blog.deleted);
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    throw error;
  }
}

export async function getAllBlogsIncludingDeleted() {
  try {
    const blogsQuery = query(blogCollection, orderBy("createdAt", "desc"));
    const snapshot = await withTimeout(getDocs(blogsQuery), "Loading all blogs");

    return snapshot.docs.map((blogDoc) => ({
      id: blogDoc.id,
      ...(blogDoc.data() as Omit<Blog, "id">),
    }));
  } catch (error) {
    console.error("Failed to fetch all blogs:", error);
    throw error;
  }
}

export async function getBlog(id: string) {
  try {
    const docRef = doc(db, "blogs", id);
    const snapshot = await withTimeout(getDoc(docRef), "Loading blog");

    if (!snapshot.exists()) return null;

    return {
      id: snapshot.id,
      ...(snapshot.data() as Omit<Blog, "id">),
    };
  } catch (error) {
    console.error(`Failed to fetch blog ${id}:`, error);
    throw error;
  }
}

export async function getPublishedBlogs() {
  try {
    const blogsQuery = query(blogCollection, where("status", "==", "published"), orderBy("createdAt", "desc"));
    const snapshot = await withTimeout(getDocs(blogsQuery), "Loading published blogs");

    return snapshot.docs
      .map((blogDoc) => ({
        id: blogDoc.id,
        ...(blogDoc.data() as Omit<Blog, "id">),
      }))
      .filter((blog) => !blog.deleted);
  } catch (error) {
    console.error("Failed to fetch published blogs:", error);
    throw error;
  }
}

export async function updateBlog(id: string, data: Partial<Blog>) {
  try {
    const docRef = doc(db, "blogs", id);
    await withTimeout(
      updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      }),
      "Updating blog"
    );
  } catch (error) {
    console.error(`Failed to update blog ${id}:`, error);
    throw error;
  }
}

export async function deleteBlog(id: string) {
  try {
    const docRef = doc(db, "blogs", id);
    await withTimeout(
      updateDoc(docRef, {
        deleted: true,
        updatedAt: serverTimestamp(),
      }),
      "Deleting blog"
    );
  } catch (error) {
    console.error(`Failed to delete blog ${id}:`, error);
    throw error;
  }
}

export async function restoreBlog(id: string) {
  try {
    const docRef = doc(db, "blogs", id);
    await withTimeout(
      updateDoc(docRef, {
        deleted: false,
        updatedAt: serverTimestamp(),
      }),
      "Restoring blog"
    );
  } catch (error) {
    console.error(`Failed to restore blog ${id}:`, error);
    throw error;
  }
}

export async function hardDeleteBlog(id: string) {
  try {
    const docRef = doc(db, "blogs", id);
    await withTimeout(deleteDoc(docRef), "Permanently deleting blog");
  } catch (error) {
    console.error(`Failed to permanently delete blog ${id}:`, error);
    throw error;
  }
}