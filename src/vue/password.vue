<template>

    <form @submit.prevent="FormSubmit()" ref="theform">
      <table class="form">
        <tbody>
          <tr v-if="$root.HasPW">
            <th>Current password:</th>
            <td>
              <input type="password" v-model.trim="CurPW" @input="$event.target.setCustomValidity('')" required autofocus style="max-width: 200px" ref="curpw" class="form-control" />
            </td>
          </tr>
          <tr>
            <th>New password:</th>
            <td>
              <input type="password" v-model.trim="NewPW1" required minlength="8" :autofocus="!$root.HasPW" style="max-width: 200px" class="form-control" />
            </td>
          </tr>
          <tr>
            <th>Repeat new password:</th>
            <td>
              <input type="password" v-model.trim="NewPW2" @input="$event.target.setCustomValidity('')" required minlength="8" style="max-width: 200px" ref="pw2" class="form-control" />
            </td>
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
        CurPW: '',
        NewPW1: '',
        NewPW2: ''
      }
    },
    methods: {
      async FormSubmit() {
        if (this.NewPW1 !== this.NewPW2) {
          this.$refs.pw2.setCustomValidity("Not repeated correctly");
          this.$refs.theform.reportValidity();
          return;
        }
        this.$root.ShowSpinner = true;
        let r = await this.$root.ApiFetch('pw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cur: this.CurPW, new: this.NewPW1 })
        });
        this.$root.ShowSpinner = false;
        if (r.status === 400) {
          this.$refs.curpw.setCustomValidity("Incorrect current password");
          this.$refs.theform.reportValidity();
          return;
        }
        this.$root.LoggedIn = true;
        this.$root.ShowToast('Admin password changed successfully');
        window.location.hash = this.$root.HasPW ? 'settings' : 'repolist';
        this.$root.HasPW = true;
      }
    }
}
</script>