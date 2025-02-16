new Vue((function() {
let o=(function() {
"use strict";
return {
    MyToast: null,
    el: "#app",
    PageTitle: {
      login: 'Log in',
      password: 'Change Admin Password',
      repolist: 'Repositories',
      repo: 'Repository',
      accountlist: 'Git Service Accounts',
      account: 'Git Service Account',
      settings: 'General Settings',
    },
    data: {
      LoggedIn: false,
      Page: '',
      ShowSpinner: false,
      ItemID: 0,
      ApiNum: 0,
      HasPW: true,
      ToastText: '',
      ErrorText: '',
      ServerName: SimpleDeploySN,
      SDVer: SimpleDeployVer
    },
    methods: {
      ApiFetch(f, opt) {
        let dette = this;
        return new Promise(
          async function (resolve) {
            let MyApiNum = ++dette.ApiNum;
            let r = await fetch("api/" + f, opt);
            if (MyApiNum !== dette.ApiNum) return; // do not resolve/reject
            if (r.status === 401) {
              dette.HasPW = (await r.json())===1;
              dette.ShowSpinner = false;
              dette.LoggedIn = false;
              window.location.hash = dette.HasPW ? 'login' : 'password';
              return; // do not resolve/reject
            }
            if (r.status === 400) {
              dette.ShowSpinner = false;
              dette.ErrorText = await r.text();
              dette.$refs.ModalError.Show();
              return; // do not resolve/reject
            }
            dette.LoggedIn = true;
            resolve(r);
          });
      },
      ShowToast(txt) {
        this.ToastText = txt;
        this.$options.MyToast.show();
      },
      ErrorTextEnc() {
        return this.ErrorText.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('\n').join('<br/>');
      },
      async HashChanged() {
        let h = window.location.hash;
        if (h.length <= 1) {window.location.hash = 'repolist'; return;}
        h = h.substr(1).toLowerCase();
        if (h === 'logout') {
          this.ShowSpinner = true;
          await this.ApiFetch('logout', { method: 'POST' });
          this.ShowSpinner = false;
          this.LoggedIn = false;
          window.location.hash = 'login';
          return;
        }
        let i = h.indexOf('/');
        if (i > 0) {
          this.ItemID = parseInt(h.substr(i + 1));
          h = h.substr(0,i);
        }
        if (['login', 'repolist', 'accountlist', 'repo', 'account', 'settings', 'password'].indexOf(h) < 0) { window.location.hash = 'repolist'; return; };
        this.Page = h;
      }
    },
    mounted() {
      this.$options.MyToast = new bootstrap.Toast(this.$refs.TheToast);
      window.addEventListener('hashchange', this.HashChanged, false);
      this.HashChanged(); 
    }
}
})();
o.render=function(){with(this){return _c('div',{staticClass:"d-flex flex-column",staticStyle:{"max-width":"960px","margin":"0 auto","min-height":"100vh","background-color":"white"}},[_c('nav',{staticClass:"navbar navbar-expand-md navbar-dark bg-primary sticky-top"},[_c('div',{staticClass:"container-fluid"},[_c('a',{staticClass:"navbar-brand",attrs:{"href":"#"}},[_v("Simple Deploy - "+_s(ServerName))]),_v(" "),(LoggedIn)?[_m(0),_v(" "),_c('div',{staticClass:"collapse navbar-collapse",attrs:{"id":"navbarNav"}},[_c('div',{staticClass:"navbar-nav ms-auto"},[_c('a',{class:'pe-3 nav-link'+(Page==='repolist'?' active':''),attrs:{"href":"#repolist"}},[_v("Repositories")]),_v(" "),_c('a',{class:'pe-3 nav-link'+(Page==='accountlist'?' active':''),attrs:{"href":"#accountlist"}},[_v("Git Service Accounts")]),_v(" "),_c('a',{class:'pe-3 nav-link'+(Page==='settings'?' active':''),attrs:{"href":"#settings"}},[_v("General Settings")]),_v(" "),_c('a',{staticClass:"nav-link",attrs:{"href":"#logout"}},[_v("Log out")])])])]:_e()],2)]),_v(" "),_c('div',{staticClass:"p-3 flex-grow-1"},[(LoggedIn || Page==='login' || Page==='password')?[_c('h1',[_v(_s($options.PageTitle[Page]))]),_v(" "),_c('hr')]:_e(),_v(" "),(Page==='login')?_c('login'):(Page==='password')?_c('password'):(Page==='settings')?_c('settings'):(Page==='repolist')?_c('repolist'):(Page==='repo')?_c('repo',{attrs:{"id":ItemID}}):(Page==='accountlist')?_c('accountlist'):(Page==='account')?_c('account',{attrs:{"id":ItemID}}):_c('div',{staticClass:"spinner-border text-primary",attrs:{"role":"status"}},[_c('span',{staticClass:"visually-hidden"},[_v("Loading...")])]),_v(" "),_c('div',{class:'overlay' + (ShowSpinner?' show':'')},[_c('div',{staticClass:"spinner"})]),_v(" "),_c('bs-modal',{ref:"ModalError",attrs:{"title":"Error"},scopedSlots:_u([{key:"header",fn:function(){return [_c('h5',{staticClass:"text-danger"},[_v("Error")]),_v(" at ")]},proxy:true},{key:"footer",fn:function(){return [_c('button',{staticClass:"btn btn-primary",staticStyle:{"min-width":"85px"},attrs:{"type":"button","data-bs-dismiss":"modal"}},[_c('icon',{attrs:{"name":"check"}}),_v(" OK")],1)]},proxy:true}])},[_v(" "),[_c('div',{domProps:{"innerHTML":_s(ErrorTextEnc())}})]],2),_v(" "),_c('div',{staticClass:"toast-container position-absolute top-0 end-0 p-3",staticStyle:{"z-index":"1100"}},[_c('div',{ref:"TheToast",staticClass:"toast hide bg-success text-white",attrs:{"role":"alert","aria-live":"assertive","aria-atomic":"true"}},[_c('div',{staticClass:"d-flex"},[_c('div',{staticClass:"toast-body"},[_c('icon',{attrs:{"name":"check"}}),_v(" "+_s(ToastText)+" ")],1),_v(" "),_c('button',{staticClass:"btn-close btn-close-white me-2 m-auto",attrs:{"type":"button","data-bs-dismiss":"toast","aria-label":"Close"}})])])])],2),_v(" "),_c('nav',{staticClass:"navbar navbar-dark bg-primary justify-content-center"},[_c('div',{staticClass:"navbar-nav flex-row"},[_c('span',{staticClass:"navbar-text"},[_v("Simple Deploy v. "+_s(SDVer))]),_v(" "),_c('span',{staticClass:"navbar-text px-3"},[_v("•")]),_v(" "),_c('span',{staticClass:"navbar-text"},[_v("© 2021")]),_v("  "),_c('a',{staticClass:"nav-link",attrs:{"href":"https://jesperhoy.dev","target":"_blank"}},[_v("Jesper Høy")]),_v(" "),_c('span',{staticClass:"navbar-text px-3"},[_v("•")]),_v(" "),_c('a',{staticClass:"nav-link",attrs:{"href":"https://simpledeploy.jesperhoy.dev","target":"_blank"}},[_v("Offical Website")]),_v(" "),_c('span',{staticClass:"navbar-text px-3"},[_v("•")]),_v(" "),_c('a',{staticClass:"nav-link",attrs:{"href":"https://github.com/jesperhoy/SimpleDeploy","target":"_blank"}},[_v("GitHub")])])])])}};
o.staticRenderFns=[function(){with(this){return _c('button',{staticClass:"navbar-toggler",attrs:{"type":"button","data-bs-toggle":"collapse","data-bs-target":"#navbarNav","aria-controls":"navbarNav","aria-expanded":"false","aria-label":"Toggle navigation"}},[_c('span',{staticClass:"navbar-toggler-icon"})])}}];
return o;
})());