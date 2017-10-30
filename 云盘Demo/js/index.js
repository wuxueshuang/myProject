(function(){
	
	//自适应屏幕高度
	var section = document.querySelector('#section');
	var head = document.querySelector('#head');
	function resize(){
		var clientH = document.documentElement.clientHeight;
		section.style.height = clientH - head.offsetHeight+'px';
	}
	window.onresize = resize;
	resize();



/*------------------------------------数据方法-------------------------------------------*/
	var createBtn = $("#create");//新建文件夹按钮；
	var breadNav = $(".bread-nav")[0];//导航栏；
	var treeMenu = $(".tree-menu")[0];//菜单区域
	var treeMenuTan = $(".tree-menu")[1];//菜单区域
	var folders = $(".folders")[0];//文件夹显示区域
	var fEmpty = $(".f-empty")[0];//没有文件时提示；
	var checkedAll = $(".checkedAll")[0];//全选按钮； 
	var tipBox = $(".full-tip-box")[0];//提示框
	var del = $("#del");//删除文件夹按钮
	var tanbox = $("#tanbox");//删除文件的提醒框
	var confBtn = $(".conf-btn")[0];//控制删除按钮的集合
	var sureDel = $("a",confBtn)[0];//确定删除按钮
	var cancel = $("a",confBtn)[1];//取消删除按钮
	var closeBtn = $(".close-ico")[0];//关闭按钮
	var newfolder = "";//新建的文件夹
	var newId = "";//新生成文件夹的id
	var rename = $("#rename");//重命名按钮
	var tipText = $(".tip-text")[0];//提示内容
	var folderDiv = "";//选中的文件夹
	var removeBtn = $("#remove");//移动按钮
	var tanboxRemove = $("#tanboxRemove");//移动文件的选择层
	var confBtnRemove = $(".conf-btn")[1];//控制移动到按钮的集合
	var sureRemove = $("a",confBtnRemove)[0];//确定移动到按钮
	var cancelRemove = $("a",confBtnRemove)[1];//取消移动到按钮
	var closeBtnRemove = $(".close-ico",tanboxRemove)[0];//关闭按钮
	var removePid = "";//要移动文件夹的父级id，即移动文件夹的pid;
	var removeArrId = [];//存放移动文件夹的id;
	var friendsTips = $(".friendsTips")[0];//移动到条件不满足时的提示；
	var checkedIdAll = [];//选中的文件夹的id；
	var clickId = "";//点击弹出中树形菜单的id;
	var tanTreespans = "";//树形菜单中的span
	var timer = null;
/*---------------------封装的方法------------------------*/
		//通过指定的id找到子集下所有的id；
		function getChildsIdById(id){
			var arr = [];
			for(var attr in data){
				if(data[attr].pid == id){
					arr.push(data[attr].id);
				}
			}
			return arr;	
		}
		
		//向数据中每一项添加一条新数据，child:[child1,child2,...];
		function addDataForData(){
			for(var attr in data){
				data[attr].child = getChildsIdById(data[attr].id);
			}
			return data;
		}

		addDataForData();//通过指定的id找到子集下所有的id；       

		//通过指定的Id找到对应的数据；
		function getDataById(id){
			if(data[id]){
				return data[id];
			}

			return null;
		}
		//找到指定的id下的所有子集；
		function getChildsById(id){
			var arr = [];
			for(var attr in data){
				if(data[attr].pid == id){
					arr.push(data[attr])
				}
			}
			return arr;	
		}

		//通过指定id找到子集的title；
		function getChildsTitleById(id){
			var arr = [];
			for(var attr in data){
				if(data[attr].pid == id){
					arr.push(data[attr].tilte)
				}
			}
			return arr;	
		}

		//通过指定id找到所对应的数据的child属性；
		function getChildsById2(id){
			var arrChildId ="";
			//找到指定id对应的数据；
			if(getDataById(id)){//如果有对应的数据；
				if(getDataById(id).child.length){//如果child里有内容；
					arrChildId = getDataById(id).child;//获取到传入id对应数据的child；
					return arrChildId;//返回子集id的集合；
				}else{//如果child里没有内容；
					return "";
				}
			}else{//如果没有对应数据
				return "";
			}			
		}

		// 找到指定id下所有的子孙数据
		function getChildsAllById(id){
			// 找到这个id的数据
			var item = getDataById(id);
			var arr = [];
			// 把id对应的数据push到数组中
			arr.push(item);
			for(var attr in data){
				if(data[attr].pid == id){
					arr = arr.concat(getChildsAllById(data[attr].id))
				}
			}
			return arr;
		}	
		//通过指定id的数组来获取数据
		function getChildsAllByIDArr(arr){
			var newArr = [];
			for( var i = 0; i < arr.length; i++ ){
				newArr = newArr.concat(getChildsAllById(arr[i]));
			}
			return newArr;
		}

		// 删除指定id下所有的子孙数据
		function deleteDataById(id){
			var childsAll = getChildsAllById(id);

			for( var i = 0; i < childsAll.length; i++ ){
				delete data[childsAll[i].id];
			}

		}	
		var initId = -1;//生成树形菜单传入的Pid;
		var levar = -1;//通过levar来控制树形菜单左边缩进的大小；
		var currentId = 0;  // 当前的目录的id为0		
		function CreatHtml(id,levar){
			// 找到传过来参数id下所有的子级
			var arr = getChildsById(id);
			levar++;			
			var treeMenuHtml = "";
			if(arr.length){
				treeMenuHtml += `<ul>`;
				arr.forEach(function(item){
					// 如果没有下一级，createTreeHtml返回的结构为空
					var html = CreatHtml(item.id,levar);
					treeMenuHtml += `<li>
					<div data-id = "${item.id}" style = "padding-left:${levar*15}px" class="tree-title ${html!=='' ? 'tree-ico':''} close">
					<span data-id = "${item.id}"><i></i><em></em>${item.title}</span>
					</div>`;
					treeMenuHtml += html;
					treeMenuHtml += `</li>`;
				});
				treeMenuHtml +=`</ul>`;
			}
			return treeMenuHtml;
		}
		
		treeMenu.innerHTML = CreatHtml(initId,levar);
/*------------------------------------定位到指定的元素-----------------------------------*/
	var treeDivs = $("div",treeMenu);//树形菜单中所有的div；
	function getPositionById(positionId){
		
		for( var i = 0; i < treeDivs.length; i++ ){
			
			if(treeDivs[i].dataset.id==positionId){
				treeDivs[i].classList.add("active");//给指定Id对应的div添加样式；
				continue;
			}
			treeDivs[i].classList.remove("active");//清除所有的样式
		}
	}
	getPositionById(0);	


/*----------------------------------通过指定Id渲染右边文件区域--------------------------*/
	function createFileHtmlById(id){
		var  chls = getChildsById2(id);//得到的是一个id组成的数组；
		//通过数组中的每一项来获取data中对应的数据；
		var children = [];
		for( var i = 0; i < chls.length; i++ ){
			for(var attr in data){
				if(data[attr].id==chls[i]){
					children.push(data[attr]);
				}
			}		
		}
		if(children.length){
			fEmpty.style.display = "none";
			var foldersHtml  = "";
			children.forEach(function(item){
				foldersHtml +=	`<div class="file-item" data-id = "${item.id}">
									<img src="img/folder-b.png" alt="" />
									<span data-id = "${item.id}" class="folder-name">${item.title}</span>
									<input  type="text" class="editor"/>
									<i></i>
								</div>`;
			});
		}else{
			fEmpty.style.display = "block";
			return ""; 
		}
		
		
		return foldersHtml;
	}
	folders.innerHTML = createFileHtmlById(0);


/*-----------------------------------通过指定Id渲染导航栏-------------------------------*/

	function getParentsById(id){//通过指定Id找到它的祖先节点；父级的父级的父级直到找到微云结束；
		var arr = [];
		for(var attr in data){
			if(data[attr].id == id){
				arr.push(data[attr]);
				arr = arr.concat(getParentsById(data[attr].pid));
				break;
			}
		}
		return arr;
	}
	//通过指定id找到父级；
	function getParentById(id){
		var parentElenment = "";
		for(var attr in data){
			if(data[attr].id == id){
				parentElenment = data[attr];
			}
		}
		return parentElenment;
	}
	//渲染树形菜单结构
	function createNavHtmlById(id){	
		var parents = getParentsById(id).reverse();
		var breadNavHtml = "";
		for( var i = 0; i < parents.length-1; i++ ){
			breadNavHtml+=`<a  data-id = "${parents[i].id}" href="javascript:; ">${parents[i].title}</a>`;
		}
		breadNavHtml += `<span data-id = "${parents[parents.length-1].id}">${parents[parents.length-1].title}</span>`;
		return breadNavHtml;
	}
	breadNav.innerHTML = createNavHtmlById(0);

	//通过指定id渲染导航，树形菜单，文件显示区域的结构；
	function renderById(clickId){
		getPositionById(clickId);//给点击的div添加样式，同时清除其他div的点击样式；
		breadNav.innerHTML = createNavHtmlById(clickId);//渲染导航栏的内容；
		folders.innerHTML = createFileHtmlById(clickId);//渲染文件夹区域的内容；
		checkedAll.classList.remove("checked");	//清除全选按钮的选中样式
		currentId = clickId;
		//console.log(checkedI);
	}

/*--------------------------------树形菜单点击交互------------------------------------*/
	treeDivsClick ();
	function treeDivsClick(){//利用事件委托写菜单的交互；
		treeMenu.onclick = function(ev){
			ev.stopPropagation();
			if(ev.target.nodeName==="SPAN"||ev.target.nodeName==="DIV"){//判断如果是点击到div或者span就添加事件；
				var clickId = ev.target.dataset.id;
				var folderImg = ev.target.getElementsByTagName("em")[0];
				folderImg.style.background = "url(img/s_folder1.png) no-repeat";
				renderById(clickId);
			}
		}
	}
	
/*--------------------------------给导航添加交互--------------------------------------*/
	var  NavA = $("a",breadNav);//导航中所有的A;
	breadNav.onclick = function(ev){
		if(ev.target.nodeName === "A"){
			var clickId = ev.target.dataset.id;
			renderById(clickId);			
		}	

	}
	
/*--------------------------------右侧文件夹区域点击事件------------------------------*/
	var folderDivs = folders.getElementsByClassName("file-item");//获取到当前页面的所有的文件夹；


/*------------------------------------------全选--------------------------------------*/
	var checkedAll = document.querySelector(".checkedAll");//全选按钮
	var checkedI = folders.getElementsByTagName("i");//所有的单选按钮	
	
	on(checkedAll,"click",function(){
			if(getChildsById(currentId).length==0){//判断一下当前页面有没有文件，如果没有文件，全选按钮不可点；
				return;
			}
			var bl =this.classList.toggle("checked");//toggle返回值，如果添加上class是true。如果移除class是false；
			//判断全选按钮的状态
			if(bl){//全选按钮被选中
				for( var i = 0; i < checkedI.length; i++ ){
					checkedI[i].classList.add("checked");//所有的单选按钮同时被选中
					checkedI[i].parentNode.classList.add("hov");//文件夹显示高亮
				}
			}else{
				for( var i = 0; i < checkedI.length; i++ ){
					checkedI[i].classList.remove("checked");//所有的单选按钮都不被选中
					checkedI[i].parentNode.classList.remove("hov");//文件夹取消高亮
				}
			}
	});


/*------------------------------------------单选--------------------------------------*/
	//利用事件委托，把事件绑定在文件夹区域上；
	on(folders,"click",function(ev){
		ev.stopPropagation();//阻止冒泡；
		if(ev.target.nodeName =="I"){
			ev.stopPropagation();//阻止冒泡；
			var target = ev.target;
			var bl = target.classList.toggle("checked");//通过toggle来添加删除checked的class名；
			if(bl){//如果单选按钮被选中
				target.parentNode.classList.add("hov");//文件夹高亮显示
			}else{//如果不被选中
				target.parentNode.classList.remove("hov");//文件夹不显示高亮
			}
		}
		var  getIByChecked = folders.getElementsByClassName("checked");//通过class名获取到所有已经添加上checked单选按钮
		//console.log(checkedI);
		if(checkedI.length==getIByChecked.length){//如果通过checked的class名获取到的单选按钮等于文件区域里所有的单选按钮的数量
			checkedAll.classList.add("checked");//说明所有的单选按钮已经全被选中了，全选按钮同时也要被选中；
		}else{
			checkedAll.classList.remove("checked");//如果不相等，全选按钮不被选中;
		}
	});

/*-----------------------------------点击进入下一级-----------------------------------*/
	on(folders,"click",function(ev){
		ev.stopPropagation();//阻止冒泡；
		var target = ev.target;//获取事件源
		if(target.classList.contains("folders")){//如果点击的是folders本身，直接return；
			ev.stopPropagation();//阻止冒泡；
			return;
		}
		if(target.nodeName =="I"){//如果点击的是单选按钮，不做任何操作，直接return；
			ev.stopPropagation();//阻止冒泡；
			return;
		}				
		if(target.nodeName == "IMG"||target.nodeName == "SPAN"){
			ev.stopPropagation();//阻止冒泡；
			target = target.parentNode;
			checkedI.length = 0;
		}
		if(target.nodeName == "INPUT"){//如果点击的是编辑块，不做任何操作，直接return
			ev.stopPropagation();//阻止冒泡；
			return;
		}
		var clickId = target.dataset.id;//获取到点击元素身上的自定义属性：id；
		renderById(clickId);//通过指定id渲染导航，树形菜单，文件显示区域的结构；		
	});

/*----------------------------------------框选----------------------------------------*/
	on(folders,"mousedown",function(ev){		
		//ev.stopPropagation();//阻止冒泡；
		ev.preventDefault();//取消默认行为；
		//框选的时候排除点击的单选按钮上
		if(ev.target.nodeName === "I"){
			ev.stopPropagation();//阻止冒泡；
			return;
		}
		//鼠标按下清除单选和全选按钮的选中撞状态;
		for( var i = 0; i < folderDivs.length; i++ ){	
			folderDivs[i].classList.remove("hov");					
			folderDivs[i].lastElementChild.classList.remove("checked");	
			folderDivs[i].lastElementChild.dataset.checked = "false";				
		}
		checkedAll.classList.remove("checked");//全选按钮清除选中状态；

		var newDiv = document.createElement("div");//创建一个新的div
		newDiv.className = "kuang";//添加class名；

		//获取到鼠标按下时newDiv的位置；
		var disX = ev.clientX;
		var disY = ev.clientY;
		newDiv.style.left = disX + 'px';
		newDiv.style.top = disY + 'px';
		newDiv.isAppend = false;//声明一个变量，存放是否添加了newDiv，开始默认为没有添加，false
		on(document,"mousemove",moveFn);
		on(document,'mouseup', upFn);
	
		//鼠标移动函数封装;
		function moveFn(ev){
			//实现鼠标移动在10px的范围内，不出现newDiv,并且newDiv不会一直向body中重复添加
			if(Math.abs(ev.clientX-disX) >10|| Math.abs(ev.clientY-disY)>10){
				if(!newDiv.isAppend){//body中没有添加过newDiv
					document.body.appendChild(newDiv);
					newDiv.isAppend = true;//将状态改为true，证明已经添加过，下一次就不会走到if里，就不会重复添加：
				}
			}
			//鼠标移动过程中，newDiv的宽、高、left、top值:
			newDiv.style.width = Math.abs(ev.clientX - disX) + 'px';
			newDiv.style.height = Math.abs(ev.clientY - disY) + 'px';	
			newDiv.style.left = Math.min(ev.clientX,disX) + 'px';
			newDiv.style.top = Math.min(ev.clientY,disY) + 'px';

			//循环所有的文件夹
			for( var i = 0; i < folderDivs.length; i++ ){
				if(collision(newDiv,folderDivs[i])){//如果碰撞了
					folderDivs[i].classList.add('hov');
					folderDivs[i].lastElementChild.classList.add("checked");//单选按钮I添加checked
				}else{//没碰撞
					folderDivs[i].classList.remove('hov');
					folderDivs[i].lastElementChild.classList.remove("checked")//单选按钮I移除checked
				}
			}
		}
		//鼠标抬起函封装
		function upFn(ev){
			//清除鼠标移动事件，抬起事件；
			off(document,"mousemove",moveFn);
			off(document,"mouseup",upFn);
			//移出newDiv:				
			if(newDiv.isAppend){//如果已经添加过newDiv鼠标抬起时就移除;
				document.body.removeChild(newDiv);
			}
			//判断是否所有的单选按钮都被选中，
			var  getIByChecked = folders.getElementsByClassName("checked");//通过class名获取到所有已经添加上checked单选按钮
			if(checkedI.length!=0 && checkedI.length === getIByChecked.length){//如果通过checked的class名获取到的单选按钮等于文件区域里所有的单选按钮的数量
				checkedAll.classList.add("checked");//说明所有的单选按钮已经全被选中了，全选按钮同时也要被选中；
			}else{
				checkedAll.classList.remove("checked");//如果不相等，全选按钮不被选中;
			}			
		}
	});

/*-------------------------------------新建文件夹-------------------------------------*/	
	 on(createBtn,"click",function(ev){
	 	create.isCreate = true;
	    //var addState = false;//标记新的id还没有添加到数据中;
		ev.stopPropagation();
		
		//随机生成id，id是唯一的需要数组去重：
			var dataArr = [];	
			//将数据中现有的id放入一个数组中；
			for(var attr in data){
				dataArr.push(data[attr].id);
			}
			var newArr = [];//用来接收随机生成的数据;
			var obj = {};//利用对象key值得唯一性；进行数组去重;
			for(;newArr.length < 100;){
				var n = Math.round(Math.random()*1000000);  // 随机生成0到100万的数，每次取100个;
				if(!obj[n]){
					newArr.push(n);
					obj[n] = true;
				}				
			}

			for( var i = 0; i < newArr.length ; i++ ){
				for( var j = 0; j < dataArr.length; j++ ){
					if(newArr[i]!=dataArr[j]){
						newId = newArr[i];//找到不重复的id；随机生成新的Id;
						break;
					}
				}
			}
		//获取到当前显示文件夹的父级身上的id；
		var pId = breadNav.querySelector("span").dataset.id;
		//创建一个元素。即：文件夹；
		newfolder = document.createElement("div");
		newfolder.dataset.id = newId;
		newfolder.classList.add("file-item");
		
		//生成文件夹的内容；
		newfolder.innerHTML += `
								<img src="img/folder-b.png" alt="" />
								<span class="folder-name" data-id = "${newId}"></span>
								<input  type="text" class="editor"/>
								<i></i>
								`;				
		
		//将这个文件夹结构，放入文件夹显示区域的最前面；
		if(folders.children.length){
			folders.insertBefore(newfolder,folders.firstElementChild);
		}else{
			fEmpty.style.display = "none";
			folders.style.display = "block";
			folders.appendChild(newfolder);
		}
		
		var editor = newfolder.querySelector(".editor");//编辑框;
		var foldeName = newfolder.querySelector(".folder-name");//文件名字;
		editor.style.display = "block";
		editor.focus();	//自动获取焦点;

		// 给input绑定事件，目的是阻止冒泡，不进到下一级
		on(editor,"mousedown",function(ev){
			ev.stopPropagation();//阻止冒泡，
		});
	});

/*-------------------------------------删除文件夹-------------------------------------*/
	on(del,"click",function(){
		var getIByChecked = folders.querySelectorAll(".checked");//通过class名获取到所有已经选中的按钮
		if(!getIByChecked.length){
		    tips("err","请选择要删除的文件");	
		}else{
			tanbox.style.display = "block";
		}
	});
	//点击取消删除按钮
	on(cancel,"click",function(){
		tanbox.style.display = "none";
		return;
	});
	//点击关闭按钮：	
	on(closeBtn,"click",function(){
		tanbox.style.display = "none";
		return;
	});
	//点击确认删除按钮
	on(sureDel,"click",function(){
		var getIByChecked = folders.querySelectorAll(".checked");//通过class名获取到所有已经选中的按钮		
		/*
			思路：
			根据选中的按钮，找到要删除的文件夹，再找到要删除文件夹的父级，更改父级中child的内容；根据选中文件夹的id删除数据；重新渲染三个部分结构；
		*/
		//通过选中的单选按钮是删除对应的数据，即数据中的child内容；	
		var arr = [];
		for( var i = 0; i < getIByChecked.length; i++ ){
			arr.push(Number(getIByChecked[i].parentNode.dataset.id));
		}
		//1.找到这些文件夹id对应的父级；
		var parent = "";//记录要删除文件夹的父级		
		for(var attr in data){
			if(data[attr].id==arr[0]){
				parent = data[attr];
				for(var attr in data){
					if(data[attr].id==parent.pid){
						parent = data[attr];
					}
				}
			}
		}
		//2.更改父级中child的内容；
		var childArr = parent.child;//找到对应父级的child；
		for( var i = 0; i < arr.length; i++ ){//循环要删除的id数组，如果父级的child中有要删除的id，就把这个id从父级的child中删掉；			
			if(childArr.indexOf(arr[i])!=-1){
				childArr.splice(childArr.indexOf(arr[i]),1);
			}			
		}
		//删除选中文件夹对应的数据及子孙数据：
		for( var i = 0; i < getIByChecked.length; i++ ){
			deleteDataById(getIByChecked[i].parentNode.dataset.id);
		}
		tips("ok","删除文件成功");				
		folders.innerHTML = createFileHtmlById(currentId);//右侧文件区域渲染；
		treeMenu.innerHTML = CreatHtml(initId,levar);
		tanbox.style.display = "none";
		if(!folders.children.length){//重新渲染结构后如果右侧区域没有文件，提示空，全选按钮不可点，并且不被选中；
			checkedAll.classList.remove("checked");
			checkedAll.disabled = true;
			fEmpty.style.display = "block";
		}
	});
/*-------------------------------------document事件-----------------------------------*/

	on(document,"mousedown",function(){			
		if(create.isCreate){
			var addState = false;//标记新的id还没有添加到数据中;
			var pId = breadNav.querySelector("span").dataset.id;
			var editor = newfolder.querySelector(".editor");//编辑框;
			var foldeName = newfolder.querySelector(".folder-name");//文件名字
			if(!editor.value){				
				newfolder.remove();
				if(!folders.children.length){
					checkedAll.classList.remove("checked");
					checkedAll.disabled = true;
					fEmpty.style.display = "block";
				}
				return;
			}else{
				var val = editor.value;
				foldeName.innerHTML = val;
				editor.style.display = "none";
				editor.value = "";
				//--------------如果新建文件夹更改了名字，修改数据部分重新渲染树形菜单---------------

				var childs = getChildsById(pId);
				for(var attr in childs){
					if(val ==childs[attr].title ){
						//提示文件名重复,新建不成功
					    tips("warn","文件名重复,新建不成功");	
						newfolder.remove();
						return;
					}
				}

			//添加结构：
			
				if(!addState){
					data[newId] = {
				        "id": newId,
				        "pid": pId,
				        "title": val,
				        "type": "file",				        
				    };
					addState = true;
				}
				data[newId].child = [];
				//找到添加文件的目录；
				getDataById(pId).child.unshift(newId);
			    //重新渲染树形菜单；
			    treeMenu.innerHTML = CreatHtml(initId,levar);
			    //重新渲染右边的文件区域；
			    folders.innerHTML = createFileHtmlById(pId);
			    //重新渲染导航区域;
			    breadNav.innerHTML = createNavHtmlById(pId);
			    //提示新建文件夹成功；
			    tips("ok","新建文件夹成功");	    
		    }
		}
		create.isCreate = false;
	});
	
/*-------------------------------------重命名文件夹-----------------------------------*/
	on(rename,"click",function(ev){
		
		ev.stopPropagation();
		var getIByChecked = folders.getElementsByClassName("checked");//通过class名获取到所有已经选中的按钮		
		if(!getIByChecked.length){
		    tips("err","请选择要操作的文件");	  
		}else if(getIByChecked.length>1){
		    tips("warn","请单个操作文件");
		}else{
			rename.isRename = true;//处于重命名状态
			folderDiv = folders.querySelector(".checked").parentNode;//选中的文件夹；
			var nameSpan = folderDiv.querySelector("span");//文件名显示区域	
			var editor = folderDiv.querySelector("input");//文件名编辑区域	
			nameSpan.style.display = "none";//显示框消失
			editor.style.display = "block";//编辑框出现			
			editor.value= nameSpan.innerHTML;//编辑块的内容为显示块的内容；			
			editor.select();//点击重命名的时候编辑框自动选中；			
		}
	});

/*-------------------------------------document事件-----------------------------------*/
	on(document,"mousedown",function(){
		//如果是在重命名状态
		/*
			判断编辑框是否有值；
				1.如果有显示框内容为编辑框内容，
				2.如果没有点击时恢复原来的内容
		*/
		if(rename.isRename){
			var clickId = folderDiv.dataset.id;//选中文件夹的id
			var nameSpan = folderDiv.querySelector("span");//文件名显示区域
			var editor = folderDiv.querySelector("input");//文件名编辑区域
			var oldValue = nameSpan.innerHTML;//文件夹最原始的名字；
			var val = editor.value;//编辑块的内容
			if(!val){//没有内容
				val = oldValue;
				nameSpan.innerHTML = val;
				nameSpan.style.display = "block";//显示框消失
			    editor.style.display = "none";//编辑框出现
			}else{
			/*------------------判断输入的名字是否和现有文件夹的名字重复----------------*/
				var currentPid = getDataById(clickId).pid;//当前点击文件夹数据的pid；
				var childs = getChildsById(currentPid);//根据pid获取到子级；
				for(var attr in childs){
					if(val ==childs[attr].title ){
					    tips("err","文件名重复，重命名失败");	  
					    nameSpan.innerHTML = oldValue;//文件夹的名字还原为原来的名字；
					    nameSpan.style.display = "block";//显示框消失
			    		editor.style.display = "none";//编辑框出现
						return;
					}
				}
				nameSpan.innerHTML = val;
				nameSpan.style.display = "block";//显示框消失
			    editor.style.display = "none";//编辑框出现
			    tips("ok","重命名操作成功");	 	
			/*------------------------------改数据------------------------------------*/
			    for(var attr in data){
					if(data[attr].id==clickId){
						data[attr].title = val;	//找到文件夹对应的数据的title；
						treeMenu.innerHTML = CreatHtml(initId,levar);
						editor.style.display = "none";	
						editor.value = "";
						break;					
					}
				}
			}
			rename.isRename = false;
		}
	});	

/*-------------------------------------移动文件夹-------------------------------------*/
	on(removeBtn,"click",function(ev){
		removeBtn.isRemoveBtn = true;//处于移动文件夹状态
		ev.stopPropagation();//阻止冒泡
		var getIByChecked = folders.querySelectorAll(".checked");//通过class名获取到所有已经选中的按钮		
		if(!getIByChecked.length){
		    tips("err","请选择要操作的文件");	
		}else{
			treeMenuTan.innerHTML = CreatHtml(initId,levar);
			tanTreespans = $("span",treeMenuTan);//树形菜单中所有的div；
			tanTreespans[0].classList.add("active");
			tanboxRemove.style.display = "block";

			//要移动的文件夹的某一个身上的id;
			var changeId = getIByChecked[0].parentNode.dataset.id;
			//要移动的文件夹id的集合；
			for( var i = 0; i <getIByChecked.length; i++ ){
				removeArrId.push(getIByChecked[i].parentNode.dataset.id);
			}			
			removePid = getDataById(changeId).pid;//要移动的所有文件夹的父级身上的id;
		}
	});

 	on(cancelRemove,"click",function(){
 		tanboxRemove.style.display = "none";
 	});
 	on(closeBtnRemove,"click",function(){
 		tanboxRemove.style.display = "none";
 	});
 	//点击弹窗的树形菜单交互；
 	tanTreeDivsClick();
 	function tanTreeDivsClick(){//利用事件委托写菜单的交互；
		treeMenuTan.onclick = function(ev){			
			for( var i = 0; i < tanTreespans.length; i++ ){
				tanTreespans[i].classList.remove("active");
			}
			checkedIdAll = [];//选中的文件的id集合为空；
			//ev.stopPropagation();
			if(ev.target.nodeName==="SPAN"||ev.target.nodeName==="DIV"){//判断如果是点击到div或者span就添加事件；				
				ev.target.classList.add("active");
				clickId = Number(ev.target.dataset.id);//点击弹框的树形菜单的id
				var folderImg = ev.target.getElementsByTagName("em")[0];
				folderImg.style.background = "url(img/s_folder1.png) no-repeat";
				/*
					判断点击的元素身上的id和要移动的文件的id的关系，
					1.不能移动到自己及自己的子孙级里，
					2.不能移动到自己父级里；
					3.不能移动到自己里
					同时确定按钮不可以点击；
				*/
				var getIByChecked = folders.getElementsByClassName("checked");//通过class名获取到所有已经选中的按钮
				
				for( var i = 0; i < getIByChecked.length; i++ ){
					checkedIdAll.push(getIByChecked[i].parentNode.dataset.id);//获取到选中的id;
				}
				var checkedData = getChildsAllByIDArr(checkedIdAll);//通过选中的id的集合来获取对应的子孙数据；
				//如果点击的id和选中的文件的pid相同；不能移动
				var selectDivPid = getDataById(getIByChecked[0].parentNode.dataset.id).pid;
				if(clickId==selectDivPid){
					friendsTips.innerHTML = "不能移动到";
					friendsTips.style.display = "block";
					sureRemove.disabled = true;//确定按钮不可点；
					return;
				}
				var isRepeat = false;//定义一个变量，如果点击的id在选中文件的子孙数据中的id是否相同，默认为不同
				for( var i = 0; i < checkedData.length ; i++ ){					
					if(clickId==checkedData[i].id){
						isRepeat = true;//如果点击的id在选中文件的子孙数据中的id相同，改为true；
						break;						
					}
				}
				if(isRepeat){//相同时提示
					friendsTips.innerHTML = "不能移动到自己及子元素下";
					friendsTips.style.display = "block";
					sureRemove.disabled = true;//确定按钮不可点；
				}else{//如果不相同取消提示；
					friendsTips.innerHTML = "";
					friendsTips.style.display = "none";
				}
			}
		}
	}
	//点击确认移动的按钮；
 	on(sureRemove,"click",function(){
 		//如果提示不能移动，确定按钮不可点；
 		if(friendsTips.innerHTML == "不能移动到"||friendsTips.innerHTML == "不能移动到自己及子元素下"){
 			return;
 		}
 		//debugger;
 		tanboxRemove.style.display = "none";//提示框消失；

 		//判断选中的文件的title和目标父级下子级文件的title是否有重复；
 		var getIByChecked = folders.getElementsByClassName("checked");//通过class名获取到所有已经选中的按钮
		var removeData = [];//找到要移动文夹件的数据；
		for( var i = 0; i < checkedIdAll.length ; i++ ){
			removeData.push(data[Number(checkedIdAll[i])]);
		}
		var targetData = getChildsById(clickId);//目标父级的所有子数据；

		//判断要移动的文件title是否和移动目标里的子级的titlt是否重复；如果不重复放到一个新的数组里；
		var sureMove = [];//确定要移动的数据；
		if(!targetData.length){//如果移动目标父级中没有子数据
			sureMove = removeData;//确定要移动过的数据直接就等于移动的数据
		}else{//如果目标文件中有子数据
			for( var i = 0; i < removeData.length; i++ ){//循环要移动的文件夹数据
				removeData[i].isNoRepeat = true;//给每一个文件夹的数据设置一个自定义属性，不重复，默认为true；
				for( var j = 0; j < targetData.length; j++ ){
					//console.log(removeData[i].title!=targetData[j].title);
					if(removeData[i].title==targetData[j].title){//如果文件名字重复了，
						removeData[i].isNoRepeat = false;//removeData[i].isNoRepeat的状态设置为false；
						break;
					}
				}
				if(removeData[i].isNoRepeat){//循环完目标文件的数据之后如果还是不重复，就把药移动的文件夹的第i个放到确定要移动的数组里；
					sureMove.push(removeData[i]);
				}
			}
		}
		if(sureMove.length != removeData.length){//如果确定要移动的文件和选中要移动的文件的数据长度不同，证明有重复的文件夹名，弹出提示；			
		    tips("warn","部分文件与目标文件相同，不能移动");	
		}
 		//改数据；将选中的文件的的数据的pid改为所点击的id; 		
 		var getIdArr = [];
 		for( var i = 0; i < sureMove.length; i++ ){
 			getIdArr.push(sureMove[i].id);
 		}
		//1.找到这些文件夹id对应的父级；
		var parent = "";//记录要删除文件夹的父级		
		for(var attr in data){
			if(data[attr].id==getIdArr[0]){
				parent = data[attr];
				for(var attr in data){
					if(data[attr].id==parent.pid){
						parent = data[attr];
					}
				}
			}
		}
		//2.更改选中要移动文件夹父级中child的内容；
		var childArr = parent.child;//找到对应父级的child；
		for( var i = 0; i < getIdArr.length; i++ ){//循环要删除的id数组，如果父级的child中有要删除的id，就把这个id从父级的child中删掉；			
			if(childArr.indexOf(getIdArr[i])!=-1){
				childArr.splice(childArr.indexOf(getIdArr[i]),1);
			}			
		}
		//3.更改移动文件夹对应数据的pid，向移动目标父级中添加child；		
 		for( var i = 0; i < sureMove.length; i++ ){
 			sureMove[i].pid = clickId;
 			getDataById(clickId).child.push(sureMove[i].id);//在移动目标父级的child中添加子数据的id;
 		}
 		//tips("ok","移动文件成功");						
 		//重新渲染结构
 		treeMenu.innerHTML = CreatHtml(initId,levar);//树形菜单渲染
 		folders.innerHTML = createFileHtmlById(currentId);//右侧文件区域显示；
 		treeMenuTan.innerHTML = CreatHtml(initId,levar);//弹框的树形菜单重新渲染；
 		var tanTreeDivs = $("div",treeMenuTan);//弹出的树形菜单中所有的div；
		tanTreeDivs[0].classList.add("active");//默认微云高亮显示；
 		renderById(currentId);//三个区域点击交互
 	});

 	//提示框函数封装:
 	function tips(cla,title){
		tipBox.style.top = '-32px';
		tipBox.style.transition = 'none';//瞬间拉回去的时候去掉transition状态
		// 运动到0
		tipText.innerHTML = title;
		tipBox.className = 'full-tip-box';
		setTimeout(function (){
			tipBox.classList.add(cla);
			tipBox.style.top = '0px';
			tipBox.style.transition = '.3s';	
		})

		clearTimeout(timer);//每次只有一个定时器走；
		timer = setTimeout(function (){
			tipBox.style.top = '-32px';
		},2000)		
	}
})();



