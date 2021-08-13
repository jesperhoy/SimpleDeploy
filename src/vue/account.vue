<template>

  <div v-if="Acct===null" class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>

  <form v-else @submit.prevent="Submit()">
    <table class="form">
      <tbody>
        <tr>
          <th>Internal ID:</th>
          <td class="pad">{{id===0 ? "(click Update button to generate)" : id}}</td>
        </tr>
        <tr>
          <th>Service name:</th>
          <td><input v-model.trim="Acct.service" type="text" required autofocus class="form-control" /></td>
        </tr>
        <tr>
          <th>User/Login ID:</th>
          <td><input v-model.trim="Acct.loginid" type="text" required class="form-control" /></td>
        </tr>
        <tr>
          <th>Password/Token:</th>
          <td>
            <input type="password" v-model="Acct.password" required class="form-control" />
            <small>For GitHub accounts, use a <a href="https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token" target="_blank">personal access token</a> instead of your password here</small>
          </td>
        </tr>
        <tr>
          <th>Notes:</th>
          <td><textarea v-model="Acct.notes" rows="3" class="form-control"></textarea></td>
        </tr>
      </tbody>
    </table>

    <button type="submit" name="button" class="btn btn-primary"><icon name="check" /> Update</button>

  </form>

</template>

<script>
  export default {
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
}
</script>