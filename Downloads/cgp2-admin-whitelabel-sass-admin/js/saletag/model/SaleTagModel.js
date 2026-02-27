// 语言设置的的 model
Ext.define('CGP.saletag.model.SaleTagModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'int',
        useNull: true
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'color',
        type: 'string'
    }, {
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.product.tag.SaleTag'
    }],
    proxy: {
        //appendId:false,
        type: 'uxrest',
        url: adminPath + 'api/saletags',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
