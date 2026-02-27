/**
 * 批量生成页面时，为product类型页面选择产品的窗口
 */
Ext.define('CGP.cmspage.view.BatchCreateSelectProductWin', {
    extend: 'Ext.window.Window',

    modal: true,
    layout: 'fit',
    constrain: true,
    autoShow: true,

    initComponent: function () {
        var me = this;
        me.listeners = {
            'close': function () {
                me.productList.collection.clear();
            }
        },

        me.title = i18n.getKey('product'),
            me.bbar = ['->', {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                handler: function () {
                    var productList = me.productList;
                    var pageListObj = productList.getValue();
                    var selectProList = productList.getlist();
                    Ext.getCmp('createPageWin').addProductData(selectProList);
                    Ext.getCmp('createPageWin').addPageData(pageListObj);
                    productList.collection.clear();
                    me.close();
                }
            }, {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                handler: function (btn) {
                    me.close();
                }
            }],
            me.items = [Ext.create("CGP.cmspage.view.ProductList", {
                websiteId: me.websiteId,
                pageId: me.pageId,
                itemId: 'productList',
                collection: me.collection
            })];
        me.callParent(arguments);
        me.productList = me.getComponent('productList');
    }
})