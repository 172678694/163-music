let view ={
    el:'#menu',
    init(){
        this.$el=$(this.el)
    }
}
let model={

}
let controller={
    view:null,
    model:null,
    init(view,model){
        this.view=view
        this.model=model
        this.view.init()
        this.bindEvents()
    },
    bindEvents(){
        this.view.$el.on('click','ul>li',(e)=>{
            console.log(e.currentTarget)
            let $li=$(e.currentTarget)
            let pageName = $li.attr('data-tab-name')
            $(pageName).show().siblings().hide()
            $li.addClass('active').siblings().removeClass('active')
        })
    }
}
controller.init(view,model)