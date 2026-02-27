Ext.define("CGP.material.store.RtAttribute",{

    extend : 'Ext.data.Store',
    requires : ['CGP.material.model.RtAttribute'],

    model : 'CGP.material.model.RtAttribute',
    proxy:{
        type:'uxrest',
        url:adminPath + 'api/admin/runtimeType/attributes',
        reader:{
            type:'json',
            root:'data.content'
        }
    },
    autoLoad:true
});