import {debounce} from "./utils"
import BackTop from 'components/content/backTop/BackTop'

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
    }
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 50)
    this.itemImgListener = () => {
      // console.log('-------'); // 30次 以至于下面的会调用很多次
      refresh()
    }
    this.$bus.$on('itemImgLoad', this.itemImgListener)
    // console.log('我是混入的内容');
  },
}
export const backTopMixin = {
  components: {
    BackTop,
  },
  data() {
    return {
      isShowBackTop: false,
    }
  },
  methods: {
    backClick() {
      // 500ms 内回到顶部
      this.$refs.scroll.scrollTo(0, 0, 500)
    },
  },
}
