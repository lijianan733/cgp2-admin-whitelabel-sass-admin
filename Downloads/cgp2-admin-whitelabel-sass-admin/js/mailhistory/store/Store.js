Ext.define('CGP.mailhistory.store.Store',{
    model : 'CGP.mailhistory.model.Model',
    extend: 'Ext.data.Store',
    remoteSort:true,
    pageSize:25,
    proxy : {
        type : 'uxrest',
        url : adminPath + 'api/mailHistories',
        reader : {
            type : 'json',
            root : 'data.content'
        }
    },
    sorters : [{   //应用于当前Store的排序器集合
        property : 'sendDate',
        direction : 'DESC'
    }],
    autoLoad:true
});