Ext.define('CGP.order.view.modifyPriceNumbers.WindowEdit', {
    extend: 'Ext.window.Window',
    alias: 'widget.modifyPriceNumbersedit',
    requires: ["CGP.order.store.OrderLineItem", "Ext.ux.grid.Panel"],

    modal: true,
    border: false,
    autoScroll: true,
    //layout: 'border',
    layout: 'fit',
    config: {
        orderId: null,
        controller: null
    },
    /* width: 800,
     height: 600,*/

    initComponent: function () {
        var me = this;

        me.title = i18n.getKey('modifyPriceNumbers');
        me.store = Ext.create('CGP.order.store.PriceNumbers', {
            orderId: me.orderId
        });


        me.callParent(arguments);


        me.form = Ext.create('Ext.form.Panel', {
            autoScroll: true,
            //region: "center",
            width: 850,
            height: 450,
            //layout: 'vbox',
            items: [
                {
                    xtype: 'displayfield',
                    fieldLabel: i18n.getKey('orderNumber'),
                    labelAlign: 'right',
                    name: 'orderNumber',
                    //width: '100%',
                    width: 100,
                    value: me.orderNumber
                },
                {
                    xtype: 'textarea',
                    fieldLabel: i18n.getKey('revision'),
                    labelAlign: 'right',
                    width: 600,
                    allowBlank: false,
                    msgTarget: 'side',
                    name: 'remark'
                },
                {
                    xtype: 'gridfield',
                    fieldLabel: i18n.getKey('orderLineItem'),
                    labelWidth: 100,
                    width: '98%',
                    labelAlign: 'right',
                    id: 'gridfield',
                    gridConfig: {
                        simpleSelect: true,
                        menuDisabled: false,
                        store: me.store,
                        width: '100%',
                        region: "center",
                        selModel: {
                            selection: "rowmodel",
                            mode: "SINGLE"
                        },
                        columns: [
                            {
                                xtype: 'actioncolumn',
                                itemId: 'actioncolumn',
                                sortable: false,
                                resizable: false,
                                menuDisabled: true,
                                width: 45,
                                align: 'center',
                                tdCls: 'vertical-middle',
                                items: [
                                    {
                                        iconCls: 'icon_edit icon_margin',
                                        itemId: 'actionModify',
                                        tooltip: i18n.getKey('modifyInformation'),
                                        handler: function (view, rowIndex) {
                                            //更新订单项价格和数量
                                            var grid = me.form.getForm().findField('orderLineItem');
                                            me.controller.updatePriceNumbers(grid, rowIndex);
                                        }
                                    }
                                ]

                            },
                            {
                                text: i18n.getKey('seqNo'),
                                dataIndex: 'seqNo',
                                tdCls: 'vertical-middle',
                                align: 'center',
                                sortable: false,
                                menuDisabled: true,
                                width: 70

                            },
                            {
                                dataIndex: 'price',
                                text: i18n.getKey('price'),
                                tdCls: 'vertical-middle',
                                align: 'center',
                                width: 70,
                                menuDisabled: true
                            },
                            {
                                dataIndex: 'qty',
                                text: i18n.getKey('qty'),
                                tdCls: 'vertical-middle',
                                align: 'center',
                                width: 70,
                                menuDisabled: true
                            },
                            {
                                dataIndex: 'amount',
                                text: i18n.getKey('subtotal'),
                                tdCls: 'vertical-middle',
                                align: 'center',
                                width: 70,
                                menuDisabled: true

                            },
                            {
                                dataIndex: 'imageUrl',
                                text: i18n.getKey('image'),
                                tdCls: 'vertical-middle',
                                align: 'center',
                                width: 120,
                                xtype: 'componentcolumn',
                                menuDisabled: true,
                                renderer: function (value, metadata, record) {
                                    var thumbnail = record.get('thumbnailInfo').thumbnail;
                                    if (Ext.isEmpty(thumbnail)) {
                                        return '';
                                    }
                                    var imgSize = '/100/100/png?' + Math.random();
                                    return {
                                        xtype: 'imagecomponent',
                                        src: thumbnail ? (projectThumbServer + thumbnail + imgSize) : (value + imgSize),
                                        autoEl: 'div',
                                        style: 'cursor: pointer',
                                        width: 100,
                                        height: 100,
                                        listeners: {
                                            afterrender: function (view) {
                                                view.el.dom.getElementsByTagName('img')[0].addEventListener('error', function (err) {
                                                    var pageTitle = JSGetCurrentIframeTitle();
                                                    JSCaptureMessage(pageTitle + '页面中，' + '订单' + me.orderNumber + '的订单项加载预览图失败', {
                                                        message: '订单' + me.orderNumber + '的订单项加载预览图失败',
                                                        level: 'info',
                                                        tags: {
                                                            clientUrl: location.href,
                                                            serverUrl: err.target.src,
                                                            httpStatusCode: 404
                                                        },
                                                        extra: {
                                                            '文件': err.target.src
                                                        }
                                                    })
                                                    return true;
                                                }, true);
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                dataIndex: 'productName',
                                text: i18n.getKey('product'),
                                width: 320,
                                align: 'center',
                                autoWidthComponents: true,
                                menuDisabled: true,
                                xtype: 'componentcolumn',
                                renderer: function (value, metadata, record) {
                                    var model = record.get('productModel');
                                    var sku = record.get("productSku");
                                    var items = [
                                        {
                                            title: i18n.getKey('name'),
                                            align: 'left',
                                            value: value
                                        },
                                        {
                                            title: i18n.getKey('model'),
                                            value: model,
                                            align: 'left'
                                        },
                                        {
                                            title: i18n.getKey('sku'),
                                            value: sku,
                                            align: 'left'
                                        }
                                    ];

                                    //return JSCreateHTMLTable(items);

                                    return new Ext.XTemplate('<table>',
                                        '<tpl for=".">',
                                        '<tr class="x-form-item-input-row">',
                                        '<td class="x-field-label-cell" style="text-align:left">', '{title}:', '</td>',
                                        '<td class="x-form-item-body x-form-display-field-body" style="white-space:normal;text-align:left;">', '{value}', '</td>',
                                        '</tr>',
                                        '</tpl>',
                                        '</table>').apply(items);
                                }

                            }


                        ]

                    },
                    name: 'orderLineItem'

                }

            ],
            bbar: [
                '->',
                {
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function () {
                        if (me.form.isValid()) {
                            var orderItems = [];
                            //获取表格中修改的数据
                            var updateModel = me.store.getModifiedRecords();
                            if (!Ext.isEmpty(updateModel)) {
                                Ext.Array.each(updateModel, function (item) {
                                    orderItems.push({
                                        'id': item.get("id"),
                                        'qty': item.get("qty"),
                                        'price': item.get("price")
                                    });
                                });
                                //获取原因数据
                                var remark = me.form.getForm().findField('remark').getValue();
                                //格式传递化参数
                                var data = {
                                    "remark": remark,
                                    "orderItemList": orderItems
                                }
                                //修改订单项价格和数量
                                me.controller.modifyPriceNumbers(me.orderId, data, me, me.page);
                            } else {
                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('priceNumbersDataNull'))
                            }

                        }

                    }
                },
                {
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function () {
                        me.close();
                    }
                }
            ]
        });

        me.add(me.form);

        me.addListener('resize', function (window, width, height, eOpts) {
            var grid = Ext.getCmp('gridfield').getGrid();
            grid.doLayout();
        });
    }

});
