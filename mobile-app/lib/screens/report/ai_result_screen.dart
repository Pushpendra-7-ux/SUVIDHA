import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/constants.dart';
import '../../config/routes.dart';
import '../../providers/complaint_provider.dart';

class AiResultScreen extends StatefulWidget {
  const AiResultScreen({super.key});
  @override
  State<AiResultScreen> createState() => _AiResultScreenState();
}

class _AiResultScreenState extends State<AiResultScreen> {
  late TextEditingController _descController;
  late TextEditingController _notesController;
  String? _selectedIssue;
  String? _selectedPriority;

  @override
  void initState() {
    super.initState();
    final cp = Provider.of<ComplaintProvider>(context, listen: false);
    _descController = TextEditingController(text: cp.currentComplaint?.description ?? '');
    _notesController = TextEditingController(text: cp.currentComplaint?.extraNotes ?? '');
    _selectedIssue = cp.currentComplaint?.issueType;
    _selectedPriority = cp.currentComplaint?.priority;
  }

  @override
  void dispose() { _descController.dispose(); _notesController.dispose(); super.dispose(); }

  void _proceed() {
    final cp = Provider.of<ComplaintProvider>(context, listen: false);
    cp.updateComplaintFields(
      issueType: _selectedIssue, description: _descController.text,
      priority: _selectedPriority, extraNotes: _notesController.text,
    );
    context.push(AppRoutes.reportLocation);
  }

  @override
  Widget build(BuildContext context) {
    final cp = Provider.of<ComplaintProvider>(context);
    final complaint = cp.currentComplaint;
    final confidence = complaint?.confidenceScore ?? 0;

    return Scaffold(
      backgroundColor: UrbanTheme.backgroundLight,
      appBar: AppBar(title: const Text('Analysis Result')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Image preview
              if (complaint?.localImagePath != null)
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.file(File(complaint!.localImagePath!),
                    height: 180, width: double.infinity, fit: BoxFit.cover),
                ),
              const SizedBox(height: 20),
              // Detection result card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: UrbanTheme.secondaryTeal.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: UrbanTheme.secondaryTeal.withValues(alpha: 0.2)),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: UrbanTheme.secondaryTeal.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(AppConstants.issueIcons[complaint?.issueType] ?? '📋',
                        style: const TextStyle(fontSize: 28)),
                    ),
                    const SizedBox(width: 14),
                    Expanded(child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Detected Issue', style: GoogleFonts.poppins(
                          fontSize: 11, color: UrbanTheme.textSecondary)),
                        Text(AppConstants.issueLabels[complaint?.issueType] ?? 'Unknown',
                          style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w700)),
                      ],
                    )),
                    const Icon(Icons.check_circle_rounded, color: UrbanTheme.secondaryTeal, size: 28),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              // Confidence & Priority row
              Row(children: [
                Expanded(child: _InfoChip(
                  label: 'Confidence', value: '${(confidence * 100).toInt()}%',
                  color: confidence > 0.8 ? UrbanTheme.success : UrbanTheme.accentAmber,
                )),
                const SizedBox(width: 10),
                Expanded(child: _InfoChip(
                  label: 'Department',
                  value: AppConstants.issueToDepartment[_selectedIssue]?.split(' ').first ?? 'General',
                  color: UrbanTheme.primaryNavy,
                )),
              ]),
              const SizedBox(height: 24),
              // Editable: Issue Type
              Text('Issue Type', style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600)),
              const SizedBox(height: 6),
              DropdownButtonFormField<String>(
                value: _selectedIssue,
                decoration: const InputDecoration(),
                items: AppConstants.issueTypes.map((t) => DropdownMenuItem(
                  value: t, child: Text(AppConstants.issueLabels[t] ?? t),
                )).toList(),
                onChanged: (v) => setState(() {
                  _selectedIssue = v;
                }),
              ),
              const SizedBox(height: 16),
              // Priority
              Text('Priority', style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600)),
              const SizedBox(height: 6),
              Row(children: AppConstants.priorities.map((p) {
                final selected = _selectedPriority == p;
                final color = p == 'low' ? UrbanTheme.priorityLow
                    : p == 'medium' ? UrbanTheme.priorityMedium : UrbanTheme.priorityHigh;
                return Expanded(child: Padding(
                  padding: EdgeInsets.only(right: p != 'high' ? 8 : 0),
                  child: GestureDetector(
                    onTap: () => setState(() => _selectedPriority = p),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      decoration: BoxDecoration(
                        color: selected ? color.withValues(alpha: 0.15) : Colors.white,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: selected ? color : UrbanTheme.divider, width: selected ? 2 : 1),
                      ),
                      child: Center(child: Text(AppConstants.priorityLabels[p] ?? p,
                        style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600, color: color))),
                    ),
                  ),
                ));
              }).toList()),
              const SizedBox(height: 16),
              // Description
              Text('Description', style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600)),
              const SizedBox(height: 6),
              TextFormField(
                controller: _descController, maxLines: 4,
                style: GoogleFonts.poppins(fontSize: 14),
                decoration: const InputDecoration(hintText: 'AI-generated description (editable)'),
              ),
              const SizedBox(height: 16),
              // Extra notes
              Text('Extra Notes', style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600)),
              const SizedBox(height: 6),
              TextFormField(
                controller: _notesController, maxLines: 2,
                style: GoogleFonts.poppins(fontSize: 14),
                decoration: const InputDecoration(hintText: 'Add any extra notes...'),
              ),
              const SizedBox(height: 28),
              SizedBox(width: double.infinity, height: 52,
                child: ElevatedButton(
                  onPressed: _proceed,
                  child: Text('Confirm & Set Location', style: GoogleFonts.poppins(
                    fontSize: 15, fontWeight: FontWeight.w600)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final String label, value;
  final Color color;
  const _InfoChip({required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(children: [
        Text(label, style: GoogleFonts.poppins(fontSize: 11, color: UrbanTheme.textSecondary)),
        const SizedBox(height: 2),
        Text(value, style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w700, color: color)),
      ]),
    );
  }
}
