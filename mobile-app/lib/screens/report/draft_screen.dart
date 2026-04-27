import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/constants.dart';
import '../../config/routes.dart';
import '../../providers/complaint_provider.dart';

class DraftScreen extends StatelessWidget {
  const DraftScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final cp = Provider.of<ComplaintProvider>(context);
    final c = cp.currentComplaint;
    if (c == null) return const Scaffold(body: Center(child: Text('No complaint data')));

    final priorityColor = c.priority == 'high' ? UrbanTheme.priorityHigh
        : c.priority == 'medium' ? UrbanTheme.priorityMedium : UrbanTheme.priorityLow;

    return Scaffold(
      backgroundColor: UrbanTheme.backgroundLight,
      appBar: AppBar(title: const Text('Complaint Summary')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Image
              if (c.localImagePath != null)
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.file(File(c.localImagePath!),
                    height: 180, width: double.infinity, fit: BoxFit.cover),
                ),
              const SizedBox(height: 20),
              // Issue type header
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white, borderRadius: BorderRadius.circular(12),
                  boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 8)],
                ),
                child: Column(
                  children: [
                    _Row(label: 'Issue Type', value: AppConstants.issueLabels[c.issueType] ?? c.issueType,
                      icon: Text(AppConstants.issueIcons[c.issueType] ?? '📋', style: const TextStyle(fontSize: 20))),
                    const Divider(height: 24),
                    _Row(label: 'Department', value: c.department,
                      icon: const Icon(Icons.business_rounded, size: 18, color: UrbanTheme.primaryNavy)),
                    if (c.subDepartment != null && c.subDepartment!.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      Padding(
                        padding: const EdgeInsets.only(left: 30),
                        child: Text('Sub: ${c.subDepartment}', style: GoogleFonts.poppins(
                          fontSize: 11, color: UrbanTheme.textSecondary)),
                      ),
                    ],
                    const Divider(height: 24),
                    _Row(label: 'Severity', icon: Container(
                        width: 10, height: 10,
                        decoration: BoxDecoration(color: priorityColor, shape: BoxShape.circle)),
                      value: c.severity ?? AppConstants.priorityLabels[c.priority] ?? c.priority,
                      valueColor: priorityColor),
                    const Divider(height: 24),
                    _Row(label: 'Location', value: c.address ?? 'Not set',
                      icon: const Icon(Icons.location_on_outlined, size: 18, color: UrbanTheme.error)),
                    if (c.city != null && c.city!.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      Padding(
                        padding: const EdgeInsets.only(left: 30),
                        child: Text('${c.city}, ${c.state ?? ''} ${c.pincode ?? ''}', style: GoogleFonts.poppins(
                          fontSize: 11, color: UrbanTheme.textSecondary)),
                      ),
                    ],
                    if (c.landmark != null && c.landmark!.isNotEmpty) ...[
                      const SizedBox(height: 8),
                      _Row(label: 'Landmark', value: c.landmark!,
                        icon: const Icon(Icons.place_outlined, size: 18, color: UrbanTheme.textSecondary)),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 16),
              // Description
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white, borderRadius: BorderRadius.circular(12),
                  boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 8)],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Description', style: GoogleFonts.poppins(
                      fontSize: 12, fontWeight: FontWeight.w600, color: UrbanTheme.textSecondary)),
                    const SizedBox(height: 6),
                    Text(c.description, style: GoogleFonts.poppins(fontSize: 14, height: 1.5)),
                    if (c.extraNotes != null && c.extraNotes!.isNotEmpty) ...[
                      const SizedBox(height: 12),
                      Text('Notes', style: GoogleFonts.poppins(
                        fontSize: 12, fontWeight: FontWeight.w600, color: UrbanTheme.textSecondary)),
                      const SizedBox(height: 4),
                      Text(c.extraNotes!, style: GoogleFonts.poppins(fontSize: 13, color: UrbanTheme.textSecondary)),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 28),
              Row(children: [
                Expanded(child: Semantics(
                  button: true,
                  label: 'Save this complaint as a draft',
                  child: SizedBox(height: 50, child: OutlinedButton(
                    onPressed: () async {
                      final cp = Provider.of<ComplaintProvider>(context, listen: false);
                      await cp.saveDraft();
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Draft saved successfully')));
                        context.go(AppRoutes.home);
                      }
                    },
                    child: Text('Save Draft', style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
                  )),
                )),
                const SizedBox(width: 12),
                Expanded(child: Semantics(
                  button: true,
                  label: 'Proceed to upload to kiosk',
                  child: SizedBox(height: 50, child: ElevatedButton(
                    onPressed: () => context.push(AppRoutes.reportQrInstruction),
                    child: Text('Upload to Kiosk', style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
                  )),
                )),
              ]),
            ],
          ),
        ),
      ),
    );
  }
}

class _Row extends StatelessWidget {
  final String label, value;
  final Widget icon;
  final Color? valueColor;
  const _Row({required this.label, required this.value, required this.icon, this.valueColor});

  @override
  Widget build(BuildContext context) {
    return Row(children: [
      icon,
      const SizedBox(width: 12),
      Expanded(child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: GoogleFonts.poppins(fontSize: 11, color: UrbanTheme.textSecondary)),
          Text(value, style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600,
            color: valueColor ?? UrbanTheme.textPrimary)),
        ],
      )),
    ]);
  }
}
