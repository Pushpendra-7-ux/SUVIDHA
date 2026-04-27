import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/routes.dart';
import '../../providers/complaint_provider.dart';
import '../../providers/notification_provider.dart';
import '../../services/local_storage_service.dart';
import '../../config/constants.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _navIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final complaints = Provider.of<ComplaintProvider>(context, listen: false);
      complaints.loadMockComplaints('demo');
      complaints.loadDrafts();
    });
  }

  @override
  Widget build(BuildContext context) {
    final notifProvider = Provider.of<NotificationProvider>(context);
    final userName = LocalStorageService.getUserName();
    final screenW = MediaQuery.of(context).size.width;

    return Scaffold(
      backgroundColor: UrbanTheme.backgroundLight,
      body: SafeArea(
        child: _navIndex == 0
            ? _buildHome(context, userName, notifProvider, screenW)
            : const SizedBox(),
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 12, offset: const Offset(0, -3))],
        ),
        child: BottomNavigationBar(
          currentIndex: _navIndex,
          onTap: (i) {
            if (i == 0) {
              setState(() => _navIndex = 0);
            } else if (i == 1) {
              context.push(AppRoutes.complaints);
            } else if (i == 2) {
              context.push(AppRoutes.notifications);
            } else if (i == 3) {
              context.push(AppRoutes.profile);
            }
          },
          type: BottomNavigationBarType.fixed,
          selectedItemColor: UrbanTheme.primaryNavy,
          unselectedItemColor: UrbanTheme.iconDefault,
          selectedLabelStyle: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w600),
          unselectedLabelStyle: GoogleFonts.poppins(fontSize: 11),
          items: [
            const BottomNavigationBarItem(icon: Icon(Icons.home_rounded), label: 'Home'),
            const BottomNavigationBarItem(icon: Icon(Icons.folder_rounded), label: 'Complaints'),
            BottomNavigationBarItem(
              icon: Badge(
                isLabelVisible: notifProvider.unreadCount > 0,
                label: Text('${notifProvider.unreadCount}'),
                child: const Icon(Icons.notifications_rounded),
              ),
              label: 'Alerts',
            ),
            const BottomNavigationBarItem(icon: Icon(Icons.person_rounded), label: 'Profile'),
          ],
        ),
      ),
    );
  }

  Widget _buildHome(BuildContext context, String userName, NotificationProvider notifP, double screenW) {
    return SingleChildScrollView(
      padding: EdgeInsets.all(screenW > 400 ? 20 : 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Greeting header
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Hello, $userName 👋', style: GoogleFonts.poppins(
                      fontSize: screenW > 400 ? 22 : 18, fontWeight: FontWeight.w700, color: UrbanTheme.textPrimary)),
                    const SizedBox(height: 2),
                    Row(children: [
                      const Icon(Icons.location_on_outlined, size: 14, color: UrbanTheme.textSecondary),
                      const SizedBox(width: 4),
                      Text('Guwahati, Assam', style: GoogleFonts.poppins(fontSize: 12, color: UrbanTheme.textSecondary)),
                    ]),
                  ],
                ),
              ),
              GestureDetector(
                onTap: () => context.push(AppRoutes.profile),
                child: Container(
                  width: 44, height: 44,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [UrbanTheme.primaryNavy, UrbanTheme.secondaryTeal]),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.person_rounded, color: Colors.white, size: 22),
                ),
              ),
            ],
          ),
          const SizedBox(height: 22),

          // Quick action cards - 6 items in 3x2 grid
          GridView.count(
            crossAxisCount: 3,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
            childAspectRatio: 0.95,
            children: [
              _ActionCard(
                title: 'Report Issue', icon: Icons.camera_alt_rounded,
                color: UrbanTheme.primaryNavy,
                onTap: () => context.push(AppRoutes.reportCapture),
              ),
              Consumer<ComplaintProvider>(
                builder: (context, cp, _) => _ActionCard(
                  title: 'Saved Drafts', icon: Icons.drafts_outlined,
                  color: const Color(0xFF43A047), // Green
                  onTap: () => context.push(AppRoutes.draftsList),
                  badge: cp.drafts.length,
                ),
              ),
              _ActionCard(
                title: 'My Complaints', icon: Icons.folder_open_rounded,
                color: UrbanTheme.secondaryTeal,
                onTap: () => context.push(AppRoutes.complaints),
              ),
              _ActionCard(
                title: 'QR Scanner', icon: Icons.qr_code_scanner_rounded,
                color: const Color(0xFF8E24AA), // Purple
                onTap: () => context.push(AppRoutes.qrScanner),
              ),
              _ActionCard(
                title: 'Chatbot', icon: Icons.smart_toy_rounded,
                color: UrbanTheme.info,
                onTap: () => context.push(AppRoutes.chatbot),
                badge: 0,
              ),
              _ActionCard(
                title: 'Alerts', icon: Icons.notifications_rounded,
                color: UrbanTheme.accentAmber,
                onTap: () => context.push(AppRoutes.notifications),
                badge: notifP.unreadCount,
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Recent complaints header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Recent Complaints', style: GoogleFonts.poppins(
                fontSize: 16, fontWeight: FontWeight.w600, color: UrbanTheme.textPrimary)),
              TextButton(
                onPressed: () => context.push(AppRoutes.complaints),
                child: Text('View All', style: GoogleFonts.poppins(
                  fontSize: 13, color: UrbanTheme.primaryNavy, fontWeight: FontWeight.w500)),
              ),
            ],
          ),
          Consumer<ComplaintProvider>(
            builder: (context, cp, _) {
              final recent = cp.complaints.take(3).toList();
              if (recent.isEmpty) {
                return Container(
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Center(
                    child: Column(children: [
                      Icon(Icons.inbox_rounded, size: 40, color: UrbanTheme.divider),
                      const SizedBox(height: 8),
                      Text('No complaints yet. Tap "Report Issue" to start!',
                        style: GoogleFonts.poppins(fontSize: 13, color: UrbanTheme.textSecondary),
                        textAlign: TextAlign.center),
                    ]),
                  ),
                );
              }
              return Column(children: recent.map((c) => _ComplaintTile(complaint: c)).toList());
            },
          ),
        ],
      ),
    );
  }
}

