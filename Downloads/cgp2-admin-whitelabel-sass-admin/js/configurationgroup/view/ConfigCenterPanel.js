Ext.define("CGP.configurationgroup.view.ConfigCenterPanel",{
    extend: "Ext.panel.Panel",
    alias: 'widget.centerpanel',
    region: 'center',
    layout: 'fit',
    itemId: 'configCenterPanel',
    header: false,

    initComponent: function(){
        var me = this;
        //me.title = ' ';
        me.callParent(arguments);
    }
});