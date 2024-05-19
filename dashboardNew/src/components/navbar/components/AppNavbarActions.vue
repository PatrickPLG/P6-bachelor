<template>
  <div class="app-navbar-actions" >
<!--
    <NotificationDropdown class="app-navbar-actions__item" />
-->
  </div>
</template>

<script lang="ts" setup>
import NotificationDropdown from './dropdowns/NotificationDropdown.vue'
</script>

<style lang="scss">
.app-navbar-actions {
  display: flex;
  align-items: center;

  &__item {
    padding: 0;
    margin-left: 0.25rem;
    margin-right: 0.25rem;

    svg {
      height: 20px;
    }

    .va-dropdown-content {
      background-color: var(--va-white);
    }

    @media screen and (max-width: 640px) {
      margin-left: 0;
      margin-right: 0;

      &:first-of-type {
        margin-left: 0;
      }
    }
  }


}
</style>
