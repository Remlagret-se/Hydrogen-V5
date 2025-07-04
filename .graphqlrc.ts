import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './app/graphql/schema.graphql',
  documents: ['./app/**/*.{ts,tsx}'],
  generates: {
    './app/graphql/types.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        skipTypename: false,
        dedupeFragments: true,
      },
    },
  },
};

export default config;
