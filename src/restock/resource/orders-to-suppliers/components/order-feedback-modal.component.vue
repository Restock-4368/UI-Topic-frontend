<script>
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';
import {OrderComment} from '../model/order-comment.entity';
import {OrderCommentService} from '../services/order-comment.service.js';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

export default {
  name: 'OrderFeedbackModal',
  components: {
    'pv-dialog': Dialog,
    'pv-button': Button,
    'pv-textarea': Textarea,
    'pv-input-text': InputText,
    'pv-card': Card,
    'pv-toast': Toast,
    'pv-toast-service': ToastService,
  },
  props: {
    visible: Boolean,
    order: Object,
    providerProfiles: Array
  },
  emits: ['close', 'submitted'],
  data() {
    return {
      rating: 0,
      comment: ''
    };
  },
  computed: {
    supplierProfile() {
      return this.providerProfiles.find(p => p.id === this.order?.supplier_id);
    },
    orderDateFormatted() {
      return this.order?.date ? new Date(this.order.date).toLocaleDateString() : '-';
    },
    totalPriceFormatted() {
      return this.order?.total_price ? `S/. ${Number(this.order.total_price).toFixed(2)}` : 'S/. 0.00';
    },
    isDelivered() {
      return this.order?.state?.name?.toLowerCase() === 'delivered';
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    setRating(star) {
      this.rating = star;
    },
    async submitFeedback() {
      if (!this.rating) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Missing rating',
          detail: 'Please select a rating before submitting.',
          life: 3000
        });

        return;
      }

      const newComment = new OrderComment({
        order_to_supplier_id: this.order.id,
        content: this.comment.trim(),
        rating: this.rating,
        date: new Date()
      });

      try {
        await new OrderCommentService().createComment(newComment);
        this.$toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Your feedback was submitted',
          life: 3000
        });
        this.$emit('submitted');
        this.close();
      } catch (error) {
        console.error('Error submitting feedback:', error);
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to send feedback. Please try again later.',
          life: 4000
        });
      }
    }
  }
};
</script>


<template>
  <pv-toast/>
  <pv-dialog
      :visible="visible"
      modal
      :header="`Send Feedback to ${supplierProfile?.name || 'Unknown'}`"
      :style="{ width: '500px' }"
      @hide="close"
  >
    <template #default>
      <div>
        <pv-card>
          <template #title>Order Feedback</template>
          <template #content>
            <div class="summary-item">
              <strong>Supplier:</strong> {{ supplierProfile?.name || 'Unknown' }}
            </div>
            <div class="summary-item">
              <strong>Phone:</strong> {{ supplierProfile?.phone || '-' }}
            </div>
            <div class="summary-item">
              <strong>Date:</strong> {{ orderDateFormatted }}
            </div>
            <div class="summary-item">
              <strong>Total Price:</strong> {{ totalPriceFormatted }}
            </div>

            <div class="mt-3">
              <h4>Rating</h4>
              <div>
                <span v-for="star in 5" :key="star" @click="setRating(star)" style="cursor: pointer">
                  <i :class="['pi', star <= rating ? 'pi-star-fill' : 'pi-star']"></i>
                </span>
              </div>
            </div>

            <div class="mt-3">
              <label for="comment">Comments:</label>
              <pv-textarea id="comment" rows="4" v-model="comment" autoResize></pv-textarea>
            </div>
          </template>
        </pv-card>
      </div>
    </template>
    <template #footer>
      <pv-button label="Cancel" icon="pi pi-times" @click="close"/>
      <pv-button
          label="Submit Feedback"
          icon="pi pi-check"
          @click="submitFeedback"
          :disabled="!isDelivered || rating === 0"
      />
    </template>
  </pv-dialog>
</template>

<style>
.pi-star-fill {
  color: gold;
}

.pi-star {
  color: lightgray;
}
</style>
