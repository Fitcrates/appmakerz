import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';
import deskStructure from './deskStructure';

export default defineConfig({
  name: 'appcrates-portfolio',
  title: 'AppCrates Portfolio',
  
  projectId: '867nk643',
  dataset: 'production',
  
  basePath: '/studio',
  
  plugins: [
    deskTool({
      structure: deskStructure
    }),
    visionTool()
  ],
  
  schema: {
    types: schemaTypes,
  },
});