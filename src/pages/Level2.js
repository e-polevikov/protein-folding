import { FoldingStage } from '../components/FoldingStage/FoldingStage';
import { LEVEL2_SETTINGS } from '../constants/Levels';

export function Level2() {
  return (
    <FoldingStage settings={LEVEL2_SETTINGS} isConstructor={false} />
  );
}
