/**
 * Created by nan on 2018/3/12.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.model.ProductMaterialViewTypeVersionFiveModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
            useNull: true
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'displayName',
            type: 'string',
            convert: function (value, record) {
                return record.get('name') + '(' + record.getId() + ')';
            }
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: "com.qpp.cgp.domain.bom.ProductMaterialViewType"
        }, {
            name: 'materialPath',
            type: 'string'
        }, {
            name: 'materialViewType',
            type: 'object'
        }, {
            name: 'productConfigDesignId',
            type: 'int'
        }, {
            name: 'productMaterialViewTypeId',
            type: 'string'
        }, {
            name: 'conditionExpression',
            type: 'string'
        },
        {
            name: 'userAssign',
            type: 'string',
            defaultValue: null
        },
        {
            name: 'materialSelector',
            type: 'object',
            defaultValue: undefined

        },
        {
            name: 'pageContentQty',
            type: 'object'
        }, {
            name: 'productMaterialViewTypeIds',
            type: 'object'
        }, {
            name: 'placeHolderVdCfgs',
            type: 'array'
        }, {
            name: 'variableDataSourceQtyCfgs',
            type: 'array'
        }, {
            name: 'pageContentRange',
            type: 'object'
        }, {
            name: 'pageContentIndexExpression',
            type: 'string'
        }, {
            name: 'condition',
            type: 'object'
        }, {
            name: 'productMaterialViewTemplateConfigIds',
            type: 'array'
        }, {
            name: 'actualWidthEx',
            type: 'object'
        }, {
            name: 'actualHeightEx',
            type: 'object'
        }, {
            name: 'actualUnit',
            type: 'string'
        }, {
            name: 'conditionDTO',
            type: 'object'
        },
        {
            name: 'mvtGroup',
            type: 'string'
        },
        {
            name: 'defaultTheme',
            type: 'object'
        },
        {//选出默认主题的表达式，优先级比defaultTheme高
            name: 'defaultThemeExpression',
            type: 'object'
        },  {//选出默认主题的表达式，优先级比defaultTheme高
            name: 'defaultThemeExpressionDTO',
            type: 'object'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productMaterialViewTypes',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
