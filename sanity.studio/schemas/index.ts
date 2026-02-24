import { SchemaTypeDefinition } from 'sanity';
import project from './documents/project';
import post from './documents/post';
import author from './documents/author';
import subscriber from './documents/subscriber';
import blockContent from './objects/blockContent';
import pages from './documents/pages';

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  project,
  post,
  author,
  subscriber,
  pages,
  // Objects
  blockContent,
];