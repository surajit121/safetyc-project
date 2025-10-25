import fs from 'fs'
import path from 'path'

export default function copyStaticFiles() {
  return {
    name: 'copy-static-files',
    closeBundle() {
      const files = ['sitemap.xml', 'robots.txt']
      const publicDir = path.resolve(__dirname, 'public')
      const outDir = path.resolve(__dirname, 'dist')

      files.forEach(file => {
        const srcPath = path.join(publicDir, file)
        const destPath = path.join(outDir, file)
        
        if (fs.existsSync(srcPath)) {
          fs.copyFileSync(srcPath, destPath)
          console.log(`Copied ${file} to build output`)
        }
      })
    }
  }
}