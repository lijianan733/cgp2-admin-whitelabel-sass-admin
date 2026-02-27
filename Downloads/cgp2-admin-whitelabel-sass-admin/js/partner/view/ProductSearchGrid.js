/**
 * Created by nan on 2017/12/11.
 * 自定义的弹窗使用的grid
 */
Ext.define("CGP.partner.view.ProductSearchGrid",{
    extend : 'Ext.container.Container',
    alias : 'widget.productSearchcontainer',
    filterCfg : null,
    gridCfg : null,
    grid : null,
    filter : null,
    layout : "border",
    width : 850,
    height : 550,
    initComponent : function(){
        var me = this;
        me.callParent(arguments);
        me.filterCfg = Ext.merge({
            searchActionHandler: function () {
                me.grid.getStore().loadPage(1);
            },
            itemId: 'filter',
            region: 'north'
        },me.filterCfg);
        me.filter = Ext.create("Ext.ux.filter.Panel",me.filterCfg);
        me.gridCfg = Ext.merge(me.gridCfg,{
            filter : me.filter,
            itemId: 'grid',
            region: 'center'
        },me.gridCfg);
        me.grid = Ext.create("Ext.ux.grid.Panel",me.gridCfg);
        me.add(me.filter);
        me.add(me.grid);
    }
});