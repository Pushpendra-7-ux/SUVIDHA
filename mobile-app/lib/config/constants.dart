class AppConstants {
  // ─── App Info ───
  static const String appName = 'URBAN';
  static const String appTagline = 'Report. Resolve. Improve.';
  static const String appVersion = '1.0.0';

  // ─── API ───
  static const String baseApiUrl = 'http://10.0.2.2:5000/api'; // Android emulator localhost
  static const String analyzeImageEndpoint = '/analyze-image';
  static const String generateQrEndpoint = '/generate-qr';
  static const String complaintsEndpoint = '/complaints';
  static const String healthEndpoint = '/health';

  // ─── Gemini AI (direct from app — no backend needed) ───
  // Replace with your real Gemini API key from https://aistudio.google.com/apikey
  static const String geminiApiKey = 'AIzaSyBgithubPlaceholder_ReplaceMe';
  static const String geminiModel = 'gemini-2.0-flash';

  // ─── Timeouts ───
  static const int splashDuration = 2500; // ms
  static const int otpResendCooldown = 30; // seconds
  static const int otpLength = 6;
  static const int apiTimeout = 30; // seconds
  static const int aiProcessingMinDisplay = 2000; // ms minimum to show AI animation

  // ─── Validation ───
  static const int phoneNumberLength = 10;
  static const String phoneCountryCode = '+91';

  // ─── Issue Types ───
  static const List<String> issueTypes = [
    'pothole',
    'garbage',
    'gas_leak',
    'streetlight',
    'electricity_theft',
    'water_leakage',
    'road_damage',
    'drainage',
    'other',
  ];

  static const Map<String, String> issueLabels = {
    'pothole': 'Pothole',
    'garbage': 'Garbage Dump',
    'gas_leak': 'Gas Leak',
    'streetlight': 'Streetlight Issue',
    'electricity_theft': 'Electricity Theft',
    'water_leakage': 'Water Leakage',
    'road_damage': 'Road Damage',
    'drainage': 'Drainage Problem',
    'other': 'Other',
  };

  static const Map<String, String> issueIcons = {
    'pothole': '🕳️',
    'garbage': '🗑️',
    'gas_leak': '⚠️',
    'streetlight': '💡',
    'electricity_theft': '⚡',
    'water_leakage': '💧',
    'road_damage': '🚧',
    'drainage': '🌊',
    'other': '📋',
  };

  // ─── Departments ───
  static const Map<String, String> issueToDepartment = {
    'pothole': 'Municipal Corporation',
    'garbage': 'Municipal Corporation',
    'gas_leak': 'Gas Department',
    'streetlight': 'Electricity Board',
    'electricity_theft': 'Electricity Board',
    'water_leakage': 'Municipal Corporation',
    'road_damage': 'Municipal Corporation',
    'drainage': 'Municipal Corporation',
    'other': 'Other',
  };

  // ─── Kiosk-compatible mappings ───

  static const Map<String, String> issueToKioskCategory = {
    'pothole': 'Pothole',
    'road_damage': 'Pothole',
    'water_leakage': 'Water Logging',
    'drainage': 'Water Logging',
    'streetlight': 'Electric Fault',
    'electricity_theft': 'Electric Fault',
    'garbage': 'Garbage',
    'gas_leak': 'Gas Issue',
    'other': 'Other',
  };

  static const Map<String, String> issueToKioskDepartment = {
    'pothole': 'Municipal Corporation',
    'road_damage': 'Municipal Corporation',
    'garbage': 'Municipal Corporation',
    'water_leakage': 'Municipal Corporation',
    'drainage': 'Municipal Corporation',
    'streetlight': 'Electricity Board',
    'electricity_theft': 'Electricity Board',
    'gas_leak': 'Gas Department',
    'other': 'Other',
  };

  static const Map<String, String> issueToKioskSubDepartment = {
    'pothole': 'Road Maintenance',
    'road_damage': 'Road Maintenance',
    'water_leakage': 'Drainage',
    'drainage': 'Drainage',
    'streetlight': 'Street Lighting',
    'electricity_theft': 'Street Lighting',
    'garbage': 'Waste Management',
    'gas_leak': 'Gas Pipeline',
    'other': 'Other',
  };

  static const Map<String, String> issueToKioskSeverity = {
    'gas_leak': 'High',
    'electricity_theft': 'High',
    'pothole': 'Medium',
    'road_damage': 'Medium',
    'water_leakage': 'Medium',
    'drainage': 'Medium',
    'garbage': 'Low',
    'streetlight': 'Low',
    'other': 'Low',
  };

  static const List<String> kioskDepartments = [
    'Municipal Corporation',
    'Electricity Board',
    'Gas Department',
    'Other',
  ];

  // ─── Priorities ───
  static const List<String> priorities = ['low', 'medium', 'high'];

  static const Map<String, String> priorityLabels = {
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
  };

  // ─── Complaint Statuses ───
  static const List<String> statuses = [
    'draft',
    'pending',
    'accepted',
    'in_progress',
    'resolved',
    'rejected',
  ];

  static const Map<String, String> statusLabels = {
    'draft': 'Draft',
    'pending': 'Pending',
    'accepted': 'Accepted',
    'in_progress': 'In Progress',
    'resolved': 'Resolved',
    'rejected': 'Rejected',
  };

  // ─── Hive Box Names ───
  static const String hiveSettingsBox = 'settings';
  static const String hiveDraftsBox = 'drafts';
  static const String hiveOfflineQueueBox = 'offline_queue';
  static const String hiveNotificationsBox = 'notifications';

  // ─── Settings Keys ───
  static const String keyLanguage = 'language';
  static const String keyOnboardingDone = 'onboarding_done';
  static const String keyUserName = 'user_name';
  static const String keyUserPhone = 'user_phone';
  static const String keyUserAddress = 'user_address';
  static const String keyUserEmail = 'user_email';

  // ─── Demo Mode ───
  static const bool demoMode = true; // Set false for production
  static const String demoOtp = '123456';
  static const String demoPhone = '9876543210';
}
