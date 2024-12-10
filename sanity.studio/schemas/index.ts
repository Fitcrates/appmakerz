import { SchemaTypeDefinition } from 'sanity';
import project from './documents/project';
import post from './documents/post';
import author from './documents/author';
import blockContent from './objects/blockContent';

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  project,
  post,
  author,
  // Objects
  blockContent,
];