Ext.define("CGP.printmachine.store.PrintMachine",{
    extend : 'Ext.data.Store',
    model : "CGP.printmachine.model.PrintMachine",
    /**
     * @cfg {boolean} remoteSort
     * 是否在服务器端排序
     */
    remoteSort:false,
    /**
     * @cfg {Number} pageSize
     * 每页的记录数
     */
    pageSize:25,
    /**
     * @cfg {Ext.data.Proxy} proxy
     * store proxy
     */
    proxy:{
        type:'uxrest',
        url:adminPath + 'api/printers',  //请求数据对象的URL。
        reader:{                                    //用来对服务器端响应数据进行解码，或从客户端读取数据。 它可以是一个Reader实例，一个配置对象或只是一个有效的Reader类型名称(例如 'json', 'xml')。
            type:'json',        //Ext.data.reader.Json阅读器
            root:'data.content'  //设置返回信息的根名称
        }
    },
    /**
     * @cfg {boolean} autoLoad
     * 是否自动加载
     */
    autoLoad:true
});
