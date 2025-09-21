import type { AgendamentoRelatorio } from '../../shared/types/database'

/**
 * Composable para geração de relatórios em PDF - Cliente Only
 */
export const usePDFClient = () => {
  
  /**
   * Formata CPF para exibição
   */
  const formatarCPF = (cpf: string | null): string => {
    if (!cpf || cpf.length !== 11) return cpf || 'N/A'
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  /**
   * Formata telefone para exibição
   */
  const formatarTelefone = (telefone: string | null): string => {
    if (!telefone) return 'N/A'
    const cleaned = telefone.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    return telefone
  }

  /**
   * Formata data para exibição brasileira
   */
  const formatarData = (data: string | null): string => {
    if (!data) return 'N/A'
    try {
      const [ano, mes, dia] = data.split('-')
      return `${dia}/${mes}/${ano}`
    } catch {
      return data
    }
  }

  /**
   * Formata hora para exibição
   */
  const formatarHora = (hora: string | null): string => {
    if (!hora) return 'N/A'
    return hora.slice(0, 5) // Remove os segundos se houver
  }

  /**
   * Gera status formatado
   */
  const obterStatus = (cancelado: boolean | null): string => {
    return cancelado ? 'CANCELADO' : 'ATIVO'
  }

  /**
   * Gera relatório PDF simples usando apenas jsPDF básico (sem autoTable)
   */
  const gerarRelatorioPDF = async (
    agendamentos: AgendamentoRelatorio[],
    filtros?: {
      dataInicio?: string
      dataFim?: string
      profissionalId?: number
      clienteId?: number
      incluirCancelados?: boolean
    }
  ) => {
    try {
      // Verificar se estamos no cliente
      if (typeof window === 'undefined') {
        return { 
          success: false, 
          error: 'PDF só pode ser gerado no cliente' 
        }
      }

      // Importação dinâmica apenas do jsPDF (sem autoTable)
      const jsPDFModule = await import('jspdf')
      const jsPDF = jsPDFModule.default

      // Criar novo documento PDF
      const doc = new jsPDF({
        orientation: 'portrait', // Retrato para melhor visualização
        unit: 'mm',
        format: 'a4'
      })

      // Configurações básicas
      let yPosition = 20
      const pageWidth = doc.internal.pageSize.width
      const margin = 15

      // Título do relatório
      doc.setFontSize(18)
      doc.setTextColor(59, 130, 246) // Azul
      doc.setFont('helvetica', 'bold')
      doc.text('Relatório de Agendamentos', margin, yPosition)
      yPosition += 15

      // Data de geração
      doc.setFontSize(10)
      doc.setTextColor(107, 114, 128) // Cinza
      doc.setFont('helvetica', 'normal')
      const dataGeracao = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
      doc.text(`Gerado em: ${dataGeracao}`, margin, yPosition)
      yPosition += 15

      // Linha separadora
      doc.setDrawColor(229, 231, 235)
      doc.setLineWidth(0.5)
      doc.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 10

      // Informações dos filtros
      if (filtros) {
        doc.setFontSize(12)
        doc.setTextColor(75, 85, 99)
        doc.setFont('helvetica', 'bold')
        doc.text('Filtros Aplicados:', margin, yPosition)
        yPosition += 8

        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')

        if (filtros.dataInicio && filtros.dataFim) {
          doc.text(`• Período: ${formatarData(filtros.dataInicio)} até ${formatarData(filtros.dataFim)}`, margin + 5, yPosition)
          yPosition += 6
        }

        doc.text(`• Status: ${filtros.incluirCancelados ? 'Todos (incluindo cancelados)' : 'Apenas ativos'}`, margin + 5, yPosition)
        yPosition += 10
      }

      // Estatísticas
      const totalAgendamentos = agendamentos.length
      const agendamentosAtivos = agendamentos.filter(a => !a.cancelado).length
      const agendamentosCancelados = agendamentos.filter(a => a.cancelado).length

      doc.setFontSize(12)
      doc.setTextColor(75, 85, 99)
      doc.setFont('helvetica', 'bold')
      doc.text('Resumo:', margin, yPosition)
      yPosition += 8

      // Box com estatísticas
      doc.setFillColor(249, 250, 251)
      doc.rect(margin, yPosition - 3, pageWidth - (margin * 2), 20, 'F')

      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(55, 65, 81)
      doc.text(`Total de Agendamentos: ${totalAgendamentos}`, margin + 5, yPosition + 3)
      doc.text(`Ativos: ${agendamentosAtivos}`, margin + 5, yPosition + 8)
      doc.text(`Cancelados: ${agendamentosCancelados}`, margin + 5, yPosition + 13)
      yPosition += 25

      // Lista de agendamentos
      doc.setFontSize(12)
      doc.setTextColor(75, 85, 99)
      doc.setFont('helvetica', 'bold')
      doc.text('Agendamentos:', margin, yPosition)
      yPosition += 10

      // Iterar pelos agendamentos
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')

      agendamentos.forEach((agendamento, index) => {
        // Verificar se há espaço na página
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 20
        }

        // Fundo alternado
        if (index % 2 === 0) {
          doc.setFillColor(248, 250, 252)
          doc.rect(margin, yPosition - 2, pageWidth - (margin * 2), 25, 'F')
        }

        // Dados do agendamento
        doc.setTextColor(55, 65, 81)
        
        // Linha 1
        doc.text(`Data: ${formatarData(agendamento.data)}`, margin + 2, yPosition + 3)
        doc.text(`Horário: ${formatarHora(agendamento.hora_inicio)} - ${formatarHora(agendamento.hora_fim)}`, margin + 60, yPosition + 3)
        
        const status = obterStatus(agendamento.cancelado)
        doc.setTextColor(agendamento.cancelado ? 220 : 34, agendamento.cancelado ? 38 : 197, agendamento.cancelado ? 38 : 94)
        doc.text(`Status: ${status}`, margin + 120, yPosition + 3)
        
        // Linha 2
        doc.setTextColor(55, 65, 81)
        doc.text(`Cliente: ${agendamento.cliente_nome || 'N/A'}`, margin + 2, yPosition + 8)
        doc.text(`CPF: ${formatarCPF(agendamento.cliente_cpf)}`, margin + 60, yPosition + 8)
        doc.text(`Tel: ${formatarTelefone(agendamento.cliente_telefone)}`, margin + 120, yPosition + 8)
        
        // Linha 3
        doc.text(`Profissional: ${agendamento.profissional_nome || 'N/A'}`, margin + 2, yPosition + 13)
        doc.text(`Especialidade: ${agendamento.profissional_especialidade || 'N/A'}`, margin + 60, yPosition + 13)
        
        // Linha 4
        if (agendamento.titulo) {
          doc.text(`Título: ${agendamento.titulo}`, margin + 2, yPosition + 18)
        }

        yPosition += 27

        // Linha separadora
        doc.setDrawColor(229, 231, 235)
        doc.setLineWidth(0.1)
        doc.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2)
      })

      // Rodapé em todas as páginas
      const pageCount = doc.internal.pages.length - 1
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        
        // Linha decorativa
        doc.setDrawColor(229, 231, 235)
        doc.setLineWidth(0.3)
        doc.line(margin, doc.internal.pageSize.height - 20, pageWidth - margin, doc.internal.pageSize.height - 20)

        // Informações do rodapé
        doc.setFontSize(8)
        doc.setTextColor(156, 163, 175)
        doc.setFont('helvetica', 'normal')
        
        doc.text('Sistema de Gestão de Agendamentos', margin, doc.internal.pageSize.height - 12)
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - 40, doc.internal.pageSize.height - 12)
      }

      // Gerar nome do arquivo
      const nomeArquivo = `relatorio-agendamentos-${new Date().toISOString().split('T')[0]}.pdf`

      // Salvar arquivo
      doc.save(nomeArquivo)

      return { 
        success: true, 
        message: 'Relatório PDF gerado com sucesso!',
        nomeArquivo 
      }

    } catch (error: any) {
      console.error('❌ Erro ao gerar PDF:', error)
      return { 
        success: false, 
        error: error.message || 'Erro desconhecido ao gerar PDF' 
      }
    }
  }

  return {
    gerarRelatorioPDF,
    formatarCPF,
    formatarTelefone,
    formatarData,
    formatarHora,
    obterStatus
  }
}
