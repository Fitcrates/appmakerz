import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Contact from './components/Contact';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/posts'); // Fetch posts from backend
        const data = await response.json();
        setPosts(data); // Store posts in state
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="relative">
      <Header />
      <section className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-12 text-center">Blog</h1>
          {loading ? (
            <p className="text-center text-gray-700">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-700">No posts available.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div key={post.id} className="bg-white shadow-md rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
                  <p className="text-gray-700 mb-4">{post.content}</p>
                  <p className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Contact />
      <footer className="bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} Portfolio of Fitcrates.</p>
        </div>
      </footer>
    </div>
  );
};

export default Blog;
