Ext.define('CGP.USExemptionCert.store.VatStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.USExemptionCert.model.VatModel',
    pageSize:25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/partner/exemptionCert',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    remoteSort: true,//和sort必须一起，不然rownumber列数据显示不对
    sorters: {property: '_id', direction: 'DESC'},
    autoLoad: true
})
