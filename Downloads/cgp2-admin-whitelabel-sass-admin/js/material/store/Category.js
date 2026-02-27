Ext.define("CGP.material.store.Category",{

    extend : 'Ext.data.Store',
    fields: ['name','id'],
    proxy:{
        type:'uxrest',
        url:adminPath + 'api/admin/materials/categories',
        reader:{
            type:'json',
            root:'data'
        }
    },
    autoLoad:true
});