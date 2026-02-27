Ext.define('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.model.pcsPreprocessModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    /**
     * @cfg {Object[]} fields
     * field配置
     */
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.PCSPreprocessPlaceholderConfig'
        }, {
            name: 'description',
            type: 'string'
        },
        {
            name: 'selector',
            type: 'string'
        }, {
            name: 'value',
            type: 'object'
        }, {
            name: 'operationType',
            type: 'string'
        }, {
            name: 'index',
            type: 'int'
        }, {
            name: 'valueType',
            type: 'string'
        }, {
            name: 'graphData',
            type: 'object'
        }, {
            name: 'condition',
            type: 'object'
        }, {
            name: 'calculateSelector',
            type: 'object'
        }, {
            name: 'cycleNumber',
            type: 'object'
        }, {
            name: 'condition',
            type: 'object'
        }, {
            name: 'selectors',
            type: 'array'
        }]
});
