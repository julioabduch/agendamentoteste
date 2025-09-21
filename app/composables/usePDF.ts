import jsPDF from 'jspdf'
import 'jspdf-autotable'
import type { AgendamentoRelatorio } from '../../shared/types/database'

// Declaração de tipos para o jsPDF com autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

/**
 * Composable para geração de relatórios em PDF
 */
export const usePDF = () => {
  
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
   * Gera relatório PDF de agendamentos
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
      // Criar novo documento PDF
      const doc = new jsPDF({
        orientation: 'landscape', // Paisagem para acomodar mais colunas
        unit: 'mm',
        format: 'a4'
      })

      // Configurar fonte
      doc.setFont('helvetica')

      // Título do relatório
      doc.setFontSize(18)
      doc.setTextColor(59, 130, 246) // Azul
      doc.text('Relatório de Agendamentos', 15, 20)

      // Data de geração
      doc.setFontSize(10)
      doc.setTextColor(107, 114, 128) // Cinza
      const dataGeracao = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
      doc.text(`Gerado em: ${dataGeracao}`, 15, 27)

      // Informações dos filtros aplicados
      let yPosition = 35
      if (filtros) {
        doc.setFontSize(11)
        doc.setTextColor(75, 85, 99)
        doc.text('Filtros aplicados:', 15, yPosition)
        yPosition += 6

        doc.setFontSize(9)
        if (filtros.dataInicio && filtros.dataFim) {
          doc.text(`• Período: ${formatarData(filtros.dataInicio)} a ${formatarData(filtros.dataFim)}`, 20, yPosition)
          yPosition += 5
        }
        if (filtros.profissionalId) {
          doc.text(`• Profissional ID: ${filtros.profissionalId}`, 20, yPosition)
          yPosition += 5
        }
        if (filtros.clienteId) {
          doc.text(`• Cliente ID: ${filtros.clienteId}`, 20, yPosition)
          yPosition += 5
        }
        doc.text(`• Incluir cancelados: ${filtros.incluirCancelados ? 'Sim' : 'Não'}`, 20, yPosition)
        yPosition += 8
      }

      // Estatísticas
      const totalAgendamentos = agendamentos.length
      const agendamentosAtivos = agendamentos.filter(a => !a.cancelado).length
      const agendamentosCancelados = agendamentos.filter(a => a.cancelado).length

      doc.setFontSize(11)
      doc.setTextColor(75, 85, 99)
      doc.text('Resumo:', 15, yPosition)
      yPosition += 6

      doc.setFontSize(9)
      doc.text(`• Total de agendamentos: ${totalAgendamentos}`, 20, yPosition)
      yPosition += 5
      doc.text(`• Ativos: ${agendamentosAtivos}`, 20, yPosition)
      yPosition += 5
      doc.text(`• Cancelados: ${agendamentosCancelados}`, 20, yPosition)
      yPosition += 10

      // Preparar dados para a tabela
      const tableData = agendamentos.map(agendamento => [
        formatarData(agendamento.data),
        formatarHora(agendamento.hora_inicio),
        formatarHora(agendamento.hora_fim),
        agendamento.cliente_nome || 'N/A',
        formatarCPF(agendamento.cliente_cpf),
        formatarTelefone(agendamento.cliente_telefone),
        agendamento.profissional_nome || 'N/A',
        agendamento.profissional_especialidade || 'N/A',
        agendamento.titulo || 'Sem título',
        obterStatus(agendamento.cancelado)
      ])

      // Gerar tabela
      doc.autoTable({
        startY: yPosition,
        head: [[
          'Data',
          'Início',
          'Fim',
          'Cliente',
          'CPF',
          'Telefone',
          'Profissional',
          'Especialidade',
          'Título',
          'Status'
        ]],
        body: tableData,
        styles: {
          fontSize: 8,
          cellPadding: 2,
          textColor: [55, 65, 81], // Cinza escuro
        },
        headStyles: {
          fillColor: [59, 130, 246], // Azul
          textColor: [255, 255, 255], // Branco
          fontStyle: 'bold',
          fontSize: 9
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251] // Cinza claro
        },
        columnStyles: {
          0: { cellWidth: 20 }, // Data
          1: { cellWidth: 15 }, // Início
          2: { cellWidth: 15 }, // Fim
          3: { cellWidth: 40 }, // Cliente
          4: { cellWidth: 30 }, // CPF
          5: { cellWidth: 25 }, // Telefone
          6: { cellWidth: 35 }, // Profissional
          7: { cellWidth: 30 }, // Especialidade
          8: { cellWidth: 30 }, // Título
          9: { cellWidth: 20 }, // Status
        },
        margin: { left: 15, right: 15 },
        theme: 'striped'
      })

      // Rodapé
      const pageCount = doc.internal.pages.length - 1
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(156, 163, 175) // Cinza claro
        doc.text(
          `Página ${i} de ${pageCount}`,
          doc.internal.pageSize.width - 50,
          doc.internal.pageSize.height - 10
        )
        doc.text(
          'Sistema de Agendamentos',
          15,
          doc.internal.pageSize.height - 10
        )
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
    gerarRelatorioPDF
  }
}
