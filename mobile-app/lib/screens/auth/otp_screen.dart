import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/constants.dart';
import '../../config/routes.dart';
import '../../providers/auth_provider.dart';

class OtpScreen extends StatefulWidget {
  final String phoneNumber;
  const OtpScreen({super.key, required this.phoneNumber});
  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  final List<TextEditingController> _controllers = List.generate(6, (_) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(6, (_) => FocusNode());
  int _resendTimer = AppConstants.otpResendCooldown;
  bool _canResend = false;

  @override
  void initState() {
    super.initState();
    _startTimer();
    WidgetsBinding.instance.addPostFrameCallback((_) => _focusNodes[0].requestFocus());
  }

  String get _otp => _controllers.map((c) => c.text).join();

  void _startTimer() {
    _resendTimer = AppConstants.otpResendCooldown;
    _canResend = false;
    Future.doWhile(() async {
      await Future.delayed(const Duration(seconds: 1));
      if (!mounted) return false;
      setState(() { _resendTimer--; });
      if (_resendTimer <= 0) { setState(() { _canResend = true; }); return false; }
      return true;
    });
  }

  Future<void> _verifyOtp() async {
    if (_otp.length != AppConstants.otpLength) return;
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final success = await auth.verifyOtp(_otp, widget.phoneNumber);
    if (success && mounted) context.go(AppRoutes.home);
  }

  Future<void> _resendOtp() async {
    if (!_canResend) return;
    final auth = Provider.of<AuthProvider>(context, listen: false);
    await auth.sendOtp(widget.phoneNumber);
    for (var c in _controllers) { c.clear(); }
    _focusNodes[0].requestFocus();
    _startTimer();
  }

  @override
  void dispose() {
    for (var c in _controllers) { c.dispose(); }
    for (var f in _focusNodes) { f.dispose(); }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    return Scaffold(
      backgroundColor: UrbanTheme.backgroundLight,
      appBar: AppBar(
        backgroundColor: Colors.transparent, elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: UrbanTheme.textPrimary),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Verification Code', style: GoogleFonts.poppins(
                fontSize: 24, fontWeight: FontWeight.w700, color: UrbanTheme.textPrimary)),
              const SizedBox(height: 8),
              Text('We sent a code to ${AppConstants.phoneCountryCode} ${widget.phoneNumber}',
                style: GoogleFonts.poppins(fontSize: 14, color: UrbanTheme.textSecondary)),
              const SizedBox(height: 40),
              // OTP Fields
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: List.generate(6, (i) => SizedBox(
                  width: 46, height: 52,
                  child: TextField(
                    controller: _controllers[i],
                    focusNode: _focusNodes[i],
                    keyboardType: TextInputType.number,
                    textAlign: TextAlign.center,
                    maxLength: 1,
                    style: GoogleFonts.poppins(fontSize: 22, fontWeight: FontWeight.w600),
                    decoration: InputDecoration(
                      counterText: '',
                      filled: true,
                      fillColor: Colors.white,
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: const BorderSide(color: UrbanTheme.divider),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: const BorderSide(color: UrbanTheme.primaryNavy, width: 2),
                      ),
                      contentPadding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    onChanged: (v) {
                      if (v.isNotEmpty && i < 5) {
                        _focusNodes[i + 1].requestFocus();
                      } else if (v.isEmpty && i > 0) {
                        _focusNodes[i - 1].requestFocus();
                      }
                      if (_otp.length == 6) _verifyOtp();
                    },
                  ),
                )),
              ),
              if (auth.error != null) ...[
                const SizedBox(height: 12),
                Text(auth.error!, style: GoogleFonts.poppins(fontSize: 12, color: UrbanTheme.error)),
              ],
              const SizedBox(height: 28),
              SizedBox(
                width: double.infinity, height: 52,
                child: ElevatedButton(
                  onPressed: auth.isLoading ? null : _verifyOtp,
                  child: auth.isLoading
                    ? const SizedBox(width: 22, height: 22,
                        child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.white))
                    : Text('Verify OTP', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w600)),
                ),
              ),
              const SizedBox(height: 24),
              Center(
                child: _canResend
                  ? TextButton(onPressed: _resendOtp,
                      child: Text('Resend OTP', style: GoogleFonts.poppins(
                        fontWeight: FontWeight.w600, color: UrbanTheme.primaryNavy)))
                  : Text('Resend in $_resendTimer s', style: GoogleFonts.poppins(
                      color: UrbanTheme.textSecondary)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
