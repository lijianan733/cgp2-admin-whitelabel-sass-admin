/**
 * Created by miao on 2021/10/11.
 */
Ext.define('CGP.virtualcontainerobject.view.argument.OutCenterPanel', {
    extend: 'Ext.panel.Panel',
    layout: 'border',
    region: 'center',
    initComponent: function () {
        var me = this;

        var centerContainer = Ext.create('CGP.virtualcontainerobject.view.argument.CenterContainer', {
            itemId: 'centerContainer',
        });
        me.items = [
            centerContainer
        ];
        me.callParent();
    }
})
