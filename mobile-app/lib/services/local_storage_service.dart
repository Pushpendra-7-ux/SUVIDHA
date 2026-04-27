import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../config/constants.dart';
import '../models/complaint.dart';

/// Local storage service using Hive for offline support
class LocalStorageService {
  static late Box _settingsBox;
  static late Box _draftsBox;
  static late Box _offlineQueueBox;
  static late Box _notificationsBox;

  /// Initialize Hive boxes
  static Future<void> init() async {
    await Hive.initFlutter();
    _settingsBox = await Hive.openBox(AppConstants.hiveSettingsBox);
    _draftsBox = await Hive.openBox(AppConstants.hiveDraftsBox);
    _offlineQueueBox = await Hive.openBox(AppConstants.hiveOfflineQueueBox);
    _notificationsBox = await Hive.openBox(AppConstants.hiveNotificationsBox);
    debugPrint('[LocalStorage] Hive initialized');
  }

  // ─── Settings ───

  static Future<void> setSetting(String key, dynamic value) async {
    await _settingsBox.put(key, value);
  }

  static dynamic getSetting(String key, {dynamic defaultValue}) {
    return _settingsBox.get(key, defaultValue: defaultValue);
  }

  static String getLanguage() {
    return _settingsBox.get(AppConstants.keyLanguage, defaultValue: 'en');
  }

  static Future<void> setLanguage(String languageCode) async {
    await _settingsBox.put(AppConstants.keyLanguage, languageCode);
  }

  static bool isOnboardingDone() {
    return _settingsBox.get(AppConstants.keyOnboardingDone, defaultValue: false);
  }

  static Future<void> setOnboardingDone() async {
    await _settingsBox.put(AppConstants.keyOnboardingDone, true);
  }

  static String getUserName() {
    return _settingsBox.get(AppConstants.keyUserName, defaultValue: 'User');
  }

  static Future<void> setUserName(String name) async {
    await _settingsBox.put(AppConstants.keyUserName, name);
  }

  static String getUserPhone() {
    return _settingsBox.get(AppConstants.keyUserPhone, defaultValue: '');
  }

  static Future<void> setUserPhone(String phone) async {
    await _settingsBox.put(AppConstants.keyUserPhone, phone);
  }

  static String getUserAddress() {
    return _settingsBox.get(AppConstants.keyUserAddress, defaultValue: '');
  }

  static Future<void> setUserAddress(String address) async {
    await _settingsBox.put(AppConstants.keyUserAddress, address);
  }

  static String getUserEmail() {
    return _settingsBox.get(AppConstants.keyUserEmail, defaultValue: '');
  }

  static Future<void> setUserEmail(String email) async {
    await _settingsBox.put(AppConstants.keyUserEmail, email);
  }

  // ─── Draft Complaints ───

  static Future<void> saveDraft(Complaint complaint) async {
    final data = jsonEncode(complaint.toMap());
    await _draftsBox.put(complaint.id, data);
    debugPrint('[LocalStorage] Draft saved: ${complaint.id}');
  }

  static List<Complaint> getDrafts() {
    final drafts = <Complaint>[];
    for (var key in _draftsBox.keys) {
      try {
        final data = jsonDecode(_draftsBox.get(key));
        drafts.add(Complaint.fromMap(data));
      } catch (e) {
        debugPrint('[LocalStorage] Error reading draft $key: $e');
      }
    }
    return drafts;
  }

  static Complaint? getDraft(String id) {
    try {
      final data = _draftsBox.get(id);
      if (data != null) {
        return Complaint.fromMap(jsonDecode(data));
      }
    } catch (e) {
      debugPrint('[LocalStorage] Error reading draft $id: $e');
    }
    return null;
  }

  static Future<void> deleteDraft(String id) async {
    await _draftsBox.delete(id);
    debugPrint('[LocalStorage] Draft deleted: $id');
  }

  // ─── Offline Queue ───

  static Future<void> addToOfflineQueue(Complaint complaint) async {
    final data = jsonEncode(complaint.toMap());
    await _offlineQueueBox.put(complaint.id, data);
    debugPrint('[LocalStorage] Added to offline queue: ${complaint.id}');
  }

  static List<Complaint> getOfflineQueue() {
    final queue = <Complaint>[];
    for (var key in _offlineQueueBox.keys) {
      try {
        final data = jsonDecode(_offlineQueueBox.get(key));
        queue.add(Complaint.fromMap(data));
      } catch (e) {
        debugPrint('[LocalStorage] Error reading queue item $key: $e');
      }
    }
    return queue;
  }

  static Future<void> removeFromOfflineQueue(String id) async {
    await _offlineQueueBox.delete(id);
  }

  static Future<void> clearOfflineQueue() async {
    await _offlineQueueBox.clear();
  }

  // ─── Clear All ───

  static Future<void> clearAll() async {
    await _settingsBox.clear();
    await _draftsBox.clear();
    await _offlineQueueBox.clear();
    await _notificationsBox.clear();
    debugPrint('[LocalStorage] All data cleared');
  }
}
