/**
 * Created by nan on 2018/1/24.
 */

Ext.define('CGP.configuration.serviceomt.store.ServiceOmtStore', {
    extend:'Ext.data.Store',
    model: 'CGP.configuration.serviceomt.model.Model',
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