var watch = require('node-watch');
const { exec } = require('child_process');

exec('npx tsc logic.ts --outFile logic.js')
watch('logic.ts', { recursive: true }, function(evt, name) {
    exec('npx tsc logic.ts --outFile logic.js')
    console.log('%s changed.', name);
});