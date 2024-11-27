import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'package:geolocator/geolocator.dart';
import 'dart:convert';

class IssueFinePage extends StatefulWidget {
  final int driverId;

  IssueFinePage({required this.driverId});

  @override
  _IssueFinePageState createState() => _IssueFinePageState();
}

class _IssueFinePageState extends State<IssueFinePage> {
  String? selectedViolation;
  TextEditingController amountController = TextEditingController();
  TextEditingController descriptionController = TextEditingController();
  int? officerId;
  Position? officerPosition;

  final Map<String, String> violationCategories = {
    "Driving without a valid fitness certificate": "4000",
    "Driving without registration": "10000",
    "Driving without a license": "10000",
    "Driving without insurance": "20000",
    "Driving with incorrect number plates": "10000",
    "Using electronic devices while driving": "10000",
    "Driving under the influence of alcohol or drugs": "25000",
    "Allowing an unlicensed person to drive": "15000",
    "Reckless driving without causing an accident": "11000",
    "Causing an accident due to careless driving": "25000",
    "Not wearing a seat belt": "2000",
    "Passengers not wearing seat belts": "2000",
    "Honking in silent zones": "5000",
    "Failure to obey traffic signs": "10000",
    "Overtaking on the left": "5000",
    "Exceeding the speed limit by 16-32 km/h": "12000",
    "Exceeding the speed limit by 33-49 km/h": "20000",
    "Exceeding the speed limit by 50 km/h or more": "30000",
    "Failure to obey traffic signals": "10000",
    "Obstructing the free passage of vehicles": "5000",
    "Using a mobile phone while driving": "10000",
    "Driving without a valid insurance cover": "25000",
    "Entering a railway crossing negligently": "25000",
  };

  @override
  void initState() {
    super.initState();
    _loadOfficerId();
    _getOfficerLocation();
  }

  Future<void> _loadOfficerId() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      officerId = prefs.getInt('officer_id');
    });
  }

  Future<void> _getOfficerLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Location services are disabled. Please enable them.')),
      );
      return;
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Location permissions are denied.')),
        );
        return;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Location permissions are permanently denied.')),
      );
      return;
    }

    final position = await Geolocator.getCurrentPosition();
    setState(() {
      officerPosition = position;
    });
  }

  Future<void> _issueFine() async {
    if (officerId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Officer ID not found. Please login again.')),
      );
      return;
    }
    if (officerPosition == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Unable to retrieve officer location.')),
      );
      return;
    }

    final apiUrl = 'http://192.168.8.194:5000/api/auth/officer/issue-fine';
    final fineData = {
      'officer_id': officerId,
      'driver_id': widget.driverId,
      'amount': amountController.text,
      'description': descriptionController.text,
      'category': selectedViolation,
      'latitude': officerPosition!.latitude,
      'longitude': officerPosition!.longitude,
    };

    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(fineData),
      );

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Fine issued successfully!')),
        );
        Navigator.pop(context, true); // Pass true to trigger landing page refresh
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to issue fine: ${response.body}')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    }
  }

  Future<void> _showConfirmationDialog() async {
    final shouldSubmit = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Confirm Submission'),
        content: Text('Are you sure you want to issue this fine?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            child: Text('Confirm'),
          ),
        ],
      ),
    );

    if (shouldSubmit == true) {
      _issueFine();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Issue Fine"),
        backgroundColor: Color(0xFF1D6BE6),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Select Violation",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 10),
            Container(
              padding: EdgeInsets.only(right: 5),
              child: DropdownButtonFormField<String>(
                value: selectedViolation,
                items: violationCategories.keys.map((String category) {
                  return DropdownMenuItem<String>(
                    value: category,
                    child: Text(
                      category,
                      overflow: TextOverflow.ellipsis,
                    ),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    selectedViolation = value;
                    amountController.text = violationCategories[value] ?? '';
                  });
                },
                decoration: InputDecoration(
                  border: OutlineInputBorder(),
                  contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                ),
                hint: Text("Select a violation category"),
                isExpanded: true,
              ),
            ),
            SizedBox(height: 20),
            Text(
              "Fine Amount (LKR)",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 10),
            TextFormField(
              controller: amountController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                hintText: "Enter or modify amount",
              ),
            ),
            SizedBox(height: 20),
            Text(
              "Description",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 10),
            TextFormField(
              controller: descriptionController,
              maxLines: 3,
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                hintText: "Enter any additional details",
              ),
            ),
            SizedBox(height: 30),
            Center(
              child: ElevatedButton(
                onPressed: _showConfirmationDialog,
                style: ElevatedButton.styleFrom(
                  padding: EdgeInsets.symmetric(vertical: 14.0, horizontal: 40.0),
                  backgroundColor: Color(0xFF92EC6D),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30.0),
                  ),
                ),
                child: Text(
                  "Issue Fine",
                  style: TextStyle(color: Colors.black, fontSize: 16),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
