Ext.define("CGP.rtattribute.store.Attribute",{

    extend : 'Ext.data.Store',
    requires : ['CGP.rtattribute.model.Attribute'],

    model : 'CGP.rtattribute.model.Attribute',
    remoteSort: true,
    sorters: [{
        property: '_id',
        direction: 'DESC'
    }],
    proxy:{
        type:'uxrest',
        url:adminPath + 'api/rtAttributeDefs',
        reader:{
            type:'json',
            root:'data.content'
        }
    },
    autoLoad:true
});