import 'package:flutter/material.dart';
import 'officer_get_started.dart'; // Import OfficerGetStartedPage

void main() {
  runApp(OfficerApp());
}

class OfficerApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: Color(0xFF1D6BE6),
        colorScheme: ColorScheme.fromSeed(seedColor: Color(0xFF1D6BE6)),
      ),
      home: OfficerGetStartedPage(), // Set OfficerGetStartedPage as the home page
    );
  }
}
