import type { AxiosInstance } from 'axios';

import authModule from './auth';
import partnersModule from './partners';
import type { AuthResponse } from './auth';
import type { PartnersResponse } from './partners';

export default function (instance: AxiosInstance) {
  return {
    auth: authModule(instance),
    partners: partnersModule(instance),
  };
}

export interface ApiModule {
  auth: AuthResponse;
  getUser(): Promise<AuthResponse>;
  partners: PartnersResponse;
  getPartners(): Promise<PartnersResponse>;
}
