{
    let view={
        el:'#page-2',
        init(){
            this.$el=$(this.el)
        },
        show(){
            this.$el.show()
        },
        hide(){
            this.$el.hide()
        }
    }
    let model={

    }
    let controller={
        init(view,model){
            this.view=view
            this.view.init()
            this.model=model
            this.bindEventHub()
        },
        bindEventHub(){
            window.eventHub.on('select',(pageName)=>{
                if(pageName === '#page-2'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        }
    }
    controller.init(view,model)
}