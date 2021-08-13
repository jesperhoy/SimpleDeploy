Vue.component('bs-modal',{render:new Function("with(this){return _c('div',{staticClass:\"modal fade\",attrs:{\"tabindex\":\"-1\"}},[_c('div',{class:'modal-dialog modal-dialog-centered'+(size==='md'?'':' modal-'+size)},[_c('div',{staticClass:\"modal-content\"},[_c('form',{on:{\"submit\":function($event){$event.preventDefault();return $emit('submit')}}},[_c('div',{staticClass:\"modal-header\"},[_t(\"header\",[_c('h5',{staticClass:\"modal-title\"},[_v(_s(title))])]),_v(\" \"),_c('button',{staticClass:\"btn-close\",attrs:{\"type\":\"button\",\"aria-label\":\"Close\"},on:{\"click\":function($event){return Hide()}}})],2),_v(\" \"),_c('div',{staticClass:\"modal-body\"},[_t(\"default\")],2),_v(\" \"),_c('div',{staticClass:\"modal-footer\"},[_t(\"footer\")],2)])])])])}"),
staticRenderFns:[],
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
});