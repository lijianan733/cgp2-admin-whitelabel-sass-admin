/**
 * Created by nan on 2021/4/15
 */
Ext.define('CGP.cost.view.FilterPanel', {
    extend: 'Ext.ux.filter.Panel',
    alias: 'widget.filterpanel',
    bodyStyle: {
        borderColor: 'silver'
    },
    constructors: function () {
        var me = this;
        me.callParent(arguments);
    },
    title: null,
    initComponent: function () {
        var me = this;
        me.header = {
            style: 'background-color:white;',
            color: 'black',
            title: '<font color=green>' + i18n.getKey(me.title) + '</font>',
            border: '0 0 0 0'
        };
        me.callParent();
    }
})