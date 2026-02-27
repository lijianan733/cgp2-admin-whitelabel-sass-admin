Ext.define("CGP.bommaterial.store.ValueTypeStore",{
    extend: "Ext.data.Store",
    fields: [{
        name: 'code',
        type: 'string'

    }],
    proxy: {
        type:'uxrest',
        url:adminPath + 'api/admin/bom/schema/attributes/valueTypes',
        reader:{
            type:'json',
            root:'data'
        }
    },
    autoLoad: true
})