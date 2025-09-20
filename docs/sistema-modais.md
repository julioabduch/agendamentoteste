# Sistema de Modais

## Modais Implementados

### 1. BaseModal
**Localização**: `app/components/BaseModal.vue`

Modal base reutilizável com estrutura padrão:
- **Header**: Título + botão fechar
- **Content**: Slot para conteúdo personalizado  
- **Footer**: Slot para botões de ação (padrão: Cancelar/Confirmar)

**Props**:
- `isOpen: boolean` - Controla visibilidade
- `title: string` - Título do modal
- `confirmText?: string` - Texto do botão confirmar (padrão: "Confirmar")
- `cancelText?: string` - Texto do botão cancelar (padrão: "Cancelar") 
- `isLoading?: boolean` - Estado de carregamento
- `closeOnOverlay?: boolean` - Permite fechar clicando no fundo (padrão: true)

**Eventos**:
- `@close` - Emitido ao fechar modal
- `@confirm` - Emitido ao confirmar ação

**Recursos**:
- ✅ Teleport para body
- ✅ Transições suaves
- ✅ Previne scroll da página
- ✅ Acessibilidade (ESC para fechar)
- ✅ Click no overlay para fechar
- ✅ Estados de loading

### 2. ModalConfirmacao
**Localização**: `app/components/ModalConfirmacao.vue`

Modal de confirmação para ações críticas (deletar, etc.):

**Props**:
- `isOpen: boolean` - Controla visibilidade
- `title?: string` - Título (padrão: "Confirmar Ação")
- `message: string` - Mensagem principal
- `description?: string` - Descrição adicional
- `confirmText?: string` - Texto do botão confirmar
- `cancelText?: string` - Texto do botão cancelar
- `isLoading?: boolean` - Estado de carregamento
- `variant?: 'primary' | 'danger'` - Estilo do botão (padrão: 'primary')
- `icon?: Component` - Ícone customizado

**Recursos**:
- ✅ Ícone de alerta visual
- ✅ Variante "danger" para ações destrutivas
- ✅ Suporte a loading states
- ✅ Mensagem + descrição opcional

### 3. ModalEspecialidade
**Localização**: `app/components/ModalEspecialidade.vue`

Modal específico para CRUD de especialidades:

**Props**:
- `isOpen: boolean` - Controla visibilidade
- `isEdicao?: boolean` - Modo edição/criação (padrão: false)
- `registroId?: number | null` - ID do registro para edição

**Eventos**:
- `@close` - Emitido ao fechar modal
- `@success` - Emitido após salvar com sucesso

**Funcionalidades**:
- ✅ Modo criação (isEdicao: false)
- ✅ Modo edição (isEdicao: true + registroId)
- ✅ Validação de formulário
- ✅ Integração com Supabase
- ✅ Loading states
- ✅ Recarregamento automático da lista
- ✅ Reset de formulário

## Integração na Página

### especialidades.vue

```vue
<template>
  <!-- Tabela com eventos -->
  <TabelaEspecialidades 
    @editar="abrirModalEdicao" 
    @deletar="abrirModalDeletar" 
  />

  <!-- Modal de Especialidade -->
  <ModalEspecialidade
    :is-open="modalAberto"
    :is-edicao="isEdicao"
    :registro-id="registroIdSelecionado"
    @close="fecharModal"
    @success="handleSuccess"
  />

  <!-- Modal de Confirmação -->
  <ModalConfirmacao
    :is-open="modalDeletarAberto"
    title="Deletar Especialidade"
    message="Tem certeza que deseja deletar?"
    variant="danger"
    @close="fecharModalDeletar"
    @confirm="confirmarDeletar"
  />
</template>
```

## Fluxo de Uso

### Criação:
1. Usuário clica "Adicionar Especialidade"
2. `abrirModalNovo()` → `isEdicao: false`
3. Modal abre com formulário vazio
4. Usuário preenche e confirma
5. Dados salvos no Supabase
6. Lista recarregada automaticamente
7. Modal fecha com sucesso

### Edição:
1. Usuário clica botão "Editar" na tabela
2. `abrirModalEdicao(id)` → `isEdicao: true`
3. Modal carrega dados do registro
4. Usuário edita e confirma
5. Dados atualizados no Supabase
6. Lista recarregada automaticamente
7. Modal fecha com sucesso

### Deleção:
1. Usuário clica botão "Deletar" na tabela
2. `abrirModalDeletar(id)` → modal de confirmação
3. Usuário confirma ação
4. Registro deletado do Supabase
5. Lista recarregada automaticamente
6. Modal fecha com sucesso

## Vantagens da Arquitetura

- ✅ **Reutilização**: BaseModal para qualquer modal futuro
- ✅ **Consistência**: Mesmo padrão visual e UX
- ✅ **Acessibilidade**: ESC, overlay, loading states
- ✅ **Segurança**: Verificação de permissões admin
- ✅ **Performance**: Teleport + lazy loading
- ✅ **Validação**: Formulários validados
- ✅ **Feedback**: Loading states + notificações (TODO)
- ✅ **Integração**: Supabase + Pinia automática
