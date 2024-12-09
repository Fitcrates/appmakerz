import React from 'react';

const Dashboard = ({ posts, onEdit, onDelete, onAddNew }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <button
        onClick={onAddNew}
        className="px-4 py-2 mb-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Add New Post
      </button>
      <div className="grid gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white p-6 rounded-lg shadow-lg flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-bold">{post.title}</h2>
              <p>{post.content.slice(0, 50)}...</p>
            </div>
            <div>
              <button
                onClick={() => onEdit(post.id)}
                className="px-4 py-2 mr-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(post.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
