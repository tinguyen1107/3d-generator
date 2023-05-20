export type CommunityDto = {
  id: string;
  name: string;
  description: string;
  admin: string;
  thumbnail: string;
  avatar: string;
  created_time: number;
  members: string[];
  posts_count: number;
};
