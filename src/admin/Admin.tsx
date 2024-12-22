import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import PostForm from './PostForm';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, form

  const handleSavePost = (post) => {
    if (post.id) {
      setPosts(posts.map((p) => (p.id === post.id ? post : p)));
    } else {
      setPosts([...posts, { ...post, id: Date.now() }]);
    }
    setCurrentView('dashboard');
  };

  const handleDeletePost = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  if (!isLoggedIn) {
    return <Login onLogin={setIsLoggedIn} />;
  }

  if (currentView === 'form') {
    return (
      <PostForm
        post={editingPost}
        onSave={handleSavePost}
        onCancel={() => setCurrentView('dashboard')}
      />
    );
  }

  return (
    <Dashboard
      posts={posts}
      onEdit={(id) => {
        setEditingPost(posts.find((post) => post.id === id));
        setCurrentView('form');
      }}
      onDelete={handleDeletePost}
      onAddNew={() => {
        setEditingPost(null);
        setCurrentView('form');
      }}
    />
  );
};

export default Admin;
