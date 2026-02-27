/**
 * Created by nan on 2019/12/25.
 */
Ext.define("CGP.materialviewtype.model.PageContentItemPlaceholderModel", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'itemSelector',
            type: 'string'
        },
        {
            name: 'itemAttributes',
            type: 'array'
        },
        {
            name: 'dataSource',
            type: 'object'
        },
        {
            name: 'expression',
            type: 'string'
        }, {
            name: 'variableDataIndexExpression',
            type: 'string'
        }, {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.bom.PageContentItemPlaceholder'
        }
    ]
});
