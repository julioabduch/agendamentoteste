// Utilitários para máscaras de input
export const inputMasks = {
  /**
   * Aplica máscara de CPF: 000.000.000-00
   */
  cpf: (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    // Limita exatamente a 11 dígitos
    const limitedNumbers = numbers.substring(0, 11)
    
    // Aplica a máscara
    if (limitedNumbers.length <= 3) {
      return limitedNumbers
    } else if (limitedNumbers.length <= 6) {
      return limitedNumbers.replace(/(\d{3})(\d+)/, '$1.$2')
    } else if (limitedNumbers.length <= 9) {
      return limitedNumbers.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3')
    } else {
      return limitedNumbers.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4')
    }
  },

  /**
   * Aplica máscara de telefone: (11)99999-9999
   */
  telefone: (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    // Limita exatamente a 11 dígitos
    const limitedNumbers = numbers.substring(0, 11)
    
    // Aplica a máscara
    if (limitedNumbers.length === 0) {
      return ''
    } else if (limitedNumbers.length <= 2) {
      return `(${limitedNumbers}`
    } else if (limitedNumbers.length <= 7) {
      return `(${limitedNumbers.substring(0, 2)})${limitedNumbers.substring(2)}`
    } else {
      return `(${limitedNumbers.substring(0, 2)})${limitedNumbers.substring(2, 7)}-${limitedNumbers.substring(7)}`
    }
  }
}

// Utilitários para validações
export const inputValidations = {
  /**
   * Valida CPF (apenas verifica se tem 11 dígitos)
   */
  cpf: (value: string): boolean => {
    const numbers = value.replace(/\D/g, '')
    return numbers.length === 11
  },

  /**
   * Valida email
   */
  email: (value: string): boolean => {
    if (!value) return true // Email é opcional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  },

  /**
   * Valida telefone (verifica se tem 10 ou 11 dígitos)
   */
  telefone: (value: string): boolean => {
    if (!value) return true // Telefone é opcional
    const numbers = value.replace(/\D/g, '')
    return numbers.length >= 10 && numbers.length <= 11
  }
}

// Função para remover máscaras e retornar apenas números
export const removeMask = (value: string): string => {
  return value.replace(/\D/g, '')
}

// Função para obter valor limpo de CPF (sem máscara)
export const getCleanCpf = (maskedValue: string): string => {
  return removeMask(maskedValue)
}

// Função para obter valor limpo de telefone (sem máscara)
export const getCleanTelefone = (maskedValue: string): string => {
  return removeMask(maskedValue)
}
