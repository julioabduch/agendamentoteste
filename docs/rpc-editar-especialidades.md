# Implementação da Função de Editar Especialidades

## ✅ Implementação Completa

### 🔧 **1. Composable `useProfissionais.ts`**

#### Nova Função Adicionada:
```typescript
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
      await fetchEspecialidades()
    }

    return data as EspecialidadeRpcResponse
    
  } catch (err: any) {
    console.error('Erro ao editar especialidade:', err)
    throw err
  }
}
```

### 🎯 **2. ModalEspecialidade.vue**

#### Atualização da Função `handleConfirm`:
```typescript
if (props.isEdicao && props.registroId) {
  // Atualizar registro existente usando RPC function
  const resultado = await editarEspecialidade(
    props.registroId,
    form.especialidade.trim()
  )
  
  if (!resultado.success) {
    throw new Error(resultado.message)
  }
  
  // Toast de sucesso para edição
  toast.success(
    'Especialidade atualizada!',
    resultado.message
  )
} else {
  // Criar novo registro usando RPC function
  // ... código de criação
}
```

### 📡 **3. RPC Function Backend**

#### Chamada:
```javascript
let { data, error } = await supabase
  .rpc('ag_edit_especialidade', {
    p_especialidade: 'Nome Atualizado',
    p_id: 123
  })
```

#### Retornos Esperados:
```json
// Sucesso
{
  "success": true,
  "message": "Especialidade atualizada com sucesso"
}

// Erro de Permissão
{
  "success": false,
  "message": "Permissão negada: apenas administradores podem editar especialidades"
}

// Erro de Não Encontrado
{
  "success": false,
  "message": "Especialidade não encontrada"
}
```

## 🔄 **Fluxo Completo de Edição**

### **1. Clique na Tabela**
```vue
<button @click="editarEspecialidade(especialidade.id)">
  <PencilIcon class="w-4 h-4" />
</button>
```

### **2. Função na Tabela**
```typescript
const editarEspecialidade = (id: number) => {
  if (!userStore.isAdmin) {
    toast.warning('Acesso negado', 'Apenas administradores podem editar')
    return
  }
  
  emit('editar', id) // Emite evento para página
}
```

### **3. Página Especialidades**
```typescript
const abrirModalEdicao = (id: number) => {
  if (!userStore.isAdmin) {
    toast.warning('Acesso negado', 'Apenas administradores podem editar')
    return
  }
  
  isEdicao.value = true          // ✅ Modo edição
  registroIdSelecionado.value = id   // ✅ ID para carregar dados
  modalAberto.value = true           // ✅ Abre modal
}
```

### **4. Modal Carrega Dados**
```typescript
// Watch detecta abertura do modal em modo edição
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.isEdicao && props.registroId) {
    loadEspecialidade() // Carrega dados do registro
  }
})

// Função que busca dados do registro
const loadEspecialidade = async () => {
  const { data } = await supabase
    .from('ag_especialidades')
    .select('*')
    .eq('id', props.registroId)
    .single()
  
  form.especialidade = data.especialidade || ''
}
```

### **5. Usuário Edita e Confirma**
```typescript
// Validação + RPC call
const resultado = await editarEspecialidade(
  props.registroId,
  form.especialidade.trim()
)

// Feedback + Fechamento
toast.success('Especialidade atualizada!', resultado.message)
emit('success')
```

## 🎨 **Estados do Modal**

### **Modo Criação** (`isEdicao: false`):
- **Título**: "Nova Especialidade"
- **Botão**: "Criar Especialidade"
- **Campo**: Vazio
- **RPC**: `ag_add_especialidade`

### **Modo Edição** (`isEdicao: true`):
- **Título**: "Editar Especialidade"
- **Botão**: "Salvar Alterações"
- **Campo**: Preenchido com dados existentes
- **RPC**: `ag_edit_especialidade`

## 🛡️ **Proteções de Segurança**

### **Frontend (Dupla Verificação)**:
1. **Tabela**: Verifica admin antes de emitir evento
2. **Página**: Verifica admin antes de abrir modal

### **Backend (RPC Function)**:
1. **Validação**: Verifica role do usuário
2. **Autorização**: Apenas admins podem editar
3. **Existência**: Verifica se registro existe

## 🧪 **Como Testar**

### **Usuário Admin**:
1. Login como admin (`role = "admin"`)
2. Ir para `/especialidades`
3. Clicar no ícone de editar (lápis) na tabela
4. Modal abre com dados preenchidos
5. Alterar texto
6. Clicar "Salvar Alterações"
7. Toast verde: "Especialidade atualizada!"

### **Usuário Normal**:
1. Login como user (`role = "user"`)
2. Botão de editar deve estar desabilitado (cinza)
3. Se tentar via dev tools → RPC retorna erro de permissão

### **Fluxos de Erro**:
- **Sem permissão**: Toast amarelo "Acesso negado"
- **Erro de rede**: Toast vermelho com detalhes
- **Registro não encontrado**: Toast vermelho "Especialidade não encontrada"

## 🎯 **Resultado**

**✅ EDIÇÃO COMPLETA E FUNCIONAL**

- ✅ RPC function integrada para edição
- ✅ Modal carrega dados automaticamente
- ✅ Validação de permissões dupla (client + server)
- ✅ Feedback visual com toasts
- ✅ Recarregamento automático da lista
- ✅ Estados visuais corretos (título, botão)

**Tanto criação quanto edição agora usam RPC functions com validação completa de permissões!** 🚀
