import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  brand?: string;
  material?: string;
  rating?: number;
  reviews?: number;
}

interface CollectionState {
  products: Product[];
  filteredProducts: Product[];
  filters: {
    category: string[];
    tags: string[];
    sizes: string[];
    colors: string[];
    priceRange: [number, number];
    inStock: boolean;
    brand: string[];
    material: string[];
    rating: number | null;
  };
  sortBy: 'price-asc' | 'price-desc' | 'newest' | 'popular' | 'rating';
  searchQuery: string;
  setProducts: (products: Product[]) => void;
  setFilter: (key: keyof CollectionState['filters'], value: any) => void;
  setSortBy: (sort: CollectionState['sortBy']) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
  updateFiltersFromUrl: (params: URLSearchParams) => void;
  getFiltersAsUrlParams: () => URLSearchParams;
}

const initialState = {
  products: [],
  filteredProducts: [],
  filters: {
    category: [],
    tags: [],
    sizes: [],
    colors: [],
    priceRange: [0, 10000],
    inStock: false,
    brand: [],
    material: [],
    rating: null,
  },
  sortBy: 'newest' as const,
  searchQuery: '',
};

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setProducts: (products) => {
        set({ products, filteredProducts: products });
      },

      setFilter: (key, value) => {
        const state = get();
        const newFilters = { ...state.filters, [key]: value };
        
        // Filtrera produkter
        let filtered = state.products;

        // Sökfält
        if (state.searchQuery) {
          filtered = filtered.filter(product =>
            product.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(state.searchQuery.toLowerCase())
          );
        }

        // Kategorier
        if (newFilters.category.length > 0) {
          filtered = filtered.filter(product =>
            newFilters.category.includes(product.category)
          );
        }

        // Taggar
        if (newFilters.tags.length > 0) {
          filtered = filtered.filter(product =>
            newFilters.tags.some(tag => product.tags.includes(tag))
          );
        }

        // Storlekar
        if (newFilters.sizes.length > 0) {
          filtered = filtered.filter(product =>
            newFilters.sizes.some(size => product.sizes.includes(size))
          );
        }

        // Färger
        if (newFilters.colors.length > 0) {
          filtered = filtered.filter(product =>
            newFilters.colors.some(color => product.colors.includes(color))
          );
        }

        // Varumärken
        if (newFilters.brand.length > 0) {
          filtered = filtered.filter(product =>
            product.brand && newFilters.brand.includes(product.brand)
          );
        }

        // Material
        if (newFilters.material.length > 0) {
          filtered = filtered.filter(product =>
            product.material && newFilters.material.includes(product.material)
          );
        }

        // Betyg
        if (newFilters.rating !== null) {
          filtered = filtered.filter(product =>
            product.rating && product.rating >= newFilters.rating!
          );
        }

        // Prisintervall
        filtered = filtered.filter(product =>
          product.price >= newFilters.priceRange[0] &&
          product.price <= newFilters.priceRange[1]
        );

        // I lager
        if (newFilters.inStock) {
          filtered = filtered.filter(product => product.inStock);
        }

        // Sortering
        switch (state.sortBy) {
          case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          case 'newest':
            // Implementera logik för sortering efter datum
            break;
          case 'popular':
            // Implementera logik för sortering efter popularitet
            break;
        }

        set({ filters: newFilters, filteredProducts: filtered });
      },

      setSortBy: (sortBy) => {
        set({ sortBy });
        get().setFilter('category', get().filters.category); // Uppdatera filtrering med ny sortering
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
        get().setFilter('category', get().filters.category); // Uppdatera filtrering med ny sökning
      },

      resetFilters: () => {
        set({ ...initialState, products: get().products, filteredProducts: get().products });
      },

      updateFiltersFromUrl: (params) => {
        const newFilters = { ...initialState.filters };
        
        // Uppdatera filter från URL-parametrar
        if (params.has('category')) {
          newFilters.category = params.get('category')?.split(',') || [];
        }
        if (params.has('tags')) {
          newFilters.tags = params.get('tags')?.split(',') || [];
        }
        if (params.has('sizes')) {
          newFilters.sizes = params.get('sizes')?.split(',') || [];
        }
        if (params.has('colors')) {
          newFilters.colors = params.get('colors')?.split(',') || [];
        }
        if (params.has('brand')) {
          newFilters.brand = params.get('brand')?.split(',') || [];
        }
        if (params.has('material')) {
          newFilters.material = params.get('material')?.split(',') || [];
        }
        if (params.has('priceRange')) {
          const [min, max] = params.get('priceRange')?.split('-') || ['0', '10000'];
          newFilters.priceRange = [Number(min), Number(max)];
        }
        if (params.has('inStock')) {
          newFilters.inStock = params.get('inStock') === 'true';
        }
        if (params.has('rating')) {
          newFilters.rating = Number(params.get('rating'));
        }

        // Uppdatera sortering
        const sortBy = params.get('sortBy') as CollectionState['sortBy'];
        if (sortBy) {
          set({ sortBy });
        }

        // Uppdatera sökning
        const searchQuery = params.get('q') || '';
        set({ searchQuery });

        // Uppdatera filter och filtrera produkter
        set({ filters: newFilters });
        get().setFilter('category', newFilters.category);
      },

      getFiltersAsUrlParams: () => {
        const state = get();
        const params = new URLSearchParams();

        // Lägg till filter i URL
        if (state.filters.category.length > 0) {
          params.set('category', state.filters.category.join(','));
        }
        if (state.filters.tags.length > 0) {
          params.set('tags', state.filters.tags.join(','));
        }
        if (state.filters.sizes.length > 0) {
          params.set('sizes', state.filters.sizes.join(','));
        }
        if (state.filters.colors.length > 0) {
          params.set('colors', state.filters.colors.join(','));
        }
        if (state.filters.brand.length > 0) {
          params.set('brand', state.filters.brand.join(','));
        }
        if (state.filters.material.length > 0) {
          params.set('material', state.filters.material.join(','));
        }
        if (state.filters.priceRange[0] !== initialState.filters.priceRange[0] ||
            state.filters.priceRange[1] !== initialState.filters.priceRange[1]) {
          params.set('priceRange', `${state.filters.priceRange[0]}-${state.filters.priceRange[1]}`);
        }
        if (state.filters.inStock) {
          params.set('inStock', 'true');
        }
        if (state.filters.rating !== null) {
          params.set('rating', state.filters.rating.toString());
        }
        if (state.sortBy !== initialState.sortBy) {
          params.set('sortBy', state.sortBy);
        }
        if (state.searchQuery) {
          params.set('q', state.searchQuery);
        }

        return params;
      },
    }),
    {
      name: 'collection-store',
      partialize: (state) => ({
        filters: state.filters,
        sortBy: state.sortBy,
      }),
    }
  )
); 
