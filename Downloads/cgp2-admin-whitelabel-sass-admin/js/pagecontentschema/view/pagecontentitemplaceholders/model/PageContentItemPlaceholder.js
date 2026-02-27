/**
 * Created by nan on 2020/8/27.
 */
Ext.define('CGP.pagecontentschema.view.pagecontentitemplaceholders.model.PageContentItemPlaceholder', {
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
            defaultValue: 'com.qpp.cgp.domain.bom.PageContentItemPlaceholder'
        },
        {
            name: 'itemSelector',
            type: 'string'
        }, {
            name: 'itemAttributes',
            type: 'array'
        }, {
            name: 'dataSource',
            type: 'object'
        }, {
            name: 'expression',
            type: 'string'
        }, {
            name: 'variableDataIndexExpression',
            type: 'string'
        }]
});
