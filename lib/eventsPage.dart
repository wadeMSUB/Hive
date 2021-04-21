import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'eventProvider.dart';
import 'eventListView.dart';

class EventsPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) => ChangeNotifierProvider(
    create: (context) => EventsProvider(),
    child: Scaffold(
      backgroundColor: Colors.blueGrey[300],
      appBar: AppBar(
        title: Text('Events'),
        centerTitle: true,
        backgroundColor: Colors.blue[900],
      ),
      body: Consumer<EventsProvider>(
        builder: (context, eventsProvider, _) => EventListView(
          eventsProvider: eventsProvider,
        ),
      ),
    ),
  );
}