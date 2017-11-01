#项目描述
##仿MONO社区APP：
>1、基于vue-cli搭建的MONO App项目，对推荐页，发现页，社区页，个人主页等页面的还原，并利用vue-router实现了路由跳转；
>
>2、推荐页有4个子页面，实现了左右滑屏的效果；
>
>3、早午茶的页面实现了懒加载、下拉刷新、上拉加载、收藏、点赞和音乐播放功能，点击栏目标题进入二级子页面；
>
>4、发现页实现了图书搜索功能；
>
>5、个人主页使用vux库中的Actionsheet实现了弹框功能；
>
>6、使用nodejs写了一些接口，部分数据在nodejs请求，一些数据用axios请求；
>
>7、技术栈：vue、vue-router 、vuex、vux、better-scroll、axios、jsonp；

>8、该项目主要参考手机中MoNo这个App,采用单页应用，实现了前后端分离，部分数据从后台获取，并实现了上滑刷新，下拉加载，划屏切换页面内容以及播放音乐等功能；


#遇到的问题及解决方法
##1.
###问题：
>使用better-scroll做页面滚动时发现不能滚动
###解决：
>**1.样式**
>
当子元素的高度（宽度）超过了父元素的高度（宽度），才可以滚动，所以注意给父元素定高（宽）

>**2.注意初始化 better-scroll的时机**
>
>要在better-scroll所控制区域的DOM 已经渲染了之后，才可以正确计算它以及它内层 content 的高度。要在 mounted 这个钩子函数里，this.$nextTick 的回调函数中初始化 better-scroll。

	mounted() { 
		this.$nextTick(() => { 
			this.scroll = new Bscroll(this.$refs.wrapper, {}) 
		}) 
	}
this.$nextTick 是一个异步函数，为了确保 DOM 已经渲染

##2.
###问题：
>音乐播放器进度条的宽度计算
###解决：
>**calc()方法**：用于动态计算长度值。
>
你可以给一个div元素，使用百分比、em、px和rem单位值计算出其宽度或者高度，比如说“width:calc(50% + 2em)”，这样一来你就不用考虑元素DIV的宽度值到底是多少，而把这个烦人的任务交由浏览器去计算。

##3.
###问题：
>向已经存在的对象上添加新的属性，使用这个属性的值（数组）渲染页面，在控制台console.log发现该数组确实有内容，但是视图并不能根据该数组正常渲染，反而会报错
###分析：
>查手册得知因为Vue不能检测对象属性的添加或删除，也就是说Vue能监控的是一开始就写在data里的状态，对于已经创建的实例，Vue不能检测到动态地新添加的属性的变化；
https://cn.vuejs.org/v2/guide/reactivity.html
当我们添加属性并赋值时，Vue并不能检测到对象中属性的添加或者删除，但是其的确是添加或删除了，故我们可以通过console看到变化，但是视图不会响应这些变化
###解决：
>可以使用 Vue.set(object, key, value) 方法向已经存在的对象添加响应式属性。


##4.
###问题：
>页面根据数据正确渲染了，但是控制台依旧报错
###分析：
>用jsonp或者ajax请求数据时，请求和返回数据需要时间，在这段时间里，视图没有数据可渲染，所以会报错，之后拿到数据，视图才正确渲染

###解决：
>用v-if，等到有数据了再渲染结构，就不会报错了


##5.
###问题：
>使用vue的第三方组件vux总是报 _vm.$t is not a function的错误
###解决：
>(1)在main.js文件里引入vuex 和 vuexI18n 插件并引用即可，并且安装 yaml-loader 以正确进行语言文件读取;

	import vuexI18n from 'vuex-i18n';
 	Vue.use(vuexI18n.plugin, store);
 	const translationsEn = { "content": "This is some {type} content" };
 	Vue.i18n.add('en', translationsEn);

>(2)在store中的index.js中配置以下代码即可;

	import vuexI18n from 'vuex-i18n';
	const store = new Vuex.Store({ modules: { i18n: vuexI18n.store } });

##6.
###问题：
>在测试后台接口时，开启后台服务，前端发送请求时会报错
###解决：
>在网上百度查询后得知是跨域引起的问题，添加一系列请求头，重启服务后问题解决成功拿到数据 

	app.use((req, res, next) => { 
		res.header("Access-Control-Allow-Origin", "*"
	);
 	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header("Access-Control-Allow-Headers", "X-Requested-With"); 
	res.header('Access-Control-Allow-Headers', 'Content-Type'); next(); })

##7.
###问题：
>采用单页应用，点击头部导航栏content中对应不同的组件，由于页面中的数据要从后台请求过来，在一开始的时候把发送请求放到点击事件里，这样数据可以请求到，结构也可以正常渲染，但是一刷新页面就挂了，原因是路由中配置的是history模式，页面刷新后路径还是刷新前的路径，路径没有错但是数据没有了，引发了控制台一串报错。
###解决：
>将发送获取每个页面数据的请求放到对应的组件里，在mounted这个钩子函数中调用，这样就保证了刷新页面后数据、结构与页面保持一定的效果。




















##难点：
###1.
首页推送的众多音乐，每首音乐有一个小播放条，点击按钮均可播放，但同一时间只能播放一首音乐，歌曲信息同步到播放器详情页

###解决：
数据驱动，每首音乐推送是由数据渲染的，在每条数据里添加isPlay状态（true或false），每个小播放条的播放状态由该状态控制


