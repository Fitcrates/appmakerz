import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';
import Login from './Login';
import Dashboard from './Dashboard';
import PostForm from './PostForm';
import type { LoginCredentials, Post } from '../../types/admin.types';

const Admin = () => {
  const { isLoggedIn, error, login, logout } = useAuth();
  const { posts, editingPost, setEditingPost, addPost, updatePost, deletePost } = usePosts();
  const [currentView, setCurrentView] = useState<'dashboard' | 'form'>('dashboard');

  const handleLogin = (credentials: LoginCredentials) => {
    login(credentials);
  };

  const handleSavePost = (postData: Omit<Post, 'id' | 'createdAt'>) => {
    if (editingPost) {
      updatePost({
        ...editingPost,
        ...postData
      });
    } else {
      addPost(postData);
    }
    setCurrentView('dashboard');
    setEditingPost(null);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} error={error} />;
  }

  if (currentView === 'form') {
    return (
      <PostForm
        post={editingPost}
        onSave={handleSavePost}
        onCancel={() => {
          setCurrentView('dashboard');
          setEditingPost(null);
        }}
      />
    );
  }

  return (
    <Dashboard
      posts={posts}
      onEdit={(post) => {
        setEditingPost(post);
        setCurrentView('form');
      }}
      onDelete={deletePost}
      onAddNew={() => {
        setEditingPost(null);
        setCurrentView('form');
      }}
      onLogout={logout}
    />
  );
};

export default Admin;