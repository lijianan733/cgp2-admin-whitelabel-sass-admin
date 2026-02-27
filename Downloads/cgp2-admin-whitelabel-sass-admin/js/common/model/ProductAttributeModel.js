/**
 * Created by miao on 2021/01/18.
 */
Ext.define('CGP.common.model.ProductAttributeModel', {
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
    }, {//显示的是sku属性的信息
        name: 'attributeName',
        type: 'string',
        convert: function (value, record) {
            var result = record.get('displayName') + '<' + record.get('id') + '>';
            return result;
        }
    }, {//显示的是属性的信息
        name: 'attributeNameV2',
        type: 'string',
        convert: function (value, record) {
            var attributeId = record.get('attribute').id;
            var name = record.get('attribute').name;
            var result = name + '<' + attributeId + '>';
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
        type: 'attribute_version_rest',
        url: adminPath + 'api/products/configurable/{id}/skuAttributes',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
