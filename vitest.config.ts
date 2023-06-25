import { EnvironmentOptions } from 'vitest';
import { Window } from 'happy-dom';

const environmentOptions: EnvironmentOptions = {
  globals: {
    window: new Window(),
    document: (new Window()).document,
  },
};

export default environmentOptions;
