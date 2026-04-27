import 'package:flutter/material.dart';
import '../config/constants.dart';

/// Auth service with demo mode support.
/// In demo mode, bypasses Firebase and uses mock OTP.
/// In production, integrates with Firebase Phone Auth.
class AuthService {
  String? _verificationId;
  String? _currentUserId;
  String? _currentPhone;

  bool get isLoggedIn => _currentUserId != null;
  String? get currentUserId => _currentUserId;
  String? get currentPhone => _currentPhone;

  /// Send OTP to phone number
  Future<bool> sendOtp(String phoneNumber) async {
    if (AppConstants.demoMode) {
      // In demo mode, simulate sending OTP
      await Future.delayed(const Duration(seconds: 1));
      _verificationId = 'demo_verification_id';
      debugPrint('[AuthService] Demo OTP sent to $phoneNumber');
      return true;
    }

    // Firebase Phone Auth would go here:
    // await FirebaseAuth.instance.verifyPhoneNumber(
    //   phoneNumber: '${AppConstants.phoneCountryCode}$phoneNumber',
    //   verificationCompleted: (credential) {},
    //   verificationFailed: (e) {},
    //   codeSent: (verificationId, resendToken) {
    //     _verificationId = verificationId;
    //   },
    //   codeAutoRetrievalTimeout: (verificationId) {},
    // );
    
    await Future.delayed(const Duration(seconds: 1));
    _verificationId = 'demo_verification_id';
    return true;
  }

  /// Verify OTP code
  Future<bool> verifyOtp(String otp, String phoneNumber) async {
    if (AppConstants.demoMode) {
      await Future.delayed(const Duration(seconds: 1));
      if (otp == AppConstants.demoOtp) {
        _currentUserId = 'demo_user_${phoneNumber.hashCode}';
        _currentPhone = phoneNumber;
        debugPrint('[AuthService] Demo OTP verified. User: $_currentUserId');
        return true;
      }
      return false;
    }

    // Firebase verification would go here:
    // final credential = PhoneAuthProvider.credential(
    //   verificationId: _verificationId!,
    //   smsCode: otp,
    // );
    // final result = await FirebaseAuth.instance.signInWithCredential(credential);
    // _currentUserId = result.user?.uid;
    // _currentPhone = phoneNumber;

    if (otp == AppConstants.demoOtp) {
      _currentUserId = 'demo_user_${phoneNumber.hashCode}';
      _currentPhone = phoneNumber;
      return true;
    }
    return false;
  }

  /// Logout
  Future<void> logout() async {
    _currentUserId = null;
    _currentPhone = null;
    _verificationId = null;
    // await FirebaseAuth.instance.signOut();
    debugPrint('[AuthService] User logged out');
  }

  /// Check if user session exists
  Future<bool> checkSession() async {
    // In demo mode, check if we have a stored session
    if (AppConstants.demoMode) {
      return _currentUserId != null;
    }
    // return FirebaseAuth.instance.currentUser != null;
    return _currentUserId != null;
  }
}
