<template>

  <div v-if="settings===null" class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>

  <form v-else @submit.prevent="Submit()" ref="theform">

    <table class="form">
      <tbody>
        <tr>
          <th>Admin password:</th>
          <td class="pad"><a href="#password">Change</a></td>
        </tr>

        <tr>
          <th>Server name:</th>
          <td>
            <input v-model.trim="settings.servername" type="text" autofocus required class="form-control" />
          </td>
        </tr>

        <tr>
          <th>Redirect UI to SSL:</th>
          <td class="pad">
            <bs-checkbox v-model="settings.forcessl" />
          </td>
        </tr>

        <tr>
          <th>Git.exe location:</th>
          <td>
            <input v-model.trim="settings.gitexeloc" @input="$event.target.setCustomValidity('')" type="text" autofocus ref="gitexeloc" class="form-control" />
            <small>Leave blank to use default locations. Download Git from <a href="http://git-scm.com/downloads" target="_blank">http://git-scm.com/downloads</a>.</small>
          </td>
        </tr>

        <tr>
          <th>Notes:</th>
          <td><textarea v-model.trim="settings.notes" rows="3" class="form-control"></textarea></td>
        </tr>

      </tbody>
    </table>

    <button type="submit" class="btn btn-primary"><icon name="check" /> Update</button>

  </form>

</template>

<script>
  export default {
    data() {
      return {
        settings: null
      }
    },
    methods: {
      async Submit() {
        if (this.settings.gitexeloc.length > 0 && !this.settings.gitexeloc.toLowerCase().endsWith('\\git.exe')) {
          this.$refs.gitexeloc.setCustomValidity('Must end in \'\\git.exe\'');
          this.$refs.theform.reportValidity();
          return;
        }
        this.$root.ShowSpinner = true;
        let r = await this.$root.ApiFetch('settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.settings)
        });
        this.$root.ServerName = this.settings.servername;
        this.$root.ShowSpinner = false;
        this.$root.ShowToast("Settings updated successfully");
      }
    },
    async mounted() {
      let r = await this.$root.ApiFetch('settings');
      this.settings = await r.json();
    }
}
</script>