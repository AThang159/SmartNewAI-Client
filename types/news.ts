export interface News {
  id: string;
  title: string;
  url: string;
  description: string;
  published_time: string;
  section: string;
  thumbnail: string | null;
  view_count: number;
  slug: string;
  article:
    | {
        ArticleBody: string[];
      }
    | string;
}
