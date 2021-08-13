<template>

  <div v-if="Accts===null" class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>

  <div v-else>
    <table v-if="Accts.length>0" class="table w-auto">
      <tbody>
        <tr>
          <th colspan="2"></th>
          <th style="padding-right:1rem">Service</th>
          <th>Login ID</th>
        </tr>
        <tr v-for="acct in Accts">
          <td><a :href="'#account/'+acct.id" class="link-primary" title="Edit"><icon name="edit" /></a></td>
          <td><a href="#" @click.prevent="ClickDelete(acct.id)" class="link-danger" title="Delete"><icon name="trash" /></a></td>
          <td style="padding-right:1rem">{{acct.service}}</td>
          <td>{{acct.loginid}}</td>
        </tr>
      </tbody>
    </table>

    <p v-else style="margin:1rem 0">[List is empty]</p>

    <p><a href="#account/0" class="btn btn-primary"><icon name="add" /> New Account</a></p>

    <bs-modal title="Delete Git Service Account?" ref="ModalDelete">
      <template>
        Are you sure that you want to delete the "{{DeleteAcct ? (DeleteAcct.service + ' / ' + DeleteAcct.loginid) : ''}}" account?
      </template>
      <template #footer>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-danger" @click="ClickDelete2()"><icon name="trash"/> Delete</button>
      </template>
    </bs-modal>

  </div>

</template>

<script>
  export default {
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

}
</script>