/**
 * @author xiu
 * @date 2023/10/24
 */
Ext.define("CGP.promotion.view.PromotionDiscountContainer", {
    extend: 'Ext.container.Container',
    alias: 'widget.PromotionDiscountContainer',
    isFormField: true,
    isDirty: function () {
        return this.dirty;
    },
    clearInvalid: function () {
        var me = this;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            item.clearInvalid && item.clearInvalid();
        }
    },
    isValid: function () {
        return true;
    },
    getName: function () {
        return this.name;
    },
    diyGetValue: function () {
        var me = this,
            promotionDiscount = me.getComponent('promotionDiscount'),
            items = promotionDiscount.items.items;

        return promotionDiscount.diyGetValue();
    },
    diySetValue: function (data) {
        var me = this,
            promotionDiscount = me.getComponent('promotionDiscount');
        promotionDiscount.diySetValue(data);
    },
    setAddBtnVisible: function (type, visible) {
        var me = this,
            splitbar = me.getComponent('splitbar'),
            container = splitbar.getComponent('container'),
            menu = container.menu,
            order = menu.getComponent('order'),
            product = menu.getComponent('product');

        type === 'order' ? order.setVisible(visible) : product.setVisible(visible);
    },
    initComponent: function () {
        const me = this;
        me.items = [
            {
                xtype: 'splitbar',
                width: '100%',
                itemId: 'splitbar',
                margin: 5,
                colspan: 2,
                title: '<font color="green" style="font-weight: bold">' + i18n.getKey('优惠策略') + '</font>',
                items: [
                    {
                        xtype: 'displayfield',
                        width: 60,
                        value: '<font color="green" style="font-weight: bold">' + i18n.getKey('优惠策略') + '</font>',
                    },
                    {
                        xtype: 'button',
                        width: 80,
                        iconCls: 'icon_add',
                        itemId: 'container',
                        text: i18n.getKey('add'),
                        menu: [
                            {
                                text: i18n.getKey('订单价格优惠'),
                                itemId: 'order',
                                menu: [
                                    {
                                        text: i18n.getKey('总价优惠'),
                                        itemId: 'subtotal',
                                        handler: function (btn) {
                                            var button = btn.up('button'),
                                                form = button.ownerCt.ownerCt,
                                                promotionDiscount = form.getComponent('promotionDiscount');
                                            
                                            promotionDiscount.addItem({strategy: 'Percentage'}, 'subtotal');
                                        }
                                    },
                                    {
                                        text: i18n.getKey('运费/税费优惠'),
                                        itemId: 'shippingFeeOrTax',
                                        handler: function (btn) {
                                            var button = btn.up('button'),
                                                form = button.ownerCt.ownerCt,
                                                promotionDiscount = form.getComponent('promotionDiscount');
                                            
                                            promotionDiscount.addItem({strategy: 'Percentage'}, 'shippingFeeOrTax');
                                        }
                                    }
                                ],
                            },
                            {
                                text: i18n.getKey('产品价格优惠'),
                                itemId: 'product',
                                handler: function (btn) {
                                    var button = btn.up('button'),
                                        form = button.ownerCt.ownerCt,
                                        promotionDiscount = form.getComponent('promotionDiscount');
                                    
                                    promotionDiscount.addItem({strategy: 'Percentage'}, 'product');
                                }
                            },
                        ],
                    },
                    {
                        xtype: 'button',
                        iconCls: 'icon_help',
                        tooltip: '订单总价优惠 与 产品价格优惠 互斥,二者存一!',
                        componentCls: "btnOnlyIcon",
                    }
                ]
            },
            {
                xtype: 'promotion_discount',
                itemId: 'promotionDiscount',
                name: 'promotionDiscount',
                margin: '5 25 0 25',
                width: '100%',
            }
        ]
        me.callParent();
    }
})