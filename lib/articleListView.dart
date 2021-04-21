import 'package:flutter/material.dart';
import 'article.dart';
import 'helpers.dart';
import 'articleProvider.dart';
import 'imagePopup.dart';

class ArticleListView extends StatefulWidget {
  final ArticlesProvider articlesProvider;

  const ArticleListView({
    @required this.articlesProvider,
    Key key,
  }) : super(key: key);

  @override
  _ArticleListViewState createState() => _ArticleListViewState();
}

class _ArticleListViewState extends State<ArticleListView> {
  final scrollController = ScrollController();

  @override
  void initState() {
    super.initState();

    scrollController.addListener(scrollListener);
    widget.articlesProvider.fetchNextArticles();
  }

  @override
  void dispose() {
    scrollController.dispose();
    super.dispose();
  }

  void scrollListener() {
    if (scrollController.offset >=
        scrollController.position.maxScrollExtent/2 &&
        !scrollController.position.outOfRange) {
      if (widget.articlesProvider.hasNext) {
        widget.articlesProvider.fetchNextArticles();
      }
    }
  }

  @override
  Widget build(BuildContext context) => ListView(
    controller: scrollController,
    children: [
      ...widget.articlesProvider.articles.map((article) => Card(
          child: Column(
            children: [FutureBuilder(
                future:
                getArticleImages(article.id),
                builder: (_, cloudSnap) {
                  if (cloudSnap.connectionState ==
                      ConnectionState.waiting) {
                    return Center(
                      child: CircularProgressIndicator(),
                    );
                  } else if (cloudSnap.data.length > 0) {
                    return Container(
                      margin:
                      EdgeInsets.symmetric(vertical: 10.0),
                      height: 200.0,
                      child: Scrollbar(
                          child: ListView.builder(
                              scrollDirection: Axis.horizontal,
                              itemCount: cloudSnap.data.length,
                              itemBuilder: (_, index) {
                                return Container(
                                  width: MediaQuery.of(context)
                                      .size
                                      .width,
                                  color: Colors.blueGrey[800],
                                  child: GestureDetector(
                                    child: Hero(
                                      tag:
                                      cloudSnap.data[index],
                                      child: Image.network(
                                          cloudSnap
                                              .data[index]),
                                    ),
                                    onTap: () {
                                      Navigator.push(context,
                                          MaterialPageRoute(
                                              builder: (_) {
                                                return ImagePopup(
                                                    url: cloudSnap
                                                        .data[index],
                                                    tag: cloudSnap
                                                        .data[index]);
                                              }));
                                    },
                                  ),
                                );
                              })),
                    );
                  } else {
                    return Center(
                        child: Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Text(
                              "No images associated this this one."),
                        ));
                  }
                }),
              ListTile(
                  onTap: () => {

                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (BuildContext context) =>
                                Article(
                                    article: article)))
                  },
                  title: Text(article
                      .data()["articleTitle"]),
                  subtitle: Text(getTime(article)),
                  trailing: Chip(
                    backgroundColor: getColor(
                        article.data()["catMajor"]),
                    label: Text(capitalize(
                        article.data()["catMajor"])),
                  )),
              Divider(
                thickness: 2,
                indent: 5,
                endIndent: 5,
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(5, 0, 5, 5),
                child: Container(
                    alignment: Alignment.topLeft,
                    child: Wrap(
                      children:
                      getArticleChips(article),
                    )),
              ),
            ],)

      )).toList(),
      if (widget.articlesProvider.hasNext)
        Center(
          child: GestureDetector(
            onTap: widget.articlesProvider.fetchNextArticles,

            child: Container(
              height: 200,
              width: 200,
              child: CircularProgressIndicator(),
            ),
          ),
        ),
    ],
  );
}
