import { createSignal, Show } from 'solid-js';
import { AppStateV2 } from '@/types/app-state';
import { ImportWizardState, ImportStep } from '@/types/import';
import { hasExistingData, detectConflicts, processImportData } from '@/utils/importConflictHandler';
import ImportSourceStep from './ImportSourceStep';
import ImportModeStep from './ImportModeStep';
import ConflictResolutionStep from './ConflictResolutionStep';
import ProcessingStep from './ProcessingStep';

interface ImportWizardProps {
  isOpen: boolean;
  currentState: AppStateV2;
  onConfirm: (data: AppStateV2) => void;
  onCancel: () => void;
}

export default function ImportWizard(props: ImportWizardProps) {
  const [state, setState] = createSignal<ImportWizardState>({
    step: 'source',
    importSource: 'file',
    rawData: null,
    parsedData: null,
    hasExistingData: hasExistingData(props.currentState),
    importMode: 'replace',
    conflicts: [],
    conflictResolution: 'overwrite',
    error: null,
    isProcessing: false
  });

  const updateState = (updates: Partial<ImportWizardState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const getNextStep = (currentStep: ImportStep): ImportStep | null => {
    const currentState = state();
    
    switch (currentStep) {
      case 'source':
        // 如果没有现有数据，跳过模式选择直接到处理步骤
        return currentState.hasExistingData ? 'mode' : 'processing';
      
      case 'mode':
        // 如果是覆盖模式，直接到处理步骤
        if (currentState.importMode === 'replace') {
          return 'processing';
        }
        // 合并模式时，检测冲突
        if (currentState.parsedData) {
          const conflictInfo = detectConflicts(props.currentState.children, currentState.parsedData.children);
          // 不要在这里更新状态，避免无限循环
          // setState(prev => ({ ...prev, conflicts: conflictInfo.conflicts }));
          return conflictInfo.hasConflicts ? 'conflict' : 'processing';
        }
        return 'processing';
      
      case 'conflict':
        return 'processing';
      
      case 'processing':
        return null; // 最后一步
    }
  };

  const getPrevStep = (currentStep: ImportStep): ImportStep | null => {
    const currentState = state();
    
    switch (currentStep) {
      case 'source':
        return null; // 第一步
      
      case 'mode':
        return 'source';
      
      case 'conflict':
        // 如果没有现有数据，回到source步骤
        return currentState.hasExistingData ? 'mode' : 'source';
      
      case 'processing':
        // 根据之前的步骤决定
        if (currentState.conflicts.length > 0 && currentState.importMode === 'merge') {
          return 'conflict';
        }
        return currentState.hasExistingData ? 'mode' : 'source';
    }
  };

  const handleNext = () => {
    const currentStep = state().step;
    const nextStep = getNextStep(currentStep);
    
    if (nextStep) {
      // 如果要进入冲突解决步骤，先检测并设置冲突信息
      if (nextStep === 'conflict' && state().parsedData) {
        const conflictInfo = detectConflicts(props.currentState.children, state().parsedData.children);
        updateState({ step: nextStep, conflicts: conflictInfo.conflicts });
      } else {
        updateState({ step: nextStep });
      }
    }
  };

  const handlePrev = () => {
    const currentStep = state().step;
    const prevStep = getPrevStep(currentStep);
    
    if (prevStep) {
      updateState({ step: prevStep });
    }
  };

  const handleCancel = () => {
    // 重置状态
    setState({
      step: 'source',
      importSource: 'file',
      rawData: null,
      parsedData: null,
      hasExistingData: hasExistingData(props.currentState),
      importMode: 'replace',
      conflicts: [],
      conflictResolution: 'overwrite',
      error: null,
      isProcessing: false
    });
    
    props.onCancel();
  };

  const handleConfirm = (finalData: AppStateV2) => {
    props.onConfirm(finalData);
    handleCancel(); // 重置状态并关闭
  };


  return (
    <Show when={props.isOpen}>
      <div class="fixed inset-0 flex items-center justify-center z-50" style="background-color: rgba(0, 0, 0, 0.5);">
        <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-medium text-gray-900 mb-6">导入数据</h3>
          
          {/* 步骤内容 */}
          <Show when={state().step === 'source'}>
            <ImportSourceStep 
              state={state()}
              onStateChange={updateState}
              onNext={handleNext}
              onPrev={handlePrev}
              onCancel={handleCancel}
            />
          </Show>
          
          <Show when={state().step === 'mode'}>
            <ImportModeStep 
              state={state()}
              onStateChange={updateState}
              onNext={handleNext}
              onPrev={handlePrev}
              onCancel={handleCancel}
            />
          </Show>
          
          <Show when={state().step === 'conflict'}>
            <ConflictResolutionStep 
              state={state()}
              onStateChange={updateState}
              onNext={handleNext}
              onPrev={handlePrev}
              onCancel={handleCancel}
            />
          </Show>
          
          <Show when={state().step === 'processing'}>
            <ProcessingStep 
              state={state()}
              onStateChange={updateState}
              onNext={handleNext}
              onPrev={handlePrev}
              onCancel={handleCancel}
              currentAppState={props.currentState}
              onConfirm={handleConfirm} 
            />
          </Show>
        </div>
      </div>
    </Show>
  );
}