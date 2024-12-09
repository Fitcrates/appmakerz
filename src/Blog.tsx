import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Contact from './components/Contact';

const Blog = () => {
  const [posts, setPosts] = useState([]); // State to store blog posts
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch posts from your backend API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/posts'); // Adjust API URL as needed
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="relative">
      {/* Include the shared Header component */}
      <Header />

      {/* Blog Section */}
      <section className="min-h-screen flex flex-col items-center bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Blog
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8">
              Stay updated with the latest news from the world.
            </p>
          </div>

          {/* Posts Section */}
          <div className="mt-10">
            {loading && <p className="text-center text-gray-600">Loading posts...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!loading && !error && posts.length === 0 && (
              <p className="text-center text-gray-600">No posts available.</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <h2 className="text-2xl font-bold text-gray-800">{post.title}</h2>
                  <p className="text-gray-600 mt-4 line-clamp-3">{post.content}</p>
                  <a
                    href={`/blog/${post.id}`}
                    className="text-indigo-600 mt-4 inline-block hover:underline"
                  >
                    Read More
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} Portfolio of Fitcrates.</p>
        </div>
      </footer>
    </div>
  );
};

export default Blog;
