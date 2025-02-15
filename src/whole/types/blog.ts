export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
  imageUrl: string;
  readTime: number; // in minutes
} 