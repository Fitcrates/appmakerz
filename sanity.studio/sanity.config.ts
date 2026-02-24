import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { codeInput } from '@sanity/code-input';
import { schemaTypes } from './schemas';
import deskStructure from './deskStructure';

export const config = defineConfig({
  name: 'appcrates-portfolio',
  title: 'AppCrates Portfolio',
  
  projectId: '867nk643',
  dataset: 'production',
  
  basePath: '/studio',
  
  plugins: [
    deskTool({
      structure: deskStructure
    }),
    visionTool(),
    codeInput()
  ],

  schema: {
    types: schemaTypes,
  },
});

export default config;
