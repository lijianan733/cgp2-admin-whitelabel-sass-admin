/**
 * currency store
 */
Ext.define("CGP.partner.store.AllCurrency",{
    extend : 'Ext.data.Store',

    model : "CGP.partner.model.CurrencyModel",
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
        url:adminPath + 'api/currencies',
        reader:{
            type:'json',
            root:'data.content'
        }
    },
                                                                                                                                                                                                                                                                                                                                      constructor : function(config){
        var me = this;
        if(config.params){
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    },
    /**
     * @cfg {boolean} autoLoad
     * 是否自动加载
     */
    autoLoad:true
});
