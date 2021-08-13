<template>
  <div :class="'form-check'+(inline?' form-check-inline':'')">
      <input :checked="checked"
             @input="$emit('input',true)"
             class="form-check-input"
             type="radio"
             :id="myid">
    <label class="form-check-label" :for="myid"><slot></slot></label>
  </div>
</template>

<script>
  export default {
    model: {
      prop: 'checked',
      event: 'input'
    },
    props: {
      checked: { type: Boolean, default: false },
      inline: { type: Boolean, default: false }
    },
    data() {
      let s = '';
      for (let i = 0; i < 16; i++) {
        s += Math.floor(Math.random() * 16).toString(16);
      }
      return { myid: 'radio-' + s };
    }
  }
</script>