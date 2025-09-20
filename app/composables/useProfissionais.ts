import type { Especialidade, Profissional, Cliente } from '../../shared/types/database'

// Tipos para o retorno da RPC function
interface EspecialidadeRpcResponse {
  success: boolean
  message: string
}

/**
 * Composable para gerenciar especialidades e profissionais
 */
export const useProfissionais = () => {
  // Estado global compartilhado usando useState do Nuxt
  // Especialidades
  const especialidades = useState<Especialidade[]>('especialidades', () => [])
  const loading = useState<boolean>('especialidades.loading', () => false)
  const error = useState<string | null>('especialidades.error', () => null)

  // Profissionais
  const profissionais = useState<Profissional[]>('profissionais', () => [])
  const loadingProfissionais = useState<boolean>('profissionais.loading', () => false)
  const errorProfissionais = useState<string | null>('profissionais.error', () => null)

  // Clientes
  const clientes = useState<Cliente[]>('clientes', () => [])
  const loadingClientes = useState<boolean>('clientes.loading', () => false)
  const errorClientes = useState<string | null>('clientes.error', () => null)

  /**
   * Busca todas as especialidades
   */
  const fetchEspecialidades = async () => {
    try {
      loading.value = true
      error.value = null

      const supabase = useSupabaseClient<any>()
      
      const { data, error: supabaseError } = await supabase
        .from('ag_especialidades')
        .select('id, especialidade')
        .order('especialidade')

      if (supabaseError) throw supabaseError

      especialidades.value = data || []
      
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar especialidades'
      console.error('Erro ao buscar especialidades:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Busca todos os profissionais usando RPC function
   */
  const fetchProfissionais = async () => {
    try {
      loadingProfissionais.value = true
      errorProfissionais.value = null

      const supabase = useSupabaseClient<any>()
      
      const { data, error: supabaseError } = await supabase
        .rpc('fn_get_all_profissionais')

      if (supabaseError) throw supabaseError

      profissionais.value = data || []
      
    } catch (err: any) {
      errorProfissionais.value = err.message || 'Erro ao buscar profissionais'
      console.error('Erro ao buscar profissionais:', err)
    } finally {
      loadingProfissionais.value = false
    }
  }

  /**
   * Busca todos os clientes
   */
  const fetchClientes = async () => {
    try {
      loadingClientes.value = true
      errorClientes.value = null

      const supabase = useSupabaseClient<any>()
      
      const { data, error: supabaseError } = await supabase
        .from('ag_clientes')
        .select('id, created_at, cpf, nome, endereco, email, telefone')
        .order('nome')

      if (supabaseError) throw supabaseError

      clientes.value = data || []
      
    } catch (err: any) {
      errorClientes.value = err.message || 'Erro ao buscar clientes'
      console.error('Erro ao buscar clientes:', err)
    } finally {
      loadingClientes.value = false
    }
  }

  /**
   * Insere um novo cliente
   */
  const adicionarCliente = async (dadosCliente: {
    cpf: string
    nome: string
    endereco?: string
    email?: string
    telefone?: string
  }) => {
    try {
      const supabase = useSupabaseClient<any>()
      
      const { data, error: supabaseError } = await supabase
        .from('ag_clientes')
        .insert({
          cpf: dadosCliente.cpf.trim(),
          nome: dadosCliente.nome.trim(),
          endereco: dadosCliente.endereco?.trim() || null,
          email: dadosCliente.email?.trim() || null,
          telefone: dadosCliente.telefone?.trim() || null
        })
        .select()

      if (supabaseError) {
        console.error('Erro na inserção:', supabaseError)
        throw new Error(supabaseError.message || 'Erro ao inserir cliente')
      }

      // Recarregar a lista se inserção foi bem-sucedida
      console.log('Cliente inserido com sucesso, recarregando lista...')
      await fetchClientes()
      console.log('Lista recarregada:', clientes.value.length, 'itens')

      return { success: true, data: data?.[0] || null }
      
    } catch (err: any) {
      console.error('Erro ao adicionar cliente:', err)
      throw err
    }
  }

  /**
   * Edita um cliente existente
   */
  const editarCliente = async (id: number, dadosCliente: {
    cpf: string
    nome: string
    endereco?: string
    email?: string
    telefone?: string
  }) => {
    try {
      const supabase = useSupabaseClient<any>()
      
      const { data, error: supabaseError } = await supabase
        .from('ag_clientes')
        .update({
          cpf: dadosCliente.cpf.trim(),
          nome: dadosCliente.nome.trim(),
          endereco: dadosCliente.endereco?.trim() || null,
          email: dadosCliente.email?.trim() || null,
          telefone: dadosCliente.telefone?.trim() || null
        })
        .eq('id', id)
        .select()

      if (supabaseError) {
        console.error('Erro na atualização:', supabaseError)
        throw new Error(supabaseError.message || 'Erro ao atualizar cliente')
      }

      // Recarregar a lista se atualização foi bem-sucedida
      console.log('Cliente atualizado com sucesso, recarregando lista...')
      await fetchClientes()
      console.log('Lista recarregada:', clientes.value.length, 'itens')

      return { success: true, data: data?.[0] || null }
      
    } catch (err: any) {
      console.error('Erro ao editar cliente:', err)
      throw err
    }
  }

  /**
   * Deleta um cliente existente
   */
  const deletarCliente = async (id: number) => {
    try {
      const supabase = useSupabaseClient<any>()
      
      const { error: supabaseError } = await supabase
        .from('ag_clientes')
        .delete()
        .eq('id', id)

      if (supabaseError) {
        console.error('Erro ao deletar:', supabaseError)
        throw new Error(supabaseError.message || 'Erro ao deletar cliente')
      }

      // Recarregar a lista após deletar
      console.log('Cliente deletado com sucesso, recarregando lista...')
      await fetchClientes()
      console.log('Lista recarregada:', clientes.value.length, 'itens')

      return { success: true }
      
    } catch (err: any) {
      console.error('Erro ao deletar cliente:', err)
      throw err
    }
  }

  /**
   * Insere uma nova especialidade usando RPC function
   */
  const adicionarEspecialidade = async (especialidade: string): Promise<EspecialidadeRpcResponse> => {
    try {
      const supabase = useSupabaseClient<any>()
      
      const { data, error: supabaseError } = await supabase
        .rpc('ag_add_especialidade', {
          p_especialidade: especialidade
        })

      if (supabaseError) {
        console.error('Erro na RPC:', supabaseError)
        throw new Error(supabaseError.message || 'Erro ao inserir especialidade')
      }

      // Recarregar a lista se inserção foi bem-sucedida
      if (data?.success) {
        console.log('Recarregando lista após inserção bem-sucedida...')
        await fetchEspecialidades()
        console.log('Lista recarregada:', especialidades.value.length, 'itens')
      }

      return data as EspecialidadeRpcResponse
      
    } catch (err: any) {
      console.error('Erro ao adicionar especialidade:', err)
      throw err
    }
  }

  /**
   * Edita uma especialidade existente usando RPC function
   */
  const editarEspecialidade = async (id: number, especialidade: string): Promise<EspecialidadeRpcResponse> => {
    try {
      const supabase = useSupabaseClient<any>()
      
      const { data, error: supabaseError } = await supabase
        .rpc('ag_edit_especialidade', {
          p_especialidade: especialidade,
          p_id: id
        })

      if (supabaseError) {
        console.error('Erro na RPC:', supabaseError)
        throw new Error(supabaseError.message || 'Erro ao editar especialidade')
      }

      // Recarregar a lista se edição foi bem-sucedida
      if (data?.success) {
        console.log('Recarregando lista após edição bem-sucedida...')
        await fetchEspecialidades()
        console.log('Lista recarregada:', especialidades.value.length, 'itens')
      }

      return data as EspecialidadeRpcResponse
      
    } catch (err: any) {
      console.error('Erro ao editar especialidade:', err)
      throw err
    }
  }

  /**
   * Deleta uma especialidade
   */
  const deletarEspecialidade = async (id: number): Promise<{ success: boolean; message: string }> => {
    try {
      const supabase = useSupabaseClient<any>()
      
      const { error: supabaseError } = await supabase
        .from('ag_especialidades')
        .delete()
        .eq('id', id)

      if (supabaseError) {
        console.error('Erro ao deletar:', supabaseError)
        throw new Error(supabaseError.message || 'Erro ao deletar especialidade')
      }

      // Recarregar a lista após deletar
      console.log('Recarregando lista após deletar especialidade...')
      await fetchEspecialidades()
      console.log('Lista recarregada:', especialidades.value.length, 'itens')

      return {
        success: true,
        message: 'Especialidade deletada com sucesso!'
      }
      
    } catch (err: any) {
      console.error('Erro ao deletar especialidade:', err)
      return {
        success: false,
        message: err.message || 'Erro ao deletar especialidade'
      }
    }
  }

  return {
    // Estados e funções de especialidades
    especialidades,
    loading,
    error,
    fetchEspecialidades,
    adicionarEspecialidade,
    editarEspecialidade,
    deletarEspecialidade,
    
    // Estados e funções de profissionais
    profissionais,
    loadingProfissionais,
    errorProfissionais,
    fetchProfissionais,
    
    // Estados e funções de clientes
    clientes,
    loadingClientes,
    errorClientes,
    fetchClientes,
    adicionarCliente,
    editarCliente,
    deletarCliente
  }
}
