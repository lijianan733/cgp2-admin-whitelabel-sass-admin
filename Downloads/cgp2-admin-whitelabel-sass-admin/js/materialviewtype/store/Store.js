Ext.define("CGP.materialviewtype.store.Store",{

    extend : 'Ext.data.Store',
    model : 'CGP.materialviewtype.model.Model',
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