export type LockedBalance = {
  amount: string;
  release_at: number;
};

export type AboutMeDto = {
  first_name?: string;
  last_name?: string;
  email?: string;
  location?: string;
  about?: string;
  occupation?: string;
  profile_image?: string;
  profile_video?: string;
  twitter?: string;
  github?: string;
  telegram?: string;
  linkedin?: string;
  behance?: string;
  website?: string;
};

export type AccountDto = {
  id: string;
  numFollowers: number;
  numFollowing: number;
  numPosts: number;
  lastPostHeight: number;
  invitedBy: string;
  avatar: string;
  thumbnail: string;
  bio: string;
  displayName: string;
  relatedConversations: string[];
  messagePubKey: string;
  about_me: AboutMeDto;
};

export type SetAboutMeInput = {
  avatar?: string;
  cover_image?: string;

  first_name?: string;
  last_name?: string;
  email?: string;
  location?: string;
  about?: string;
  occupation?: string;
  profile_image?: string;
  profile_video?: string;
  twitter?: string;
  github?: string;
  telegram?: string;
  linkedin?: string;
  behance?: string;
  website?: string;
};
