<template>
<!-- 所有的item都展示一个图片，一个文字 -->
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive">
      <slot name="item-icon"></slot>
      </div>
    <div v-else>
      <slot name="item-icon-active"></slot>
      </div>
    <div :style="activeStyle">
      <slot name="item-text"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TabBarItem',
    props: {
      path: String,
      // 用户可以自己设置颜色，但默认颜色是#fb7d95
      activeColor: {
        type: String,
        default: '#fb7d95'
      }
    },
    data() {
      return {
        // isActive: true
      }
    },
    computed: {
      isActive() {
        //$route 哪个路由处于活跃 就是哪个对象
        //indexOf(this.path) 判断活跃的path里有没有这个path
        // /home -> item1(/home) = true
        // /home -> item2(/category) = false
        // /home -> item3(/cart) = false
        // /home -> item4(/profile) = false
        return this.$route.path.indexOf(this.path) !== -1
      },
      activeStyle() {
        return this.isActive ? {color: this.activeColor} : {}
      }
    },
    methods: {
      itemClick() {
        //.catch((error) => error) 解决双击报错this.$router.replace(this.path).catch((error) => error)
        this.$router.replace(this.path);
      }
    },
  }
</script>

<style scoped>
  .tab-bar-item {
    /* 均等分 */
    flex: 1;
    text-align: center;
    height: 49px;
    font-size: 14px;
  }
  .tab-bar-item img {
    width: 24px;
    height: 24px;
    margin-top: 3px;
    /* 去除图片、文字之间的空隙 */
    vertical-align: middle;
    margin-bottom: 2px;
  }
  /* .active {
    color: #fb7d95;
  } */
</style>
