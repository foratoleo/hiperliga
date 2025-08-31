#!/usr/bin/env python3
"""
🎨 HIPERLIGA IMAGE OPTIMIZATION SCRIPT  
Otimiza imagens para web moderna com formatos WebP/AVIF
"""

import os
import json
from pathlib import Path
from PIL import Image, ImageOps
import subprocess
import time

# Configuração
IMAGES_DIR = Path("../public/images")
BREAKPOINTS = {
    'mobile': 640,
    'tablet': 768, 
    'desktop': 1200,
    'xl': 1920
}

QUALITY_SETTINGS = {
    'webp': 80,
    'avif': 50,
    'jpg': 85
}

class ImageOptimizer:
    def __init__(self):
        self.processed_images = []
        self.total_original_size = 0
        self.total_optimized_size = 0
        
    def check_dependencies(self):
        """Verificar se ferramentas necessárias estão instaladas"""
        print("🔧 Verificando dependências...")
        
        # Verificar cwebp
        try:
            subprocess.run(['cwebp', '-version'], capture_output=True, check=True)
            print("   ✅ cwebp (WebP) disponível")
        except:
            print("   ❌ cwebp não encontrado. Instale com: brew install webp")
            return False
            
        # Verificar avifenc (opcional)
        try:
            subprocess.run(['avifenc', '--help'], capture_output=True, check=True)
            print("   ✅ avifenc (AVIF) disponível")
            self.has_avif = True
        except:
            print("   ⚠️  avifenc não encontrado. AVIF será ignorado.")
            self.has_avif = False
            
        return True
        
    def get_optimal_size(self, original_width, original_height, category):
        """Determinar tamanho otimizado baseado na categoria"""
        
        # Configurações por categoria
        size_configs = {
            '01_brand': {'max_width': 400, 'max_height': 200},
            '02_hero': {'max_width': 1920, 'max_height': 1080},
            '03_products': {'max_width': 800, 'max_height': 600},
            '04_benefits': {'max_width': 600, 'max_height': 400},
            '05_gallery': {'max_width': 1200, 'max_height': 900}, 
            '06_about': {'max_width': 800, 'max_height': 600},
            '07_social': {'max_width': 64, 'max_height': 64},
            '08_misc': {'max_width': 1000, 'max_height': 750}
        }
        
        config = size_configs.get(category.split('/')[0], {'max_width': 1000, 'max_height': 750})
        
        # Calcular novo tamanho mantendo aspecto
        ratio = min(
            config['max_width'] / original_width,
            config['max_height'] / original_height,
            1.0  # Nunca aumentar
        )
        
        new_width = int(original_width * ratio)
        new_height = int(original_height * ratio)
        
        return new_width, new_height
        
    def create_responsive_versions(self, image_path, output_base):
        """Criar versões responsivas da imagem"""
        versions = {}
        
        with Image.open(image_path) as img:
            original_width, original_height = img.size
            
            # Otimizar orientação EXIF
            img = ImageOps.exif_transpose(img)
            
            for breakpoint, max_width in BREAKPOINTS.items():
                # Skip se imagem já é menor
                if original_width <= max_width:
                    continue
                    
                # Calcular novo tamanho
                ratio = max_width / original_width
                new_width = max_width
                new_height = int(original_height * ratio)
                
                # Redimensionar
                resized_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                
                # Salvar versão JPG otimizada
                jpg_path = f"{output_base}-{breakpoint}.jpg"
                resized_img.convert('RGB').save(jpg_path, 'JPEG', 
                                               quality=QUALITY_SETTINGS['jpg'], 
                                               optimize=True)
                versions[f'{breakpoint}_jpg'] = jpg_path
                
                # Converter para WebP
                webp_path = f"{output_base}-{breakpoint}.webp"
                self.convert_to_webp(jpg_path, webp_path)
                versions[f'{breakpoint}_webp'] = webp_path
                
                # Converter para AVIF se disponível
                if self.has_avif:
                    avif_path = f"{output_base}-{breakpoint}.avif"
                    self.convert_to_avif(jpg_path, avif_path)
                    versions[f'{breakpoint}_avif'] = avif_path
        
        return versions
        
    def convert_to_webp(self, input_path, output_path):
        """Converter imagem para WebP"""
        try:
            cmd = [
                'cwebp',
                f'-q', str(QUALITY_SETTINGS['webp']),
                '-m', '6',  # Máximo esforço de compressão
                input_path,
                '-o', output_path
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                return True
            else:
                print(f"   ❌ Erro WebP: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"   ❌ Erro ao converter WebP: {e}")
            return False
            
    def convert_to_avif(self, input_path, output_path):
        """Converter imagem para AVIF"""
        try:
            cmd = [
                'avifenc',
                '--min', '0',
                '--max', '63',
                '-a', 'end-usage=q',
                '-a', f'cq-level={QUALITY_SETTINGS["avif"]}',
                '-a', 'tune=ssim',
                input_path,
                output_path
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                return True
            else:
                print(f"   ❌ Erro AVIF: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"   ❌ Erro ao converter AVIF: {e}")
            return False
            
    def optimize_single_image(self, image_path, category):
        """Otimizar uma imagem específica"""
        print(f"🎨 Otimizando: {image_path.name}")
        
        try:
            # Informações originais
            original_size = image_path.stat().st_size
            self.total_original_size += original_size
            
            with Image.open(image_path) as img:
                original_width, original_height = img.size
                
            # Determinar tamanho otimizado
            optimal_width, optimal_height = self.get_optimal_size(
                original_width, original_height, category
            )
            
            # Path base para versões otimizadas
            output_base = image_path.parent / image_path.stem
            
            # Se precisa redimensionar
            if optimal_width != original_width or optimal_height != original_height:
                print(f"   📏 Redimensionando: {original_width}x{original_height} → {optimal_width}x{optimal_height}")
                
                with Image.open(image_path) as img:
                    # Otimizar orientação EXIF
                    img = ImageOps.exif_transpose(img)
                    
                    # Redimensionar
                    resized_img = img.resize((optimal_width, optimal_height), Image.Resampling.LANCZOS)
                    
                    # Salvar JPG otimizado
                    optimized_jpg = f"{output_base}-optimized.jpg"
                    resized_img.convert('RGB').save(optimized_jpg, 'JPEG',
                                                   quality=QUALITY_SETTINGS['jpg'],
                                                   optimize=True)
            else:
                # Apenas otimizar sem redimensionar
                optimized_jpg = f"{output_base}-optimized.jpg"
                with Image.open(image_path) as img:
                    img = ImageOps.exif_transpose(img)
                    img.convert('RGB').save(optimized_jpg, 'JPEG',
                                          quality=QUALITY_SETTINGS['jpg'],
                                          optimize=True)
            
            # Converter para WebP
            optimized_webp = f"{output_base}-optimized.webp"
            webp_success = self.convert_to_webp(optimized_jpg, optimized_webp)
            
            # Converter para AVIF se disponível
            avif_success = False
            if self.has_avif:
                optimized_avif = f"{output_base}-optimized.avif"  
                avif_success = self.convert_to_avif(optimized_jpg, optimized_avif)
            
            # Criar versões responsivas
            responsive_versions = self.create_responsive_versions(image_path, str(output_base))
            
            # Calcular economia de espaço
            optimized_size = Path(optimized_jpg).stat().st_size if Path(optimized_jpg).exists() else original_size
            self.total_optimized_size += optimized_size
            
            savings = ((original_size - optimized_size) / original_size) * 100
            
            # Registrar resultado
            result = {
                'original_path': str(image_path),
                'category': category,
                'original_size': original_size,
                'optimized_size': optimized_size,
                'savings_percent': savings,
                'original_dimensions': f"{original_width}x{original_height}",
                'optimized_dimensions': f"{optimal_width}x{optimal_height}",
                'webp_created': webp_success,
                'avif_created': avif_success,
                'responsive_versions': responsive_versions
            }
            
            self.processed_images.append(result)
            
            print(f"   ✅ Economia: {savings:.1f}% ({original_size/1024:.1f}KB → {optimized_size/1024:.1f}KB)")
            
            return True
            
        except Exception as e:
            print(f"   ❌ Erro ao otimizar {image_path}: {e}")
            return False
            
    def generate_next_config(self):
        """Gerar configuração Next.js otimizada"""
        config = """
// next.config.js - Configuração otimizada para imagens Hiperliga

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['hiperliga.com.br'],
    
    // Otimizações avançadas
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 dias
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Compressão adicional
  compress: true,
  
  // Headers otimizados para imagens
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
"""
        
        config_path = Path("../next.config.optimized.js")
        with open(config_path, 'w') as f:
            f.write(config)
            
        print(f"📝 Configuração Next.js salva: {config_path}")
        
    def generate_component_templates(self):
        """Gerar templates de componentes otimizados"""
        
        # Template OptimizedImage
        optimized_image_template = """
// src/components/ui/optimized-image.tsx
'use client'

import Image, { ImageProps } from 'next/image'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Loading } from '@/components/ui/loading'

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string
  alt: string
  category?: 'hero' | 'product' | 'benefit' | 'gallery' | 'brand' | 'misc'
  loading?: 'eager' | 'lazy'
  showLoader?: boolean
}

export function OptimizedImage({
  src,
  alt,
  category = 'misc', 
  className,
  loading = 'lazy',
  showLoader = true,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Determine responsive sizes based on category
  const getSizes = () => {
    switch (category) {
      case 'hero':
        return '100vw'
      case 'product':
        return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw'
      case 'benefit':
        return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 300px'
      case 'gallery':
        return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px'
      case 'brand':
        return '200px'
      default:
        return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
    }
  }

  if (hasError) {
    return (
      <div className={cn(
        'flex items-center justify-center bg-gray-100 text-gray-400 text-sm',
        className
      )}>
        Imagem não disponível
      </div>
    )
  }

  return (
    <div className="relative">
      {isLoading && showLoader && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <Loading variant="sustainable" size="sm" />
        </div>
      )}
      
      <Image
        src={src}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        sizes={getSizes()}
        loading={loading}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
        {...props}
      />
    </div>
  )
}
"""

        # Salvar template
        template_path = Path("../src/components/ui/optimized-image.tsx")
        template_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(template_path, 'w') as f:
            f.write(optimized_image_template)
            
        print(f"🧩 Template OptimizedImage criado: {template_path}")
        
    def save_optimization_report(self):
        """Salvar relatório de otimização"""
        report = {
            'summary': {
                'total_images': len(self.processed_images),
                'total_original_size_mb': self.total_original_size / 1024 / 1024,
                'total_optimized_size_mb': self.total_optimized_size / 1024 / 1024,
                'total_savings_mb': (self.total_original_size - self.total_optimized_size) / 1024 / 1024,
                'total_savings_percent': ((self.total_original_size - self.total_optimized_size) / self.total_original_size) * 100,
                'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
            },
            'images': self.processed_images
        }
        
        report_path = IMAGES_DIR / "optimization_report.json"
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
            
        print(f"📊 Relatório de otimização salvo: {report_path}")
        
    def run(self):
        """Executar otimização completa"""
        print("🎨 INICIANDO OTIMIZAÇÃO DE IMAGENS HIPERLIGA")
        print("="*60)
        
        # Verificar dependências
        if not self.check_dependencies():
            print("❌ Dependências não atendidas. Abortando.")
            return
            
        # Encontrar todas as imagens
        image_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
        all_images = []
        
        for folder in IMAGES_DIR.iterdir():
            if folder.is_dir() and not folder.name.startswith('.'):
                for img_path in folder.rglob('*'):
                    if img_path.suffix.lower() in image_extensions:
                        # Skip imagens já otimizadas
                        if 'optimized' not in img_path.name and 'mobile' not in img_path.name:
                            all_images.append((img_path, folder.name))
        
        print(f"🖼️  Encontradas {len(all_images)} imagens para otimizar")
        
        # Otimizar cada imagem
        success_count = 0
        for i, (img_path, category) in enumerate(all_images, 1):
            print(f"\\n[{i}/{len(all_images)}] Processando {category}/{img_path.name}")
            
            if self.optimize_single_image(img_path, category):
                success_count += 1
        
        # Gerar arquivos auxiliares
        self.generate_next_config()
        self.generate_component_templates()
        self.save_optimization_report()
        
        # Relatório final
        print("\\n" + "="*60)
        print("📊 RELATÓRIO FINAL DE OTIMIZAÇÃO")
        print("="*60)
        
        total_original_mb = self.total_original_size / 1024 / 1024
        total_optimized_mb = self.total_optimized_size / 1024 / 1024
        total_savings_mb = total_original_mb - total_optimized_mb
        savings_percent = (total_savings_mb / total_original_mb) * 100
        
        print(f"✅ Imagens processadas: {success_count}/{len(all_images)}")
        print(f"💾 Tamanho original: {total_original_mb:.1f} MB")
        print(f"💾 Tamanho otimizado: {total_optimized_mb:.1f} MB")
        print(f"🎯 Economia total: {total_savings_mb:.1f} MB ({savings_percent:.1f}%)")
        
        print("\\n🎉 OTIMIZAÇÃO CONCLUÍDA COM SUCESSO!")
        print("\\n🚀 PRÓXIMOS PASSOS:")
        print("1. Substitua next.config.js pelo next.config.optimized.js")
        print("2. Use o componente OptimizedImage nos componentes premium")
        print("3. Teste performance com Lighthouse")

if __name__ == "__main__":
    optimizer = ImageOptimizer()
    optimizer.run()