export default (S) =>
  S.list()
    .title('Content')
    .items([
      // Projects
      S.listItem()
        .title('Projects')
        .child(
          S.documentList()
            .title('Projects')
            .filter('_type == "project"')
            .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
        ),

      // Blog Posts
      S.listItem()
        .title('Blog Posts')
        .child(
          S.documentList()
            .title('Blog Posts')
            .filter('_type == "post"')
            .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
        ),

      // Authors
      S.listItem()
        .title('Authors')
        .child(
          S.documentList()
            .title('Authors')
            .filter('_type == "author"')
        ),

      // Newsletter Subscribers
      S.listItem()
        .title('Newsletter Subscribers')
        .child(
          S.documentList()
            .title('Newsletter Subscribers')
            .filter('_type == "subscriber"')
            .defaultOrdering([{field: 'subscribedAt', direction: 'desc'}])
        ),

      // Add a divider
      S.divider(),

      // Add any remaining document types
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !['project', 'post', 'author', 'subscriber'].includes(
            listItem.getId()
          )
      ),
    ]);
