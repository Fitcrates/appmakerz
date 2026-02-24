import { StructureBuilder } from 'sanity/desk';

export default (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Projects
      S.listItem()
        .title('Projects')
        .schemaType('project')
        .child(
          S.documentList()
            .title('Projects')
            .filter('_type == "project"')
        ),

      // Blog Posts
      S.listItem()
        .title('Blog Posts')
        .schemaType('post')
        .child(
          S.documentList()
            .title('Blog Posts')
            .filter('_type == "post"')
        ),

      // Authors
      S.listItem()
        .title('Authors')
        .schemaType('author')
        .child(
          S.documentList()
            .title('Authors')
            .filter('_type == "author"')
        ),

      // Newsletter Subscribers
      S.listItem()
        .title('Newsletter Subscribers')
        .schemaType('subscriber')
        .child(
          S.documentList()
            .title('Newsletter Subscribers')
            .filter('_type == "subscriber"')
            .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
        ),
    ]);
