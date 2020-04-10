
import breadcrumb from "@/components/breadcrumb";
import aliplayer from "@/components/aliplayer/aliplayer";

const globalComponents = {
    install:function(Vue){
        Vue.component('breadcrumb',breadcrumb)
      Vue.component('aliplayer',aliplayer)
    }
}

export default globalComponents
