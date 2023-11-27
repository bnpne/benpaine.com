export const deskStructure = (S) =>
  S.list()
    .title("Base")
    .items([
      S.listItem()
        .title("Home Page")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("Social Links")
        .child(
          S.document().schemaType("socialLinks").documentId("socialLinks")
        ),
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !["homePage"].includes(listItem.getId()) &&
          !["socialLinks"].includes(listItem.getId())
      ),
    ])
