Ext.define("CGP.rtattribute.store.ValueType",{
    extend: "Ext.data.Store",
    fields: [
        'code'
        ],
    proxy: {
        type:'uxrest',
        url:adminPath + 'api/rtAttributeDefs/valueTypes',
        reader:{
            type:'stringreader',
            root:'data'
        }
    },
    autoLoad: true
})