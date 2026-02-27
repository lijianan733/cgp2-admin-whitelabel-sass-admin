/**
 * Created by nan on 2020/2/19.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.managematerialviewtypetemplateConfig.model.TemplateConfigModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'groupId',
            type: 'string'
        },
        {
            name: 'fileType',
            type: 'string'
        },
        {
            name: 'isCheck',
            type: 'boolean'
        },
        {
            name: 'clazz',
            type: 'string'
        }, {
            name: 'materialViewTypePreprocessConfigId',
            type: 'string'
        }, {
            name: 'standard',
            type: 'string'
        }, {
            name: 'standardValueEx',
            type: 'object'
        }, {
            name: 'palettes',
            type: 'array'
        }, {
            name: 'isExclude',
            type: 'boolean'
        }, {
            name: 'dpi',
            type: 'number'
        }, {
            name: 'variables',
            type: 'object'
        }, {
            name: 'fileUrl',
            type: 'string'
        },
        {
            name: 'display',
            type: 'string',
            convert: function (value, record) {
                var result = record.get('fileType') + '_';
                if (value == 'com.qpp.cgp.domain.preprocess.template.PreprocessTemplateConfig') {
                    result += '预处理模板';
                } else if (value == 'com.qpp.cgp.domain.preprocess.template.StaticProductMaterialViewTypeTemplateConfig') {
                    result += '静态尺寸模板';
                } else {
                    result += '可变尺寸模板';
                }
                result += '(' + record.getId() + ')';
                return result;
            }
        },
        {
            name: 'fileName',
            type: 'string'
        },
        {
            name: 'optionProjections',
            type: 'object'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/templateConfigController',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
})
