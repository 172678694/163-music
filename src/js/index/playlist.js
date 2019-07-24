{
    let view={
        el:'.playlistForm-wrapper',
        init(){
            this.$el=$(this.el)
            this.$form=$(this.el).find('form')
        }
    }
    let model={
        data:{},
        create(data){
            var Playlist = AV.Object.extend('Playlist');
            var playlist = new Playlist();
            playlist.set('name', data.name);
            playlist.set('description', data.description);
            return playlist.save()

        }
        
    }
    let controller={
        init(view,model){
            this.view=view
            this.view.init()
            this.model=model
            this.bindEvents()
        },
        bindEvents(){
            this.view.$el.on('submit','form',(e)=>{
                e.preventDefault()
                // console.log(this.view.$form)
                // let plName=this.view.$form.get(0).name.value
                // let plDescription=this.view.$form.get(0).description.value
                // console.log(plName)
                // console.log(plDescription)
                let keys=['name','description']
                let data={}
                keys.map((string)=>{
                    let form=this.view.$form.get(0)
                    data[string]=form[string].value
                    
                })
                this.model.create(data)
                
            })

        }
    }
    controller.init(view,model)
}