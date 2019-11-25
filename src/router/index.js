import Vue from 'vue'
import VueRouter from 'vue-router'
import Ebook from '../views/ebook/index'
import EbookReader from '../components/ebook/EbookReader'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/ebook'
  },{
    path: '/ebook',
    name: 'Ebook',
    component: Ebook,
    children: [{
      path: ':fileName',
      name: 'EbookReader',
      component: EbookReader
    }]
  }
]

const router = new VueRouter({
  routes
})

export default router
