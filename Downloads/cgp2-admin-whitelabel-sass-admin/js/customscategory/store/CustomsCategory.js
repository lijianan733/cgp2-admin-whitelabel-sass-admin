Ext.define("CGP.customscategory.store.CustomsCategory", {
    extend: 'Ext.data.Store',
    model: 'CGP.customscategory.model.CustomsCategory',
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath+'api/customsCategory',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});