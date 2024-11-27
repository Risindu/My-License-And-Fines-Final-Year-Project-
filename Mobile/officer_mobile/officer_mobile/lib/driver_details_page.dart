import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'issue_fine_page.dart';

class DriverDetailsPage extends StatefulWidget {
  final Map<String, dynamic> driverData;

  DriverDetailsPage({required this.driverData});

  @override
  _DriverDetailsPageState createState() => _DriverDetailsPageState();
}

class _DriverDetailsPageState extends State<DriverDetailsPage> {
  late Map<String, dynamic> driverData;

  @override
  void initState() {
    super.initState();
    driverData = widget.driverData;
  }

  Future<void> _fetchUpdatedDriverData() async {
    final driverId = driverData['driver_info']['driver_id'];
    final response = await http.get(Uri.parse('http://192.168.8.194:5000/api/driver/$driverId'));

    if (response.statusCode == 200) {
      setState(() {
        driverData = jsonDecode(response.body);
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to update driver data.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final Map<String, dynamic> driverInfo = driverData['driver_info'] ?? {};

    return Scaffold(
      appBar: AppBar(
        title: Text("Driver Details"),
        backgroundColor: Color(0xFF1D6BE6),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSectionTitle("Driver Information"),
            _buildDriverInfoCard(driverInfo),
            SizedBox(height: 20),
            _buildSectionTitle("Outstanding Fines"),
            _buildFinesList(driverData['fines'] ?? []),
            SizedBox(height: 30),
            Center(
              child: ElevatedButton(
                onPressed: () async {
                  final result = await Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => IssueFinePage(driverId: driverInfo['driver_id']),
                    ),
                  );
                  if (result == true) {
                    await _fetchUpdatedDriverData();
                  }
                },
                style: ElevatedButton.styleFrom(
                  padding: EdgeInsets.symmetric(vertical: 14.0, horizontal: 40.0),
                  backgroundColor: Color(0xFF92EC6D),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30.0),
                  ),
                ),
                child: Text(
                  "Issue New Fine",
                  style: TextStyle(color: Colors.black, fontSize: 16),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Section Title
  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Text(
        title,
        style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.blueGrey[800]),
      ),
    );
  }

  // Driver Info Card
  Widget _buildDriverInfoCard(Map<String, dynamic> driverInfo) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ListTile(
              leading: CircleAvatar(
                backgroundImage: NetworkImage(driverInfo['profile_picture'] ?? ''),
                radius: 30,
              ),
              title: Text(
                "${driverInfo['firstname'] ?? 'N/A'} ${driverInfo['last_name'] ?? 'N/A'}",
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
              ),
              subtitle: Text(driverInfo['license_number'] ?? 'N/A'),
            ),
            Divider(),
            _buildInfoRow(Icons.badge, "NIC", driverInfo['nic_number']),
            _buildInfoRow(Icons.event, "Date of Birth", driverInfo['date_of_birth']?.split('T')[0]),
            _buildLicenseStatusRow(driverInfo['license_status']),
            _buildInfoRow(Icons.location_pin, "Address", driverInfo['permanent_residence_address']),
            _buildInfoRow(Icons.calendar_today, "License Expiry", driverInfo['date_of_expiry']?.split('T')[0]),
          ],
        ),
      ),
    );
  }

  // Row for displaying driver information
  Widget _buildInfoRow(IconData icon, String title, dynamic value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        children: [
          Icon(icon, color: Colors.blue[700]),
          SizedBox(width: 10),
          Text(
            "$title: ",
            style: TextStyle(fontWeight: FontWeight.w600),
          ),
          Expanded(
            child: Text(
              value != null ? value.toString() : "N/A",
              style: TextStyle(color: Colors.blueGrey[600]),
            ),
          ),
        ],
      ),
    );
  }

  // Custom row for License Status with color coding
  Widget _buildLicenseStatusRow(String? status) {
    Color statusColor;
    String displayStatus = status ?? 'N/A';

    if (status == 'active') {
      statusColor = Colors.green;
    } else if (status == 'revoked') {
      statusColor = Colors.red;
    } else {
      statusColor = Colors.blueGrey[600]!;
    }

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        children: [
          Icon(Icons.person, color: Colors.blue[700]),
          SizedBox(width: 10),
          Text(
            "License Status: ",
            style: TextStyle(fontWeight: FontWeight.w600),
          ),
          Expanded(
            child: Text(
              displayStatus,
              style: TextStyle(color: statusColor),
            ),
          ),
        ],
      ),
    );
  }

  // Fines List with cards
  Widget _buildFinesList(List<dynamic> fines) {
    if (fines.isEmpty) {
      return Text("No outstanding fines.", style: TextStyle(fontSize: 16, color: Colors.blueGrey[400]));
    }
    return Column(
      children: fines.map((fine) {
        return Card(
          margin: const EdgeInsets.symmetric(vertical: 8),
          elevation: 2,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
          child: ListTile(
            title: Text("Fine ID: ${fine['fine_id']}"),
            subtitle: Text("Amount: ${fine['amount']} - Status: ${fine['status']}"),
            trailing: Text(
              fine['date']?.split('T')[0] ?? '',
              style: TextStyle(color: Colors.blueGrey[400]),
            ),
          ),
        );
      }).toList(),
    );
  }
}
