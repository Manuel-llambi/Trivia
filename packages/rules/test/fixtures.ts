import { MVP_CONFIG } from '../sim/mvp-config.ts';
import type { RulesConfig } from '../src/types.ts';

export { MVP_CONFIG as mvpConfig };

/** MVP values without stake caps, to test bag limits in isolation. */
export const uncappedConfig: RulesConfig = { ...MVP_CONFIG, questionStakeCap: null, topicStakeCap: null };
