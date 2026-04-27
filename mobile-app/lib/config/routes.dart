import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../screens/splash/splash_screen.dart';
import '../screens/language/language_selection_screen.dart';
import '../screens/onboarding/onboarding_screen.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/otp_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/report/capture_screen.dart';
import '../screens/report/ai_processing_screen.dart';
import '../screens/report/ai_result_screen.dart';
import '../screens/report/location_screen.dart';
import '../screens/report/draft_screen.dart';
import '../screens/report/drafts_list_screen.dart';
import '../screens/report/qr_instruction_screen.dart';
import '../screens/report/qr_code_screen.dart';
import '../screens/complaints/complaints_list_screen.dart';
import '../screens/complaints/complaint_detail_screen.dart';
import '../screens/notifications/notifications_screen.dart';
import '../screens/chatbot/chatbot_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../screens/bills/bill_payment_screen.dart';
import '../screens/scanner/qr_scanner_screen.dart';

class AppRoutes {
  static const String splash = '/';
  static const String language = '/language';
  static const String onboarding = '/onboarding';
  static const String login = '/login';
  static const String otp = '/otp';
  static const String home = '/home';
  static const String reportCapture = '/report/capture';
  static const String reportAiProcessing = '/report/ai-processing';
  static const String reportAiResult = '/report/ai-result';
  static const String reportLocation = '/report/location';
  static const String reportDraft = '/report/draft';
  static const String draftsList = '/drafts';
  static const String reportQrInstruction = '/report/qr-instruction';
  static const String reportQrCode = '/report/qr-code';
  static const String complaints = '/complaints';
  static const String complaintDetail = '/complaints/detail';
  static const String notifications = '/notifications';
  static const String chatbot = '/chatbot';
  static const String profile = '/profile';
  static const String billPayment = '/bills';
  static const String qrScanner = '/scanner';

  static final GoRouter router = GoRouter(
    initialLocation: splash,
    routes: [
      GoRoute(path: splash, builder: (_, __) => const SplashScreen()),
      GoRoute(path: language, builder: (_, __) => const LanguageSelectionScreen()),
      GoRoute(path: onboarding, builder: (_, __) => const OnboardingScreen()),
      GoRoute(path: login, builder: (_, __) => const LoginScreen()),
      GoRoute(path: otp, builder: (_, state) {
        final phone = state.extra as String? ?? '';
        return OtpScreen(phoneNumber: phone);
      }),
      GoRoute(path: home, builder: (_, __) => const HomeScreen()),
      GoRoute(path: reportCapture, builder: (_, __) => const CaptureScreen()),
      GoRoute(path: reportAiProcessing, builder: (_, __) => const AiProcessingScreen()),
      GoRoute(path: reportAiResult, builder: (_, __) => const AiResultScreen()),
      GoRoute(path: reportLocation, builder: (_, __) => const LocationScreen()),
      GoRoute(path: reportDraft, builder: (_, __) => const DraftScreen()),
      GoRoute(path: draftsList, builder: (_, __) => const DraftsListScreen()),
      GoRoute(path: reportQrInstruction, builder: (_, __) => const QrInstructionScreen()),
      GoRoute(path: reportQrCode, builder: (_, __) => const QrCodeScreen()),
      GoRoute(path: complaints, builder: (_, __) => const ComplaintsListScreen()),
      GoRoute(path: complaintDetail, builder: (_, state) {
        final complaintId = state.extra as String? ?? '';
        return ComplaintDetailScreen(complaintId: complaintId);
      }),
      GoRoute(path: notifications, builder: (_, __) => const NotificationsScreen()),
      GoRoute(path: chatbot, builder: (_, __) => const ChatbotScreen()),
      GoRoute(path: profile, builder: (_, __) => const ProfileScreen()),
      GoRoute(path: billPayment, builder: (_, __) => const BillPaymentScreen()),
      GoRoute(path: qrScanner, builder: (_, __) => const QrScannerScreen()),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(child: Text('Page not found: ${state.error}')),
    ),
  );
}
