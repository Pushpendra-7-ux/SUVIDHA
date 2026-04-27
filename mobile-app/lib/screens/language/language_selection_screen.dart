import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/routes.dart';
import '../../providers/language_provider.dart';

class LanguageSelectionScreen extends StatelessWidget {
  const LanguageSelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final langProvider = Provider.of<LanguageProvider>(context);
    return Scaffold(
      backgroundColor: UrbanTheme.backgroundLight,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const SizedBox(height: 40),
              Container(
                width: 70, height: 70,
                decoration: BoxDecoration(
                  color: UrbanTheme.primaryNavy.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Icon(Icons.language_rounded, size: 36, color: UrbanTheme.primaryNavy),
              ),
              const SizedBox(height: 24),
              Text('Select Language',
                style: GoogleFonts.poppins(fontSize: 24, fontWeight: FontWeight.w700, color: UrbanTheme.textPrimary),
              ),
              Text('भाषा चुनें / ভাষা নিৰ্বাচন কৰক',
                style: GoogleFonts.poppins(fontSize: 14, color: UrbanTheme.textSecondary),
              ),
              const SizedBox(height: 48),
              _LanguageOption(
                code: 'en', name: 'English', subtitle: 'English',
                isSelected: langProvider.languageCode == 'en',
                onTap: () => _selectLanguage(context, langProvider, 'en'),
              ),
              const SizedBox(height: 16),
              _LanguageOption(
                code: 'hi', name: 'हिंदी', subtitle: 'Hindi',
                isSelected: langProvider.languageCode == 'hi',
                onTap: () => _selectLanguage(context, langProvider, 'hi'),
              ),
              const SizedBox(height: 16),
              _LanguageOption(
                code: 'as', name: 'অসমীয়া', subtitle: 'Assamese',
                isSelected: langProvider.languageCode == 'as',
                onTap: () => _selectLanguage(context, langProvider, 'as'),
              ),
              const Spacer(),
              SizedBox(
                width: double.infinity, height: 52,
                child: ElevatedButton(
                  onPressed: () => context.go(AppRoutes.onboarding),
                  child: Text('Continue', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w600)),
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  void _selectLanguage(BuildContext context, LanguageProvider provider, String code) {
    provider.setLanguage(code);
  }
}

class _LanguageOption extends StatelessWidget {
  final String code, name, subtitle;
  final bool isSelected;
  final VoidCallback onTap;

  const _LanguageOption({
    required this.code, required this.name, required this.subtitle,
    required this.isSelected, required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
        decoration: BoxDecoration(
          color: isSelected ? UrbanTheme.primaryNavy.withValues(alpha: 0.08) : Colors.white,
          borderRadius: BorderRadius.circular(UrbanTheme.radiusMd),
          border: Border.all(
            color: isSelected ? UrbanTheme.primaryNavy : UrbanTheme.divider,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 44, height: 44,
              decoration: BoxDecoration(
                color: isSelected ? UrbanTheme.primaryNavy : UrbanTheme.backgroundLight,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Center(child: Text(
                code.toUpperCase(),
                style: GoogleFonts.poppins(
                  fontSize: 13, fontWeight: FontWeight.w700,
                  color: isSelected ? Colors.white : UrbanTheme.textSecondary,
                ),
              )),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, style: GoogleFonts.poppins(
                    fontSize: 18, fontWeight: FontWeight.w600, color: UrbanTheme.textPrimary,
                  )),
                  Text(subtitle, style: GoogleFonts.poppins(fontSize: 12, color: UrbanTheme.textSecondary)),
                ],
              ),
            ),
            if (isSelected)
              const Icon(Icons.check_circle_rounded, color: UrbanTheme.primaryNavy, size: 24),
          ],
        ),
      ),
    );
  }
}
