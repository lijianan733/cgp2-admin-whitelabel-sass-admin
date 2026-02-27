/**
 * @author xiu
 * @date 2023/8/24
 */
Ext.define('CGP.orderitemsmultipleaddress.view.singleAddress.tool.splitBarTitle', {
    extend: 'Ext.ux.toolbar.SplitBar',
    alias: 'widget.splitBarTitle',
    margin: '0 0 3 6',
    border: '0 0 1 0',
    padding: '3px 0 3px 8px',
    width: '100%',
    colspan: 2,
    title: null,
    addButton: null,
    initComponent: function () {
        var me = this;

        me.items = Ext.Array.merge([
            {
                xtype: 'button',
                iconCls: 'icon_spread',
                itemId: 'collapse',
                componentCls: "btnOnlyIcon",
                isSpread: true,
                handler: function (btn) {
                    const form = btn.ownerCt.ownerCt,
                        iconCls = btn.isSpread ? 'icon_pack' : 'icon_spread',
                        container = form.getComponent('container');

                    btn.setIconCls(iconCls);
                    container.setVisible(btn.isSpread = !btn.isSpread);
                }
            },
            {
                xtype: 'button',
                itemId: 'title',
                isSpread: true,
                componentCls: "btnOnlyIcon",
                text: '<font color="green" style="font-weight: bold;text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)" >' + i18n.getKey(me.title) + '</font>',
                handler: function (btn) {
                    const form = btn.ownerCt,
                        collapse = form.getComponent('collapse');
                    collapse.handler(collapse);
                }
            },
        ], me.addButton || []);
        me.callParent();
    }
})