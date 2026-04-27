import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/constants.dart';
import '../../config/routes.dart';
import '../../providers/complaint_provider.dart';
import '../../services/local_storage_service.dart';

class DraftsListScreen extends StatefulWidget {
  const DraftsListScreen({super.key});
  @override
  State<DraftsListScreen> createState() => _DraftsListScreenState();
}

class _DraftsListScreenState extends State<DraftsListScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ComplaintProvider>(context, listen: false).loadDrafts();
    });
  }

  void _uploadDraft(String draftId) {
    final cp = Provider.of<ComplaintProvider>(context, listen: false);
    cp.loadDraftForUpload(draftId);
    context.push(AppRoutes.qrScanner);
  }

  void _deleteDraft(String draftId) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text('Delete Draft', style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
        content: Text('Are you sure you want to delete this draft?', style: GoogleFonts.poppins()),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text('Cancel', style: GoogleFonts.poppins()),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(ctx);
              await _deleteAndReload(draftId);
            },
            style: ElevatedButton.styleFrom(backgroundColor: UrbanTheme.error),
            child: Text('Delete', style: GoogleFonts.poppins()),
          ),
        ],
      ),
    );
  }

  Future<void> _deleteAndReload(String draftId) async {
    await LocalStorageService.deleteDraft(draftId);
    if (mounted) {
      Provider.of<ComplaintProvider>(context, listen: false).loadDrafts();
      setState(() {});
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: UrbanTheme.backgroundLight,
      appBar: AppBar(title: const Text('Saved Drafts')),
      body: Consumer<ComplaintProvider>(
        builder: (context, cp, _) {
          final drafts = cp.drafts;

          if (drafts.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 100, height: 100,
                      decoration: BoxDecoration(
                        color: UrbanTheme.primaryNavy.withValues(alpha: 0.08),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.drafts_outlined, size: 48, color: UrbanTheme.primaryNavy),
                    ),
                    const SizedBox(height: 20),
                    Text('No Saved Drafts', style: GoogleFonts.poppins(
                      fontSize: 18, fontWeight: FontWeight.w600)),
                    const SizedBox(height: 8),
                    Text('Your draft complaints will appear here.\nReport an issue and save it as draft.',
                      style: GoogleFonts.poppins(fontSize: 13, color: UrbanTheme.textSecondary, height: 1.5),
                      textAlign: TextAlign.center),
                    const SizedBox(height: 24),
                    Semantics(
                      button: true,
                      label: 'Report a new issue',
                      child: SizedBox(
                        height: 48,
                        child: ElevatedButton.icon(
                          onPressed: () => context.push(AppRoutes.reportCapture),
                          icon: const Icon(Icons.camera_alt_rounded),
                          label: Text('Report Issue', style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: drafts.length,
            itemBuilder: (context, i) {
              final d = drafts[i];
              final priorityColor = d.priority == 'high' ? UrbanTheme.priorityHigh
                  : d.priority == 'medium' ? UrbanTheme.priorityMedium : UrbanTheme.priorityLow;

              return Semantics(
                label: '${AppConstants.issueLabels[d.issueType] ?? d.issueType} draft, ${d.department}, priority ${d.priority}',
                child: Container(
                  margin: const EdgeInsets.only(bottom: 14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: UrbanTheme.divider.withValues(alpha: 0.5)),
                    boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 8)],
                  ),
                  child: Column(
                    children: [
                      // Main content row
                      Padding(
                        padding: const EdgeInsets.all(14),
                        child: Row(
                          children: [
                            // Image thumbnail or icon
                            Container(
                              width: 56, height: 56,
                              decoration: BoxDecoration(
                                color: UrbanTheme.primaryNavy.withValues(alpha: 0.08),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: d.localImagePath != null && File(d.localImagePath!).existsSync()
                                ? ClipRRect(
                                    borderRadius: BorderRadius.circular(12),
                                    child: Image.file(File(d.localImagePath!), fit: BoxFit.cover),
                                  )
                                : Center(child: Text(
                                    AppConstants.issueIcons[d.issueType] ?? '📋',
                                    style: const TextStyle(fontSize: 26))),
                            ),
                            const SizedBox(width: 14),
                            Expanded(child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(AppConstants.issueLabels[d.issueType] ?? d.issueType,
                                  style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600)),
                                const SizedBox(height: 2),
                                Text(d.department, style: GoogleFonts.poppins(
                                  fontSize: 11, color: UrbanTheme.textSecondary)),
                                const SizedBox(height: 6),
                                Row(children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: priorityColor.withValues(alpha: 0.12),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Text(
                                      d.severity ?? AppConstants.priorityLabels[d.priority] ?? d.priority,
                                      style: GoogleFonts.poppins(fontSize: 10, fontWeight: FontWeight.w600, color: priorityColor)),
                                  ),
                                  const SizedBox(width: 8),
                                  Text(_formatDate(d.createdAt),
                                    style: GoogleFonts.poppins(fontSize: 10, color: UrbanTheme.textHint)),
                                ]),
                              ],
                            )),
                            // Delete button
                            IconButton(
                              icon: const Icon(Icons.delete_outline_rounded, size: 20),
                              color: UrbanTheme.textSecondary,
                              tooltip: 'Delete draft',
                              onPressed: () => _deleteDraft(d.id),
                            ),
                          ],
                        ),
                      ),
                      // Upload to Kiosk button
                      Container(
                        width: double.infinity,
                        decoration: BoxDecoration(
                          color: UrbanTheme.secondaryTeal.withValues(alpha: 0.06),
                          borderRadius: const BorderRadius.vertical(bottom: Radius.circular(14)),
                          border: Border(top: BorderSide(color: UrbanTheme.divider.withValues(alpha: 0.3))),
                        ),
                        child: Semantics(
                          button: true,
                          label: 'Upload this draft to kiosk via QR scan',
                          child: Material(
                            color: Colors.transparent,
                            child: InkWell(
                              borderRadius: const BorderRadius.vertical(bottom: Radius.circular(14)),
                              onTap: () => _uploadDraft(d.id),
                              child: Padding(
                                padding: const EdgeInsets.symmetric(vertical: 12),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    const Icon(Icons.qr_code_scanner_rounded,
                                      size: 18, color: UrbanTheme.secondaryTeal),
                                    const SizedBox(width: 8),
                                    Text('Upload to Kiosk', style: GoogleFonts.poppins(
                                      fontSize: 13, fontWeight: FontWeight.w600, color: UrbanTheme.secondaryTeal)),
                                    const SizedBox(width: 4),
                                    const Icon(Icons.arrow_forward_rounded,
                                      size: 16, color: UrbanTheme.secondaryTeal),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }

  String _formatDate(DateTime d) {
    final diff = DateTime.now().difference(d);
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays == 1) return 'Yesterday';
    if (diff.inDays < 7) return '${diff.inDays}d ago';
    return '${d.day}/${d.month}/${d.year}';
  }
}
