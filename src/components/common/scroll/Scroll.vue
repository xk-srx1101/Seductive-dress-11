<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: 'Scroll',
    props: {
      // 监听位置
      probeType: {
        type: Number,
        defaolt: 0
      },
      // 上拉加载
      pullUpLoad: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        scroll: null
      }
    },
    mounted() {
      // 1.创建BScroll对象
      this.scroll = new BScroll(this.$refs.wrapper, {
        // 确定连接能点击
        click: true,
        // probe 侦测
        // 3 只要滚动都侦测
        // probeType: 3
        // 动态传入是否需要动态监听位置值
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad,
      })
      // 2.监听滚动的位置
      if (this.probeType === 2 || this.probeType ===3) {
        this.scroll.on('scroll', (position) => {
          // console.log(position);
          this.$emit('scroll', position)
        })
      }
      // 根据最新的 各种子组件 重新计算高度
      this.scroll.refresh()
      
      // 3.监听上拉加载事件
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
        // console.log('上拉加载更多');
        // 延迟500 ms
        setTimeout(() => {
          this.$emit('pullingUp')
        }, 500)
       })
      }
    },
    methods: {
      scrollTo(x, y, time) {
        this.scroll && this.scroll.scrollTo(x, y, time)
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      }
    },
  }
</script>

<style scoped>

</style>
