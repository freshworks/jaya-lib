export interface Agent {
  avatar?: {
    url?: string;
  };
  biography?: string;
  email: string;
  first_name: string;
  groups: string[];
  id: string;
  is_deactivated?: boolean;
  last_name: string;
  phone?: string;
  role_id?: string;
  skill_id?: string;
  social_profiles?: unknown;
}
