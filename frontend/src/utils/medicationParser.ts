import { ScannedMedication } from '../types/medication';

export const parseMedicationFromText = (ocrText: string): ScannedMedication[] => {
  const medications: ScannedMedication[] = [];
  const lines = ocrText.split('\n').filter(line => line.trim().length > 0);
  
  // Common medication patterns
  const medicationPatterns = [
    // Japanese medication names (often end with specific suffixes)
    /([ァ-ヾ一-龯\w]+(?:錠|カプセル|散|液|軟膏|クリーム|シロップ))/g,
    // English medication names
    /([A-Za-z]+(?:tin|cin|ol|ine|ate|ide))/g,
  ];
  
  // Dosage patterns
  const dosagePatterns = [
    /(\d+(?:\.\d+)?)\s*(?:mg|g|ml|錠|カプセル)/gi,
    /(\d+)\s*(?:錠|カプセル)/gi
  ];
  
  // Time patterns
  const timePatterns = [
    /(\d{1,2}):(\d{2})/g,
    /(朝|昼|夕|夜|食前|食後|寝る前)/g
  ];
  
  // Frequency patterns
  const frequencyPatterns = [
    /(毎日|1日\d+回|週\d+回|月\d+回)/g,
    /(daily|twice|once)/gi
  ];
  
  let currentMedication: Partial<ScannedMedication> = {};
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Try to find medication names
    for (const pattern of medicationPatterns) {
      const matches = trimmedLine.match(pattern);
      if (matches) {
        // If we already have a medication being processed, save it
        if (currentMedication.name) {
          medications.push(createMedicationFromPartial(currentMedication));
        }
        
        currentMedication = {
          name: matches[0],
          dosage: '',
          frequency: '',
          time: '',
          instructions: ''
        };
        break;
      }
    }
    
    // Try to find dosage
    for (const pattern of dosagePatterns) {
      const matches = trimmedLine.match(pattern);
      if (matches && currentMedication.name) {
        currentMedication.dosage = matches[0];
        break;
      }
    }
    
    // Try to find time
    for (const pattern of timePatterns) {
      const matches = trimmedLine.match(pattern);
      if (matches && currentMedication.name) {
        if (pattern.source.includes(':')) {
          currentMedication.time = matches[0];
        } else {
          currentMedication.time = convertJapaneseTimeToTime(matches[0]);
        }
        break;
      }
    }
    
    // Try to find frequency
    for (const pattern of frequencyPatterns) {
      const matches = trimmedLine.match(pattern);
      if (matches && currentMedication.name) {
        currentMedication.frequency = matches[0];
        break;
      }
    }
    
    // Collect instructions
    if (currentMedication.name && !currentMedication.instructions) {
      currentMedication.instructions = trimmedLine;
    }
  }
  
  // Add the last medication if exists
  if (currentMedication.name) {
    medications.push(createMedicationFromPartial(currentMedication));
  }
  
  // Return empty array if no medications found - let the UI handle the failure state
  return medications;
};

const createMedicationFromPartial = (partial: Partial<ScannedMedication>): ScannedMedication => {
  return {
    name: partial.name || '不明な薬',
    dosage: partial.dosage || '1錠',
    frequency: partial.frequency || '1日1回',
    time: partial.time || '08:00',
    instructions: partial.instructions || '医師の指示に従ってください'
  };
};

const convertJapaneseTimeToTime = (japaneseTime: string): string => {
  const timeMap: { [key: string]: string } = {
    '朝': '08:00',
    '昼': '12:00',
    '夕': '18:00',
    '夜': '20:00',
    '食前': '07:30',
    '食後': '08:30',
    '寝る前': '22:00'
  };
  
  return timeMap[japaneseTime] || '08:00';
};