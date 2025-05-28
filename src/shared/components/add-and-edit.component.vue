<script>
import {InputNumber as PvInputNumber, InputText as PvInputText} from "primevue";

export default {
  name: 'AddAndEditForm',
  components: {PvInputNumber, PvInputText},
  props: {
    schema: { type: Array, required: true },
    initialData: { type: Object, default: () => ({}) },
    mode: { type: String, default: 'create' }
  },
  emits: ['submit'],
  data() {
    return {
      form: { ...this.initialData },
    };
  },
  methods: {
    handleUpload(event, fieldName) {
      const file = event.files[0];
      console.log('📁 Upload triggered:', event.files);
      console.log('🧪 Sending to Cloudinary:');
      console.log('Upload preset:', 'uitopic');
      console.log('File:', file.name);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'uitopic');

      fetch('https://api.cloudinary.com/v1_1/dvspiemtu/image/upload', {
        method: 'POST',
        body: formData
      })
          .then(res => res.json())
          .then(data => {
            console.log('✅ Image uploaded:', data.secure_url);
            this.form[fieldName] = data.secure_url;
          })
          .catch(err => {
            console.error('❌ Upload failed:', err);
          });
    }
  }
};
</script>


<template>
  <form @submit.prevent="$emit('submit', form)">
    <div v-for="field in schema" :key="field.name" class="p-field mb-3">
      <label :for="field.name" class="block mb-1">{{ field.label }}</label>

      <pv-input-text
          v-if="field.type === 'text'"
          v-model="form[field.name]"
          :id="field.name"
          :placeholder="field.placeholder"
          class="w-full"
      />

      <pv-input-number
          v-else-if="field.type === 'number'"
          v-model="form[field.name]"
          :id="field.name"
          :placeholder="field.placeholder"
          class="w-full"
      />

      <pv-input-switch
          v-else-if="field.type === 'boolean'"
          v-model="form[field.name]"
          :id="field.name"
      />

      <FileUpload
          v-if="field.type === 'file'"
          name="file"
          mode="basic"
          customUpload
          auto
          accept="image/*"
          @uploader="event => handleUpload(event, field.name)"
      />


      <div v-if="field.type === 'file' && form[field.name]" class="mt-3">
        <img
            :src="form[field.name]"
            alt="Preview"
            style="max-width: 100%; border-radius: 10px;"
        />
      </div>
    </div>

    <slot name="extension" :form="form" />

    <pv-button
        :label="mode === 'create' ? 'Save' : 'Update'"
        icon="pi pi-check"
        type="submit"
        class="mt-4"
    />
  </form>
</template>

