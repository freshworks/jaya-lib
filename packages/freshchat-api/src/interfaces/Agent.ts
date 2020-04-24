export interface Agent {
  avatar?: {
    url?: string;
  };
  biography?: string;
  email: string;
  first_name: string;
  groups: string[];
  id: string;
  last_name: string;
  phone?: string;
}
