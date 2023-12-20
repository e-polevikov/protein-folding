import { FoldingStage } from '../components/FoldingStage/FoldingStage';
import { LEVEL3_SETTINGS } from '../constants/Levels/Level3';

export function Level3() {
  return (
    <FoldingStage settings={LEVEL3_SETTINGS} isConstructor={false} />
  );
}
