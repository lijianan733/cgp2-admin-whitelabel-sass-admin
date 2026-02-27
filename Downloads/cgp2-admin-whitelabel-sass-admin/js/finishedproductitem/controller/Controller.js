/**
 *
 */
Ext.define('CGP.finishedproductitem.controller.Controller', {

    showFinishedProductItemHistores: function (id) {
        var me = this;
        var controller = Ext.create('CGP.finishedproductitem.controller.Controller');
        Ext.Ajax.request({
            method: 'GET',
            url: adminPath + 'api/finishedProductItems/' + id + '/histories',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (resp, operation) {
                var response = Ext.JSON.decode(resp.responseText);
                if (response.success) {
                    var data = response.data;
                    controller.showHisotriesByWindow(data);
                } else {
                    Ext.Msg.alert(i18n.getKey('history'), response.data.message);
                }
            },
            failure: function (resp, operation) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },

    showHisotriesByWindow: function (histories) {
        var me = this;
        if (histories.length == 0) {
            Ext.Msg.alert(i18n.getKey('prompt'), '没有历史信息！');
            return;
        }
        var wrapHis = [];
        Ext.Array.each(histories, function (history, index) {
            var his;
            var qtyInfo;
            his = '(' + (index + 1) + ')&nbsp;&nbsp;<font color=red>'
                + history.user.emailAddress
                + '</font>于'
                + '<font color=red>'
                + Ext.Date.format(new Date(history.createdDate), 'Y-m-d H:i:s  ') + '</font>'
                + i18n.getKey(history.status.name)
                + '<font color=red>'
                + history.qty + '</font>'
                + '个产品项';
            if (!Ext.isEmpty(history.comment)) {
                his = his + '<font color=red>'
                    + '[' + history.comment + ']'
                    + '</font>';
            }
            if (index == (histories.length - 1)) {
                his = '<p>' + his + '</p>'
            } else {
                his = '<p style="border-bottom:1px solid rgba(0,0,0,0.3)">' + his + '</p>';
            }

            wrapHis.push(his);
        })
        var window = new Ext.window.Window({
            title: i18n.getKey('history'),
            bodyCls: 'padding:10px',
            height: 500,
            width: 700,
            modal: true,//强制不能超载其他区域
            autoScroll: true,
            layout: 'fit',
            items: [
                {
                    xtype: 'displayfield',
                    value: '<div class="status-field">' + wrapHis.join('') + '</div>'
                }
            ]
        });
        window.show();
    },
    modifyStatusWin: function (statusId, itemId, title, maxValue) {

        var me = this;
        var controller = Ext.create('CGP.finishedproductitem.controller.Controller');
        Ext.create('Ext.window.Window', {
            title: title,
            modal: true,
            width: 300,
            height: 200,
            layout: 'fit',
            items: [
                {
                    xtype: 'form',
                    border: false,
                    padding: 10,
                    defaults: {
                        labelWidth: 50
                    },
                    items: [
                        {
                            xtype: 'numberfield',
                            minValue: 1,
                            width: 250,
                            fieldLabel: i18n.getKey('qty'),
                            hideTrigger: true,
                            maxValue: maxValue,
                            allowBlank: false,
                            value: maxValue,
                            itemId: 'qty',
                            name: 'qty'
                        },
                        {
                            xtype: 'textarea',
                            name: 'comment',
                            fieldLabel: i18n.getKey('comment'),
                            width: 250,
                            itemId: 'comment'
                        }
                    ]
                }
            ],
            bbar: ['->', {
                xtype: 'button',
                iconCls: 'icon_agree',
                text: i18n.getKey('confirm'),
                handler: function () {
                    var data = {};
                    data.actionId = statusId;
                    var win = this.ownerCt.ownerCt;
                    var items = win.down('form').items.items;
                    Ext.Array.each(items, function (item) {
                        data[item.name] = item.getValue();
                    });
                    if (win.down('form').isValid()) {
                        win.close();
                        controller.updateStatus(data, itemId, finishedProductItemStore, finishedProductItemGrid);
                    }
                }
            }, {
                xtype: 'button',
                iconCls: 'icon_cancel',
                text: i18n.getKey('cancel'),
                handler: function () {
                    this.ownerCt.ownerCt.close();
                }
            }]
        }).show();
    },
    updateStatus: function (data, itemId, store, grid) {
        var me = this;
        var myMask = new Ext.LoadMask(grid, {msg: "Please wait..."});
        myMask.show();
        Ext.Ajax.request({
            method: 'PUT',
            url: adminPath + 'api/finishedProductItems/' + itemId + '/work',
            jsonData: data,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (resp, operation) {
                var response = Ext.JSON.decode(resp.responseText);
                if (response.success) {
                    myMask.hide();
                    store.loadPage(store.currentPage, function () {
                        grid.getSelectionModel().select(store.getById(itemId));
                    });
                    Ext.Msg.alert(i18n.getKey('prompt'), '操作成功！')
                } else {
                    Ext.Msg.alert(i18n.getKey('prompt'), response.data.message);
                }
            },
            failure: function (resp, operation) {
                myMask.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('prompt'), response.data.message);
            }
        });
    },
    searchProduct: function () {

        var queries = [];

        var items = this.ownerCt.items.items;

        var store = this.ownerCt.ownerCt.getStore();

        var params = {};

        for (var i = 0; i < items.length; i++) {
            var query = {};
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            query.name = items[i].name;
            if (!Ext.isEmpty(items[i].isLike) && !items[i].isLike) {
                query.value = items[i].getValue();
            } else if (Ext.isEmpty(items[i].isLike) || items[i].isLike) {
                query.value = '%' + items[i].getValue() + '%'
            }
            query.type = 'string';
            queries.push(query);
        }

        if (queries.length > 0) {
            store.proxy.extraParams = {
                filter: Ext.JSON.encode(queries)
            }
        } else {
            store.proxy.extraParams = null;
        }

        store.loadPage(1);


    },
    clearParams: function () {

        var items = this.ownerCt.items.items;
        var store = this.ownerCt.ownerCt.getStore();

        for (var i = 0; i < items.length; i++) {
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            items[i].setValue('');
        }

        store.proxy.extraParams = null;


    },
    statusTemplate: function (isOutsourcing, isNeedPrint, currentItems, qty, grid, store, record) {
        var me = this;
        var hasProducer = !Ext.isEmpty(record.data.manufactureOrderItem.orderLineItem.order.producePartner);
        window.modifyStatusWin = me.modifyStatusWin;
        window.finishedProductItemStore = store;
        window.finishedProductItemGrid = grid;
        var itemId = record.get('id');
        var result = '';
        template = new Ext.XTemplate(
            '<table>',
            '<tr><td>{status}：</td><td>{qty}</td>',
            '<tpl if="hasProducer == false">',
            '<td><a style="text-decoration: none;" href="javascript:{handler}">{produce}</a></td>',
            '</tpl>',
            '</tr>',
            '</table>');
        if (isOutsourcing) {
            if (Ext.isEmpty(currentItems)) {
                result += template.apply({
                    status: i18n.getKey('noReady'),
                    qty: qty,
                    hasProducer: hasProducer,
                    handler: 'modifyStatusWin(' + 169032 + ',' + itemId + ',' + '\'' + i18n.getKey('ready') + '\'' + ',' + qty + ')',
                    produce: i18n.getKey('ready')
                });

            } else if (!Ext.isEmpty(currentItems) && currentItems[0].status.id == 156202) {
                if (qty - currentItems[0].qty != 0) {
                    result += template.apply({
                        status: i18n.getKey('noReady'),
                        qty: (qty - currentItems[0].qty),
                        hasProducer: hasProducer,
                        handler: 'modifyStatusWin(' + 169032 + ',' + itemId + ',' + '\'' + i18n.getKey('ready') + '\'' + ',' + (qty - currentItems[0].qty) + ')',
                        produce: i18n.getKey('ready')
                    });
                }
                if (currentItems[0].qty != 0) {
                    result += template.apply({
                        status: i18n.getKey('readied'),
                        qty: currentItems[0].qty,
                        hasProducer: hasProducer,
                        handler: 'modifyStatusWin(' + 169036 + ',' + itemId + ',' + '\'' + i18n.getKey('re-prepare') + '\'' + ',' + currentItems[0].qty + ')',
                        produce: i18n.getKey('re-prepare')
                    });
                }
            }
        } else {
            if (isNeedPrint) {
                if (Ext.isEmpty(currentItems)) {
                    result += template.apply({
                        status: i18n.getKey('noPrint'),
                        qty: qty,
                        hasProducer: hasProducer,
                        handler: 'modifyStatusWin(' + 169033 + ',' + itemId + ',' + '\'' + i18n.getKey('print') + '\'' + ',' + qty + ')',
                        produce: i18n.getKey('print')
                    });

                } else if (!Ext.isEmpty(currentItems)) {
                    var noPrintQty, printedQty, producedQty;
                    printedQty = 0;
                    producedQty = 0;
                    noPrintQty = qty;
                    Ext.Array.each(currentItems, function (currentItem) {
                        noPrintQty -= currentItem.qty;
                    });
                    Ext.Array.each(currentItems, function (currentItem) {
                        if (currentItem.status.id == 156203) {
                            printedQty = currentItem.qty;
                            printedQty = currentItem.qty;
                        }
                    });
                    Ext.Array.each(currentItems, function (currentItem) {
                        if (currentItem.status.id == 156204) {
                            producedQty = currentItem.qty;
                        }
                    });
                    if (noPrintQty != 0) {
                        result += template.apply({
                            status: i18n.getKey('noPrint'),
                            qty: noPrintQty,
                            hasProducer: hasProducer,
                            handler: 'modifyStatusWin(' + 169033 + ',' + itemId + ',' + '\'' + i18n.getKey('print') + '\'' + ',' + noPrintQty + ')',
                            produce: i18n.getKey('print')
                        });
                    }
                    if (printedQty != 0) {
                        template = new Ext.XTemplate(
                            '<table>',
                            '<tr><td>{status}：</td><td>{qty}</td>',
                            '<tpl if="hasProducer == false">',
                            '<td><a style="text-decoration: none;" href="javascript:{handler}">{produce}</a></td>',
                            '<td><a style="text-decoration: none;" href="javascript:{handler2}">{produce2}</a></td>',
                            '</tpl>',
                            '</tr>',
                            '</table>');
                        result += template.apply({
                            status: i18n.getKey('printed'),
                            qty: printedQty,
                            hasProducer: hasProducer,
                            handler: 'modifyStatusWin(' + 169031 + ',' + itemId + ',' + '\'' + i18n.getKey('produce') + '\'' + ',' + printedQty + ')',
                            produce: i18n.getKey('produce'),
                            handler2: 'modifyStatusWin(' + 169034 + ',' + itemId + ',' + '\'' + i18n.getKey('re-print') + '\'' + ',' + printedQty + ')',
                            produce2: i18n.getKey('re-print')

                        });
                    }
                    if (producedQty != 0) {
                        result += template.apply({
                            status: i18n.getKey('produced'),
                            qty: producedQty,
                            hasProducer: hasProducer,
                            handler: 'modifyStatusWin(' + 169035 + ',' + itemId + ',' + '\'' + i18n.getKey('re-produce') + '\'' + ',' + producedQty + ')',
                            produce: i18n.getKey('re-produce')
                        });
                    }
                }
            } else {
                if (Ext.isEmpty(currentItems)) {
                    result += template.apply({
                        handler: 'modifyStatusWin(' + 169031 + ',' + itemId + ',' + '\'' + i18n.getKey('produce') + '\'' + ',' + qty + ')',
                        hasProducer: hasProducer,
                        status: i18n.getKey('noProduce'),
                        qty: qty,
                        produce: i18n.getKey('produce')
                    });

                } else if (!Ext.isEmpty(currentItems) && currentItems[0].status.id == 156204) {
                    if (qty - currentItems[0].qty != 0) {
                        result += template.apply({
                            handler: 'modifyStatusWin(' + 169031 + ',' + itemId + ',' + '\'' + i18n.getKey('produce') + '\'' + ',' + (qty - currentItems[0].qty) + ')',
                            hasProducer: hasProducer,
                            status: i18n.getKey('noProduce'),
                            qty: (qty - currentItems[0].qty),
                            produce: i18n.getKey('produce')
                        })
                    }
                    if (currentItems[0].qty != 0) {
                        result += template.apply({
                            handler: 'modifyStatusWin(' + 169035 + ',' + itemId + ',' + '\'' + i18n.getKey('re-produce') + '\'' + ',' + currentItems[0].qty + ')',
                            hasProducer: hasProducer,
                            status: i18n.getKey('produced'),
                            qty: currentItems[0].qty,
                            produce: i18n.getKey('re-produce')
                        })
                    }
                }
            }
        }
        return result;

    },
    afterPageLoad: function (page) {
        var me = this;
        var searcher = Ext.Object.fromQueryString(location.search);
        if (searcher.excludeStatusIds != '241635') {

            var statusFilter = page.filter.getComponent('status');

            //statusFilter.setValue(Ext.Number.from(searcher.statusId));
            statusFilter.setVisible(false);


        }

        if (searcher.isNeedPrint) {
            var isNeedPrint = page.filter.getComponent('isNeedPrint');
            isNeedPrint.setVisible(false);
        }
        me.addBatchBtn(searcher, page);
    },
    addBatchBtn: function (sercher, page) {
        var me = this;
        var batchConfirmButton = Ext.widget({
            xtype: 'button',
            width: 120,
            iconCls: 'icon_batch',
            handler: function () {
                var select = page.grid.getSelectionModel().getSelection();
                var store = page.grid.getStore();
                Ext.create('CGP.finishedproductitem.view.BatchPrintWin', {
                    page: page
                }).show();
                if (opratorId == 169033 && !Ext.isEmpty(select)) {
                }
            }
        });
        var text = '';
        var opratorId;
        if (sercher.excludeStatusIds == '156202,156203,156204,241635') {
            text = i18n.getKey('batch') + i18n.getKey('print');
            opratorId = 169033;
            batchConfirmButton.setText(text);
            page.toolbar.add(batchConfirmButton);
        }
        /*batchConfirmButton.setText(text);
         page.toolbar.add(batchConfirmButton);*/
    },
    batchPrint: function (grid, store, page, button) {
        var me = this;
        var records = grid.grid.getSelectionModel().getSelection();
        if (records.length == 0) {
            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请先选择订单'), function () {
                return;
            })
        } else {
            var producePartnerOrder = [];
            var selectedRecords = [];
            for (var i = 0; i < records.length; i++) {
                if (records[i].get('manufactureOrderItem').orderLineItem.order.producePartner) {
                    grid.grid.getSelectionModel().deselect(records[i]);
                    producePartnerOrder.push(records[i].get('manufactureOrderItem').orderLineItem.order.orderNumber)
                } else {
                    selectedRecords.push(records[i]);
                }
            }
            if (producePartnerOrder.length > 0) {
                var producePartnerOrderString = '';
                for (var i = 0; i < producePartnerOrder.length; i++) {
                    if (i % 2 == 0 && i != producePartnerOrder.length - 1) {
                        producePartnerOrderString += producePartnerOrder[i] + '<br>'
                    } else {
                        producePartnerOrderString += producePartnerOrder[i] + ','
                    }
                }
                Ext.Msg.alert(i18n.getKey('prompt'), '以下订单号：' + producePartnerOrderString + '<br>是属于供应商的订单,无权操作，已被取消选中。', function () {
                    return;
                });
            } else {
                Ext.Msg.confirm('提示', '是否批量打印选中的' + selectedRecords.length + '个成品项？', callback);

                function callback(id) {
                    if (id == 'yes') {
                        var lm = grid.grid.setLoading();
                        Ext.Array.each(selectedRecords, function (item, index) {
                            var currentItems = item.get('currentItems');
                            var qty = item.get('qty');
                            var id = item.getId();
                            var data = {};
                            var maxValue;
                            if (Ext.isEmpty(currentItems)) {
                                maxValue = qty;
                            } else {
                                maxValue = qty;
                                Ext.Array.each(currentItems, function (item) {
                                    maxValue -= item.qty;
                                })
                            }
                            data.actionId = 169033;
                            data.qty = maxValue;
                            data.comment = '';
                            Ext.Ajax.request({
                                method: 'PUT',
                                url: adminPath + 'api/finishedProductItems/' + id + '/work',
                                jsonData: data,
                                headers: {
                                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                },
                                success: function (resp, operation) {
                                    var response = Ext.JSON.decode(resp.responseText);
                                    if (response.success) {
                                        if (index == selectedRecords.length - 1) {
                                            lm.hide();
                                            store.load();
                                            page.grid.getStore().load();
                                            Ext.Msg.alert(i18n.getKey('prompt'), '操作成功！');
                                        }
                                    } else {
                                        Ext.Msg.alert(i18n.getKey('prompt'), response.data.message);
                                    }
                                },
                                failure: function (resp, operation) {
                                    if (index == selectedRecords.length - 1) {
                                        lm.hide();
                                    }
                                    var response = Ext.JSON.decode(resp.responseText);
                                    Ext.Msg.alert(i18n.getKey('prompt'), response.data.message);

                                }
                            });
                        })
                        lm.hide();
                    }
                }
            }
        }
    }
});