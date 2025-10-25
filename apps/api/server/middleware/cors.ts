import { corsEventHandler } from 'nitro-cors';

export default corsEventHandler(() => {
  // No-op handler; header configuration is handled via corsEventHandler options.
  return null;
}, {
  origin: '*',
  methods: '*',
});
