export interface User {
  avatar?: {
    url: string;
  };
  created_time: string;
  email?: string;
  first_name: string;
  id: string;
  last_name?: string;
  phone?: string;
  properties?: {
    name: string;
    value: string;
  }[];
  reference_id: string;
  social_profiles?: {
    id: string;
    type: string;
  }[];
}
