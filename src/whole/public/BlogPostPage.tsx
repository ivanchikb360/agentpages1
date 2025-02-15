import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPost } from '../api/blog';
import { BlogPost as BlogPostType } from '../types/blog';

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const fetchedPost = await getBlogPost(id!);
      setPost(fetchedPost);
    };
    fetchPost();
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <Link to="/blog" className="text-blue-600 hover:underline mb-4 inline-block">
        Back to Blog
      </Link>
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-4">{post.date} by {post.author}</p>
      <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover mb-4" />
      <p className="text-lg mb-4">{post.content}</p>
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
} 