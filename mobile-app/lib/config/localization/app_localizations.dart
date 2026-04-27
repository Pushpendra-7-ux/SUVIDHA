import 'package:flutter/material.dart';
import 'en.dart';
import 'hi.dart';
import 'as_lang.dart';

class AppLocalizations {
  final Locale locale;

  AppLocalizations(this.locale);

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  static final Map<String, Map<String, String>> _localizedValues = {
    'en': enStrings,
    'hi': hiStrings,
    'as': asStrings,
  };

  String translate(String key) {
    return _localizedValues[locale.languageCode]?[key] ??
        _localizedValues['en']?[key] ??
        key;
  }

  // Convenience getters for common strings
  String get appName => translate('app_name');
  String get appTagline => translate('app_tagline');
  String get selectLanguage => translate('select_language');
  String get getStarted => translate('get_started');
  String get skip => translate('skip');
  String get next => translate('next');
  String get back => translate('back');
  String get confirm => translate('confirm');
  String get cancel => translate('cancel');
  String get edit => translate('edit');
  String get save => translate('save');
  String get delete => translate('delete');
  String get retry => translate('retry');
  String get loading => translate('loading');
  String get error => translate('error');
  String get success => translate('success');
  String get noInternet => translate('no_internet');
  String get savedOffline => translate('saved_offline');

  // Auth
  String get loginTitle => translate('login_title');
  String get enterPhone => translate('enter_phone');
  String get sendOtp => translate('send_otp');
  String get enterOtp => translate('enter_otp');
  String get verifyOtp => translate('verify_otp');
  String get resendOtp => translate('resend_otp');
  String get phoneHint => translate('phone_hint');
  String get invalidPhone => translate('invalid_phone');

  // Onboarding
  String get onboardTitle1 => translate('onboard_title_1');
  String get onboardDesc1 => translate('onboard_desc_1');
  String get onboardTitle2 => translate('onboard_title_2');
  String get onboardDesc2 => translate('onboard_desc_2');
  String get onboardTitle3 => translate('onboard_title_3');
  String get onboardDesc3 => translate('onboard_desc_3');

  // Home
  String get home => translate('home');
  String get hello => translate('hello');
  String get reportIssue => translate('report_issue');
  String get myComplaints => translate('my_complaints');
  String get notifications => translate('notifications');
  String get helpChatbot => translate('help_chatbot');
  String get profile => translate('profile');
  String get recentComplaints => translate('recent_complaints');

  // Report Flow
  String get captureImage => translate('capture_image');
  String get takePhoto => translate('take_photo');
  String get uploadGallery => translate('upload_gallery');
  String get analyzingIssue => translate('analyzing_issue');
  String get aiResult => translate('ai_result');
  String get detectedIssue => translate('detected_issue');
  String get department => translate('department');
  String get priority => translate('priority');
  String get confidence => translate('confidence');
  String get description => translate('description');
  String get addNotes => translate('add_notes');
  String get confirmLocation => translate('confirm_location');
  String get adjustPin => translate('adjust_pin');
  String get addLandmark => translate('add_landmark');
  String get complaintDraft => translate('complaint_draft');
  String get generateQr => translate('generate_qr');
  String get saveDraft => translate('save_draft');
  String get qrInstructions => translate('qr_instructions');
  String get qrMessage => translate('qr_message');
  String get regenerateQr => translate('regenerate_qr');
  String get retakePhoto => translate('retake_photo');

  // Complaints
  String get allComplaints => translate('all_complaints');
  String get pending => translate('pending');
  String get inProgress => translate('in_progress');
  String get resolved => translate('resolved');
  String get draft => translate('draft');
  String get noComplaints => translate('no_complaints');
  String get complaintDetails => translate('complaint_details');
  String get timeline => translate('timeline');

  // Profile
  String get name => translate('name');
  String get mobileNumber => translate('mobile_number');
  String get address => translate('address');
  String get editProfile => translate('edit_profile');
  String get changeLanguage => translate('change_language');
  String get logout => translate('logout');
  String get logoutConfirm => translate('logout_confirm');

  // Chatbot
  String get chatbotGreeting => translate('chatbot_greeting');
  String get typeMessage => translate('type_message');
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) {
    return ['en', 'hi', 'as'].contains(locale.languageCode);
  }

  @override
  Future<AppLocalizations> load(Locale locale) async {
    return AppLocalizations(locale);
  }

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}
