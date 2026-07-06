/**
 * HL7 v2 Converter - Convert to/from HL7 messages
 */

export class HL7Converter {
  /**
   * Parse HL7 ADT message
   */
  static parseADT(message: string) {
    const segments = message.split("\n");
    const result: any = {};

    segments.forEach((segment) => {
      const [type, ...fields] = segment.split("|");

      if (type === "MSH") {
        result.messageType = fields[0];
        result.timestamp = fields[1];
      } else if (type === "PID") {
        result.patient = {
          id: fields[0],
          name: fields[2],
          dob: fields[3],
          gender: fields[4],
        };
      } else if (type === "OBR") {
        result.observation = {
          code: fields[1],
          name: fields[2],
        };
      } else if (type === "OBX") {
        result.value = {
          code: fields[1],
          value: fields[3],
          unit: fields[4],
        };
      }
    });

    return result;
  }

  /**
   * Generate HL7 ORU message (Observation Result)
   */
  static generateORU(result: any): string {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
    const messageId = Math.random().toString(36).substring(7);

    const msh = `MSH|^~\\&|MEDICONNECT|MEDICONNECT|LAB|LAB|${timestamp}||ORU^R01|${messageId}|P|2.4`;
    const pid = `PID|${result.patientId}||${result.patientMRN}||${result.patientName}||${result.dob}|${result.gender}`;
    const obr = `OBR|1|${result.orderId}||${result.testCode}^${result.testName}`;
    const obx = `OBX|${result.value}|${result.valueType}|${result.code}|${result.unit}`;

    return [msh, pid, obr, obx].join("\n");
  }
}