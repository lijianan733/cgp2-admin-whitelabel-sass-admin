Ext.define('CGP.product.view.producepage.ProducePageWin', {
    extend: 'Ext.window.Window',

    layout: 'fit',
    modal: true,
    initComponent: function () {
        var me = this;

        var controller = Ext.create('CGP.product.controller.Controller');
        me.title = i18n.getKey('choosePage');
        me.bbar = ['->', {
            xtype: 'button',
            text: i18n.getKey('producePage'),
            handler: function () {
                var data = me.grid.getSelectionModel().getSelection();
                if (data) {
                    var pageId = data[0].get('id');
                    var pageName = data[0].get('name');
                    controller.producePage(pageId, me, pageName);
                }
            }
        }, {
            type: 'button',
            text: i18n.getKey('cancel'),
            handler: function () {
                me.close();
            }
        }];
        me.items = [Ext.create('CGP.product.view.producepage.CmsPageGrid', {
            website: me.website
        })];
        me.callParent(arguments);
        me.grid = me.down('grid');
    }
})