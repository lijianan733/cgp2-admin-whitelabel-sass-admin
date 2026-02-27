/**
 * Created by admin on 2020/8/13.
 */
Ext.define('CGP.orderlineitem.view.jobtaskdistribute.view.StatusLog', {
    extend: 'Ext.grid.Panel',
    requires: [
        "CGP.orderlineitem.view.jobtaskdistribute.model.StatusLog",
        "CGP.orderlineitem.view.jobtaskdistribute.store.StatusLog"
    ],
    width: '100%',
    padding: 10,
    //cfgModel:Ext.create("CGP.orderlineitem.view.jobtaskdistribute.model.JobDirective"),
    data: null,
    initComponent: function () {
        var me = this;
        me.store=Ext.create("CGP.orderlineitem.view.jobtaskdistribute.store.StatusLog",{data:me.data})
        me.columns = [
            {xtype: 'rownumberer'},
            {
                xtype: 'gridcolumn',
                text: i18n.getKey('status') + i18n.getKey('log'),
                dataIndex: 'status',
                flex: 1,
                sortable: false,
                renderer: function (value, metadata, record, row, col, store) {
                    var statusDate='';
                    if (!Ext.isEmpty(record.raw['modifiedDate'])) {
                        statusDate=Ext.Date.format(new Date(parseInt(record.raw['modifiedDate'])),'Y/m/d H:i') ;
                    }
                    return '<div style="white-space:normal;">于' + statusDate + ' jobTask:'+record.raw['jobTaskId']+'分发状态被修改为:'+record.raw['status']+'</div>'
                }
            }
        ];
        me.callParent(arguments);
    }
})