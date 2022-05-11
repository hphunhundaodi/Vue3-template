import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { beforeEach, afterEach } from './guard'

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

router.beforeEach(beforeEach)
router.afterEach(afterEach)

export default router
