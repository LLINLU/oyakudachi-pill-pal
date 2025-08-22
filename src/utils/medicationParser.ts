import { ScannedMedication } from '../types/medication';

export const parseMedicationFromText = (ocrText: string): ScannedMedication[] => {
  const medications: ScannedMedication[] = [];
  const lines = ocrText.split('\n').filter(line => line.trim().length > 0);
  
  // More precise medication patterns to avoid over-detection
  const medicationPatterns = [
    // Primary pattern: Japanese medications with suffixes (most reliable)
    /([ァ-ヾ一-龯\w]+(?:錠|カプセル|散剤?|顆粒|液剤?|軟膏|クリーム|シロップ|点眼|点鼻|吸入|貼付|坐薬|注射|内服液?)(?:\d+(?:mg|μg|g|ml))?)/g,
    // Brand names with dosage embedded (e.g., "ロキソニン60mg錠")  
    /([ァ-ヾ一-龯]{3,}\d+(?:mg|μg|g|ml)錠?)/g,
    // Well-known medication names (specific list to avoid false positives)
    /(アムロジピン|リシノプリル|メトホルミン|ロキソプロフェン|セレコキシブ|アスピリン|イブプロフェン|パラセタモール)(?:錠|散|液)?/g,
    // English medication names (more specific)
    /([A-Za-z]{4,}(?:tin|cin|ol|ine|ate|ide|pril|sartan|statin))/gi
  ];
  
  // Enhanced dosage patterns
  const dosagePatterns = [
    // Standard dosage with units
    /(\d+(?:\.\d+)?)\s*(?:mg|μg|g|ml|錠|カプセル|包|滴|回分)/gi,
    // Japanese counting patterns
    /(\d+)\s*(?:錠|カプセル|包|滴|粒|回分)/gi,
    // Decimal dosages
    /(\d+\.\d+)\s*(?:mg|g|ml)/gi,
    // Range dosages (e.g., "1-2錠")
    /(\d+[-~]\d+)\s*(?:錠|カプセル|包)/gi
  ];
  
  // Enhanced time patterns for comprehensive Japanese time parsing
  const timePatterns = [
    // Specific time formats
    /(\d{1,2}):(\d{2})/g,
    // Japanese meal-related times
    /(朝食前|朝食後|昼食前|昼食後|夕食前|夕食後|就寝前|起床時)/g,
    // General time periods
    /(朝|昼|夕方?|夜|寝る前|食前|食後)/g,
    // Time with Japanese hour notation
    /(\d+時(?:\d+分)?)/g,
    // Multiple times pattern (e.g., "朝・昼・夕")
    /(朝[・･]?昼[・･]?夕?|朝[・･]?夕|昼[・･]?夕)/g
  ];
  
  // Enhanced frequency patterns (ordered by priority)
  const frequencyPatterns = [
    // Prioritize numerical frequency patterns first
    /(1日\d+回|週\d+回|月\d+回)/g,
    // General patterns
    /(毎日|隔日|必要時)/g,
    // Meal-based patterns (lower priority)
    /(毎食後|毎食前)/g,
    // English patterns
    /(daily|twice|once|bid|tid|qid)/gi,
    // Time-based frequency
    /(\d+時間毎|\d+時間おき)/g,
    // Time period patterns (lowest priority, only if no other frequency found)
    /(朝昼夕|朝夕|朝昼|昼夕)/g
  ];
  
  let currentMedication: Partial<ScannedMedication> = {};
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip lines that are clearly not medication names (time/frequency only)
    if (/^(朝|昼|夕|夜|食前|食後|毎日|1日\d+回|週\d+回|\d+時間)/.test(trimmedLine) && !currentMedication.name) {
      continue;
    }
    
    // Try to find medication names - only accept strong matches
    let foundMedication = false;
    for (const pattern of medicationPatterns) {
      const matches = trimmedLine.match(pattern);
      if (matches) {
        const medName = matches[0];
        
        // Avoid duplicates by checking if this name is already found
        if (medications.some(med => med.name === medName) || currentMedication.name === medName) {
          continue;
        }
        
        // If we already have a medication being processed, save it
        if (currentMedication.name) {
          medications.push(createMedicationFromPartial(currentMedication));
        }
        
        currentMedication = {
          name: medName,
          dosage: '',
          frequency: '',
          time: '',
          instructions: ''
        };
        foundMedication = true;
        break;
      }
    }
    
    // Only process attributes if we have a current medication and haven't just found a new one
    if (currentMedication.name && !foundMedication) {
      // Try to find dosage
      if (!currentMedication.dosage) {
        for (const pattern of dosagePatterns) {
          const matches = trimmedLine.match(pattern);
          if (matches) {
            currentMedication.dosage = matches[0];
            break;
          }
        }
      }
      
      // Try to find time
      if (!currentMedication.time) {
        for (const pattern of timePatterns) {
          const matches = trimmedLine.match(pattern);
          if (matches) {
            if (pattern.source.includes(':')) {
              currentMedication.time = matches[0];
            } else {
              currentMedication.time = convertJapaneseTimeToTime(matches[0]);
            }
            break;
          }
        }
      }
      
      // Try to find frequency (prioritize numerical patterns over time patterns)
      if (!currentMedication.frequency) {
        let bestFrequency = '';
        let bestPriority = 999;
        
        for (let i = 0; i < frequencyPatterns.length; i++) {
          const pattern = frequencyPatterns[i];
          const matches = trimmedLine.match(pattern);
          if (matches && i < bestPriority) {
            bestFrequency = matches[0];
            bestPriority = i;
          }
        }
        
        if (bestFrequency) {
          currentMedication.frequency = bestFrequency;
        }
      }
      
      // Collect instructions (only if we don't have other attributes)
      if (!currentMedication.instructions && !currentMedication.dosage && !currentMedication.time && !currentMedication.frequency) {
        currentMedication.instructions = trimmedLine;
      }
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
  // Enhanced time mapping for comprehensive Japanese time expressions
  const timeMap: { [key: string]: string } = {
    // Basic time periods
    '朝': '08:00',
    '昼': '12:00',
    '夕': '18:00',
    '夕方': '18:00',
    '夜': '20:00',
    // Meal-related times
    '朝食前': '07:30',
    '朝食後': '08:30',
    '昼食前': '11:30',
    '昼食後': '12:30',
    '夕食前': '17:30',
    '夕食後': '18:30',
    '食前': '07:30',
    '食後': '08:30',
    // Sleep-related times
    '就寝前': '22:00',
    '寝る前': '22:00',
    '起床時': '07:00',
    // Multiple time patterns
    '朝昼夕': '08:00,12:00,18:00',
    '朝夕': '08:00,18:00',
    '朝昼': '08:00,12:00',
    '昼夕': '12:00,18:00'
  };
  
  // Handle time with hour notation (e.g., "8時", "8時30分")
  const hourMatch = japaneseTime.match(/(\d+)時(?:(\d+)分)?/);
  if (hourMatch) {
    const hour = hourMatch[1].padStart(2, '0');
    const minute = (hourMatch[2] || '00').padStart(2, '0');
    return `${hour}:${minute}`;
  }
  
  return timeMap[japaneseTime] || '08:00';
};