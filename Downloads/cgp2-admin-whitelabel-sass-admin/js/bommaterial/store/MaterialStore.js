Ext.define("CGP.bommaterial.store.MaterialStore",{
    extend: "Ext.data.Store",
    model: "CGP.bommaterial.model.MaterialModel",
    proxy: {
        type:'uxrest',
        url:adminPath + 'api/admin/bom/schema/materials',
        reader:{
            type:'json',
            root:'data.content'
        }
    }
})