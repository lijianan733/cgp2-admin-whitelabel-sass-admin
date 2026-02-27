/**
 * Created by nan on 2017/12/18.
 */
Ext.onReady(function () {
    var store = Ext.create('CGP.orderwaittingsettlementanalyze.store.PageStore');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        accessControl: true,
        gridCfg: {
            selType: 'rowmodel',
            store: store,
            frame: false,
            customPaging: [
                {value: 25},
                {value: 50},
                {value: 75}
            ],
            columnDefaults: {
                autoSizeColumn: true
            },
            columns: [
                {
                    width: 120,
                    autoSizeColumn: false,
                    text: i18n.getKey('orderNumber'),
                    dataIndex: 'orderNumber',
                    itemId: 'orderNumber',
                    xtype: 'gridcolumn',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        var orderNumber = record.get('orderNumber');
                        var orderId = record.get('orderId');
                        metadata.tdAttr = 'data-qtip="' + i18n.getKey('orderDetails') + '"';
                        return new Ext.Template('<a style="text-decoration: none;" href="javascript:{handler}">' + value + '</a>').apply({
                            handler: 'showOrderDetail(' + orderId + ',' + '\'' + orderNumber + '\'' + ')'
                        });
                    }

                },
                {
                    text: i18n.getKey('extraParams'),
                    dataIndex: 'extraParam',
                    sortable: false,
                    width: 150,
                    itemId: 'extraParam',
                    renderer: function (value, metadata, record) {
                        if (!value) {
                            return '';
                        }
                        metadata.tdAttr = 'data-qtip="' + 'batch_no : ' + value.objectJSON.batch_no + '"';
                        return  'batch_no : ' + value.objectJSON.batch_no;
                    }
                },
                {
                    width: 120,
                    text: i18n.getKey('bindOrderNumbers'),
                    dataIndex: 'bindOrderNumbers',
                    itemId: 'bindOrderNumbers',
                    sortable: false,
                    renderer: function (v, m, r) {
                        if (Ext.isEmpty(v)) {
                            return v;
                        }
                        return v.map(function (item) {
                            return item;
                        }).join('<br>');
                    }
                },
                {
                    text: i18n.getKey('deliveryNo'),
                    dataIndex: 'deliveryNo',
                    xtype: 'gridcolumn',
                    width: 120,
                    itemId: 'deliveryNo',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        if (!value) {
                            return '';
                        }
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },

                {
                    width: 120,
                    autoSizeColumn: false,
                    text: i18n.getKey('partner'),
                    dataIndex: 'partner',
                    itemId: 'partner',
                    sortable: false,
                    xtype: 'gridcolumn',
                    renderer: function (value, metadata, record) {
                        if (!Ext.isEmpty(value)) {
                            var result = value.name + '<' + value.id + '>';
                            metadata.tdAttr = 'data-qtip="' + result + '"';
                            return result;
                        }
                    }
                },
                {
                    text: i18n.getKey('datePurchased'),
                    dataIndex: 'order.datePurchased',
                    itemId: 'datePurchased',
                    xtype: 'datecolumn',
                    align: 'center',
                    renderer: function (value, metadata) {
                        if (Ext.isEmpty(value)) {
                            return '';
                        }
                        value = Ext.Date.format(value, 'Y/m/d H:i');
                        metadata.style = 'color:gray';
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return '<div style="white-space:normal;">' + value + '</div>'
                    }
                },
                {
                    text: i18n.getKey('deliveryDate'),
                    dataIndex: 'order.deliveryDate',
                    itemId: 'deliveryDate',
                    align: 'center',
                    xtype: 'datecolumn',
                    renderer: function (value, metadata) {
                        if (Ext.isEmpty(value)) {
                            return '';
                        }
                        value = Ext.Date.format(value, 'Y/m/d H:i');
                        metadata.style = 'color:gray';
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return '<div style="white-space:normal;">' + value + '</div>'
                    }
                },
                {
                    text: i18n.getKey('receivedDate'),
                    dataIndex: 'receivedDate',
                    itemId: 'receivedDate',
                    align: 'center',
                    sortable: false,
                    xtype: 'datecolumn',
                    renderer: function (value, metadata) {
                        if (Ext.isEmpty(value)) {
                            return '';
                        }
                        value = Ext.Date.format(value, 'Y/m/d H:i');
                        metadata.style = 'color:gray';
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return '<div style="white-space:normal;">' + value + '</div>'
                    }
                },
                {
                    text: i18n.getKey('settlementDate'),
                    dataIndex: 'order.receivedDate',
                    itemId: 'settlementDate',
                    align: 'center',
                    xtype: 'datecolumn',
                    renderer: function (value, metadata) {
                        if (Ext.isEmpty(value)) {
                            return '';
                        }
                        var time = value.getTime() + (24 * 60 * 60 * 1000 * 8);
                        var formatTime = new Date(time);
                        value = Ext.Date.format(formatTime, 'Y/m/d H:i');
                        metadata.style = 'color:gray';
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return '<div style="white-space:normal;">' + value + '</div>'
                    }
                },
                {
                    text: i18n.getKey('isTest'),
                    dataIndex: 'isTest',
                    itemId: 'isTest',
                    sortable: false,
                    xtype: 'gridcolumn',
                    width: 90,
                    renderer: function (value, metadata) {
                        return i18n.getKey(value);
                    }
                },
                {
                    text: i18n.getKey('product'),
                    dataIndex: 'productId',
                    xtype: 'gridcolumn',
                    width: 100,
                    itemId: 'product'
                },
                {
                    text: i18n.getKey('product') + i18n.getKey('name'),
                    dataIndex: 'productDisplayName',
                    sortable: false,
                    width: 200,
                    renderer: function (value, metadata, record) {
                        if (!value) {
                            return '';
                        }
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('price'),
                    dataIndex: 'price',
                    xtype: 'gridcolumn',
                    width: 100,
                    itemId: 'price',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('qty'),
                    dataIndex: 'qty',
                    xtype: 'gridcolumn',
                    width: 100,
                    itemId: 'qty',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('amount'),
                    dataIndex: 'amount',
                    xtype: 'gridcolumn',
                    width: 100,
                    itemId: 'amount',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('comment'),
                    dataIndex: 'comment',
                    xtype: 'gridcolumn',
                    width: 150,
                    itemId: 'comment',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value
                    }
                }
            ]
        },
        tbarCfg: {
            btnExport: {
                disabled: false,
                width: 120,
                text: i18n.getKey('导出Excel文件'),
                handler: function () {
                    var me = this;
                    Ext.Msg.confirm(i18n.getKey('prompt'), '是否导出当前查询的所有数据', function (id) {
                        if (id === 'yes') {
                            var page = me.ownerCt.ownerCt.ownerCt;
                            var queryArray = page.filter.getQuery();
                            var map = {
                                'productSku': 'productSku',
                                'orderId': 'orderId',
                                'productId': 'productId',
                                'qty': 'qty',
                                'price': 'price',
                                'amount': 'amount',
                                'comment': 'comment',
                                'bindOrderNumber': 'bindOrderNumbers',
                                'order.orderNumber': 'orderNumber',
                                'order.isTest': 'isTest',
                                'order.datePurchased': 'datePurchased',
                                'order.deliveryDate': 'deliveryDate',
                                'order.receivedDate': 'receivedDate',
                                'order.datePurchased@to': 'datePurchased@to',
                                'order.deliveryDate@to': 'deliveryDate@to',
                                'order.receivedDate@to': 'receivedDate@to',
                                'order.datePurchased@from': 'datePurchased@from',
                                'order.deliveryDate@from': 'deliveryDate@from',
                                'order.receivedDate@from': 'receivedDate@from',
                                'deliveryNo': 'deliveryNo',
                                'partner': 'partner',
                                'productDisplayName': 'productDisplayName',
                                'order.partner.id': 'partner.id',
                                'extraParam': 'extraParam'
                            };

                            for (var i = 0; i < queryArray.length; i++) {
                                var name = queryArray[i].name;
                                delete queryArray[i].name;
                                queryArray[i].name = map[name];
                            }
                            var filterArray = Ext.JSON.encode(queryArray);
                            var authorization = 'access_token=' + Ext.util.Cookies.get('token');
                            var store = page.grid.getStore();
                            var property = map[store.sorters.items[0].property];
                            console.log(property);
                            var direction = store.sorters.items[0].direction;
                            var sort = {"property": property, "direction": direction};
                            var sorters = Ext.JSON.encode([sort]);
                            if (property == 'price' || property == 'amount') {
                                sorters = Ext.JSON.encode([
                                    {"property": "receivedDate", "direction": "ASC"}
                                ])
                            }
                            /*var fileUrl = adminPath + 'api/partnerSettleItems/export?' + authorization + '&filter=' + filterArray + '&sort=' + sorters;
                             window.open(encodeURI(fileUrl));*/
                            Ext.Ajax.request({
                                method: 'POST',
                                url: adminPath+'api/partnerSettleItems/export',
                                headers: {
                                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                },
                                jsonData: {
                                    filter: filterArray,
                                    sort:sorters
                                },
                                success: function(response){
                                    var resp = Ext.JSON.decode(response.responseText);
                                    if(resp.success){
                                        window.open(resp.data)
                                    }else{

                                    }
                                },
                                failure: function(response){
                                    var resp = Ext.JSON.decode(response.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                }
                            })
                        }
                    });
                }
            }
        },
        filterCfg: {
            items: [
                {
                    id: 'orderNumber',
                    name: 'order.orderNumber',
                    xtype: 'textfield',
                    enforceMaxLength: true,
                    maxLength: 12,
                    fieldLabel: i18n.getKey('orderNumber'),
                    isLike: false,
                    itemId: 'orderNumber'
                },
                {
                    id: 'bindOrderNumber',
                    name: 'bindOrderNumber',
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('bindOrderNumbers'),
                    itemId: 'bindOrderNumber'
                },
                {
                    id: 'deliveryNo',
                    name: 'deliveryNo',
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('deliveryNo'),
                    itemId: 'deliveryNo'
                }
                ,
                {
                    style: 'margin-right:50px; margin-top : 0px;',
                    name: 'order.datePurchased',
                    xtype: 'daterange',
                    itemId: 'fromDate',
                    fieldLabel: i18n.getKey('datePurchased'),
                    width: 360

                },
                {
                    style: 'margin-right:50px; margin-top : 0px;',
                    name: 'order.deliveryDate',
                    xtype: 'daterange',
                    itemId: 'deliveryDate',
                    fieldLabel: i18n.getKey('deliveryDate'),
                    width: 360

                },
                {
                    style: 'margin-right:50px; margin-top : 0px;',
                    name: 'order.receivedDate',
                    xtype: 'daterange',
                    itemId: 'receivedDate',
                    fieldLabel: i18n.getKey('receivedDate'),
                    width: 360

                },
                {
                    style: 'margin-right:50px; margin-top : 0px;',
                    name: 'order.receivedDate',
                    xtype: 'daterange',
                    change: -8,
                    itemId: 'settlementDate',
                    fieldLabel: i18n.getKey('settlementDate'),
                    width: 360

                },
                {
                    id: 'product.id',
                    name: 'product.id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    isLike: false,
                    fieldLabel: i18n.getKey('product') + i18n.getKey('id'),
                    itemId: 'product.id'
                },
                {
                    name: 'order.partner.id',
                    xtype: 'combo',
                    pageSize: 25,
                    editable: false,
                    store: Ext.create('CGP.order.store.PartnerStore'),
                    displayField: 'name',
                    valueField: 'id',
                    fieldLabel: i18n.getKey('partner'),
                    itemId: 'partner'
                },
                {
                    name: 'order.isTest',
                    xtype: 'combobox',
                    editable: false,
                    fieldLabel: i18n.getKey('isTest'),
                    itemId: 'isTest',
                    store: new Ext.data.Store({
                        fields: ['name', {
                            name: 'value',
                            type: 'boolean'
                        }],
                        data: [
                            {
                                value: true,
                                name: '是'
                            },
                            {
                                value: false,
                                name: '否'
                            }
                        ]
                    }),
                    displayField: 'name',
                    value: !JSWebsiteIsStage(),
                    valueField: 'value'
                }
            ]
        }

    });
    window.showOrderDetail = function (id, orderNumber) {

        var status = 1;
        JSOpen({
            id: 'orderDetails',
            url: path + 'partials/orderitemsmultipleaddress/main.html?id=' + id + '&status=' + status + '&orderNumber=' + orderNumber,
            title: i18n.getKey('orderDetails') + '(' + i18n.getKey('orderNumber') + ':' + orderNumber + ')',
            refresh: true
        });

    }
});

