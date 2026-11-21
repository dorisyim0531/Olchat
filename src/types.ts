export type PostType = 'lost' | 'found';

export type Screen = 'home' | 'write' | 'board' | 'admin-settings';

export interface Post {
  id: string;
  type: PostType;
  category: string;
  title: string;
  location: string;
  handoverLocation: string;
  createdAt: string; // ISO local datetime string e.g. '2026-10-23T16:33:00'
}
