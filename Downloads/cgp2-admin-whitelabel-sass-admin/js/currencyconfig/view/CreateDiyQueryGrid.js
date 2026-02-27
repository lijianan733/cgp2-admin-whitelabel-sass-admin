/**
 * @author xiu
 * @date 2025/1/2
 */
Ext.define("CGP.currencyconfig.view.CreateDiyQueryGrid", {
    extend: 'Ext.container.Container',
    alias: 'widget.createDiyQueryGrid',
    filterCfg: null,
    gridCfg: null,
    grid: null,
    filter: null,
    layout: "border",
    width: 850,
    height: 550,
    autoScroll: true,
    rightGridCfg: null,
    createBtnFun: Ext.emptyFn,
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
            region: 'center',
            selModel: Ext.create("Ext.selection.CheckboxModel", {
                mode: "SINGLE", // 设置为单选模式
                allowDeselect: true, // 允许取消选择
            })
        }, me.gridCfg);

        me.rightGridCfg = Ext.Object.merge({
            region: 'east',
            itemId: 'rightGridCfg',
            autoScroll: true,
        }, me.rightGridCfg);

        me.grid = Ext.create("Ext.ux.grid.Panel", me.gridCfg);
        me.rightGridCfg = Ext.create("Ext.grid.Panel", me.rightGridCfg);

        me.add(me.filter);
        me.add(me.grid);
        me.add(me.rightGridCfg);
    }
});