<template>

    <form @submit.prevent="FormSubmit()" ref="theform">
      <table class="form">
        <tbody>
          <tr>
            <th>User ID:</th>
            <td>
              <input type="text" value="admin" readonly style="max-width: 200px" class="form-control" />
            </td>
          </tr>
          <tr>
            <th>Password:</th>
            <td>
              <input v-model.trim="pw" @input="$event.target.setCustomValidity('')"
                     type="password" name="pw" required autofocus style="max-width: 200px"
                     class="form-control" ref="pw" />
            </td>
          </tr>
        </tbody>
      </table>

      <button type="submit" class="btn btn-primary"><icon name="unlock"/> Log in</button>

    </form>

</template>

<script>
  export default {
    data: function () {
      return {
        pw: ''
      }
    },
    methods: {
      async FormSubmit() {
        this.$root.ShowSpinner = true;
        let r = await this.$root.ApiFetch('login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'text/plain' },
          body: this.pw
        });
        this.$root.ShowSpinner = false;
        this.$root.LoggedIn = true;
        window.location.hash = 'repolist';
      }
    }
}
</script>