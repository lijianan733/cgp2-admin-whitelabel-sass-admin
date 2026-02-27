Ext.define('CGP.product.view.customselement.model.CustomsCategoryModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'inName',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.customs.CustomsCategory'
        },
        {
            name: 'inCode',
            type: 'string'
        },

        {
            name: 'outName',
            type: 'string'
        },
        {
            name: 'outCode',
            type: 'string'
        },
        {
            name: 'tagKeyCode',
            type: 'string'
        },
        {
            name: 'unit',
            type: 'string'
        },
        {
            name: 'remark',
            type: 'string'
        },
        {
            name: 'showSize',
            type: 'string'
        },
        {
            name: 'showCount',
            type: 'string'
        },
        {
            name: 'showBrand',
            type: 'string'
        },
        {
            name: 'showSpecifications',
            type: 'string'
        },
        {
            name: 'showModel',
            type: 'string'
        },
        {
            name: 'showFreightNum',
            type: 'string'
        },
        {
            name: 'showStyleNum',
            type: 'string'
        },
        {
            name: 'commodityInspection',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/customsCategory',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
