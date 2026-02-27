/**
 * Created by admin on 2020/8/12.
 */
Ext.define("CGP.orderlineitem.view.jobtaskdistribute.model.StatusLog", {
    extend: 'Ext.data.Model',
    /**
     * @cfg {Object[]} fields
     * field配置
     */
    fields: [
        {
            name: 'status',
            type: 'string'
        },
        {
            name: 'jobTaskId',
            type: 'int'
        },
        {
            name: 'modifiedDate',
            type: 'number'
        }
    ]
});