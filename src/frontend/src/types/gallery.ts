export interface Gallery {
  id: string;
  photographer_id: string;
  location: string;
  name: string;
  price: number;
  hours: number;
  description: string | null;
  delivery_time: number;
  included: string[];
}

export interface NewGallery {
  name?: string;
  location?: string;
  price?: number;
  hours?: number;
  description?: string | null;
  delivery_time?: number;
  included?: string[];
}

export interface SearchFilter {
  photographer_id?: string;
  gallery_name?: string;
  photographer_name?: string;
  location?: string;
  min_price?: number;
  max_price?: number;
}

export interface Photo {
  id: string;
  gallery_id: string;
  photo_key: string;
}

export interface FileWithPreview {
  file: File;
  preview: string;
}
