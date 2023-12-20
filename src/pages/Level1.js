import { FoldingStage } from '../components/FoldingStage/FoldingStage';
import { LEVEL1_SETTINGS } from '../constants/Levels/Level1';

export function Level1() {
  return (
    <FoldingStage settings={LEVEL1_SETTINGS} isConstructor={false} />
  );
}
