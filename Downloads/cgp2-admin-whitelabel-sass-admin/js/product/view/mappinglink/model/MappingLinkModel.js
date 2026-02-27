/**
 * Created by nan on 2019/12/13.
 */
Ext.define('CGP.product.view.mappinglink.model.MappingLinkModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        }, {
            name: 'linkName',
            type: 'string'
        }, {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.attributecalculate.MappingLink'
        },
        {
            name: 'productId',
            type: 'string',
            defaultValue: JSGetQueryString('productId')
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/mappingLink',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
