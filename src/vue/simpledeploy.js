
Vue.directive('validity', function (el, binding) {
  el.setCustomValidity(binding.value);
})

// @prepros-append tmp/bs-checkbox.js 
// @prepros-append tmp/bs-radio.js
// @prepros-append tmp/bs-modal.js 

// @prepros-append tmp/password.js
// @prepros-append tmp/login.js
// @prepros-append tmp/settings.js
// @prepros-append tmp/repolist.js
// @prepros-append tmp/repo.js 
// @prepros-append tmp/accountlist.js 
// @prepros-append tmp/account.js
// @prepros-append tmp/icon.js
// @prepros-append tmp/app.js
