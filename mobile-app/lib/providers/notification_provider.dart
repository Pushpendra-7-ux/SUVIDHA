import 'package:flutter/material.dart';
import '../models/notification_item.dart';
import 'package:uuid/uuid.dart';

class NotificationProvider extends ChangeNotifier {
  final _uuid = const Uuid();
  List<NotificationItem> _notifications = [];

  List<NotificationItem> get notifications => _notifications;
  int get unreadCount => _notifications.where((n) => !n.isRead).length;

  NotificationProvider() {
    _loadMockNotifications();
  }

  void _loadMockNotifications() {
    _notifications = [
      NotificationItem(
        id: _uuid.v4(), title: 'Complaint Accepted',
        body: 'Your pothole complaint on MG Road has been accepted by Municipal Corporation.',
        complaintId: 'mock_1', type: 'complaint_accepted',
        timestamp: DateTime.now().subtract(const Duration(days: 2)),
      ),
      NotificationItem(
        id: _uuid.v4(), title: 'Crew Assigned',
        body: 'A repair crew has been assigned to fix the pothole on MG Road.',
        complaintId: 'mock_1', type: 'assigned',
        timestamp: DateTime.now().subtract(const Duration(days: 1)),
      ),
      NotificationItem(
        id: _uuid.v4(), title: 'Issue Resolved',
        body: 'The garbage dump near Zoo Road has been cleaned successfully.',
        complaintId: 'mock_2', type: 'resolved',
        timestamp: DateTime.now().subtract(const Duration(days: 4)), isRead: true,
      ),
    ];
  }

  void markAsRead(String id) {
    final index = _notifications.indexWhere((n) => n.id == id);
    if (index != -1) {
      _notifications[index].isRead = true;
      notifyListeners();
    }
  }

  void markAllAsRead() {
    for (var n in _notifications) { n.isRead = true; }
    notifyListeners();
  }

  void addNotification(NotificationItem notification) {
    _notifications.insert(0, notification);
    notifyListeners();
  }
}
