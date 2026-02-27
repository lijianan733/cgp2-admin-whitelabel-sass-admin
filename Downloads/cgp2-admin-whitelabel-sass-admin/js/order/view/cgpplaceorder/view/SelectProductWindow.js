/**
 * Created by nan on 2019/8/24.
 */
Ext.define('CGP.order.view.cgpplaceorder.view.SelectProductWindow', {
    extend: 'CGP.common.productsearch.ProductSearchWin',
    width: 1000,
    height: 600,
    title: i18n.getKey('select') + i18n.getKey('product'),
    bbarCfg: {
        btnConfirm: {
            xtype: 'button',
            width: 100,
            text: i18n.getKey('confirm'),
            iconCls: 'icon_agree',
            handler: function (btn) {
                var win = btn.ownerCt.ownerCt;
                var selectedRecord = win.getSelection()[0];
                if (selectedRecord) {
                    var type = selectedRecord.get('type');
                    var controller = Ext.create('CGP.order.view.cgpplaceorder.controller.Controller');
                    var productId = selectedRecord.getId();
                    if (type == 'SKU') {
                        controller.jumpOtherPage(productId);
                    } else {
                        JSOpen({
                            id: 'CGPPlaceOrderpage2',
                            url: path + "partials/order/cgpplaceorder/cgpplaceordergeneratesku.html?productId=" + productId + '&type=' + type,
                            title: i18n.getKey('配置sku属性'),
                            refresh: true
                        })
                    }
                    win.close();
                } else {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请选择一产品进行操作'));
                }
            }
        },
        btnCancel: {
            hidden: true
        }
    },
    initComponent: function () {
        var me = this;
        me.gridCfg = {
            viewConfig: {
                enableTextSelection: true//设置grid中的文本可以选择
            },
            multiSelect: false,
            selType: 'rowmodel',
            store: Ext.create('CGP.common.productsearch.store.ProductStore')
        };
        me.callParent();
    }
})
