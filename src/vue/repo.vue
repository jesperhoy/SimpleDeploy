<template>

  <div v-if="Repo===null || Accounts===null" class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>

  <form v-else @submit.prevent="Submit(false)">

    <table class="form">
      <tbody>
        <tr>
          <th>Internal ID:</th>
          <td class="pad">{{ id === 0 ? "(click Update button to generate)" : id }}</td>
        </tr>

        <tr>
          <th>Name:</th>
          <td>
            <input type="text" v-model.trim="Repo.name" required autofocus class="form-control" />
          </td>
        </tr>

        <tr>
          <th>Git repository URL:</th>
          <td>
            <input type="url" v-model="Repo.giturl" required class="form-control" />
          </td>
        </tr>

        <tr>
          <th>Git account:</th>
          <td>
            <select v-model.number="Repo.account" class="form-select">
              <option value="0">None / Anonymous</option>
              <option v-for="Acct in Accounts" :value="Acct.id">{{Acct.service + " / " + Acct.loginid}}</option>
            </select>
          </td>
        </tr>

        <tr>
          <th>Branch name:</th>
          <td>
            <input type="text" v-model="Repo.branch" required class="form-control" />
          </td>
        </tr>

        <tr>
          <th>Output directory:</th>
          <td>
            <input type="text" v-model="Repo.outdir" required class="form-control" />
          </td>
        </tr>

        <tr>
          <th>Webhook URL:</th>
          <td>
            <table style="width: 100%">
              <tr>
                <td>
                  <input type="text"
                         :value="id === 0 ? '(click Update button to generate)':HookUrl()"
                         :disabled="id===0"
                         :readonly="id>0"
                         ref="hookurl"
                         class="form-control" />
                </td>
                <td v-if="id>0" style="width: 1%">
                  <a href="#" @click.prevent="CopyHookUrl()" class="link-primary" title="Copy"><icon name="copy" /></a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <th>Webhook method:</th>
          <td>
            <select v-model="Repo.hookmethod" class="form-select w-auto">
              <option v-for="m in ['POST', 'PUT', 'GET', '*']" :value="m">{{m === "*" ? "* (Any)" :  m}}</option>
            </select>
          </td>
        </tr>

        <tr>
          <th>Notes:</th>
          <td>
            <textarea name="notes" rows="3" v-model="Repo.notes" class="form-control"></textarea>
          </td>
        </tr>
      </tbody>
    </table>

    <button type="submit" class="btn btn-primary"><icon name="check" /> Update</button>
    <button v-if="id>0" @click.prevent="Submit(true)" type="button" class="btn btn-primary"><icon name="download" /> Pull now</button>

  </form>
</template>

<script>
  export default {
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
}
</script>