import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:flutter_html/style.dart';
import 'package:url_launcher/url_launcher.dart';
import 'helpers.dart';
import 'imagePopup.dart';

class Article extends StatefulWidget {
  final DocumentSnapshot article;

  Article({this.article});
  @override
  _ArticleState createState() => _ArticleState();
}

class _ArticleState extends State<Article> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(

      appBar: AppBar(
        title: Text(widget.article.data()['articleTitle']),
        centerTitle: true,
        backgroundColor: Colors.blue[900],
      ),
      body: SingleChildScrollView(
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          FutureBuilder(
              future: getArticleImages(widget.article.id),
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
                      child: Text(
                          "No images associated this this one."));
                }
              }),
          Padding(
              padding: EdgeInsets.fromLTRB(5, 0, 5, 0),
              child: Wrap(
                  children: List<Widget>.generate(
                      widget.article.data()["catMinor"]
                          .length, (int index) {
                    return Chip(
                        label: Text(widget.article.data()["catMinor"][index]));
                  }),
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
                  widget.article.data()["authorFirstName"]+" "+widget.article.data()["authorLastName"],
                  textAlign: TextAlign.left,
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(5, 8.0, 5,0),
                child: Text("Published: "+getTime(widget.article),
                  textAlign: TextAlign.left,
                ),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(5, 16.0, 5,0),
            child: Text(
              widget.article.data()["articleTitle"],
              textAlign: TextAlign.left,
              //style: TextStyle(),
              textScaleFactor: 1.5,
            ),
          ),

          Padding(
            padding: const EdgeInsets.fromLTRB(8,0,8,0),
            child: Html(
              data: widget.article.data()["articleBody"],
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
