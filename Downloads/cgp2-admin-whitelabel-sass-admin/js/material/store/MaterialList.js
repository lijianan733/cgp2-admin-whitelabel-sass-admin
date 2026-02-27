Ext.define('CGP.material.store.MaterialList', {
    extend: 'Ext.data.Store',
    model: 'CGP.material.model.Material',
    proxy:{
        type:'uxrest',
        url: adminPath + 'api/materialCategories/{materialCategoryId}/materials',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    }
});