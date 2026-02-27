/**
 * Created by nan on 2018/9/10.
 */
Ext.define('CGP.product.view.customselement.model.CustomsElementModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.customs.CustomsElement'
        },
        {
            name: 'productId',
            type: 'int'
        },
        {
            name: 'outCustoms',
            type: 'boolean'
        },
        {
            name: 'customsCategory',
            type: 'object'
        },
        {
            name: 'alonePacking',
            type: 'boolean'
        },
        {
            name: 'brandDesc',
            type: 'string'
        },
        {
            name: 'sizeDesc',
            type: 'object'
        },
        {
            name: 'piecesDesc',
            type: 'int',
            useNull: true
        },
        {
            name: 'styleDesc',
            type: 'string'
        },
        {
            name: 'cargoNo',
            type: 'string'
        },
        {
            name: 'patternNo',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/customsElement',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})