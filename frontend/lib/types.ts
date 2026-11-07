export type User = {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  bio?: string;
  profilePicture?: string;
  location?: string;
  followersCount?: number;
  followingCount?: number;
};
export type Post = {
  _id: string;
  content?: string;
  images?: { url: string; publicId?: string }[];
  author?: User | string;
  likesCount?: number;
  commentsCount?: number;
  createdAt?: string;
};
