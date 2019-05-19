{
    let view = {
        el: '.page>main',
        template: `
            <h1>新建歌曲</h1>
            <form class="form">
                <div class="row">
                    <label>歌名</label>
                    <input name="name" type="text" value="__name__">
                </div>
                <div class="row">
                    <label>歌手</label>
                    <input name="singer" type="text" value="__singer__">
                </div>
                <div class="row">
                    <label>外链</label>
                    <input name="url" type="text" value="__url__">
                </div>
                <div class="row actions">
                    <input type="submit" value="保存">
                </div>
            </form>
        `,
        init(){
            this.$el = $(this.el)
        },
        render(data = {}){ //ES6语法：如果data未定义，则data === {}
            let spaceHolders = ['name','url','singer']
            let html = this.template
            spaceHolders.map((string)=>{
               html = html.replace(`__${string}__`,data[string]||'')
            })
            $(this.el).html(html) //在所有渲染数据的操作前先渲染template
        },
        reset(){
            this.render({})
        }
    }
    let model = {
        data:{name:'',singer:'',url:'',id:''}, //第一次提交后，data:{name:'1',singer:'2',url:'3',id:''}
        //第二次提交后，data:{name:'2',singer:'3',url:'4',id:''}
        //在数据库创建新对象
        //AND!改变model里的data //data为新上传的歌曲的信息
        create(data){
            // 声明类型
            var Song = AV.Object.extend('Song');
            // 新建对象
            var song = new Song();
            // 设置名称
            song.set('name',data.name);
            // 设置优先级
            song.set('url',data.url);
            song.set('singer',data.singer);
            return song.save().then((newSong)=>{
              console.log(newSong);//attributes{}&id
              let {id,attributes} = newSong
              Object.assign(this.data,{ //改变model的data
                  id,
                  ...attributes,
                //   ES6语法，相当于以下三行
                //   name:attributes.name,
                //   singer:attributes.singer,
                //   url:attributes.url
              })
            }, (error)=> {
              console.error(error);
            })
        }
    }
    let controller = {
        view:null,
        model:null,
        init(view,model){
            this.view = view
            this.model = model
            this.view.init()
            this.view.render(this.model.data) //*this.model.data 
            this.bindEvents()
            window.eventHub.on('upload',(data)=>{ //上传歌曲后云端返回的数据{name:,url:}
                this.model.data = data //保存到songform的data
                this.view.render(data)
            }) //涉及到模块间的交互
        },
        bindEvents(){
            this.view.$el.on('submit','form', (e)=>{ //委托事件，监听form
                e.preventDefault()                      //阻止默认事件
                let needs = ['name','url','singer']
                let data = {} //只在bindEvents()里有效
                needs.map((string)=>{
                    data[string]=this.view.$el.find(`[name="${string}"]`).val() //取出input的val存起来
                })
                console.log('点击提交按钮后获取的表单数据')
                console.log(data)
                this.model.create(data).then(()=>{ //保存到云端的数据库
                    this.view.reset()               //清空表单
                    // let string = JSON.stringify(this.model.data)
                    // let object = JSON.parse(string)   //如何深拷贝一个对象，而不是引用
                    //window.eventHub.emit('create',object) 
                }) 
                window.eventHub.emit('create',data) //data:{name:,url:,singer:} //涉及到模块间的交互

            })
        }
    }
    controller.init(view,model)
}