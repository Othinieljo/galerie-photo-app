/**
 * Unsplash photo (subset used by the app)
 */
export interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb?: string;
    full?: string;
  };
  alt_description: string | null;
  description?: string | null;
  user?: {
    name: string;
    username: string;
    profile_image?: {
      small?: string;
      medium?: string;
    };
  };
  width?: number;
  height?: number;
  likes?: number;
  downloads?: number;
  views?: number;
  created_at?: string;
  color?: string;
}

/**
 * API list response can be array or paginated object
 */
export type UnsplashListResponse = UnsplashPhoto[] | { results: UnsplashPhoto[] };
