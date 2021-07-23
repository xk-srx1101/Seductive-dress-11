<template>
  <div class="cart-list">
    <!-- <scroll class="content"> -->
      <!-- <li v-for="(item, index) in cartList" :key="index">{{item}}</li> -->
      <cart-list-item
        v-for="(item, index) in cartList"
        :key="index"
        :product="item"/>
    <!-- </scroll> -->
  </div>
</template>

<script>
  // import Scroll from 'components/common/scroll/Scroll'
  import CartListItem from './CartListItem.vue'

  import {mapGetters} from 'vuex'

  export default {
    name: 'CartList',
    components: {
      CartListItem,
      // Scroll,

    },
    computed: {
      ...mapGetters(['cartList'])
    }
  }
</script>

<style scoped>
  /* .cart-list {
    height: 100vh;
  }
  .content {
    height: calc(100vh - 93px);
    overflow: hidden;
  } */
</style>
