import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:testbuild2/eventsPage.dart';
import 'loading.dart';
import 'Unused/event_list.dart';
import 'home.dart';
import 'Unused/article_list.dart';
import 'article.dart';
import 'event.dart';
import 'articlesPage.dart';


Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  void didChangeAppLifecycleState(AppLifecycleState state) { }

  runApp(MaterialApp(

    home: Home(),
    routes: {

      '/home': (context) => Home(),
      '/articlesPage': (context) => ArticlesPage(),
      '/article': (context) => Article(),
      '/eventsPage': (context) => EventsPage(),
      '/event': (context) => Event(),




    },
  ));
}