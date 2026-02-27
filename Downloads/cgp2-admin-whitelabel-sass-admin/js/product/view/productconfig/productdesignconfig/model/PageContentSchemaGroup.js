Ext.define('CGP.product.view.productconfig.productdesignconfig.model.PageContentSchemaGroup',{
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
            useNull: true
        },{
            name: 'clazz',
            type: 'string',
            defaultValue: "com.qpp.cgp.domain.bom.PageContentSchemaGroup"
        },{
            name: 'productConfigDesignId',
            type: 'int'
        },
        {
            name: 'rtType',
            type: 'object'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pageContentSchemaGroups',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})