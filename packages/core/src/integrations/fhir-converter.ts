/**
 * FHIR v4 Converter - Convert internal models to FHIR resources
 */

export interface FHIRPatient {
  resourceType: "Patient";
  id: string;
  identifier: Array<{ system: string; value: string }>;
  name: Array<{
    use: string;
    family: string;
    given: string[];
  }>;
  telecom: Array<{ system: string; value: string }>;
  birthDate: string;
  gender: string;
  address: Array<{
    use: string;
    type: string;
    line: string[];
    city: string;
    state: string;
    postalCode: string;
  }>;
}

export class FHIRConverter {
  static toFHIRPatient(patient: any): FHIRPatient {
    return {
      resourceType: "Patient",
      id: patient.id,
      identifier: [
        {
          system: "http://mediconnect.health/patient-id",
          value: patient.id,
        },
      ],
      name: [
        {
          use: "official",
          family: patient.fullName.split(" ").pop() || "",
          given: patient.fullName.split(" ").slice(0, -1),
        },
      ],
      telecom: [
        { system: "phone", value: patient.phone },
        { system: "email", value: patient.email },
      ],
      birthDate: patient.dateOfBirth,
      gender: patient.gender,
      address: [
        {
          use: "home",
          type: "both",
          line: [patient.address?.street || ""],
          city: patient.address?.city || "",
          state: patient.address?.state || "",
          postalCode: patient.address?.postalCode || "",
        },
      ],
    };
  }

  static toFHIRObservation(observation: any) {
    return {
      resourceType: "Observation",
      id: observation.id,
      status: "final",
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/observation-category",
              code: observation.category,
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: observation.loincCode,
            display: observation.name,
          },
        ],
      },
      subject: {
        reference: `Patient/${observation.patientId}`,
      },
      effectiveDateTime: observation.date,
      valueQuantity: {
        value: observation.value,
        unit: observation.unit,
        system: "http://unitsofmeasure.org",
        code: observation.unitCode,
      },
    };
  }

  static toFHIRMedication(medication: any) {
    return {
      resourceType: "Medication",
      id: medication.id,
      code: {
        coding: [
          {
            system: "http://www.nlm.nih.gov/research/umls/rxnorm",
            code: medication.rxnormCode,
            display: medication.name,
          },
        ],
      },
      status: "active",
      form: {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: medication.formCode,
            display: medication.form,
          },
        ],
      },
      ingredient: medication.ingredients?.map((ing: any) => ({
        itemCodeableConcept: {
          coding: [
            {
              system: "http://www.nlm.nih.gov/research/umls/rxnorm",
              code: ing.code,
              display: ing.name,
            },
          ],
        },
        strength: {
          numerator: { value: ing.strength },
          denominator: { value: ing.unit },
        },
      })),
    };
  }

  static toFHIRDiagnosticReport(report: any) {
    return {
      resourceType: "DiagnosticReport",
      id: report.id,
      status: "final",
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0074",
              code: "LAB",
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: report.loincCode,
            display: report.name,
          },
        ],
      },
      subject: {
        reference: `Patient/${report.patientId}`,
      },
      effective: report.effectiveDate,
      issued: report.issuedDate,
      performer: report.performerId
        ? [{ reference: `Practitioner/${report.performerId}` }]
        : [],
      result: report.results?.map((result: any) => ({
        reference: `Observation/${result.id}`,
      })),
    };
  }
}