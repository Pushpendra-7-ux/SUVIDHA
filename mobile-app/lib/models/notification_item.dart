class NotificationItem {
  final String id;
  final String title;
  final String body;
  final String? complaintId;
  final String type; // complaint_accepted, assigned, resolved, general
  final DateTime timestamp;
  bool isRead;

  NotificationItem({
    required this.id,
    required this.title,
    required this.body,
    this.complaintId,
    this.type = 'general',
    required this.timestamp,
    this.isRead = false,
  });

  factory NotificationItem.fromMap(Map<String, dynamic> map) {
    return NotificationItem(
      id: map['id'] ?? '',
      title: map['title'] ?? '',
      body: map['body'] ?? '',
      complaintId: map['complaintId'],
      type: map['type'] ?? 'general',
      timestamp: map['timestamp'] != null
          ? DateTime.parse(map['timestamp'])
          : DateTime.now(),
      isRead: map['isRead'] ?? false,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'body': body,
      'complaintId': complaintId,
      'type': type,
      'timestamp': timestamp.toIso8601String(),
      'isRead': isRead,
    };
  }
}
