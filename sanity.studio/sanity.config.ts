import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { codeInput } from '@sanity/code-input';
import { assist } from '@sanity/assist';
import { schemaTypes } from './schemas';
import deskStructure from './deskStructure';

export const config = defineConfig({
  name: 'appcrates-portfolio',
  title: 'AppCrates Portfolio',
  
  projectId: '867nk643',
  dataset: 'production',
  
  basePath: '/studio',
  
  plugins: [
    structureTool({
      structure: deskStructure
    }),
    visionTool(),
    codeInput(),
    assist()
  ],

  schema: {
    types: schemaTypes,
  },
});

export default config;
