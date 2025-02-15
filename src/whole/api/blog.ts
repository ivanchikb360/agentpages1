import { BlogPost } from '../types/blog';

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How AI is Transforming Real Estate Marketing',
    description:
      'Discover how artificial intelligence is revolutionizing the way real estate agents market properties.',
    content: 'Full content of the blog post goes here...',
    date: '2024-03-15',
    author: 'Sarah Johnson',
    tags: ['AI', 'Marketing', 'Technology'],
    imageUrl: '/blog/ai-marketing.jpg',
    readTime: 5,
  },
  // Add more mock posts as needed
];

export const getBlogPosts = () => {
  return Promise.resolve(blogPosts);
};

export const getBlogPost = (id: string) => {
  const post = blogPosts.find((post) => post.id === id);
  return Promise.resolve(post);
};

export const getRecentBlogPosts = (count: number = 3) => {
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return Promise.resolve(sortedPosts.slice(0, count));
};
