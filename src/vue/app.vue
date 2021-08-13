<template>

  <div style="max-width:960px;margin:0 auto;min-height:100vh;background-color:white;" class="d-flex flex-column">

    <nav class="navbar navbar-expand-md navbar-dark bg-primary sticky-top">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Simple Deploy - {{ServerName}}</a>

        <template v-if="LoggedIn">

          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarNav">
            <div class="navbar-nav ms-auto">
              <a :class="'pe-3 nav-link'+(Page==='repolist'?' active':'')" href="#repolist">Repositories</a>
              <a :class="'pe-3 nav-link'+(Page==='accountlist'?' active':'')" href="#accountlist">Git Service Accounts</a>
              <a :class="'pe-3 nav-link'+(Page==='settings'?' active':'')" href="#settings">General Settings</a>
              <a class="nav-link" href="#logout">Log out</a>
            </div>
          </div>

        </template>
      </div>
    </nav>

    <div class="p-3 flex-grow-1" >

      <!--<script>
      setTimeout(function () { window.location.href = 'login.aspx' }, <%=Session.Timeout * 60000 %>);
    </script>-->

      <template v-if="LoggedIn || Page==='login' || Page==='password'">
        <h1>{{$options.PageTitle[Page]}}</h1>
        <hr />
      </template>

      <login v-if="Page==='login'" />
      <password v-else-if="Page==='password'" />
      <settings v-else-if="Page==='settings'" />
      <repolist v-else-if="Page==='repolist'" />
      <repo v-else-if="Page==='repo'" :id="ItemID" />
      <accountlist v-else-if="Page==='accountlist'" />
      <account v-else-if="Page==='account'" :id="ItemID" />
      <div v-else class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>


      <div :class="'overlay' + (ShowSpinner?' show':'')">
        <div class="spinner"></div>
      </div>

      <bs-modal title="Error" ref="ModalError">
        <template #header>
          <h5 class="text-danger">Error</h5>
          at
        </template>
        <template>
          <div v-html="ErrorTextEnc()"></div>
        </template>
        <template #footer>
          <button class="btn btn-primary" style="min-width:85px" type="button" data-bs-dismiss="modal"><icon name="check" /> OK</button>
        </template>
      </bs-modal>

      <div class="toast-container position-absolute top-0 end-0 p-3" style="z-index:1100">
        <div class="toast hide bg-success text-white" role="alert" aria-live="assertive" aria-atomic="true" ref="TheToast">
          <div class="d-flex">
            <div class="toast-body">
              <icon name="check" />
              {{ToastText}}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      </div>

    </div>



    <nav class="navbar navbar-dark bg-primary justify-content-center" >
      <div class="navbar-nav flex-row">
        <span class="navbar-text">Simple Deploy v. {{SDVer}}</span>
        <span class="navbar-text px-3">&bull;</span>
        <span class="navbar-text">&copy; 2021</span>&nbsp;
        <a class="nav-link" href="https://jesperhoy.dev" target="_blank">Jesper Høy</a>
        <span class="navbar-text px-3">&bull;</span>
        <a class="nav-link" href="https://simpledeploy.dev" target="_blank">Offical Website</a>
        <span class="navbar-text px-3">&bull;</span>
        <a class="nav-link" href="https://github.com/jesperhoy/SimpleDeploy" target="_blank">GitHub</a>
      </div>
</nav>



  </div>
</template>

<script>
  export default {
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
</script>