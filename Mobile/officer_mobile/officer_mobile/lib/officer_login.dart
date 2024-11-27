import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart'; // Import SharedPreferences
import 'signup_officer.dart';
import 'landing_page.dart'; // Import Officer Landing Page

class OfficerLoginPage extends StatefulWidget {
  @override
  _OfficerLoginPageState createState() => _OfficerLoginPageState();
}

class _OfficerLoginPageState extends State<OfficerLoginPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _obscurePassword = true;

  Future<void> _login() async {
    if (_formKey.currentState!.validate()) {
      final apiUrl = 'http://192.168.8.194:5000/api/auth/officer/login';
      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': _emailController.text,
          'password': _passwordController.text,
          'api_key': '123', // Use actual API key here
        }),
      );

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);

        // Save officer ID and token in SharedPreferences
        final prefs = await SharedPreferences.getInstance();
        await prefs.setInt('officer_id', responseData['officer_id']); // Save as an integer
        await prefs.setString('token', responseData['token']);

        // Navigate to Officer Landing Page with officer ID and name
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => OfficerLandingPage(
              officerName: responseData['username'],
              officerId: responseData['officer_id'],
            ),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Login failed: ${response.body}')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF1D6BE6), Color(0xFF0A4F8B)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 25),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    Text(
                      "Officer Login",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 28.0,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 60),
                    _buildTextField(
                      controller: _emailController,
                      hintText: 'Enter your username',
                      icon: Icons.person,
                      validator: (value) => value!.isEmpty ? 'Please enter username' : null,
                    ),
                    SizedBox(height: 20),
                    _buildTextField(
                      controller: _passwordController,
                      hintText: 'Enter your password',
                      icon: Icons.lock,
                      obscureText: _obscurePassword,
                      validator: (value) => value!.length < 6 ? 'Password too short' : null,
                      suffixIcon: IconButton(
                        icon: Icon(_obscurePassword ? Icons.visibility : Icons.visibility_off),
                        onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                      ),
                    ),
                    SizedBox(height: 30),
                    _buildLoginButton(),
                    SizedBox(height: 20),
                    GestureDetector(
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => OfficerSignupPage()),
                      ),
                      child: Text(
                        "Don’t have an account? Sign up",
                        style: TextStyle(color: Colors.white70),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hintText,
    required IconData icon,
    bool obscureText = false,
    String? Function(String?)? validator,
    Widget? suffixIcon,
  }) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      validator: validator,
      decoration: InputDecoration(
        filled: true,
        fillColor: Colors.white.withOpacity(0.1),
        prefixIcon: Icon(icon, color: Colors.white),
        hintText: hintText,
        hintStyle: TextStyle(color: Colors.white70),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(15),
          borderSide: BorderSide.none,
        ),
        suffixIcon: suffixIcon,
      ),
    );
  }

  Widget _buildLoginButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: _login,
        style: ElevatedButton.styleFrom(
          backgroundColor: Color(0xFF92EC6D),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
          padding: EdgeInsets.symmetric(vertical: 18),
        ),
        child: Text(
          'Login',
          style: TextStyle(color: Colors.black, fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
