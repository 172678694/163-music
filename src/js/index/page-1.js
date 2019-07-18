{
    let view={}
    let model={}
    let controller={
        init(view,model){
            this.view =view
            this.model=model
            this.loadModule1()
            this.loadModule2()
        },
        loadModule1(){
            let script1 = document.createElement('script')
            script1.src = './js/index/page-1-1.js' 
            script1.onload = function(){
                console.log('模块一加载完毕')
            }
            document.body.appendChild(script1)
        },
        loadModule2(){
            let script2 = document.createElement('script')
            script2.src = './js/index/page-1-2.js' 
            script2.onload = function(){
                console.log('模块二加载完毕')
            }
            document.body.appendChild(script2)
        } 
    }
    controller.init(view,model)
}