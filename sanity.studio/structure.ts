export const structure = (S: any) =>
  S.list()
    .title('Content')
    .items([
      // Projects
      S.documentTypeListItem('project')
        .title('Projects'),

      // Blog Posts
      S.documentTypeListItem('post')
        .title('Blog Posts'),

      // Authors
      S.documentTypeListItem('author')
        .title('Authors'),

      // Newsletter Subscribers
      S.documentTypeListItem('subscriber')
        .title('Newsletter Subscribers'),

      // Add a divider
      S.divider(),

      // Add any remaining document types
      ...S.documentTypeListItems().filter(
        (listItem: any) =>
          !['project', 'post', 'author', 'subscriber'].includes(
            listItem.getId()
          )
      ),
    ]);
