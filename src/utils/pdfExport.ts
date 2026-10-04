import { jsPDF } from 'jspdf';
import { AnalysisResult, DecisionInput } from '../types/analysis';

export function generateAuditPDF(
  result: AnalysisResult,
  decisionInput?: DecisionInput | null
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  function checkPageBreak(requiredHeight: number) {
    if (y + requiredHeight > pageHeight - 18) {
      doc.addPage();
      y = 18;
    }
  }

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ThinkLens Reasoning Audit Report', margin, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(`Generated: ${dateStr} | Powered by Google Gemini & ThinkLens`, margin, 21);

  y = 36;

  // Decision Snapshot Section
  doc.setTextColor(30, 41, 59); // slate-800
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. Decision Under Audit', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const decisionLines = doc.splitTextToSize(
    decisionInput?.decision || result.decisionSummary,
    contentWidth
  );
  checkPageBreak(decisionLines.length * 4.5);
  doc.text(decisionLines, margin, y);
  y += decisionLines.length * 4.5 + 4;

  // Stated Facts / Evidence
  checkPageBreak(15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("2. What You've Stated (Explicit Facts)", margin, y);
  y += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  result.evidence.forEach((item) => {
    const lines = doc.splitTextToSize(`• [Fact] ${item.statement}`, contentWidth - 4);
    checkPageBreak(lines.length * 4 + 2);
    doc.text(lines, margin + 2, y);
    y += lines.length * 4 + 1.5;
  });
  y += 3;

  // Unstated Assumptions
  checkPageBreak(15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Unstated Assumptions & Verification Questions', margin, y);
  y += 5.5;

  result.assumptions.forEach((item) => {
    const aLines = doc.splitTextToSize(`Assumption: ${item.assumption}`, contentWidth - 4);
    const mLines = doc.splitTextToSize(`Why it matters: ${item.whyItMatters}`, contentWidth - 4);
    const qLines = doc.splitTextToSize(
      `Verification Question: ${item.verificationQuestion}`,
      contentWidth - 4
    );

    const totalHeight = (aLines.length + mLines.length + qLines.length) * 4 + 6;
    checkPageBreak(totalHeight);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(aLines, margin + 2, y);
    y += aLines.length * 4;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(mLines, margin + 2, y);
    y += mLines.length * 4;

    doc.setTextColor(37, 99, 235); // blue-600
    doc.text(qLines, margin + 2, y);
    y += qLines.length * 4 + 3;
  });
  y += 2;

  // Potential Blind Spots
  checkPageBreak(15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('4. Potential Blind Spots', margin, y);
  y += 5.5;

  result.blindSpots.forEach((item) => {
    const fLines = doc.splitTextToSize(`• ${item.factor}: ${item.whyItMayMatter}`, contentWidth - 4);
    checkPageBreak(fLines.length * 4 + 2);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(fLines, margin + 2, y);
    y += fLines.length * 4 + 1.5;
  });
  y += 3;

  // Reasoning Conflicts
  if (result.reasoningConflicts.length > 0) {
    checkPageBreak(15);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('5. Reasoning Conflicts & Tensions', margin, y);
    y += 5.5;

    result.reasoningConflicts.forEach((item) => {
      const cLines = doc.splitTextToSize(`• Conflict: ${item.conflict}`, contentWidth - 4);
      const eLines = doc.splitTextToSize(`  Explanation: ${item.explanation}`, contentWidth - 4);
      checkPageBreak((cLines.length + eLines.length) * 4 + 2);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(180, 83, 9); // amber-700
      doc.text(cLines, margin + 2, y);
      y += cLines.length * 4;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(eLines, margin + 2, y);
      y += eLines.length * 4 + 2;
    });
    y += 3;
  }

  // Questions to Investigate
  checkPageBreak(15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('6. High-Leverage Diagnostic Questions', margin, y);
  y += 5.5;

  result.criticalQuestions.forEach((q, idx) => {
    const tag = idx === 0 ? '[Most Decision-Changing] ' : `[Q${idx + 1}] `;
    const qLines = doc.splitTextToSize(`${tag}${q}`, contentWidth - 4);
    checkPageBreak(qLines.length * 4 + 2);

    doc.setFont('helvetica', idx === 0 ? 'bold' : 'normal');
    doc.setFontSize(9);
    doc.setTextColor(idx === 0 ? 30 : 71, idx === 0 ? 58 : 85, idx === 0 ? 138 : 105);
    doc.text(qLines, margin + 2, y);
    y += qLines.length * 4 + 1.5;
  });
  y += 3;

  // The Flip Test Counterfactual
  checkPageBreak(25);
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('The Flip Test (Counterfactual)', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const flipLines = doc.splitTextToSize(result.flipTest, contentWidth - 8);
  doc.text(flipLines, margin + 4, y + 12);
  y += 28;

  // Alternative Perspective
  checkPageBreak(18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('7. Alternative Perspective', margin, y);
  y += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const altLines = doc.splitTextToSize(result.alternativePerspective, contentWidth - 4);
  checkPageBreak(altLines.length * 4 + 2);
  doc.text(altLines, margin + 2, y);
  y += altLines.length * 4 + 5;

  // Disclaimer Box
  checkPageBreak(18);
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'FD');

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const discLines = doc.splitTextToSize(result.disclaimer, contentWidth - 8);
  doc.text(discLines, margin + 4, y + 6);

  // Save the PDF
  doc.save(`ThinkLens_Reasoning_Audit_${Date.now()}.pdf`);
}
