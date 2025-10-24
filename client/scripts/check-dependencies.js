/**
 * Script to check for required dependencies before build
 */

const path = require('path');
const fs = require('fs');

// Define critical dependencies to check
const criticalDependencies = [
  'react-toastify',
  'react',
  'react-dom',
  'antd'
];

function checkDependencies() {
  console.log('Checking for required dependencies before build...');

  const projectRoot = path.join(__dirname, '..');
  let allDependenciesFound = true;
  let missingDependencies = [];

  // Check each dependency
  criticalDependencies.forEach(dep => {
    const depPath = path.join(projectRoot, 'node_modules', dep);
    
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
}

// Run the check
try {
  checkDependencies();
} catch (error) {
  console.error('Error during dependency check:', error);
  process.exit(1);
}