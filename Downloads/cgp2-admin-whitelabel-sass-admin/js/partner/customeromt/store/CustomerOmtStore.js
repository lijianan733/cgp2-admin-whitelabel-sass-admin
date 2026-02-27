/**
 * Created by nan on 2018/1/25.
 */
Ext.syncRequire(['CGP.partner.customeromt.model.Model'])
Ext.define('CGP.partner.customeromt.store.CustomerOmtStore', {
    extend:'Ext.data.Store',
    model: 'CGP.partner.customeromt.model.Model',
    autoLoad: true,
    pageSize: 25,
    proxy: {
        extraParams: {
            locale: Ext.util.Cookies.get('lang')
        },
        type: 'uxrest',
        url: adminPath + 'api/orderStatusChangeMailConfigs/backstage',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    constructor:function(config){
        var me = this;
        if(config.params){
            me.proxy.extraParams = Ext.Object.merge(me.proxy.extraParams,config.params);
        }
        if(config.type=='backstage'){
            me.proxy.url =adminPath + 'api/orderStatusChangeMailConfigs/backstage';
        }else{
            me.proxy.url =adminPath + 'api/orderStatusChangeMailConfigs/customer';
        }
        me.callParent(arguments)
    }

});