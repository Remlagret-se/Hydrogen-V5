// Filter-related types and utilities
export interface FilterOption {
  value: string;
  label: string;
  checked: boolean;
}

export interface Filter {
  id: string;
  name: string;
  options: FilterOption[];
}

// Helper function to get hardcoded filter options for instant display
export function getHardcodedFilterOptions(collectionHandle: string): Record<string, string[]> {
  // Pre-computed filter options based on actual product data
  // This provides instant loading while maintaining accuracy
  const baseFilters = {
    innerdiameter: [
      '3', '4', '5', '6', '7', '8', '9', '10', '12', '15', '17', '20', '22', '22.225', 
      '25', '25.4', '28', '30', '32', '35', '38.1', '40', '42', '45', '47', '50', 
      '55', '60', '63.5', '65', '70', '75', '80', '85', '90', '95', '100', '110', 
      '120', '130', '140', '150', '160', '170', '180', '190', '200', '220', '240', 
      '260', '280', '300', '320', '340', '360', '380', '400', '420', '440', '460', 
      '480', '500', '530', '560', '600', '630', '670', '710', '750', '800', '850', 
      '900', '950', '1000', '1060', '1120', '1180', '1250', '1320', '1400', '1500'
    ],
    ytterdiameter: [
      '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '22', 
      '24', '26', '28', '30', '32', '35', '37', '40', '42', '44.45', '47', '50', 
      '52', '55', '58', '60', '62', '65', '68', '70', '72', '75', '78', '80', '85', 
      '88.9', '90', '95', '100', '105', '110', '115', '120', '125', '130', '140', 
      '150', '160', '170', '180', '190', '200', '210', '215', '220', '230', '240', 
      '250', '260', '270', '280', '290', '300', '310', '320', '340', '360', '380', 
      '400', '420', '440', '460', '480', '500', '520', '540', '560', '580', '600', 
      '620', '650', '680', '720', '760', '800', '850', '900', '950', '1000', '1060', 
      '1120', '1180', '1250', '1320', '1400', '1500', '1600', '1700', '1800'
    ],
    bredd: [
      '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', 
      '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13', '13.5', 
      '14', '14.5', '15', '15.5', '16', '16.5', '17', '17.5', '18', '18.5', '19', 
      '19.5', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', 
      '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '42', '44', 
      '45', '46', '48', '50', '52', '54', '56', '58', '60', '62', '64', '65', 
      '67', '69', '70', '71', '72', '73', '75', '78', '80', '82', '85', '86', 
      '90', '92', '94', '95', '98', '100', '103', '104', '106', '109', '110', 
      '112', '115', '118', '120', '122', '124', '125', '128', '130', '132', '134', 
      '136', '138', '140', '145', '150', '155', '160', '165', '170', '175', '180', 
      '185', '190', '195', '200', '206', '210', '218', '220', '230', '236', '240', 
      '243', '250', '258', '260', '264', '270', '272', '280', '290', '300', '308', 
      '315', '320', '325', '335', '340', '345', '355', '360', '365', '375', '380', 
      '385', '400', '412', '420', '425', '438', '450', '462', '475', '488', '500'
    ],
    vendor: [
      'FAG', 'INA', 'NSK', 'NTN', 'SKF', 'TIMKEN', 'KOYO', 'NACHI', 'IKO', 
      'THK', 'HIWIN', 'PMI', 'SCHNEEBERGER', 'BOSCH REXROTH', 'SCHAEFFLER', 
      'RHP', 'SNR', 'ZKL', 'URB', 'FBJ', 'ASAHI', 'DODGE', 'SEALMASTER', 
      'IPTCI', 'BROWNING', 'LINK-BELT', 'COOPER', 'RBC', 'AURORA', 'BOSTON GEAR',
      'KAYDON', 'TORRINGTON', 'BARDEN', 'FAFNIR', 'NICE', 'MRC', 'STEYR',
      'DKF', 'ZWZ', 'HRB', 'LYC', 'TMB', 'WAFANGDIAN', 'C&U', 'NACHI-FUJIKOSHI'
    ],
    productType: [
      'Spårkullager', 'Vinkelkontaktlager', 'Cylindriska rullager', 'Sfäriska rullager',
      'Koniska rullager', 'Nållager', 'Axiallager', 'Glidlager', 'Linjärlager',
      'Lagerhus', 'Tätningar', 'Smörjmedel', 'Monteringsverktyg', 'Tillbehör'
    ],
    material: [
      'Stål', 'Rostfritt stål', 'Keramik', 'Hybrid (stål/keramik)', 'Plast', 
      'Brons', 'Mässing', 'Polymer', 'Krom', 'Titan', 'Aluminium'
    ],
    seal: [
      '2RS', '2RS1', '2RSH', '2RSR', 'ZZ', '2Z', 'RS', 'Z', 'RZ', '2RZ', 
      'LLB', 'LLU', 'DDU', 'VV', 'Öppen', 'Metallskydd', 'Gummitätning', 
      'Nitrilgummi', 'Viton', 'Teflon'
    ],
    cage: [
      'Stål', 'Mässing', 'Polyamid', 'Fenolharts', 'PEEK', 'Massiv mässing',
      'Stålplåt', 'Glasfiberförstärkt polyamid', 'Utan bur', 'Silver'
    ],
    precision: [
      'P0', 'P6', 'P5', 'P4', 'P2', 'ABEC1', 'ABEC3', 'ABEC5', 'ABEC7', 
      'ABEC9', 'Normal', 'C3', 'C4', 'C5'
    ],
    application: [
      'Elmotorer', 'Pumpar', 'Växellådor', 'Transportband', 'Fläktar', 
      'Kompressorer', 'Verktygsmaskiner', 'Fordonsindustri', 'Jordbruksmaskiner',
      'Gruvindustri', 'Pappersindustri', 'Livsmedelsindustri', 'Medicinsk utrustning',
      'Flygindustri', 'Marin', 'Vindkraft', 'Järnväg', 'Textilmaskiner'
    ]
  };

  // Return filters based on collection
  if (collectionHandle === 'sparkullager') {
    return baseFilters;
  }
  
  // For other collections, return a subset or different filters
  return {
    vendor: baseFilters.vendor,
    productType: baseFilters.productType,
    material: baseFilters.material,
  };
}

