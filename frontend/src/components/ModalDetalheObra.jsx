import React from 'react';
import { X, BookOpen, Star, ExternalLink, Globe, BookMarked, CheckCircle2 } from 'lucide-react';

export default function ModalDetalheObra({
  obra,
  aberto,
  onClose,
  onLerAgora,
  onToggleFavorito
}) {
  if (!aberto || !obra) return null;

  const subjects = (() => {
    try {
      if (typeof obra.subjects_json === 'string') {
        return JSON.parse(obra.subjects_json);
      }
      return obra.subjects_json || [];
    } catch {
      return [];
    }
  })();

  const isFavorito = !!obra.is_favorite;
  const progressPercent = obra.progress?.percentage ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#072A24]/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] rounded-[12px] shadow-2xl border border-[#D5DED7] overflow-hidden max-h-[90vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Topo */}
        <div className="px-6 py-4 border-b border-[#D5DED7] flex items-center justify-between bg-[#F7F6F1]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#80602B] bg-[#FFF3D8] px-2 py-0.5 rounded">
              Biblioteca Digital
            </span>
            <span className="text-xs text-[#5C6D65] numeric">
              ID #{obra.external_id || obra.id}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#5C6D65] hover:text-[#203B34] hover:bg-[#EAF4ED] rounded-[6px] transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com Capa e Detalhes */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            
            {/* Capa Proporcional sem cortes */}
            <div className="w-36 sm:w-44 h-52 sm:h-60 rounded-[8px] bg-[#F0F2ED] border border-[#D5DED7] overflow-hidden shrink-0 shadow-sm flex items-center justify-center mx-auto sm:mx-0">
              {obra.cover_url ? (
                <img 
                  src={obra.cover_url} 
                  alt="" 
                  className="w-full h-full object-contain p-1" 
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-[#5C6D65]/60 p-4 text-center">
                  <BookOpen className="w-8 h-8 mb-2 stroke-1" />
                  <span className="text-xs font-medium">Sem imagem de capa</span>
                </div>
              )}
            </div>

            {/* Informações Bibliográficas */}
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0A372F] leading-snug">
                  {obra.title}
                </h2>
                <p className="text-sm font-semibold text-[#1D5E51] mt-1">
                  {obra.author}
                </p>
              </div>

              {/* Badges de Idioma e Licença */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAF4ED] text-[#216044] font-medium border border-[#216044]/20">
                  <Globe className="w-3 h-3" />
                  {obra.language === 'pt' ? 'Português' : obra.language === 'en' ? 'Inglês' : obra.language}
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EFF6F2] text-[#1D5E51] font-medium border border-[#DCEDE6]">
                  <CheckCircle2 className="w-3 h-3" />
                  {obra.copyright_status || 'Domínio Público'}
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F0F2ED] text-[#5C6D65] numeric">
                  {obra.download_count} acessos na fonte
                </span>
              </div>

              {/* Botão de Destaque para Leitura Imediata */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLerAgora(obra);
                  }}
                  className="w-full sm:w-auto h-12 px-6 bg-[#1D5E51] hover:bg-[#154B41] text-white text-sm font-semibold rounded-[6px] flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <BookOpen className="w-5 h-5 text-[#C6A15B]" />
                  <span>{progressPercent > 0 ? 'Continuar Lendo Obra' : 'Abrir Livro e Ler Agora (Páginas Reais)'}</span>
                </button>
              </div>

              {/* Barra de Progresso se houver leitura prévia */}
              {progressPercent > 0 && (
                <div className="p-3 bg-[#EFF6F2] border border-[#DCEDE6] rounded-[6px] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#0A372F] flex items-center gap-1">
                      <BookMarked className="w-3.5 h-3.5 text-[#1D5E51]" />
                      Leitura em andamento: {obra.progress?.chapter_title || 'Capítulo Atual'}
                    </span>
                    <span className="font-bold text-[#1D5E51] numeric">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-[#DCEDE6] h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#1D5E51] h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Descrição / Assuntos */}
              <div>
                <h4 className="text-xs font-semibold text-[#5C6D65] uppercase tracking-wider mb-1">
                  Temas e Classificação
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {subjects.length > 0 ? (
                    subjects.slice(0, 4).map((sub, idx) => (
                      <span key={idx} className="text-xs bg-[#F0F2ED] text-[#203B34] px-2 py-0.5 rounded">
                        {sub}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#5C6D65]">Literatura clássica do acervo</span>
                  )}
                </div>
              </div>

              {/* Origem */}
              <div className="text-xs text-[#5C6D65] pt-1">
                Fonte: <span className="font-medium text-[#203B34]">Project Gutenberg ({obra.source})</span>.
              </div>

            </div>

          </div>
        </div>

        {/* Rodapé com Ações */}
        <div className="p-4 sm:px-6 bg-[#F7F6F1] border-t border-[#D5DED7] flex flex-wrap items-center justify-between gap-3">
          
          {/* Botão de Favoritar */}
          <button
            type="button"
            onClick={() => onToggleFavorito(obra.id)}
            className={`h-11 px-4 text-xs font-semibold rounded-[6px] border flex items-center gap-2 transition-colors ${
              isFavorito 
                ? 'bg-[#FFF3D8] border-[#80602B] text-[#80602B]' 
                : 'bg-[#FFFFFF] border-[#7D8D83] text-[#5C6D65] hover:bg-[#F0F2ED]'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorito ? 'fill-[#C6A15B] text-[#C6A15B]' : ''}`} />
            <span>{isFavorito ? 'Nos Favoritos' : 'Adicionar aos Favoritos'}</span>
          </button>

          <div className="flex items-center gap-2">
            {obra.html_url && (
              <a
                href={obra.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-3 bg-[#FFFFFF] hover:bg-[#F0F2ED] border border-[#7D8D83] text-[#5C6D65] hover:text-[#203B34] text-xs font-medium rounded-[6px] inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Ler na fonte</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {obra.is_readable ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLerAgora(obra);
                }}
                className="h-11 px-6 bg-[#1D5E51] hover:bg-[#154B41] text-white text-sm font-semibold rounded-[6px] flex items-center gap-2 shadow-sm transition-colors"
              >
                <BookOpen className="w-4 h-4 text-[#C6A15B]" />
                <span>{progressPercent > 0 ? 'Continuar Lendo' : 'Ler Agora'}</span>
              </button>
            ) : (
              <span className="text-xs text-[#5C6D65] italic py-2">
                Leitura disponível apenas na fonte
              </span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
