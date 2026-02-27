/**
 * @Description:最外层的panel,把所有的组件包含在一起
 * @author nan
 * @date 2022/9/6
 */
Ext.Loader.syncRequire([
    'CGP.cost.view.SummaryPanel',
    'CGP.cost.view.FilterPanel',
    'CGP.cost.view.DetailPanel'
])
Ext.define('CGP.cost.view.OutPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.outpanel',
    filterCfg: null,
    costSummaryCfg: null,
    detailGridCfg: null,
    layout: {
        type: 'vbox'
    },
    defaults: {
        width: '100%'
    },
    store: null,
    tbarCfg: null,
    constructor: function (config) {
        var me = this;
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        var summaryPanel = Ext.create('CGP.cost.view.SummaryPanel', Ext.Object.merge({
            itemId: 'summary',
            autoLoad: false,
            flex: null,
            region: 'north',
        }, me.costSummaryCfg));
        var filterPanel = Ext.create('CGP.cost.view.FilterPanel', Ext.Object.merge({
            itemId: 'filter',
            region: 'north',
            searchActionHandler: function () {
                var filter = this.ownerCt.ownerCt;
                /* var summary = filter.ownerCt.getComponent('summary');
                 if (summary) {
                     summary.refreshData();
                 }*/
                if (filter.isValid()) {
                    var centerGrid = filter.ownerCt.getComponent('centerGrid');
                    centerGrid.store.load();
                }
            },
        }, me.filterCfg));
        var detailGrid = Ext.create('CGP.cost.view.DetailPanel', Ext.Object.merge({
            itemId: 'centerGrid',
            autoLoad: false,
            flex: 1,
        }, me.detailGridCfg));
        me.items = [
            Ext.Object.merge({
                xtype: 'uxstandardtoolbar',
                region: 'north',
                hiddenButtons: ['create', 'delete', 'import', 'export', 'help', 'config', 'clear'],
                btnRead: {
                    xtype: 'displayfield',
                    width: 70,
                    value: '<font color=green style="font-weight: bold; font-size: 13px;">' + i18n.getKey('统计总览') + '</font>'
                }
            }, me.tbarCfg),
            summaryPanel,
            filterPanel,
            detailGrid
        ];
        me.callParent();
        me.on('afterrender', function () {
            var me = this;
            var centerGrid = me.getComponent('centerGrid');
            var filter = me.getComponent('filter');
            var summary = me.getComponent('summary');
            if (filter) {
                var centerGridStore = centerGrid.store;
                centerGridStore.on('beforeload', function (store) {
                    var p = store.getProxy();
                    p.filter = filter;
                    console.log(filter.id);
                }, {
                    filter: filter
                });
                centerGridStore.load();
                var summaryStore = summary.store;
                summaryStore.on('beforeload', function (store) {
                    var p = store.getProxy();
                    p.filter = filter;
                    console.log(filter.id);
                }, {
                    filter: filter
                })
                summaryStore.load();
            }
        });
    }
})