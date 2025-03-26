export interface Slug {
    current: string;
    _type: string;
  }
  
  export interface ImageAsset {
    url: string;
  }
  
  export interface MainImage {
    asset: ImageAsset;
  }
  
  export interface Article {
    _id: string;
    title: string;
    slug: Slug;
    mainImage: MainImage;
  }
  
  export interface ArticlePreview {
    title: string;
    url: string;
    imageUrl: string;
  }
  
  export type Articles = Article[];
  