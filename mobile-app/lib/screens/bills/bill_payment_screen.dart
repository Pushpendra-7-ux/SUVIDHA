import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../config/theme.dart';

class BillPaymentScreen extends StatefulWidget {
  const BillPaymentScreen({super.key});
  @override
  State<BillPaymentScreen> createState() => _BillPaymentScreenState();
}

class _BillPaymentScreenState extends State<BillPaymentScreen> {
  String _selectedBill = '';
  final _accountController = TextEditingController();
  bool _isLoading = false;
  Map<String, dynamic>? _billDetails;

  final _billTypes = [
    {'id': 'water', 'name': 'Water Bill', 'icon': Icons.water_drop_rounded, 'color': const Color(0xFF039BE5)},
    {'id': 'electricity', 'name': 'Electricity Bill', 'icon': Icons.bolt_rounded, 'color': const Color(0xFFFF8F00)},
    {'id': 'gas', 'name': 'Gas Bill', 'icon': Icons.local_fire_department_rounded, 'color': const Color(0xFFE53935)},
    {'id': 'property_tax', 'name': 'Property Tax', 'icon': Icons.home_rounded, 'color': const Color(0xFF43A047)},
    {'id': 'sewerage', 'name': 'Sewerage Tax', 'icon': Icons.plumbing_rounded, 'color': const Color(0xFF8E24AA)},
    {'id': 'parking', 'name': 'Parking Fine', 'icon': Icons.local_parking_rounded, 'color': const Color(0xFF00897B)},
  ];

