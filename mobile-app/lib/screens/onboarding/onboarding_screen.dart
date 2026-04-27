import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import '../../config/theme.dart';
import '../../config/routes.dart';
import '../../services/local_storage_service.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});
  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _controller = PageController();
  int _currentPage = 0;

  final _pages = const [
    _OnboardingData(
      icon: Icons.camera_alt_rounded, color: UrbanTheme.primaryNavy,
      title: 'Report Issues Instantly',
      description: 'Take a photo of any civic issue you see — potholes, garbage, broken streetlights, and more.',
    ),
    _OnboardingData(
      icon: Icons.auto_awesome_rounded, color: UrbanTheme.secondaryTeal,
      title: 'AI Detects the Problem',
      description: 'Our AI automatically identifies the issue type, assigns the right department, and sets priority.',
    ),
    _OnboardingData(
      icon: Icons.qr_code_scanner_rounded, color: UrbanTheme.accentAmber,
      title: 'Quick Submission via Kiosk',
      description: 'Generate a QR code and scan it at a nearby kiosk to officially submit your complaint.',
    ),
  ];

  void _onNext() {
    if (_currentPage < _pages.length - 1) {
      _controller.nextPage(duration: const Duration(milliseconds: 300), curve: Curves.easeInOut);
    } else {
      _completeOnboarding();
    }
  }

  void _completeOnboarding() {
    LocalStorageService.setOnboardingDone();
    context.go(AppRoutes.login);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: UrbanTheme.backgroundLight,
      body: SafeArea(
        child: Column(
          children: [
            // Skip button
            Align(
              alignment: Alignment.topRight,
              child: TextButton(
                onPressed: _completeOnboarding,
                child: Text('Skip', style: GoogleFonts.poppins(
                  color: UrbanTheme.textSecondary, fontWeight: FontWeight.w500)),
              ),
            ),
            Expanded(
              child: PageView.builder(
                controller: _controller,
                itemCount: _pages.length,
                onPageChanged: (i) => setState(() => _currentPage = i),
                itemBuilder: (context, i) => _buildPage(_pages[i]),
              ),
            ),
            // Indicator
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 24),
              child: SmoothPageIndicator(
                controller: _controller, count: _pages.length,
                effect: WormEffect(
                  dotWidth: 10, dotHeight: 10,
                  activeDotColor: UrbanTheme.primaryNavy,
                  dotColor: UrbanTheme.divider,
                ),
              ),
            ),
            // Button
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 0, 24, 32),
              child: SizedBox(
                width: double.infinity, height: 52,
                child: ElevatedButton(
                  onPressed: _onNext,
                  child: Text(
                    _currentPage == _pages.length - 1 ? 'Get Started' : 'Next',
                    style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPage(_OnboardingData data) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 140, height: 140,
            decoration: BoxDecoration(
              color: data.color.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(data.icon, size: 64, color: data.color),
          ),
          const SizedBox(height: 48),
          Text(data.title, style: GoogleFonts.poppins(
            fontSize: 24, fontWeight: FontWeight.w700, color: UrbanTheme.textPrimary,
          ), textAlign: TextAlign.center),
          const SizedBox(height: 16),
          Text(data.description, style: GoogleFonts.poppins(
            fontSize: 15, color: UrbanTheme.textSecondary, height: 1.6,
          ), textAlign: TextAlign.center),
        ],
      ),
    );
  }
}

class _OnboardingData {
  final IconData icon;
  final Color color;
  final String title, description;
  const _OnboardingData({required this.icon, required this.color, required this.title, required this.description});
}
