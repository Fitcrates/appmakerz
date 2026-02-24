import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { codeInput } from '@sanity/code-input';
import { schemaTypes } from './sanity.studio/schemas';

export const config = defineConfig({
  name: 'default',
  title: 'AppCrates Portfolio',

  projectId: '867nk643',
  dataset: 'production',
  
  basePath: '/studio',

  plugins: [deskTool(), visionTool(), codeInput()],

  schema: {
    types: schemaTypes,
  },
});

export default config;
