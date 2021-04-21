import 'package:flutter/material.dart';
import 'package:testbuild2/articlesPage.dart';
import 'articlesPage.dart';
import 'eventsPage.dart';

class Home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.blueGrey[300],
      appBar: AppBar(
        title: Text('Capstone'),
        centerTitle: true,
        backgroundColor: Colors.blue[900],
      ),
      drawer: Theme(
        data: Theme.of(context).copyWith(
          // Set the transparency here
          canvasColor: Colors.blueGrey[
              900], //or any other color you want. e.g Colors.blue.withOpacity(0.5)
        ),
        child: Drawer(
          child: ListView(
            children: <Widget>[
              SizedBox(
                height: 150,
                child: DrawerHeader(
                  child: Align(
                    alignment: Alignment.center,
                    child: Text(
                      "Navigation",
                      style: TextStyle(
                        color: Colors.white,
                      ),
                    ),
                  ),
                  decoration: BoxDecoration(color: Colors.blueGrey[800]),
                ),
              ),
              ListTile(
                onTap: () {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (BuildContext context) => ArticlesPage()));
                },
                title: Text(
                  'Articles',
                  style: TextStyle(
                    color: Colors.white,
                  ),
                ),
              ),
              ListTile(
                onTap: () {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (BuildContext context) => EventsPage()));
                },
                title: Text(
                  'Events',
                  style: TextStyle(
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),

          // All other codes goes here.
        ),
      ),
      body: Column(
        //mainAxisAlignment: MainAxisAlignment.center,
        children: [

          Center(
            child: Padding(
              padding: const EdgeInsets.all(10.0),
              child: Card(
                  child: SizedBox(


                      child: Column(
                        children: [
                          Image(
                            fit: BoxFit.scaleDown,
                            width: MediaQuery.of(context).size.width * .5,
                            height: MediaQuery.of(context).size.height * .2,
                            image: AssetImage('assets/MSUB_logo_13-Aug-2019.png'),

                          ),

                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Center(
                                child: Text(
                                    "This is the mobile platform for my capstone project aimed at providing a new way to distribute news for MSUB.")),
                          ),
                          Padding(
                            padding: const EdgeInsets.fromLTRB(0,0,0,8.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: ElevatedButton(
                                      style: ButtonStyle(
                                        backgroundColor:
                                            MaterialStateProperty.all<Color>(
                                                Colors.amber[500]),
                                      ),
                                      onPressed: () {
                                        Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                                builder: (BuildContext context) =>
                                                    ArticlesPage()));
                                      },
                                      child: Text(
                                        "Article List",
                                      )),
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: ElevatedButton(
                                      style: ButtonStyle(
                                        backgroundColor:
                                            MaterialStateProperty.all<Color>(
                                                Colors.amber[500]),
                                      ),
                                      onPressed: () {
                                        Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                                builder: (BuildContext context) =>
                                                    EventsPage()));
                                      },
                                      child: Text(
                                        "Event List",
                                      )),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ))),
            ),
          ),
        ],
      ),
    );
  }
}
