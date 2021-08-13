Vue.component('repolist',{render:new Function("with(this){return (Repos===null)?_c('div',{staticClass:\"spinner-border text-primary\",attrs:{\"role\":\"status\"}},[_c('span',{staticClass:\"visually-hidden\"},[_v(\"Loading...\")])]):_c('div',[(Repos.length>0)?_c('table',{staticClass:\"table w-auto\"},[_c('tbody',[_m(0),_v(\" \"),_l((Repos),function(r){return _c('tr',[_c('td',[_c('a',{staticClass:\"link-primary\",attrs:{\"href\":'#repo/'+r.id,\"title\":\"Edit\"}},[_c('icon',{attrs:{\"name\":\"edit\"}})],1)]),_v(\" \"),_c('td',[_c('a',{staticClass:\"link-danger\",attrs:{\"href\":\"#\",\"title\":\"Delete\"},on:{\"click\":function($event){$event.preventDefault();return ClickDelete(r.id)}}},[_c('icon',{attrs:{\"name\":\"trash\"}})],1)]),_v(\" \"),_c('td',{staticStyle:{\"padding-right\":\"1rem\"}},[_v(_s(r.id))]),_v(\" \"),_c('td',{staticStyle:{\"padding-right\":\"1rem\"}},[_v(_s(r.name))]),_v(\" \"),_c('td',{staticStyle:{\"padding-right\":\"1rem\"}},[_v(_s(FormatTime(r.lasttime)))]),_v(\" \"),(r.lastres===1)?_c('td',{staticClass:\"text-success\",staticStyle:{\"padding-right\":\"1rem\"}},[_c('icon',{staticStyle:{\"width\":\"1.5rem\",\"height\":\"1.5rem\",\"vertical-align\":\"middle\"},attrs:{\"name\":\"check\"}}),_v(\" Success \")],1):(r.lastres===0)?_c('td',{staticClass:\"text-danger\",staticStyle:{\"padding-right\":\"1rem\"}},[_c('icon',{staticStyle:{\"width\":\"1.5rem\",\"height\":\"1.5rem\",\"vertical-align\":\"middle\"},attrs:{\"name\":\"error\"}}),_v(\" Failed \")],1):_c('td',{staticStyle:{\"padding-right\":\"1rem\"}},[_v(\"-\")]),_v(\" \"),_c('td',[(r.lasttime>0)?_c('a',{attrs:{\"href\":\"#\"},on:{\"click\":function($event){$event.preventDefault();return ClickStatus(r)}}},[_v(\"Status\")]):_c('span',[_v(\"-\")])])])})],2)]):_c('p',{staticStyle:{\"margin\":\"1rem 0\"}},[_v(\"[List is empty]\")]),_v(\" \"),_c('p',[_c('a',{staticClass:\"btn btn-primary\",attrs:{\"href\":\"#repo/0\"}},[_c('icon',{attrs:{\"name\":\"add\"}}),_v(\" New Repository\")],1)]),_v(\" \"),_c('bs-modal',{ref:\"ModalStatus\",attrs:{\"size\":\"lg\",\"title\":\"Repository Status\"},scopedSlots:_u([{key:\"footer\",fn:function(){return [_c('button',{staticClass:\"btn btn-primary\",attrs:{\"type\":\"button\",\"data-bs-dismiss\":\"modal\"}},[_c('icon',{attrs:{\"name\":\"check\"}}),_v(\" OK\")],1)]},proxy:true}])},[[(StatusRepo)?_c('table',{staticClass:\"form\"},[_c('tbody',[_c('tr',[_c('th',[_v(\"Repository:\")]),_v(\" \"),_c('td',{staticClass:\"pad\"},[_v(_s(StatusRepo.name + ' (' + StatusRepo.id + ')'))])]),_v(\" \"),_c('tr',[_c('th',[_v(\"Last pull:\")]),_v(\" \"),_c('td',{staticClass:\"pad\"},[_v(_s(FormatTime(State.time)))])]),_v(\" \"),_c('tr',[_c('th',[_v(\"Trigger:\")]),_v(\" \"),_c('td',{staticClass:\"pad\"},[_v(_s(State.ui ? 'Management UI' : 'Webhook'))])]),_v(\" \"),_c('tr',[_c('th',[_v(\"Result:\")]),_v(\" \"),_c('td',{staticClass:\"pad\"},[_v(_s(State.ok ? 'Success' : 'Failed'))])]),_v(\" \"),_c('tr',[_c('th',[_v(_s(State.ok ? 'Output':'Error')+\":\")]),_v(\" \"),_c('td',{staticClass:\"pad\",domProps:{\"innerHTML\":_s(StatusEnc())}})]),_v(\" \"),(!State.ok)?_c('tr',[_c('th',[_v(\"Last success:\")]),_v(\" \"),_c('td',{staticClass:\"pad\"},[_v(_s(FormatTime(State.lastsuccess)))])]):_e()])]):_e()]],2),_v(\" \"),_c('bs-modal',{ref:\"ModalDelete\",attrs:{\"title\":\"Delete Repository?\"},scopedSlots:_u([{key:\"footer\",fn:function(){return [_c('button',{staticClass:\"btn btn-secondary\",attrs:{\"type\":\"button\",\"data-bs-dismiss\":\"modal\"}},[_v(\"Cancel\")]),_v(\" \"),_c('button',{staticClass:\"btn btn-danger\",attrs:{\"type\":\"button\"},on:{\"click\":function($event){return ClickDelete2()}}},[_c('icon',{attrs:{\"name\":\"trash\"}}),_v(\" Delete\")],1)]},proxy:true}])},[[_v(\" Are you sure that you want to delete the \\\"\"+_s(DeleteRepo ? DeleteRepo.name:'')+\"\\\" repository? \"),_c('br'),_v(\" \"),_c('br'),_v(\" Note: This will NOT delete the repository's output directory. \")]],2)],1)}"),
staticRenderFns:[new Function("with(this){return _c('tr',[_c('th',{attrs:{\"colspan\":\"2\"}}),_v(\" \"),_c('th',{staticStyle:{\"padding-right\":\"1rem\"}},[_v(\"ID\")]),_v(\" \"),_c('th',{staticStyle:{\"padding-right\":\"1rem\"}},[_v(\"Name\")]),_v(\" \"),_c('th',{staticStyle:{\"padding-right\":\"1rem\"}},[_v(\"Last pull\")]),_v(\" \"),_c('th',{staticStyle:{\"padding-right\":\"1rem\"}},[_v(\"Result\")]),_v(\" \"),_c('th',[_v(\"Status\")])])}")],
data() {
      return {
        Repos: null,
        State: null,
        StatusRepo: null,
        DeleteRepo: null,
      }
    },
    methods: {
      FormatTime(v) {
        return v === 0 ? 'Never' : (new Date(v)).toLocaleString();
      },
      StatusEnc() {
        if (this.StatusRepo === null) return '';
        return this.State.output.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('\n').join('<br/>');
      },
      ClickDelete(id) {
        this.DeleteRepo = this.Repos.find(r => r.id === id);
        this.$refs.ModalDelete.Show();
      },
      async ClickDelete2() {
        this.$refs.ModalDelete.Hide();
        this.$root.ShowSpinner = true;
        let r = await this.$root.ApiFetch('repo?id=' + this.DeleteRepo.id, { method: 'DELETE' });
        this.$root.ShowSpinner = false;
        this.Repos.splice(this.Repos.findIndex(r => r.id === this.DeleteRepo.id), 1); 
      },
      async ClickStatus(repo) {
        this.$root.ShowSpinner = true;
        let r = await this.$root.ApiFetch('repostate?id=' + repo.id);
        this.$root.ShowSpinner = false;
        if (r.status === 404) return;
        this.State = await r.json(); 
        this.StatusRepo = repo; 
        this.$refs.ModalStatus.Show();
      }
    },
    async mounted() {
      let r = await this.$root.ApiFetch('repolist');
      this.Repos = await r.json();
    }
});