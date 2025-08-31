'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  PlayIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  TagIcon
} from '@heroicons/react/24/outline'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } }
}

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } }
}

interface VideoItem {
  id: string
  title: string
  description: string
  category: string
  youtubeId: string
  thumbnail: string
  duration: string
}

const videos: VideoItem[] = [
  {
    id: '1',
    title: 'Aplicação da Hiperliga - Tutorial Completo',
    description: 'Veja passo a passo como aplicar a argamassa polimérica Hiperliga em sua obra',
    category: 'Tutorial',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    thumbnail: '/images/03_products/hiperliga/hiperliga-1-optimized.webp',
    duration: '8:32'
  },
  {
    id: '2', 
    title: 'Hiperliga vs Argamassa Tradicional - Comparativo',
    description: 'Comparação prática demonstrando as vantagens da Hiperliga sobre métodos tradicionais',
    category: 'Comparativo',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    thumbnail: '/images/03_products/hiperliga/desempenho-e-durabilidade-usar-1024x1024-optimized.webp',
    duration: '5:45'
  },
  {
    id: '3',
    title: 'Depoimento: Construção Residencial em Curitiba',
    description: 'Mestre de obras relata a experiência usando Hiperliga em construção residencial',
    category: 'Depoimento',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    thumbnail: '/images/03_products/hiperliga/versatilidade-usar-optimized.webp',
    duration: '3:20'
  },
  {
    id: '4',
    title: 'Aplicação de Texturas Gran Finelle',
    description: 'Demonstração da aplicação de texturas e grafiatos da linha Gran Finelle',
    category: 'Tutorial',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    thumbnail: '/images/03_products/hiperliga/economia-de-espaco-e-material-usar-optimized.webp',
    duration: '6:15'
  },
  {
    id: '5',
    title: 'Sustentabilidade: O Impacto da Hiperliga',
    description: 'Entenda como a Hiperliga contribui para uma construção mais sustentável',
    category: 'Institucional',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    thumbnail: '/images/03_products/hiperliga/100-sustentavel-usar-optimized.webp',
    duration: '4:30'
  },
  {
    id: '6',
    title: 'Gran Finelle na Feira da Construção 2023',
    description: 'Cobertura da participação da Gran Finelle na principal feira do setor',
    category: 'Eventos',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder
    thumbnail: '/images/03_products/image_11-optimized.webp',
    duration: '7:10'
  }
]

const categories = ['Todos', 'Tutorial', 'Comparativo', 'Depoimento', 'Institucional', 'Eventos']

export default function VideosPage() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState('Todos')
  const [selectedVideo, setSelectedVideo] = React.useState<VideoItem | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Todos' || video.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const openVideoModal = (video: VideoItem) => {
    setSelectedVideo(video)
    setIsModalOpen(true)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
  }

  const closeVideoModal = () => {
    setIsModalOpen(false)
    setSelectedVideo(null)
    // Restore body scroll
    document.body.style.overflow = 'unset'
  }

  // Close modal on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeVideoModal()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isModalOpen])

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <Section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[url('/images/03_products/hiperliga/pattern-bg2-optimized.webp')] opacity-10" />
        
        <Container className="relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              🎥 Demonstrações e Tutoriais
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Vídeos
            </h1>
            
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-white/90 leading-relaxed">
              Assista a vídeos sobre nossos products em ação, tutoriais de aplicação e 
              histórias de sucesso de clientes
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
              <input
                type="text"
                placeholder="Buscar vídeos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Categories Filter */}
      <Section className="bg-muted/30">
        <Container>
          <motion.div
            className="flex flex-wrap gap-3 justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerChildren}
          >
            {categories.map((category) => (
              <motion.div key={category} variants={fadeInUp}>
                <Button
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="flex items-center gap-2"
                >
                  <TagIcon className="h-4 w-4" />
                  {category}
                  {category !== 'Todos' && (
                    <Badge variant="secondary" className="ml-1">
                      {videos.filter(v => v.category === category).length}
                    </Badge>
                  )}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      {/* Videos Grid */}
      <Section>
        <Container>
          {filteredVideos.length > 0 ? (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerChildren}
            >
              {filteredVideos.map((video) => (
                <motion.div key={video.id} variants={scaleIn}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
                    <div 
                      className="relative aspect-video bg-muted"
                      onClick={() => openVideoModal(video)}
                    >
                      {/* Thumbnail placeholder - in real implementation, use video.thumbnail */}
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center">
                        <PlayIcon className="h-16 w-16 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
                      </div>
                      
                      {/* Category badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-black/50 text-white">
                          {video.category}
                        </Badge>
                      </div>
                      
                      {/* Duration */}
                      <div className="absolute bottom-3 right-3">
                        <Badge variant="secondary" className="bg-black/50 text-white">
                          {video.duration}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-brand-primary transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {video.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <PlayIcon className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum vídeo encontrado</h3>
              <p className="text-muted-foreground mb-6">
                Tente ajustar sua busca ou selecionar uma categoria diferente
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('')
                setSelectedCategory('Todos')
              }}>
                Limpar Filtros
              </Button>
            </motion.div>
          )}
        </Container>
      </Section>

      {/* Video Modal */}
      {isModalOpen && selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeVideoModal}
          />
          
          {/* Modal Content */}
          <motion.div
            className="relative bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close Button */}
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-sm text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            
            {/* Video Player */}
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                title={selectedVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            {/* Video Info */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge>{selectedVideo.category}</Badge>
                <Badge variant="outline">{selectedVideo.duration}</Badge>
              </div>
              <h3 className="text-xl font-bold mb-2">{selectedVideo.title}</h3>
              <p className="text-muted-foreground">{selectedVideo.description}</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}