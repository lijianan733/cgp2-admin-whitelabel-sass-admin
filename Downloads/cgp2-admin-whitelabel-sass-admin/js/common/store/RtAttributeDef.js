Ext.define("CGP.common.store.RtAttributeDef",{

    extend : 'Ext.data.Store',
    requires : ['CGP.common.model.RtAttributeDef'],

    model : 'CGP.rtattribute.model.Attribute',
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