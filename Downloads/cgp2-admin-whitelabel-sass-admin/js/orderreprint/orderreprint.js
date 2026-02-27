Ext.Loader.syncRequire([
    'CGP.common.field.WebsiteCombo'
])
Ext.onReady(function () {

    var backgroundColor = '#87CEFF';
    var controller = Qpp.CGP.Order.Controller;


    //multiSort plugin
    var multiplesort = Ext.create('Ext.ux.grid.plugin.MultipleSort', {
        items: [{
            xtype: 'tbtext',
            text: i18n.getKey('sorter + ":"'),
            reorderable: false
        }
            , {
                text: i18n.getKey('reprintDate'),
                sortData: {
                    property: 'createdDate',
                    direction: 'DESC'
                }
            }, {
                text: i18n.getKey('orderNumber'),
                sortData: {
                    property: 'orderNumber'
                }
            }
        ]
    });


    page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('order'),
        block: 'order',
        gridCfg: {
            dockedItems: [multiplesort],
            store: Ext.data.StoreManager.lookup('orderStore'),
            showRowNum: false,
            remoteCfg: false,
            frame: false,
            editAction: false,
            deleteAction: false,
            autoHeight: true,
            bodyStyle: 'width:100%',
            autoWidth: true,
            plugins: [{
                ptype: 'rowexpander',
                rowBodyTpl: new Ext.XTemplate(
                    '<div><div id="order-line-item-{id}"  style="float:left;"></div><div id="order-total-{id}" style="float:left;"></div></div>'
                )
            }, multiplesort],
            viewConfig: {
                listeners: {
                    expandBody: controller.expandBody
                }
            },
            columnDefaults: {
                autoSizeColumn: true
            },
            columns: [{
                text: i18n.getKey('id'),
                dataIndex: 'id',
                itemId: 'id',
            }, {
                text: i18n.getKey('reprintNo'),
                dataIndex: 'reprintNo',
                itemId: 'reprintNo',
                xtype: 'gridcolumn',
                renderer: function (value, metadata) {
                    metadata.style = 'color:red';
                    return value;
                }
            }, {
                text: i18n.getKey('orderNumber'),
                dataIndex: 'orderNumber',
                itemId: 'orderNumber',
                xtype: 'gridcolumn',
            }, {
                text: i18n.getKey('reprintDate'),
                dataIndex: 'createdDate',
                itemId: 'reprintDate',
                xtype: 'datecolumn',
                //                format: 'Y/m/d H:i',
                align: 'center',
                renderer: function (value, metadata) {
                    value = Ext.Date.format(value, 'Y/m/d H:i');
                    metadata.style = 'color:gray';
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return '<div style="white-space:normal;">' + value + '</div>'
                }
            }, {
                text: i18n.getKey('datePurchased'),
                dataIndex: 'datePurchased',
                itemId: 'datePurchased',
                sortable: false,
                xtype: 'datecolumn',
                //                format: 'Y/m/d H:i',
                align: 'center',
                renderer: function (value, metadata) {
                    value = Ext.Date.format(value, 'Y/m/d H:i');
                    metadata.style = 'color:gray';
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return '<div style="white-space:normal;">' + value + '</div>'
                }
            }, {
                text: i18n.getKey('customerEmail'),
                dataIndex: 'customerEmail',
                itemId: 'customerEmail',
                xtype: 'gridcolumn'
            }, {
                text: i18n.getKey('deliveryName'),
                dataIndex: 'deliveryName',
                itemId: 'deliveryName',
                xtype: 'gridcolumn',
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="' + record.get('deliveryAddress') + '"';
                    return value;
                }
            }, {
                text: i18n.getKey('billingName'),
                dataIndex: 'billingName',
                itemId: 'billingName',
                xtype: 'gridcolumn',
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="' + record.get('billingAddress') + '"';
                    return value;
                }
            },
//                      {
                //                sortable: false,
                //                text: i18n.getKey('totalPrice'),
                //                dataIndex: 'totalPrice',
                //                itemId: 'totalPrice',
                //                xtype: 'gridcolumn',
                //                renderer: function (value, metadata, record) {
                //                    metadata.style = 'color:blue';
                //
                //                    if (!Ext.isEmpty(record.get('totalRefunded'))) {
                //                        value = value + new Ext.dom.Helper().createHtml({
                //                            tag: 'font',
                //                            color: 'red',
                //                            html: '(-' + record.get('totalRefunded') + ')'
                //                        });
                //                    }
                //
                //                    return value;
                //                }
                //            },
                {
                    text: i18n.getKey('paymentMethod'),
                    dataIndex: 'paymentMethod',
                    itemId: 'paymentMethod'
                }, {
                    text: i18n.getKey('shippingMethod'),
                    dataIndex: 'shippingMethod',
                    itemId: 'shippingMethod'
                }, {
                    text: i18n.getKey('status'),
                    dataIndex: 'status',
                    itemId: 'status',
                    xtype: 'gridcolumn',
                    renderer: function (value, metadata) {
                        metadata.style = 'color:red';
                        return value;
                    }
                }, {
                    sortable: false,
                    text: i18n.getKey('totalCount'),
                    dataIndex: 'totalCount',
                    itemId: 'totalCount',
                    xtype: 'numbercolumn',
                    format: '0,000',
                    width: '5%',
                    renderer: function (value, metadata) {
                        metadata.style = 'color:blue';
                        return value;
                    }
                }, {
                    sortable: false,
                    text: i18n.getKey('totalQty'),
                    dataIndex: 'totalQty',
                    itemId: 'totalQty',
                    xtype: 'numbercolumn',
                    format: '0,000',
                    renderer: function (value, metadata) {
                        metadata.style = 'color:blue';
                        return value;
                    }
                }, {
                    text: i18n.getKey('website'),
                    dataIndex: 'website',
                    itemId: 'website',
                    width: 150,
                    autoSizeColumn: false
                }]
        },
        filterCfg: {
            fieldDefaults: {
                labelAlign: 'right',
                layout: 'anchor',
                width: 300,
                labelWidth: 100,
                style: 'margin-right:50px; margin-top : 5px;'
            },
            items: [{
                name: 'id',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            }, {
                name: 'reprintNo',
                xtype: 'textfield',
                width: 360,
                fieldLabel: i18n.getKey('reprintNo'),
                itemId: 'reprintNo'
            }, {
                name: 'order.orderNumber',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('orderNumber'),
                itemId: 'orderNumber'
            }, {
                name: 'order.customerEmail',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('customerEmail'),
                itemId: 'customerEmail'
            }, {
                id: 'datePurchasedSearch',
                style: 'margin-right:50px; margin-top : 0px;',
                name: 'order.datePurchased',
                xtype: 'datefield',
                itemId: 'fromDate',
                fieldLabel: i18n.getKey('datePurchased'),
                format: 'Y/m/d',
                scope: true,
                width: 218
            }, {
                name: 'order.website.id',
                itemId: 'website',
                xtype: 'websitecombo',
                value: 11,
                hidden: true,
            }]
        },
        tbarCfg: {
            hiddenButtons: ['create', 'config', 'delete']
        },
        listeners: {
            afterload: function (p) {

            }
        }
    });


});