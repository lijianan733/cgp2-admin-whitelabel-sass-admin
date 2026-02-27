/**
 * Created by nan on 2018/5/21.
 */
Ext.define('CGP.userdesigncategory.model.UserDesignModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'currency',
            type: 'object'
        },
        {
            name: 'displayName',
            type: 'string'
        },
        {
            name: 'format',
            type: 'string'
        },
        {
            name: 'height',
            type: 'int'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'price',
            type: 'int'
        },
        {
            name: 'userDesignCategory',
            type: 'object'
        },
        {
            name: 'width',
            type: 'int'
        }
    ]
})