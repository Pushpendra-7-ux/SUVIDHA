import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/routes.dart';
import '../../providers/complaint_provider.dart';

class QrInstructionScreen extends StatelessWidget {
  const QrInstructionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: UrbanTheme.backgroundLight,
      appBar: AppBar(title: const Text('Kiosk Submission')),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const Spacer(),
              Container(
                width: 120, height: 120,
                decoration: BoxDecoration(
                  color: UrbanTheme.primaryNavy.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.qr_code_scanner_rounded, size: 56, color: UrbanTheme.primaryNavy),
              ),
              const SizedBox(height: 32),
              Text('Submit via Kiosk', style: GoogleFonts.poppins(
                fontSize: 24, fontWeight: FontWeight.w700), textAlign: TextAlign.center),
              const SizedBox(height: 12),
              Text('Visit a nearby kiosk and scan the QR code to submit.',
                style: GoogleFonts.poppins(fontSize: 15, color: UrbanTheme.textSecondary, height: 1.6),
                textAlign: TextAlign.center),
              const SizedBox(height: 32),
              _step('1', 'Go to the nearest URBAN kiosk'),
              const SizedBox(height: 12),
              _step('2', 'Select "Sync Complaint" on Kiosk'),
              const SizedBox(height: 12),
              _step('3', 'Scan the Kiosk QR with your phone'),
              const Spacer(),
              Semantics(
                button: true,
                label: 'Open QR Scanner to scan kiosk QR',
                child: SizedBox(width: double.infinity, height: 52,
                  child: ElevatedButton.icon(
                    onPressed: () => context.push(AppRoutes.qrScanner),
                    icon: const Icon(Icons.qr_code_scanner_rounded),
                    label: Text('Scan Kiosk QR', style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w600)),
                  )),
              ),
              const SizedBox(height: 12),
              SizedBox(width: double.infinity, height: 52,
                child: OutlinedButton.icon(
                  onPressed: () async {
                    final cp = Provider.of<ComplaintProvider>(context, listen: false);
                    await cp.saveDraft();
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Draft saved')));
                      context.go(AppRoutes.home);
                    }
                  },
                  icon: const Icon(Icons.save_outlined),
                  label: Text('Save Draft', style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w600)),
                )),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _step(String num, String text) {
    return Row(children: [
      Container(width: 32, height: 32,
        decoration: BoxDecoration(color: UrbanTheme.primaryNavy, borderRadius: BorderRadius.circular(8)),
        child: Center(child: Text(num, style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.w700)))),
      const SizedBox(width: 14),
      Expanded(child: Text(text, style: GoogleFonts.poppins(fontSize: 14))),
    ]);
  }
}
