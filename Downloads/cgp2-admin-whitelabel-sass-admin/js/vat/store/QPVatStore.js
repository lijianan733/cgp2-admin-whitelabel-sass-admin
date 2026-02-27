Ext.define('CGP.vat.store.QPVatStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.vat.model.QPVatModel'],
    model: 'CGP.vat.model.QPVatModel',
    pageSize: 5,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/qp/vatIds',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    remoteSort: true,//和sort必须一起，不然rownumber列数据显示不对
    sorters: {property: '_id', direction: 'DESC'},
    autoLoad: true
})