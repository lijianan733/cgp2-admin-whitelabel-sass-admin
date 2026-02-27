Ext.define("CGP.product.view.productpackage.AllPackageStore", {
    extend: 'Ext.data.Store',
    pageSize: 25,
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull:true
        },{
            name: 'name',
            type:'string'
        },{
            name:'imageUrl',
            type: 'string'
        },{
            name: 'needPrint',
            type: 'boolean'
        },{
            name: "isCustomized",
            type: 'boolean'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/productPackages',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});