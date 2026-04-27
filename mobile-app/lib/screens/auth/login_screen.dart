import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/constants.dart';
import '../../config/routes.dart';
import '../../providers/auth_provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _phoneController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() { _phoneController.dispose(); super.dispose(); }

  Future<void> _sendOtp() async {
    if (!_formKey.currentState!.validate()) return;
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final success = await authProvider.sendOtp(_phoneController.text.trim());
    if (success && mounted) {
      context.push(AppRoutes.otp, extra: _phoneController.text.trim());
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    return Scaffold(
      backgroundColor: UrbanTheme.backgroundLight,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 40),
                // Header
                Container(
                  width: 60, height: 60,
                  decoration: BoxDecoration(
                    color: UrbanTheme.primaryNavy.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Icon(Icons.location_city_rounded, size: 30, color: UrbanTheme.primaryNavy),
                ),
                const SizedBox(height: 24),
                Text('Welcome to URBAN', style: GoogleFonts.poppins(
                  fontSize: 26, fontWeight: FontWeight.w700, color: UrbanTheme.textPrimary)),
                const SizedBox(height: 4),
                Text('Enter your mobile number to continue', style: GoogleFonts.poppins(
                  fontSize: 14, color: UrbanTheme.textSecondary)),
                const SizedBox(height: 48),
                // Phone input
                Text('Mobile Number', style: GoogleFonts.poppins(
                  fontSize: 13, fontWeight: FontWeight.w600, color: UrbanTheme.textPrimary)),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  maxLength: AppConstants.phoneNumberLength,
                  inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                  style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w500),
                  decoration: InputDecoration(
                    prefixIcon: Padding(
                      padding: const EdgeInsets.only(left: 16, right: 8),
                      child: Text(AppConstants.phoneCountryCode,
                        style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w500,
                          color: UrbanTheme.textPrimary)),
                    ),
                    prefixIconConstraints: const BoxConstraints(minWidth: 0, minHeight: 0),
                    hintText: 'Enter 10-digit number',
                    counterText: '',
                  ),
                  validator: (value) {
                    if (value == null || value.length != AppConstants.phoneNumberLength) {
                      return 'Please enter a valid 10-digit number';
                    }
                    return null;
                  },
                ),
                if (authProvider.error != null) ...[
                  const SizedBox(height: 8),
                  Text(authProvider.error!, style: GoogleFonts.poppins(fontSize: 12, color: UrbanTheme.error)),
                ],
                const SizedBox(height: 32),
                SizedBox(
                  width: double.infinity, height: 52,
                  child: ElevatedButton(
                    onPressed: authProvider.isLoading ? null : _sendOtp,
                    child: authProvider.isLoading
                      ? const SizedBox(width: 22, height: 22,
                          child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.white))
                      : Text('Send OTP', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w600)),
                  ),
                ),
                if (AppConstants.demoMode) ...[
                  const SizedBox(height: 24),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: UrbanTheme.info.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: UrbanTheme.info.withValues(alpha: 0.2)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.info_outline, size: 18, color: UrbanTheme.info),
                        const SizedBox(width: 10),
                        Expanded(child: Text('Demo Mode: Use any number. OTP is ${AppConstants.demoOtp}',
                          style: GoogleFonts.poppins(fontSize: 12, color: UrbanTheme.info))),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
