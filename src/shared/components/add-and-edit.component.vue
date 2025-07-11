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
      errors: {}
    };
  },

  watch: {
    initialData: {
      handler(val) {
        this.form = { ...val };
        this.errors = {};
      },
      deep: true
    }
  },
  methods: {
    validate() {
      const errs = {};
      this.schema.forEach(f => {
        const value = this.form[f.name];
        if (f.type === 'number') {
          if (value === null || value === undefined || value === '' || Number(value) <= 0) {
            errs[f.name] = 'Required';
          }
        } else if (f.type !== 'boolean' && (!value || value.toString().trim() === '')) {
          errs[f.name] = 'Required';
        }
      });
      this.errors = errs;
      return Object.keys(errs).length === 0;
    },
    handleSubmit() {
      if (this.validate()) {
        this.$emit('submit', this.form);
      }
    },
    handleUpload(event, fieldName) {
      const file = event.files[0];
      console.log('Upload triggered:', event.files);
      console.log('Sending to Cloudinary:');
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
            console.log('Image uploaded:', data.secure_url);
            this.form[fieldName] = data.secure_url;
          })
          .catch(err => {
            console.error('Upload failed:', err);
          });
    }
  }
};
</script>


<template>
  <form @submit.prevent="handleSubmit">
    <div v-for="field in schema" :key="field.name" class="p-field mb-3">
      <label :for="field.name" class="block mb-1">{{ field.label }}</label>

      <pv-input-text
          v-if="field.type === 'text'"
          v-model="form[field.name]"
          :id="field.name"
          :placeholder="field.placeholder"
          class="w-full"
          :class="{ 'p-invalid': errors[field.name] }"
      />

      <pv-input-number
          v-else-if="field.type === 'number'"
          v-model="form[field.name]"
          :id="field.name"
          :placeholder="field.placeholder"
          :mode="field.format === 'currency' ? 'currency' : 'decimal'"
          :currency="field.format === 'currency' ? 'PEN' : null"
          :locale="'es-PE'"
          :useGrouping="true"
          :minFractionDigits="field.format === 'currency' ? 2 : 0"
          :maxFractionDigits="field.format === 'currency' ? 2 : 0"
          class="w-full"
          :class="{ 'p-invalid': errors[field.name] }"
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
          class="green-button"
          @uploader="event => handleUpload(event, field.name)"
      />


      <div v-if="field.type === 'file' && form[field.name]" class="mt-3">
        <img
            :src="form[field.name]"
            alt="Preview"
            style="max-width: 100%; border-radius: 10px;"
        />
      </div>


      <small v-if="errors[field.name]" class="p-error">{{ errors[field.name] }}</small>
    </div>

    <slot name="extension" :form="form" />

    <div class="flex justify-content-end mt-4">
      <pv-button
          :label="mode === 'create' ? 'Save' : 'Update'"
          icon="pi pi-check"
          type="submit"
          class="green-button"
      />
    </div>
  </form>
</template>

