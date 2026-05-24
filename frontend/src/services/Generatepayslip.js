/**
 * generatePayslip(data)
 * Opens a print-ready payslip in a new tab.
 * Browser "Save as PDF" = download.
 */
export function generatePayslip(data) {
  const emp      = data.employee ?? {};
  const fullName = `${emp.firstName ?? ""} ${emp.lastName ?? ""}`.trim();
  const bonus    = data.netSalary - (data.baseSalary - data.deductions);

  const start    = new Date(data.year, data.month - 1, 1);
  const end      = new Date(data.year, data.month, 0);
  const fmtDate  = (d) => d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "2-digit" });
  const period   = `${fmtDate(start)} — ${fmtDate(end)}`;
  const monthName = start.toLocaleString("en-US", { month: "long", year: "numeric" });

  const statusColors = {
    Paid:    { bg: "#d1fae5", text: "#065f46" },
    Pending: { bg: "#dbeafe", text: "#1e40af" },
    Draft:   { bg: "#f1f5f9", text: "#475569" },
  };
  const sc = statusColors[data.status] ?? statusColors.Draft;

  const avatarUrl = emp.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0168B1&color=fff&size=80&bold=true&rounded=true`;

  const bonusRow = bonus > 0
    ? `<tr><td class="label-cell">Performance Bonus</td><td class="positive">+$${bonus.toLocaleString()}</td></tr>`
    : "";

  const deductionRow = data.deductions > 0
    ? `<tr><td class="label-cell">Deductions</td><td class="negative">-$${data.deductions.toLocaleString()}</td></tr>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Payslip - ${fullName} - ${monthName}</title>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{font-family:"Segoe UI",Arial,sans-serif;background:#f8fafc;color:#1e293b;padding:40px}
    .page{max-width:720px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.1)}
    .header{background:linear-gradient(135deg,#0f172a,#1e3a5f);padding:32px 40px;display:flex;justify-content:space-between;align-items:flex-start}
    .company-name{font-size:22px;font-weight:800;color:#4BFFB2;letter-spacing:-.5px}
    .company-sub{font-size:11px;color:#62BDFE;margin-top:3px;text-transform:uppercase;letter-spacing:1.5px}
    .payslip-label{text-align:right}
    .payslip-label h2{font-size:18px;font-weight:700;color:#fff}
    .payslip-label p{font-size:12px;color:#94a3b8;margin-top:3px}
    .employee-section{display:flex;align-items:center;gap:20px;padding:28px 40px;border-bottom:1px solid #e2e8f0;background:#f8fafc}
    .avatar{width:64px;height:64px;border-radius:14px;object-fit:cover;border:2px solid #e2e8f0}
    .emp-info h3{font-size:17px;font-weight:700;color:#0f172a}
    .emp-info p{font-size:12px;color:#64748b;margin-top:2px}
    .emp-meta{display:flex;gap:8px;margin-top:6px;flex-wrap:wrap}
    .emp-meta span{font-size:11px;color:#475569;background:#e2e8f0;border-radius:6px;padding:2px 8px;font-weight:500}
    .status-badge{margin-left:auto;padding:5px 14px;border-radius:20px;font-size:12px;font-weight:600;background:${sc.bg};color:${sc.text};white-space:nowrap}
    .body{padding:32px 40px}
    .period-banner{display:flex;justify-content:space-between;align-items:center;background:#f1f5f9;border-radius:10px;padding:12px 18px;margin-bottom:28px}
    .period-banner .label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;font-weight:600}
    .period-banner .value{font-size:13px;font-weight:600;color:#1e293b}
    .section-title{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;font-weight:700;margin-bottom:14px}
    table{width:100%;border-collapse:collapse}
    tr{border-bottom:1px solid #f1f5f9}
    tr:last-child{border-bottom:none}
    td{padding:12px 0;font-size:14px}
    td:last-child{text-align:right;font-weight:600}
    .label-cell{color:#475569}
    .positive{color:#059669}
    .negative{color:#e11d48}
    .total-box{display:flex;justify-content:space-between;align-items:center;margin-top:20px;padding:20px 24px;background:linear-gradient(135deg,#0f172a,#1e3a5f);border-radius:14px}
    .total-label{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;font-weight:600}
    .total-amount{font-size:28px;font-weight:900;color:#4BFFB2}
    .attendance{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:24px}
    .att-card{border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;display:flex;align-items:center;gap:14px}
    .att-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
    .att-icon.present{background:#d1fae5}
    .att-icon.absent{background:#ffe4e6}
    .att-label{font-size:11px;color:#94a3b8}
    .att-value{font-size:22px;font-weight:800;color:#1e293b}
    .footer{margin-top:36px;padding-top:20px;border-top:1px dashed #e2e8f0;display:flex;justify-content:space-between;align-items:center}
    .footer p{font-size:11px;color:#94a3b8}
    .doc-id{font-family:monospace;font-size:11px;color:#cbd5e1}
    @media print{body{background:#fff;padding:0}.page{box-shadow:none;border-radius:0}@page{margin:12mm;size:A4}}
  </style>
</head>
<body>
<div class="page">
  <div class="header">
    <div>
      <div class="company-name">HRMS</div>
      <div class="company-sub">Human Resource Management System</div>
    </div>
    <div class="payslip-label">
      <h2>PAYSLIP</h2>
      <p>${monthName}</p>
    </div>
  </div>

  <div class="employee-section">
    <img class="avatar" src="${avatarUrl}" alt="${fullName}"/>
    <div class="emp-info">
      <h3>${fullName}</h3>
      <p>${emp.email ?? ""}</p>
      <div class="emp-meta">
        <span>${emp.department ?? ""}</span>
        <span>${emp.jobTitle ?? ""}</span>
        <span>${emp.jobType ?? ""}</span>
      </div>
    </div>
    <div class="status-badge">${data.status}</div>
  </div>

  <div class="body">
    <div class="period-banner">
      <div>
        <div class="label">Pay Period</div>
        <div class="value">${period}</div>
      </div>
      <div style="text-align:right">
        <div class="label">Employee ID</div>
        <div class="value" style="font-family:monospace">${(data.employeeId ?? "").slice(-8).toUpperCase()}</div>
      </div>
    </div>

    <div class="section-title">Payment Breakdown</div>
    <table>
      <tr><td class="label-cell">Base Salary</td><td>$${data.baseSalary.toLocaleString()}</td></tr>
      ${bonusRow}
      ${deductionRow}
    </table>

    <div class="total-box">
      <div>
        <div class="total-label">Total Net Salary</div>
        <div class="total-amount">$${data.netSalary.toLocaleString()}</div>
      </div>
      <div style="text-align:right">
        <div class="total-label">Status</div>
        <div style="font-size:14px;font-weight:700;color:#fff;margin-top:4px">${data.status}</div>
      </div>
    </div>

    <div class="attendance">
      <div class="att-card">
        <div class="att-icon present">&#128197;</div>
        <div>
          <div class="att-label">Days Present</div>
          <div class="att-value">${data.daysPresent}</div>
        </div>
      </div>
      <div class="att-card">
        <div class="att-icon absent">&#128198;</div>
        <div>
          <div class="att-label">Days Absent</div>
          <div class="att-value">${data.daysAbsent}</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>Generated on ${new Date().toLocaleDateString("en-US", { dateStyle: "long" })}</p>
      <span class="doc-id">REF: ${(data._id ?? "").slice(-10).toUpperCase()}</span>
    </div>
  </div>
</div>
<script>window.onload = () => window.print();<\/script>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) {
    alert("Please allow popups to download the payslip.");
    return;
  }
  win.document.write(html);
  win.document.close();
}