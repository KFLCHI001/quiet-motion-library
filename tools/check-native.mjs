// Parse and bundle every React Native source with host packages left external.
// This proves syntax and import resolution for .js/.jsx only — not native rendering.
import { build } from 'esbuild';

const entries = [
  'native/KeptCue.jsx',
  'native/SignalFieldReanimated.jsx',
  'native/useMotionPolicy.js',
  'native/usePacedCycle.js',
  'examples/signal-field/react-native-example.jsx',
];
await build({
  entryPoints: entries,
  bundle: true,
  write: false,
  outdir: 'out',
  jsx: 'automatic',
  resolveExtensions: ['.js', '.jsx', '.json'], // Expo's default Metro set; no .mjs
  external: ['react', 'react/jsx-runtime', 'react-native', 'react-native-reanimated'],
  logLevel: 'error',
});
console.log(`native sources: PASS (${entries.length} entries bundle with Metro-style extensions)`);
