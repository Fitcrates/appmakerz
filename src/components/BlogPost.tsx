import React from 'react';
import { urlFor } from '../lib/sanity.client';
import type { Post } from '../types/sanity.types';

interface BlogPostProps {
  post: Post;
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden">
      {post.mainImage && (
        <img
          src={urlFor(post.mainImage).width(800).height(400).url()}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
        <div className="flex items-center mb-4">
          {post.author?.image && (
            <img
              src={urlFor(post.author.image).width(40).height(40).url()}
              alt={post.author.name}
              className="w-10 h-10 rounded-full mr-3"
            />
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">{post.author?.name}</p>
            <p className="text-sm text-gray-500">
              {new Date(post.publishedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="prose max-w-none">
          <p className="text-gray-600">{post.excerpt}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.categories?.map((category) => (
            <span
              key={category}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

export default BlogPost;