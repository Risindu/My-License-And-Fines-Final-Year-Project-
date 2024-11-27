import 'package:flutter/material.dart';
import 'officer_login.dart'; // Import login page

class OfficerGetStartedPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF1D6BE6), // Top gradient color
              Color(0xFF0A4F8B), // Bottom gradient color
            ],
          ),
        ),
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(vertical: 60),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                "Officer's Hub",
                style: TextStyle(
                  fontSize: 32.0,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              SizedBox(height: 10),
              CircleAvatar(
                radius: 100,
                backgroundImage: AssetImage('Images/officer_icon.png'), // Replace with actual officer image asset
                backgroundColor: Colors.white,
                onBackgroundImageError: (exception, stackTrace) {
                  print('Error loading image: $exception');
                },
              ),
              SizedBox(height: 20),
              Text(
                "Manage fines efficiently",
                style: TextStyle(
                  fontSize: 22.0,
                  color: Colors.white,
                ),
              ),
              SizedBox(height: 5),
              Text(
                "Scan, Issue, and Review Fines",
                style: TextStyle(
                  fontSize: 16.0,
                  color: Colors.white70,
                ),
              ),
              SizedBox(height: 40),
              ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => OfficerLoginPage()), // Navigate to login page
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFF92EC6D), // Button color
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30.0),
                  ),
                  padding: EdgeInsets.symmetric(horizontal: 50, vertical: 15),
                ),
                child: Text(
                  'Get Started',
                  style: TextStyle(
                    fontSize: 18.0,
                    color: Colors.black, // Black text for contrast
                  ),
                ),
              ),
              SizedBox(height: 20),
              Text(
                "Streamline your work as an officer",
                style: TextStyle(color: Colors.white70, fontSize: 16),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
