import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Contact from './components/Contact';
import BlogPost from './components/BlogPost';
import { getPosts } from './lib/sanity.client';
import type { Post } from './types/sanity.types';

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch posts');
        setLoading(false);
        console.error('Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="relative">
      <Header />
      <section className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900">Blog</h1>
            <p className="mt-4 text-xl text-gray-600">
              Latest insights and updates
            </p>
          </div>

          {loading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading posts...</p>
            </div>
          )}

          {error && (
            <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">
              {error}
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="text-center text-gray-600">
              No posts available yet.
            </div>
          )}

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogPost key={post._id} post={post} />
            ))}
          </div>
        </div>
      </section>
      <Contact />
      <footer className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} Portfolio of Fitcrates.</p>
        </div>
      </footer>
    </div>
  );
};

export default Blog;