Vue.component('accountlist',{render:new Function("with(this){return (Accts===null)?_c('div',{staticClass:\"spinner-border text-primary\",attrs:{\"role\":\"status\"}},[_c('span',{staticClass:\"visually-hidden\"},[_v(\"Loading...\")])]):_c('div',[(Accts.length>0)?_c('table',{staticClass:\"table w-auto\"},[_c('tbody',[_m(0),_v(\" \"),_l((Accts),function(acct){return _c('tr',[_c('td',[_c('a',{staticClass:\"link-primary\",attrs:{\"href\":'#account/'+acct.id,\"title\":\"Edit\"}},[_c('icon',{attrs:{\"name\":\"edit\"}})],1)]),_v(\" \"),_c('td',[_c('a',{staticClass:\"link-danger\",attrs:{\"href\":\"#\",\"title\":\"Delete\"},on:{\"click\":function($event){$event.preventDefault();return ClickDelete(acct.id)}}},[_c('icon',{attrs:{\"name\":\"trash\"}})],1)]),_v(\" \"),_c('td',{staticStyle:{\"padding-right\":\"1rem\"}},[_v(_s(acct.service))]),_v(\" \"),_c('td',[_v(_s(acct.loginid))])])})],2)]):_c('p',{staticStyle:{\"margin\":\"1rem 0\"}},[_v(\"[List is empty]\")]),_v(\" \"),_c('p',[_c('a',{staticClass:\"btn btn-primary\",attrs:{\"href\":\"#account/0\"}},[_c('icon',{attrs:{\"name\":\"add\"}}),_v(\" New Account\")],1)]),_v(\" \"),_c('bs-modal',{ref:\"ModalDelete\",attrs:{\"title\":\"Delete Git Service Account?\"},scopedSlots:_u([{key:\"footer\",fn:function(){return [_c('button',{staticClass:\"btn btn-secondary\",attrs:{\"type\":\"button\",\"data-bs-dismiss\":\"modal\"}},[_v(\"Cancel\")]),_v(\" \"),_c('button',{staticClass:\"btn btn-danger\",attrs:{\"type\":\"button\"},on:{\"click\":function($event){return ClickDelete2()}}},[_c('icon',{attrs:{\"name\":\"trash\"}}),_v(\" Delete\")],1)]},proxy:true}])},[[_v(\" Are you sure that you want to delete the \\\"\"+_s(DeleteAcct ? (DeleteAcct.service + ' / ' + DeleteAcct.loginid) : '')+\"\\\" account? \")]],2)],1)}"),
staticRenderFns:[new Function("with(this){return _c('tr',[_c('th',{attrs:{\"colspan\":\"2\"}}),_v(\" \"),_c('th',{staticStyle:{\"padding-right\":\"1rem\"}},[_v(\"Service\")]),_v(\" \"),_c('th',[_v(\"Login ID\")])])}")],
data() {
      return {
        Accts: null,
        DeleteAcct:null
      }
    },
    methods: {
      ClickDelete(id) {
        this.DeleteAcct = this.Accts.find(b => b.id === id);
        this.$refs.ModalDelete.Show();
      },
      async ClickDelete2() {
        this.$refs.ModalDelete.Hide();
        this.$root.ShowSpinner = true;
        let r = await this.$root.ApiFetch('acct?id=' + this.DeleteAcct.id, { method: 'DELETE' });
        this.$root.ShowSpinner = false;
        this.Accts.splice(this.Accts.findIndex(r => r.id === this.DeleteAcct.id), 1);
      },
    },
    async mounted() {
      let r = await this.$root.ApiFetch('acctlist');
      this.Accts = await r.json();
    }

});