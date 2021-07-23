<template>
  <div class="goods">
    <goods-list-item v-for="(item, index) in goods" :key="index" :goodsItem="item"></goods-list-item>
  </div>
</template>

<script>
  import GoodsListItem from './GoodsListItem.vue'
  export default {
    name: 'GoodsList',
    components: {
      GoodsListItem
    },
    // 获取数据
    props: {
      goods: {
        type: Array,
        default() {
          return []
        }
      }
    }
  }
</script>

<style scoped>
  .goods {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }

</style>
