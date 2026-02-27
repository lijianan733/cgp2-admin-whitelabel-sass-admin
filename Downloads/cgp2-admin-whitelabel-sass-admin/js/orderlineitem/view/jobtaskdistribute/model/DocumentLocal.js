/**
 * Created by admin on 2020/8/12.
 */
Ext.define("CGP.orderlineitem.view.jobtaskdistribute.model.DocumentLocal", {
    extend: 'Ext.data.Model',
    /**
     * @cfg {Object[]} fields
     * field配置
     */
    fields: [
        {
            name: 'location',
            type: 'string'
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
            name: 'sheetIds',
            type: 'array'
        },
        {
            name: 'content',
            type: 'string'
        },
        {
            name: 'barCode',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue:'com.qpp.job.domain.runtime.JobTaskDistributeDocument'
        }
    ]
});