<script>
export default {
  name: "profile-details",
  props: {
    profile: {
      type: [Object, null],
      default: () => ({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        country: '',
        avatar: '',
        business: {
          name: '',
          address: '',
          phone: '',
          email: ''
        }
      })
    },
    categories: {
      type: Array,
      default: () => []
    },
    cloudinaryConfig: {
      type: Object,
      default: () => ({
        cloudName: 'your-cloud-name',
        uploadPreset: 'your-upload-preset'
      })
    }
  },
  data() {
    return {
      isEditingAvatar: false,
      uploadingAvatar: false
    }
  },
  methods: {
    // Método para abrir el widget de Cloudinary
    openCloudinaryWidget() {
      this.isEditingAvatar = true;
      this.uploadingAvatar = true;

      // Verificar si Cloudinary está cargado
      if (!window.cloudinary) {
        console.error('Cloudinary widget no está cargado');
        this.uploadingAvatar = false;
        return;
      }

      const widget = window.cloudinary.createUploadWidget(
          {
            cloudName: this.cloudinaryConfig.cloudName,
            uploadPreset: this.cloudinaryConfig.uploadPreset,
            sources: ['local', 'url', 'camera'],
            multiple: false,
            maxFiles: 1,
            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            maxFileSize: 5000000, // 5MB
            cropping: true,
            croppingAspectRatio: 1,
            croppingDefaultSelectionRatio: 1,
            croppingShowBackButton: true,
            croppingCoordinatesMode: 'custom',
            folder: 'profile-avatars',
            publicId: `avatar_${Date.now()}`,
            transformation: [
              {width: 300, height: 300, crop: 'fill', quality: 'auto'},
              {radius: 'max'}
            ]
          },
          (error, result) => {
            this.uploadingAvatar = false;

            if (error) {
              console.error('Error al subir imagen:', error);
              this.$emit('avatar-upload-error', error);
              return;
            }

            if (result && result.event === 'success') {
              const newAvatarUrl = result.info.secure_url;
              this.$emit('avatar-updated', newAvatarUrl);
              this.isEditingAvatar = false;
            }
          }
      );

      widget.open();
    },

    // async uploadImageToCloudinary(file) {
    //   this.uploadingAvatar = true;
    //
    //   try {
    //     // Validar archivo
    //     if (!file.type.startsWith('image/')) {
    //       throw new Error('Por favor selecciona una imagen válida');
    //     }
    //
    //     if (file.size > 5 * 1024 * 1024) { // 5MB
    //       throw new Error('La imagen es muy grande. Máximo 5MB');
    //     }
    //
    //     // Preparar FormData
    //     const formData = new FormData();
    //     formData.append('file', file);
    //     formData.append('upload_preset', this.cloudinaryConfig.uploadPreset);
    //     formData.append('folder', this.cloudinaryConfig.folder);
    //
    //     // Transformaciones para optimizar la imagen
    //     const transformation = 'w_300,h_300,c_fill,q_auto,f_auto';
    //     formData.append('transformation', transformation);
    //
    //     // URL de la API de Cloudinary
    //     const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudinaryConfig.cloudName}/image/upload`;
    //
    //     // Realizar la petición
    //     const response = await fetch(uploadUrl, {
    //       method: 'POST',
    //       body: formData
    //     });
    //
    //     if (!response.ok) {
    //       const errorData = await response.json();
    //       throw new Error(errorData.error?.message || 'Error al subir la imagen');
    //     }
    //
    //     const result = await response.json();
    //
    //     // Emitir evento con la nueva URL
    //     this.$emit('avatar-updated', result.secure_url);
    //
    //     // Opcional: también emitir toda la información de Cloudinary
    //     this.$emit('avatar-upload-success', result);
    //
    //   } catch (error) {
    //     console.error('Error al subir imagen:', error);
    //     this.$emit('avatar-upload-error', error.message);
    //   } finally {
    //     this.uploadingAvatar = false;
    //   }
    // },
    getDefaultAvatarUrl() {
      return `https://ui-avatars.com/api/?name=${this.profile?.first_name || 'U'}+${this.profile?.last_name || 'U'}&background=aab3a5&color=3c3a3a&size=300`;
    }
  },
  mounted() {
    if (!window.cloudinary) {
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }
}
</script>

<template>
  <div class="profile-details-container">
    <div class="profile-details-card">
      <!-- Card Header -->
      <div class="card-header">
        <h3 class="card-title text">{{ $t('profile.title') }}</h3>
      </div>

      <!-- Profile Image -->
<!--      <img-->
<!--          :src="this.profile?.avatar"-->
<!--          alt="$t('profile.altUserPhoto')"-->
<!--          class="profile-photo"-->
<!--      />-->

      <div class="profile-photo-container">
        <img
            :src="profile?.avatar || getDefaultAvatarUrl()"
            :alt="$t('profile.altUserPhoto')"
            class="profile-photo"
        />

        <!-- Overlay para editar -->
        <div class="photo-overlay" @click="openCloudinaryWidget">
          <div class="photo-edit-content">
            <i class="pi pi-camera" v-if="!uploadingAvatar"></i>
            <i class="pi pi-spin pi-spinner" v-else></i>
            <span class="edit-text">
              {{ uploadingAvatar ? $t('profile.uploading') : $t('profile.edit-photo') }}
            </span>
          </div>
        </div>
      </div>

      <!-- Card Content -->
      <div class="card-content text">
        <div class="personal-details-form">
          <h4 class="name">{{ profile?.first_name  }} {{ profile?.last_name || '' }}</h4>

          <p class="info">
            <i class="pi pi-user icon"></i>
            {{ profile?.email || $t('profile.not-provided') }}
          </p>

          <!-- Phone -->
          <p class="info">
            <i class="pi pi-phone icon"></i>
            {{ profile?.phone || $t('profile.not-provided') }}
          </p>

          <!-- Address -->
          <p class="info">
            <i class="pi pi-map-marker icon"></i>
            {{ profile?.address || $t('profile.not-provided') }} - {{ profile?.country || $t('profile.not-provided') }}
          </p>

          <hr>

          <!-- Company Name -->
          <h5 class="subtitle">{{ $t('profile.business-name') }}:</h5>
          <p>{{ profile?.business?.name || $t('profile.not-provided') }}</p>

          <!-- Company Address -->
          <h5 class="subtitle">{{ $t('profile.business-address') }}:</h5>
          <p>{{ profile?.business?.address || $t('profile.not-provided') }}</p>

          <!-- Company Phone -->
          <h5 class="subtitle">{{ $t('profile.business-phone') }}:</h5>
          <p>{{ profile?.business?.phone || $t('profile.not-provided') }}</p>

          <!-- Company Email -->
          <h5 class="subtitle">{{ $t('profile.business-email') }}:</h5>
          <p>{{ profile?.business?.email || $t('profile.not-provided') }}</p>

          <h5 class="subtitle">{{ $t('profile.categories') }}:</h5>

          <div class="category-chip-list">
            <span
                v-for="category in categories? categories : []"
                :key="category"
                class="chip"
            >
              {{ category? category : $t('profile.not-provided') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.profile-details-container {
  padding: 16px;
  box-sizing: border-box;
  width: 100%;
}

.profile-details-card {
  width: 100%;
  max-width: 100%;
  background-color: #FFFFFF;
  padding: 16px;
  box-sizing: border-box;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}

.card-header {
  padding-bottom: 16px;
}

.card-title {
  margin: 0;
  font-weight: 500;
}

.card-content {
  padding-top: 8px;
}

/* Contenedor de la foto con funcionalidad de edición */
.profile-photo-container {
  position: relative;
  display: inline-block;
  margin: 16px 0;
  transition: transform 0.3s ease;
}

.profile-photo-container.drag-over {
  transform: scale(1.05);
}

.profile-photo-container.drag-over .photo-overlay {
  opacity: 1;
  background-color: rgba(0, 123, 255, 0.7);
}

.profile-photo {
  width: 100%;
  max-width: 300px;
  height: 300px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
  transition: all 0.3s ease;
}

.profile-photo-container:hover .profile-photo {
  filter: brightness(0.8);
}

/* Overlay para editar la foto */
.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
  max-width: 300px;
  max-height: 300px;
}

.profile-photo-container:hover .photo-overlay {
  opacity: 1;
}

.photo-edit-content {
  text-align: center;
  color: white;
  padding: 20px;
}

.photo-edit-content i {
  font-size: 24px;
  margin-bottom: 5px;
  display: block;
}


.text {
  font-size: 3.5vw;
}

.name {
  margin: 16px 0 8px 0;
  font-weight: 600;
}

.info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
}

.info .material-icons {
  font-size: 18px;
  color: #666;
}

.subtitle {
  margin: 16px 0 4px 0;
  font-weight: 500;
  color: #333;
}

hr {
  margin: 20px 0;
  border: none;
  border-top: 1px solid #e0e0e0;
}

/* Chips */
.category-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.chip {
  display: inline-block;
  padding: 6px 12px;
  background-color: rgba(170, 179, 165, 0.38);
  color: #3c3a3a;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

/* Desktop layout */
@media (min-width: 768px) {
  .profile-details-card {
    max-width: 20vw;
  }

  .text {
    font-size: 0.9vw;
  }
  .profile-photo {
    max-width: 250px;
    height: 250px;
  }

  .photo-overlay {
    max-width: 250px;
    max-height: 250px;
  }
}

@media (max-width: 768px) {
  .profile-details-card {
    max-width: 100%;
  }

  .text {
    font-size: 15px;
  }

  .profile-photo {
    max-width: 200px;
    height: 200px;
  }

  .photo-overlay {
    max-width: 200px;
    max-height: 200px;
  }
}

/* Animación de spinner */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.pi-spin {
  animation: spin 1s linear infinite;
}
</style>