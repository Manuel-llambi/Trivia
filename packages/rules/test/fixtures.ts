import { MVP_CONFIG } from '../sim/mvp-config.ts';
import type { RulesConfig } from '../src/types.ts';

export { MVP_CONFIG as mvpConfig };

/** MVP values with stake caps of 10/10, to test the cap mechanism when configured. */
export const cappedConfig: RulesConfig = { ...MVP_CONFIG, questionStakeCap: 10, topicStakeCap: 10 };
