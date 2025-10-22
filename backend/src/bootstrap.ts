// backend/src/bootstrap.ts

// Make sure path aliases are active (already handled by -r tsconfig-paths/register in your script)

// Log BEFORE anything else loads your models
// eslint-disable-next-line @typescript-eslint/no-var-requires
console.log('Resolved @shared/types/enums =', require.resolve('@shared/types/enums'));
// eslint-disable-next-line @typescript-eslint/no-var-requires
console.log('Module exports =', require('@shared/types/enums'));

console.log('__dirname:', __dirname);
// Now load your real server entry. This will (transitively) import models.
require('./server'); // or './index' depending on your project
