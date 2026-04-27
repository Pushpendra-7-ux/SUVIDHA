import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../config/theme.dart';

class StatusBadge extends StatelessWidget {
  final String status;
  const StatusBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: _color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(UrbanTheme.radiusFull),
        border: Border.all(color: _color.withValues(alpha: 0.3)),
      ),
      child: Text(
        _label,
        style: GoogleFonts.poppins(
          fontSize: 11, fontWeight: FontWeight.w600, color: _color,
        ),
      ),
    );
  }

  Color get _color {
    switch (status) {
      case 'draft': return UrbanTheme.textSecondary;
      case 'pending': return UrbanTheme.accentAmber;
      case 'accepted': return UrbanTheme.info;
      case 'in_progress': return UrbanTheme.secondaryTeal;
      case 'resolved': return UrbanTheme.success;
      case 'rejected': return UrbanTheme.error;
      default: return UrbanTheme.textSecondary;
    }
  }

  String get _label {
    switch (status) {
      case 'draft': return 'Draft';
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'in_progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  }
}

class PriorityIndicator extends StatelessWidget {
  final String priority;
  const PriorityIndicator({super.key, required this.priority});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 8, height: 8,
          decoration: BoxDecoration(color: _color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 6),
        Text(
          _label,
          style: GoogleFonts.poppins(
            fontSize: 12, fontWeight: FontWeight.w500, color: _color,
          ),
        ),
      ],
    );
  }

  Color get _color {
    switch (priority) {
      case 'low': return UrbanTheme.priorityLow;
      case 'medium': return UrbanTheme.priorityMedium;
      case 'high': return UrbanTheme.priorityHigh;
      default: return UrbanTheme.textSecondary;
    }
  }

  String get _label {
    switch (priority) {
      case 'low': return 'Low';
      case 'medium': return 'Medium';
      case 'high': return 'High';
      default: return priority;
    }
  }
}
