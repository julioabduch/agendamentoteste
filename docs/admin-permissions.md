# Sistema de Permissões de Administrador

## Implementação Realizada

### 1. Verificação de Role "admin"

O sistema agora verifica se o usuário tem role "admin" antes de permitir ações administrativas.

### 2. Componentes Protegidos

#### TabelaEspecialidades.vue
- **Botões de Ação**: Editar e Deletar só ficam habilitados para admins
- **Estilo Visual**: Botões desabilitados ficam acinzentados para usuários normais
- **Tooltip**: Mostra mensagem explicativa quando não é admin

#### Página especialidades.vue
- **Botão Adicionar**: Só aparece para administradores
- **Mensagem Informativa**: Usuários normais veem "Apenas administradores podem gerenciar especialidades"

#### Página index.new.vue (Dashboard)
- **Novo Cliente**: Desabilitado para usuários normais
- **Relatórios**: Desabilitado para usuários normais
- **Tooltip**: Explica que apenas admins podem acessar essas funcionalidades

### 3. Indicador Visual de Role

#### DropdownMenu.vue
- **Badge de Role**: Mostra "Administrador" (roxo) ou "Usuário" (cinza)
- **Nome do Usuário**: Exibe o nome do usuário logado
- **Posicionamento**: Fica no dropdown de configurações da sidebar

### 4. Store de Usuário

#### useUserStore
- **Getter isAdmin**: `state.profile?.role === 'admin'`
- **Getter userRole**: Retorna o role do usuário
- **Getter userName**: Retorna o nome do usuário

### 5. Estrutura de Verificação

```typescript
// Verificação no template
:disabled="!userStore.isAdmin"
v-if="userStore.isAdmin"

// Verificação no script
const userStore = useUserStore()
if (!userStore.isAdmin) {
  console.warn('Apenas administradores podem...')
  return
}
```

### 6. Estilos Condicionais

```vue
:class="[
  'base-classes',
  userStore.isAdmin 
    ? 'enabled-classes' 
    : 'disabled-classes'
]"
```

## Como Funciona

1. **Login**: Usuário faz login via Supabase
2. **Profile**: Sistema busca o perfil na tabela `ag_profiles`
3. **Role**: Campo `role` determina se é "admin" ou "user"
4. **Interface**: Botões e ações se adaptam baseado no role
5. **Feedback**: Usuários veem claramente suas limitações

## Benefícios

- ✅ **Segurança**: Ações administrativas protegidas
- ✅ **UX**: Interface clara sobre permissões
- ✅ **Feedback**: Tooltips explicativos
- ✅ **Consistência**: Padrão aplicado em todo o sistema
- ✅ **Manutenibilidade**: Centralizado no store Pinia

## Próximos Passos

- [ ] Implementar ações CRUD reais (não só UI)
- [ ] Adicionar middleware de proteção de rotas
- [ ] Criar página de gestão de usuários para admins
- [ ] Implementar logs de ações administrativas
