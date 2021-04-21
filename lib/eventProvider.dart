import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'helpers.dart';

class EventsProvider extends ChangeNotifier {
  final _eventsSnapshot = <DocumentSnapshot>[];
  String _errorMessage = '';
  int documentLimit = 2;
  bool _hasNext = true;
  bool _isFetchingEvents = false;

  String get errorMessage => _errorMessage;

  bool get hasNext => _hasNext;

  List<DocumentSnapshot> get events => _eventsSnapshot.map((snap) {
    return snap;
  }).toList();

  Future fetchNextEvents() async {
    if (_isFetchingEvents) return;

    _errorMessage = '';
    _isFetchingEvents = true;

    try {
      final snap = await getEvs(documentLimit,startAfter: _eventsSnapshot.isNotEmpty ? _eventsSnapshot.last : null,);


      _eventsSnapshot.addAll(snap.docs);

      if (snap.docs.length < documentLimit) _hasNext = false;
      notifyListeners();
    } catch (error) {
      _errorMessage = error.toString();
      notifyListeners();
    }

    _isFetchingEvents = false;
  }
}