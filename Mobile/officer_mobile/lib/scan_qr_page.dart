import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'driver_details_page.dart'; // Import the new details page

class ScanQrPage extends StatefulWidget {
  @override
  _ScanQrPageState createState() => _ScanQrPageState();
}

class _ScanQrPageState extends State<ScanQrPage> {
  bool isProcessing = false;

  Future<void> sendQrDataToBackend(String qrData) async {
    try {
      final apiUrl = 'http://192.168.130.85:5000/api/auth/officer/process-qr';
      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'qr_data': qrData}),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = jsonDecode(response.body);
        // Navigate to DriverDetailsPage with the retrieved driver data
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => DriverDetailsPage(driverData: responseData),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('QR processing failed: ${response.body}')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Scan QR Code"),
        backgroundColor: Color(0xFF1D6BE6),
      ),
      body: Column(
        children: [
          Expanded(
            flex: 5,
            child: MobileScanner(
              onDetect: (capture) async {
                final List<Barcode> barcodes = capture.barcodes;
                for (final barcode in barcodes) {
                  final String? code = barcode.rawValue;
                  if (code != null && !isProcessing) {
                    setState(() => isProcessing = true);
                    await sendQrDataToBackend(code);
                    setState(() => isProcessing = false);
                  }
                }
              },
            ),
          ),
          Expanded(
            flex: 1,
            child: Center(
              child: ElevatedButton.icon(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFF92EC6D),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                  padding: EdgeInsets.symmetric(horizontal: 50, vertical: 15),
                ),
                icon: Icon(Icons.qr_code_scanner, color: Colors.black),
                label: Text(
                  'Scan QR Code',
                  style: TextStyle(color: Colors.black, fontSize: 18),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
