import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../config/theme.dart';

class LoadingOverlay extends StatelessWidget {
  final String message;
  final String? subMessage;

  const LoadingOverlay({super.key, required this.message, this.subMessage});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.black54,
      child: Center(
        child: Container(
          margin: const EdgeInsets.all(32),
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 40),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(UrbanTheme.radiusLg),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(
                width: 48, height: 48,
                child: CircularProgressIndicator(
                  strokeWidth: 3, color: UrbanTheme.primaryNavy,
                ),
              ),
              const SizedBox(height: 24),
              Text(message, style: GoogleFonts.poppins(
                fontSize: 16, fontWeight: FontWeight.w600,
                color: UrbanTheme.textPrimary,
              ), textAlign: TextAlign.center),
              if (subMessage != null) ...[
                const SizedBox(height: 8),
                Text(subMessage!, style: GoogleFonts.poppins(
                  fontSize: 13, color: UrbanTheme.textSecondary,
                ), textAlign: TextAlign.center),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
