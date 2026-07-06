import PDFDocument from "pdfkit";
import { Readable } from "stream";

export interface ConsultationReport {
  patientName: string;
  providerName: string;
  date: Date;
  diagnosis: string;
  treatment: string;
  medications: string[];
  notes: string;
}

export class PDFGenerator {
  static generateConsultationReport(report: ConsultationReport): Buffer {
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));

    // Header
    doc.fontSize(24).text("Consultation Report", { align: "center" }).moveDown();

    // Patient info
    doc.fontSize(12);
    doc.text(`Patient: ${report.patientName}`);
    doc.text(`Provider: ${report.providerName}`);
    doc.text(`Date: ${report.date.toLocaleDateString()}`);
    doc.moveDown();

    // Diagnosis
    doc.fontSize(14).text("Diagnosis", { underline: true });
    doc.fontSize(12).text(report.diagnosis);
    doc.moveDown();

    // Treatment
    doc.fontSize(14).text("Treatment Plan", { underline: true });
    doc.fontSize(12).text(report.treatment);
    doc.moveDown();

    // Medications
    doc.fontSize(14).text("Medications", { underline: true });
    doc.fontSize(12);
    report.medications.forEach((med) => {
      doc.text(`• ${med}`);
    });
    doc.moveDown();

    // Notes
    doc.fontSize(14).text("Additional Notes", { underline: true });
    doc.fontSize(12).text(report.notes);

    doc.end();

    return Buffer.concat(chunks);
  }

  static generatePrescription(
    patientName: string,
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
    }>,
    providerName: string
  ): Buffer {
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));

    // Header
    doc.fontSize(24).text("PRESCRIPTION", { align: "center" }).moveDown();

    // Patient info
    doc.fontSize(12);
    doc.text(`Patient: ${patientName}`);
    doc.text(`Provider: ${providerName}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    // Medications table
    doc.fontSize(14).text("Medications", { underline: true });
    doc.fontSize(11);

    medications.forEach((med, idx) => {
      doc.text(`${idx + 1}. ${med.name}`);
      doc.text(`   Dosage: ${med.dosage}`);
      doc.text(`   Frequency: ${med.frequency}`);
      doc.text(`   Duration: ${med.duration}`);
      doc.moveDown(0.5);
    });

    doc.end();

    return Buffer.concat(chunks);
  }
}