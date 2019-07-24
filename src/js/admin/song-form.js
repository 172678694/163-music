{
    let view = {
        el: '.editArea',
        template: `
            <form class="form">
                <div class="row">
                    <label>歌名：</label>
                    <input name="name" type="text" value="__name__">
                </div>
                <div class="row">
                    <label>歌手：</label>
                    <input name="singer" type="text" value="__singer__">
                </div>
                <div class="row">
                    <label>外链：</label>
                    <input name="url" type="text" value="__url__">
                </div>
                <div class="row">
                    <label>封面：</label>
                    <input name="cover" type="text" value="__cover__">
                </div>
                <div class="row">
                    <label>歌词：</label>
                    <textarea name="lyrics"  cols="80" rows="10">__lyrics__</textarea>
                </div>
                <div class="row actions">
                    <input type="submit" value="保存">
                </div>
            </form>
        `,
        init() {
            this.$el = $(this.el)
        },
        render(data = {}) {                                            //接受参数data:{name,singer,url,id}然后去填充form;若data undefined，data === {}
            let html = this.template
            let spaceHolders = ['name', 'url', 'singer','cover','lyrics']
            spaceHolders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')    //更换value
            })
            $(this.el).html(html)
            if(data.id){
                $(this.el).prepend('<h1>编辑歌曲</h1>')
              }else{
                $(this.el).prepend('<h1>新建歌曲</h1>')
              }
        },
        reset() {
            this.render({})
        }
    }
    let model = {
        data: { name: '', singer: '', url: '', id: '' ,cover:'',lyrics:''},
        create(data) {                                                //接受一个data:{name,url,singer}，在LeanCloud数据库创建对象
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('name', data.name);
            song.set('url', data.url);
            song.set('singer', data.singer);
            song.set('cover', data.cover);
            song.set('lyrics', data.lyrics);
            return song.save().then((newSong) => {                    //保存成功->更新model.data
                let { id, attributes } = newSong
                Object.assign(this.data, { id, ...attributes })
            }, (error) => {
                console.error(error);
            })
        },
        update(data) {
            //更新对象
            var song = AV.Object.createWithoutData('Song', this.data.id);
            song.set('name', data.name);
            song.set('url', data.url);
            song.set('singer', data.singer);
            song.set('cover', data.cover);
            song.set('lyrics', data.lyrics);
            return song.save().then((response) => {
                Object.assign(this.data, data)
                return response
            }, (response) => {
                console.log('更新到数据库失败')
                console.log(response)
            })
        }
    }
    let controller = {
        view: null,
        model: null,
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.view.render(this.model.data) //*this.model.data 
            this.bindEvents()
            this.bindEventHub()

        },
        create() {
            let needs = ['name', 'url', 'singer','cover','lyrics']
            let data = {}                                                       //收集提交的data:{name,url,singer}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.create(data)
                .then(() => {                                //将data create到云端,data{name,url,singer,id}
                    this.view.reset()                                               //->清空表单
                    window.eventHub.emit('create', this.model.data)
                })
        },
        update() {
            let needs = ['name', 'url', 'singer','cover','lyrics']
            let data = {}                                                       //收集提交的data:{name,url,singer}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.update(data)
                .then(() => {
                    console.log('这里不应该有执行')
                    console.log(this.model.data)
                    window.eventHub.emit('update', JSON.parse(JSON.stringify(this.model.data)))
                })
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {                                //监听submit按钮
                e.preventDefault()

                if (this.model.data.id) {
                    console.log('1')
                    this.update()
                } else {
                    console.log('2')
                    this.create()
                }

            })
        },
        bindEventHub() {
            window.eventHub.on('select', (selectedSong) => {
                console.log('song-form监听到了song-list的select')
                console.log('selectedSong信息：')
                console.log(selectedSong)
                this.model.data = selectedSong //选中歌曲的信息被保存到Model.data里
                this.view.render(this.model.data)
            })

            window.eventHub.on('upload', (data) => {               //上传歌曲后云端返回的数据{name:,url:}
                console.log('song-form监听到了upload的upload')
                this.model.data = data                              //保存到songform的data
                this.view.render(data)
            })                                                      //模块间的交互


            window.eventHub.on('new', (data) => {
                if (this.model.data.id) {
                    this.model.data = {
                        name: '', url: '', id: '', singer: '',lyrics:''
                    }
                } else {
                    Object.assign(this.model.data, data)
                }
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}