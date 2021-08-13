Vue.component('account',{render:new Function("with(this){return (Acct===null)?_c('div',{staticClass:\"spinner-border text-primary\",attrs:{\"role\":\"status\"}},[_c('span',{staticClass:\"visually-hidden\"},[_v(\"Loading...\")])]):_c('form',{on:{\"submit\":function($event){$event.preventDefault();return Submit()}}},[_c('table',{staticClass:\"form\"},[_c('tbody',[_c('tr',[_c('th',[_v(\"Internal ID:\")]),_v(\" \"),_c('td',{staticClass:\"pad\"},[_v(_s(id===0 ? \"(click Update button to generate)\" : id))])]),_v(\" \"),_c('tr',[_c('th',[_v(\"Service name:\")]),_v(\" \"),_c('td',[_c('input',{directives:[{name:\"model\",rawName:\"v-model.trim\",value:(Acct.service),expression:\"Acct.service\",modifiers:{\"trim\":true}}],staticClass:\"form-control\",attrs:{\"type\":\"text\",\"required\":\"\",\"autofocus\":\"\"},domProps:{\"value\":(Acct.service)},on:{\"input\":function($event){if($event.target.composing)return;$set(Acct, \"service\", $event.target.value.trim())},\"blur\":function($event){return $forceUpdate()}}})])]),_v(\" \"),_c('tr',[_c('th',[_v(\"User/Login ID:\")]),_v(\" \"),_c('td',[_c('input',{directives:[{name:\"model\",rawName:\"v-model.trim\",value:(Acct.loginid),expression:\"Acct.loginid\",modifiers:{\"trim\":true}}],staticClass:\"form-control\",attrs:{\"type\":\"text\",\"required\":\"\"},domProps:{\"value\":(Acct.loginid)},on:{\"input\":function($event){if($event.target.composing)return;$set(Acct, \"loginid\", $event.target.value.trim())},\"blur\":function($event){return $forceUpdate()}}})])]),_v(\" \"),_c('tr',[_c('th',[_v(\"Password/Token:\")]),_v(\" \"),_c('td',[_c('input',{directives:[{name:\"model\",rawName:\"v-model\",value:(Acct.password),expression:\"Acct.password\"}],staticClass:\"form-control\",attrs:{\"type\":\"password\",\"required\":\"\"},domProps:{\"value\":(Acct.password)},on:{\"input\":function($event){if($event.target.composing)return;$set(Acct, \"password\", $event.target.value)}}}),_v(\" \"),_m(0)])]),_v(\" \"),_c('tr',[_c('th',[_v(\"Notes:\")]),_v(\" \"),_c('td',[_c('textarea',{directives:[{name:\"model\",rawName:\"v-model\",value:(Acct.notes),expression:\"Acct.notes\"}],staticClass:\"form-control\",attrs:{\"rows\":\"3\"},domProps:{\"value\":(Acct.notes)},on:{\"input\":function($event){if($event.target.composing)return;$set(Acct, \"notes\", $event.target.value)}}})])])])]),_v(\" \"),_c('button',{staticClass:\"btn btn-primary\",attrs:{\"type\":\"submit\",\"name\":\"button\"}},[_c('icon',{attrs:{\"name\":\"check\"}}),_v(\" Update\")],1)])}"),
staticRenderFns:[new Function("with(this){return _c('small',[_v(\"For GitHub accounts, use a \"),_c('a',{attrs:{\"href\":\"https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token\",\"target\":\"_blank\"}},[_v(\"personal access token\")]),_v(\" instead of your password here\")])}")],
props: {
      id: { type: Number, default:0 }
    },
    data() {
      return {
        Acct: null,
      }
    },
    methods: {
      MakeNewAcct() {
        return {
          id:0,
          service: '',
          loginid: '',
          password: '',
          notes: ''
        };
      },
      async Submit() {
        let r=await this.$root.ApiFetch('acct?id=' + this.id, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.Acct)
        });
        let v=await r.json();
        this.$root.ShowToast("Git service account " + (this.id === 0 ? 'created' : 'updated')); 
        this.Acct.id = v;
        window.location.hash = "account/" + v;
      },
      async LoadAcct(id) {
        if (this.id === 0) { this.Acct = this.MakeNewAcct(); return; }
        let r = await this.$root.ApiFetch('acct?id=' + this.id);
        if (r.status === 404) { window.location.hash = "accountlist"; return; }
        this.Acct = await r.json();

      }
    },
    mounted() {
      this.LoadAcct(this.id);
    }, 
    watch: {
      id(newVal, oldVal) {
        if (this.Acct.id === newVal) return;
        this.Acct = null;
        this.LoadAcct(newVal);
      }
    }
});