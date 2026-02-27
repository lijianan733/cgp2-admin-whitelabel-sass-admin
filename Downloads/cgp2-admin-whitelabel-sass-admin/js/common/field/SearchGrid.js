Ext.define("CGP.common.field.SearchGrid",{
    extend : 'Ext.container.Container',
    alias : 'widget.searchgrid',

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