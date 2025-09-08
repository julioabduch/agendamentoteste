// Arquivo para capturar e silenciar erros conhecidos do VS Code/DevTools
if (typeof window !== 'undefined') {
  // Silenciar erros específicos do VS Code
  const originalError = console.error
  console.error = (...args) => {
    const message = args.join(' ')
    
    // Lista de erros conhecidos para silenciar
    const knownErrors = [
      'web_record_video_hover_cursor_effect_highlight',
      'web_record_video_hover_cursor_effect_spotlight',
      'web_record_video_hover_cursor_effect_magnifier',
      'Starting_init1',
      'StartIng_intl',
      'The instance has not been initialized',
      'i18n.t('
    ]
    
    // Se não for um erro conhecido, mostrar normalmente
    if (!knownErrors.some(error => message.includes(error))) {
      originalError.apply(console, args)
    }
  }
  
  // Capturar erros não tratados
  window.addEventListener('error', (event) => {
    const message = event.message || ''
    
    // Silenciar erros conhecidos do VS Code
    if (message.includes('web_record_video_hover_cursor_effect') || 
        message.includes('Starting_init1')) {
      event.preventDefault()
      return false
    }
  })
}

export default defineNuxtPlugin(() => {
  // Plugin apenas para garantir que o código rode no cliente
})
