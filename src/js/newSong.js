{
    let view = {
        el:'.newSong',
        tempalte:`
        新建歌曲
        `,
        render(data){
            $(this.el).html(this.tempalte)
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
            window.eventHub.on('upload',(data)=>{
                console.log('newSong模块拿到了data')
                console.log(data)
                this.active()
            })
        },
        active(){
            $(this.view.el).addClass('active')
        }
    }
    controller.init(view,model)
}