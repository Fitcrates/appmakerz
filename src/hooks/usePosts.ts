import { useState } from 'react';
import type { Post } from '../types/admin.types';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const addPost = (post: Omit<Post, 'id' | 'createdAt'>) => {
    const newPost: Post = {
      ...post,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setPosts([...posts, newPost]);
  };

  const updatePost = (updatedPost: Post) => {
    setPosts(posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  const deletePost = (id: number) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  return {
    posts,
    editingPost,
    setEditingPost,
    addPost,
    updatePost,
    deletePost
  };
};