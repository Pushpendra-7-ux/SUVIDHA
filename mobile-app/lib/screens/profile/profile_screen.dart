import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/routes.dart';
import '../../providers/auth_provider.dart';
import '../../providers/language_provider.dart';
import '../../services/local_storage_service.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});
  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _isEditing = false;
  late TextEditingController _nameController;
  late TextEditingController _addressController;
  late TextEditingController _emailController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: LocalStorageService.getUserName());
    _addressController = TextEditingController(text: LocalStorageService.getUserAddress());
    _emailController = TextEditingController(text: LocalStorageService.getUserEmail());
  }

  @override
  void dispose() { _nameController.dispose(); _addressController.dispose(); _emailController.dispose(); super.dispose(); }

  void _save() {
    LocalStorageService.setUserName(_nameController.text.trim());
    LocalStorageService.setUserAddress(_addressController.text.trim());
    LocalStorageService.setUserEmail(_emailController.text.trim());
    setState(() => _isEditing = false);
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Profile updated')));
  }

  void _logout() {
    showDialog(context: context, builder: (ctx) => AlertDialog(
      title: Text('Logout', style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
      content: Text('Are you sure you want to logout?', style: GoogleFonts.poppins()),
      actions: [
        TextButton(onPressed: () => Navigator.pop(ctx),
          child: Text('Cancel', style: GoogleFonts.poppins())),
        ElevatedButton(
          onPressed: () {
            Provider.of<AuthProvider>(context, listen: false).logout();
            Navigator.pop(ctx);
            context.go(AppRoutes.login);
          },
          style: ElevatedButton.styleFrom(backgroundColor: UrbanTheme.error),
          child: Text('Logout', style: GoogleFonts.poppins()),
        ),
      ],
    ));
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final lang = Provider.of<LanguageProvider>(context);

    return Scaffold(
      backgroundColor: UrbanTheme.backgroundLight,
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          if (!_isEditing)
            IconButton(
              icon: const Icon(Icons.edit_rounded),
              tooltip: 'Edit profile',
              onPressed: () => setState(() => _isEditing = true),
            ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Avatar
            Semantics(
              label: 'Profile avatar',
              child: Container(
                width: 80, height: 80,
                decoration: BoxDecoration(
                  color: UrbanTheme.primaryNavy.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.person_rounded, size: 40, color: UrbanTheme.primaryNavy),
              ),
            ),
            const SizedBox(height: 12),
            Text(_nameController.text.isEmpty ? 'User' : _nameController.text,
              style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w700)),
            Text(auth.phone ?? '', style: GoogleFonts.poppins(fontSize: 13, color: UrbanTheme.textSecondary)),
            const SizedBox(height: 28),
            // Fields
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white, borderRadius: BorderRadius.circular(14),
              ),
              child: Column(children: [
                _Field(label: 'Name', controller: _nameController, enabled: _isEditing, icon: Icons.person_outline),
                const Divider(height: 24),
                _Field(label: 'Mobile', controller: TextEditingController(text: auth.phone ?? ''),
                  enabled: false, icon: Icons.phone_outlined),
                const Divider(height: 24),
                _Field(label: 'Email', controller: _emailController, enabled: _isEditing, icon: Icons.email_outlined),
                const Divider(height: 24),
                _Field(label: 'Address', controller: _addressController, enabled: _isEditing, icon: Icons.location_on_outlined),
              ]),
            ),
            if (_isEditing) ...[
              const SizedBox(height: 16),
              Semantics(
                button: true,
                label: 'Save profile changes',
                child: SizedBox(width: double.infinity, height: 50,
                  child: ElevatedButton(onPressed: _save,
                    child: Text('Save Changes', style: GoogleFonts.poppins(fontWeight: FontWeight.w600)))),
              ),
            ],
            const SizedBox(height: 16),
            // Language
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14)),
              child: Row(children: [
                const Icon(Icons.language_rounded, color: UrbanTheme.primaryNavy),
                const SizedBox(width: 12),
                Expanded(child: Text('Language', style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w500))),
                DropdownButton<String>(
                  value: lang.languageCode,
                  underline: const SizedBox(),
                  items: [
                    DropdownMenuItem(value: 'en', child: Text('English', style: GoogleFonts.poppins(fontSize: 13))),
                    DropdownMenuItem(value: 'hi', child: Text('हिंदी', style: GoogleFonts.poppins(fontSize: 13))),
                    DropdownMenuItem(value: 'as', child: Text('অসমীয়া', style: GoogleFonts.poppins(fontSize: 13))),
                  ],
                  onChanged: (v) { if (v != null) lang.setLanguage(v); },
                ),
              ]),
            ),
            const SizedBox(height: 16),
            // App info
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14)),
              child: Row(children: [
                const Icon(Icons.info_outline_rounded, color: UrbanTheme.textSecondary),
                const SizedBox(width: 12),
                Expanded(child: Text('App Version', style: GoogleFonts.poppins(fontSize: 14))),
                Text('1.0.0', style: GoogleFonts.poppins(fontSize: 13, color: UrbanTheme.textSecondary)),
              ]),
            ),
            const SizedBox(height: 24),
            // Logout
            Semantics(
              button: true,
              label: 'Logout',
              child: SizedBox(width: double.infinity, height: 50,
                child: OutlinedButton.icon(
                  onPressed: _logout,
                  icon: const Icon(Icons.logout_rounded, color: UrbanTheme.error),
                  label: Text('Logout', style: GoogleFonts.poppins(
                    fontWeight: FontWeight.w600, color: UrbanTheme.error)),
                  style: OutlinedButton.styleFrom(side: const BorderSide(color: UrbanTheme.error)),
                )),
            ),
          ],
        ),
      ),
    );
  }
}

class _Field extends StatelessWidget {
  final String label;
  final TextEditingController controller;
  final bool enabled;
  final IconData icon;
  const _Field({required this.label, required this.controller, required this.enabled, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: '$label: ${controller.text.isEmpty ? "Not set" : controller.text}',
      textField: enabled,
      child: Row(children: [
        Icon(icon, size: 20, color: UrbanTheme.primaryNavy),
        const SizedBox(width: 12),
        Expanded(child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: GoogleFonts.poppins(fontSize: 11, color: UrbanTheme.textSecondary)),
            enabled
              ? TextField(controller: controller, style: GoogleFonts.poppins(fontSize: 14),
                  decoration: const InputDecoration(isDense: true, contentPadding: EdgeInsets.symmetric(vertical: 4),
                    border: UnderlineInputBorder()))
              : Text(controller.text.isEmpty ? 'Not set' : controller.text,
                  style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w500)),
          ],
        )),
      ]),
    );
  }
}
