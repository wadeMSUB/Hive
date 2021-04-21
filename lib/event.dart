import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:flutter_html/style.dart';
import 'package:url_launcher/url_launcher.dart';
import 'helpers.dart';
import 'imagePopup.dart';

class Event extends StatefulWidget {
  final DocumentSnapshot event;

  Event({this.event});
  @override
  _EventState createState() => _EventState();
}

class _EventState extends State<Event> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(

      appBar: AppBar(
        title: Text(widget.event.data()['eventTitle']),
        centerTitle: true,
        backgroundColor: Colors.blue[900],
      ),
      body: SingleChildScrollView(
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          FutureBuilder(
              future: getEventImages(widget.event.id),
              builder: (_, cloudSnap) {
                if (cloudSnap.connectionState ==
                    ConnectionState.waiting) {
                  return Center(
                    child: CircularProgressIndicator(),
                  );
                } else if (cloudSnap.data.length > 0) {
                  return Container(
                    margin:
                    EdgeInsets.symmetric(vertical: 20.0),
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
                                    tag: cloudSnap.data[index],
                                    child: Image.network(
                                        cloudSnap.data[index]),
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
          Padding(
            padding: EdgeInsets.fromLTRB(5, 0, 5, 0),
            child: Container(
              alignment: Alignment.topLeft,
              child: Wrap(
                children: List<Widget>.generate(
                    widget.event.data()["eventChips"]
                        .length, (int index) {
                  return Chip(
                      label: Text(widget.event.data()["eventChips"][index]));
                }),
              ),
            ),
          ),
          Divider(
            thickness: 2,
            indent: 5,
            endIndent: 5,
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(5, 8.0, 5,0),
                child: Text("Author: "+
                  widget.event.data()["authorFirstName"]+" "+widget.event.data()["authorLastName"],
                  textAlign: TextAlign.left,
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(5, 8.0, 5,0),
                child: Text("Date Posted: "+getTime(widget.event),
                  textAlign: TextAlign.left,
                ),
              ),
            ],
          ),
          Row(
            //mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(5, 8.0, 5,0),
                child: Text("Event Date:",
                  textAlign: TextAlign.left,
                ),
                ),

             Wrap(
                children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(5, 8.0, 5,0),
                    child: Text(getEventDates(widget.event),
                      textAlign: TextAlign.left,
                    ),
                  ),
                ],
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(5, 8.0, 5,0),
            child: Text("Location: "+ widget.event.data()["eventLocation"],
              textAlign: TextAlign.left,
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(5, 8.0, 5,0),
            child: Text(
              widget.event.data()["eventTitle"],
              textAlign: TextAlign.left,
              //style: TextStyle(),
              textScaleFactor: 1.5,
            ),
          ),

          Padding(
            padding: const EdgeInsets.fromLTRB(8.0,0,8,0),
            child: Html(
              data: widget.event.data()["eventDescription"],
              onLinkTap: (url) async {

                if (await canLaunch(url)) {
                  await launch(url,
                    forceWebView: false,);
                  print("Opening $url...");
                } else {
                  // can't launch url, there is some error
                  throw "Could not launch $url";
                }
              },
            ),
          )
        ]),
      ),
    );
  }
}
