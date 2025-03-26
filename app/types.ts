export interface Article {
  _id: string;
  title: string;
  slug: {
    current: string;
    _type: string;
  };
  mainImage: {
    asset: {
      url: string;
    };
  };
}
