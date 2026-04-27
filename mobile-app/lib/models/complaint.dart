class TimelineEvent {
  final String status;
  final String message;
  final DateTime timestamp;

  TimelineEvent({
    required this.status,
    required this.message,
    required this.timestamp,
  });

  factory TimelineEvent.fromMap(Map<String, dynamic> map) {
    return TimelineEvent(
      status: map['status'] ?? '',
      message: map['message'] ?? '',
      timestamp: map['timestamp'] != null
          ? DateTime.parse(map['timestamp'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'status': status,
      'message': message,
      'timestamp': timestamp.toIso8601String(),
    };
  }
}

class Complaint {
  final String id;
  final String userId;
  String issueType;
  String description;
  String department;
  String priority;
  double confidenceScore;
  String? localImagePath;
  String? imageUrl;
  double? latitude;
  double? longitude;
  String? address;
  String? landmark;
  String? city;
  String? state;
  String? pincode;
  String status;
  String? qrData;
  String? extraNotes;
  // Kiosk-specific fields
  String? kioskCategory;
  String? subDepartment;
  String? severity;
  String? aiPhotoDescription;
  String? imageBase64Url;
  DateTime createdAt;
  DateTime updatedAt;
  List<TimelineEvent> timeline;

  Complaint({
    required this.id,
    required this.userId,
    required this.issueType,
    required this.description,
    required this.department,
    required this.priority,
    this.confidenceScore = 0.0,
    this.localImagePath,
    this.imageUrl,
    this.latitude,
    this.longitude,
    this.address,
    this.landmark,
    this.city,
    this.state,
    this.pincode,
    this.status = 'draft',
    this.qrData,
    this.extraNotes,
    this.kioskCategory,
    this.subDepartment,
    this.severity,
    this.aiPhotoDescription,
    this.imageBase64Url,
    DateTime? createdAt,
    DateTime? updatedAt,
    List<TimelineEvent>? timeline,
  })  : createdAt = createdAt ?? DateTime.now(),
        updatedAt = updatedAt ?? DateTime.now(),
        timeline = timeline ?? [];

  factory Complaint.fromMap(Map<String, dynamic> map) {
    return Complaint(
      id: map['id'] ?? '',
      userId: map['userId'] ?? '',
      issueType: map['issueType'] ?? 'other',
      description: map['description'] ?? '',
      department: map['department'] ?? '',
      priority: map['priority'] ?? 'medium',
      confidenceScore: (map['confidenceScore'] ?? 0.0).toDouble(),
      localImagePath: map['localImagePath'],
      imageUrl: map['imageUrl'],
      latitude: map['latitude']?.toDouble(),
      longitude: map['longitude']?.toDouble(),
      address: map['address'],
      landmark: map['landmark'],
      city: map['city'],
      state: map['state'],
      pincode: map['pincode'],
      status: map['status'] ?? 'draft',
      qrData: map['qrData'],
      extraNotes: map['extraNotes'],
      kioskCategory: map['kioskCategory'],
      subDepartment: map['subDepartment'],
      severity: map['severity'],
      aiPhotoDescription: map['aiPhotoDescription'],
      imageBase64Url: map['imageBase64Url'],
      createdAt: map['createdAt'] != null
          ? DateTime.parse(map['createdAt'])
          : DateTime.now(),
      updatedAt: map['updatedAt'] != null
          ? DateTime.parse(map['updatedAt'])
          : DateTime.now(),
      timeline: map['timeline'] != null
          ? (map['timeline'] as List)
              .map((e) => TimelineEvent.fromMap(e as Map<String, dynamic>))
              .toList()
          : [],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'userId': userId,
      'issueType': issueType,
      'description': description,
      'department': department,
      'priority': priority,
      'confidenceScore': confidenceScore,
      'localImagePath': localImagePath,
      'imageUrl': imageUrl,
      'latitude': latitude,
      'longitude': longitude,
      'address': address,
      'landmark': landmark,
      'city': city,
      'state': state,
      'pincode': pincode,
      'status': status,
      'qrData': qrData,
      'extraNotes': extraNotes,
      'kioskCategory': kioskCategory,
      'subDepartment': subDepartment,
      'severity': severity,
      'aiPhotoDescription': aiPhotoDescription,
      'imageBase64Url': imageBase64Url,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'timeline': timeline.map((e) => e.toMap()).toList(),
    };
  }

  /// Build the exact JSON payload required by the kiosk sync server.
  Map<String, dynamic> toKioskPayload({
    required String userName,
    required String userPhone,
    required String userEmail,
    required String userAddress,
  }) {
    return {
      'photos': [
        {
          // Don't send full base64 image — causes 413 Payload Too Large
          // Send image URL if available, otherwise empty string
          'url': imageUrl ?? '',
          'description': aiPhotoDescription ?? 'Photo of civic issue',
        }
      ],
      'location': {
        'latitude': latitude ?? 0.0,
        'longitude': longitude ?? 0.0,
        'address': address ?? '',
        'landmark': landmark ?? '',
        'city': city ?? '',
        'state': state ?? '',
        'pincode': pincode ?? '',
      },
      'problem': {
        'category': kioskCategory ?? _mapIssueToKioskCategory(issueType),
        'description': description,
        'severity': severity ?? _capitalizePriority(priority),
      },
      'department': {
        'name': _mapToKioskDepartment(department),
        'subDepartment': subDepartment ?? _mapIssueToSubDepartment(issueType),
      },
      'complaintFiler': {
        'name': userName,
        'phone': userPhone,
        'email': userEmail,
        'address': userAddress,
        'userId': userId,
      },
    };
  }

  static String _mapIssueToKioskCategory(String issueType) {
    const map = {
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
    return map[issueType] ?? 'Other';
  }

  static String _mapToKioskDepartment(String department) {
    if (department.contains('Municipal') || department.contains('Sanitation') ||
        department.contains('Public Works') || department.contains('Water Supply')) {
      return 'Municipal Corporation';
    }
    if (department.contains('Electricity')) return 'Electricity Board';
    if (department.contains('Gas')) return 'Gas Department';
    return 'Other';
  }

  static String _mapIssueToSubDepartment(String issueType) {
    const map = {
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
    return map[issueType] ?? 'Other';
  }

  static String _capitalizePriority(String p) {
    if (p.isEmpty) return 'Medium';
    return p[0].toUpperCase() + p.substring(1).toLowerCase();
  }

  Complaint copyWith({
    String? issueType,
    String? description,
    String? department,
    String? priority,
    double? confidenceScore,
    String? localImagePath,
    String? imageUrl,
    double? latitude,
    double? longitude,
    String? address,
    String? landmark,
    String? city,
    String? state,
    String? pincode,
    String? status,
    String? qrData,
    String? extraNotes,
    String? kioskCategory,
    String? subDepartment,
    String? severity,
    String? aiPhotoDescription,
    String? imageBase64Url,
    List<TimelineEvent>? timeline,
  }) {
    return Complaint(
      id: id,
      userId: userId,
      issueType: issueType ?? this.issueType,
      description: description ?? this.description,
      department: department ?? this.department,
      priority: priority ?? this.priority,
      confidenceScore: confidenceScore ?? this.confidenceScore,
      localImagePath: localImagePath ?? this.localImagePath,
      imageUrl: imageUrl ?? this.imageUrl,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      address: address ?? this.address,
      landmark: landmark ?? this.landmark,
      city: city ?? this.city,
      state: state ?? this.state,
      pincode: pincode ?? this.pincode,
      status: status ?? this.status,
      qrData: qrData ?? this.qrData,
      extraNotes: extraNotes ?? this.extraNotes,
      kioskCategory: kioskCategory ?? this.kioskCategory,
      subDepartment: subDepartment ?? this.subDepartment,
      severity: severity ?? this.severity,
      aiPhotoDescription: aiPhotoDescription ?? this.aiPhotoDescription,
      imageBase64Url: imageBase64Url ?? this.imageBase64Url,
      createdAt: createdAt,
      updatedAt: DateTime.now(),
      timeline: timeline ?? this.timeline,
    );
  }

  @override
  String toString() => 'Complaint(id: $id, type: $issueType, status: $status)';
}
