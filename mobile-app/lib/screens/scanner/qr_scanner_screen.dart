import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/constants.dart';
import '../../providers/complaint_provider.dart';
import '../../services/kiosk_sync_service.dart';

class QrScannerScreen extends StatefulWidget {
  const QrScannerScreen({super.key});
  @override
  State<QrScannerScreen> createState() => _QrScannerScreenState();
}

class _QrScannerScreenState extends State<QrScannerScreen> with SingleTickerProviderStateMixin {
  late AnimationController _scanAnim;
  MobileScannerController? _cameraController;
  bool _isProcessing = false;
  bool _isSyncing = false;
  bool _hasScanned = false;
  String _statusMessage = 'Point camera at Kiosk QR code';
  KioskQrData? _parsedQr;
  String? _rawQrUrl;

  @override
  void initState() {
    super.initState();
    _scanAnim = AnimationController(vsync: this, duration: const Duration(seconds: 2))..repeat(reverse: true);
    _cameraController = MobileScannerController(
      detectionSpeed: DetectionSpeed.normal,
      facing: CameraFacing.back,
    );
  }

  @override
  void dispose() {
    _scanAnim.dispose();
    _cameraController?.dispose();
    super.dispose();
  }

  void _onDetect(BarcodeCapture capture) {
    if (_hasScanned || _isProcessing) return;

    final List<Barcode> barcodes = capture.barcodes;
    for (final barcode in barcodes) {
      final rawValue = barcode.rawValue;
      if (rawValue != null && rawValue.contains('session=')) {
        _processQrCode(rawValue);
        return;
      }
    }
  }

  Future<void> _processQrCode(String qrUrl) async {
    setState(() {
      _hasScanned = true;
      _isProcessing = true;
      _statusMessage = 'QR Code detected! Parsing...';
    });

    _cameraController?.stop();
    await Future.delayed(const Duration(milliseconds: 500));

    final parsed = KioskSyncService.parseKioskQrUrl(qrUrl);
    if (parsed == null) {
      setState(() {
        _isProcessing = false;
        _hasScanned = false;
        _statusMessage = 'Invalid QR code. Try again.';
      });
      _cameraController?.start();
      return;
    }

    setState(() {
      _parsedQr = parsed;
      _rawQrUrl = qrUrl;
      _isProcessing = false;
      _statusMessage = 'Session: ${parsed.sessionId}';
    });
  }

  Future<void> _syncToKiosk() async {
    if (_parsedQr == null || _rawQrUrl == null) return;

    setState(() {
      _isSyncing = true;
      _statusMessage = 'Syncing to kiosk...';
    });

    final cp = Provider.of<ComplaintProvider>(context, listen: false);
    // Pass the original raw URL to the provider, which will re-parse it
    final result = await cp.syncToKiosk(_rawQrUrl!);

    setState(() {
      _isSyncing = false;
    });

    if (mounted) {
      _showResultDialog(result);
    }
  }

