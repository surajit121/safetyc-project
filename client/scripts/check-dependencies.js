/**
 * Script to check for required dependencies before build
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define critical dependencies to check
const criticalDependencies = [
  'react-toastify',
  'react',
  'react-dom',
  'antd'
];

async function checkDependencies() {
  console.log('Checking for required dependencies before build...');

  const projectRoot = join(__dirname, '..');
  let allDependenciesFound = true;
  let missingDependencies = [];

  // Check each dependency
  for (const dep of criticalDependencies) {
    const depPath = join(projectRoot, 'node_modules', dep);
    
    try {
      if (existsSync(depPath)) {
        console.log(`✅ ${dep} found at ${depPath}`);
      } else {
        console.error(`❌ ERROR: ${dep} not found!`);
        allDependenciesFound = false;
        missingDependencies.push(dep);
      }
    } catch (err) {
      console.error(`❌ ERROR checking for ${dep}:`, err);
      allDependenciesFound = false;
      missingDependencies.push(dep);
    }
  }

  // If any dependencies are missing, try to install them
  if (!allDependenciesFound) {
    console.error('\n⚠️ Missing dependencies detected: ' + missingDependencies.join(', '));
    console.log('\nAttempting emergency dependency installation...');
    
    // Exit with error code if any dependencies are missing
    console.error('\n⛔ Build cannot continue with missing dependencies.');
    console.error('Please run: npm install');
    process.exit(1);
  } else {
    console.log('\n✅ All required dependencies found! Proceeding with build...');
  }
}

// Run the async function
checkDependencies().catch(error => {
  console.error('Error during dependency check:', error);
  process.exit(1);
});