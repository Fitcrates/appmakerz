import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';
import { codeInput } from '@sanity/code-input';

export const config = defineConfig({
  name: 'default',
  title: 'AppCrates Portfolio',

  projectId: '867nk643',
  dataset: 'production',

  plugins: [deskTool(), visionTool(), codeInput()],

  schema: {
    types: schemaTypes,
  },
});

export default config;