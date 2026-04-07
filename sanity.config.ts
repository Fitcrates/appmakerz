import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { codeInput } from '@sanity/code-input';
import { assist } from '@sanity/assist';
import { schemaTypes } from './sanity.studio/schemas';

export const config = defineConfig({
  name: 'default',
  title: 'AppCrates Portfolio',

  projectId: '867nk643',
  dataset: 'production',
  
  basePath: '/studio',

  plugins: [structureTool(), visionTool(), codeInput(), assist()],

  schema: {
    types: schemaTypes,
  },
});

export default config;
