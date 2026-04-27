import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../../config/theme.dart';
import '../../config/routes.dart';
import '../../providers/complaint_provider.dart';
import '../../services/location_service.dart';

class LocationScreen extends StatefulWidget {
  const LocationScreen({super.key});
  @override
  State<LocationScreen> createState() => _LocationScreenState();
}

class _LocationScreenState extends State<LocationScreen> {
  final LocationService _locationService = LocationService();
  final MapController _mapController = MapController();
  final _landmarkController = TextEditingController();
  LatLng _pinLocation = const LatLng(26.1445, 91.7362);
  String _address = 'Fetching location...';
  String _city = '';
  String _state = '';
  String _pincode = '';
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchLocation();
  }

  Future<void> _fetchLocation() async {
    final pos = await _locationService.getCurrentPosition();
    if (pos != null) {
      _pinLocation = LatLng(pos.latitude, pos.longitude);
      final detail = await _locationService.getDetailedAddress(pos.latitude, pos.longitude);
      _address = detail.fullAddress;
      _city = detail.city;
      _state = detail.state;
      _pincode = detail.pincode;
    } else {
      final def = _locationService.getDefaultPosition();
      _pinLocation = LatLng(def.latitude, def.longitude);
      _address = 'Guwahati, Assam';
      _city = 'Guwahati';
      _state = 'Assam';
      _pincode = '781001';
    }
    if (mounted) setState(() => _isLoading = false);
  }

  void _onMapTap(TapPosition tapPos, LatLng point) async {
    setState(() { _pinLocation = point; _address = 'Updating...'; });
    final detail = await _locationService.getDetailedAddress(point.latitude, point.longitude);
    if (mounted) {
      setState(() {
        _address = detail.fullAddress;
        _city = detail.city;
        _state = detail.state;
        _pincode = detail.pincode;
      });
    }
  }

  void _confirm() {
    final cp = Provider.of<ComplaintProvider>(context, listen: false);
    cp.updateLocation(
      _pinLocation.latitude, _pinLocation.longitude, _address,
      landmark: _landmarkController.text.isNotEmpty ? _landmarkController.text : null,
      city: _city, state: _state, pincode: _pincode,
    );
    context.push(AppRoutes.reportDraft);
  }

  @override
  void dispose() { _landmarkController.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: UrbanTheme.backgroundLight,
      appBar: AppBar(title: const Text('Confirm Location')),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              flex: 3,
              child: _isLoading
                ? const Center(child: CircularProgressIndicator(color: UrbanTheme.primaryNavy))
                : FlutterMap(
                    mapController: _mapController,
                    options: MapOptions(
                      initialCenter: _pinLocation, initialZoom: 15,
                      onTap: _onMapTap,
                    ),
                    children: [
                      TileLayer(
                        urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                        userAgentPackageName: 'com.urban.civic',
                      ),
                      MarkerLayer(markers: [
                        Marker(
                          point: _pinLocation, width: 40, height: 40,
                          child: const Icon(Icons.location_pin, size: 40, color: UrbanTheme.error),
                        ),
                      ]),
                    ],
                  ),
            ),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, -3))],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Semantics(
                    label: 'Current address: $_address',
                    child: Row(children: [
                      const Icon(Icons.location_on_rounded, color: UrbanTheme.error, size: 20),
                      const SizedBox(width: 8),
                      Expanded(child: Text(_address, style: GoogleFonts.poppins(
                        fontSize: 13, fontWeight: FontWeight.w500), maxLines: 2, overflow: TextOverflow.ellipsis)),
                    ]),
                  ),
                  if (_city.isNotEmpty || _pincode.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 4, left: 28),
                      child: Text('$_city, $_state ${_pincode.isNotEmpty ? "- $_pincode" : ""}',
                        style: GoogleFonts.poppins(fontSize: 11, color: UrbanTheme.textSecondary)),
                    ),
                  const SizedBox(height: 4),
                  Text('Tap on map to adjust location', style: GoogleFonts.poppins(
                    fontSize: 11, color: UrbanTheme.textSecondary)),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _landmarkController,
                    style: GoogleFonts.poppins(fontSize: 14),
                    decoration: const InputDecoration(
                      hintText: 'Add landmark (optional)',
                      prefixIcon: Icon(Icons.place_outlined, size: 20),
                      contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Semantics(
                    button: true,
                    label: 'Confirm location',
                    child: SizedBox(width: double.infinity, height: 50,
                      child: ElevatedButton(
                        onPressed: _confirm,
                        child: Text('Confirm Location', style: GoogleFonts.poppins(
                          fontSize: 15, fontWeight: FontWeight.w600)),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
