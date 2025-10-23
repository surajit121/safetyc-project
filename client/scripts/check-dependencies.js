/**
 * Script to check for required dependencies before build
 */

const fs = require('fs');
const path = require('path');

// Define critical dependencies to check
const criticalDependencies = [
  'react-toastify',
  'react',
  'react-dom',
  'antd'
];

console.log('Checking for required dependencies before build...');

// Create scripts directory if it doesn't exist
const scriptsDir = path.join(__dirname, '..');
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

let allDependenciesFound = true;
let missingDependencies = [];

// Check each dependency
criticalDependencies.forEach(dep => {
  const depPath = path.join(__dirname, '..', 'node_modules', dep);
  
  try {
    if (fs.existsSync(depPath)) {
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
});

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