#!/usr/bin/env python3
"""
🖼️ HIPERLIGA IMAGE MIGRATION SCRIPT
Automatiza download e organização de imagens do site original
"""

import os
import requests
import time
from urllib.parse import urljoin, urlparse
from pathlib import Path
import json
from bs4 import BeautifulSoup

# Configuração
BASE_URL = "https://hiperliga.com.br"
OUTPUT_DIR = Path("../public/images")
DELAY = 1  # Delay entre downloads (respeitar o servidor)

# Estrutura de pastas
FOLDER_STRUCTURE = {
    "01_brand": "Logos e identidade visual",
    "02_hero": "Imagens principais e backgrounds", 
    "03_products": "Produtos e embalagens",
    "03_products/hiperliga": "Produto Hiperliga",
    "03_products/texturas": "Linha de texturas",
    "03_products/grafiatos": "Linha de grafiatos", 
    "03_products/tintas": "Linha de tintas",
    "04_benefits": "Benefícios e vantagens",
    "05_gallery": "Galeria de aplicações",
    "06_about": "Sobre a empresa",
    "07_social": "Ícones redes sociais",
    "08_misc": "Diversos e extras"
}

# Páginas para mapear
PAGES_TO_CRAWL = [
    "/",
    "/hiperliga", 
    "/gran-finelle",
    "/videos",
    "/contato", 
    "/sobre-nos",
    "/faq"
]

