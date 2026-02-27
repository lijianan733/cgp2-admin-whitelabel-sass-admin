/**
 * Created by admin on 2019/4/11.
 */
Ext.define("CGP.dssheettemplateconfig.model.ImpPlaceholder", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
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
            name: 'index',
            type: 'int'
        },
        {
            name: 'contentType',
            type: 'string'
        },
        {
            name: 'contentSortOrder',
            type: 'int'
        },
        {
            name: 'x',
            type: 'float'
        },
        {
            name: 'y',
            type: 'float'
        },
        {
            name: 'width',
            type: 'float'
        },
        {
            name: 'height',
            type: 'float'
        },
        {
            name: 'rotate',
            type: 'float'
        }
    ]
});