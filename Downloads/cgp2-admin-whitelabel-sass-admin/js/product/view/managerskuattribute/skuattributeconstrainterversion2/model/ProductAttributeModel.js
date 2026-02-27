/**
 * Created by nan on 2019/10/21.
 */
Ext.define('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.model.ProductAttributeModel', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, 'code', 'name', 'inputType', {
        name: 'options',
        type: 'array',
        convert: function (value, record) {
            if (Ext.isEmpty(record.get('attribute').options)) {
                return [];
            } else {
                return record.get('attribute').options;
            }
        }
    }, {
        name: 'displayName',
        type: 'string'
    }, {
        name: 'description',
        type: 'string'
    }, {
        name: 'attribute',
        type: 'object'
    }, {
        name: 'attributeId',
        type: 'int',
        convert: function (value, record) {
            var attributeId = record.get('attribute').id;
            return attributeId;
        }
    }, {
        name: 'attributeName',
        type: 'string',
        convert: function (value, record) {
            var result = record.get('displayName') + '<' + record.get('id') + '>';
            return result;
        }
    }, {
        name: 'isSku',
        type: 'boolean'
    }, {
        name: 'detail',
        type: 'string'
    }, {
        name: 'placeholder',
        type: 'string'
    }, {
        //标识是否为必填
        name: 'required',
        type: 'boolean'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/products/configurable/{id}/skuAttributes',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
