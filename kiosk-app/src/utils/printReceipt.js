/**
 * printReceipt — generates a government-styled HTML receipt in a new window
 * and triggers the browser's Print / Save as PDF dialog.
 *
 * @param {Object} opts
 * @param {string}   opts.title          – Main title (e.g. "Property Tax Payment Receipt")
 * @param {string}   opts.refNo          – Reference / transaction number
 * @param {string}   opts.department     – Issuing department
 * @param {string}   opts.serviceType    – Service name
 * @param {{label:string, value:string}[]} opts.fields – Detail rows to show in the body
 * @param {string}   [opts.note]         – Optional footer note
 */
export function printReceipt({ title, refNo, department, serviceType, fields = [], note }) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })

  const rowsHTML = fields.map(({ label, value }) => `
    <tr>
      <td style="padding:10px 14px;color:#555;font-size:13px;border-bottom:1px solid #eee;width:45%">${label}</td>
      <td style="padding:10px 14px;color:#1a1a2e;font-weight:600;font-size:13px;border-bottom:1px solid #eee">${value}</td>
    </tr>
  `).join('')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Receipt – ${refNo}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Outfit:wght@700;800&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', sans-serif;
      background: #f5f5f5;
      color: #1a1a2e;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      max-width: 680px;
      margin: 32px auto;
      background: #fff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0,0,0,0.12);
    }

    /* Tricolor bar */
    .tricolor { display:flex; height:6px; }
    .tricolor .saffron { flex:1; background:#FF9933; }
    .tricolor .white   { flex:1; background:#fff; border-top:1px solid #ddd; border-bottom:1px solid #ddd; }
    .tricolor .green   { flex:1; background:#138808; }

    /* Header */
    .header {
      background: linear-gradient(135deg, #0C2340 0%, #1E3A5F 100%);
      padding: 28px 32px;
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .header-logo {
      width: 64px; height: 64px;
      background: rgba(255,255,255,0.15);
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 32px; flex-shrink: 0;
    }
    .header-text h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 22px; font-weight: 800;
      color: #fff; letter-spacing: -0.3px;
    }
    .header-text p  { color: rgba(255,255,255,0.65); font-size: 13px; margin-top: 3px; }
    .header-badge {
      margin-left: auto;
      background: rgba(255,153,51,0.2);
      border: 1px solid rgba(255,153,51,0.5);
      color: #FF9933;
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.8px; text-transform: uppercase;
      padding: 5px 12px; border-radius: 20px;
    }

    /* Ref Number Banner */
    .ref-banner {
      background: #f8f9ff;
      border-bottom: 1px solid #e8eaf0;
      padding: 16px 32px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .ref-banner .label  { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; font-weight: 600; }
    .ref-banner .ref-no { font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 800; color: #0C2340; letter-spacing: 1px; }
    .ref-banner .issued { font-size: 12px; color: #666; text-align: right; }
    .ref-banner .issued strong { display: block; color: #333; font-size: 13px; }

    /* Service Badge */
    .service-badge {
      margin: 24px 32px 0;
      display: inline-flex; align-items: center; gap: 8px;
      background: #f0f4ff; border: 1px solid #c7d2fe;
      color: #3730a3; padding: 6px 14px; border-radius: 8px;
      font-size: 13px; font-weight: 600;
    }

    /* Section */
    .section { padding: 12px 32px 0; }
    .section-title {
      font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 1px; color: #999; margin-bottom: 8px;
    }

    /* Table */
    table { width: 100%; border-collapse: collapse; border-radius: 10px; overflow: hidden; border: 1px solid #eee; }

    /* Status bar */
    .status-bar {
      margin: 20px 32px;
      background: #f0fdf4; border: 1px solid #bbf7d0;
      border-radius: 10px; padding: 14px 18px;
      display: flex; align-items: center; gap: 12px;
    }
    .status-dot { width:10px; height:10px; border-radius:50%; background:#16a34a; flex-shrink:0; }
    .status-bar p { color: #15803d; font-size: 13px; font-weight: 600; }
    .status-bar span { color: #166534; font-size: 12px; display: block; margin-top: 2px; font-weight: 400; }

    /* Note */
    .note {
      margin: 0 32px 24px;
      background: #fffbeb; border: 1px solid #fde68a;
      border-radius: 10px; padding: 12px 16px;
      font-size: 12px; color: #92400e;
    }

    /* Footer */
    .footer {
      border-top: 1px solid #f0f0f0;
      padding: 18px 32px;
      display: flex; justify-content: space-between; align-items: center;
      background: #fafafa;
    }
    .footer .brand { font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 800; color: #0C2340; }
    .footer .brand span { color: #D32F2F; }
    .footer p { font-size: 11px; color: #aaa; }

    /* Watermark */
    .watermark {
      position: fixed; bottom: 60px; right: 40px;
      font-size: 80px; opacity: 0.04;
      font-family: 'Outfit', sans-serif; font-weight: 800;
      transform: rotate(-30deg); pointer-events: none;
      color: #0C2340;
    }

    /* Print */
    @media print {
      body { background: #fff; }
      .page { box-shadow: none; margin: 0; border-radius: 0; }
      .no-print { display: none !important; }
    }

    /* Print button */
    .print-btn-wrap { text-align: center; margin: 24px 0 8px; }
    .print-btn {
      background: #0C2340; color: #fff;
      border: none; border-radius: 10px;
      padding: 12px 32px; font-size: 15px; font-weight: 700;
      cursor: pointer; font-family: 'Inter', sans-serif;
    }
    .print-btn:hover { background: #1E3A5F; }
  </style>
</head>
<body>

<div class="watermark">SUVIDHA</div>

<div class="no-print print-btn-wrap">
  <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
</div>

<div class="page">
  <div class="tricolor"><div class="saffron"></div><div class="white"></div><div class="green"></div></div>

  <div class="header">
    <div class="header-logo">🏛️</div>
    <div class="header-text">
      <h1>SUVIDHA 2026</h1>
      <p>${department} &nbsp;·&nbsp; Government of Assam</p>
    </div>
    <div class="header-badge">Official Receipt</div>
  </div>

  <div class="ref-banner">
    <div>
      <div class="label">Reference Number</div>
      <div class="ref-no">${refNo}</div>
    </div>
    <div class="issued">
      <strong>${dateStr}</strong>
      ${timeStr}
    </div>
  </div>

  <div class="service-badge">
    ✦ ${serviceType}
  </div>

  <div class="section" style="margin-top:16px">
    <div class="section-title">Transaction Details</div>
    <table>
      <tbody>
        ${rowsHTML}
      </tbody>
    </table>
  </div>

  <div class="status-bar">
    <div class="status-dot"></div>
    <div>
      <p>Request Successfully Registered</p>
      <span>Your application has been recorded in the ${department} system.</span>
    </div>
  </div>

  ${note ? `<div class="note">📋 ${note}</div>` : ''}

  <div class="footer">
    <div>
      <div class="brand">SUVIDHA <span>2026</span></div>
      <p>Smart Urban Kiosk System · Assam</p>
    </div>
    <div style="text-align:right">
      <p>This is a system-generated receipt.</p>
      <p>No signature required.</p>
    </div>
  </div>

  <div class="tricolor"><div class="saffron"></div><div class="white"></div><div class="green"></div></div>
</div>

<script>
  // Auto-open print dialog after fonts load
  window.addEventListener('load', () => {
    setTimeout(() => window.print(), 600)
  })
</script>
</body>
</html>`

  const win = window.open('', '_blank', 'width=780,height=900,scrollbars=yes')
  if (win) {
    win.document.write(html)
    win.document.close()
  }
}
