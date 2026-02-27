Ext.define('CGP.productcategory.view.info.attribute.ButtonPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.buttonpanel',
    mixins: ['Ext.ux.util.ResourceInit'],

    layout: 'column',



    defaults: {
        columnWidth: 1
    },
    bodyStyle: 'margin-top:200px',

    initComponent: function () {

        var me = this;



        me.items = [{
            xtype: 'button',
            text: i18n.getKey('add'),
            iconCls: 'icon_ux_left',
            action: 'addAttribute'

        }, {
            style: 'margin-top:20px',
            xtype: 'button',
            text: i18n.getKey('remove'),
            iconCls: 'icon_ux_right',
            action: 'removeAttribute'
        }];

        me.callParent(arguments);
    }


})