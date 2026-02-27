Ext.define("CGP.rtattribute.store.ArrayType",{
    extend: "Ext.data.Store",
    //idProperty : 'code',
    fields: [
        'code'
    ],
    proxy: {
        type:'uxrest',
        url:adminPath + 'api/rtAttributeDefs/arrayTypes',
        reader:{
            type:'stringreader',
            root:'data'
        }
    },
    autoLoad: true
})