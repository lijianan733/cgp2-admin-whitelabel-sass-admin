Ext.define('CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.model.SimplifySBOMMaterialViewType', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        }, {
            name: 'materialPath',
            type: 'string'
        }, {
            name: 'materialViewType',
            type: 'object'
        }, {
            name: 'pageContentQty',
            type: 'object'
        }, {
            name: 'productConfigDesignId',
            type: 'int'
        }, {
            name: 'name',
            type: 'string'
        },
        {
            name: 'pageContentRange',
            type: 'object'
        },
        {
            name: 'pageContentIndexExpression',
            type: 'string'
        },
        {
            name: 'placeHolderVdCfgs',
            type: 'array'
        },
        {
            name: 'variableDataSourceQtyCfgs',
            type: 'array'
        }, {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.simplifyBom.SimplifyMaterialViewType'
        },
        {
            name: 'productMaterialViewTemplateConfigIds',
            type: 'array'
        }, {
            name: 'condition',
            type: 'object'
        },
        {
            name: 'actualWidthEx',
            type: 'object'
        }, {
            name: 'actualHeightEx',
            type: 'object'
        }, {
            name: 'actualUnit',
            type: 'string'
        },
        {
            name: 'conditionDTO',
            type: 'object'
        },
        //用于把多个pmvt或者smvt分为一组
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
        url: adminPath + 'api/simplifyMaterialViewType',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
