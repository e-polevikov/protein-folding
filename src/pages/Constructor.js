import { FoldingStage } from '../components/FoldingStage/FoldingStage';
import { CONSTRUCTOR_SETTINGS } from '../constants/Constructor';

export function Constructor() {
  return (
    <FoldingStage settings={CONSTRUCTOR_SETTINGS} isConstructor={true} />
  );
}
