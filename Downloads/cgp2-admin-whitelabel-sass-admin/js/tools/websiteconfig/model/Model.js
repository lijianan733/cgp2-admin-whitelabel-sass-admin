/**
 * @Description:
 * @author nan
 * @date 2023/2/22
 */
Ext.define('CGP.tools.websiteconfig.model.Model', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: ['website', 'key', 'value', {
        name: 'status',
        type: 'string'
    }, {
        name: 'isGlobal',
        type: 'boolean'
    }, '_id', 'description', 'valueType', 'clazz'],
})