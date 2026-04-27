import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../services/local_storage_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();

  bool _isLoading = false;
  bool _isLoggedIn = false;
  String? _userId;
  String? _phone;
  String? _error;

  bool get isLoading => _isLoading;
  bool get isLoggedIn => _isLoggedIn;
  String? get userId => _userId;
  String? get phone => _phone;
  String? get error => _error;

  Future<bool> sendOtp(String phoneNumber) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _authService.sendOtp(phoneNumber);
      _isLoading = false;
      notifyListeners();
      return result;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> verifyOtp(String otp, String phoneNumber) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _authService.verifyOtp(otp, phoneNumber);
      if (result) {
        _isLoggedIn = true;
        _userId = _authService.currentUserId;
        _phone = phoneNumber;
        await LocalStorageService.setUserPhone(phoneNumber);
      } else {
        _error = 'Invalid OTP. Please try again.';
      }
      _isLoading = false;
      notifyListeners();
      return result;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    await _authService.logout();
    _isLoggedIn = false;
    _userId = null;
    _phone = null;
    notifyListeners();
  }

  Future<void> checkSession() async {
    _isLoggedIn = await _authService.checkSession();
    if (_isLoggedIn) {
      _userId = _authService.currentUserId;
      _phone = _authService.currentPhone;
    }
    notifyListeners();
  }
}
