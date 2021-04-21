import 'package:flutter/material.dart';

class ImagePopup extends StatefulWidget {
  final String url;
  final String tag;
  const ImagePopup({this.url, this.tag});

  @override
  _ImagePopupState createState() => _ImagePopupState();
}

class _ImagePopupState extends State<ImagePopup> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GestureDetector(
        child: Center(
          child: Hero(
            tag: widget.tag,
            child: Image.network(
              widget.url,
            ),
          ),
        ),
        onTap: () {
          Navigator.pop(context);
        },
      ),
    );
  }
}
