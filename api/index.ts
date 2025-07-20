import type { AxiosInstance } from 'axios';

import authModule from './auth';
import partnersModule from './partners';
import postsModule from './posts';
import type { AuthResponse } from './auth';
import type { PartnersResponse } from './partners';
import type { PostsResponse } from './posts';

export default function (instance: AxiosInstance) {
  return {
    auth: authModule(instance),
    partners: partnersModule(instance),
    posts: postsModule(instance),
  };
}

export interface ApiModule {
  auth: AuthResponse;
  getUser(): Promise<AuthResponse>;
  partners: PartnersResponse;
  getPartners(): Promise<PartnersResponse>;
  posts: PostsResponse;
  getPosts(): Promise<PostsResponse>;
}
