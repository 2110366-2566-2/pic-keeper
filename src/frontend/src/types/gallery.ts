export interface Gallery {
  id: string;
  photographer_id: string;
  location: string;
  name: string;
  price: number;
}

export interface NewGallery {
  name?: string;
  location?: string;
  price?: number;
}

export interface SearchFilter {
  photographer_id?: string;
  location?: string;
  min_price?: number;
  max_price?: number;
}

export interface Photo {
  id: string;
  gallery_id: string;
  photo_key: string;
}
