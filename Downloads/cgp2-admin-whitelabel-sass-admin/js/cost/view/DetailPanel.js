/**
 * @Description:
 * @author nan
 * @date 2022/9/5
 */
Ext.define('CGP.cost.view.DetailPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.detailpanel',
    region: 'center',
    xtype: 'grid',
    itemId: 'centerGrid',
    /*   features: [{
           ftype: 'summary',
           summaryTableCls: 'none',//
           dock: 'bottom'
       }],*/
    checkChartHandler: null,//查看图表的跳转
    constructor: function (config) {
        var me = this;
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.bbar = {
            xtype: 'pagingtoolbar',
            displayInfo: true,
            store: me.store
        };
        me.callParent(arguments);
    }
})
