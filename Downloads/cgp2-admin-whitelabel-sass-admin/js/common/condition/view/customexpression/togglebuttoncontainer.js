/**
 * @Description:
 * @author nan
 * @date 2023/10/20
 */
Ext.define('CGP.common.condition.view.customexpression.togglebuttoncontainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.toggle_button_container',
    layout: 'fit',
    text: '',
    collapsible: true,
    PanelItemId: '',
    initComponent: function () {
        var me = this;
        var config = me.items || [{
            xtype: 'togglebutton',
            text: `<font color="#666">${me.text}</font>`,
            PanelItemId: me.PanelItemId,
            width: 120,
            handler: function (btn) {
                var rightPanel = btn.up('[itemId=contentPanel]');
                var extraFeature = rightPanel.getComponent('extraFeature');
                var panel = extraFeature.getComponent(btn.PanelItemId);
                panel.setVisible(panel.hidden);
                panel.expand();
                btn.ownerCt.initialConfig.items[0].value = !(panel.hidden);

                var extraFeature = rightPanel.query('[itemId=extraFeature]')[0];
                var count = 0;
                extraFeature.items.items.map(function (item) {
                    if (item.hidden == false) {
                        count++;
                    }
                    if (item != panel) {
                        item.collapse();
                    }
                });
                extraFeature.setVisible(count != 0);
            }
        }]
        me.items = config;
        me.callParent();
        me.initialConfig.items = config;
    }
})