  void _showResultDialog(KioskSyncResult result) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        icon: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: (result.success ? UrbanTheme.success : UrbanTheme.error).withValues(alpha: 0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(
            result.success ? Icons.check_circle_rounded : Icons.error_rounded,
            color: result.success ? UrbanTheme.success : UrbanTheme.error,
            size: 48,
          ),
        ),
        title: Text(
          result.success ? 'Synced Successfully!' : 'Sync Failed',
          style: GoogleFonts.poppins(fontWeight: FontWeight.w700),
        ),
        content: Text(
          result.message,
          style: GoogleFonts.poppins(fontSize: 13, color: UrbanTheme.textSecondary),
          textAlign: TextAlign.center,
        ),
        actions: [
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                Navigator.pop(ctx); // close dialog
                if (result.success) {
                  // Go all the way back to home
                  Navigator.of(context).popUntil((route) => route.isFirst);
                }
              },
              style: result.success
                  ? ElevatedButton.styleFrom(backgroundColor: UrbanTheme.success)
                  : null,
              child: Text(
                result.success ? 'Done' : 'Try Again',
                style: GoogleFonts.poppins(fontWeight: FontWeight.w600),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _resetScanner() {
    setState(() {
      _hasScanned = false;
      _isProcessing = false;
      _parsedQr = null;
      _rawQrUrl = null;
      _statusMessage = 'Point camera at Kiosk QR code';
    });
    _cameraController?.start();
  }

  @override
  Widget build(BuildContext context) {
    final cp = Provider.of<ComplaintProvider>(context);
    final hasComplaint = cp.currentComplaint != null;

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: const Text('Scan Kiosk QR'),
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Info banner if no complaint loaded
            if (!hasComplaint)
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: UrbanTheme.accentAmber.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(children: [
                  const Icon(Icons.warning_rounded, size: 18, color: UrbanTheme.accentAmber),
                  const SizedBox(width: 8),
                  Expanded(child: Text(
                    'No complaint loaded. Go to Drafts to select one first.',
                    style: GoogleFonts.poppins(fontSize: 11, color: UrbanTheme.accentAmber),
                  )),
                ]),
              ),
            // Camera / Scanner
            Expanded(
              flex: 3,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // Camera preview
                  if (!_hasScanned && _cameraController != null)
                    MobileScanner(
                      controller: _cameraController!,
                      onDetect: _onDetect,
                    )
                  else
                    Container(color: Colors.black87),
                  // Scanner overlay
                  Container(
                    width: 260, height: 260,
                    decoration: BoxDecoration(
                      border: Border.all(
                        color: _parsedQr != null
                            ? UrbanTheme.success.withValues(alpha: 0.8)
                            : UrbanTheme.secondaryTeal.withValues(alpha: 0.6),
                        width: 2,
                      ),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Stack(children: [
                      ..._buildCorners(),
                      // Scan line animation
                      if (!_hasScanned)
                        AnimatedBuilder(
                          animation: _scanAnim,
                          builder: (context, _) => Positioned(
                            top: _scanAnim.value * 240 + 10,
                            left: 10, right: 10,
                            child: Container(
                              height: 2,
                              decoration: BoxDecoration(
                                gradient: LinearGradient(colors: [
                                  Colors.transparent,
                                  UrbanTheme.secondaryTeal.withValues(alpha: 0.8),
                                  UrbanTheme.secondaryTeal,
                                  UrbanTheme.secondaryTeal.withValues(alpha: 0.8),
                                  Colors.transparent,
                                ]),
                              ),
                            ),
                          ),
                        ),
                      Center(child: Icon(
                        _parsedQr != null ? Icons.check_circle : Icons.qr_code_scanner_rounded,
                        size: 64,
                        color: _parsedQr != null ? UrbanTheme.success : Colors.white24,
                      )),
                    ]),
                  ),
                  // Status message
                  Positioned(
                    bottom: 20,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                      decoration: BoxDecoration(
                        color: Colors.black54,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: (_isProcessing || _isSyncing)
                        ? Row(mainAxisSize: MainAxisSize.min, children: [
                            const SizedBox(width: 16, height: 16,
                              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)),
                            const SizedBox(width: 10),
                            Text(_isSyncing ? 'Syncing...' : 'Processing...',
                              style: const TextStyle(color: Colors.white)),
                          ])
                        : Text(_statusMessage,
                            style: GoogleFonts.poppins(color: Colors.white, fontSize: 13)),
                    ),
                  ),
                ],
              ),
            ),
            // Bottom panel
            Container(
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: Column(mainAxisSize: MainAxisSize.min, children: [
                if (_parsedQr == null) ...[
                  // Instruction text
                  Text('Scan the QR code displayed on the Kiosk screen',
                    style: GoogleFonts.poppins(fontSize: 13, color: UrbanTheme.textSecondary),
                    textAlign: TextAlign.center),
                  const SizedBox(height: 16),
                  if (hasComplaint)
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: UrbanTheme.secondaryTeal.withValues(alpha: 0.06),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: UrbanTheme.secondaryTeal.withValues(alpha: 0.2)),
                      ),
                      child: Row(children: [
                        Text(AppConstants.issueIcons[cp.currentComplaint?.issueType] ?? '📋',
                          style: const TextStyle(fontSize: 20)),
                        const SizedBox(width: 10),
                        Expanded(child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Ready to sync', style: GoogleFonts.poppins(
                              fontSize: 12, fontWeight: FontWeight.w600, color: UrbanTheme.secondaryTeal)),
                            Text(cp.currentComplaint?.description ?? '', maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: GoogleFonts.poppins(fontSize: 11, color: UrbanTheme.textSecondary)),
                          ],
                        )),
                      ]),
                    ),
                ] else ...[
                  // Parsed QR info
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: UrbanTheme.success.withValues(alpha: 0.06),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: UrbanTheme.success.withValues(alpha: 0.2)),
                    ),
                    child: Column(children: [
                      _infoRow('Status', '✅ QR Scanned'),
                      _infoRow('Session', _parsedQr!.sessionId),
                      _infoRow('Server', _parsedQr!.baseDomain),
                      if (hasComplaint)
                        _infoRow('Issue', cp.currentComplaint?.kioskCategory ?? cp.currentComplaint?.issueType ?? ''),
                    ]),
                  ),
                  const SizedBox(height: 14),
                  Row(children: [
                    Expanded(child: SizedBox(height: 50, child: OutlinedButton(
                      onPressed: _resetScanner,
                      child: Text('Scan Again', style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
                    ))),
                    const SizedBox(width: 12),
                    Expanded(child: Semantics(
                      button: true,
                      label: 'Sync complaint to kiosk',
                      child: SizedBox(height: 50, child: ElevatedButton(
                        onPressed: hasComplaint && !_isSyncing ? _syncToKiosk : null,
                        style: ElevatedButton.styleFrom(backgroundColor: UrbanTheme.success),
                        child: Text(_isSyncing ? 'Syncing...' : 'Sync to Kiosk',
                          style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
                      )),
                    )),
                  ]),
                ],
              ]),
            ),
          ],
        ),
      ),
    );
  }

  Widget _infoRow(String label, String val) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Text(label, style: GoogleFonts.poppins(fontSize: 12, color: UrbanTheme.textSecondary)),
        Flexible(child: Text(val, style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w600),
          overflow: TextOverflow.ellipsis)),
      ]),
    );
  }

  List<Widget> _buildCorners() {
    const size = 20.0;
    final color = _parsedQr != null ? UrbanTheme.success : UrbanTheme.secondaryTeal;
    return [
      Positioned(top: 0, left: 0, child: Container(width: size, height: size,
        decoration: BoxDecoration(border: Border(top: BorderSide(color: color, width: 3), left: BorderSide(color: color, width: 3)),
          borderRadius: const BorderRadius.only(topLeft: Radius.circular(8))))),
      Positioned(top: 0, right: 0, child: Container(width: size, height: size,
        decoration: BoxDecoration(border: Border(top: BorderSide(color: color, width: 3), right: BorderSide(color: color, width: 3)),
          borderRadius: const BorderRadius.only(topRight: Radius.circular(8))))),
      Positioned(bottom: 0, left: 0, child: Container(width: size, height: size,
        decoration: BoxDecoration(border: Border(bottom: BorderSide(color: color, width: 3), left: BorderSide(color: color, width: 3)),
          borderRadius: const BorderRadius.only(bottomLeft: Radius.circular(8))))),
      Positioned(bottom: 0, right: 0, child: Container(width: size, height: size,
        decoration: BoxDecoration(border: Border(bottom: BorderSide(color: color, width: 3), right: BorderSide(color: color, width: 3)),
          borderRadius: const BorderRadius.only(bottomRight: Radius.circular(8))))),
    ];
  }
}
