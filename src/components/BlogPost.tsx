import React from 'react';
import { urlFor } from '../lib/sanity.client';
import type { Post } from '../types/sanity.types';




interface BlogPostProps {
  post: Post;
  allPosts?: Post[];
}


const BlogPost: React.FC<BlogPostProps> = ({ post, allPosts = [] }) => {
  return (
    <div className="flex flex-col items-center mb-12"> {/* Spacing between posts */}
      {/* Image Section */}
      {post.mainImage && (
        <div className="relative w-full max-w-lg overflow-hidden rounded-lg shadow-lg ring-1 ring-white/40">
          <img
            src={urlFor(post.mainImage).width(800).height(600).url()}
            alt={post.title}
            className="w-full h-64 object-cover" /* Image height and proportions */
          />
        </div>
      )}


      {/* Content Box */}
      <div className="w-1/2 h-46 z-10 -mt-12 p-6 rounded-md shadow-md dark:bg-gray-900 ring-1 ring-white/40"
      style={{ backgroundColor: '#140F2D' }}
      >
        <h2 className="w-auto font-semibold text-white dark:text-white text-lg md:text-xl hover:underline mb-4 font-jakarta font-light">
          {post.title}
        </h2>
        <p className="w-auto text-sm text-white/90 dark:text-gray-300 leading-relaxed mb-2 font-jakarta font-extralight">
          {post.excerpt}
        </p>
       
        <p className="text-teal-300 text-xs">
          {new Date(post.publishedAt).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </p>
        <p className="w-auto text-xs text-white/90 dark:text-gray-300 leading-relaxed font-jakarta font-thin">
          {post.author.name}
        </p>
      </div>
    </div>
  );
};


export default BlogPost;