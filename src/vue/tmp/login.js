Vue.component('login',{render:new Function("with(this){return _c('form',{ref:\"theform\",on:{\"submit\":function($event){$event.preventDefault();return FormSubmit()}}},[_c('table',{staticClass:\"form\"},[_c('tbody',[_m(0),_v(\" \"),_c('tr',[_c('th',[_v(\"Password:\")]),_v(\" \"),_c('td',[_c('input',{directives:[{name:\"model\",rawName:\"v-model.trim\",value:(pw),expression:\"pw\",modifiers:{\"trim\":true}}],ref:\"pw\",staticClass:\"form-control\",staticStyle:{\"max-width\":\"200px\"},attrs:{\"type\":\"password\",\"name\":\"pw\",\"required\":\"\",\"autofocus\":\"\"},domProps:{\"value\":(pw)},on:{\"input\":[function($event){if($event.target.composing)return;pw=$event.target.value.trim()},function($event){return $event.target.setCustomValidity('')}],\"blur\":function($event){return $forceUpdate()}}})])])])]),_v(\" \"),_c('button',{staticClass:\"btn btn-primary\",attrs:{\"type\":\"submit\"}},[_c('icon',{attrs:{\"name\":\"unlock\"}}),_v(\" Log in\")],1)])}"),
staticRenderFns:[new Function("with(this){return _c('tr',[_c('th',[_v(\"User ID:\")]),_v(\" \"),_c('td',[_c('input',{staticClass:\"form-control\",staticStyle:{\"max-width\":\"200px\"},attrs:{\"type\":\"text\",\"value\":\"admin\",\"readonly\":\"\"}})])])}")],
data: function () {
      return {
        pw: ''
      }
    },
    methods: {
      async FormSubmit() {
        this.$root.ShowSpinner = true;
        let r = await this.$root.ApiFetch('login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'text/plain' },
          body: this.pw
        });
        this.$root.ShowSpinner = false;
        this.$root.LoggedIn = true;
        window.location.hash = 'repolist';
      }
    }
});