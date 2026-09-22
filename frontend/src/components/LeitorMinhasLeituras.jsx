import React, { useState } from 'react';
import { Bookmark, Star, BookOpen, ArrowRight } from 'lucide-react';

export default function LeitorMinhasLeituras({
  minhasLeituras,
  favoritos,
  onLerAgora,
  onAbrirDetalhes,
  setPagina
}) {
  const [abaAtiva, setAbaAtiva] = useState('andamento'); // 'andamento', 'favoritos'

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D5DED7]">
        <div>
          <h2 className="text-2xl sm:text-[1.75rem] font-semibold text-[#0A372F] tracking-tight">
            Minha Estante e Leituras
          </h2>
          <p className="text-sm text-[#5C6D65] mt-1">
            Seus livros em andamento, posições salvas e títulos favoritados
          </p>
        </div>
      </div>

      {/* Abas */}
      <div className="flex gap-2 border-b border-[#D5DED7]">
        <button
          onClick={() => setAbaAtiva('andamento')}
          className={`h-11 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            abaAtiva === 'andamento'
              ? 'border-[#1D5E51] text-[#0A372F]'
              : 'border-transparent text-[#5C6D65] hover:text-[#203B34]'
          }`}
        >
          <Bookmark className="w-4 h-4 text-[#1D5E51]" />
          <span>Em Andamento ({minhasLeituras.length})</span>
        </button>

        <button
          onClick={() => setAbaAtiva('favoritos')}
          className={`h-11 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            abaAtiva === 'favoritos'
              ? 'border-[#C6A15B] text-[#80602B]'
              : 'border-transparent text-[#5C6D65] hover:text-[#80602B]'
          }`}
        >
          <Star className="w-4 h-4 text-[#C6A15B]" />
          <span>Favoritos ({favoritos.length})</span>
        </button>
      </div>

      {/* Conteúdo da Aba Em Andamento */}
      {abaAtiva === 'andamento' && (
        <div className="space-y-4">
          {minhasLeituras.length === 0 ? (
            <div className="p-12 text-center text-[#5C6D65] bg-[#FFFFFF] border border-[#D5DED7] rounded-[8px] space-y-3">
              <BookOpen className="w-10 h-10 text-[#7D8D83] mx-auto stroke-1" />
              <h3 className="text-base font-semibold text-[#203B34]">
                Você ainda não iniciou nenhuma leitura digital.
              </h3>
              <p className="text-xs max-w-sm mx-auto">
                Explore nosso catálogo com centenas de clássicos em domínio público e comece a ler agora mesmo.
              </p>
              <button
                onClick={() => setPagina('explorar')}
                className="mt-2 h-10 px-5 bg-[#1D5E51] hover:bg-[#154B41] text-white text-xs font-semibold rounded-[6px] inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Explorar Catálogo Digital</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {minhasLeituras.map((item) => {
                const livro = item.digital_book;
                if (!livro) return null;
                return (
                  <div 
                    key={item.id} 
                    className="p-4 bg-[#FFFFFF] border border-[#D5DED7] rounded-[8px] flex items-center gap-4 hover:border-[#1D5E51] transition-all shadow-xs"
                  >
                    <div className="w-16 h-24 rounded bg-[#F0F2ED] border border-[#D5DED7] overflow-hidden shrink-0 flex items-center justify-center">
                      {livro.cover_url ? (
                        <img 
                          src={livro.cover_url} 
                          alt="" 
                          className="w-full h-full object-contain p-0.5" 
                        />
                      ) : (
                        <BookOpen className="w-6 h-6 text-[#5C6D65]/60" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <h4 className="font-semibold text-sm text-[#0A372F] truncate">
                          {livro.title}
                        </h4>
                        <p className="text-xs text-[#5C6D65] truncate">
                          {livro.author}
                        </p>
                        <p className="text-[0.6875rem] text-[#1D5E51] font-medium mt-0.5 truncate">
                          {item.chapter_title || 'Capítulo Atual'}
                        </p>
                      </div>

                      {/* Progresso Real */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[0.6875rem] text-[#5C6D65] numeric">
                          <span>Concluído</span>
                          <span className="font-bold text-[#1D5E51]">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-[#DCEDE6] h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#1D5E51] h-full rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => onLerAgora(livro)}
                          className="h-8 px-3 bg-[#1D5E51] hover:bg-[#154B41] text-white text-xs font-semibold rounded-[4px] flex items-center gap-1.5 transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[#C6A15B]" />
                          <span>Continuar</span>
                        </button>

                        <button
                          onClick={() => onAbrirDetalhes(livro)}
                          className="h-8 px-2.5 bg-[#FFFFFF] hover:bg-[#F0F2ED] border border-[#7D8D83] text-[#5C6D65] text-xs font-medium rounded-[4px] transition-colors"
                        >
                          Detalhes
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Conteúdo da Aba Favoritos */}
      {abaAtiva === 'favoritos' && (
        <div className="space-y-4">
          {favoritos.length === 0 ? (
            <div className="p-12 text-center text-[#5C6D65] bg-[#FFFFFF] border border-[#D5DED7] rounded-[8px] space-y-2">
              <Star className="w-10 h-10 text-[#C6A15B] mx-auto stroke-1" />
              <h3 className="text-base font-semibold text-[#203B34]">
                Você ainda não favoritou nenhum livro.
              </h3>
              <p className="text-xs">
                Ao consultar uma obra no catálogo, utilize a estrela para salvá-la em sua estante.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {favoritos.map((fav) => {
                const livro = fav.digital_book;
                if (!livro) return null;
                return (
                  <div
                    key={fav.id}
                    onClick={() => onAbrirDetalhes(livro)}
                    className="bg-[#FFFFFF] border border-[#D5DED7] hover:border-[#C6A15B] rounded-[8px] p-3 flex flex-col justify-between transition-all hover:shadow-md cursor-pointer group"
                  >
                    <div className="space-y-2">
                      <div className="w-full h-40 rounded bg-[#F0F2ED] border border-[#D5DED7] overflow-hidden flex items-center justify-center p-1">
                        {livro.cover_url ? (
                          <img 
                            src={livro.cover_url} 
                            alt="" 
                            className="w-full h-full object-contain" 
                          />
                        ) : (
                          <BookOpen className="w-6 h-6 text-[#5C6D65]" />
                        )}
                      </div>
                      <h4 className="font-semibold text-xs text-[#0A372F] line-clamp-2 leading-tight">
                        {livro.title}
                      </h4>
                      <p className="text-[0.6875rem] text-[#5C6D65] line-clamp-1">
                        {livro.author}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLerAgora(livro);
                      }}
                      className="mt-3 w-full h-8 bg-[#1D5E51] hover:bg-[#154B41] text-white text-[0.6875rem] font-semibold rounded-[4px] flex items-center justify-center gap-1 transition-colors"
                    >
                      <BookOpen className="w-3 h-3 text-[#C6A15B]" />
                      <span>Ler agora</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
