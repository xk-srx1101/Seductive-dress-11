<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">媚媚服饰</div></nav-bar>
    <tab-control
        :title="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl1"
        class="tab-control"
        v-show="isTabFixed" />

    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentscroll"
      :pull-up-load="true" @pullingUp="loadMore">
        <home-swiper
          :banners="banners"
          @swiperImageLoad="swiperImageLoad" v-if="banners.length">
        </home-swiper>
        <home-recommend-view :recommends="recommends"></home-recommend-view>
        <home-feature-view></home-feature-view>

        <tab-control
          :title="['流行', '新款', '精选']"
          @tabClick="tabClick"
          ref="tabControl2" />

        <!-- <goods-list :goods="goods[currentType].list"></goods-list> -->
        <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <!-- 组件不能直接监听点击 若需要 添加.native-->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>

  import HomeSwiper from './childComps/HomeSwiper'
  import HomeRecommendView from './childComps/HomeRecommendView'
  import HomeFeatureView from './childComps/HomeFeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import Scroll from 'components/common/scroll/Scroll'

  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import GoodsListItem from 'components/content/goods/GoodsListItem'
  // import BackTop from 'components/content/backTop/BackTop'

  import {getHomeMultidata, getHomeGoods} from 'network/home'

  import {itemListenerMixin, backTopMixin} from 'common/mixin'

  export default {
    name: 'Home',
    components: {
      HomeSwiper,
      HomeRecommendView,
      HomeFeatureView,
      NavBar,
      Scroll,
      TabControl,
      GoodsList,
      GoodsListItem,
      // BackTop,
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        // 定义个变量将请求的数据保存 初始化为null
        // result: null
        //存具体数据
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        // isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
        // itemImgListener: null,
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY, 0);
      this.$refs.scroll.refresh();
    },
    deactivated() {
      // 1.保存y值
      this.saveY = this.$refs.scroll.scroll.y;

      // 2.取消全局事件的监听
      this.$bus.$off('itemImgLoad', this.itemImgListener)
    },
    // 生命周期函数 创建完后马上执行
    created() {
      // 1.请求多个数据 加this 才是methods中第一个封装
      this.getHomeMultidata()
      // 2.请求商品数据
      this.getHomeGoods('pop')

      this.getHomeGoods('new')

      this.getHomeGoods('sell')

    },
    mounted() {
      // 防抖
      // const refresh = debounce(this.$refs.scroll.refresh, 50)
      // // 3.item中图片加载完成
      // // 对监听的事件进行保存
      // this.itemImgListener = () => {
      //   // console.log('-------'); // 30次 以至于下面的会调用很多次
      //   refresh()
      // }
      // this.$bus.$on('itemImageLoad', this.itemImgListener)
    },
    methods: {
      /**
       * 事件监听的方法
       */
      //  防抖函数  debounce(func, delay) 函数   时间
      debounce(func, delay) {
        let timer = null

        return function (...args) {
          if (timer)  clearTimeout(timer)

          timer = setTimeout(() => {
            func.apply(this, args)
          }, delay)
        }
      },
      tabClick(index) {
        // console.log(index);
        switch (index) {
          case 0:
            this.currentType = 'pop';
            break;
          case 1:
            this.currentType = 'new';
            break;
          case 2:
            this.currentType = 'sell';
            break;
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      // backClick() {
      //   // 500ms 内回到顶部
      //   this.$refs.scroll.scrollTo(0, 0, 500)
      // },
      contentscroll(position) {
        // 1.判断backTop是否显示
        // console.log(position);
        this.isShowBackTop = (-position.y) > 1000

        // 2.决定tabControl是否吸顶(position: fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        // console.log('加载更多');
        this.getHomeGoods(this.currentType);
        // 重新计算可滑动高度
        this.$refs.scroll.scroll.refresh();
      },
      swiperImageLoad() {
        // 获取tabControl的offsetTop值
        // 所有的组件都有一个属性$el，用于获取组件中的元素
        // console.log(this.$refs.tabControl.$el.offsetTop);
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },
      /**
       * 网络请求相关的方法
       */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1;
        getHomeGoods(type, page).then(res => {
        // console.log(res);
          // this.goods[type].list = this.goods[type].list.push(res.data.list);
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1;

          // 上拉加载
          this.$refs.scroll.finishPullUp()
        })
      },

    },
  }
</script>

<style scoped>
  /* scoped 作用域 只在当前组件生效*/
  #home {
    height: 100vh;
    position: relative;
  }
  .home-nav {
    color: #fff;
    background-color: var(--color-tint);
    /* 粘性定位 */
    /* position: sticky; */
    /* position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9; */
  }
  /* 法1 */
  /* 动态计算高度 */
  /* .content {
    height: calc(100vh - 93px);
    overflow: hidden;
  } */
  /* 法2 */
  .content {
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
    overflow: hidden;
  }
  .tab-control {
    position: relative;
    z-index: 9;
  }
</style>
