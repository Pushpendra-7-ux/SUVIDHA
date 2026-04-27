import 'package:flutter/material.dart';
import '../models/complaint.dart';
import '../services/ai_service.dart';
import '../services/local_storage_service.dart';
import '../services/kiosk_sync_service.dart';
import '../config/constants.dart';
import 'package:uuid/uuid.dart';

class ComplaintProvider extends ChangeNotifier {
  final AiService _aiService = AiService();
  final _uuid = const Uuid();

  Complaint? _currentComplaint;
  AiAnalysisResult? _aiResult;
  List<Complaint> _complaints = [];
  List<Complaint> _drafts = [];
  bool _isAnalyzing = false;
  bool _isLoading = false;
  bool _isSyncing = false;
  String? _error;
  KioskSyncResult? _lastSyncResult;

  Complaint? get currentComplaint => _currentComplaint;
  AiAnalysisResult? get aiResult => _aiResult;
  List<Complaint> get complaints => _complaints;
  List<Complaint> get drafts => _drafts;
  bool get isAnalyzing => _isAnalyzing;
  bool get isLoading => _isLoading;
  bool get isSyncing => _isSyncing;
  String? get error => _error;
  KioskSyncResult? get lastSyncResult => _lastSyncResult;

  /// Start a new complaint with captured image
  void startNewComplaint(String imagePath, String userId) {
    _currentComplaint = Complaint(
      id: _uuid.v4(),
      userId: userId,
      issueType: 'other',
      description: '',
      department: 'Municipal Corporation',
      priority: 'medium',
      localImagePath: imagePath,
      status: 'draft',
    );
    _aiResult = null;
    _error = null;
    _lastSyncResult = null;
    notifyListeners();
  }

  /// Run AI analysis on the captured image
  Future<void> analyzeImage() async {
    if (_currentComplaint?.localImagePath == null) return;
    _isAnalyzing = true;
    _error = null;
    notifyListeners();

    try {
      final results = await Future.wait([
        _aiService.analyzeImage(_currentComplaint!.localImagePath!),
        Future.delayed(const Duration(milliseconds: 2000)),
      ]);
      _aiResult = results[0] as AiAnalysisResult;
      _currentComplaint = _currentComplaint!.copyWith(
        issueType: _aiResult!.issueType,
        description: _aiResult!.description,
        department: _aiResult!.department,
        priority: _aiResult!.priority,
        confidenceScore: _aiResult!.confidence,
        // Kiosk-specific fields from AI
        kioskCategory: _aiResult!.category,
        subDepartment: _aiResult!.subDepartment,
        severity: _aiResult!.severity,
        aiPhotoDescription: _aiResult!.photoDescription,
        imageBase64Url: _aiResult!.imageBase64Url,
      );
    } catch (e) {
      _error = 'Analysis failed. Please select manually.';
      debugPrint('[ComplaintProvider] AI error: $e');
    }
    _isAnalyzing = false;
    notifyListeners();
  }

  /// Update complaint fields from AI result screen
  void updateComplaintFields({
    String? issueType, String? description, String? department,
    String? priority, String? extraNotes,
  }) {
    if (_currentComplaint == null) return;
    _currentComplaint = _currentComplaint!.copyWith(
      issueType: issueType,
      description: description,
      department: department ?? (issueType != null ? AppConstants.issueToDepartment[issueType] : null),
      priority: priority,
      extraNotes: extraNotes,
      // Update kiosk fields when issue type changes
      kioskCategory: issueType != null ? AppConstants.issueToKioskCategory[issueType] : null,
      subDepartment: issueType != null ? AppConstants.issueToKioskSubDepartment[issueType] : null,
      severity: issueType != null ? AppConstants.issueToKioskSeverity[issueType] : null,
    );
    notifyListeners();
  }

  /// Update location with separate city/state/pincode
  void updateLocation(double lat, double lng, String address, {
    String? landmark, String? city, String? state, String? pincode,
  }) {
    if (_currentComplaint == null) return;
    _currentComplaint = _currentComplaint!.copyWith(
      latitude: lat, longitude: lng, address: address,
      landmark: landmark, city: city, state: state, pincode: pincode,
    );
    notifyListeners();
  }

  /// Update QR data
  void setQrData(String qrData) {
    if (_currentComplaint == null) return;
    _currentComplaint = _currentComplaint!.copyWith(qrData: qrData, status: 'pending');
    notifyListeners();
  }

  /// Save current complaint as draft
  Future<void> saveDraft() async {
    if (_currentComplaint == null) return;
    _currentComplaint = _currentComplaint!.copyWith(status: 'draft');
    await LocalStorageService.saveDraft(_currentComplaint!);
    _drafts = LocalStorageService.getDrafts();
    notifyListeners();
  }

  /// Load a specific draft for kiosk upload
  void loadDraftForUpload(String draftId) {
    final draft = LocalStorageService.getDraft(draftId);
    if (draft != null) {
      _currentComplaint = draft;
      _error = null;
      _lastSyncResult = null;
      notifyListeners();
      debugPrint('[ComplaintProvider] Loaded draft $draftId for upload');
    }
  }

