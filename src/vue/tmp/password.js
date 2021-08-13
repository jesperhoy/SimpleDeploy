Vue.component('password',{render:new Function("with(this){return _c('form',{ref:\"theform\",on:{\"submit\":function($event){$event.preventDefault();return FormSubmit()}}},[_c('table',{staticClass:\"form\"},[_c('tbody',[($root.HasPW)?_c('tr',[_c('th',[_v(\"Current password:\")]),_v(\" \"),_c('td',[_c('input',{directives:[{name:\"model\",rawName:\"v-model.trim\",value:(CurPW),expression:\"CurPW\",modifiers:{\"trim\":true}}],ref:\"curpw\",staticClass:\"form-control\",staticStyle:{\"max-width\":\"200px\"},attrs:{\"type\":\"password\",\"required\":\"\",\"autofocus\":\"\"},domProps:{\"value\":(CurPW)},on:{\"input\":[function($event){if($event.target.composing)return;CurPW=$event.target.value.trim()},function($event){return $event.target.setCustomValidity('')}],\"blur\":function($event){return $forceUpdate()}}})])]):_e(),_v(\" \"),_c('tr',[_c('th',[_v(\"New password:\")]),_v(\" \"),_c('td',[_c('input',{directives:[{name:\"model\",rawName:\"v-model.trim\",value:(NewPW1),expression:\"NewPW1\",modifiers:{\"trim\":true}}],staticClass:\"form-control\",staticStyle:{\"max-width\":\"200px\"},attrs:{\"type\":\"password\",\"required\":\"\",\"minlength\":\"8\",\"autofocus\":!$root.HasPW},domProps:{\"value\":(NewPW1)},on:{\"input\":function($event){if($event.target.composing)return;NewPW1=$event.target.value.trim()},\"blur\":function($event){return $forceUpdate()}}})])]),_v(\" \"),_c('tr',[_c('th',[_v(\"Repeat new password:\")]),_v(\" \"),_c('td',[_c('input',{directives:[{name:\"model\",rawName:\"v-model.trim\",value:(NewPW2),expression:\"NewPW2\",modifiers:{\"trim\":true}}],ref:\"pw2\",staticClass:\"form-control\",staticStyle:{\"max-width\":\"200px\"},attrs:{\"type\":\"password\",\"required\":\"\",\"minlength\":\"8\"},domProps:{\"value\":(NewPW2)},on:{\"input\":[function($event){if($event.target.composing)return;NewPW2=$event.target.value.trim()},function($event){return $event.target.setCustomValidity('')}],\"blur\":function($event){return $forceUpdate()}}})])])])]),_v(\" \"),_c('button',{staticClass:\"btn btn-primary\",attrs:{\"type\":\"submit\"}},[_c('icon',{attrs:{\"name\":\"check\"}}),_v(\" Update\")],1)])}"),
staticRenderFns:[],
data() {
      return {
        CurPW: '',
        NewPW1: '',
        NewPW2: ''
      }
    },
    methods: {
      async FormSubmit() {
        if (this.NewPW1 !== this.NewPW2) {
          this.$refs.pw2.setCustomValidity("Not repeated correctly");
          this.$refs.theform.reportValidity();
          return;
        }
        this.$root.ShowSpinner = true;
        let r = await this.$root.ApiFetch('pw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cur: this.CurPW, new: this.NewPW1 })
        });
        this.$root.ShowSpinner = false;
        if (r.status === 400) {
          this.$refs.curpw.setCustomValidity("Incorrect current password");
          this.$refs.theform.reportValidity();
          return;
        }
        this.$root.LoggedIn = true;
        this.$root.ShowToast('Admin password changed successfully');
        window.location.hash = this.$root.HasPW ? 'settings' : 'repolist';
        this.$root.HasPW = true;
      }
    }
});