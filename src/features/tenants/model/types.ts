export interface Tenant {
  id: string;
  slug: string;
  name: string;
  domain?: string;
  branding: {
    logoUrl?: string;
    primaryColor: string;
    fontFamily?: string;
  };
}
