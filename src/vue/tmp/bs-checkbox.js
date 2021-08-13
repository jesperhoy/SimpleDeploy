Vue.component('bs-checkbox',{render:new Function("with(this){return _c('div',{class:'form-check'+(inline?' form-check-inline':'')},[_c('input',{staticClass:\"form-check-input\",attrs:{\"type\":\"checkbox\",\"id\":myid},domProps:{\"checked\":checked},on:{\"input\":function($event){return $emit('input',$event.target.checked)}}}),_v(\" \"),_c('label',{staticClass:\"form-check-label\",attrs:{\"for\":myid}},[_t(\"default\")],2)])}"),
staticRenderFns:[],
model: {
      prop: 'checked',
      event: 'input'
    },
    props: {
      checked: { type: Boolean, default: false },
      inline: {type: Boolean, default: false }
    },
    data() {
      let s = '';
      for (let i = 0; i < 16; i++) {
        s += Math.floor(Math.random() * 16).toString(16);
      }
      return { myid: 'checkbox-' + s };
    }

});