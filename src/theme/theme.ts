import { theme } from '@primer/react';
import deepmerge from 'deepmerge';

const customTheme = deepmerge(theme, {
  fonts: {
    mono: 'MonoLisa, monospace',
  },
});

export default customTheme;
