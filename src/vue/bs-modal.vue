<template>
  <div class="modal fade" tabindex="-1">
    <div :class="'modal-dialog modal-dialog-centered'+(size==='md'?'':' modal-'+size)">
      <div class="modal-content">

        <form @submit.prevent="$emit('submit')">

          <div class="modal-header">
            <slot name="header">
              <h5 class="modal-title">{{title}}</h5>
            </slot>
            <button type="button" class="btn-close" @click="Hide()" aria-label="Close"></button>
          </div>
          
          <div class="modal-body">
            <slot name="default"></slot>
          </div>
          
          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>

        </form>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    MyModal: null,
    props: {
      value: { type: Boolean, default: false },
      title: { type: String, default: '' },
      size: { type: String, default: 'md'} //sm,md,lg,xl
    },
    methods: {
      Show() {
        this.$options.MyModal.show();
      },
      Hide() {
        this.$options.MyModal.hide();
      }
    },
    watch: {
      value(nyVal, glVal) {
        if (nyVal) {
          this.$options.MyModal.show();
        } else {
          this.$options.MyModal.hide();
        }
      }
    },
    mounted() {
      let dette = this;
      this.$options.MyModal = new bootstrap.Modal(this.$el);
      this.$el.addEventListener('shown.bs.modal', function (event) {
        dette.$emit('input', true);
      })
      this.$el.addEventListener('hidden.bs.modal', function (event) {
        dette.$emit('input',false);
      })
      if (this.value) this.$options.MyModal.show();
    }
}
</script>