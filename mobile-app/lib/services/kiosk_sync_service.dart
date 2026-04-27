import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

/// Parsed result from a kiosk QR code URL
class KioskQrData {
  final String baseDomain;
  final String sessionId;

  KioskQrData({required this.baseDomain, required this.sessionId});

  String get syncUrl => '$baseDomain/api/complaint-sync/$sessionId';
}

/// Service for parsing kiosk QR codes and POSTing complaint data
class KioskSyncService {
  /// Parse a kiosk QR code URL string.
  /// Input: https://suvidha-kiosk-sync.onrender.com/mobile.html?session=complaint-1713876-xyza
  /// Output: KioskQrData with baseDomain and sessionId
  static KioskQrData? parseKioskQrUrl(String qrUrl) {
    try {
      final uri = Uri.parse(qrUrl.trim());

      // Extract base domain (scheme + host + port)
      final baseDomain = '${uri.scheme}://${uri.host}${uri.hasPort && uri.port != 443 && uri.port != 80 ? ':${uri.port}' : ''}';

      // Extract session ID from ?session= parameter
      final sessionId = uri.queryParameters['session'];

      if (sessionId == null || sessionId.isEmpty) {
        debugPrint('[KioskSync] No session parameter found in QR URL');
        return null;
      }

      debugPrint('[KioskSync] Parsed QR → base: $baseDomain, session: $sessionId');
      return KioskQrData(baseDomain: baseDomain, sessionId: sessionId);
    } catch (e) {
      debugPrint('[KioskSync] Failed to parse QR URL: $e');
      return null;
    }
  }

  /// POST the complaint payload to the kiosk sync server.
  /// URL: <baseDomain>/api/complaint-sync/<sessionId>
  static Future<KioskSyncResult> syncToKiosk(KioskQrData qrData, Map<String, dynamic> payload) async {
    final url = qrData.syncUrl;
    debugPrint('[KioskSync] POSTing to: $url');
    debugPrint('[KioskSync] Payload keys: ${payload.keys.toList()}');

    try {
      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: jsonEncode(payload),
      ).timeout(const Duration(seconds: 30));

      debugPrint('[KioskSync] Response: ${response.statusCode}');

      if (response.statusCode >= 200 && response.statusCode < 300) {
        Map<String, dynamic>? responseBody;
        try {
          responseBody = jsonDecode(response.body);
        } catch (_) {}

        return KioskSyncResult(
          success: true,
          message: responseBody?['message'] ?? 'Complaint synced to kiosk successfully!',
          statusCode: response.statusCode,
        );
      } else {
        String errorMsg = 'Server error: ${response.statusCode}';
        try {
          final body = jsonDecode(response.body);
          errorMsg = body['error'] ?? body['message'] ?? errorMsg;
        } catch (_) {}

        return KioskSyncResult(
          success: false,
          message: errorMsg,
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      debugPrint('[KioskSync] Network error: $e');
      return KioskSyncResult(
        success: false,
        message: 'Network error: Could not reach kiosk server. Please check your connection.',
        statusCode: 0,
      );
    }
  }
}

class KioskSyncResult {
  final bool success;
  final String message;
  final int statusCode;

  KioskSyncResult({
    required this.success,
    required this.message,
    required this.statusCode,
  });
}
