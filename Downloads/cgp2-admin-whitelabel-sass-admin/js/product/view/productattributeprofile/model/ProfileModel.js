Ext.define('CGP.product.view.productattributeprofile.model.ProfileModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string'
    }, {
        name: 'sort',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'displayName',
        type: 'string',
        convert: function (v, record) {
            return record.data.name + '<' + record.data._id + '>';
        }
    }, {
        name: 'productId',
        type: 'int'
    }, {
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.attributeconfig.AttributeProfile'
    }, {//唯一标识
        name: 'code',
        type: 'string',
    }, {
        name: 'groups',
        type: 'array'
    }],
    proxy: {
        type: 'attribute_version_rest',
        url: adminPath + 'api/attributeProfile',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});