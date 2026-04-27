import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';

/// Detailed location info with separate city/state/pincode fields
class LocationDetail {
  final String street;
  final String fullAddress;
  final String city;
  final String state;
  final String pincode;

  LocationDetail({
    required this.street,
    required this.fullAddress,
    required this.city,
    required this.state,
    required this.pincode,
  });
}

class LocationService {
  Future<bool> checkPermission() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) return false;

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) return false;
    }
    if (permission == LocationPermission.deniedForever) return false;
    return true;
  }

  Future<Position?> getCurrentPosition() async {
    try {
      final hasPermission = await checkPermission();
      if (!hasPermission) return null;
      return await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          timeLimit: Duration(seconds: 10),
        ),
      );
    } catch (e) {
      debugPrint('[LocationService] Error: $e');
      return null;
    }
  }

  Future<String> getAddressFromCoordinates(double lat, double lng) async {
    try {
      final placemarks = await placemarkFromCoordinates(lat, lng);
      if (placemarks.isNotEmpty) {
        final p = placemarks.first;
        final parts = <String>[
          if (p.street?.isNotEmpty == true) p.street!,
          if (p.subLocality?.isNotEmpty == true) p.subLocality!,
          if (p.locality?.isNotEmpty == true) p.locality!,
          if (p.administrativeArea?.isNotEmpty == true) p.administrativeArea!,
          if (p.postalCode?.isNotEmpty == true) p.postalCode!,
        ];
        return parts.join(', ');
      }
    } catch (e) {
      debugPrint('[LocationService] Geocoding error: $e');
    }
    return 'Location: $lat, $lng';
  }

  /// Get detailed address with separate city, state, pincode fields
  /// for the kiosk sync payload
  Future<LocationDetail> getDetailedAddress(double lat, double lng) async {
    try {
      final placemarks = await placemarkFromCoordinates(lat, lng);
      if (placemarks.isNotEmpty) {
        final p = placemarks.first;

        final streetParts = <String>[
          if (p.street?.isNotEmpty == true) p.street!,
          if (p.subLocality?.isNotEmpty == true) p.subLocality!,
        ];

        final fullParts = <String>[
          ...streetParts,
          if (p.locality?.isNotEmpty == true) p.locality!,
          if (p.administrativeArea?.isNotEmpty == true) p.administrativeArea!,
          if (p.postalCode?.isNotEmpty == true) p.postalCode!,
        ];

        return LocationDetail(
          street: streetParts.isNotEmpty ? streetParts.join(', ') : 'Unknown Street',
          fullAddress: fullParts.join(', '),
          city: p.locality ?? p.subAdministrativeArea ?? 'Unknown',
          state: p.administrativeArea ?? 'Unknown',
          pincode: p.postalCode ?? '',
        );
      }
    } catch (e) {
      debugPrint('[LocationService] Detailed geocoding error: $e');
    }

    return LocationDetail(
      street: 'Location: $lat, $lng',
      fullAddress: 'Location: $lat, $lng',
      city: 'Unknown',
      state: 'Unknown',
      pincode: '',
    );
  }

  Position getDefaultPosition() {
    return Position(
      latitude: 26.1445, longitude: 91.7362,
      timestamp: DateTime.now(), accuracy: 0, altitude: 0,
      altitudeAccuracy: 0, heading: 0, headingAccuracy: 0,
      speed: 0, speedAccuracy: 0,
    );
  }
}
