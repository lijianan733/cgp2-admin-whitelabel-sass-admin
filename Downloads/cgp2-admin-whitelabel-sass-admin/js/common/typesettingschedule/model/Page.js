/**
 * Created by admin on 2020/8/12.
 */
Ext.define("CGP.common.typesettingschedule.model.Page", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    /**
     * @cfg {Object[]} fields
     * field配置
     */
    fields: [
        {
            name: '_id',
            type: 'int',
            useNull: true
        },
        {
            name: 'sortOrder',
            type: 'int'
        },
        {
            name: 'width',
            type: 'number'
        },
        {
            name: 'height',
            type: 'number'
        },
        {
            name: 'qty',
            type: 'int'
        },
        {
            name: 'file',
            type: 'string'
        },
        {
            name: 'params',
            type: 'object'
        },
        {
            name: 'batchId',
            type: 'int'
        },
        {
            name: 'pageConfigId',
            type: 'int'
        },
        {
            name: 'status',
            type: 'string'
        },
        {
            name: 'content',
            type: 'string'
        },
        {
            name: 'jobConfigId',
            type: 'int'
        },
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'uuid',
            type: 'string'
        }
    ],
    autoLoad: true,

    proxy: {
        type: 'uxrest',
        url: composingPath + 'api/pages',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});