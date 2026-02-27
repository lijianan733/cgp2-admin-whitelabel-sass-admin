Ext.define("CGP.material.store.MaterialViewType",{

    extend : 'Ext.data.Store',
    model : 'CGP.material.model.MaterialViewType',
    proxy:{
        type:'uxrest',
        url:adminPath + 'api/materialViewTypes',
        reader:{
            type:'json',
            root:'data.content'
        }
    },
    autoLoad:true
});