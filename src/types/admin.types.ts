export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AdminState {
  isLoggedIn: boolean;
  posts: Post[];
  currentView: 'dashboard' | 'form';
  editingPost: Post | null;
}