// Cache for filtered products to speed up re-filtering
const filterCache = new Map<string, any[]>();

export function getCacheKey(filters: Record<string, string[]>): string {
  return JSON.stringify(filters, Object.keys(filters).sort());
}

export function filterProductsByActiveFiltersWithCache(
  products: any[], 
  activeFilters: Record<string, string[]>
): any[] {
  const cacheKey = getCacheKey(activeFilters);
  
  if (filterCache.has(cacheKey)) {
    return filterCache.get(cacheKey)!;
  }
  
  const filtered = filterProductsByActiveFilters(products, activeFilters);
  filterCache.set(cacheKey, filtered);
  
  // Limit cache size
  if (filterCache.size > 100) {
    const firstKey = filterCache.keys().next().value;
    filterCache.delete(firstKey);
  }
  
  return filtered;
}

// Helper function to merge hardcoded and real filter options
export function mergeFilterOptions(hardcoded: Record<string, string[]>, real: Record<string, string[]>): Record<string, string[]> {
  const merged: Record<string, string[]> = { ...hardcoded };
  
  // Add any new filter values from real data
  Object.entries(real).forEach(([key, values]) => {
    if (merged[key]) {
      // Merge and deduplicate
      const combinedValues = [...new Set([...merged[key], ...values])];
      
      // Sort appropriately
      const isNumeric = ['innerdiameter', 'ytterdiameter', 'bredd'].includes(key);
      if (isNumeric) {
        merged[key] = combinedValues.sort((a, b) => {
          const numA = parseFloat(a);
          const numB = parseFloat(b);
          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          }
          return a.localeCompare(b);
        });
      } else {
        merged[key] = combinedValues.sort();
      }
    } else {
      // New filter category from real data
      merged[key] = values;
    }
  });
  
  return merged;
}

