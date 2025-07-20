import type { AxiosInstance } from 'axios';

export interface PostsResponse {
  status: number;
  data: Posts[];
}

export interface Posts {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  images: string[];
  tags: string[];
  category: string;
  source_type: string;
  source_url: string;
  address: string;
  location: string;
  formatted_address: string;
  published: boolean;
  created_at: string;
  udated_at: string;
}

export interface PostsApi {
  getPosts(postsLink: string): Promise<PostsResponse>;
}

export default function (instance: AxiosInstance): PostsApi {
  return {
    async getPosts(postsLink) {
      if (!postsLink) {
        return instance.get(`/posts/`);
      }
      return instance.get(`/posts/${postsLink}`);
    },
  };
}
