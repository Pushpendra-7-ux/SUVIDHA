import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/routes.dart';
import '../../providers/auth_provider.dart';
import '../../providers/complaint_provider.dart';

class CaptureScreen extends StatefulWidget {
  const CaptureScreen({super.key});
  @override
  State<CaptureScreen> createState() => _CaptureScreenState();
}

class _CaptureScreenState extends State<CaptureScreen> {
  final ImagePicker _picker = ImagePicker();
  String? _imagePath;
  bool _isLoading = false;

  Future<void> _takePhoto() async {
    setState(() => _isLoading = true);
    try {
      final XFile? photo = await _picker.pickImage(
        source: ImageSource.camera, imageQuality: 85, maxWidth: 1200,
      );
      if (photo != null) setState(() => _imagePath = photo.path);
    } catch (e) {
      _showError('Camera not available. Try uploading from gallery.');
    }
    setState(() => _isLoading = false);
  }

  Future<void> _pickFromGallery() async {
    setState(() => _isLoading = true);
    try {
      final XFile? image = await _picker.pickImage(
        source: ImageSource.gallery, imageQuality: 85, maxWidth: 1200,
      );
      if (image != null) setState(() => _imagePath = image.path);
    } catch (e) {
      _showError('Could not access gallery.');
    }
    setState(() => _isLoading = false);
  }

  void _showError(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  void _proceed() {
    if (_imagePath == null) return;
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final cp = Provider.of<ComplaintProvider>(context, listen: false);
    cp.startNewComplaint(_imagePath!, auth.userId ?? 'demo');
    context.push(AppRoutes.reportAiProcessing);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: UrbanTheme.backgroundLight,
      appBar: AppBar(title: const Text('Capture Image')),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              Expanded(
                child: _imagePath != null
                  ? ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Image.file(File(_imagePath!), fit: BoxFit.cover, width: double.infinity),
                    )
                  : Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: UrbanTheme.divider, width: 2, strokeAlign: BorderSide.strokeAlignInside),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.camera_alt_outlined, size: 64,
                            color: UrbanTheme.primaryNavy.withValues(alpha: 0.3)),
                          const SizedBox(height: 16),
                          Text('Take a photo of the issue', style: GoogleFonts.poppins(
                            fontSize: 15, color: UrbanTheme.textSecondary)),
                        ],
                      ),
                    ),
              ),
              const SizedBox(height: 20),
              if (_imagePath == null) ...[
                SizedBox(
                  width: double.infinity, height: 52,
                  child: ElevatedButton.icon(
                    onPressed: _isLoading ? null : _takePhoto,
                    icon: const Icon(Icons.camera_alt_rounded),
                    label: Text('Take Photo', style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w600)),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity, height: 52,
                  child: OutlinedButton.icon(
                    onPressed: _isLoading ? null : _pickFromGallery,
                    icon: const Icon(Icons.photo_library_rounded),
                    label: Text('Upload from Gallery', style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w600)),
                  ),
                ),
              ] else ...[
                Row(children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => setState(() => _imagePath = null),
                      icon: const Icon(Icons.refresh_rounded),
                      label: Text('Retake', style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _proceed,
                      icon: const Icon(Icons.auto_awesome_rounded),
                      label: Text('Analyze', style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
                    ),
                  ),
                ]),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
