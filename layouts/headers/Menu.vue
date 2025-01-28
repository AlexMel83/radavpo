<template>
  <div class="menu-group">
    <ul class="menu-list">
      <li>
        <NuxtLink class="hover:text-primary-300" to="/">{{
          $t('menu.home')
        }}</NuxtLink>
      </li>
      <li>
        <NuxtLink class="hover:text-primary-300" to="/about">{{
          $t('menu.about')
        }}</NuxtLink>
        <ul class="submenu">
          <li>
            <NuxtLink class="hover:text-primary-300" to="/reporting">{{
              $t('menu.reporting')
            }}</NuxtLink>
          </li>
        </ul>
      </li>
      <li>
        <NuxtLink class="hover:text-primary-300" to="/blog">{{
          $t('menu.blog')
        }}</NuxtLink>
      </li>
      <li>
        <NuxtLink class="hover:text-primary-300" to="/resources">{{
          $t('menu.resources')
        }}</NuxtLink>
        <!-- <ul class="submenu">
          <li>
            <NuxtLink to="/housing">{{ $t('menu.housing') }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/employment">{{ $t('menu.employment') }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/support">{{ $t('menu.support') }}</NuxtLink>
          </li>
        </ul> -->
      </li>
      <li>
        <NuxtLink class="hover:text-primary-300" to="/join">{{
          $t('menu.join')
        }}</NuxtLink>
        <!-- <ul class="submenu">
          <li>
            <NuxtLink to="/donate">{{ $t('menu.donate') }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/events">{{ $t('menu.events') }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/volunteer">{{ $t('menu.volunteer') }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/newsletter">{{ $t('menu.newsletter') }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/collaboration">{{
              $t('menu.collaboration')
            }}</NuxtLink>
          </li>
        </ul> -->
      </li>
    </ul>
  </div>
</template>

<script setup>
// Здесь можно добавить пропсы, если необходимо
</script>

<style scoped>
.menu-list {
  display: flex;
  justify-content: space-around;
  padding: 0;
  margin: 0;
  list-style-type: none;
}

.menu-list > li {
  position: relative;
  margin: 0 20px;
}

.menu-list a {
  text-decoration: none;
  /* color: var(--text-color); */
  padding: 10px 15px;
  display: inline-block;
  transition:
    color 0.3s ease,
    background-color 0.3s ease;
}

.submenu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  padding: 0;
  margin: 0;
  list-style-type: none;
}

.menu-list > li:hover .submenu {
  display: block;
}

.submenu li {
  margin: 0;
}

.submenu a {
  padding: 0px 20px;
  white-space: nowrap;
}
</style>
