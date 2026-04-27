import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../config/theme.dart';

class ChatbotScreen extends StatefulWidget {
  const ChatbotScreen({super.key});
  @override
  State<ChatbotScreen> createState() => _ChatbotScreenState();
}

class _ChatbotScreenState extends State<ChatbotScreen> {
  final _controller = TextEditingController();
  final _scrollController = ScrollController();
  final List<_ChatMessage> _messages = [
    _ChatMessage(text: "Hi! I'm your URBAN assistant. How can I help you today?", isBot: true),
    _ChatMessage(text: "You can ask me about:", isBot: true),
    _ChatMessage(text: "• How to report an issue\n• Track your complaints\n• Find nearby kiosks\n• Supported issue types", isBot: true),
  ];

  final _quickReplies = [
    'How to report?',
    'Track complaint',
    'Issue types',
    'Find kiosk',
  ];

  void _sendMessage(String text) {
    if (text.trim().isEmpty) return;
    setState(() {
      _messages.add(_ChatMessage(text: text.trim(), isBot: false));
    });
    _controller.clear();
    _scrollToBottom();
    Future.delayed(const Duration(milliseconds: 800), () {
      if (!mounted) return;
      setState(() => _messages.add(_ChatMessage(text: _getResponse(text), isBot: true)));
      _scrollToBottom();
    });
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(_scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300), curve: Curves.easeOut);
      }
    });
  }

  String _getResponse(String input) {
    final lower = input.toLowerCase();
    if (lower.contains('report')) {
      return "To report an issue:\n1. Tap 'Report Issue' on home\n2. Take a photo\n3. AI will detect the problem\n4. Confirm location\n5. Generate QR code\n6. Scan at a kiosk";
    }
    if (lower.contains('track') || lower.contains('status')) {
      return "Go to 'My Complaints' to see all your reports. Each complaint shows its current status and timeline updates.";
    }
    if (lower.contains('type') || lower.contains('issue')) {
      return "We support: Potholes, Garbage, Gas Leaks, Streetlight Issues, Electricity Theft, Water Leakage, Road Damage, and Drainage Problems.";
    }
    if (lower.contains('kiosk')) {
      return "URBAN kiosks are located at major public offices, bus stations, and municipal buildings. Check the app's map for nearest locations.";
    }
    if (lower.contains('hello') || lower.contains('hi')) {
      return "Hello! How can I assist you today? 😊";
    }
    return "I can help with reporting issues, tracking complaints, finding kiosks, and understanding issue types. What would you like to know?";
  }

  @override
  void dispose() { _controller.dispose(); _scrollController.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: UrbanTheme.backgroundLight,
      appBar: AppBar(
        title: Row(children: [
          Container(
            width: 32, height: 32,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(8)),
            child: const Icon(Icons.smart_toy_rounded, size: 18, color: Colors.white),
          ),
          const SizedBox(width: 10),
          const Text('URBAN Assistant'),
        ]),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, i) {
                final m = _messages[i];
                return _buildBubble(m);
              },
            ),
          ),
          // Quick replies
          if (_messages.length < 5)
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: Row(
                children: _quickReplies.map((r) => Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ActionChip(
                    label: Text(r, style: GoogleFonts.poppins(fontSize: 12)),
                    onPressed: () => _sendMessage(r),
                    backgroundColor: Colors.white,
                    side: const BorderSide(color: UrbanTheme.primaryNavy),
                  ),
                )).toList(),
              ),
            ),
          // Input
          Container(
            padding: const EdgeInsets.fromLTRB(16, 8, 8, 16),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 8, offset: const Offset(0, -2))],
            ),
            child: SafeArea(
              top: false,
              child: Row(children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    style: GoogleFonts.poppins(fontSize: 14),
                    decoration: InputDecoration(
                      hintText: 'Type a message...',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(24), borderSide: BorderSide.none),
                      filled: true, fillColor: UrbanTheme.backgroundLight,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    ),
                    onSubmitted: _sendMessage,
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  decoration: const BoxDecoration(color: UrbanTheme.primaryNavy, shape: BoxShape.circle),
                  child: IconButton(
                    icon: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
                    onPressed: () => _sendMessage(_controller.text),
                  ),
                ),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBubble(_ChatMessage m) {
    return Align(
      alignment: m.isBot ? Alignment.centerLeft : Alignment.centerRight,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.78),
        decoration: BoxDecoration(
          color: m.isBot ? Colors.white : UrbanTheme.primaryNavy,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16), topRight: const Radius.circular(16),
            bottomLeft: Radius.circular(m.isBot ? 4 : 16),
            bottomRight: Radius.circular(m.isBot ? 16 : 4),
          ),
          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 4)],
        ),
        child: Text(m.text, style: GoogleFonts.poppins(
          fontSize: 13, color: m.isBot ? UrbanTheme.textPrimary : Colors.white, height: 1.4)),
      ),
    );
  }
}

class _ChatMessage {
  final String text;
  final bool isBot;
  _ChatMessage({required this.text, required this.isBot});
}
