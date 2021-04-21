import 'dart:async';

import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:firebase_auth/firebase_auth.dart';

Future<QuerySnapshot> getArts(
  int limit, {
  DocumentSnapshot startAfter,
}) async {
  final articlesRef= FirebaseFirestore.instance
      .collection("articles")
      .orderBy('timestamp', descending: true)
      .limit(limit);

  if (startAfter == null) {
    return articlesRef.get();
  } else {
    return articlesRef.startAfterDocument(startAfter).get();
  }
}


Future<QuerySnapshot> getEvs(
    int limit, {
      DocumentSnapshot startAfter,
    }) async {
  final eventsRef= FirebaseFirestore.instance
      .collection("events")
      .orderBy('timestamp', descending: true)
      .limit(limit);

  if (startAfter == null) {
    return eventsRef.get();
  } else {
    return eventsRef.startAfterDocument(startAfter).get();
  }
}



getArticleImages(aid) async {
  FirebaseAuth.instance.signInAnonymously();
  var urlList = [];
  var cloud = FirebaseStorage.instance.ref("articleImages/" + "$aid" + "/");
  print(cloud.fullPath);

  var list = await cloud.listAll().then((results) {
    return results.items;
  });

  for (var item in list) {
    urlList.add(await item.getDownloadURL());
  }

  //print( urlList);
  return urlList;
}

getEventImages(eid) async {
  FirebaseAuth.instance.signInAnonymously();
  var urlList = [];
  var cloud = FirebaseStorage.instance.ref("eventImages/" + "$eid" + "/");
  print(cloud.fullPath);

  var list = await cloud.listAll().then((results) {
    return results.items;
  });

  for (var item in list) {
    urlList.add(await item.getDownloadURL());
  }

  //print( urlList);
  return urlList;
}

getTime(a) {
  var year = DateTime.fromMillisecondsSinceEpoch(a.data()["timestamp"])
      .year
      .toString();
  var month = DateTime.fromMillisecondsSinceEpoch(a.data()["timestamp"])
      .month
      .toString();
  var day = DateTime.fromMillisecondsSinceEpoch((a.data()["timestamp"]))
      .day
      .toString();
  var date = month + "-" + day + "-" + year;

  return date;
}

getEventDates(e) {
  var startYear =
      DateTime.fromMillisecondsSinceEpoch(e.data()["eventStartTimestamp"]).year;

  var startMonth =
      DateTime.fromMillisecondsSinceEpoch(e.data()["eventStartTimestamp"])
          .month;
  var startDay =
      DateTime.fromMillisecondsSinceEpoch(e.data()["eventStartTimestamp"]).day;
  var endYear =
      DateTime.fromMillisecondsSinceEpoch(e.data()["eventEndStamp"]).year;

  var endMonth =
      DateTime.fromMillisecondsSinceEpoch(e.data()["eventEndStamp"]).month;
  var endDay =
      DateTime.fromMillisecondsSinceEpoch(e.data()["eventEndStamp"]).day;
  var startHour =
      DateTime.fromMillisecondsSinceEpoch(e.data()["eventStartTimestamp"]).hour;
  var startMin =
      DateTime.fromMillisecondsSinceEpoch(e.data()["eventStartTimestamp"])
          .minute;
  var endHour =
      DateTime.fromMillisecondsSinceEpoch(e.data()["eventEndStamp"]).hour;
  var endMin =
      DateTime.fromMillisecondsSinceEpoch(e.data()["eventEndStamp"]).minute;

  if (startDay + startYear + startMonth == endYear + endMonth + endDay) {
    var date = "$startMonth-$startDay-$startYear";
    var time =
        " from $startHour:${minuteSyntax(startMin)} to $endHour:${minuteSyntax(endMin)}";
    print(date + time);
    return date + time;
  } else {
    var start =
        "$startMonth-$startDay-$startYear: $startHour:${minuteSyntax(startMin)} ";
    var end =
        "$endMonth-$endDay-$endYear: $endHour:${minuteSyntax(endMin)}";
    print(start + " - " + end);
    return start + " - " + end;
  }
}

minuteSyntax(int x) {
  if (x == 0) {
    return x.toString() + "0";
  } else {
    return x.toString();
  }
}

getArticleChips(a) {
  if (a.data()["catMinor"].length > 0) {
    var list = <Widget>[];
    for (String chip in a.data()["catMinor"]) {
      list.add(Chip(label: Text(chip)));
    }
    return list;
  } else if (a.data()["eventChips"].length == 0) {
    return <Widget>[];
  }
}

getEventChips(e) {
  if (e.data()["eventChips"].length > 0) {
    var list = <Widget>[];
    for (String chip in e.data()["eventChips"]) {
      list.add(Chip(label: Text(chip)));
    }
    return list;
  } else if (e.data()["eventChips"].length == 0) {
    return <Widget>[];
  }
}

getColor(s) {
  switch (s) {
    case "sports":
      {
        return Colors.blue[300];
      }
      break;
    case "news":
      {
        return Colors.green[300];
      }
      break;
    case "emergency":
      {
        return Colors.red[200];
      }
    case "announcements":
      {
        return Colors.yellow[200];
      }
  }
}

capitalize(s) {
  s = s[0].toUpperCase() + s.substring(1);
  return s;
}
/*await cloud.listAll().then((results) {
    results.items.forEach((item) {
      item.getDownloadURL().then((url) {
        urlList.add(url);
      });
    });

    return urlList;
  });*/

/*    results.getItems();
    results.getItems((img)=>
    {img.getDownloadUrl().then(url {
      urlList.add(url)
    })
    });
    m = Image.network(
      downloadUrl.toString(),
      fit: BoxFit.scaleDown,
    );*/

//Text(snapshot.data[index].doc["articleTitle"])