// Helper function to extract filter options from products
export function extractFacetedFilterOptions(products: any[], activeFilters: Record<string, string[]> = {}) {
  const options: Record<string, Set<string>> = {};

  products.forEach(product => {
    // Process metafields
    if (product.metafields) {
      product.metafields.forEach((metafield: any) => {
        if (metafield?.key && metafield?.value) {
          let displayValue = metafield.value;
          try {
            const parsed = JSON.parse(metafield.value);
            if (parsed && typeof parsed === 'object' && 'value' in parsed) {
              displayValue = parsed.value.toString();
            }
          } catch {
            // Keep original value
          }

          if (!options[metafield.key]) {
            options[metafield.key] = new Set();
          }
          options[metafield.key].add(displayValue);
        }
      });
    }

    // Process vendor
    if (product.vendor) {
      if (!options.vendor) {
        options.vendor = new Set();
      }
      options.vendor.add(product.vendor);
    }

    // Process product type
    if (product.productType) {
      if (!options.productType) {
        options.productType = new Set();
      }
      options.productType.add(product.productType);
    }

    // Process tags
    if (product.tags) {
      product.tags.forEach((tag: string) => {
        if (tag.includes(':')) {
          const [key, value] = tag.split(':');
          if (!options[key]) {
            options[key] = new Set();
          }
          options[key].add(value.trim());
        }
      });
    }
  });

  // Convert Sets to sorted arrays with numeric sorting for dimensions
  const result: Record<string, string[]> = {};
  Object.entries(options).forEach(([key, values]) => {
    const valuesArray = Array.from(values);
    
    // Check if this is a numeric dimension field
    const isNumeric = ['innerdiameter', 'ytterdiameter', 'bredd'].includes(key);
    
    if (isNumeric) {
      // Sort numerically
      result[key] = valuesArray.sort((a, b) => {
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a.localeCompare(b);
      });
    } else {
      // Sort alphabetically
      result[key] = valuesArray.sort();
    }
  });

  return result;
}

// Helper function to filter products by active filters
export function filterProductsByActiveFilters(products: any[], activeFilters: Record<string, string[]>) {
  return products.filter(product => {
    return Object.entries(activeFilters).every(([filterKey, filterValues]) => {
      if (filterValues.length === 0) return true;

      // Check metafields
      const metafieldMatch = product.metafields?.some((metafield: any) => {
        if (metafield?.key === filterKey && metafield?.value) {
          let displayValue = metafield.value;
          try {
            const parsed = JSON.parse(metafield.value);
            if (parsed && typeof parsed === 'object' && 'value' in parsed) {
              displayValue = parsed.value.toString();
            }
          } catch {
            // Keep original value
          }
          return filterValues.includes(displayValue);
        }
        return false;
      });

      // Check vendor
      if (filterKey === 'vendor' && product.vendor) {
        return filterValues.includes(product.vendor);
      }

      // Check product type
      if (filterKey === 'productType' && product.productType) {
        return filterValues.includes(product.productType);
      }

      // Check tags
      const tagMatch = product.tags?.some((tag: string) => {
        if (tag.includes(':')) {
          const [key, value] = tag.split(':');
          return key === filterKey && filterValues.includes(value.trim());
        }
        return false;
      });

      return metafieldMatch || tagMatch;
    });
  });
}

// Helper function to get display names for filters
export function getFilterDisplayName(key: string): string {
  const displayNames: Record<string, string> = {
    innerdiameter: 'Innerdiameter',
    ytterdiameter: 'Ytterdiameter', 
    bredd: 'Bredd',
    vendor: 'Tillverkare',
    productType: 'Produkttyp',
    material: 'Material',
    seal: 'Tätning',
    cage: 'Bur',
    precision: 'Precision',
    application: 'Tillämpning',
    tags: 'Taggar',
    pfs: 'PFS'
  };
  return displayNames[key] || key;
}

// Helper function to convert filter options to UI format
export function convertFiltersToUIFormat(
  filterOptions: Record<string, string[]>, 
  activeFilters: Record<string, string[]>
): Filter[] {
  return Object.entries(filterOptions || {}).map(([key, options]) => ({
    id: key,
    name: getFilterDisplayName(key),
    options: (options || []).map(option => ({
      value: option,
      label: option,
      checked: activeFilters[key]?.includes(option) || false
    }))
  }));
} 