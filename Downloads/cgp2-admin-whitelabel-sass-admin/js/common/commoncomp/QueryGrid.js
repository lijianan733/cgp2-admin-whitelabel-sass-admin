Ext.define("CGP.common.commoncomp.QueryGrid", {
    extend: 'Ext.container.Container',
    alias: 'widget.searchcontainer',

    filterCfg: null,
    gridCfg: null,
    grid: null,
    filter: null,
    layout: "border",
    width: 850,
    height: 550,
    autoScroll: true,
    initComponent: function () {
        var me = this;
        me.callParent(arguments);

        me.filterCfg = Ext.merge({
            searchActionHandler: function (btn) {
                btn.ownerCt.ownerCt.ownerCt.grid.getStore().loadPage(1);
            },
            itemId: 'filter',
            region: 'north',
            filterParams: me.queryParams//传入的过滤键值对集合
        }, me.filterCfg);
        me.filter = Ext.create("Ext.ux.filter.Panel", me.filterCfg);

        me.gridCfg = Ext.merge(me.gridCfg, {
            filter: me.filter,
            itemId: 'grid',
            autoScroll: true,
            region: 'center'
        }, me.gridCfg);
        me.grid = Ext.create("Ext.ux.grid.Panel", me.gridCfg);

        me.add(me.filter);
        me.add(me.grid);
    }
});