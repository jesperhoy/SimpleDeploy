Vue.component('repo',{render:new Function("with(this){return (Repo===null || Accounts===null)?_c('div',{staticClass:\"spinner-border text-primary\",attrs:{\"role\":\"status\"}},[_c('span',{staticClass:\"visually-hidden\"},[_v(\"Loading...\")])]):_c('form',{on:{\"submit\":function($event){$event.preventDefault();return Submit(false)}}},[_c('table',{staticClass:\"form\"},[_c('tbody',[_c('tr',[_c('th',[_v(\"Internal ID:\")]),_v(\" \"),_c('td',{staticClass:\"pad\"},[_v(_s(id === 0 ? \"(click Update button to generate)\" : id))])]),_v(\" \"),_c('tr',[_c('th',[_v(\"Name:\")]),_v(\" \"),_c('td',[_c('input',{directives:[{name:\"model\",rawName:\"v-model.trim\",value:(Repo.name),expression:\"Repo.name\",modifiers:{\"trim\":true}}],staticClass:\"form-control\",attrs:{\"type\":\"text\",\"required\":\"\",\"autofocus\":\"\"},domProps:{\"value\":(Repo.name)},on:{\"input\":function($event){if($event.target.composing)return;$set(Repo, \"name\", $event.target.value.trim())},\"blur\":function($event){return $forceUpdate()}}})])]),_v(\" \"),_c('tr',[_c('th',[_v(\"Git repository URL:\")]),_v(\" \"),_c('td',[_c('input',{directives:[{name:\"model\",rawName:\"v-model\",value:(Repo.giturl),expression:\"Repo.giturl\"}],staticClass:\"form-control\",attrs:{\"type\":\"url\",\"required\":\"\"},domProps:{\"value\":(Repo.giturl)},on:{\"input\":function($event){if($event.target.composing)return;$set(Repo, \"giturl\", $event.target.value)}}})])]),_v(\" \"),_c('tr',[_c('th',[_v(\"Git account:\")]),_v(\" \"),_c('td',[_c('select',{directives:[{name:\"model\",rawName:\"v-model.number\",value:(Repo.account),expression:\"Repo.account\",modifiers:{\"number\":true}}],staticClass:\"form-select\",on:{\"change\":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = \"_value\" in o ? o._value : o.value;return _n(val)}); $set(Repo, \"account\", $event.target.multiple ? $$selectedVal : $$selectedVal[0])}}},[_c('option',{attrs:{\"value\":\"0\"}},[_v(\"None / Anonymous\")]),_v(\" \"),_l((Accounts),function(Acct){return _c('option',{domProps:{\"value\":Acct.id}},[_v(_s(Acct.service + \" / \" + Acct.loginid))])})],2)])]),_v(\" \"),_c('tr',[_c('th',[_v(\"Branch name:\")]),_v(\" \"),_c('td',[_c('input',{directives:[{name:\"model\",rawName:\"v-model\",value:(Repo.branch),expression:\"Repo.branch\"}],staticClass:\"form-control\",attrs:{\"type\":\"text\",\"required\":\"\"},domProps:{\"value\":(Repo.branch)},on:{\"input\":function($event){if($event.target.composing)return;$set(Repo, \"branch\", $event.target.value)}}})])]),_v(\" \"),_c('tr',[_c('th',[_v(\"Output directory:\")]),_v(\" \"),_c('td',[_c('input',{directives:[{name:\"model\",rawName:\"v-model\",value:(Repo.outdir),expression:\"Repo.outdir\"}],staticClass:\"form-control\",attrs:{\"type\":\"text\",\"required\":\"\"},domProps:{\"value\":(Repo.outdir)},on:{\"input\":function($event){if($event.target.composing)return;$set(Repo, \"outdir\", $event.target.value)}}})])]),_v(\" \"),_c('tr',[_c('th',[_v(\"Webhook URL:\")]),_v(\" \"),_c('td',[_c('table',{staticStyle:{\"width\":\"100%\"}},[_c('tr',[_c('td',[_c('input',{ref:\"hookurl\",staticClass:\"form-control\",attrs:{\"type\":\"text\",\"disabled\":id===0,\"readonly\":id>0},domProps:{\"value\":id === 0 ? '(click Update button to generate)':HookUrl()}})]),_v(\" \"),(id>0)?_c('td',{staticStyle:{\"width\":\"1%\"}},[_c('a',{staticClass:\"link-primary\",attrs:{\"href\":\"#\",\"title\":\"Copy\"},on:{\"click\":function($event){$event.preventDefault();return CopyHookUrl()}}},[_c('icon',{attrs:{\"name\":\"copy\"}})],1)]):_e()])])])]),_v(\" \"),_c('tr',[_c('th',[_v(\"Webhook method:\")]),_v(\" \"),_c('td',[_c('select',{directives:[{name:\"model\",rawName:\"v-model\",value:(Repo.hookmethod),expression:\"Repo.hookmethod\"}],staticClass:\"form-select w-auto\",on:{\"change\":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = \"_value\" in o ? o._value : o.value;return val}); $set(Repo, \"hookmethod\", $event.target.multiple ? $$selectedVal : $$selectedVal[0])}}},_l((['POST', 'PUT', 'GET', '*']),function(m){return _c('option',{domProps:{\"value\":m}},[_v(_s(m === \"*\" ? \"* (Any)\" : m))])}),0)])]),_v(\" \"),_c('tr',[_c('th',[_v(\"Notes:\")]),_v(\" \"),_c('td',[_c('textarea',{directives:[{name:\"model\",rawName:\"v-model\",value:(Repo.notes),expression:\"Repo.notes\"}],staticClass:\"form-control\",attrs:{\"name\":\"notes\",\"rows\":\"3\"},domProps:{\"value\":(Repo.notes)},on:{\"input\":function($event){if($event.target.composing)return;$set(Repo, \"notes\", $event.target.value)}}})])])])]),_v(\" \"),_c('button',{staticClass:\"btn btn-primary\",attrs:{\"type\":\"submit\"}},[_c('icon',{attrs:{\"name\":\"check\"}}),_v(\" Update\")],1),_v(\" \"),(id>0)?_c('button',{staticClass:\"btn btn-primary\",attrs:{\"type\":\"button\"},on:{\"click\":function($event){$event.preventDefault();return Submit(true)}}},[_c('icon',{attrs:{\"name\":\"download\"}}),_v(\" Pull now\")],1):_e()])}"),
staticRenderFns:[],
props: {
      id: { type: Number, default:0 }
    },
    data() {
      return {
        Accounts:null,
        Repo: null,
      }
    },
    methods: {
      HookUrl() {
        let x = document.location.href + "#";
        x = x.substr(0, x.indexOf('#'));
        x = x.substr(0, x.lastIndexOf("/") + 1);
        return x + 'hook-' + this.id.toString() + '-' + this.Repo.hooksecret;
      },
      CopyHookUrl() {
        //navigator.clipboard.writeText(this.HookUrl()).catch(err => console.error('Failed to copy text: ', err))
        let e = this.$refs.hookurl;
        let ro = e.readOnly;
        e.readOnly = false; // needed on ipad
        e.focus();
        e.setSelectionRange(0, e.value.length); // e.select(); - virker ikke på iPad
        var success;
        try {
          success = document.execCommand('copy');
        } catch (err) {
          success = false;
        }
        e.setSelectionRange(0, 0);
        e.blur();
        e.readOnly = ro;
        return success;
      },
      MakeNewRepo() {
        let s = '';
        for (let i = 0; i < 20; i++) {
          s+=Math.floor(Math.random() * 16).toString(16);
        }
        return {
          id:0,
          name: "",
          giturl: "",
          account: 0,
          branch: "master",
          outdir: "",
          hooksecret: s,
          hookmethod: "POST",
          notes: ""
        };
      },
      async Submit(pull) {
        this.$root.ShowSpinner = true;
        let r = await this.$root.ApiFetch('repo?id=' + this.id, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pull: pull, repo: this.Repo })
        });
        let NewID = await r.json();
        this.$root.ShowSpinner = false;
        this.$root.ShowToast("Repository " + (this.id === 0 ? 'initialized' : (pull ? 'pulled' : 'settings updated')) + ' successfully');
        this.Repo.id = NewID;
        window.location.hash = "repo/" + NewID;
      },
      async LoadRepo(id) {
        if (this.id > 0) {
          r = await this.$root.ApiFetch('repo?id=' + id);
          if (r.status === 404) { window.location.hash = "repolist"; return; }
          this.Repo = await r.json();
        } else {
          this.Repo = this.MakeNewRepo();
        }
      }
    },
    async mounted() {
      let r = await this.$root.ApiFetch('acctlist');
      this.Accounts = await r.json();
      this.LoadRepo(this.id);
    },
    watch: {
      id(newVal, oldVal) {
        if (this.Repo.id === newVal) return;
        this.Repo = null;
        this.LoadRepo(newVal);
      }
    }
});