class HiperligaImageMigrator:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        self.downloaded_images = []
        self.image_catalog = {}
        
    def setup_directories(self):
        """Criar estrutura de pastas"""
        print("🗂️  Criando estrutura de pastas...")
        
        for folder, description in FOLDER_STRUCTURE.items():
            folder_path = OUTPUT_DIR / folder
            folder_path.mkdir(parents=True, exist_ok=True)
            print(f"   ✅ {folder} - {description}")
            
    def get_page_images(self, page_url):
        """Extrair todas as imagens de uma página"""
        print(f"📄 Analisando página: {page_url}")
        
        try:
            response = self.session.get(page_url)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            images = []
            
            # Encontrar tags img
            for img in soup.find_all('img'):
                src = img.get('src') or img.get('data-src')
                if src:
                    # Resolver URL relativa para absoluta
                    full_url = urljoin(page_url, src)
                    
                    # Informações da imagem
                    image_info = {
                        'url': full_url,
                        'alt': img.get('alt', ''),
                        'class': img.get('class', []),
                        'width': img.get('width'),
                        'height': img.get('height'),
                        'page': page_url
                    }
                    images.append(image_info)
                    
            # Encontrar CSS background-images
            for element in soup.find_all(style=True):
                style = element.get('style', '')
                if 'background-image' in style:
                    # Extrair URL do CSS
                    import re
                    urls = re.findall(r'url\(["\']?([^"\']+)["\']?\)', style)
                    for url in urls:
                        full_url = urljoin(page_url, url)
                        image_info = {
                            'url': full_url,
                            'alt': 'Background image',
                            'class': element.get('class', []),
                            'type': 'background',
                            'page': page_url
                        }
                        images.append(image_info)
                        
            print(f"   🖼️  Encontradas {len(images)} imagens")
            return images
            
        except Exception as e:
            print(f"   ❌ Erro ao processar {page_url}: {e}")
            return []
    
    def categorize_image(self, image_info):
        """Determinar categoria da imagem baseada em contexto"""
        url = image_info['url'].lower()
        alt = image_info['alt'].lower()
        classes = ' '.join(image_info.get('class', [])).lower()
        page = image_info['page'].lower()
        
        # Lógica de categorização
        if 'logo' in url or 'logo' in alt or 'brand' in classes:
            return "01_brand"
        elif 'hero' in url or 'banner' in url or 'principal' in alt:
            return "02_hero"  
        elif 'produto' in url or 'product' in url or 'hiperliga' in page:
            if 'hiperliga' in url or 'hiperliga' in alt:
                return "03_products/hiperliga"
            elif 'textura' in url or 'texture' in alt:
                return "03_products/texturas"
            elif 'grafiato' in url:
                return "03_products/grafiatos"
            elif 'tinta' in url or 'paint' in alt:
                return "03_products/tintas"
            else:
                return "03_products"
        elif 'beneficio' in url or 'vantagem' in alt or 'icon' in classes:
            return "04_benefits"
        elif 'galeria' in url or 'gallery' in url or 'obra' in alt:
            return "05_gallery"
        elif 'sobre' in page or 'empresa' in alt or 'team' in alt:
            return "06_about"
        elif 'social' in url or 'facebook' in url or 'instagram' in url:
            return "07_social"
        else:
            return "08_misc"
    
    def download_image(self, image_info, category):
        """Download de uma imagem específica"""
        url = image_info['url']
        
        try:
            # Determinar nome do arquivo
            parsed_url = urlparse(url)
            filename = os.path.basename(parsed_url.path)
            
            # Se não há extensão, tentar detectar
            if not filename or '.' not in filename:
                response = self.session.head(url)
                content_type = response.headers.get('content-type', '')
                if 'jpeg' in content_type or 'jpg' in content_type:
                    filename = f"image_{len(self.downloaded_images)}.jpg"
                elif 'png' in content_type:
                    filename = f"image_{len(self.downloaded_images)}.png"
                else:
                    filename = f"image_{len(self.downloaded_images)}"
                    
            # Path completo
            file_path = OUTPUT_DIR / category / filename
            
            # Skip se já existe
            if file_path.exists():
                print(f"   ⏭️  Já existe: {filename}")
                return True
                
            # Download
            print(f"   ⬇️  Baixando: {filename}")
            response = self.session.get(url)
            response.raise_for_status()
            
            # Salvar
            with open(file_path, 'wb') as f:
                f.write(response.content)
                
            # Adicionar ao catálogo
            self.downloaded_images.append({
                'original_url': url,
                'local_path': str(file_path),
                'filename': filename,
                'category': category,
                'alt': image_info['alt'],
                'page': image_info['page'],
                'size': len(response.content)
            })
            
            print(f"   ✅ Salvo: {file_path}")
            time.sleep(DELAY)  # Respeitar servidor
            return True
            
        except Exception as e:
            print(f"   ❌ Erro ao baixar {url}: {e}")
            return False
    
    def save_catalog(self):
        """Salvar catálogo de imagens"""
        catalog_path = OUTPUT_DIR / "image_catalog.json"
        
        catalog = {
            'total_images': len(self.downloaded_images),
            'categories': {},
            'images': self.downloaded_images,
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        # Contar por categoria
        for img in self.downloaded_images:
            category = img['category']
            if category not in catalog['categories']:
                catalog['categories'][category] = 0
            catalog['categories'][category] += 1
            
        with open(catalog_path, 'w', encoding='utf-8') as f:
            json.dump(catalog, f, indent=2, ensure_ascii=False)
            
        print(f"📋 Catálogo salvo: {catalog_path}")
    
    def generate_report(self):
        """Gerar relatório de migração"""
        print("\n" + "="*60)
        print("📊 RELATÓRIO DE MIGRAÇÃO")
        print("="*60)
        
        print(f"🖼️  Total de imagens baixadas: {len(self.downloaded_images)}")
        
        # Por categoria
        categories = {}
        total_size = 0
        
        for img in self.downloaded_images:
            category = img['category']
            size = img['size']
            
            if category not in categories:
                categories[category] = {'count': 0, 'size': 0}
            
            categories[category]['count'] += 1
            categories[category]['size'] += size
            total_size += size
        
        print(f"💾 Tamanho total: {total_size / 1024 / 1024:.1f} MB")
        print("\nPor categoria:")
        
        for category, stats in sorted(categories.items()):
            count = stats['count']
            size_mb = stats['size'] / 1024 / 1024
            print(f"   📁 {category}: {count} imagens ({size_mb:.1f} MB)")
            
        print("\n🎯 PRÓXIMOS PASSOS:")
        print("1. Execute otimização: python optimize_images.py")
        print("2. Implemente nos componentes premium")  
        print("3. Teste responsividade e performance")
        print("4. Valide acessibilidade")
        
    def run(self):
        """Executar migração completa"""
        print("🚀 INICIANDO MIGRAÇÃO DE IMAGENS HIPERLIGA")
        print("="*60)
        
        # Setup
        self.setup_directories()
        
        # Coletar todas as imagens
        all_images = []
        for page in PAGES_TO_CRAWL:
            page_url = urljoin(BASE_URL, page)
            images = self.get_page_images(page_url)
            all_images.extend(images)
        
        print(f"\n🔍 Total de imagens encontradas: {len(all_images)}")
        
        # Download com categorização
        print("\n⬇️  INICIANDO DOWNLOADS...")
        success_count = 0
        
        for i, image_info in enumerate(all_images, 1):
            print(f"\n[{i}/{len(all_images)}] Processando imagem...")
            
            category = self.categorize_image(image_info)
            success = self.download_image(image_info, category)
            
            if success:
                success_count += 1
        
        # Finalizar
        self.save_catalog()
        self.generate_report()
        
        print(f"\n🎉 MIGRAÇÃO CONCLUÍDA!")
        print(f"✅ {success_count}/{len(all_images)} imagens baixadas com sucesso")

if __name__ == "__main__":
    migrator = HiperligaImageMigrator()
    migrator.run()