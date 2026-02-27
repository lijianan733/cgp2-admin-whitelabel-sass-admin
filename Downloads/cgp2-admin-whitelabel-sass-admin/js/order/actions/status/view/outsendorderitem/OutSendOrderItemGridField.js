/**
 * @Description:外派生产的订单，
 * 每个外派订单都有自己的快递信息，
 * 现在同一订单同一生产商的快递信息一样
 * @author nan
 * @date 2022/12/2
 */
Ext.Loader.syncRequire([
    'CGP.orderlineitemv2.store.OrderLineItemByOrderStore'
])
Ext.define('Order.status.view.outsendorderitem.OutSendOrderItemGridField', {
    extend: 'Ext.ux.form.field.GridFieldExtendContainer',
    alias: 'widget.outsendorderitemgridfield',
    name: 'options',
    fieldLabel: i18n.getKey('外派订单项'),
    itemId: 'options',
    valueType: 'idRef',
    labelAlign: 'top',
    autoScroll: true,
    getValue: Ext.emptyFn,
    setValue: Ext.emptyFn,
    diyGetValue: Ext.emptyFn,
    diySetValue: Ext.emptyFn,
    initComponent: function () {
        var me = this,
            {orderId, isOutboundOrder} = me,
            storeId = JSGetUUID(),
            newOrderLineItemStore = Ext.create('CGP.orderlineitemv2.store.OrderLineItemByOrderStore', {
                orderId: orderId,
                autoLoad: isOutboundOrder,
                groupField: 'thirdManufactureName',//以生产商分组,
                params: {
                    filter: Ext.JSON.encode([{
                        name: 'isOutboundOrder',
                        type: 'boolean',
                        value: true
                    }])
                },
                listeners: {
                    load: function () {
                        var store = this;
                        store.filter(function (item) {
                            return !Ext.isEmpty(item.get('thirdManufactureName'));
                        });
                        //没有外派单就不需要显示
                        if (store.getCount() === 0) {
                            me.hide();
                        }
                    },

                }
            })

        window.showEMS = function (event, orderItemId) {
            if (event && event.stopPropagation) {
                event.stopPropagation();
            }
            var store = Ext.data.StoreManager.get(storeId);
            var record = store.findRecord('id', orderItemId);
            var deliveryInformation = record.get('deliveryInformations');
            deliveryInformation = deliveryInformation[0];
            if (deliveryInformation) {
                var data = [
                    {
                        title: '快递方式',
                        value: deliveryInformation.carrierCode
                    }, {
                        title: '发货日期',
                        value: Ext.Date.format(new Date(deliveryInformation.deliveryDate), 'Y/m/d H:i')
                    }, {
                        title: '快递单号',
                        value: `<a  target="_blank" href="${deliveryInformation.tracking_url}" style="color: blue">` + deliveryInformation.trackingNumber + '</a>'
                    },
                ]
                JSShowJsonData(null, '物流信息', {
                    xtype: 'container',
                    border: false,
                    margin: 50,
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center'
                    },
                    items: [
                        {
                            xtype: 'component',
                            html: JSCreateHTMLTable(data, 'center'),
                        }
                    ],
                }, {
                    width: null,
                    height: null,
                    layout: 'fit',
                });
            }
        };

        me.gridConfig = {
            store: newOrderLineItemStore,
            features: [
                {
                    ftype: 'grouping',
                    groupHeaderTpl: [
                        i18n.getKey('第三方供应商') + ': {name}；',
                        '<a href="#" style="color:blue;visibility: {rows:this.visibility};"  onclick="{rows:this.builderStr}">查看物流信息</a>',
                        {
                            builderStr: function (records) {
                                var orderItemId = records[0]?.get('id');
                                return 'showEMS(event,' + orderItemId + ')';
                            },
                            visibility: function (records) {
                                var deliveryInformation = records[0]?.get('deliveryInformations');
                                if (deliveryInformation?.length) {
                                    return 'visible';
                                } else {
                                    return 'hidden';
                                }
                            }
                        },
                    ]
                },
            ],
            width: '100%',
            maxHeight: 500,
            columns: {
                defaults: {
                    sortable: false,
                },
                items: [
                    {
                        text: i18n.getKey('seqNo'),
                        dataIndex: 'seqNo',
                        width: 80
                    },
                    {
                        width: 150,
                        text: i18n.getKey('preview'),
                        xtype: 'imagecolumn',
                        dataIndex: 'thumbnailInfo',
                        buildUrl: function (value, metadata, record) {
                            if (value) {
                                var imageUrl = value.thumbnail;
                                var src = projectThumbServer + imageUrl;
                                return src;
                            }
                        },
                        buildPreUrl: function (value, metadata, record) {
                            if (value) {
                                var imageUrl = value.thumbnail;
                                var src = projectThumbServer + imageUrl;
                                return src;
                            }
                        },
                        buildTitle: function (value, metadata, record) {
                            if (value) {
                                var imageUrl = value.thumbnail;
                                return `${i18n.getKey('check')} < ${imageUrl} > 预览图`;
                            }
                        }
                    },
                    {
                        dataIndex: 'productName',
                        text: i18n.getKey('product'),
                        width: 320,
                        renderer: function (value, metadata, record) {
                            var model = record.get('productModel');
                            var sku = record.get("productSku");
                            var items = [{
                                title: i18n.getKey('name'),
                                value: value
                            }, {
                                title: i18n.getKey('model'),
                                value: model
                            }, {
                                title: 'Sku',
                                value: sku
                            }];
                            return JSCreateHTMLTable(items);
                        }
                    },
                    {
                        text: i18n.getKey('price'),
                        dataIndex: 'priceStr'
                    },
                    {
                        text: i18n.getKey('qty'),
                        dataIndex: 'qty'
                    },
                    {
                        text: i18n.getKey('amount'),
                        dataIndex: 'amountStr',
                        flex: 1,
                    }]
            },
            bbar: {
                xtype: 'pagingtoolbar',
                store: newOrderLineItemStore,
                displayInfo: true, // 是否 ? 示， 分 ? 信息
                displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                emptyMsg: i18n.getKey('noData')
            }
        };
        me.callParent();
    },
})

