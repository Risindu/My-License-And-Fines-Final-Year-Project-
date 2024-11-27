import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class IssuedFinesPage extends StatefulWidget {
  @override
  _IssuedFinesPageState createState() => _IssuedFinesPageState();
}

class _IssuedFinesPageState extends State<IssuedFinesPage> {
  List<Map<String, dynamic>> fines = [];
  bool isLoading = true;
  int? officerId;

  @override
  void initState() {
    super.initState();
    _loadOfficerIdAndFetchFines();
  }

  Future<void> _loadOfficerIdAndFetchFines() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      officerId = prefs.getInt('officer_id');
    });
    if (officerId != null) {
      await fetchIssuedFines(officerId!);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Officer ID not found. Please login again.')),
      );
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> fetchIssuedFines(int officerId) async {
    final url = 'http://192.168.130.85:5000/api/auth/officer/$officerId/issued-fines';

    try {
      final response = await http.get(Uri.parse(url));

      if (response.statusCode == 200) {
        setState(() {
          fines = List<Map<String, dynamic>>.from(json.decode(response.body));
          isLoading = false;
        });
      } else {
        setState(() {
          isLoading = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load issued fines')),
        );
      }
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Issued Fines"),
        backgroundColor: Color(0xFF1D6BE6),
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF1D6BE6), Color(0xFF0A4F8B)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: isLoading
            ? Center(child: CircularProgressIndicator())
            : fines.isEmpty
            ? Center(
          child: Text(
            "No fines issued yet.",
            style: TextStyle(color: Colors.white70, fontSize: 18),
          ),
        )
            : ListView.builder(
          padding: EdgeInsets.all(20),
          itemCount: fines.length,
          itemBuilder: (context, index) {
            final fine = fines[index];
            return Card(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(15),
              ),
              color: Colors.white.withOpacity(0.9),
              margin: EdgeInsets.symmetric(vertical: 10),
              child: ListTile(
                title: Text(
                  "Fine ID: ${fine['fine_id']}",
                  style: TextStyle(color: Colors.blueGrey),
                ),
                subtitle: Text(
                  "Date: ${fine['date']} \nAmount: LKR ${fine['amount']}\nCategory: ${fine['category']}\nStatus: ${fine['status']}",
                ),
                isThreeLine: true,
              ),
            );
          },
        ),
      ),
    );
  }
}
