import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'appcrates-portfolio',
  title: 'AppCrates Portfolio',
  
  projectId: '867nk643', // We'll update this after initialization
  dataset: 'production',
  
  basePath: '/studio',
  
  plugins: [
    deskTool(),
    visionTool()
  ],
  
  schema: {
    types: schemaTypes,
  },
});