  /// Sync current complaint to kiosk via scanned QR URL
  Future<KioskSyncResult> syncToKiosk(String qrUrl) async {
    _isSyncing = true;
    _error = null;
    notifyListeners();

    try {
      final qrData = KioskSyncService.parseKioskQrUrl(qrUrl);
      if (qrData == null) {
        _isSyncing = false;
        _lastSyncResult = KioskSyncResult(
          success: false, message: 'Invalid QR code. Not a valid kiosk URL.', statusCode: 0,
        );
        notifyListeners();
        return _lastSyncResult!;
      }

      if (_currentComplaint == null) {
        _isSyncing = false;
        _lastSyncResult = KioskSyncResult(
          success: false, message: 'No complaint data to sync.', statusCode: 0,
        );
        notifyListeners();
        return _lastSyncResult!;
      }

      // Build the exact kiosk payload
      final payload = _currentComplaint!.toKioskPayload(
        userName: LocalStorageService.getUserName(),
        userPhone: LocalStorageService.getUserPhone(),
        userEmail: LocalStorageService.getUserEmail(),
        userAddress: LocalStorageService.getUserAddress(),
      );

      final result = await KioskSyncService.syncToKiosk(qrData, payload);
      _lastSyncResult = result;

      if (result.success) {
        // Mark as submitted and remove from drafts
        _currentComplaint = _currentComplaint!.copyWith(status: 'pending');
        _complaints.insert(0, _currentComplaint!);
        await LocalStorageService.deleteDraft(_currentComplaint!.id);
        _drafts = LocalStorageService.getDrafts();
      }
    } catch (e) {
      _lastSyncResult = KioskSyncResult(
        success: false, message: 'Sync failed: $e', statusCode: 0,
      );
      debugPrint('[ComplaintProvider] Kiosk sync error: $e');
    }

    _isSyncing = false;
    notifyListeners();
    return _lastSyncResult!;
  }

  /// Submit complaint (local - would go to Firestore)
  Future<void> submitComplaint() async {
    if (_currentComplaint == null) return;
    _isLoading = true;
    notifyListeners();

    try {
      _currentComplaint = _currentComplaint!.copyWith(
        status: 'pending',
        timeline: [
          ..._currentComplaint!.timeline,
          TimelineEvent(status: 'pending', message: 'Complaint submitted', timestamp: DateTime.now()),
        ],
      );
      _complaints.insert(0, _currentComplaint!);
      await LocalStorageService.deleteDraft(_currentComplaint!.id);
    } catch (e) {
      _error = 'Failed to submit. Saved as draft.';
      await saveDraft();
    }
    _isLoading = false;
    notifyListeners();
  }

  /// Load drafts from local storage
  void loadDrafts() {
    _drafts = LocalStorageService.getDrafts();
    notifyListeners();
  }

  /// Load mock complaints for demo
  void loadMockComplaints(String userId) {
    if (_complaints.isNotEmpty) return;
    _complaints = [
      Complaint(
        id: 'mock_1', userId: userId, issueType: 'pothole',
        description: 'Large pothole on MG Road near City Center mall.',
        department: 'Municipal Corporation', priority: 'high',
        confidenceScore: 0.94, status: 'in_progress',
        latitude: 26.1445, longitude: 91.7362, address: 'MG Road, Guwahati',
        city: 'Guwahati', state: 'Assam', pincode: '781001',
        kioskCategory: 'Pothole', subDepartment: 'Road Maintenance', severity: 'High',
        createdAt: DateTime.now().subtract(const Duration(days: 3)),
        timeline: [
          TimelineEvent(status: 'pending', message: 'Complaint submitted', timestamp: DateTime.now().subtract(const Duration(days: 3))),
          TimelineEvent(status: 'accepted', message: 'Accepted by Municipal Corporation', timestamp: DateTime.now().subtract(const Duration(days: 2))),
          TimelineEvent(status: 'in_progress', message: 'Repair crew assigned', timestamp: DateTime.now().subtract(const Duration(days: 1))),
        ],
      ),
      Complaint(
        id: 'mock_2', userId: userId, issueType: 'garbage',
        description: 'Garbage dump accumulating near residential area.',
        department: 'Municipal Corporation', priority: 'medium',
        confidenceScore: 0.88, status: 'resolved',
        latitude: 26.1500, longitude: 91.7400, address: 'Zoo Road, Guwahati',
        city: 'Guwahati', state: 'Assam', pincode: '781024',
        kioskCategory: 'Garbage', subDepartment: 'Waste Management', severity: 'Low',
        createdAt: DateTime.now().subtract(const Duration(days: 7)),
        timeline: [
          TimelineEvent(status: 'pending', message: 'Complaint submitted', timestamp: DateTime.now().subtract(const Duration(days: 7))),
          TimelineEvent(status: 'resolved', message: 'Area cleaned', timestamp: DateTime.now().subtract(const Duration(days: 4))),
        ],
      ),
      Complaint(
        id: 'mock_3', userId: userId, issueType: 'streetlight',
        description: 'Streetlight not working near bus stop.',
        department: 'Electricity Board', priority: 'low',
        confidenceScore: 0.91, status: 'pending',
        latitude: 26.1380, longitude: 91.7300, address: 'GS Road, Guwahati',
        city: 'Guwahati', state: 'Assam', pincode: '781005',
        kioskCategory: 'Electric Fault', subDepartment: 'Street Lighting', severity: 'Low',
        createdAt: DateTime.now().subtract(const Duration(days: 1)),
        timeline: [
          TimelineEvent(status: 'pending', message: 'Complaint submitted', timestamp: DateTime.now().subtract(const Duration(days: 1))),
        ],
      ),
    ];
    notifyListeners();
  }

  void clearCurrent() {
    _currentComplaint = null;
    _aiResult = null;
    _error = null;
    _lastSyncResult = null;
    notifyListeners();
  }
}
