<template>

  <div v-if="Repos===null" class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>

  <div v-else>
    <table v-if="Repos.length>0" class="table w-auto">
      <tbody>
        <tr>
          <th colspan="2"></th>
          <th style="padding-right:1rem">ID</th>
          <th style="padding-right:1rem">Name</th>
          <th style="padding-right:1rem">Last pull</th>
          <th style="padding-right:1rem">Result</th>
          <th>Status</th>
        </tr>
        <tr v-for="r in Repos">
          <td><a :href="'#repo/'+r.id" class="link-primary" title="Edit"><icon name="edit" /></a></td>
          <td><a href="#" @click.prevent="ClickDelete(r.id)" class="link-danger" title="Delete"><icon name="trash" /></a></td>
          <td style="padding-right:1rem">{{r.id}}</td>
          <td style="padding-right:1rem">{{r.name}}</td>
          <td style="padding-right:1rem">{{FormatTime(r.lasttime)}}</td>
          <td v-if="r.lastres===1" class="text-success" style="padding-right:1rem">
            <icon style="width:1.5rem;height:1.5rem;vertical-align:middle" name="check" />
            Success
          </td>
          <td v-else-if="r.lastres===0" class="text-danger" style="padding-right:1rem">
            <icon style="width:1.5rem;height:1.5rem;vertical-align:middle" name="error" />
            Failed
          </td>
          <td v-else style="padding-right:1rem">-</td>
          <td>
            <a v-if="r.lasttime>0" @click.prevent="ClickStatus(r)" href="#">Status</a>
            <span v-else>-</span>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else style="margin:1rem 0">[List is empty]</p>

    <p><a href="#repo/0" class="btn btn-primary"><icon name="add" /> New Repository</a></p>


    <bs-modal size="lg" title="Repository Status" ref="ModalStatus">
      <template>
        <table v-if="StatusRepo" class="form">
          <tbody>
            <tr>
              <th>Repository:</th>
              <td class="pad">{{StatusRepo.name + ' (' + StatusRepo.id + ')'}}</td>
            </tr>
            <tr>
              <th>Last pull:</th>
              <td class="pad">{{FormatTime(State.time)}}</td>
            </tr>
            <tr>
              <th>Trigger:</th>
              <td class="pad">{{State.ui ? 'Management UI' : 'Webhook'}}</td>
            </tr>
            <tr>
              <th>Result:</th>
              <td class="pad">{{State.ok ? 'Success' : 'Failed'}}</td>
            </tr>
            <tr>
              <th>{{State.ok ? 'Output':'Error'}}:</th>
              <td v-html="StatusEnc()" class="pad"></td>
            </tr>
            <tr v-if="!State.ok">
              <th>Last success:</th>
              <td class="pad">{{FormatTime(State.lastsuccess)}}</td>
            </tr>
          </tbody>
        </table>
      </template>
      <template #footer>
        <button class="btn btn-primary" type="button" data-bs-dismiss="modal"><icon name="check" /> OK</button>
      </template>
    </bs-modal>

    <bs-modal title="Delete Repository?" ref="ModalDelete">
      <template>
        Are you sure that you want to delete the "{{DeleteRepo ? DeleteRepo.name:''}}" repository?
        <br />
        <br />
        Note: This will NOT delete the repository's output directory.
      </template>
      <template #footer>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-danger" @click="ClickDelete2()"><icon name="trash" /> Delete</button>
      </template>
    </bs-modal>

  </div>

</template>

<script>
  export default {
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
}
</script>