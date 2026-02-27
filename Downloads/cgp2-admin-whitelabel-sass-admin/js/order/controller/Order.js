Ext.Loader.setPath({
    enabled: true, 'CGP.orderdetails': path + 'partials/order/details/app/'
});
Ext.define('CGP.order.controller.Order', {
    // requires: ['CGP.order.view.orderlineitem.List', 'CGP.order.view.order.OrderTotal', 'CGP.order.view.order.PrintRequire'],

    commonController: Ext.create('CGP.orderdetails.view.render.OrderLineItemRender'), constructor: function () {

        this.callParent(arguments);
    },

    checkWorkItems: function (orderLineItemId) {

        JSOpen({
            id: 'workpage',
            url: path + 'partials/work/work.html?orderLineItem.id=' + orderLineItemId,
            title: i18n.getKey('productionManager') + ' ' + i18n.getKey('allStatus'),
            refresh: true
        })
    },

    expandBody: function (rowNode, record, expandRow) {


        if (record.get('orderType') == 'RM') {
            return;
        }

        var me = this;
        var orderId = record.get('id');

        var orderLineItemDom = document.getElementById('order-line-item-' + orderId);
        var orderTotalDom = document.getElementById('order-total-' + orderId);

        if (!orderLineItemDom.innerHTML) me.createOrderLineItemDetail(orderLineItemDom, record);
        if (!orderTotalDom.innerHTML) me.createOrderTotalDetail(orderTotalDom, record);
    },

    createOrderLineItemDetail: function (dom, order) {
        var me = this;

        var orderLineItemsGrid = Ext.create('CGP.order.view.orderlineitem.List', {
            renderTo: dom,
            controller: me,
            order: order
        });
    },
    showUpdateLineItemHisotries: function (histories) {
        var me = this;
        if (histories.length == 0) {
            Ext.Msg.alert(i18n.getKey('prompt'), '没有历史信息！');
            return;
        }
        var wrapHis = [];
        Ext.Array.each(histories, function (history, index) {
            var his;
            var qtyInfo;
            his = '(' + (index + 1) + ')&nbsp;&nbsp;<font color=red>' + history.modifyBy + '</font>于' + '<font color=red>' + Ext.Date.format(new Date(history.date), 'Y-m-d H:i:s  ') + '</font>' + '修改订单项设计' + '<a style="text-decoration: none;" id="click-materialViewType" href="#">' + '查看' + '</a>' + '<font color=red>' + '[' + history.comment + ']' + '</font>';
            if (index == (histories.length - 1)) {
                his = '<p>' + his + '</p>'
            } else {
                his = '<p style="border-bottom:1px solid rgba(0,0,0,0.3)">' + his + '</p>';
            }

            wrapHis.push(his);
        })
        var window = new Ext.window.Window({
            title: i18n.getKey('history'), bodyCls: 'padding:10px', height: 500, width: 700, modal: true,//强制不能超载其他区域
            autoScroll: true, layout: 'fit', items: [{
                xtype: 'displayfield', value: '<div class="status-field">' + wrapHis.join('') + '</div>', listeners: {
                    render: function (display) {
                        var clickElement = document.getElementById('click-materialViewType');
                        clickElement.addEventListener('click', function () {
                            console.log('test');
                        }, false);

                    }
                }
            }]
        });
        window.show();
    },

    createOrderTotalDetail: function (dom, order) {

        Ext.create('CGP.order.view.order.OrderTotal', {
            renderTo: dom, order: order
        })
    },

    collapseAllBody: function (grid) {
        var store = grid.getStore();
        var expander = grid.plugins[0];

        for (var i = 0; i < store.getCount(); i++) {
            var record = store.getAt(i);
            if (expander.recordsExpanded[record.internalId]) {
                expander.toggleRow(i, record);
            }
        }
    },

    printAgain: function (record) {
        var window = Ext.create('CGP.order.view.order.PrintRequire', {
            record: record
        })
        window.show();
    },

    /*    addRedoOrReprintNoColumn: function (p, statusId, gridColumns) {
            var me = this;
            var reprintStatuses = [200, 202, 203];
            var redoStatuses = [400, 401, 402];
            statusId = Ext.Number.from(statusId);
            var column;
            if (Ext.Array.contains(reprintStatuses, statusId)) {

                column = {
                    width: 120,
                    autoSizeColumn: false,
                    text: i18n.getKey('reprintNo'),
                    dataIndex: 'reprintNo',
                    itemId: 'reprintNo',
                    xtype: 'gridcolumn',
                    renderer: function (value, metadata, record) {
                        return '<a style="text-decoration: none;" onclick="javascript:showReprintDetail(' + record.get('reprintId') + ')" href="#">' + value + '</a>';
                    }
                };

            } else if (Ext.Array.contains(redoStatuses, statusId)) {
                column = {
                    width: 120,
                    autoSizeColumn: false,
                    text: i18n.getKey('redoNo'),
                    dataIndex: 'redoNo',
                    itemId: 'redoNo',
                    xtype: 'gridcolumn',
                    renderer: function (value, metadata, record) {
                        return '<a style="text-decoration: none;" onclick="javascript:showRedoDetail(' + record.get('redoId') + ')" href="#">' + value + '</a>';
                    }
                };
            }

            if (column) {
                addColumn(column);
            }

            function addColumn(column) {
                Ext.Array.insert(gridColumns, 3, [column])
                p.grid.reconfigure(null, gridColumns);
            }

        },*/


    //页面加载完成后的处理
    afterPageLoad: function (p, gridColumns) {
        var me = this;
        //在重新加载页面前关闭掉expander
        var searcher = Ext.Object.fromQueryString(location.search);
        var statusId = Number.parseInt(searcher.statusId);
        var store = p.grid.getStore();
        store.on('beforeload', function () {
            me.collapseAllBody(p.grid);
        });
        this.setStatusSearch(p, gridColumns);
        this.addAuditButton(p);//审核按钮 无特殊处理,旧的，不知有何用
        /*
         me.addDeliveryButton(p); //批量确认发货按钮 无特殊处理
         */
        me.addBatchReceiveButtion(p);//批量签收按钮 无特殊处理
        me.addBatchCompleteButton(p);//批量完成的按钮 无特殊处理
        me.addStatus100Deal(p, statusId);//添加订单状态为101时的界面处理
        this.addReportButton(p, statusId);//打印报表
        if (searcher.statusId) {
            var statusId = Number.parseInt(searcher.statusId);
            //为已交收，待发货添加批量发货功能
            if (Ext.Array.contains([106], statusId)) {
                this.addDeliveryButtonV2(p);
            }
            if (Ext.Array.contains([106, 107], statusId)) {
                this.addExportExpressButton(p);
                this.addExportDhlButton(p);
            }
            //批量审核 无特殊处理
            else if (Ext.Array.contains([300, 101, 301], statusId)) {//待确认（第三方订单），已付款待审核，已确认（第三方订单）
                var text = i18n.getKey('batchAudit');
                var title = i18n.getKey('batchAudit');
                var status = 102;//修改后的状态
                this.batchConfirmBtn(p, status, text, title, store);
                //批量付款 无特殊处理
            } else if (statusId == 100) {
                var paidDate = new Date().getTime();
                var text = i18n.getKey('batchPay');
                var title = i18n.getKey('batchPay');
                var status = 101;
                this.batchConfirmBtn(p, status, text, title, store, paidDate);
                //批量重新排版 无特殊处理
            } else if (statusId == 103) {
                this.batchPrintAgainBtn(p, store);
                //批量结算 无特殊处理
            } else if (statusId == 224098) {
                me.addBatchBalanceAccountButton(p);
            }

        } else {
            //批量取消订单
            var paidDate = new Date().getTime();
            var text = i18n.getKey('batchCancelOrder');
            var title = i18n.getKey('batchCancelOrder');
            var status = 41;
            this.batchConfirmBtn(p, status, text, title, paidDate, store);
        }

        /**
         * @author xiu
         * @date 2022/12/5
         */
            // 批量签收按钮
        var BatchSign = Ext.widget({
                xtype: 'button', text: i18n.getKey('batchSign'),//批量签收
                width: 100, itemId: 'batchSign', iconCls: 'icon_batchSign', handler: function (btn) {
                    var buttonText, msgText = '', msgFn;
                    var selectionData = p.grid.getSelectionModel().getSelection();
                    if (selectionData.length > 0) {
                        var allowId = [], allowOrderNumber = [], notAllowOrderNumber = [];
                        // 获取选择的所有数据 并分成 符合{已发货(待签收)107}状态 与 非该状态 两个数组
                        selectionData.forEach(item => {
                            var data = item['data'], id = data['id'], orderNumber = data['orderNumber'],
                                statusId = data['statusId'];
                            if ([107].includes(statusId)) {
                                allowId.push(id);
                                allowOrderNumber.push(orderNumber);
                            } else {
                                notAllowOrderNumber.push(orderNumber);
                            }
                        })
                        var id = JSON.stringify(allowId);

                        // 选择全对
                        if (notAllowOrderNumber.length === 0 && allowId.length > 0) {
                            JSOpen({
                                id: 'batchSign',
                                url: path + 'partials/ordersign/BatchSign.html?id=' + id,
                                title: i18n.getKey('批量签收'),
                                refresh: true
                            })
                        }

                        // 选择全错
                        if (notAllowOrderNumber.length > 0 && allowId.length === 0) {
                            buttonText = {
                                ok: '重新选择订单'
                            };
                            msgText = `您的选择中都${'<font color=red>不符合</font>'}${'<font color=green>已发货(待签收)</font>'}状态订单,请重新选择`;
                            msgFn = function (btn) {
                                p.grid.getSelectionModel().deselectAll()
                            }
                        }

                        // 选择半错
                        if (notAllowOrderNumber.length > 0) {
                            var notAllowText, allowText;
                            // 组合非状态订单
                            notAllowOrderNumber.forEach(item => {
                                notAllowText ? notAllowText += ` 、${item}` : notAllowText = `${item}`;
                            })
                            // 组合符合状态订单
                            allowOrderNumber.forEach(item => {
                                allowText ? allowText += ` 、${item}` : allowText = `${item}`;
                            })
                            var allow = !(selectionData.length === 2) ? '<div><font color=green>符合</font> 状态可签收的订单有: ' + allowText + ' </div>' : ''
                            var htmlText = '<font style="line-height: 18px">' + '<div style="margin-bottom: 8px">过滤掉选择中<font color=red>不符合</font> ' + '<font color=green>已发货(待签收)</font> 状态的订单有: ' + notAllowText + ' ' + '</div>' + '\n' + '\n' + allow
                            '</font>';
                            // 提示用户所选中的非状态订单号

                            Ext.Msg.show({
                                minWidth: 400,
                                maxWidth: 650,
                                title: i18n.getKey('prompt'),
                                msg: msgText || htmlText,
                                buttons: Ext.MessageBox.OK,
                                buttonText: buttonText || {
                                    ok: '继续签收'
                                },
                                multiline: false,
                                animateTarget: 'addAddressBtn',
                                fn: msgFn || function (btn) {
                                    if (btn === 'ok') {
                                        JSOpen({
                                            id: 'batchSign',
                                            url: path + 'partials/ordersign/BatchSign.html?id=' + id,
                                            title: i18n.getKey('批量签收'),
                                            refresh: true
                                        })
                                    }
                                }
                            });
                        }
                    } else {
                        // 选择为空
                        Ext.Msg.show({
                            title: i18n.getKey('prompt'),
                            msg: `请先选择<font color=green>已发货(待签收)</font>状态订单!`,
                            buttons: Ext.MessageBox.OK,
                            buttonText: {
                                ok: i18n.getKey('confirm')
                            },
                            multiline: false,
                            animateTarget: 'addAddressBtn',
                        });
                    }
                }
            });
        p.toolbar.add(BatchSign);
    }, /**
     * 状态为100待付款时的界面处理
     * 添加付款流水号查询
     * 添加付款状态列
     * 禁用操作列按钮
     */
    addStatus100Deal: function (page, statusId) {
        // BankTransfer标识为线下付款订单
        // PayPal标识为线上付款订单
        if (statusId == '100' && JSGetQueryString('paymentModuleCode') == 'BankTransfer') {
            var grid = page.grid;
            var filter = grid.filter;
            var payNoFilter = {
                xtype: 'textfield',
                name: 'transactionId',
                itemId: 'transactionId',
                isLike: false,
                hideTrigger: true,
                fieldLabel: i18n.getKey('付款交易号'),
            };
            /*      var paymentModuleCode = {
                      xtype: 'hiddenfield',
                      name: 'paymentModuleCode',
                      isLike: false,
                      itemId: 'paymentModuleCode',
                      value: 'BankTransfer'
                  };*/
            var payStatusColumn = {
                xtype: 'atagcolumn',
                sortable: false,
                text: i18n.getKey('付款状态'),
                dataIndex: '_id',
                itemId: 'offlinePaymentStatus',
                width: 250,
                getDisplayName: function (value, metadata, record, rowIndex, colIndex, store, view) {
                    var offlinePaymentStatus = record.get('offlinePaymentStatus');
                    console.log(offlinePaymentStatus)
                    if (offlinePaymentStatus.code == 'WAITING_INPUT') {
                        return '<font style="color: red;font-weight: bold;" >待录入转账凭证</font>' + `   <a href="#" class="atag_display">录入</a>`;
                    } else if (offlinePaymentStatus.code == 'WAITING_CONFIRM_STATUS') {
                        if (record.get('transactionType') == 'BackEnd') {
                            return '<font style="color: orange;font-weight: bold;" >待审核凭证</font>' + `   <a href="#" class="atag_display">重新录入</a>`;
                        } else if (record.get('transactionType') == 'FrontEnd') {
                            return '<font style="color: orange;font-weight: bold;" >待审核凭证</font>';
                        }
                    }
                },
                clickHandler: function (value, metadata, record, rowIndex, colIndex, store, view) {
                    var totalPriceString = record.get('totalPriceString');
                    var win = Ext.create('CGP.order.view.transactionvoucher.AddTransactionVoucherWin', {
                        totalPriceString: totalPriceString,
                        orderId: record.get('_id'),
                        outGrid: grid,
                        order: record,
                        currency: record.get('currency')
                    });
                    win.show();
                }
            };
            var transactionIds = {
                xtype: 'componentcolumn',
                sortable: false,
                text: i18n.getKey('付款交易号'),
                dataIndex: 'transactionIds',
                itemId: 'transactionIds',
                width: 250,
                renderer: function (value, metaData, record) {
                    metaData.tdAttr = 'data-qtip="' + value + '"';
                    if (value && value.length > 0) {
                        return {
                            xtype: 'key_value_display_view', rowCount: 1, colCount: 3, gridCfg: {
                                columns: [{
                                    xtype: 'rownumberer'
                                }, {
                                    dataIndex: 'value', text: i18n.getKey('值'), flex: 2
                                }]
                            }, initData: value?.map(function (item) {
                                return {
                                    value: item, display: item
                                };
                            }), getDisplayName: function (values) {
                                console.log(arguments)
                                return values.value + '; ';
                            }
                        }
                    }

                }
            };
            filter.insert(2, payNoFilter);
            /*
                        filter.insert(3, paymentModuleCode);
            */
            var column = Ext.create('Ext.ux.grid.column.ATagColumn', payStatusColumn);
            grid.headerCt.insert(6, column);
            var transactionIdsColumn = Ext.create('Skirtle.grid.column.Component', transactionIds);
            grid.headerCt.insert(17, transactionIdsColumn);

            //渲染后对界面功能按钮进行控制
            grid.on('viewready', function () {
                //隐藏工具栏
                this.headerCt.columnManager.columns[3].hide();
                //隐藏批量付款，批量签收按钮
                var toolbar = this.getDockedItems('[itemId=toolbar]')[0];
                var btn1 = toolbar.getComponent(i18n.getKey('batchPay'));//批量付款
                var btn2 = toolbar.getComponent('batchSign');//批量签收
                btn1.hide();
                btn2.hide();
                grid.store.load();
                //在待确认付款订单管理页进入时，添加额外参数'&orange=bankTransfer'，进行控制
                window.showOrderDetail = function (id, orderNumber, status) {
                    var status = status;
                    JSOpen({
                        id: 'orderDetails',
                        url: path + 'partials/orderitemsmultipleaddress/main.html' + '?id=' + id + '&status=' + status + '&orange=bankTransfer' + '&orderNumber=' + orderNumber,
                        title: i18n.getKey('orderDetails') + '(' + i18n.getKey('orderNumber') + ':' + orderNumber + ')',
                        refresh: true
                    });
                }

            });
        }
    },

    //根据statusId进行初始化
    setStatusSearch: function (p, gridColumns) {
        var me = this;
        var searcher = Ext.Object.fromQueryString(location.search);
        if (searcher.statusId) {

            var statusFilter = p.filter.getComponent('orderStatus');
            //设置标题
            statusFilter.getStore().on('load', function () {
                p.filter.setTitle(statusFilter.getRawValue());
            }, this, {
                single: true
            });

            statusFilter.setValue(Ext.Number.from(searcher.statusId));
            statusFilter.setVisible(false);
            Ext.getCmp('websiteSearch').setWidth(300);
            /*  //增加补印或者重做编号
              me.addRedoOrReprintNoColumn(p, searcher.statusId, gridColumns);
              */


        } else {
            p.filter.setTitle(i18n.getKey('allOrder'));

        }
        p.grid.getStore().loadPage(1);
    },

    //批量审核按钮
    addAuditButton: function (p) {
        var me = this;

        if (!permissions.checkPermission('orderAudit')) {
            return;
        }

        if (!me.checkPageStatus(p, 101)) {
            return;
        }

        var auditButton = Ext.widget({
            xtype: 'button', text: i18n.getKey('audit'), iconCls: 'icon_audit', handler: batchAudit, disabled: true
        })

        auditButton.relayEvents(p.grid, ['select', 'deselect'], 'grid');
        auditButton.on('gridselect', function (grid, record, index) {
            btnVisible(grid);
        })

        auditButton.on('griddeselect', function (grid, record, index) {
            btnVisible(grid);
        });

        p.toolbar.add(auditButton);

        function btnVisible(grid) {
            var records = grid.getSelection();
            if (records.length == 0) {
                auditButton.setDisabled(true);
            }
            Ext.Array.each(records, function (record, index) {
                if (record.get('statusId') != 101) {
                    auditButton.setDisabled(true);
                    return false;
                }
                if (index == records.length - 1) {
                    auditButton.setDisabled(false);
                }
            })
        }

        //审核
        function batchAudit() {
            var records = p.grid.getSelectionModel().getSelection();
            var ids = [];
            var producePartnerOrder = [];
            Ext.Array.each(records, function (record) {
                if (record.get('producePartner')) {
                    p.grid.getSelectionModel().deselect(record);
                    producePartnerOrder.push(record.get('orderNumber'))
                } else {
                    ids.push(record.get('id'));
                }
            })
            Ext.Msg.alert(i18n.getKey('prompt'), '以下订单：' + producePartnerOrder + '<br>是属于供应商的订单,无权操作');
            var window = new Ext.window.Window({
                title: i18n.getKey('audit'), layout: 'fit', bodyStyle: 'padding:15px', items: [{
                    msgTarget: 'side',
                    labelWidth: 40,
                    xtype: 'textarea',
                    rows: 10,
                    width: 300,
                    fieldLabel: i18n.getKey('comment'),
                    allowBlank: false,
                    itemId: 'comment'
                }], bbar: [{
                    xtype: 'button', text: i18n.getKey('save'), iconCls: 'icon_save', handler: function () {

                        var commentField = window.getComponent('comment');
                        if (!commentField.isValid()) {
                            return;
                        }

                        Ext.Ajax.request({
                            method: 'PUT', url: adminPath + 'api/orders/batchAudit?' + Ext.Object.toQueryString({
                                ids: ids
                            }), headers: {
                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                            }, jsonData: {
                                comment: commentField.getValue()
                            }, success: function (resp, option) {
                                var r = Ext.JSON.decode(resp.responseText);
                                if (r.success) {
                                    auditButton.setDisabled(true);
                                    window.close();
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'));
                                    Ext.Array.each(records, function (record) {
                                        record.set('statusName', r.data[0].statusName);
                                    })
                                } else {
                                    Ext.Msg.alert(i18n.getKey('prompt'), r.data.message);
                                }
                            }, failure: function (resp, option) {
                                var response = Ext.JSON.decode(resp.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                            }
                        });

                    }
                }, {
                    xtype: 'button', text: i18n.getKey('cancel'), iconCls: 'icon_save', handler: function () {
                        window.close();
                    }
                }]
            });

            window.show();

        }

    },

    //批量确认发货按钮
    addDeliveryButton: function (p) {
        var me = this;
        //检查是否有批量发货权限
        if (!permissions.checkPermission('batchDelivery')) {
            return;
        }
        //检查当前页面是否是 已交收（待发货）
        if (!me.checkPageStatus(p, 106)) {
            return;
        }

        //检查当前状态是否是 已交收（待发货）状态

        var button = Ext.widget({
            xtype: 'button',
            text: i18n.getKey('confirmDelivery'),
            iconCls: 'icon_audit',
            width: 90,
            handler: function () {
                var orderIds = me.getGridSelectIds(p.grid);
                Ext.create('CGP.order.view.delivery.Batch', {
                    orderIds: orderIds
                }).show();
                //                me.batchDelivery(p.grid);
            },
            disabled: true
        })
        p.toolbar.add(button);
        button.relayEvents(p.grid, ['select', 'deselect'], 'grid');
        button.on('gridselect', function (grid, record, index) {
            btnVisible(grid);
        })

        button.on('griddeselect', function (grid, record, index) {
            btnVisible(grid);
        });


        function btnVisible(grid) {
            var records = grid.getSelection();
            if (records.length == 0) {
                button.setDisabled(true);
            }
            Ext.Array.each(records, function (record, index) {
                if (record.get('statusId') != 106) {
                    button.setDisabled(true);
                    return false;
                }
                if (index == records.length - 1) {
                    button.setDisabled(false);
                }
            })
        }
    }, //批量发货按钮，版本2
    addDeliveryButtonV2: function (p) {
        var me = this;
        var button = Ext.widget({
            xtype: 'button',
            text: i18n.getKey('batchDelivery'),
            iconCls: 'icon_audit',
            width: 90,
            handler: function () {
                var win = Ext.create('CGP.order.view.batchdeliverywindow.BatchDeliveryWindow', {
                    prePageStore: p.grid.store
                });
                win.show();
            }
        });
        p.toolbar.add(button);
    },

    //批量签收按钮
    addBatchReceiveButtion: function (p) {
        var me = this;
        //检查是否有批量发货权限
        if (!permissions.checkPermission('batchReveive')) {
            return;
        }
        //检查当前页面是否是 已交收（待发货）
        if (!me.checkPageStatus(p, 107)) {
            return;
        }

        //检查当前状态是否是 已交收（待发货）状态

        var button = Ext.widget({
            xtype: 'button', text: i18n.getKey('confirmReceive'), iconCls: 'icon_audit', handler: function () {
                Ext.create('CGP.order.view.receive.Batch').show();
            }, width: 90, disabled: true
        })
        p.toolbar.add(button);
        button.relayEvents(p.grid, ['select', 'deselect'], 'grid');
        button.on('gridselect', function (grid, record, index) {
            btnVisible(grid);
        })

        button.on('griddeselect', function (grid, record, index) {
            btnVisible(grid);
        });


        function btnVisible(grid) {
            var records = grid.getSelection();
            if (records.length == 0) {
                button.setDisabled(true);
            }
            Ext.Array.each(records, function (record, index) {
                if (record.get('statusId') != 107) {
                    button.setDisabled(true);
                    return false;
                }
                if (index == records.length - 1) {
                    button.setDisabled(false);
                }
            })
        }
    }, /**
     * 批量确认完成的按钮
     * @param p
     */

    addBatchCompleteButton: function (p) {
        var me = this;
        //检查是否有批量发货权限
        if (!permissions.checkPermission('batchReveive')) {
            return;
        }
        //检查当前页面是否是 已交收（待发货）
        if (!me.checkPageStatus(p, 108)) {
            return;
        }

        //检查当前状态是否是 已交收（待发货）状态

        var button = Ext.widget({
            xtype: 'button', text: i18n.getKey('confirmComplete'), iconCls: 'icon_audit', handler: function () {
                Ext.create('CGP.order.view.complete.Batch').show();
            }, width: 90, disabled: true
        })
        p.toolbar.add(button);
        button.relayEvents(p.grid, ['select', 'deselect'], 'grid');
        button.on('gridselect', function (grid, record, index) {
            btnVisible(grid);
        })

        button.on('griddeselect', function (grid, record, index) {
            btnVisible(grid);
        });


        function btnVisible(grid) {
            var records = grid.getSelection();
            if (records.length == 0) {
                button.setDisabled(true);
            }
            Ext.Array.each(records, function (record, index) {
                if (record.get('statusId') != 108) {
                    button.setDisabled(true);
                    return false;
                }
                if (index == records.length - 1) {
                    button.setDisabled(false);
                }
            })
        }
    }, //批量結算
    addBatchBalanceAccountButton: function (p) {
        var me = this;
        /*   //检查是否有批量发货权限
         if (!permissions.checkPermission('batchReveive')) {
         return;
         }*/
        /*//检查当前页面是否是 已交收（待发货）
         if (!me.checkPageStatus(p, 108)) {
         return;
         }*/

        //检查当前状态是否是 已交收（待发货）状态

        var button = Ext.widget({
            xtype: 'button', text: i18n.getKey('batchBalanceAccount'), iconCls: 'icon_audit', handler: function () {
                Ext.create('CGP.order.view.batchBalanceAccountWindow.BatchBalanceAccountWindow', {
                    prePageStore: this.ownerCt.ownerCt.store
                }).show();
            }, width: 90
        })
        p.toolbar.add(button);
    }, //报表按钮
    addReportButton: function (p, statusId) {
        var me = this;

        if (!permissions.checkPermission('orderReport')) {
            return;
        }

        /*
                var produceReportButton = Ext.widget({
                    xtype: 'button',
                    text: i18n.getKey('printProduceReport'),//打印生产报表
                    width: 120,
                    iconCls: 'icon_audit',
                    handler: function () {

                        var records = p.grid.getSelectionModel().getSelection();
                        if (records.length == 0) {
                            Ext.Msg.alert(i18n.getKey('prompt'), '请先选择订单！');
                            return;
                        }
                        var statuIds = [];
                        Ext.Array.each(records, function (item) {
                            statuIds.push(item.get('statusId'));
                        })
                        if (!Ext.Array.contains(statuIds, 100)) {
                            var ids = [];
                            Ext.Array.each(records, function (record) {
                                ids.push(record.get('id'));
                            });
                            /!*
                             var url = adminPath + 'api/order/reports/pdf/WorkOrder?ids=' + ids.join(',') + '&access_token=' + Ext.util.Cookies.get('token');
                             window.open(url, "_blank");*!/
                            var url = adminPath + 'api/order/reports/pdf?ids=' + ids.join(',');
                            var jsonData = {
                                reportName: 'WorkOrder'
                            };
                            JSAjaxRequest(url, 'POST', true, jsonData, false, function (require, success, response) {
                                if (success) {
                                    var resp = Ext.JSON.decode(response.responseText);
                                    if (resp.success) {
                                        window.open(resp.data)
                                    }
                                }
                            });
                        } else {
                            Ext.Msg.alert('提示', '等待付款订单不可打印生产报表！');
                        }
                    }
                });
                if (statusId != 100) {
                    p.toolbar.add(produceReportButton);
                }*/

        /*     var reportButton = Ext.widget({
                 xtype: 'button',
                 text: i18n.getKey('voucherPrint'),//邮寄标签
                 width: 80,
                 iconCls: 'icon_audit',
                 handler: function () {
                     var records = p.grid.getSelectionModel().getSelection();
                     if (records.length == 0) {
                         Ext.Msg.alert(i18n.getKey('prompt'), '请先选择订单！');
                         return;
                     }
                     //检查运输方式是否相同
                     var shippingCode;
                     var canPrint = true;
                     Ext.Array.each(records, function (record) {
                         if (shippingCode) {
                             if (shippingCode != record.get('shippingModuleCode')) {
                                 canPrint = false;
                                 return false;
                             }
                         } else {
                             shippingCode = record.get('shippingModuleCode');
                         }
                     });

                     if (!canPrint) {
                         Ext.Msg.alert(i18n.getKey('prompt'), '请选择运输方式相同的订单进行打印！');
                         return;
                     }
                     if (shippingCode == 'Standard' || shippingCode == 'Express' || shippingCode == 'HKPost') {
                         Ext.Msg.alert(i18n.getKey('prompt'), '不支持' + shippingCode + '的邮递标签打印！');
                         return;
                     }
                     if (!shippingCode) {
                         Ext.Msg.alert(i18n.getKey('prompt'), '订单未配置运输方式！');
                         return;
                     }
                     var ids = [];
                     Ext.Array.each(records, function (record) {
                         ids.push(record.get('id'));
                     });
                     /!*var url = adminPath + 'api/order/reports/pdf/Shipping-' + shippingCode + '?ids=' + ids.join(',') + '&access_token=' + Ext.util.Cookies.get('token');
                      window.open(url, "_blank");*!/
                     Ext.Ajax.request({
                         method: 'POST',
                         url: adminPath + 'api/order/reports/pdf?ids=' + ids.join(','),
                         headers: {
                             Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                         },
                         jsonData: {
                             reportName: 'Shipping-' + shippingCode
                         },
                         success: function (response) {
                             var resp = Ext.JSON.decode(response.responseText);
                             if (resp.success) {
                                 var url = '';
                                 var pdfUrl = imageServer + (resp.data.replace(/^http.+(file\/file\/)/, ''));
                                 url = path + 'js/common/pdfpreview/web/viewer.html?file=' + encodeURIComponent(pdfUrl);
                                 JSOpenWin({
                                     title: i18n.getKey('addressLabel'),
                                     url: url,
                                     height: 350,
                                     width: 700,
                                     modal: true
                                 });
                             } else {

                             }
                         },
                         failure: function (response) {
                             var resp = Ext.JSON.decode(response.responseText);
                             Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                         }
                     })
                 }
             });
             p.toolbar.add(reportButton);
     */

    },

    addExportExpressButton: function (p) {
        var me = this;

        if (!permissions.checkPermission('orderReport')) {
            return;
        }
        var produceReportButton = Ext.widget({
            xtype: 'button',
            text: i18n.getKey('exportExpressFormat'),
            width: 140,
            iconCls: 'icon_export',
            handler: function () {
                var records = p.grid.getSelectionModel().getSelection();
                if (records.length == 0) {
                    Ext.Msg.alert(i18n.getKey('prompt'), '请先选择订单！');
                    return;
                }
                var ids = [];
                Ext.Array.each(records, function (record) {
                    ids.push(record.get('id'));
                });
                var url = adminPath + 'api/orders/fedex?orderIds=' + ids.join(',') + '&access_token=' + Ext.util.Cookies.get('token');
                window.open(url, "_blank");
            }
        });
        p.toolbar.add(produceReportButton);
    },

    addExportDhlButton: function (p) {
        var me = this;

        if (!permissions.checkPermission('orderReport')) {
            return;
        }


        var produceReportButton = Ext.widget({
            xtype: 'button',
            text: i18n.getKey('exportDhlFormat'),
            width: 120,
            iconCls: 'icon_export',
            handler: function () {
                var records = p.grid.getSelectionModel().getSelection();
                if (records.length == 0) {
                    Ext.Msg.alert(i18n.getKey('prompt'), '请先选择订单！');
                    return;
                }
                var ids = [];
                Ext.Array.each(records, function (record) {
                    ids.push(record.get('id'));
                });
                var url = adminPath + 'api/orders/dhl?orderIds=' + ids.join(',') + '&access_token=' + Ext.util.Cookies.get('token');
                window.open(url, "_blank");
            }
        });
        p.toolbar.add(produceReportButton);
    },


    //批量发货
    batchDelivery: function () {
        var me = this;
        var win = Ext.create('CGP.order.view.batchdeliverywindow.BatchDeliveryWindow');
        win.show();
    }, //批量收货
    batchReceive: function () {
        var me = this;
        var batchWindow = Ext.ComponentQuery.query('receivebatch')[0];
        var commentField = batchWindow.getComponent('comment');
        if (!commentField.isValid()) {
            return;
        }
        var grid = Ext.ComponentQuery.query('uxgrid')[0];
        var ids = me.getGridSelectIds(grid);
        var lm = batchWindow.setLoading(true);
        Ext.Ajax.request({
            method: 'PUT', url: adminPath + 'api/orders/batchReceive', headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            }, jsonData: {
                orderIds: ids, comment: commentField.getValue()
            }, success: function (r, o) {
                lm.hide();
                var resp = Ext.JSON.decode(r.responseText);
                if (resp.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('submitSuccess'));
                    grid.getStore().loadPage(1);
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                }
            }, failure: function (resp) {
                lm.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
        batchWindow.close();

    }, //批量完成
    batchComplete: function () {
        var me = this;
        var batchWindow = Ext.ComponentQuery.query('completebatch')[0];
        var commentField = batchWindow.getComponent('comment');
        if (!commentField.isValid()) {
            return;
        }
        var grid = Ext.ComponentQuery.query('uxgrid')[0];
        var ids = me.getGridSelectIds(grid);
        var lm = batchWindow.setLoading(true);
        Ext.Ajax.request({
            method: 'PUT', url: adminPath + 'api/orders/batchComplete', headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            }, jsonData: {
                orderIds: ids, comment: commentField.getValue()
            }, success: function (r, o) {
                lm.hide();
                var resp = Ext.JSON.decode(r.responseText);
                if (resp.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('submitSuccess'));
                    grid.getStore().loadPage(1);
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                }
            }, failure: function (resp) {
                lm.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
        batchWindow.close();

    },


    //检查当前页面显示状态
    checkPageStatus: function (page, id) {
        var field = page.filter.getComponent('orderStatus');
        if (!field.isVisible() && field.getValue() == id) {
            return true;
        }
    },

    getGridSelectIds: function (grid) {
        var ids = [];
        var producePartnerOrder = [];

        var records = grid.getSelectionModel().getSelection();
        for (var i = 0; i < records.length; i++) {
            if (records[i].get('producePartner')) {
                grid.getSelectionModel().deselect(records[i]);
                producePartnerOrder.push(records[i].get('orderNumber'));
            } else {
                ids.push(records[i].get('id'));
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
                return ids;
            });
        } else {
            return ids;
        }
    },


    showModifyOrderTotalWindow: function (orderId) {

        Ext.create('CGP.order.view.ordertotal.Edit', {
            orderId: orderId, controller: this
        }).show();

    },

    modifyOrderTotal: function (orderId, data, window) {

        var lm = window.setLoading(true);
        Ext.Ajax.request({
            url: adminPath + 'api/orders/' + orderId + '/orderTotals', method: 'POST', headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            }, jsonData: data, success: function (r) {
                lm.hide();
                var resp = Ext.JSON.decode(r.responseText);
                if (resp.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'));
                    window.close();
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                }

            }, failure: function (resp) {
                lm.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    }, batchConfirmBtn: function (p, status, text, title, store, paidDate) {
        var me = this;

        if (!permissions.checkPermission('orderReport')) {
            return;
        }


        var batchConfirmButton = Ext.widget({
            xtype: 'button', width: 120, itemId: text, iconCls: 'icon_batch', handler: function () {
                var showWin = function () {
                }
                var store = p.grid.store;
                var records = p.grid.getSelectionModel().getSelection();
                var statusIds = [];
                var producePartnerOrder = [];
                if (records.length == 0) {
                    Ext.Msg.alert(i18n.getKey('prompt'), '请先选择订单！');
                    return;
                }
                for (var i = 0; i < records.length; i++) {
                    if (records[i].get('producePartner')) {
                        p.grid.getSelectionModel().deselect(records[i]);
                        producePartnerOrder.push(records[i].get('orderNumber'));
                    } else {
                        statusIds.push(records[i].data.statusId);
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
                    Ext.Msg.alert(i18n.getKey('prompt'), '以下订单号：' + producePartnerOrderString + '<br>是属于供应商的订单，无权操作，已被取消选中。', function () {
                        return;
                    });
                } else if (Ext.Array.contains(statusIds, 109)) {
                    Ext.Msg.alert('提示', '交易完成订单不能取消！');
                    return;
                } else {
                    Ext.create('Ext.window.Window', {
                        width: 400, modal: true, title: title, bodyPadding: '20px', height: 250, items: [{
                            fieldLabel: i18n.getKey('customerNotify'),
                            xtype: 'checkboxfield',
                            name: 'cutomerNotify',
                            labelWidth: 60,
                            inputValue: true,
                            itemId: 'customerNotify'
                        }, {
                            fieldLabel: i18n.getKey('comment'),
                            name: 'comment',
                            labelWidth: 60,
                            width: 350,
                            height: 100,
                            xtype: 'textarea',
                            itemId: 'comment'
                        }], bbar: ['->', {
                            xtype: 'button',
                            text: i18n.getKey('confirmModify'),
                            iconCls: 'icon_agree',
                            handler: function () {
                                var records = p.grid.getSelectionModel().getSelection();
                                var window = this.ownerCt.ownerCt;
                                var customerNotify = window.getComponent('customerNotify').getValue();
                                var comment = window.getComponent('comment').getValue();
                                var ids = [];
                                Ext.Array.each(records, function (record) {
                                    ids.push(record.get('id'));
                                });
                                var lm = window.setLoading(true);
                                var data = {
                                    "orderIds": ids,
                                    "statusIds": status,
                                    "customerNotify": customerNotify,
                                    "comment": comment
                                };
                                if (status == 101) {
                                    data.paidDate = paidDate;
                                }
                                Ext.Ajax.request({
                                    url: adminPath + 'api/orders/batchUpdateStatus', method: 'PUT', headers: {
                                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                    }, jsonData: data, success: function (r) {
                                        lm.hide();
                                        var resp = Ext.JSON.decode(r.responseText);
                                        if (resp.success) {
                                            Ext.Msg.alert(i18n.getKey('prompt'), '修改成功!');
                                            store.load();
                                            window.close();
                                        } else {
                                            Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                                        }

                                    }, failure: function (resp) {
                                        lm.hide();
                                        var response = Ext.JSON.decode(resp.responseText);
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                    }
                                })

                            }
                        }, {
                            xtype: 'button', text: i18n.getKey('cancel'), iconCls: 'icon_cancel', handler: function () {
                                this.ownerCt.ownerCt.close();
                            }
                        }]
                    }).show();
                }
            }
        });
        batchConfirmButton.setText(text);
        p.toolbar.add(batchConfirmButton);
    }, //批量重新排版
    batchPrintAgainBtn: function (p, store) {
        var me = this;

        if (!permissions.checkPermission('orderReport')) {
            return;
        }
        var batchPrintAgainButton = Ext.widget({
            xtype: 'button', text: i18n.getKey('printAgain'), iconCls: 'icon_audit', width: 90, handler: function () {
                var records = p.grid.getSelectionModel().getSelection();
                var selectedRecords = [];
                var orderTypes = [];
                var producePartnerOrder = [];
                if (records.length == 0) {
                    Ext.Msg.alert(i18n.getKey('prompt'), '请先选择订单！');
                    return;
                }
                for (var i = 0; i < records.length; i++) {
                    if (records[i].get('producePartner')) {
                        p.grid.getSelectionModel().deselect(records[i]);
                        producePartnerOrder.push(records[i].get('orderNumber'));
                    } else {
                        orderTypes.push(records[i].data.orderType);
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
                    Ext.Msg.alert(i18n.getKey('prompt'), '以下订单号：' + producePartnerOrderString + '<br>是属于供应商的订单，无权操作，已被取消选中。', function () {
                        return;
                    });
                } else if (Ext.Array.contains(orderTypes, 'RM')) {
                    Ext.Msg.alert('提示', '补款订单不能重新排版！')
                    return;
                } else {
                    Ext.create('Ext.window.Window', {
                        modal: true,
                        width: 500,
                        height: 350,
                        title: i18n.getKey('printAgain'),
                        bodyPadding: '20px',
                        items: [{
                            xtype: 'radiogroup', itemId: 'type', width: 500, fieldLabel: i18n.getKey('type'), items: [{
                                boxLabel: '小版（HP5500）', name: 'type', inputValue: 'HP5500', checked: true
                            }, {
                                boxLabel: '大版（HP10000）', name: 'type', inputValue: 'HP10000'
                            }]
                        }, {
                            xtype: 'textarea', fieldLabel: i18n.getKey('comment'), itemId: 'comment', cols: 40, rows: 10
                        }],
                        bbar: ['->', {
                            xtype: 'button',
                            text: i18n.getKey('confirmModify'),
                            iconCls: 'icon_agree',
                            handler: function () {
                                var records = selectedRecords;
                                var window = this.ownerCt.ownerCt;
                                var type = window.getComponent('type').getValue()['type'];
                                var comment = window.getComponent('comment').getValue();
                                var lm = window.setLoading(true);
                                Ext.Array.each(records, function (record) {
                                    Ext.Ajax.request({
                                        method: 'PUT',
                                        url: adminPath + 'api/orders/' + record.get('id') + '/printAgain',
                                        headers: {
                                            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                        },
                                        jsonData: {
                                            comment: comment, type: type
                                        },
                                        success: function (r) {
                                            var resp = Ext.JSON.decode(r.responseText);
                                            if (resp.success) {
                                            } else {
                                                Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message, function callback() {
                                                    return;
                                                });
                                            }

                                        },
                                        failure: function (resp) {
                                            var response = Ext.JSON.decode(resp.responseText);
                                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message, function callback() {
                                                return;
                                            });
                                        }
                                    });
                                });
                                Ext.Msg.alert(i18n.getKey('prompt'), '修改成功!', function callback() {
                                    lm.hide();
                                    window.close();
                                    store.load();
                                });
                            }
                        }, {
                            xtype: 'button', text: i18n.getKey('cancel'), iconCls: 'icon_cancel', handler: function () {
                                this.ownerCt.ownerCt.close();
                            }
                        }]
                    }).show();
                }


            }
        });
        p.toolbar.add(batchPrintAgainButton);
    },

    /**
     * 显示修改订单项价格和数量窗体
     * @param {String} orderId
     * 订单编号
     * @param {String} orderNumber
     * 订单编号
     */
    showModifyPriceNumbersWindow: function (orderId, orderNumber, page) {
        Ext.create('CGP.order.view.modifyPriceNumbers.WindowEdit', {
            orderId: orderId, orderNumber: orderNumber, controller: this, page: page
        }).show();
    },

    /**
     * 修改表格价格和数量表格中的价格和数量的值
     * @param {Ext.ux.form.GridField} priceNumberGrid
     * 订单项价格和数量列表
     * @param {int} rowIndex
     * 行号索引
     */
    updatePriceNumbers: function (priceNumberGrid, rowIndex) {
        var me = this;
        var model = priceNumberGrid.getStore().getAt(rowIndex);
        me.window = Ext.create('Ext.window.Window', {
            height: 200, width: 300, title: i18n.getKey('modifyPriceNumbers'), layout: 'fit', modal: true, items: {
                xtype: 'form', defaultType: 'numberfield', margin: '10 0 0 0', border: false, items: [{
                    fieldLabel: i18n.getKey('price'),
                    name: "price",
                    labelAlign: 'right',
                    labelWidth: 70,
                    allowBlank: false,
                    minValue: 0,
                    width: 230,
                    allowNegative: false,
                    allowExponential: false,
                    nanText: i18n.getKey('nanText')
                }, {
                    fieldLabel: i18n.getKey('qty'),
                    name: "qty",
                    labelAlign: 'right',
                    labelWidth: 70,
                    allowBlank: false,
                    minValue: 1,
                    width: 230,
                    allowNegative: false,
                    allowExponential: false,
                    nanText: i18n.getKey('nanText')
                }

                ], buttons: ['->', {
                    text: i18n.getKey('save'), handler: function () {
                        var form = this.up('form');
                        if (form.isValid()) {
                            //获取表单数据
                            var price = form.getForm().findField('price').getValue();
                            var qty = form.getForm().findField('qty').getValue();
                            //更新数据到表格
                            model.set('price', price);
                            model.set('qty', qty);
                            model.set('amount', price * qty);
                            me.window.close();
                        }
                    }
                }, {
                    text: i18n.getKey('cancel'), handler: function () {
                        me.window.close();
                    }
                }], listeners: {
                    afterrender: function (form, eOpts) {
                        //初始化数据
                        form.loadRecord(model);
                    }
                }

            }
        }).show();
    },

    /**
     * 提交订单项价格、数量和修改原因数据
     * @param {String} orderId
     * 订单号
     * @param {Obect} data
     * 价格和数量
     * @param {Ext.window.Window} window
     * 修改订单项价格和数量窗体
     */
    modifyPriceNumbers: function (orderId, data, window, page) {

        var lm = window.setLoading(true);
        //当前页
        var currentPage = page.grid.getStore().currentPage;
        Ext.Ajax.request({
            url: adminPath + 'api/orders/' + orderId + '/items', method: 'PUT', headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            }, jsonData: data, success: function (r) {
                lm.hide();
                var resp = Ext.JSON.decode(r.responseText);
                if (resp.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'));
                    page.grid.getStore().loadPage(currentPage);
                    window.close();
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                }

            }, failure: function (resp) {
                lm.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    }, /**
     * 显示修改订单的后台备注窗口
     * @param {String} orderId
     * 订单编号
     * @param {String} orderNumber
     * 订单编号
     */
    modifyOrderRemark: function (record) {
        var me = this;
        var url = adminPath + 'api/orders/' + record.getId() + '/v2';
        JSAjaxRequest(url, 'GET', true, false, false, function (require, success, response) {
            if (success) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    var remark = resp.data.remark;
                    var orderId = resp.data._id;
                    var statusId = resp.data.status.id;
                    var orderNumber = resp.data.orderNumber;
                    Ext.create('CGP.order.view.modifyorderremark.modifyOrderRmWin', {
                        controller: me, remark: remark, statusId: statusId, orderId: orderId, orderNumber: orderNumber
                    }).show();
                }
            }
        }, true);
    }, /**
     * 确认修改订单备注
     * @param {Object} data 修改订单备注时所需要用到的参数
     * @param {Ext.window.Window} window 修改该订单备注的显示窗口
     */
    confirmModifyOrderRemark: function (data, window) {
        Ext.Msg.confirm('提示', '是否修改订单备注？', callback);

        function callback(id) {
            if (id === 'yes') {
                Ext.Ajax.request({
                    url: adminPath + 'api/orders/' + data['orderId'] + '/remark', method: 'PUT', headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    }, jsonData: {'remark': data['orderRemark']}, success: function (r) {
                        var resp = Ext.JSON.decode(r.responseText);
                        if (resp.success) {
                            window.close();
                            Ext.Msg.alert('提示', '修改成功！');
                        } else {
                            Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                        }

                    }, failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                })
            } else {
                window.close();
            }
        }
    }, createExtraParamsString: function (value) {
        var resultdata = value.objectJSON;
        var returnStr = '<table>';
        var datacount = 0;
        if (value && resultdata) {
            for (var i in resultdata) {
                datacount++;
                if (datacount <= 2) {
                    returnStr += '<tr>' + i + " : " + resultdata[i] + '</tr><br>'
                }
                if (datacount > 2) {
                    var parme = Ext.JSON.encode(resultdata).replace(/"/g, '\'');
                    returnStr += '<tr>' + new Ext.Template('<a href="javascript:{handler}">' + 'more...' + '</a>').apply({
                        handler: "showWindow(" + parme + ")"
                    }) + '</tr>';
                    break;
                }

            }
            returnStr += '</table>';
            return returnStr;
        } else {
            return;
        }
    }, /**
     * 订单重做
     * @param {} orderId
     * @param data
     * @param win
     * @param page
     */
    orderRedo: function (orderId, data, win, page) {
        var lm = win.setLoading();
        Ext.Ajax.request({
            method: 'POST', url: adminPath + 'api/orders/' + orderId + '/redo', headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            }, jsonData: data, success: function (r, o) {
                lm.hide();
                var resp = Ext.JSON.decode(r.responseText);
                if (resp.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('submitSuccess'));
                    page.grid.getStore().load();
                    win.close();
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                }
            }, failure: function (resp) {
                lm.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    }, /**
     * 为订单分配生产商
     * @param recordId 记录id
     * @param orderId 订单id
     * @param store grid的store
     */
    showSelectProducerWindow: function (recordId, orderId, gridstore) {
        var enableSupplier = [];
        var store = Ext.create('CGP.order.store.EnableSupplierStore', {
            orderId: orderId
        });
        var win = Ext.create('CGP.order.view.enableproducer.EnableProducerSelectWindow', {
            gridstore: gridstore, store: store, orderId: orderId, modal: true
        }).show();

    },


    clearParams: function () {

        var items = this.ownerCt.items.items;
        var store = this.ownerCt.ownerCt.getStore();

        for (var i = 0; i < items.length; i++) {
            if (items[i].xtype == 'button') continue;
            if (Ext.isEmpty(items[i].value)) continue;
            items[i].setValue('');
        }

        store.proxy.extraParams = null;
    }, printLabel: function (orderNumber) {
        var webiste = 'CGP';
        var email = Ext.JSON.decode(Ext.util.Cookies.get('user')).email;
        var token = Ext.util.Cookies.get('token');
        var labelUrlTemplate = 'qpmrp://|{#url{module<w_web_print>,tag<search>,source<search_srv>,companyid<QP>,part<{orderNumber}>,site<{website}>,userid<{email}>,token<{token}>,login{type<auto>,uid<DZLABEL>,pwd<az159874>}}}>}}'
        var labelUrl = new Ext.Template(labelUrlTemplate).apply({
            website: webiste, email: email, token: token, orderNumber: orderNumber
        });
        window.open(labelUrl);
    },
    editQuery: function (url, jsonData, isEdit) {
        var data = [], method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';

        JSAjaxRequest(url, method, true, jsonData, successMsg, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText.data.content || responseText.data;
                    console.log(data);
                }
            }
        }, true);
    },

    //异步修改存在加载动画
    asyncEditQuery: function (url, jsonData, isEdit, callFn, msg) {
        var method = isEdit ? 'PUT' : 'POST';

        JSAjaxRequest(url, method, true, jsonData, msg, callFn, true);
    },

    //查询
    getQuery: function (url) {
        var data = [];

        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText.data.content || responseText.data;
                }
            }
        })
        return data;
    },

    //删除
    deleteQuery: function (url) {
        JSAjaxRequest(url, 'DELETE', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    console.log(responseText.data.content || responseText.data);
                }
            }
        }, true)
    },

    getSessionStorageUser: function () {
        var controller = this,
            user = sessionStorage.getItem('user');

        return JSON.parse(user);
    },

    getCookieUser: function () {
        var controller = this,
            cookies = document.cookie.split('; '),
            user = null;

        // 遍历所有 Cookie，查找名为 'user' 的 Cookie
        cookies.forEach(function (cookie) {
            var parts = cookie.split('=');
            if (parts[0] === 'user') {
                user = parts[1]; // 获取 Cookie 值
            }
        });

        return user ? JSON.parse(decodeURIComponent(user)) : null; // 解析并返回用户数据
    },

    // 创建导出提示窗口
    createExportPromptWindow: function (data, callBack) {
        var controller = this

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('导出提示'),
            width: 500,
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    defaults: {
                        margin: '10 25 5 25',
                        allowBlank: true,
                        width: '80%'
                    },
                    layout: 'vbox',
                    diyGetValue: function () {
                        var me = this,
                            result = {},
                            items = me.items.items;
                        items.forEach(item => {
                            var name = item['name'];
                            if (name) {
                                result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue()
                            }
                        })
                        return result;
                    },
                    diySetValue: function (data) {
                        var me = this,
                            items = me.items.items;
                        items.forEach(item => {
                            var {name} = item;
                            if (name) {
                                item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name])
                            }
                        })
                    },
                    items: [
                        {
                            xtype: 'displayfield',
                            name: 'prompt',
                            itemId: 'prompt',
                            width: '100%',
                            value: JSCreateFont('red', true, '导出数据记录超过1000条，系统将采用异步导出文件到您的邮箱!'),
                            diySetValue: function (data) {
                                var me = this;

                                data && me.setValue(JSCreateFont('red', true, data))
                            }
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('邮箱'),
                            name: 'email',
                            itemId: 'email',
                            validator: function (value) {
                                // 邮箱正则表达式
                                var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                                return emailRegex.test(value) ? true : '请输入有效的邮箱地址';
                            },
                            allowBlank: false,
                        },
                        {
                            xtype: 'textarea',
                            fieldLabel: i18n.getKey('邮件备注'),
                            height: 60,
                            margin: '10 25 10 25',
                            name: 'remark',
                            itemId: 'remark',
                        }
                    ],
                    listeners: {
                        afterrender: function (comp) {
                            data && comp.diySetValue(data);
                        }
                    }
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    text: i18n.getKey('导出'),
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            form = win.getComponent('form'),
                            formData = form.diyGetValue();

                        if (form.isValid()) {
                            console.log(formData);
                            callBack && callBack(formData);
                            win.close();
                        }
                    }
                }
            },
        }).show();
    },

    queryExportExcelEmail: function (data, code) {
        var controller = this,
            url = adminPath + `api/orders/exportExcel/email?code=${code}`;

        controller.asyncEditQuery(url, data, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    const data = responseText.data;
                    console.log(data);

                    JSShowNotification({
                        type: data ? 'success' : 'error',
                        title: data ? '邮件发起成功,请耐心等待!' : '邮件发起失败,请询问开发人员!',
                    });
                }
            }
        }, false)
    },

    getSelectedIds: function (grid) {
        var selected = grid.getSelectionModel().getSelection(),
            result = [];

        selected.forEach(item => {
            result.push(item.data._id);
        })
        return result;
    },

    createSelectedExportExcelFn: function (grid, btn, type, totalCostPermission) {
        var controller = this,
            selected = controller.getSelectedIds(grid),
            code = !totalCostPermission ? 'orderWithoutCost' : 'order',
            newCode = type === 'productInfo' ? 'orderSkuInfo' : code,
            url = adminPath + `api/orders/exportExcel/v3?code=${newCode}`,
            filter = [{
                "name": "includeIds", "type": "number", "value": `[` + selected + `]`
            }]

        if (!selected.length) {
            return JSShowNotification({
                type: 'info',
                title: '请选择要导出的数据!',
            })
        }

        btn.originalFn(url, Ext.JSON.encode(filter), newCode);
    },

    createExportExcelFn: function (btn, selectedIds, orderTotalCount, type, totalCostPermission) {
        var isOnSelectRecord = selectedIds?.length,
            selectRecordText = isOnSelectRecord ? JSCreateFont('green', true, `(${isOnSelectRecord} 条)`) : '',
            orderTotalCountText = orderTotalCount ? JSCreateFont('green', true, `(${orderTotalCount} 条)`) : '';

        return Ext.create('CGP.order.view.order.CreateWindow', {
            title: i18n.getKey('导出订单Excel'),
            width: 600,
            formConfig: {
                items: [
                    //单选
                    {
                        xtype: 'radiogroup',
                        name: 'isAutomatic',
                        itemId: 'isAutomatic',
                        vertical: true,
                        allowBlank: true,
                        fieldLabel: i18n.getKey('导出范围'),
                        labelWidth: 120,
                        items: [
                            {
                                boxLabel: `当前查询订单 ${orderTotalCountText}`,
                                width: 200,
                                name: 'exportStrategy',
                                inputValue: 'all',
                                checked: true
                            },
                            {
                                boxLabel: `当前选中订单 ${selectRecordText}`,
                                width: 200,
                                name: 'exportStrategy',
                                inputValue: 'selected',
                                disabled: !isOnSelectRecord,
                                returnArray: true,
                            }
                        ],
                        listeners: {
                            change: function (comp, newValue) {
                                var form = comp.ownerCt, isAutomatic2 = form.getComponent('isAutomatic2'),
                                    isSelected = newValue['exportStrategy'] === 'selected';

                                isAutomatic2.setVisible(!isSelected);
                                isAutomatic2.setDisabled(isSelected);
                            }
                        }
                    },
                    // 多选
                    {
                        xtype: 'checkboxgroup',
                        name: 'isAutomatic2',
                        itemId: 'isAutomatic2',
                        vertical: true,
                        allowBlank: true,
                        fieldLabel: i18n.getKey('包含其他订单'),
                        labelWidth: 120,
                        items: [
                            {
                                boxLabel: '测试订单',
                                width: 200,
                                name: 'orderType',
                                inputValue: 'test',
                            },
                            {
                                boxLabel: '打样订单',
                                width: 200,
                                name: 'orderType',
                                inputValue: 'sample'
                            }
                        ]
                    },
                ]
            },
            bbarConfig: {
                saveBtnCfg: {
                    width: 80,
                    text: i18n.getKey('确认导出'),
                    changeFilterName: function (filter) {
                        var params = [
                            {
                                origin: 'statusId',
                                changed: 'orderStatusId'
                            }
                        ]

                        filter.forEach(item => {
                            var {name} = item;
                            params.forEach(item_v2 => {
                                var {origin, changed} = item_v2;
                                if (name === origin) {
                                    item['name'] = changed
                                }
                            })
                        });

                        return filter;
                    },
                    orderTypeChangeFilterFn: function (orderType, filter) {
                        var result = {
                            test: {
                                name: 'isItTest', value: false, type: 'boolean'
                            },
                            sample: {
                                name: 'type', value: 'NOT_PROOFING', type: 'string'
                            }
                        };

                        // 选中哪个选项删哪个
                        if (orderType) {
                            orderType = Ext.isArray(orderType) ? orderType : [orderType]
                            orderType.forEach(item => {
                                delete result[item];
                            })
                        }

                        //过滤存在type时 就将type删掉
                        filter.forEach(item => {
                            var {name} = item;
                            if (name === 'type') {
                                delete result['sample'];
                            }
                        })

                        return Ext.Array.merge(filter, Object.values(result));
                    },
                    handler: function (_btn) {
                        var win = _btn.ownerCt.ownerCt,
                            form = win.getComponent('form'),
                            selected = btn.getSelectedIds(),
                            filter = _btn.changeFilterName(btn.getFilterInfo()),
                            formValue = form.getValues(),
                            {orderType, exportStrategy} = formValue,
                            code = !totalCostPermission ? 'orderWithoutCost' : 'order',
                            newCode = type === 'productInfo' ? 'orderSkuInfo' : code,
                            url = adminPath + `api/orders/exportExcel/v3?code=${newCode}`,
                            exportStrategyGather = {
                                all: () => {
                                    filter = _btn.orderTypeChangeFilterFn(orderType, filter);

                                    return true;
                                },
                                selected: () => {
                                    filter = [{
                                        "name": "includeIds",
                                        "type": "number",
                                        "value": `[` + selected + `]`
                                    }]

                                    if (!selected.length) {
                                        JSShowNotification({
                                            type: 'info',
                                            title: '请选择要导出的数据!',
                                        })
                                    }

                                    return selected.length;
                                }
                            },
                            isExportType = exportStrategyGather[exportStrategy]();

                        if (form.isValid() && isExportType) {
                            btn.originalFn(url, Ext.JSON.encode(filter), newCode);

                            win.close();
                        }
                    }
                }
            }
        }).show()
    },

    createChangeRateWin: function (taxCurrencyExchangeRates) {
        var exChangeController = Ext.create('CGP.exchangerateconfig.controller.Controller'),
            url = adminPath + 'api/currencies?page=1&limit=1000&filter=[{"name":"website.id","type":"number","value":11}]',
            currenciesData = exChangeController.getQuery(url);

        Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('查看_汇率'),
            width: 800,
            height: 400,
            items: [{
                xtype: 'gridfieldwithcrudv2',
                name: 'exchangeRates',
                itemId: 'exchangeRates',
                allowBlank: false,
                autoScroll: true,
                readOnly: true,
                actionHidden: true,
                diyGetValue: function () {
                    var me = this, getValue = me.getSubmitValue(), result = getValue.map(item => {
                        var {
                            _id, clazz, outputCurrencyCode, inputCurrencyCode, exchangeRateSetId, exchangeRate,
                        } = item, {min, max} = exchangeRate, result = {
                            _id, clazz, outputCurrencyCode, inputCurrencyCode, inputRate: min, outRate: max
                        }

                        exchangeRateSetId && (result['exchangeRateSetId'] = exchangeRateSetId);

                        return result;
                    })

                    return result;
                },
                diySetValue: function (data) {
                    if (data) {
                        var me = this, store = me._grid.store, result = data.map(item => {
                            var {
                                _id, clazz, outputCurrencyCode, inputCurrencyCode, exchangeRateSetId, inputRate, outRate
                            } = item;

                            return {
                                _id, clazz, outputCurrencyCode, inputCurrencyCode, exchangeRateSetId, exchangeRate: {
                                    min: inputRate, max: outRate,
                                }
                            }
                        });
                        console.log(data);

                        store.proxy.data = result;
                        store.load();
                    }
                },
                gridConfig: {
                    store: {
                        fields: [{
                            name: '_id', type: 'number', useNull: true
                        }, {
                            name: 'exchangeRateSetId', type: 'string',
                        }, {
                            name: 'clazz', type: 'string', defaultValue: 'com.qpp.cgp.domain.common.rate.ExchangeRate'
                        }, {
                            name: 'inputCurrencyCode', type: 'string',
                        }, {
                            name: 'inputCurrencyDisplayName', type: 'string', convert: function (value, record) {
                                var code = record.get('inputCurrencyCode');
                                return exChangeController.getCurrenciesDisplayName(currenciesData, code);
                            }
                        }, {
                            name: 'outputCurrencyCode', type: 'string',
                        }, {
                            name: 'outputCurrencyDisplayName', type: 'string', convert: function (value, record) {
                                var code = record.get('outputCurrencyCode');
                                return exChangeController.getCurrenciesDisplayName(currenciesData, code);
                            }
                        }, {
                            name: 'exchangeRate', type: 'object',
                        }], data: []
                    },
                    autoScroll: true,
                    columns: [{
                        xtype: 'rownumberer',
                        autoSizeColumn: false,
                        width: 30,
                        resizable: true,
                        menuDisabled: true,
                        tdCls: 'vertical-middle',
                    },
                        /*{
                        text: i18n.getKey('id'),
                        dataIndex: '_id',
                        width: 100,
                        align: 'center',
                        sortable: false
                    }, */
                        {
                            text: i18n.getKey('输入货币'),
                            dataIndex: 'inputCurrencyDisplayName',
                            flex: 1,
                            align: 'center',
                            sortable: false
                        }, {
                            text: i18n.getKey('输出货币'),
                            dataIndex: 'outputCurrencyDisplayName',
                            flex: 1,
                            align: 'center',
                            sortable: false
                        }, {
                            text: i18n.getKey('汇率'),
                            dataIndex: 'exchangeRate',
                            flex: 1,
                            align: 'center',
                            sortable: false,
                            renderer: function (value) {
                                var {min, max} = value;

                                return `${min} → ${max}`;
                            }
                        },]
                },
                winConfig: {
                    layout: 'fit', hidden: true, formConfig: {
                        xtype: 'errorstrickform',
                        layout: 'vbox',
                        width: 400,
                        useForEach: true,
                        isValidForItems: true,
                        defaults: {
                            allowBlank: false, labelWidth: 110, width: '100%'
                        },
                        items: [{
                            xtype: 'numberfield',
                            fieldLabel: i18n.getKey('id'),
                            name: 'id',
                            itemId: 'id',
                            hidden: true,
                            allowBlank: true,
                        }, {
                            xtype: 'combo',
                            name: 'inputCurrencyCode',
                            itemId: 'inputCurrencyCode',
                            fieldLabel: i18n.getKey('输入货币'),
                            editable: false,
                            allowBlank: false,
                            labelWidth: 100,
                            valueField: 'code',
                            displayField: 'displayNameV2',
                            store: Ext.create("CGP.currency.store.Currency", {
                                params: {
                                    filter: '[{"name":"website.id","value":11,"type":"number"}]'
                                },
                            })
                        }, {
                            xtype: 'combo',
                            name: 'outputCurrencyCode',
                            itemId: 'outputCurrencyCode',
                            fieldLabel: i18n.getKey('输出货币'),
                            editable: false,
                            allowBlank: false,
                            labelWidth: 100,
                            valueField: 'code',
                            displayField: 'displayNameV2',
                            store: Ext.create("CGP.currency.store.Currency", {
                                params: {
                                    filter: '[{"name":"website.id","value":11,"type":"number"}]'
                                },
                            })
                        }, {
                            xtype: 'minmaxfield',
                            name: 'exchangeRate',
                            itemId: 'exchangeRate',
                            fieldLabel: i18n.getKey('汇率'),
                            isEnable: false,
                            setInitConfig: function () {
                                var me = this, configGather = [{
                                    compName: 'min', emptyText: '输入货币'
                                }, {
                                    compName: 'mediateText', value: ' → '
                                }, {
                                    compName: 'max', emptyText: '输出货币'
                                },];
                                configGather.forEach(item => {
                                    var {compName, emptyText, value} = item, comp = me.getComponent(compName);

                                    emptyText && (comp.emptyText = emptyText);
                                    comp?.reset();
                                    value && comp?.setValue(value);
                                })
                            },
                            listeners: {
                                afterrender: function (comp) {
                                    comp.setInitConfig();
                                }
                            }
                        },]
                    }
                },
                listeners: {
                    afterrender: function (comp) {
                        var grid = comp?._grid, tools = grid.getDockedItems('toolbar[dock="top"]')[0];
                        tools.setVisible(false);
                        comp.diySetValue(taxCurrencyExchangeRates);
                    }
                }
            }],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt

                        win.close();
                    }
                },
                cancelBtn: {
                    hidden: true
                }
            },
        }).show();

    },

    getExchangeRateInfo: function (rates) {
        // 验证输入参数是否包含两个对象
        if (rates && rates.length !== 2) {
            throw new Error("参数必须包含且仅包含两个对象");
        }

        const [rate1, rate2] = rates;
        let platFormCurrencyCode, inputCurrencyCode, inputRate, outputCurrencyCode, outRate;

        // 检查两个对象的 currencyCode
        if (rate1.outputCurrencyCode === rate2.inputCurrencyCode) {
            platFormCurrencyCode = rate1.outputCurrencyCode;
            inputCurrencyCode = rate1.inputCurrencyCode;
            inputRate = rate1.rate;
            inputRate = {
                input: rate1.inputRate,
                out: rate1.outRate
            };
            outputCurrencyCode = rate2.outputCurrencyCode;
            outRate = {
                input2: rate2.inputRate,
                out2: rate2.outRate
            };
        } else if (rate2.outputCurrencyCode === rate1.inputCurrencyCode) {
            platFormCurrencyCode = rate2.outputCurrencyCode;
            inputCurrencyCode = rate2.inputCurrencyCode;
            inputRate = {
                input: rate2.inputRate,
                out: rate2.outRate
            };
            outputCurrencyCode = rate1.outputCurrencyCode;
            outRate = {
                input2: rate1.inputRate,
                out2: rate1.outRate
            };
        } else {
            throw new Error("两个对象之间没有匹配的 currencyCode");
        }

        // 返回最终结果
        return {
            inputCurrencyCode,
            inputRate,
            platFormCurrencyCode,
            outputCurrencyCode,
            outRate
        };
    },
    getExchangeRateText: function (defaultCurrency, shippingCurrencyExchangeRates) {
        var controller = this,
            result = '',
            length = shippingCurrencyExchangeRates?.length;

        if (length > 1) {
            var {
                    inputCurrencyCode,
                    inputRate,
                    platFormCurrencyCode,
                    outputCurrencyCode,
                    outRate
                } = controller.getExchangeRateInfo(shippingCurrencyExchangeRates),
                {input, out} = inputRate,
                {input2, out2} = outRate;

            result = `产品价格货币(${inputCurrencyCode}) -- <sup>( ${input} : ${out} )</sup> --> 平台货币(${platFormCurrencyCode}) -- <sup>( ${input2} : ${out2} )</sup> --> 支付货币(${outputCurrencyCode})`;
        }

        if (length === 1) {
            var {inputCurrencyCode, outputCurrencyCode, inputRate, outRate} = shippingCurrencyExchangeRates[0];

            result = `产品价格货币(${inputCurrencyCode}) -- <sup>( 1 : 1 )</sup> --> 平台货币(${inputCurrencyCode}) -- <sup>( ${inputRate} : ${outRate} )</sup> --> 支付货币(${outputCurrencyCode})`;
        }

        return result ? JSCreateFont('#000000', true, result, 13) : '';
    },

    //获取订单导出任务队列状态信息
    getOrderExportTaskStatusInfoV2: function (runningFn, finishFn, btn, intervalTime, finishMsg) {
        var controller = this,
            url = adminPath + 'api/excelRecords/code?code=orderWithoutCost',
            queryData = JSGetQuery(url);

        if (!!queryData) {
            runningFn(btn, queryData);
            setTimeout(item => {
                console.log('导出任务正在进行中!');
                controller.getOrderExportTaskStatusInfoV2(runningFn, finishFn, btn, intervalTime, '导出任务已完成');
            }, intervalTime);
        } else {
            finishFn(btn, finishMsg);
        }

        return queryData;
    },

    getOrderFilterTotalCount: function (filterParams) {
        var url = adminPath + 'api/orders/v2?page=1&limit=1&filter=' + Ext.JSON.encode(filterParams),
            totalCount = 0;

        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    var data = responseText?.data;

                    totalCount = data['totalCount'] || 0;
                }
            }
        }, false);

        return totalCount;
    },

    getOrderExportTaskStatusInfo: function (type, totalCostPermission, callBack) {
        var controller = this,
            code = !totalCostPermission ? 'orderWithoutCost' : 'order',
            newCode = type === 'productInfo' ? 'orderSkuInfo' : code,
            url = adminPath + `api/excelRecords/code?code=${newCode}`,
            queryData = JSGetQuery(url);

        if (queryData) {
            controller.checkOrderExportTaskInfo(queryData);
        } else {
            callBack && callBack();
        }
    },

    checkOrderExportTaskInfo: function (data) {
        if (!!data) {
            Ext.create('Ext.window.Window', {
                layout: 'fit',
                modal: true,
                constrain: true,
                title: i18n.getKey('提示'),
                width: 350,
                items: [
                    {
                        xtype: 'errorstrickform',
                        itemId: 'form',
                        defaults: {
                            margin: '10 25 5 25',
                            allowBlank: true
                        },
                        layout: 'vbox',
                        diyGetValue: function () {
                            var me = this,
                                result = null,
                                items = me.items.items;
                            items.forEach(item => {
                                result = item.diyGetValue ? item.diyGetValue() : item.getValue()
                            })
                            return result;
                        },
                        diySetValue: function (data) {
                            var me = this,
                                items = me.items.items;

                            data['info'] = '导出任务进行中, 请耐心等待, 请勿重复点击!';
                            items.forEach(item => {
                                var {name} = item;
                                item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name])
                            })
                        },
                        items: [
                            {
                                xtype: 'displayfield',
                                name: 'info',
                                itemId: 'info',
                                diySetValue: function (data) {
                                    var me = this;
                                    me.setValue(JSCreateFont('red', true, data));
                                }
                            },
                            /*{
                                xtype: 'displayfield',
                                name: 'email',
                                itemId: 'email',
                                fieldLabel: i18n.getKey('发起人邮箱'),
                            },*/
                            {
                                xtype: 'displayfield',
                                name: 'startTime',
                                itemId: 'startTime',
                                fieldLabel: i18n.getKey('任务发起时间'),
                                diySetValue: function (data) {
                                    var me = this;

                                    me.setValue(data ? Ext.Date.format(new Date(+data), 'Y-m-d H:i:s') : '');
                                }
                            }
                        ],
                        listeners: {
                            afterrender: function (comp) {
                                data && comp.diySetValue(data);
                            }
                        }
                    },
                ],
                bbar: {
                    xtype: 'bottomtoolbar',
                    saveBtnCfg: {
                        handler: function (btn) {
                            var win = btn.ownerCt.ownerCt;
                            win.close();
                        }
                    },
                    cancelBtnCfg: {
                        hidden: true
                    }
                },
            }).show();
        } else {
            Ext.Msg.alert('提示', '为获取到导出任务信息!')
        }
    },

    createRetryOrderWindow: function (record, orderItemId) {
        var statusId = record.get('statusId'),
            orderId = record.get('id'),
            orderNumber = record.get('orderNumber');

        Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('选择_重排策略'),
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    defaults: {
                        margin: '10 25 5 25',
                    },
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'combo',
                            fieldLabel: i18n.getKey('重排策略'),
                            name: 'type',
                            itemId: 'type',
                            displayField: 'name',
                            valueField: 'key',
                            editable: false,
                            labelWidth: 120,
                            store: {
                                fields: ['key', 'name'],
                                data: [
                                    {
                                        key: 'all_orderitems',
                                        name: '整单重排'
                                    },
                                    {
                                        key: 'failure_orderitems',
                                        name: '自动重排失败订单项'
                                    },
                                ]
                            },
                            listeners: {
                                afterrender: function (comp) {
                                    comp.setValue('failure_orderitems')
                                },
                                change: function (comp, newValue) {
                                    var form = comp.ownerCt,
                                        isCleanOrderFolder = form.getComponent('isCleanOrderFolder');

                                    isCleanOrderFolder.setVisible(newValue !== 'failure_orderitems');
                                }
                            }
                        },
                        {
                            xtype: 'booleancombo',
                            fieldLabel: i18n.getKey('是否清除排版文件'),
                            name: 'isCleanOrderFolder',
                            itemId: 'isCleanOrderFolder',
                            labelWidth: 120,
                            hidden: true,
                            value: true
                        },
                    ]
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            form = win.getComponent('form'),
                            formData = form.getValues(),
                            {type, isCleanOrderFolder} = formData,
                            typeUrlGather = {
                                all_orderitems: adminPath + `api/orders/${orderId}/composing/retry?scope=${type}&isCleanOrderFolder=${isCleanOrderFolder}`,
                                failure_orderitems: adminPath + `api/orders/${orderId}/composing/retry?scope=${type}&orderItemIds=${orderItemId}`,
                            },
                            url = typeUrlGather[type];

                        if (form.isValid()) {
                            controller.asyncEditQuery(url, null, false, function (require, success, response) {
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    if (responseText.success) {
                                        Ext.Msg.alert(i18n.getKey('提示'), i18n.getKey('重排请求发起成功,点击进入排版进度!'), function () {
                                            var store = Ext.create('CGP.common.typesettingschedule.store.LastTypesettingScheduleStore', {
                                                params: {
                                                    filter: '[{"name":"orderNumber","value":"' + orderNumber + '","type":"string"}]',
                                                }
                                            });

                                            Ext.create('CGP.common.typesettingschedule.TypeSettingGrid', {
                                                record: record,
                                                gridStore: store,
                                                orderId: orderId,
                                                statusId: statusId,
                                                orderNumber: orderNumber
                                            }).show();
                                        });
                                        win.close();
                                    }
                                }
                            }, false)
                        }
                    }
                },
            }
        }).show();
    }
});
