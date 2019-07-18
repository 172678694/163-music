{
    let view = {
        el:'.newSong',
        tempalte:`
        新建歌曲
        `,
        render(data){
            $(this.el).html(this.tempalte)
        },
        clearActive(){
            $(this.el).removeClass('active')
        }
    }
    let model = {

    }
    let controller = {
        view:null,
        model:null,
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.active()
            this.bindEvents()
            window.eventHub.on('upload',(data)=>{
                console.log('newSong模块拿到了data')
                console.log(data)
                this.active()
            })
            window.eventHub.on('select',()=>{
                console.log('newSong监听到了song-form的select')
                this.view.clearActive()
            })
            window.eventHub.on('new',()=>{
                this.active()
            })
        },
        active(){
            $(this.view.el).addClass('active')
        },
        bindEvents(){
            $(this.view.el).on('click',()=>{
                console.log('新建歌曲被点击')
                window.eventHub.emit('new')
            })
        }
    }
    controller.init(view,model)
}