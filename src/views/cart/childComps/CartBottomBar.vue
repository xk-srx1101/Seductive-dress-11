<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button
        :is-checked="isSelectAll"
        class="check-button"
        @click.native="checkClick"/>
      <span>全选</span>
    </div>
    <div class="price">
      合计：{{totalPrice}}
    </div>
    <div class="calculate" @click="calcClick">
      去结算 ({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from 'components/content/checkButton/CheckButton'

  import {mapGetters} from 'vuex'

  export default {
    name: 'CartBottomBar',
    components: {
      CheckButton,
    },
    computed: {
      ...mapGetters(['cartList']),
      totalPrice() {
        return '￥' + this.cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.price * item.count
        }, 0).toFixed(2)
      },
      checkLength() {
        return this.cartList.filter(item => item.checked).length;
      },
      //是否全部选中
      isSelectAll() {
        //1.使用filter
        // return !(this.cartList.filter(item => !item.checked).length);
        //2.使用find
        // return !this.cartList.find(item => !item.checked);
        //3.普通遍历
        //for ( let item of this.cartList) {
        //if(litem.checked) {
        //return false
        //}
        //}
        //return true
        //}
        if (this.cartList.length === 0) {
          return false;
        } else {
          return !this.cartList.find(item => !item.checked);
        }
        // this.cartList.length === 0 ? false : this.cartList.find(item => !item.checked)
      }
    },
    methods: {
      checkClick() {
        // console.log('----');
        if (this.isSelectAll) { // 全部选中
          this.cartList.forEach(item => item.checked = false)
        } else { // 有部分没选中或者全部没选中
          this.cartList.forEach(item => item.checked = true)
        }
      },
      calcClick() {
        if (!this.isSelectAll) {
          this.$toast.show('请选择购买的商品', 1500)
        }
      }
    },
  }
</script>

<style scoped>
  .bottom-bar {
    display: flex;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    background-color: #eee;
  }
  .check-content {
    display: flex;
    line-height: 40px;
    align-items: center;
    margin-left: 10px;
    width: 70px;
  }
  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }
  .price {
    margin-left: 20px;
    flex: 1;
  }
  .calculate {
    color: #fff;
    width: 90px;
    text-align: center;
    background-color: var(--color-tint);

  }
</style>
