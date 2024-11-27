import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class OfficerSignupPage extends StatefulWidget {
  @override
  _OfficerSignupPageState createState() => _OfficerSignupPageState();
}

class _OfficerSignupPageState extends State<OfficerSignupPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _divisionIdController = TextEditingController();
  final TextEditingController _badgeNoController = TextEditingController();
  final TextEditingController _surnameController = TextEditingController();
  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _middleNameController = TextEditingController();
  final TextEditingController _lastNameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController();
  bool _obscurePassword = true;

  Future<void> _signUp() async {
    if (_formKey.currentState!.validate()) {
      final apiUrl = 'http://192.168.8.194:5000/api/auth/officer/signup';
      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': _usernameController.text,
          'division_id': _divisionIdController.text,
          'badge_no': _badgeNoController.text,
          'surname': _surnameController.text,
          'first_name': _firstNameController.text,
          'middle_name': _middleNameController.text,
          'last_name': _lastNameController.text,
          'password': _passwordController.text,
          'api_key': '123', // Replace with actual API key
        }),
      );

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Officer registered successfully!')),
        );
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Registration failed: ${response.body}')),
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
                      "Officer Signup",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 28.0,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 60),
                    _buildTextField(
                      controller: _usernameController,
                      hintText: 'Enter your username',
                      icon: Icons.person,
                      validator: (value) => value!.isEmpty ? 'Please enter username' : null,
                    ),
                    SizedBox(height: 20),
                    _buildTextField(
                      controller: _divisionIdController,
                      hintText: 'Enter your division ID',
                      icon: Icons.location_city,
                      validator: (value) => value!.isEmpty ? 'Please enter division ID' : null,
                    ),
                    SizedBox(height: 20),
                    _buildTextField(
                      controller: _badgeNoController,
                      hintText: 'Enter your badge number',
                      icon: Icons.badge,
                      validator: (value) => value!.isEmpty ? 'Please enter badge number' : null,
                    ),
                    SizedBox(height: 20),
                    _buildTextField(
                      controller: _surnameController,
                      hintText: 'Enter your surname',
                      icon: Icons.person_outline,
                      validator: (value) => value!.isEmpty ? 'Please enter surname' : null,
                    ),
                    SizedBox(height: 20),
                    _buildTextField(
                      controller: _firstNameController,
                      hintText: 'Enter your first name',
                      icon: Icons.person_outline,
                      validator: (value) => value!.isEmpty ? 'Please enter first name' : null,
                    ),
                    SizedBox(height: 20),
                    _buildTextField(
                      controller: _middleNameController,
                      hintText: 'Enter your middle name (optional)',
                      icon: Icons.person_outline,
                    ),
                    SizedBox(height: 20),
                    _buildTextField(
                      controller: _lastNameController,
                      hintText: 'Enter your last name',
                      icon: Icons.person_outline,
                      validator: (value) => value!.isEmpty ? 'Please enter last name' : null,
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
                    SizedBox(height: 20),
                    _buildTextField(
                      controller: _confirmPasswordController,
                      hintText: 'Confirm password',
                      icon: Icons.lock_outline,
                      obscureText: true,
                      validator: (value) => value != _passwordController.text ? 'Passwords do not match' : null,
                    ),
                    SizedBox(height: 30),
                    _buildSignupButton(),
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

  Widget _buildSignupButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: _signUp,
        style: ElevatedButton.styleFrom(
          backgroundColor: Color(0xFF92EC6D),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
          padding: EdgeInsets.symmetric(vertical: 18),
        ),
        child: Text(
          'Sign Up',
          style: TextStyle(color: Colors.black, fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
