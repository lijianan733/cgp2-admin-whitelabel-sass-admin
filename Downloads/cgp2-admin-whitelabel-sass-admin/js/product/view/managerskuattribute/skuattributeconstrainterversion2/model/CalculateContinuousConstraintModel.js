/**
 * Created by nan on 2019/11/5.
 */
Ext.define('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.model.CalculateContinuousConstraintModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'int',
        useNull: true
    }, {
        name: 'clazz',
        type: 'string'
    }, {
        name: 'skuAttributeId',
        type: 'string'
    }, {
        name: 'executeCondition',
        type: 'Object'
    }, {
        name: 'description',
        type: 'string'
    }, {
        name: 'promptTemplate',
        type: 'string'
    }, {
        name: 'expressionTipTemplate',
        type: 'string'
    }, {
        name: 'minValue',
        type: 'float'
    }, {
        name: 'maxValue',
        type: 'float'
    }, {
        name: 'operator',
        type: 'string'
    }, {
        name: 'minSkuAttributeId',
        type: 'string'
    }, {
        name: 'maxSkuAttributeId',
        type: 'string'
    }, {
        name: 'isInclude',
        type: 'boolean'
    }, {
        name: 'optionValues',
        type: 'string'
    }, {
        name: 'inSkuAttributeIds',
        type: 'array'
    }, {
        name: 'minExpression',
        type: 'string'
    }, {
        name: 'maxExpression',
        type: 'string'
    }, {
        name: 'attributeConstraintDomain',
        type: 'object'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/singleAttributeConstraints',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
