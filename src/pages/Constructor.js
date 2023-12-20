import { FoldingStage } from '../components/FoldingStage/FoldingStage';
import { CONSTRUCTOR_SETTINGS } from '../constants/Levels';

export function Constructor() {
  return (
    <FoldingStage settings={CONSTRUCTOR_SETTINGS} isConstructor={true} />
  );
}
