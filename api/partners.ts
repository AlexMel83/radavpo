import type { AxiosInstance } from 'axios';

export interface PartnersResponse {
  status: number;
  data: Partners[];
}

export interface Partners {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  contacts: { address: string; phone: string; email: string };
  url: string;
  tags: string[];
  images: string[];
  address: string;
  location: string;
  formatted_address: string;
  published: boolean;
  created_at: string;
  udated_at: string;
}

export interface PartnersApi {
  getPartners(partnersLink: string): Promise<PartnersResponse>;
}

export default function (instance: AxiosInstance): PartnersApi {
  return {
    async getPartners(partnersLink) {
      if (!partnersLink) {
        return instance.get(`/partners/`);
      }
      return instance.get(`/partners/${partnersLink}`);
    },
  };
}
