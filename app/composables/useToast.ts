export interface ToastOptions {
  title: string
  message?: string
  autoClose?: boolean
  duration?: number
}

export interface Toast extends ToastOptions {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  progress?: number
}

/**
 * Composable para gerenciar toasts de notificação
 */
export const useToast = () => {
  // Função auxiliar para adicionar toast
  const addToast = (type: Toast['type'], options: ToastOptions) => {
    if (process.client && (window as any).$toast) {
      return (window as any).$toast.add({
        type,
        ...options
      })
    }
    return null
  }

  // Função de sucesso
  const success = (title: string, message?: string, options?: Partial<ToastOptions>) => {
    return addToast('success', {
      title,
      message,
      duration: 4000, // Sucesso desaparece mais rápido
      ...options
    })
  }

  // Função de erro
  const error = (title: string, message?: string, options?: Partial<ToastOptions>) => {
    return addToast('error', {
      title,
      message,
      duration: 8000, // Erros ficam mais tempo
      autoClose: false, // Erros não fecham automaticamente por padrão
      ...options
    })
  }

  // Função de aviso
  const warning = (title: string, message?: string, options?: Partial<ToastOptions>) => {
    return addToast('warning', {
      title,
      message,
      duration: 6000,
      ...options
    })
  }

  // Função de informação
  const info = (title: string, message?: string, options?: Partial<ToastOptions>) => {
    return addToast('info', {
      title,
      message,
      duration: 5000,
      ...options
    })
  }

  // Função para remover toast específico
  const remove = (id: string) => {
    if (process.client && (window as any).$toast) {
      (window as any).$toast.remove(id)
    }
  }

  // Função para limpar todos os toasts
  const clear = () => {
    if (process.client && (window as any).$toast) {
      (window as any).$toast.clear()
    }
  }

  return {
    success,
    error,
    warning,
    info,
    remove,
    clear
  }
}
