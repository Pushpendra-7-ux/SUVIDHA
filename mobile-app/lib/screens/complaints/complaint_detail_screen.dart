import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/constants.dart';
import '../../providers/complaint_provider.dart';
import '../../widgets/status_badge.dart';
import '../../models/complaint.dart';

class ComplaintDetailScreen extends StatelessWidget {
  final String complaintId;
  const ComplaintDetailScreen({super.key, required this.complaintId});

  @override
  Widget build(BuildContext context) {
    final cp = Provider.of<ComplaintProvider>(context);
    final all = [...cp.complaints, ...cp.drafts];
    final c = all.where((x) => x.id == complaintId).firstOrNull;

    if (c == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Details')),
        body: const Center(child: Text('Complaint not found')),
      );
    }

    return Scaffold(
      backgroundColor: UrbanTheme.backgroundLight,
      appBar: AppBar(title: const Text('Complaint Details')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white, borderRadius: BorderRadius.circular(14),
                boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 8)],
              ),
              child: Row(children: [
                Container(
                  width: 52, height: 52,
                  decoration: BoxDecoration(
                    color: UrbanTheme.primaryNavy.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Center(child: Text(
                    AppConstants.issueIcons[c.issueType] ?? '📋',
                    style: const TextStyle(fontSize: 26))),
                ),
                const SizedBox(width: 14),
                Expanded(child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(AppConstants.issueLabels[c.issueType] ?? c.issueType,
                      style: GoogleFonts.poppins(fontSize: 17, fontWeight: FontWeight.w700)),
                    const SizedBox(height: 4),
                    Row(children: [
                      StatusBadge(status: c.status),
                      const SizedBox(width: 8),
                      PriorityIndicator(priority: c.priority),
                    ]),
                  ],
                )),
              ]),
            ),
            const SizedBox(height: 16),
            // Details
            _DetailCard(children: [
              _DetailRow(Icons.business_rounded, 'Department', c.department),
              _DetailRow(Icons.location_on_outlined, 'Location', c.address ?? 'N/A'),
              if (c.landmark != null && c.landmark!.isNotEmpty)
                _DetailRow(Icons.place_outlined, 'Landmark', c.landmark!),
              _DetailRow(Icons.calendar_today_rounded, 'Reported',
                '${c.createdAt.day}/${c.createdAt.month}/${c.createdAt.year}'),
            ]),
            const SizedBox(height: 16),
            // Description
            _DetailCard(children: [
              Text('Description', style: GoogleFonts.poppins(
                fontSize: 12, fontWeight: FontWeight.w600, color: UrbanTheme.textSecondary)),
              const SizedBox(height: 6),
              Text(c.description, style: GoogleFonts.poppins(fontSize: 14, height: 1.5)),
            ]),
            const SizedBox(height: 16),
            // Timeline
            if (c.timeline.isNotEmpty) ...[
              Text('Timeline', style: GoogleFonts.poppins(
                fontSize: 16, fontWeight: FontWeight.w600)),
              const SizedBox(height: 12),
              ...c.timeline.asMap().entries.map((entry) {
                final i = entry.key;
                final e = entry.value;
                final isLast = i == c.timeline.length - 1;
                return _TimelineItem(event: e, isLast: isLast);
              }),
            ],
          ],
        ),
      ),
    );
  }
}

class _DetailCard extends StatelessWidget {
  final List<Widget> children;
  const _DetailCard({required this.children});
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity, padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white, borderRadius: BorderRadius.circular(14),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 8)],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: children),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final IconData icon;
  final String label, value;
  const _DetailRow(this.icon, this.label, this.value);
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(children: [
        Icon(icon, size: 18, color: UrbanTheme.primaryNavy),
        const SizedBox(width: 12),
        Expanded(child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: GoogleFonts.poppins(fontSize: 11, color: UrbanTheme.textSecondary)),
            Text(value, style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w500)),
          ],
        )),
      ]),
    );
  }
}

class _TimelineItem extends StatelessWidget {
  final TimelineEvent event;
  final bool isLast;
  const _TimelineItem({required this.event, required this.isLast});

  @override
  Widget build(BuildContext context) {
    final colors = {
      'pending': UrbanTheme.accentAmber, 'accepted': UrbanTheme.info,
      'in_progress': UrbanTheme.secondaryTeal, 'resolved': UrbanTheme.success,
    };
    final color = colors[event.status] ?? UrbanTheme.textSecondary;

    return Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Column(children: [
        Container(width: 12, height: 12,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
        if (!isLast) Container(width: 2, height: 40, color: UrbanTheme.divider),
      ]),
      const SizedBox(width: 14),
      Expanded(child: Padding(
        padding: const EdgeInsets.only(bottom: 16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(event.message, style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w500)),
          Text('${event.timestamp.day}/${event.timestamp.month}/${event.timestamp.year}',
            style: GoogleFonts.poppins(fontSize: 11, color: UrbanTheme.textSecondary)),
        ]),
      )),
    ]);
  }
}
