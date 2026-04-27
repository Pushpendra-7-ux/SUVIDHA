import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/notification_provider.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final np = Provider.of<NotificationProvider>(context);

    return Scaffold(
      backgroundColor: UrbanTheme.backgroundLight,
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          if (np.unreadCount > 0)
            TextButton(
              onPressed: () => np.markAllAsRead(),
              child: Text('Mark all read', style: GoogleFonts.poppins(
                color: Colors.white70, fontSize: 12)),
            ),
        ],
      ),
      body: np.notifications.isEmpty
        ? Center(child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.notifications_none_rounded, size: 64, color: UrbanTheme.divider),
              const SizedBox(height: 12),
              Text('No notifications', style: GoogleFonts.poppins(color: UrbanTheme.textSecondary)),
            ],
          ))
        : ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: np.notifications.length,
            itemBuilder: (context, i) {
              final n = np.notifications[i];
              final icons = {
                'complaint_accepted': Icons.check_circle_outline_rounded,
                'assigned': Icons.engineering_rounded,
                'resolved': Icons.task_alt_rounded,
                'general': Icons.info_outline_rounded,
              };
              final colors = {
                'complaint_accepted': UrbanTheme.info,
                'assigned': UrbanTheme.secondaryTeal,
                'resolved': UrbanTheme.success,
                'general': UrbanTheme.textSecondary,
              };

              return GestureDetector(
                onTap: () => np.markAsRead(n.id),
                child: Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: n.isRead ? Colors.white : UrbanTheme.primaryNavy.withValues(alpha: 0.04),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: n.isRead ? UrbanTheme.divider.withValues(alpha: 0.5) : UrbanTheme.primaryNavy.withValues(alpha: 0.15)),
                  ),
                  child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Container(
                      width: 40, height: 40,
                      decoration: BoxDecoration(
                        color: (colors[n.type] ?? UrbanTheme.textSecondary).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(icons[n.type] ?? Icons.info_outline, size: 20,
                        color: colors[n.type] ?? UrbanTheme.textSecondary),
                    ),
                    const SizedBox(width: 12),
                    Expanded(child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(n.title, style: GoogleFonts.poppins(
                          fontSize: 13, fontWeight: n.isRead ? FontWeight.w500 : FontWeight.w600)),
                        const SizedBox(height: 2),
                        Text(n.body, style: GoogleFonts.poppins(
                          fontSize: 12, color: UrbanTheme.textSecondary), maxLines: 2),
                        const SizedBox(height: 4),
                        Text(_timeAgo(n.timestamp), style: GoogleFonts.poppins(
                          fontSize: 10, color: UrbanTheme.textHint)),
                      ],
                    )),
                    if (!n.isRead)
                      Container(width: 8, height: 8, margin: const EdgeInsets.only(top: 4),
                        decoration: const BoxDecoration(color: UrbanTheme.primaryNavy, shape: BoxShape.circle)),
                  ]),
                ),
              );
            },
          ),
    );
  }

  String _timeAgo(DateTime d) {
    final diff = DateTime.now().difference(d);
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays < 7) return '${diff.inDays}d ago';
    return '${d.day}/${d.month}/${d.year}';
  }
}
