Ext.define('CGP.USExemptionCert.store.QPVatStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.USExemptionCert.model.QPVatModel'],
    model: 'CGP.USExemptionCert.model.QPVatModel',
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
