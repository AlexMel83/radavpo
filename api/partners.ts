import type { AxiosInstance } from 'axios';

export interface PartnersResponse {
  status: number;
  data: {
    id: number;
    email: string | null;
    facebook_id: string | null;
    google_id: string | null;
    name: string;
    surname: string;
    phone: string;
    picture: string;
    role: string;
    social_login: boolean;
    isactivated: boolean;
    created_at: string;
    udated_at: string;
  };
}

export interface Partners {
  id: number;
  email: string | null;
  facebook_id: string | null;
  google_id: string | null;
  name: string;
  surname: string;
  phone: string;
  picture: string;
  role: string;
  social_login: boolean;
  isactivated: boolean;
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
