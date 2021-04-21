import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'helpers.dart';

class ArticlesProvider extends ChangeNotifier {
  final _articlesSnapshot = <DocumentSnapshot>[];
  String _errorMessage = '';
  int documentLimit = 6;
  bool _hasNext = true;
  bool _isFetchingArticles = false;

  String get errorMessage => _errorMessage;

  bool get hasNext => _hasNext;

  List<DocumentSnapshot> get articles => _articlesSnapshot.map((snap) {
        return snap;
      }).toList();

  Future fetchNextArticles() async {
    if (_isFetchingArticles) return;

    _errorMessage = '';
    _isFetchingArticles = true;

    try {
      final snap = await getArts(documentLimit,startAfter: _articlesSnapshot.isNotEmpty ? _articlesSnapshot.last : null,);


      _articlesSnapshot.addAll(snap.docs);

      if (snap.docs.length < documentLimit) _hasNext = false;
      notifyListeners();
    } catch (error) {
      _errorMessage = error.toString();
      notifyListeners();
    }

    _isFetchingArticles = false;
  }
}
