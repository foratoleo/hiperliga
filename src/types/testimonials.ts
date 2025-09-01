export interface Depoimento {
  nome: string;
  localizacao: string;
  depoimento: string;
  reviews: number;
  categoria: string;
}

export interface EstatisticasEmpresa {
  anosDeMercado: number;
  metrosQuadradosAplicados: string;
  diferencial: string;
}

export interface DepoimentosData {
  estatisticas: EstatisticasEmpresa;
  depoimentos: Depoimento[];
}

export interface TestimonialCardProps {
  depoimento: Depoimento;
  className?: string;
}

export interface TestimonialsSectionProps {
  data: DepoimentosData;
  showStats?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

export interface TestimonialCarouselProps {
  depoimentos: Depoimento[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}