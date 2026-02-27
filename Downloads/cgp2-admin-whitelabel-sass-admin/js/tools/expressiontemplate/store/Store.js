/**
 * @Description:
 * @author nan
 * @date 2023/2/16
 */
Ext.define('CGP.tools.expressiontemplate.store.Store', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    fields: ['expression', 'name', 'tag', 'description', '_id', 'clazz', 'resultType'],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/expressionTemplates',
        reader: {
            idProperty: '_id',
            type: 'json',
            root: 'data.content'
        }
    },
});
