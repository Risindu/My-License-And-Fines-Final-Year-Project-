import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'scan_qr_page.dart';
import 'issued_fines_page.dart';
import 'settings_page.dart';

class OfficerLandingPage extends StatefulWidget {
  final String officerName;
  final int officerId;

  OfficerLandingPage({required this.officerName, required this.officerId});

  @override
  _OfficerLandingPageState createState() => _OfficerLandingPageState();
}

class _OfficerLandingPageState extends State<OfficerLandingPage> {
  late Future<Map<String, dynamic>> officerData;

  @override
  void initState() {
    super.initState();
    _loadOfficerData();
  }

  void _loadOfficerData() {
    officerData = fetchOfficerData();
  }

  Future<Map<String, dynamic>> fetchOfficerData() async {
    final response = await http.get(
      Uri.parse('http://192.168.8.194:5000/api/auth/officer/landing/${widget.officerId}'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      print("Data received: $data"); // Debug print to verify data structure
      return data;
    } else {
      throw Exception('Failed to load officer data');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Color(0xFF1D6BE6),
        elevation: 0,
      ),
      body: FutureBuilder<Map<String, dynamic>>(
        future: officerData,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(child: Text("No data available."));
          } else {
            final data = snapshot.data!;
            return buildLandingPageContent(context, data);
          }
        },
      ),
    );
  }

  Widget buildLandingPageContent(BuildContext context, Map<String, dynamic> data) {
    return Container(
      width: double.infinity,
      height: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF1D6BE6), Color(0xFF0A4F8B)],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
      ),
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 20),
          child: Column(
            children: <Widget>[
              _buildWelcomeBanner(),
              SizedBox(height: 30),
              _buildStatisticsSection(data),
              SizedBox(height: 30),
              _buildQuickAccessSection(context),
              SizedBox(height: 30),
              _buildRecentActivity(data['recent_activity']),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildWelcomeBanner() {
    return Stack(
      children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.9),
            borderRadius: BorderRadius.circular(15),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 8,
                spreadRadius: 2,
                offset: Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            children: [
              Icon(Icons.security, color: Color(0xFF1D6BE6), size: 40),
              SizedBox(height: 10),
              Text(
                "Welcome, Officer ${widget.officerName}!",
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.blue[900],
                  fontSize: 26,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.2,
                  shadows: [
                    Shadow(
                      blurRadius: 4.0,
                      color: Colors.black.withOpacity(0.15),
                      offset: Offset(1, 2),
                    ),
                  ],
                ),
              ),
              SizedBox(height: 5),
              Text(
                "Dedicated to serving with integrity",
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.blue[600],
                  fontSize: 16,
                  fontWeight: FontWeight.w400,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStatisticsSection(Map<String, dynamic> data) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _buildStatCard("Total Fines", data['total_fines'].toString(), Icons.assignment),
        _buildStatCard("Fines Today", data['fines_today'].toString(), Icons.today),
        _buildStatCard("Pending Cases", data.containsKey('pending_cases') ? data['pending_cases'].toString() : '0', Icons.pending_actions),
      ],
    );
  }

  Widget _buildStatCard(String title, String count, IconData icon) {
    return Expanded(
      child: Card(
        color: Colors.white.withOpacity(0.9),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        child: Padding(
          padding: const EdgeInsets.all(15.0),
          child: Column(
            children: [
              Icon(icon, size: 30, color: Color(0xFF1D6BE6)),
              SizedBox(height: 10),
              Text(
                count,
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.blue[800]),
              ),
              SizedBox(height: 5),
              Text(title, style: TextStyle(fontSize: 14, color: Colors.blueGrey)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuickAccessSection(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: <Widget>[
        _buildActionCard(
          context,
          'Scan QR',
          Icons.qr_code_scanner,
          ScanQrPage(),
        ),
        _buildActionCard(
          context,
          'Issued Fines',
          Icons.assignment,
          IssuedFinesPage(),
        ),
        _buildActionCard(
          context,
          'Settings',
          Icons.settings,
          SettingsPage(),
        ),
      ],
    );
  }

  Widget _buildActionCard(BuildContext context, String title, IconData icon, Widget page) {
    return InkWell(
      onTap: () {
        Navigator.push(context, MaterialPageRoute(builder: (context) => page)).then((_) {
          setState(() {
            _loadOfficerData(); // Refresh data when coming back
          });
        });
      },
      child: Column(
        children: [
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(15),
              boxShadow: [
                BoxShadow(
                  color: Colors.black12,
                  blurRadius: 6,
                  offset: Offset(0, 3),
                ),
              ],
            ),
            padding: EdgeInsets.all(15),
            child: Icon(icon, size: 35, color: Color(0xFF1D6BE6)),
          ),
          SizedBox(height: 8),
          Text(
            title,
            style: TextStyle(
              color: Colors.white,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentActivity(List<dynamic> activities) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Recent Activity",
          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 15),
        ...activities.map((activity) => _buildActivityCard(
          "Issued fine #${activity['fine_id']}",
          activity['date'],
        )).toList(),
      ],
    );
  }

  Widget _buildActivityCard(String activity, String time) {
    return Card(
      color: Colors.white.withOpacity(0.9),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      child: ListTile(
        leading: Icon(Icons.history, color: Color(0xFF1D6BE6)),
        title: Text(activity, style: TextStyle(color: Colors.blueGrey)),
        subtitle: Text(time),
      ),
    );
  }
}
