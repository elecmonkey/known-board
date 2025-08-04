import { AppStateV2 } from '@/types/app-state';
import { ConflictItem, ImportMode, ConflictResolution } from '@/utils/importConflictHandler';

export type ImportStep = 'source' | 'mode' | 'conflict' | 'processing';
export type ImportSource = 'file' | 'paste';

export interface ImportWizardState {
  step: ImportStep;
  importSource: ImportSource;
  rawData: string | null;
  parsedData: AppStateV2 | null;
  hasExistingData: boolean;
  importMode: ImportMode;
  conflicts: ConflictItem[];
  conflictResolution: ConflictResolution;
  error: string | null;
  isProcessing: boolean;
}

export interface ImportStepProps {
  state: ImportWizardState;
  onStateChange: (updates: Partial<ImportWizardState>) => void;
  onNext: () => void;
  onPrev: () => void;
  onCancel: () => void;
}