/**
 * Created by admin on 2020/8/12.
 */
Ext.define("CGP.orderlineitem.view.jobtaskdistribute.model.PlaceHolders", {
    extend: 'Ext.data.Model',
    /**
     * @cfg {Object[]} fields
     * field配置
     */
    fields: [
        {
            name: 'id',
            type: 'string'
        },
        {
            name: 'contentTypeId',
            type: 'int'
        },
        {
            name: 'sortOrder',
            type: 'int'
        },
        {
            name: 'contentSortOrder',
            type: 'int'
        },
        {
            name: 'x',
            type: 'number'
        },
        {
            name: 'y',
            type: 'number'
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
            name: 'rotate',
            type: 'number'
        },
        {
            name: 'positionInitialized',
            type: 'boolean'
        },
        {
            name: 'isSignature',
            type: 'boolean'
        },
        {
            name: 'composingElement',
            type: 'object'
        },
        {
            name: 'isRepeat',
            type: 'boolean'
        },
        {
            name: 'angleLines',
            type: 'string'
        }
    ]
});