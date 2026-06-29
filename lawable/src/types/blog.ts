export interface Blog {
  id: string;

  title: string;
  slug: string;

  excerpt: string;
  content: string;

  category: string;

  coverImage: string;

  featured: boolean;

  status: "draft" | "published";

  author: string;

  deleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}