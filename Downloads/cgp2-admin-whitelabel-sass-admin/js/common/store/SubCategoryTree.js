Ext.define('CGP.common.store.SubCategoryTree', {
    extend : 'Ext.data.TreeStore',

    fields : [{name : "id",type : 'int'},"name"],
    nodeParam: 'id',
    proxy: {
        type: 'rest',
        url: adminPath + 'api/productCategories/allwebsitetree',
        extraParams: {
            access_token: Ext.util.Cookies.get('token'),
            isMain: false
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    root: {
        id: 0,
        name: ''
    },
    autoLoad: true
});