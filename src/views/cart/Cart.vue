<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>

    <!-- 商品列表 -->
    <scroll class="content" ref="scroll">
      <cart-list />
    </scroll>

    <!-- 底部汇总 -->
    <cart-bottom-bar />
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import Scroll from '../../components/common/scroll/Scroll'

  import CartList from './childComps/CartList.vue'
  import CartBottomBar from './childComps/CartBottomBar.vue'

  import {mapGetters} from 'vuex'


  export default {
    name: 'Cart',
    components: {
      NavBar,
      CartList,
      Scroll,
      CartBottomBar,
    },
    computed: {
      // mapGetters 辅助函数仅仅是将store中的getter映射到局部计算属性
      // 两种语法
      // 第一种 数组
      // ...mapGetters(['cartLength', 'cartList'])
      // 第二种 对象映射
      ...mapGetters({
        length: 'cartLength',
      })
    },
    activated() {
      // 添加到购物车后进行刷新
      this.$refs.scroll.refresh()
    },
  }
</script>

<style scoped>
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
  }
  .content {
    height: calc(100vh - 93px - 40px);
    overflow: hidden;
  }
</style>
