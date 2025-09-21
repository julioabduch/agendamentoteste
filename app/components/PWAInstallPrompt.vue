<template>
  <!-- Banner de instalação PWA -->
  <div 
    v-if="canInstall && showPrompt"
    class="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-4 z-50 shadow-lg"
  >
    <div class="flex items-center justify-between max-w-4xl mx-auto">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 class="font-medium">Instalar App</h3>
          <p class="text-sm text-blue-100">Adicione na sua tela inicial para acesso rápido</p>
        </div>
      </div>
      
      <div class="flex items-center space-x-2 flex-shrink-0">
        <button
          @click="installPWA"
          class="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
        >
          Instalar
        </button>
        <button
          @click="dismissPrompt"
          class="text-blue-100 hover:text-white p-2 rounded-lg transition-colors duration-200"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
  
  <!-- iOS Safari Instructions -->
  <div
    v-if="isIOS && showIOSInstructions"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    @click="closeIOSInstructions"
  >
    <div 
      class="bg-white rounded-xl p-6 max-w-sm w-full"
      @click.stop
    >
      <div class="text-center">
        <h3 class="text-lg font-semibold mb-4">Instalar no iPhone</h3>
        
        <div class="space-y-4 text-left">
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-blue-600 font-semibold text-xs">1</span>
            </div>
            <div class="text-sm">
              Toque no botão <strong>Compartilhar</strong> 
              <ShareIcon class="w-4 h-4 inline mx-1 text-blue-600" /> 
              na parte inferior da tela
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-blue-600 font-semibold text-xs">2</span>
            </div>
            <div class="text-sm">
              Role para baixo e toque em <strong>"Adicionar à Tela Inicial"</strong>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-blue-600 font-semibold text-xs">3</span>
            </div>
            <div class="text-sm">
              Toque em <strong>"Adicionar"</strong> no canto superior direito
            </div>
          </div>
        </div>
        
        <button
          @click="closeIOSInstructions"
          class="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          Entendi
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { XMarkIcon, ShareIcon } from '@heroicons/vue/24/outline'

// Estados
const canInstall = ref(false)
const showPrompt = ref(false)
const showIOSInstructions = ref(false)
const deferredPrompt = ref<any>(null)

// Computed
const isIOS = computed(() => {
  return typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)
})

const isStandalone = computed(() => {
  return typeof window !== 'undefined' && 
    ('standalone' in window.navigator && (window.navigator as any).standalone) ||
    window.matchMedia('(display-mode: standalone)').matches
})

// Methods
function installPWA() {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt()
    deferredPrompt.value.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA instalado')
      }
      deferredPrompt.value = null
      showPrompt.value = false
    })
  } else if (isIOS.value && !isStandalone.value) {
    showIOSInstructions.value = true
  }
}

function dismissPrompt() {
  showPrompt.value = false
  // Salvar preferência para não mostrar novamente por um tempo
  localStorage.setItem('pwa-install-dismissed', Date.now().toString())
}

function closeIOSInstructions() {
  showIOSInstructions.value = false
}

function shouldShowPrompt() {
  const dismissed = localStorage.getItem('pwa-install-dismissed')
  if (dismissed) {
    const dismissedTime = parseInt(dismissed)
    const oneDayInMs = 24 * 60 * 60 * 1000
    return Date.now() - dismissedTime > oneDayInMs
  }
  return true
}

// Lifecycle
onMounted(() => {
  // Verificar se já está instalado
  if (isStandalone.value) {
    return
  }
  
  // Escutar o evento beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
    canInstall.value = true
    
    if (shouldShowPrompt()) {
      // Mostrar prompt após um pequeno delay
      setTimeout(() => {
        showPrompt.value = true
      }, 3000)
    }
  })
  
  // Para iOS Safari
  if (isIOS.value && !isStandalone.value) {
    canInstall.value = true
    
    if (shouldShowPrompt()) {
      setTimeout(() => {
        showPrompt.value = true
      }, 3000)
    }
  }
  
  // Escutar quando o app for instalado
  window.addEventListener('appinstalled', () => {
    console.log('PWA foi instalado')
    showPrompt.value = false
    canInstall.value = false
  })
})
</script>
