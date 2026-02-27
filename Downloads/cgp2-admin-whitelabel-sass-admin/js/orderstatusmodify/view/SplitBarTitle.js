/**
 * @author xiu
 * @date 2023/8/24
 */
Ext.define('CGP.orderstatusmodify.view.SplitBarTitle', {
    extend: 'Ext.ux.toolbar.SplitBar',
    alias: 'widget.splitBarTitle',
    margin: '0 0 5 6',
    border: '0 0 1 0',
    padding: '3px 0 3px 8px',
    width: '100%',
    colspan: 2,
    title: '',
    text: '',
    addButton: null,
    initComponent: function () {
        var me = this

        me.items = Ext.Array.merge([
            {
                xtype: 'button',
                itemId: 'collapse',
                componentCls: "btnOnlyIcon",
                isSpread: true,
                text: '<font color="green" style="font-weight: bold;text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);font-size: 15px" >' + i18n.getKey(me.title) + '</font>',
                handler: function (btn) {
                    const form = btn.ownerCt.ownerCt,
                        container = form.getComponent('container');

                    container.setVisible(btn.isSpread = !btn.isSpread);
                }
            },
            {
                xtype: 'button',
                itemId: 'title',
                isSpread: true,
                componentCls: "btnOnlyIcon",
                text: '<font color="green" style="font-weight: bold;text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);font-size: 20px" >' + i18n.getKey(me.text) + '</font>',
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