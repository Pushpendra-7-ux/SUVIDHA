import 'package:flutter/material.dart';
import '../config/theme.dart';

class UrbanButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final bool isOutlined;
  final bool isLoading;
  final IconData? icon;
  final Color? color;

  const UrbanButton({
    super.key, required this.text, required this.onPressed,
    this.isOutlined = false, this.isLoading = false, this.icon, this.color,
  });

  @override
  Widget build(BuildContext context) {
    if (isOutlined) {
      return OutlinedButton(
        onPressed: isLoading ? null : onPressed,
        style: OutlinedButton.styleFrom(
          side: BorderSide(color: color ?? UrbanTheme.primaryNavy, width: 1.5),
        ),
        child: _buildChild(color ?? UrbanTheme.primaryNavy),
      );
    }
    return ElevatedButton(
      onPressed: isLoading ? null : onPressed,
      style: color != null ? ElevatedButton.styleFrom(backgroundColor: color) : null,
      child: _buildChild(Colors.white),
    );
  }

  Widget _buildChild(Color textColor) {
    if (isLoading) {
      return SizedBox(
        height: 22, width: 22,
        child: CircularProgressIndicator(strokeWidth: 2.5, color: textColor),
      );
    }
    if (icon != null) {
      return Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 20),
          const SizedBox(width: 8),
          Text(text),
        ],
      );
    }
    return Text(text);
  }
}
