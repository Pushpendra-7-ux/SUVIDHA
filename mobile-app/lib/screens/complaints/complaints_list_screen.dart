import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/constants.dart';
import '../../config/routes.dart';
import '../../providers/complaint_provider.dart';
import '../../widgets/status_badge.dart';

class ComplaintsListScreen extends StatefulWidget {
  const ComplaintsListScreen({super.key});
  @override
  State<ComplaintsListScreen> createState() => _ComplaintsListScreenState();
}

class _ComplaintsListScreenState extends State<ComplaintsListScreen> {
  String _statusFilter = 'all';
  String _deptFilter = 'All';

  @override
  Widget build(BuildContext context) {
    final cp = Provider.of<ComplaintProvider>(context);
    final all = [...cp.complaints, ...cp.drafts];
    
    // Apply filters
    final filtered = all.where((c) {
      final matchStatus = _statusFilter == 'all' || c.status == _statusFilter;
      final matchDept = _deptFilter == 'All' || c.department == _deptFilter || c.kioskCategory == _deptFilter;
      return matchStatus && matchDept;
    }).toList();

    return Scaffold(
      backgroundColor: UrbanTheme.backgroundLight,
      appBar: AppBar(title: const Text('My Complaints')),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Status Filters
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
            child: Row(
              children: ['all', 'pending', 'in_progress', 'resolved', 'draft'].map((s) {
                final selected = _statusFilter == s;
                final label = s == 'all' ? 'All Status' : (AppConstants.statusLabels[s] ?? s);
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: Semantics(
                    button: true,
                    selected: selected,
                    label: 'Filter by status: $label',
                    child: FilterChip(
                      label: Text(label),
                      selected: selected,
                      onSelected: (_) => setState(() => _statusFilter = s),
                      selectedColor: UrbanTheme.primaryNavy.withValues(alpha: 0.15),
                      checkmarkColor: UrbanTheme.primaryNavy,
                      labelStyle: GoogleFonts.poppins(
                        fontSize: 12, fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                        color: selected ? UrbanTheme.primaryNavy : UrbanTheme.textSecondary,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          
          // Department Filters
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 12),
            child: Row(
              children: ['All', ...AppConstants.kioskDepartments].map((dept) {
                final selected = _deptFilter == dept;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: Semantics(
                    button: true,
                    selected: selected,
                    label: 'Filter by department: $dept',
                    child: FilterChip(
                      label: Text(dept),
                      selected: selected,
                      onSelected: (_) => setState(() => _deptFilter = dept),
                      selectedColor: UrbanTheme.secondaryTeal.withValues(alpha: 0.15),
                      checkmarkColor: UrbanTheme.secondaryTeal,
                      backgroundColor: Colors.white,
                      side: BorderSide(color: selected ? UrbanTheme.secondaryTeal : UrbanTheme.divider),
                      labelStyle: GoogleFonts.poppins(
                        fontSize: 11, fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                        color: selected ? UrbanTheme.secondaryTeal : UrbanTheme.textSecondary,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),

          // List
          Expanded(
            child: filtered.isEmpty
              ? Center(child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.inbox_rounded, size: 64, color: UrbanTheme.divider),
                    const SizedBox(height: 12),
                    Text('No complaints found', style: GoogleFonts.poppins(color: UrbanTheme.textSecondary)),
                  ],
                ))
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: filtered.length,
                  itemBuilder: (context, i) {
                    final c = filtered[i];
                    return Semantics(
                      button: true,
                      label: 'Complaint: ${AppConstants.issueLabels[c.issueType] ?? c.issueType}, Department: ${c.department}, Status: ${c.status}. Double tap to view details.',
                      child: GestureDetector(
                        onTap: () => context.push(AppRoutes.complaintDetail, extra: c.id),
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.white, borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: UrbanTheme.divider.withValues(alpha: 0.5)),
                            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 4)],
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 48, height: 48,
                                decoration: BoxDecoration(
                                  color: UrbanTheme.primaryNavy.withValues(alpha: 0.08),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Center(child: Text(
                                  AppConstants.issueIcons[c.issueType] ?? '📋',
                                  style: const TextStyle(fontSize: 24),
                                )),
                              ),
                              const SizedBox(width: 14),
                              Expanded(child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(AppConstants.issueLabels[c.issueType] ?? c.issueType,
                                    style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600)),
                                  const SizedBox(height: 2),
                                  Text(c.department, maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: GoogleFonts.poppins(fontSize: 11, color: UrbanTheme.textSecondary)),
                                  const SizedBox(height: 6),
                                  Row(children: [
                                    StatusBadge(status: c.status),
                                    const SizedBox(width: 8),
                                    PriorityIndicator(priority: c.priority),
                                  ]),
                                ],
                              )),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(_formatDate(c.createdAt),
                                    style: GoogleFonts.poppins(fontSize: 10, color: UrbanTheme.textHint)),
                                  const SizedBox(height: 12),
                                  const Icon(Icons.chevron_right_rounded, size: 20, color: UrbanTheme.textHint),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime d) {
    final diff = DateTime.now().difference(d);
    if (diff.inDays == 0) return 'Today';
    if (diff.inDays == 1) return 'Yesterday';
    if (diff.inDays < 7) return '${diff.inDays}d ago';
    return '${d.day}/${d.month}/${d.year}';
  }
}
