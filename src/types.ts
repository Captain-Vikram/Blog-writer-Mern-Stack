export interface User {
  id?: string;
  username: string;
  email: string;
  password?: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId?: string;
  date: string; // ISO string
}
