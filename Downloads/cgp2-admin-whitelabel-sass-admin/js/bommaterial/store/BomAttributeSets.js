Ext.define("CGP.bommaterial.store.BomAttributeSets",{
    extend: "Ext.data.Store",
    model: "CGP.bommaterial.model.BomAttributeSets",
    proxy:{
        type:'uxrest',
        url:adminPath + 'api/admin/bom/schema/attributeSets',
        reader:{
            type:'json',
            root:'data.content'
        }
    },
    autoLoad:true
})