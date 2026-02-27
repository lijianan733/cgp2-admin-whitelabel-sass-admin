Ext.define('CGP.material.store.MaterialDetail', {
    extend: 'Ext.data.Store',
    model: 'CGP.material.model.MaterialDetail',
    proxy:{
        type:'uxrest',
        url: adminPath + 'api/admin/materials/{id}',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})