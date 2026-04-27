import 'package:flutter/material.dart';
import '../services/local_storage_service.dart';

class LanguageProvider extends ChangeNotifier {
  Locale _locale = const Locale('en');

  Locale get locale => _locale;
  String get languageCode => _locale.languageCode;

  LanguageProvider() {
    _loadSavedLanguage();
  }

  void _loadSavedLanguage() {
    final saved = LocalStorageService.getLanguage();
    _locale = Locale(saved);
  }

  Future<void> setLanguage(String code) async {
    _locale = Locale(code);
    await LocalStorageService.setLanguage(code);
    notifyListeners();
  }

  String getLanguageName(String code) {
    switch (code) {
      case 'en': return 'English';
      case 'hi': return 'हिंदी';
      case 'as': return 'অসমীয়া';
      default: return 'English';
    }
  }
}
