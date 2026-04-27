import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/routes.dart';
import '../../providers/complaint_provider.dart';

class AiProcessingScreen extends StatefulWidget {
  const AiProcessingScreen({super.key});
  @override
  State<AiProcessingScreen> createState() => _AiProcessingScreenState();
}

class _AiProcessingScreenState extends State<AiProcessingScreen> with TickerProviderStateMixin {
  late AnimationController _pulseController;
  late AnimationController _scanController;
  int _step = 0;
  final _steps = ['Detecting issue...', 'Classifying type...', 'Generating report...'];

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(vsync: this, duration: const Duration(milliseconds: 1200))..repeat(reverse: true);
    _scanController = AnimationController(vsync: this, duration: const Duration(milliseconds: 2000))..repeat();
    _runAnalysis();
  }

  Future<void> _runAnalysis() async {
    final cp = Provider.of<ComplaintProvider>(context, listen: false);
    for (int i = 0; i < _steps.length; i++) {
      await Future.delayed(const Duration(milliseconds: 700));
      if (mounted) setState(() => _step = i);
    }
    await cp.analyzeImage();
    if (mounted) context.go(AppRoutes.reportAiResult);
  }

  @override
  void dispose() { _pulseController.dispose(); _scanController.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final cp = Provider.of<ComplaintProvider>(context);
    return Scaffold(
      backgroundColor: UrbanTheme.primaryNavyDark,
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Stack(
              alignment: Alignment.center,
              children: [
                if (cp.currentComplaint?.localImagePath != null)
                  Container(
                    width: 220, height: 220,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: UrbanTheme.secondaryTeal.withValues(alpha: 0.5), width: 2),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(18),
                      child: Image.file(File(cp.currentComplaint!.localImagePath!), fit: BoxFit.cover),
                    ),
                  ),
                AnimatedBuilder(
                  animation: _scanController,
                  builder: (context, _) {
                    return Container(
                      width: 220, height: 220,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
                        gradient: LinearGradient(
                          begin: Alignment.topCenter, end: Alignment.bottomCenter,
                          colors: [Colors.transparent, UrbanTheme.secondaryTeal.withValues(alpha: 0.2), Colors.transparent],
                          stops: [0, _scanController.value, 1],
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
            const SizedBox(height: 48),
            AnimatedBuilder(
              animation: _pulseController,
              builder: (context, _) {
                return Opacity(
                  opacity: 0.6 + _pulseController.value * 0.4,
                  child: Text('Analyzing Issue...', style: GoogleFonts.poppins(
                    fontSize: 22, fontWeight: FontWeight.w600, color: Colors.white)),
                );
              },
            ),
            const SizedBox(height: 24),
            ...List.generate(_steps.length, (i) {
              final isActive = _step >= i;
              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(isActive ? Icons.check_circle_rounded : Icons.radio_button_unchecked_rounded,
                      size: 18, color: isActive ? UrbanTheme.secondaryTealLight : Colors.white38),
                    const SizedBox(width: 10),
                    Text(_steps[i], style: GoogleFonts.poppins(
                      fontSize: 14, color: isActive ? Colors.white : Colors.white38)),
                  ],
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}

