Vue.component('settings',{render:new Function("with(this){return (settings===null)?_c('div',{staticClass:\"spinner-border text-primary\",attrs:{\"role\":\"status\"}},[_c('span',{staticClass:\"visually-hidden\"},[_v(\"Loading...\")])]):_c('form',{ref:\"theform\",on:{\"submit\":function($event){$event.preventDefault();return Submit()}}},[_c('table',{staticClass:\"form\"},[_c('tbody',[_m(0),_v(\" \"),_c('tr',[_c('th',[_v(\"Server name:\")]),_v(\" \"),_c('td',[_c('input',{directives:[{name:\"model\",rawName:\"v-model.trim\",value:(settings.servername),expression:\"settings.servername\",modifiers:{\"trim\":true}}],staticClass:\"form-control\",attrs:{\"type\":\"text\",\"autofocus\":\"\",\"required\":\"\"},domProps:{\"value\":(settings.servername)},on:{\"input\":function($event){if($event.target.composing)return;$set(settings, \"servername\", $event.target.value.trim())},\"blur\":function($event){return $forceUpdate()}}})])]),_v(\" \"),_c('tr',[_c('th',[_v(\"Redirect UI to SSL:\")]),_v(\" \"),_c('td',{staticClass:\"pad\"},[_c('bs-checkbox',{model:{value:(settings.forcessl),callback:function ($$v) {$set(settings, \"forcessl\", $$v)},expression:\"settings.forcessl\"}})],1)]),_v(\" \"),_c('tr',[_c('th',[_v(\"Git.exe location:\")]),_v(\" \"),_c('td',[_c('input',{directives:[{name:\"model\",rawName:\"v-model.trim\",value:(settings.gitexeloc),expression:\"settings.gitexeloc\",modifiers:{\"trim\":true}}],ref:\"gitexeloc\",staticClass:\"form-control\",attrs:{\"type\":\"text\",\"autofocus\":\"\"},domProps:{\"value\":(settings.gitexeloc)},on:{\"input\":[function($event){if($event.target.composing)return;$set(settings, \"gitexeloc\", $event.target.value.trim())},function($event){return $event.target.setCustomValidity('')}],\"blur\":function($event){return $forceUpdate()}}}),_v(\" \"),_m(1)])]),_v(\" \"),_c('tr',[_c('th',[_v(\"Notes:\")]),_v(\" \"),_c('td',[_c('textarea',{directives:[{name:\"model\",rawName:\"v-model.trim\",value:(settings.notes),expression:\"settings.notes\",modifiers:{\"trim\":true}}],staticClass:\"form-control\",attrs:{\"rows\":\"3\"},domProps:{\"value\":(settings.notes)},on:{\"input\":function($event){if($event.target.composing)return;$set(settings, \"notes\", $event.target.value.trim())},\"blur\":function($event){return $forceUpdate()}}})])])])]),_v(\" \"),_c('button',{staticClass:\"btn btn-primary\",attrs:{\"type\":\"submit\"}},[_c('icon',{attrs:{\"name\":\"check\"}}),_v(\" Update\")],1)])}"),
staticRenderFns:[new Function("with(this){return _c('tr',[_c('th',[_v(\"Admin password:\")]),_v(\" \"),_c('td',{staticClass:\"pad\"},[_c('a',{attrs:{\"href\":\"#password\"}},[_v(\"Change\")])])])}"),new Function("with(this){return _c('small',[_v(\"Leave blank to use default locations. Download Git from \"),_c('a',{attrs:{\"href\":\"http://git-scm.com/downloads\",\"target\":\"_blank\"}},[_v(\"http://git-scm.com/downloads\")]),_v(\".\")])}")],
data() {
      return {
        settings: null
      }
    },
    methods: {
      async Submit() {
        if (this.settings.gitexeloc.length > 0 && !this.settings.gitexeloc.toLowerCase().endsWith('\\git.exe')) {
          this.$refs.gitexeloc.setCustomValidity('Must end in \'\\git.exe\'');
          this.$refs.theform.reportValidity();
          return;
        }
        this.$root.ShowSpinner = true;
        let r = await this.$root.ApiFetch('settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.settings)
        });
        this.$root.ServerName = this.settings.servername;
        this.$root.ShowSpinner = false;
        this.$root.ShowToast("Settings updated successfully");
      }
    },
    async mounted() {
      let r = await this.$root.ApiFetch('settings');
      this.settings = await r.json();
    }
});