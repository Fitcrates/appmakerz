import { SchemaTypeDefinition } from 'sanity';
import project from './documents/project';
import post from './documents/post';
import author from './documents/author';
import subscriber from './documents/subscriber';
import blockContent from './objects/blockContent';
import pages from './documents/pages';
import serviceLanding from './documents/serviceLanding';
import aboutMe from './documents/aboutMe';

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  project,
  post,
  author,
  subscriber,
  pages,
  serviceLanding,
  aboutMe,
  // Objects
  blockContent,
];