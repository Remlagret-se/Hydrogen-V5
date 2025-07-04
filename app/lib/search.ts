export interface PredictiveSearchReturn {
  term: string;
  result: {
    items: {
      articles: any[];
      collections: any[];
      pages: any[];
      products: any[];
      queries: any[];
    };
    total: number;
  };
  error: string | null;
} 