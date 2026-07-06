/**
 * Medical-specific validation utilities
 */

export class MedicalValidators {
  /**
   * Validate blood pressure reading
   */
  static validateBloodPressure(
    systolic: number,
    diastolic: number
  ): { valid: boolean; status: string; warning?: string } {
    if (systolic < 0 || systolic > 250 || diastolic < 0 || diastolic > 150) {
      return { valid: false, status: "invalid_range" };
    }

    if (systolic < 90 && diastolic < 60) {
      return { valid: true, status: "low", warning: "Hypotension detected" };
    }

    if (systolic >= 140 || diastolic >= 90) {
      return { valid: true, status: "high", warning: "Hypertension detected" };
    }

    return { valid: true, status: "normal" };
  }

  /**
   * Validate heart rate
   */
  static validateHeartRate(bpm: number): {
    valid: boolean;
    status: string;
    warning?: string;
  } {
    if (bpm < 0 || bpm > 300) {
      return { valid: false, status: "invalid_range" };
    }

    if (bpm < 60) {
      return { valid: true, status: "low", warning: "Bradycardia detected" };
    }

    if (bpm > 100) {
      return { valid: true, status: "high", warning: "Tachycardia detected" };
    }

    return { valid: true, status: "normal" };
  }

  /**
   * Validate temperature
   */
  static validateTemperature(fahrenheit: number): {
    valid: boolean;
    status: string;
    warning?: string;
  } {
    if (fahrenheit < 90 || fahrenheit > 106) {
      return { valid: false, status: "invalid_range" };
    }

    if (fahrenheit < 95) {
      return { valid: true, status: "low", warning: "Hypothermia detected" };
    }

    if (fahrenheit > 100.4) {
      return { valid: true, status: "high", warning: "Fever detected" };
    }

    return { valid: true, status: "normal" };
  }

  /**
   * Validate oxygen saturation
   */
  static validateO2Saturation(percentage: number): {
    valid: boolean;
    status: string;
    warning?: string;
  } {
    if (percentage < 0 || percentage > 100) {
      return { valid: false, status: "invalid_range" };
    }

    if (percentage < 90) {
      return {
        valid: true,
        status: "critical",
        warning: "Low oxygen saturation - seek immediate medical attention",
      };
    }

    if (percentage < 95) {
      return { valid: true, status: "low", warning: "Moderate hypoxemia" };
    }

    return { valid: true, status: "normal" };
  }

  /**
   * Validate BMI
   */
  static calculateAndValidateBMI(
    heightCm: number,
    weightKg: number
  ): { bmi: number; category: string } {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    let category = "Normal";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi >= 25 && bmi < 30) category = "Overweight";
    else if (bmi >= 30) category = "Obese";

    return { bmi: Math.round(bmi * 10) / 10, category };
  }

  /**
   * Validate medication dosage
   */
  static validateDosage(medication: string, dosage: number, unit: string): boolean {
    const safeDosages: Record<string, { min: number; max: number; unit: string }> = {
      metformin: { min: 500, max: 2000, unit: "mg" },
      lisinopril: { min: 10, max: 40, unit: "mg" },
      albuterol: { min: 90, max: 180, unit: "mcg" },
    };

    const safe = safeDosages[medication.toLowerCase()];
    if (!safe) return true; // Unknown medication, allow

    return dosage >= safe.min && dosage <= safe.max && unit === safe.unit;
  }

  /**
   * Validate ICD-10 code format
   */
  static validateICD10Code(code: string): boolean {
    // ICD-10 format: Letter followed by digits, optional decimal and more digits
    const icd10Regex = /^[A-TV-Z]\d{2}\.?[A-Z0-9]*$/;
    return icd10Regex.test(code);
  }

  /**
   * Validate CPT code format
   */
  static validateCPTCode(code: string): boolean {
    // CPT codes are 5 digits
    return /^\d{5}$/.test(code);
  }
}