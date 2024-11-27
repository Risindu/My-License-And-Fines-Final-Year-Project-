import 'package:flutter/material.dart';

class ChangePasswordPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Change Password"),
        backgroundColor: Color(0xFF1D6BE6),
      ),
      body: Center(
        child: Text(
          "Change Password Page",
          style: TextStyle(fontSize: 20),
        ),
      ),
    );
  }
}
