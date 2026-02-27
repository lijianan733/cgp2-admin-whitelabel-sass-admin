
Ext.define("CGP.deliveryorder.store.ShippingMethodStore",{
    extend : 'Ext.data.Store',
    fields: ['name','code'],
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
        url:adminPath + 'api/shippingModules/allMethod',
        reader:{
            type:'json',
            root:'data'
        }
    },
    /**
     * @cfg {boolean} autoLoad
     * 是否自动加载
     */
    autoLoad:true
});
