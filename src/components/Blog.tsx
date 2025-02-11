import React from 'react';
import BlogPost from './BlogPost';

interface BlogProps {
  posts: any[];
}

const Blog: React.FC<BlogProps> = ({ posts }) => {
  return (
    <section id="blog"
    style={{
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      backgroundImage: `url(https://i.postimg.cc/VsR5xjyL/tlohero.png)`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    }}>
      <div className="container px-6 py-10 mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white">
            From the blog
          </h1>

          <p className="max-w-lg mx-auto mt-4 text-gray-500">
            Discover our latest insights, updates, and stories
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-2">
          {posts.map((post, index) => (
            <BlogPost key={post._id || index} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
