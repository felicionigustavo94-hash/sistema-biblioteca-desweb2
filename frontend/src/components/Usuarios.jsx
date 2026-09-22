import React from 'react';
import { ShieldCheck, UserCheck, ArrowRightLeft } from 'lucide-react';

export default function Usuarios({
  usuarios,
  user,
  onAlternarRole
}) {
  const formatarData = (dataStr) => {
    if (!dataStr) return '—';
    try {
      const d = new Date(dataStr);
      return d.toLocaleDateString('pt-BR');
    } catch {
      return dataStr;
    }
  };

  const totalOperadores = usuarios.filter(u => u.role === 'admin').length;
  const totalLeitores = usuarios.filter(u => u.role !== 'admin').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D5DED7]">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-[1.75rem] font-semibold text-[#0A372F] tracking-tight">
              Gestão de Leitores e Operadores
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6F2] text-[#1D5E51] border border-[#DCEDE6] numeric">
              {usuarios.length} cadastros ({totalOperadores} operadores · {totalLeitores} leitores)
            </span>
          </div>
          <p className="text-sm text-[#5C6D65] mt-1">
            Controle de perfis de acesso, operadores da biblioteca e cadastro de leitores
          </p>
        </div>
      </div>

      {/* Tabela de Usuários */}
      <div className="bg-[#FFFFFF] border border-[#D5DED7] rounded-[8px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#D5DED7] bg-[#F0F2ED] text-xs font-semibold text-[#5C6D65]">
              <th scope="col" className="py-3.5 px-4">Nome Completo & Identificação</th>
              <th scope="col" className="py-3.5 px-4">E-mail Cadastrado</th>
              <th scope="col" className="py-3.5 px-4">Perfil / Permissão</th>
              <th scope="col" className="py-3.5 px-4">Data de Cadastro</th>
              <th scope="col" className="py-3.5 px-4 text-right">Gerenciar Perfil</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D5DED7] text-sm text-[#203B34]">
            {usuarios.map((item) => {
              const isAdmin = item.role === 'admin';
              const isCurrentUser = item.id === user?.id;

              return (
                <tr key={item.id} className="hover:bg-[#F7F6F1]/70 transition-colors">
                  
                  {/* Nome & Avatar */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#EFF6F2] text-[#0A372F] font-bold text-xs flex items-center justify-center border border-[#DCEDE6] shrink-0">
                        {item.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-[#203B34] flex items-center gap-2">
                          <span>{item.name}</span>
                          {isCurrentUser && (
                            <span className="text-[0.625rem] font-bold uppercase tracking-wider text-[#80602B] bg-[#FFF3D8] px-1.5 py-0.5 rounded">
                              Você
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-[#5C6D65] numeric">
                          ID: #{item.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* E-mail */}
                  <td className="py-3.5 px-4 text-xs text-[#5C6D65] font-mono">
                    {item.email}
                  </td>

                  {/* Perfil */}
                  <td className="py-3.5 px-4">
                    {isAdmin ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-[#EAF4ED] text-[#216044] border border-[#216044]/20">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Operador (Admin)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-[#EDF3F8] text-[#285E7B] border border-[#285E7B]/20">
                        <UserCheck className="w-3.5 h-3.5" />
                        Leitor
                      </span>
                    )}
                  </td>

                  {/* Data */}
                  <td className="py-3.5 px-4 text-xs text-[#5C6D65] numeric">
                    {formatarData(item.created_at)}
                  </td>

                  {/* Ação */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onAlternarRole(item.id, item.name, item.role)}
                      disabled={isCurrentUser}
                      title={isCurrentUser ? 'Não é possível alterar a própria permissão' : `Alternar para ${isAdmin ? 'Leitor' : 'Operador'}`}
                      className="h-9 px-3 bg-[#FFFFFF] hover:bg-[#EFF6F2] disabled:bg-[#F0F2ED] disabled:text-[#5C6D65] disabled:cursor-not-allowed border border-[#7D8D83] text-[#1D5E51] text-xs font-semibold rounded-[6px] inline-flex items-center gap-1.5 transition-colors"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      <span>{isAdmin ? 'Tornar Leitor' : 'Promover a Operador'}</span>
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
