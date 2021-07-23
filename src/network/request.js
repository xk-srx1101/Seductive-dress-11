import axios from 'axios'

export function request(config) {

    // 1.创建axios的实例
    const instance = axios.create({
      baseURL: 'http://152.136.185.210:7878/api/m5',
      timeout: 5000,
    })

    // 2.axios拦截器
    // 全局
    // axios.interceptors
    //局部
    // 2.1请求拦截
    instance.interceptors.request.use(config => {
      return config; //拦截后，一定要把它返回
    }, err => {
      // console.log(err);
    });

    // 2.2响应拦截
    instance.interceptors.response.use(res => {
      return res.data
    }, err => {
      console.log(err);
    })

    // 发送真正的网络请求
    return instance(config)
}

