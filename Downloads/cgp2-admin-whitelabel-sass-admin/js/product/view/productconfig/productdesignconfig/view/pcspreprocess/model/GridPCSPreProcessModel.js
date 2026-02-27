/**
 * Created by nan on 2021/6/5
 */

Ext.define('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.model.GridPCSPreProcessModel', {
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
            defaultValue: 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.PCSGridTemplatePreprocessCommonConfig'
        }, {
            name: 'description',
            type: 'string'
        },
        {
            name: 'index',
            type: 'int'
        },
        {
            name: 'condition',
            type: 'object'
        }, {
            name: 'conditionDTO',
            type: 'object'
        },
        {
            name: 'itemQty',
            type: 'object'
        }, {
            name: 'preprocessItems',
            type: 'array'
        }, {
            name: 'layout',
            type: 'object'
        }, {
            name: 'itemSize',
            type: 'object'
        }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pagecontentschemapreprocessconfig/{sourceId}/placeholders',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
