import 'package:flutter/material.dart';
import 'event.dart';
import 'helpers.dart';
import 'eventProvider.dart';
import 'imagePopup.dart';

class EventListView extends StatefulWidget {
  final EventsProvider eventsProvider;

  const EventListView({
    @required this.eventsProvider,
    Key key,
  }) : super(key: key);

  @override
  _EventListViewState createState() => _EventListViewState();
}

class _EventListViewState extends State<EventListView> {
  final scrollController = ScrollController();

  @override
  void initState() {
    super.initState();

    scrollController.addListener(scrollListener);
    widget.eventsProvider.fetchNextEvents();
  }

  @override
  void dispose() {
    scrollController.dispose();
    super.dispose();
  }

  void scrollListener() {
    print("Has Next from scroll "+widget.eventsProvider.hasNext.toString());
    if (scrollController.offset >=
        scrollController.position.maxScrollExtent/10 &&
        !scrollController.position.outOfRange) {
      if (widget.eventsProvider.hasNext) {
        widget.eventsProvider.fetchNextEvents();
      }
    }
  }

  @override
  Widget build(BuildContext context) => ListView(
    controller: scrollController,
    children: [
      ...widget.eventsProvider.events.map((event) => Card(
          child: Column(

            children: [FutureBuilder(
                future:
                getEventImages(event.id),
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
                        child: Text(
                            "No images associated this this one."));
                  }
                }),
              ListTile(
                  onTap: () => {

                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (BuildContext context) =>
                                Event(
                                    event: event)))
                  },
                  title: Text(event
                      .data()["eventTitle"]),
                  subtitle: Text(getTime(event)),
                  ),
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
                      getEventChips(event),
                    )),
              ),
            ],)

      )).toList(),
      if (widget.eventsProvider.hasNext)
        Center(
          child: GestureDetector(
            onTap: widget.eventsProvider.fetchNextEvents,

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
