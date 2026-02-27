Ext.define("CGP.rtattribute.store.SelectType",{
    extend: "Ext.data.Store",
    fields: [
        'code'
        ],
    proxy: {
        type:'uxrest',
        url:adminPath + 'api/rtAttributeDefs/selectTypes',
        reader:{
            type:'stringreader',
            root:'data'
        }
    },
    autoLoad: true
})