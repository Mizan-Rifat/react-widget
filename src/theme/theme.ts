import deepmerge from 'deepmerge';

// Basic theme object since @primer/react is no longer available
const baseTheme = {
  fonts: {
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", monospace',
  },
};

const customTheme = deepmerge(baseTheme, {
  fonts: {
    mono: 'MonoLisa, monospace',
  },
});

export default customTheme;