  Future<void> _fetchBill() async {
    if (_accountController.text.length < 4) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Enter a valid account/consumer number')));
      return;
    }
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(milliseconds: 1200));
    final names = {'water': 'PHED Guwahati', 'electricity': 'APDCL', 'gas': 'Assam Gas Company',
      'property_tax': 'GMC', 'sewerage': 'GMC Sewerage', 'parking': 'Traffic Dept'};
    setState(() {
      _isLoading = false;
      _billDetails = {
        'provider': names[_selectedBill] ?? 'Provider',
        'account': _accountController.text,
        'name': 'Pushpendra Kumar',
        'amount': (200 + (_accountController.text.hashCode % 1500)).abs(),
        'dueDate': '30 Apr 2026',
        'lastPaid': '15 Mar 2026',
        'status': 'unpaid',
      };
    });
  }

  void _payBill() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(children: [
          const Icon(Icons.payment_rounded, color: UrbanTheme.primaryNavy),
          const SizedBox(width: 10),
          Text('Confirm Payment', style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 17)),
        ]),
        content: Column(mainAxisSize: MainAxisSize.min, children: [
          _payRow('Amount', '₹${_billDetails!['amount']}'),
          _payRow('Provider', _billDetails!['provider']),
          _payRow('Account', _billDetails!['account']),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: UrbanTheme.info.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(children: [
              const Icon(Icons.info_outline, size: 16, color: UrbanTheme.info),
              const SizedBox(width: 8),
              Expanded(child: Text('This is a demo payment. No real transaction.',
                style: GoogleFonts.poppins(fontSize: 11, color: UrbanTheme.info))),
            ]),
          ),
        ]),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx),
            child: Text('Cancel', style: GoogleFonts.poppins())),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              setState(() => _billDetails!['status'] = 'paid');
              ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                content: Text('✅ Payment of ₹${_billDetails!['amount']} successful!'),
                backgroundColor: UrbanTheme.success,
              ));
            },
            child: Text('Pay ₹${_billDetails!['amount']}', style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
          ),
        ],
      ),
    );
  }

  Widget _payRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Text(label, style: GoogleFonts.poppins(fontSize: 13, color: UrbanTheme.textSecondary)),
        Text(value, style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600)),
      ]),
    );
  }

  @override
  void dispose() { _accountController.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: UrbanTheme.backgroundLight,
      appBar: AppBar(title: const Text('Pay Bills')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('Select Bill Type', style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w600)),
            const SizedBox(height: 12),
            GridView.builder(
              shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3, crossAxisSpacing: 10, mainAxisSpacing: 10, childAspectRatio: 1.0),
              itemCount: _billTypes.length,
              itemBuilder: (_, i) {
                final b = _billTypes[i];
                final selected = _selectedBill == b['id'];
                return GestureDetector(
                  onTap: () => setState(() { _selectedBill = b['id'] as String; _billDetails = null; }),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    decoration: BoxDecoration(
                      color: selected ? (b['color'] as Color).withValues(alpha: 0.1) : Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: selected ? b['color'] as Color : UrbanTheme.divider,
                        width: selected ? 2 : 1),
                      boxShadow: selected ? [BoxShadow(color: (b['color'] as Color).withValues(alpha: 0.15), blurRadius: 8)] : null,
                    ),
                    child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                      Icon(b['icon'] as IconData, size: 28, color: b['color'] as Color),
                      const SizedBox(height: 6),
                      Text(b['name'] as String, style: GoogleFonts.poppins(fontSize: 10, fontWeight: FontWeight.w600),
                        textAlign: TextAlign.center),
                    ]),
                  ),
                );
              },
            ),
            if (_selectedBill.isNotEmpty) ...[
              const SizedBox(height: 20),
              Text('Account / Consumer No.', style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              Row(children: [
                Expanded(child: TextField(
                  controller: _accountController,
                  style: GoogleFonts.poppins(fontSize: 14),
                  keyboardType: TextInputType.text,
                  decoration: InputDecoration(
                    hintText: 'Enter account number',
                    prefixIcon: const Icon(Icons.account_circle_outlined, size: 20),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                  ),
                )),
                const SizedBox(width: 10),
                SizedBox(height: 50, child: ElevatedButton(
                  onPressed: _isLoading ? null : _fetchBill,
                  style: ElevatedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                  child: _isLoading
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                    : Text('Fetch', style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
                )),
              ]),
            ],
            if (_billDetails != null) ...[
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: Colors.white, borderRadius: BorderRadius.circular(16),
                  boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10)],
                ),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Row(children: [
                    Text('Bill Details', style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w600)),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: _billDetails!['status'] == 'paid'
                          ? UrbanTheme.success.withValues(alpha: 0.1) : UrbanTheme.error.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        _billDetails!['status'] == 'paid' ? '✅ Paid' : '⚠️ Unpaid',
                        style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w600,
                          color: _billDetails!['status'] == 'paid' ? UrbanTheme.success : UrbanTheme.error),
                      ),
                    ),
                  ]),
                  const Divider(height: 24),
                  _detailRow('Consumer Name', _billDetails!['name']),
                  _detailRow('Provider', _billDetails!['provider']),
                  _detailRow('Account No.', _billDetails!['account']),
                  _detailRow('Due Date', _billDetails!['dueDate']),
                  _detailRow('Last Paid', _billDetails!['lastPaid']),
                  const Divider(height: 20),
                  Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                    Text('Total Due', style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600)),
                    Text('₹${_billDetails!['amount']}',
                      style: GoogleFonts.poppins(fontSize: 22, fontWeight: FontWeight.w700, color: UrbanTheme.primaryNavy)),
                  ]),
                  if (_billDetails!['status'] != 'paid') ...[
                    const SizedBox(height: 16),
                    SizedBox(width: double.infinity, height: 50, child: ElevatedButton.icon(
                      onPressed: _payBill,
                      icon: const Icon(Icons.payment_rounded),
                      label: Text('Pay Now', style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w600)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: UrbanTheme.success,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    )),
                  ],
                ]),
              ),
            ],
          ]),
        ),
      ),
    );
  }

  Widget _detailRow(String label, String val) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Text(label, style: GoogleFonts.poppins(fontSize: 12, color: UrbanTheme.textSecondary)),
        Text(val, style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w500)),
      ]),
    );
  }
}
