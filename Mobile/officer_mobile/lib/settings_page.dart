import 'package:flutter/material.dart';
import 'update_profile.dart';
import 'officer_login.dart'; // Import the Login Page

class SettingsPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Settings"),
        backgroundColor: Color(0xFF1D6BE6),
      ),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF1D6BE6), Color(0xFF0A4F8B)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: ListView(
          padding: EdgeInsets.symmetric(vertical: 20, horizontal: 25),
          children: [
            _buildSettingsTile(
              context,
              icon: Icons.person,
              title: "Update Profile",
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => UpdateProfilePage()),
                );
              },
            ),
            _buildSettingsTile(
              context,
              icon: Icons.logout,
              title: "Logout",
              onTap: () {
                // Clear any saved user session here if necessary (e.g., SharedPreferences)
                // Navigate to Login page and clear the stack
                Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(builder: (context) => OfficerLoginPage()),
                      (route) => false,
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSettingsTile(BuildContext context, {required IconData icon, required String title, required VoidCallback onTap}) {
    return Card(
      color: Colors.white.withOpacity(0.9),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      child: ListTile(
        leading: Icon(icon, color: Colors.blue[800]),
        title: Text(
          title,
          style: TextStyle(color: Colors.blueGrey),
        ),
        onTap: onTap,
      ),
    );
  }
}
