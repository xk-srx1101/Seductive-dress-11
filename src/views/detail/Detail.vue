<template>
  <div id="detail">
    <detail-nav-bar @titleClick="titleClick" ref="nav" />
    <scroll class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll">
      <!-- 属性：topImages 传入值：top-images -->
      <detail-swiper :top-images="topImages" v-if="topImages.length" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info :param-info="paramInfo" ref="param" />
      <detail-comment-info :comment-info="commentInfo" ref="comment" />
      <goods-list :goods="recommends" ref="recommend" />
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    <!-- <toast :message="message" :show="show"/> -->
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar';
  import DetailSwiper from './childComps/DetailSwiper';
  import DetailBaseInfo from './childComps/DetailBaseInfo';
  import DetailShopInfo from './childComps/DetailShopInfo';
  import DetailGoodsInfo from './childComps/DetailGoodsInfo';
  import DetailParamInfo from './childComps/DetailParamInfo';
  import DetailCommentInfo from './childComps/DetailCommentInfo';
  import DetailBottomBar from './childComps/DetailBottomBar';

  import Scroll from 'components/common/scroll/Scroll';
  import GoodsList from 'components/content/goods/GoodsList';
  // import Toast from 'components/common/toast/Toast';

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail';

  import {itemListenerMixin, backTopMixin} from 'common/mixin'

  import {debounce} from 'common/utils'

  import {mapActions} from 'vuex'

  export default {
    name: 'Detail',
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList,
      // Toast,
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        // itemImgListener: null,
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
        // message: '',
        // show: false
      }
    },
    methods: {
      //映射这个函数
      ...mapActions(['addCart']),
      imageLoad() {
        this.$refs.scroll.refresh();
        this.getThemeTopY()
      },
      titleClick(index) {
        // console.log(index);
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      },
      contentScroll(position) {
        // console.log(position);
        // 1.获取y值
        const positionY = -position.y

        // 2.positionY 和主题中的值进行对比
        // [0, 3127, 4594, 4792, Number.MAX_VALUE]
        // console.log(Number.MAX_VALUE);
        // positionY 在 0 和 3127 之间， index为0
        // positionY 在 3127 和 4594 之间， index为1
        // positionY 在 4594 和 4792 之间， index为2
        // positionY 在 4792 和 一个非常大的值 之间， index为3

        // positionY 超过 4792， index为3
        let length = this.themeTopYs.length;
        for (let i = 0; i < length - 1; i++) {
          // console.log(i);
          // console.log(this.themeTopYs[i]);
          // 普通作法
          // if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))) {
          //   this.currentIndex = i;
          //   // console.log(this.currentIndex);
          //   this.$refs.nav.currentIndex = this.currentIndex;
          // }

          if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex;
          }

        }
        // 3.是否显示回到顶部
        this.isShowBackTop = (-position.y) > 1000
      },
      //加入到购物车里
      addToCart() {
        // 1.获取购物车需要展示的商品信息
        const product =  {};
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;

        // 2.将商品添加到购物车(1.Promise 2.mapActions)
        //mutations
        // this.$store.commit('addCart', product)
        //actions
        // this.$store.dispatch('addCart', product).then(res => {
        //   console.log(res);
        // })

        this.addCart(product).then(res => {
          // console.log(res);
          // this.show = true;
          // this.message = res;

          // setTimeout(() => {
          //   this.show = false;
          //   this.message = ''
          // }, 1500)

          this.$toast.show(res, 1500)
        })
      }
    },
    created() {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid;

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // console.log(res);
        // 1.获取顶部的图片轮播数据
        const data = res.result;
        this.topImages = data.itemInfo.topImages;

        // 2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);

        // 3.获取商家信息
        this.shop = new Shop(data.shopInfo);

        // 4.获取商品详细信息
        this.detailInfo = data.detailInfo;

        // 5.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule);

        // 6.获取评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0];
        }

        // 第一次获取 值不对
        // this.$refs.param.$el压根没有渲染
        // this.themeTopYs = [];
        // this.themeTopYs.push(0);
        // this.themeTopYs.push(this.$refs.param.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        // console.log(this.themeTopYs);

        // 第二次获取
        // this.$nextTick(() => {
        //   // 根据最新的数据，对于DOM是已经被渲染出来
        //   // 但是图片依然是没有加载完成
        //   // offsetTop值不对的时候，都是图片的问题
        //   this.themeTopYs = [];

        //   this.themeTopYs.push(0);
        //   this.themeTopYs.push(this.$refs.param.$el.offsetTop);
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);

        //   console.log(this.themeTopYs);
        // })

      })

      // 3.请求推荐数据
      getRecommend().then(res => {
        // console.log(res);
        this.recommends = res.data.list
      })

      // 4.给getThemeTopY赋值 并进行防抖
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = [];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.param.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        this.themeTopYs.push(Number.MAX_VALUE);

        // console.log(this.themeTopYs);
      }, 100)
    },
    mounted() {
      // console.log('----');
    },
    destroyed() {
      this.$bus.$off('itemImgLoad', this.itemImgListener)
    },
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content {
    height: calc(100vh - 93px);
    overflow: hidden;
  }
</style>
