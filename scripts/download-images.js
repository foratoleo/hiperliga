#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

/**
 * Download images script for Hiperliga corporate assets
 * Downloads images from the extracted URLs to local public/images directory
 */

class ImageDownloader {
  constructor() {
    this.baseDir = path.join(__dirname, '..', 'public', 'images', 'empresa');
    this.imageUrlsFile = path.join(__dirname, '..', 'data', 'images-urls.json');
    this.downloadedCount = 0;
    this.failedCount = 0;
    this.results = [];
  }

  async init() {
    // Create directories if they don't exist
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
      console.log('📁 Created directory:', this.baseDir);
    }

    // Create category subdirectories
    const categories = ['logo', 'product', 'benefits', 'sustainability'];
    categories.forEach(category => {
      const categoryDir = path.join(this.baseDir, category);
      if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
        console.log('📁 Created category directory:', category);
      }
    });
  }

  loadImageUrls() {
    try {
      const data = fs.readFileSync(this.imageUrlsFile, 'utf8');
      const imageData = JSON.parse(data);
      return imageData.corporateImages;
    } catch (error) {
      console.error('❌ Error loading image URLs:', error.message);
      return [];
    }
  }

  downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      
      console.log('⬇️  Downloading:', path.basename(filepath));
      
      protocol.get(url, (response) => {
        if (response.statusCode === 200) {
          const fileStream = fs.createWriteStream(filepath);
          response.pipe(fileStream);
          
          fileStream.on('finish', () => {
            fileStream.close();
            console.log('✅ Downloaded:', path.basename(filepath));
            resolve({ success: true, filepath });
          });
          
          fileStream.on('error', (error) => {
            fs.unlink(filepath, () => {}); // Delete partial file
            console.error('❌ File write error:', error.message);
            reject(error);
          });
        } else if (response.statusCode === 301 || response.statusCode === 302) {
          // Handle redirects
          const redirectUrl = response.headers.location;
          console.log('🔄 Redirecting to:', redirectUrl);
          this.downloadImage(redirectUrl, filepath).then(resolve).catch(reject);
        } else {
          console.error(`❌ HTTP ${response.statusCode} for ${url}`);
          reject(new Error(`HTTP ${response.statusCode}`));
        }
      }).on('error', (error) => {
        console.error('❌ Download error:', error.message);
        reject(error);
      });
    });
  }

  async downloadAll() {
    console.log('🚀 Starting Hiperliga corporate images download...\n');
    
    await this.init();
    const images = this.loadImageUrls();
    
    if (images.length === 0) {
      console.log('❌ No images found to download');
      return;
    }

    console.log(`📊 Found ${images.length} images to download\n`);

    for (const image of images) {
      try {
        const categoryDir = path.join(this.baseDir, image.category);
        const filepath = path.join(categoryDir, image.filename);
        
        // Skip if file already exists
        if (fs.existsSync(filepath)) {
          console.log('⏭️  Skipping existing:', image.filename);
          this.results.push({
            url: image.url,
            filepath,
            status: 'skipped',
            reason: 'already exists'
          });
          continue;
        }

        await this.downloadImage(image.url, filepath);
        this.downloadedCount++;
        
        this.results.push({
          url: image.url,
          filepath,
          filename: image.filename,
          category: image.category,
          status: 'success'
        });

        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`❌ Failed to download ${image.filename}:`, error.message);
        this.failedCount++;
        
        this.results.push({
          url: image.url,
          filename: image.filename,
          category: image.category,
          status: 'failed',
          error: error.message
        });
      }
    }

    this.generateReport();
  }

  generateReport() {
    console.log('\n📊 DOWNLOAD REPORT');
    console.log('='.repeat(50));
    console.log(`✅ Successfully downloaded: ${this.downloadedCount}`);
    console.log(`❌ Failed downloads: ${this.failedCount}`);
    console.log(`⏭️  Skipped (existing): ${this.results.filter(r => r.status === 'skipped').length}`);
    console.log(`📁 Total images: ${this.results.length}`);
    
    // Save detailed report
    const reportPath = path.join(__dirname, '..', 'data', 'download-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.length,
        downloaded: this.downloadedCount,
        failed: this.failedCount,
        skipped: this.results.filter(r => r.status === 'skipped').length
      },
      results: this.results
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    
    if (this.failedCount > 0) {
      console.log('\n❌ Failed downloads:');
      this.results
        .filter(r => r.status === 'failed')
        .forEach(r => console.log(`   - ${r.filename}: ${r.error}`));
    }
    
    console.log('\n🎉 Corporate images download completed!');
  }
}

// Run the downloader if script is executed directly
if (require.main === module) {
  const downloader = new ImageDownloader();
  downloader.downloadAll().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = ImageDownloader;