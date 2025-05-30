export interface Author {
  _id: string;
  name: string;
  email: string;
}

export interface Article {
  _id: string;
  title: string;
  image?: string; // URL de l'image, si disponible
  content: string;
  author: Author;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ArticleApiResponse {
  articles: Article[];
}
