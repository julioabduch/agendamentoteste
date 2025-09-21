<template>
  <div class="relative">
    <!-- Avatar circular -->
    <div 
      class="w-12 h-12 rounded-full bg-gray-200 border-2 border-gray-300 overflow-hidden cursor-pointer hover:border-blue-400 transition-colors duration-200 group"
      @click="triggerFileInput"
    >
      <!-- Imagem do usuário ou placeholder -->
      <div v-if="!avatarUrl && !previewUrl" class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
        <UserIcon class="w-6 h-6 text-white" />
      </div>
      
      <img 
        v-else
        :src="(previewUrl || avatarUrl) || ''" 
        :alt="userName || 'Avatar do usuário'"
        class="w-full h-full object-cover"
      />
      
      <!-- Overlay de hover -->
      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200 flex items-center justify-center">
        <CameraIcon class="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>
    </div>
    
    <!-- Badge de loading -->
    <div v-if="uploading" class="absolute -top-1 -right-1">
      <div class="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
        <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
      </div>
    </div>
    
    <!-- Badge de sucesso -->
    <div v-else-if="uploadSuccess" class="absolute -top-1 -right-1">
      <div class="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
        <CheckIcon class="w-3 h-3 text-white" />
      </div>
    </div>
    
    <!-- Modal de seleção para mobile -->
    <div 
      v-if="showMobileMenu" 
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center"
      @click="closeMobileMenu"
    >
      <div 
        class="bg-white rounded-t-xl w-full max-w-md p-6 pb-8 space-y-4"
        @click.stop
      >
        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Escolher foto</h3>
          <p class="text-sm text-gray-500">Como você gostaria de adicionar uma foto?</p>
        </div>
        
        <div class="space-y-3">
          <button
            @click="openCamera"
            class="w-full flex items-center justify-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
          >
            <CameraIcon class="w-6 h-6 text-blue-600" />
            <span class="text-blue-600 font-medium">Tirar foto</span>
          </button>
          
          <button
            @click="openGallery"
            class="w-full flex items-center justify-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <PhotoIcon class="w-6 h-6 text-gray-600" />
            <span class="text-gray-600 font-medium">Escolher da galeria</span>
          </button>
        </div>
        
        <button
          @click="closeMobileMenu"
          class="w-full p-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          Cancelar
        </button>
      </div>
    </div>
    
    <!-- Input file para câmera (mobile) -->
    <input
      ref="cameraInputRef"
      type="file"
      accept="image/*"
      capture="environment"
      class="hidden"
      @change="handleFileSelect"
    />
    
    <!-- Input file para galeria -->
    <input
      ref="galleryInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { UserIcon, CameraIcon, CheckIcon, PhotoIcon } from '@heroicons/vue/24/outline'
import { useToast } from '../composables/useToast'

interface Props {
  avatarUrl?: string | null
  userName?: string | null
  maxSize?: number // em MB
}

const props = withDefaults(defineProps<Props>(), {
  avatarUrl: null,
  userName: null,
  maxSize: 5
})

const emit = defineEmits<{
  upload: [file: File]
  remove: []
}>()

// Refs
const cameraInputRef = ref<HTMLInputElement>()
const galleryInputRef = ref<HTMLInputElement>()
const previewUrl = ref<string | null>(null)
const uploading = ref(false)
const uploadSuccess = ref(false)
const showMobileMenu = ref(false)

// Composables
const toast = useToast()

// Computed
const isMobile = computed(() => {
  return typeof window !== 'undefined' && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
})

// Methods
function triggerFileInput() {
  if (isMobile.value) {
    showMobileMenu.value = true
  } else {
    galleryInputRef.value?.click()
  }
}

function openCamera() {
  showMobileMenu.value = false
  cameraInputRef.value?.click()
}

function openGallery() {
  showMobileMenu.value = false
  galleryInputRef.value?.click()
}

function closeMobileMenu() {
  showMobileMenu.value = false
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (!file) return
  
  // Validar tipo de arquivo
  if (!file.type.startsWith('image/')) {
    toast.error('Arquivo inválido', 'Por favor, selecione apenas arquivos de imagem.')
    return
  }
  
  // Validar tamanho do arquivo
  const maxSizeBytes = props.maxSize * 1024 * 1024
  if (file.size > maxSizeBytes) {
    toast.error('Arquivo muito grande', `O arquivo deve ter no máximo ${props.maxSize}MB.`)
    return
  }
  
  // Criar preview
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
  
  // Simular upload
  uploadFile(file)
}

async function uploadFile(file: File) {
  uploading.value = true
  uploadSuccess.value = false
  
  try {
    // Salvar na galeria local do celular (se possível)
    if (isMobile.value && 'showSaveFilePicker' in window) {
      try {
        // API moderna para salvar arquivos (ainda experimental)
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: `avatar_${Date.now()}.jpg`,
          types: [{
            description: 'Imagens',
            accept: {
              'image/*': ['.jpg', '.jpeg', '.png']
            }
          }]
        })
        
        const writable = await fileHandle.createWritable()
        await writable.write(file)
        await writable.close()
        
        toast.success('Foto salva!', 'Foto salva na galeria do seu dispositivo.')
      } catch (saveError) {
        // Se falhar, usar método alternativo
        downloadToGallery(file)
      }
    } else if (isMobile.value) {
      // Método alternativo: download automático
      downloadToGallery(file)
    }
    
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Emitir evento de upload
    emit('upload', file)
    
    uploadSuccess.value = true
    toast.success('Foto atualizada!', 'Sua foto de perfil foi atualizada com sucesso.')
    
    // Remover badge de sucesso após 2 segundos
    setTimeout(() => {
      uploadSuccess.value = false
    }, 2000)
    
  } catch (error) {
    previewUrl.value = null
    toast.error('Erro no upload', 'Não foi possível processar a foto. Tente novamente.')
    console.error('Erro no upload:', error)
  } finally {
    uploading.value = false
  }
}

// Função para salvar/baixar foto na galeria
function downloadToGallery(file: File) {
  try {
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = `avatar_${Date.now()}.jpg`
    link.style.display = 'none'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Limpar URL após download
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 100)
    
    toast.success('Foto salva!', 'Foto baixada para sua galeria.')
  } catch (error) {
    console.error('Erro ao salvar foto:', error)
    toast.info('Foto processada', 'A foto foi processada mas pode não ter sido salva automaticamente.')
  }
}

// Limpar input quando componente for desmontado
onMounted(() => {
  return () => {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }
  }
})
</script>

<style scoped>
/* Componente responsivo para mobile e desktop */
</style>
