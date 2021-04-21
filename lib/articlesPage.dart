import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'articleProvider.dart';
import 'articleListView.dart';

class ArticlesPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) => ChangeNotifierProvider(
    create: (context) => ArticlesProvider(),
    child: Scaffold(
      backgroundColor: Colors.blueGrey[300],
      appBar: AppBar(
        title: Text('Articles'),
        centerTitle: true,
        backgroundColor: Colors.blue[900],
      ),
      body: Consumer<ArticlesProvider>(
        builder: (context, articlesProvider, _) => ArticleListView(
          articlesProvider: articlesProvider,
        ),
      ),
    ),
  );
}