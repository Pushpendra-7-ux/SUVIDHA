import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../config/theme.dart';
import '../../config/routes.dart';
import '../../providers/complaint_provider.dart';

class QrCodeScreen extends StatefulWidget {
  const QrCodeScreen({super.key});
  @override
  State<QrCodeScreen> createState() => _QrCodeScreenState();
}

class _QrCodeScreenState extends State<QrCodeScreen> {
  String _qrData = '';

  @override
  void initState() {
    super.initState();
    _generateQr();
  }

  void _generateQr() {
    final cp = Provider.of<ComplaintProvider>(context, listen: false);
    final c = cp.currentComplaint;
    if (c == null) return;
    final payload = {
      'id': c.id, 'type': c.issueType, 'dept': c.department,
      'priority': c.priority, 'lat': c.latitude, 'lng': c.longitude,
      'ts': DateTime.now().millisecondsSinceEpoch,
    };
    setState(() => _qrData = jsonEncode(payload));
    cp.setQrData(_qrData);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: UrbanTheme.backgroundLight,
      appBar: AppBar(title: const Text('QR Code')),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white, borderRadius: BorderRadius.circular(16),
                  boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 12)],
                ),
                child: Column(children: [
                  if (_qrData.isNotEmpty)
                    QrImageView(
                      data: _qrData,
                      version: QrVersions.auto,
                      size: 220,
                      backgroundColor: Colors.white,
                      foregroundColor: UrbanTheme.primaryNavyDark,
                    ),
                  const SizedBox(height: 20),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: UrbanTheme.success.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text('Ready to scan', style: GoogleFonts.poppins(
                      fontSize: 13, fontWeight: FontWeight.w600, color: UrbanTheme.success)),
                  ),
                ]),
              ),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: UrbanTheme.info.withValues(alpha: 0.06),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: UrbanTheme.info.withValues(alpha: 0.15)),
                ),
                child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  const Icon(Icons.info_outline_rounded, size: 20, color: UrbanTheme.info),
                  const SizedBox(width: 12),
                  Expanded(child: Text(
                    'Go to kiosk → Select Complaint → Scan this QR',
                    style: GoogleFonts.poppins(fontSize: 13, color: UrbanTheme.info, height: 1.4),
                  )),
                ]),
              ),
              const Spacer(),
              SizedBox(width: double.infinity, height: 50,
                child: OutlinedButton.icon(
                  onPressed: () => setState(() => _generateQr()),
                  icon: const Icon(Icons.refresh_rounded),
                  label: Text('Regenerate QR', style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
                )),
              const SizedBox(height: 12),
              SizedBox(width: double.infinity, height: 50,
                child: ElevatedButton(
                  onPressed: () async {
                    final cp = Provider.of<ComplaintProvider>(context, listen: false);
                    await cp.submitComplaint();
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Complaint submitted!')));
                      context.go(AppRoutes.home);
                    }
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: UrbanTheme.secondaryTeal),
                  child: Text('Done - Go Home', style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w600)),
                )),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
