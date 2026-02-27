Ext.define("CGP.bommaterial.store.SelectTypeStore",{
    extend: "Ext.data.Store",
    fields: [{
        name: 'code',
        type: 'string'

    }],
    proxy: {
        type:'uxrest',
        url:adminPath + 'api/admin/bom/schema/attributes/selectTypes',
        reader:{
            type:'json',
            root:'data'
        }
    },
    autoLoad: true
})