/**
 * Created by admin on 2020/8/12.
 */
Ext.define("CGP.orderlineitem.view.jobtaskdistribute.model.PageLocal", {
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
            name: 'content',
            type: 'string'
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
            name: 'status',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue:'com.qpp.job.domain.runtime.Page'
        }
    ]
});