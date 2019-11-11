<template>
  <div id="app" class="container">
    <div class="content">
      <div class="section">
        
        <!-- Pass router link :to as dynamic in header -->
        <app-header></app-header>
        <div class="section">
          <transition name="slide-frame" mode="out-in" type="animation" appear>
            <router-view></router-view>
          </transition>
        </div>
        <app-footer></app-footer>
        
      </div>
    </div>
  </div>
</template>

<script>
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';

export default {
  name: 'App',
  components: {
    appHeader: Header,
    appFooter: Footer,
  }
}
</script>

<style lang="less" scoped>
  .section {
    min-height: 70vh
  }

  .slide-frame {
    &-enter {
      opacity: 0;
    }
    &-enter-active {
      animation: slide-in 700ms ease-out forwards;
      transition: opacity 350ms
    }
    &-leave-active {
      animation: slide-out 700ms ease-out forwards;
      transition: opacity 500ms
    }
    &-leave-to {
      opacity: 0;
    }
  }

  @keyframes slide-in {
    from {
      transform: translateY(20px)
    }
    to {
      transform: translateY(0)
    }
  }

  @keyframes slide-out {
    from {
      transform: translateY(0)
    }
    to {
      transform: translateY(20px)
    }
  }
</style>