class _ActionCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;
  final int badge;
  const _ActionCard({required this.title, required this.icon, required this.color, required this.onTap, this.badge = 0});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [BoxShadow(color: color.withValues(alpha: 0.08), blurRadius: 8, offset: const Offset(0, 2))],
        ),
        child: Stack(
          children: [
            // Accent strip
            Positioned(top: 0, left: 0, right: 0,
              child: Container(height: 4,
                decoration: BoxDecoration(
                  color: color,
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(14)),
                ))),
            Padding(
              padding: const EdgeInsets.fromLTRB(10, 18, 10, 10),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 42, height: 42,
                    decoration: BoxDecoration(
                      color: color.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(icon, color: color, size: 22),
                  ),
                  const SizedBox(height: 8),
                  Text(title, style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w600),
                    textAlign: TextAlign.center, maxLines: 2, overflow: TextOverflow.ellipsis),
                ],
              ),
            ),
            if (badge > 0)
              Positioned(top: 8, right: 8,
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(color: UrbanTheme.error, shape: BoxShape.circle),
                  child: Text('$badge', style: GoogleFonts.poppins(color: Colors.white, fontSize: 9, fontWeight: FontWeight.w700)),
                )),
          ],
        ),
      ),
    );
  }
}

class _ComplaintTile extends StatelessWidget {
  final dynamic complaint;
  const _ComplaintTile({required this.complaint});

  @override
  Widget build(BuildContext context) {
    final statusColors = {
      'pending': UrbanTheme.accentAmber,
      'in_progress': UrbanTheme.secondaryTeal,
      'resolved': UrbanTheme.success,
      'draft': UrbanTheme.textSecondary,
    };
    final statusColor = statusColors[complaint.status] ?? UrbanTheme.textSecondary;

    return GestureDetector(
      onTap: () => context.push(AppRoutes.complaintDetail, extra: complaint.id),
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: UrbanTheme.divider.withValues(alpha: 0.4)),
        ),
        child: Row(
          children: [
            Container(
              width: 44, height: 44,
              decoration: BoxDecoration(
                color: UrbanTheme.primaryNavy.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Center(child: Text(
                AppConstants.issueIcons[complaint.issueType] ?? '📋',
                style: const TextStyle(fontSize: 22))),
            ),
            const SizedBox(width: 12),
            Expanded(child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(AppConstants.issueLabels[complaint.issueType] ?? complaint.issueType,
                  style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600)),
                Text(complaint.address ?? 'No address', maxLines: 1, overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.poppins(fontSize: 11, color: UrbanTheme.textSecondary)),
              ],
            )),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: statusColor.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                AppConstants.statusLabels[complaint.status] ?? complaint.status,
                style: GoogleFonts.poppins(fontSize: 10, fontWeight: FontWeight.w600, color: statusColor),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
