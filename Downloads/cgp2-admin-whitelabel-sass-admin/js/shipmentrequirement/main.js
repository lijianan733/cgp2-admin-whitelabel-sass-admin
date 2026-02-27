Ext.Loader.setPath({
    enabled: true,
    "CGP.orderdetails": path + "partials/order/details/app"
});
Ext.Loader.syncRequire([
    'CGP.orderdetails.view.render.OrderLineItemRender',
])
Ext.onReady(function () {

    var controller = Ext.create('CGP.shipmentrequirement.controller.Controller'),
        store = Ext.create("CGP.shipmentrequirement.store.DeliverLineItemStore"),
        mainRenderer = Ext.create('CGP.orderdetails.view.render.OrderLineItemRender');

    Ext.apply(Ext.form.field.VTypes, {
        phone: function (v) {
            return /^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/.test(v);
        },
        phoneText: '请输入有效的电话号码'
        //phoneMask: '输入010-1234565或18888888888'
    });

    function setLockStatus(id, isLock) {
        var url = adminPath + `api/shipmentRequirements/${id}/lock?isLock=${isLock}`,
            isLockText = isLock ? '锁定' : '解锁';

        controller.asyncEditQuery(url, {}, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    store.load();
                }
            }
        }, isLockText + '成功')
    }


    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('shipmentRequirement'),
        block: 'shipmentrequirement',
        editPage: 'edit.html',
        tbarCfg: {
            hiddenButtons: ['help'],
            btnConfig: {
                text: i18n.getKey('批量锁定'),
                width: 100,
                disabled: false,
                handler: function () {
                    var grid = Ext.getCmp('gridPageId'),
                        selection = grid.getSelectionModel().getSelection();

                    if (selection.length > 0) {
                        Ext.create('Ext.window.Window', {
                            layout: 'fit',
                            modal: true,
                            constrain: true,
                            title: i18n.getKey('批量锁定'),
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
                                            fieldLabel: i18n.getKey('锁定/解锁'),
                                            name: 'isLock',
                                            itemId: 'isLock',
                                            allowBlank: false,
                                            editable: false,
                                            store: [
                                                [true, i18n.getKey('锁定')],
                                                [false, i18n.getKey('解锁')]
                                            ],
                                            value: true
                                        }
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
                                            {isLock} = formData;

                                        if (form.isValid()) {
                                            Ext.each(selection, function (item) {
                                                var id = item.get('id');
                                                setLockStatus(id, isLock);
                                            });
                                            win.close();
                                        }
                                    }
                                }
                            },
                        }).show();
                    } else {
                        Ext.Msg.alert(i18n.getKey('提示'), i18n.getKey('请至少选中一条数据!'));
                    }
                }
            },
            btnImport: {
                text: i18n.getKey('批量审批发货要求'),
                width: 140,
                disabled: false,
                iconCls: 'icon_audit',
                // hidden: true, //先提交部分　
                handler: function (btn) {
                    var tools = btn.ownerCt,
                        grid = tools.ownerCt,
                        store = grid.store,
                        selectRecords = grid.getSelectionModel().getSelection(),
                        selectIds = selectRecords?.map(record => {
                            return record.get('id').toString();
                        }),
                        title = i18n.getKey('审批_发货要求'),
                        fieldLabel = i18n.getKey('审批范围'),
                        orderTotalCount = store.totalCount;

                    mainRenderer.createExportExcelWindow(title, fieldLabel, selectIds, orderTotalCount, function (win, selModel) {
                        mainRenderer.createOrderItemAuditFormWindow(null, function (win, data) {
                            var {customerNotify, comment} = data,
                                selModelGather = {
                                    all: function () {
                                        var proxy = grid.store.proxy,
                                            queryUrl = proxy.url,
                                            filterComp = proxy.filter,
                                            filterParams = filterComp.getQuery(),
                                            queryData = JSGetQueryAllData(queryUrl, filterParams),
                                            queryIds = queryData?.map(item => {
                                                var shipmentRequirementId = item?.id;

                                                return shipmentRequirementId ? shipmentRequirementId.toString() : '';
                                            });

                                        return {
                                            "ids": queryIds,
                                            "customerNotify": customerNotify,
                                            "comment": comment
                                        }
                                    },
                                    selected: function () {

                                        return {
                                            "ids": selectIds,
                                            "customerNotify": customerNotify,
                                            "comment": comment
                                        }
                                    }
                                },
                                url = adminPath + `api/shipmentRequirements/orderLineItem/batchAudit`,
                                putData = selModelGather[selModel]();

                            JSAsyncEditQuery(url, putData, true, function (require, success, response) {
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText),
                                        data = responseText?.data;

                                    if (responseText.success) {
                                        if (Ext.Object.isEmpty(data)) {
                                            win.close();
                                            store.load();
                                            JSShowNotification({
                                                type: 'success',
                                                title: '审批成功!',
                                            });
                                        } else {
                                            //需报关id
                                            var auditCodes = Object.keys(data),
                                                codeArr = ['108000358', '108000359', '108000360'],
                                                idText = i18n.getKey('id'),
                                                codeGather = {
                                                    '108000358': `下列订单项(${idText})随机状态未完成:<br>`,
                                                    '108000359': `下列订单项(${idText})的报关分类未完备:<br>`,
                                                    '108000360': `下列订单项(${idText})关联的订单未完成后续数据处理:<br>`
                                                },
                                                errorTexts = []

                                            auditCodes.forEach(item => {
                                                var isExist = codeArr.includes(item),
                                                    auditIds = data[item],
                                                    errorText = isExist ? codeGather[item] : '下列订单项存在问题(请询问开发人员):<br>';

                                                errorTexts.push(`${errorText} ${auditIds}`);
                                            });

                                            mainRenderer.createAuditErrorTextWindow(errorTexts, function (win, formData) {
                                                win.close();
                                            });
                                        }
                                        store.load();
                                    }
                                }
                            }, true)
                        });
                        win.close();
                    });
                }
            },
            btnExport: {
                text: i18n.getKey('导出发货要求'),
                width: 120,
                disabled: false,
                hidden: false, //先提交部分　
                handler: function (btn) {
                    var url = adminPath + 'api/shipmentRequirements/exportExcel',
                        tools = btn.ownerCt,
                        grid = tools.ownerCt,
                        store = grid.store,
                        selectRecords = grid.getSelectionModel().getSelection(),
                        title = i18n.getKey('导出_发货项Excel'),
                        fieldLabel = i18n.getKey('导出范围'),
                        gridFilterData = grid.filter.getQuery(),
                        selectIds = selectRecords?.map(record => record.get('id')),
                        orderTotalCount = store.totalCount;

                    mainRenderer.createExportExcelWindow(title, fieldLabel, selectIds, orderTotalCount, function (win, selModel) {
                        var selModelGather = {
                                all: function () {
                                    return JSON.stringify(gridFilterData);
                                },
                                selected: function () {
                                    var result = [
                                        {
                                            "name": "includeIds",
                                            "type": "number",
                                            "value": `[${selectIds}]`
                                        }
                                    ]

                                    return JSON.stringify(result);
                                }
                            },
                            filterArray = selModelGather[selModel]();

                        mainRenderer.downloadOriginalFn(url, filterArray, grid, function () {
                            win.close();
                        });
                    });
                }
            }
        },
        gridCfg: {
            store: store,
            frame: false,
            id: 'gridPageId',
            columnDefaults: {
                autoSizeColumn: true,
                align: 'center',
            },
            editActionHandler: function (view, rowIndex, colIndex, obj, event, record, dom) {
                var me = page,
                    grid = view.ownerCt,
                    m = grid.getStore().getAt(rowIndex),
                    isLock = m.data['isLock'];

                JSOpen({
                    id: me.block + me.editSuffix,
                    url: path + 'partials/' + me.block + '/' + me.editPage + '?id=' + m.get(m.idProperty) + '&isReadOnly=' + isLock,
                    title: (me.isReadOnly ? i18n.getKey('check') : me.pageText.edit) + '_' + me.i18nblock + '(' + m.get(m.idProperty) + ')',
                    refresh: true
                });
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    width: 150,
                    dataIndex: 'id',
                    sortable: true,
                    xtype: 'atagcolumn',
                    getDisplayName: function (value, mateData, record) {
                        mateData.tdAttr = 'data-qtip=查看发货要求详细';
                        var isLock = record.get('isLock'),
                            extraText = isLock ? JSCreateFont('red', true, '(已锁定)') : '';
                        return '<a href="#" style="color: blue">' + value + '</a>  ' + extraText;
                    },
                    clickHandler: function (value) {
                        JSOpen({
                            id: 'shipmentrequirement' + '_edit',
                            url: path + 'partials/shipmentrequirement/edit.html?id=' + value + '&isReadOnly=' + 'true',
                            title: i18n.getKey('shipmentRequirement') + '(' + value + ')',
                            refresh: true
                        });
                    }
                },
                {
                    xtype: 'componentcolumn',
                    text: i18n.getKey('operation'),
                    sortable: false,
                    draggable: false,
                    hideable: false,
                    width: 100,
                    resizable: false,
                    dataIndex: 'isLock',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return '当前页统计'
                    },
                    renderer: function (value, metadata, record, row, col, store) {
                        var shipmentRequirementId = record.get('id');

                        return {
                            xtype: 'button',
                            ui: 'default-toolbar-small',
                            text: i18n.getKey('options'),
                            width: '100%',
                            flex: 1,
                            height: 26,
                            menu: [
                                {
                                    text: i18n.getKey('锁定'),
                                    hidden: value,
                                    handler: function (btn) {
                                        var id = record.get('id');
                                        setLockStatus(id, true);
                                    }
                                },
                                {
                                    text: i18n.getKey('解锁'),
                                    hidden: !value,
                                    handler: function (btn) {
                                        var id = record.get('id');
                                        setLockStatus(id, false);
                                    }
                                },
                                {
                                    text: i18n.getKey('拆单'),
                                    handler: function (btn) {
                                        var id = record.get('id');
                                        var url = adminPath + 'api/shipmentRequirements/' + id;
                                        JSAjaxRequest(url, 'GET', true, null, false, function (require, success, response) {
                                            if (success) {
                                                var responseText = Ext.JSON.decode(response.responseText);
                                                if (responseText.success) {
                                                    var items = responseText.data.items;
                                                    controller.createPaymentSubtotalItemWindow(items, shipmentRequirementId)
                                                }
                                            }
                                        });
                                    }
                                },
                                {
                                    text: i18n.getKey('审批订单项'),
                                    handler: function (btn) {
                                        var isSanction = false,
                                            url = adminPath + `api/order/shipmentRequirement/${shipmentRequirementId}/multiAddressDeliveryDetail/v2`,
                                            pageType = 'shipmentrequirement',
                                            shipmentRequirementData = JSGetQuery(url);

                                        if (shipmentRequirementData) {
                                            var {singleAddressDeliveryDetails} = shipmentRequirementData;

                                            singleAddressDeliveryDetails?.forEach(item => {
                                                const {addressFlag, supplier, sanctionCheckResult} = item;

                                                if (sanctionCheckResult) {
                                                    var {hits, count} = sanctionCheckResult,
                                                        supplierTypeGather = {
                                                            QPSON: function () {
                                                                if (hits?.length) {
                                                                    isSanction = true;
                                                                }
                                                            },
                                                            COMPLYADVANTAGE: function () {
                                                                if (hits?.length) {
                                                                    isSanction = true;
                                                                }
                                                            },
                                                            SANCTIONSIO: function () {
                                                                if (count) {
                                                                    isSanction = true;
                                                                }
                                                            },
                                                        };

                                                    supplierTypeGather[supplier || 'QPSON']();
                                                }
                                            });
                                        } else {
                                            return JSShowNotification({
                                                type: 'info',
                                                title: '该发货要求并未找到对应的发货项!',
                                            });
                                        }

                                        JSOpen({
                                            id: 'auditOrderItempage',
                                            url: path + 'partials/orderstatusmodify/auditorderitempage.html' +
                                                '?shippingDetailsId=' + shipmentRequirementId +
                                                '&pageType=' + pageType +            //标记进入页面
                                                '&isSanction=' + isSanction +   //是否为制裁单
                                                //'&orderNumber=' + orderNumber +   //订单号
                                                '&isEditManufactureCenter=' + true,  //标记是否是修改生产基地页面(不显示子组件)
                                            title: i18n.getKey('订单项审核'),
                                            refresh: true
                                        })
                                    }
                                }
                            ]
                        };
                    }
                },
                {
                    dataIndex: 'address',
                    text: i18n.getKey('收件人信息'),
                    width: 470,
                    renderer: function (value, metadata, record) {
                        var str = JSBuildAddressInfo(value);
                        metadata.tdAttr = 'data-qtip="' + str + '"';
                        return str;
                    }
                },
                {
                    text: i18n.getKey('状态'),
                    dataIndex: 'id',
                    width: 150,
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        var status = record.get('status'),
                            isLock = record.get('isLock'),
                            frontendName = status?.frontendName,
                            lockText = isLock ? '(已锁定)' : '';

                        return `${frontendName} ` + JSCreateFont('red', true, lockText);
                    }
                },
                {
                    xtype: 'componentcolumn',
                    text: i18n.getKey('进程信息'),
                    dataIndex: 'id',
                    width: 200,
                    renderer: function (value, metadata, record, row, col, store, gridView) {
                        var paibanStatus = record.get('paibanStatus'),
                            productionStatus = record.get('productionStatus'),
                            shipmentRequirementId = value,
                            paibanGather = {
                                4: {
                                    color: 'green',
                                    text: i18n.getKey('排版成功'),
                                },
                                3: {
                                    color: 'red',
                                    text: i18n.getKey('排版失败'),
                                },
                                2: {
                                    color: 'blue',
                                    text: i18n.getKey('正在排版'),
                                },
                                1: {
                                    color: 'grey',
                                    text: i18n.getKey('等待排版'),
                                },
                            },
                            productionStatusGather = {
                                5: {
                                    color: 'blue',
                                    text: i18n.getKey('正在推送'),
                                },
                                4: {
                                    color: 'green',
                                    text: i18n.getKey('生产完成'),
                                },
                                3: {
                                    color: 'orange',
                                    text: i18n.getKey('生产中'),
                                },
                                2: {
                                    color: 'blue',
                                    text: i18n.getKey('已推送'),
                                },
                                1: {
                                    color: 'grey',
                                    text: i18n.getKey('等待推送'),
                                },
                            },
                            paibanInfo = paibanGather[paibanStatus || 1],
                            productionStatusInfo = productionStatusGather[productionStatus || 1],
                            paibanStatusText = JSCreateFont(paibanInfo['color'], true, paibanInfo['text']),
                            productionStatusText = JSCreateFont(productionStatusInfo['color'], true, productionStatusInfo['text']);

                        return {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'fieldcontainer',
                                    layout: 'vbox',
                                    defaults: {
                                        labelWidth: 60
                                    },
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            name: 'paibanStatus',
                                            itemId: 'paibanStatus',
                                            fieldLabel: i18n.getKey('排版状态'),
                                            value: paibanStatusText,
                                        },
                                        {
                                            xtype: 'displayfield',
                                            name: 'productionStatus',
                                            itemId: 'productionStatus',
                                            fieldLabel: i18n.getKey('生产状态'),
                                            value: productionStatusText,
                                        },
                                    ]
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    layout: 'hbox',
                                    defaults: {
                                        labelWidth: 60
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            itemId: 'infoTip',
                                            iconCls: 'icon_help',
                                            margin: '30 0 0 5',
                                            componentCls: "btnOnlyIcon",
                                            tooltip: '推送LEMS的返回状态',
                                        },
                                        {
                                            xtype: 'atag_displayfield',
                                            value: i18n.getKey('详情'),
                                            margin: '12 0 0 7',
                                            tooltip: `查看_订单项排版详情`,
                                            clickHandler: function (value, metaData, record) {
                                                JSOpen({
                                                    id: 'shipmentItemTypeSetting',
                                                    url: path + "partials/orderstatusmodify/ShipmentItemTypeSetting.html" +
                                                        "?configId=" + shipmentRequirementId +
                                                        "&pageType=" + 'shipmentRequirementId',
                                                    title: '订单项排版详情',
                                                    refresh: true
                                                });
                                            },
                                        },
                                    ]
                                }
                            ]
                        }
                    }
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('订单项序号'),
                    width: 150,
                    dataIndex: 'itemSeqNos',
                    sortable: false,
                    getDisplayName: function (value, mateData, record) {
                        var isGreaterFive = value?.length > 5,
                            valueText = value.join(','),
                            showText = isGreaterFive ? `${valueText.substring(0, 9)}...` + JSCreateHyperLink('更多') : value;

                        if (isGreaterFive) {
                            mateData.tdAttr = `data-qtip=跳转至_发货详情(${valueText})`;
                        }
                        return showText;
                    },
                    clickHandler: function (value, mateData, record) {
                        var shippingDetailsId = record.get('id'),
                            orderDeliveryMethod = record.get('orderDeliveryMethod'),
                            manufactureCenter = record.get('finalManufactureCenter'),
                            remark = record.get('remark');

                        JSOpen({
                            id: 'sanction',
                            url: path + "partials/orderstatusmodify/multipleAddress.html?shippingDetailsId=" + shippingDetailsId +
                                '&orderDeliveryMethod=' + orderDeliveryMethod +
                                '&manufactureCenter=' + manufactureCenter +
                                '&remark=' + remark,
                            title: '发货详情',
                            refresh: true
                        });
                    }
                },
                {
                    dataIndex: 'shipmentMethod',
                    text: i18n.getKey('发货方式'),
                    width: 160,
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('走货方式'),
                    dataIndex: 'orderDeliveryMethod',
                    getDisplayName: function (value, metadata, record) {
                        const status = record.get('status')?.id,
                            //已组装(待装箱)状态之前
                            statusGather = {
                                ULGS: '统一配送',
                                SELF_SUPPORT: '自营配送'
                            };

                        return `${statusGather[value || 'SELF_SUPPORT']}`;
                    },
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('税费承担方'),
                    dataIndex: 'dutyType',
                    width: 160,
                    getDisplayName: function (value, metadata, record) {
                        const valueGather = {
                            U: '收件人支付',
                            P: '寄件方支付'
                        };

                        return `${valueGather[value || 'U']}`;
                    },
                },
                {
                    dataIndex: 'id',
                    text: i18n.getKey('delivery') + i18n.getKey('item'),
                    minWidth: 150,
                    flex: 1,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + i18n.getKey('check') + i18n.getKey('delivery') + i18n.getKey('item') + '"';
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#" style="color: blue;" >' + i18n.getKey('check') + '</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                    var ela = Ext.fly(a);
                                    ela.on("click", function () {
                                        Ext.create('CGP.shipmentrequirement.view.CheckDeliveryItemWin', {
                                            recordClazz: record.get('clazz'),
                                            recordId: record.get('id')
                                        }).show();
                                    });
                                }
                            }
                        }
                    }
                },
                {
                    dataIndex: 'finalManufactureCenter',
                    text: i18n.getKey('生产基地'),
                    width: 200,
                    renderer: function (value, metadata, record) {
                        var {text} = controller.getManufactureCenterText(value),
                            result = text + '生产基地';

                        metadata.tdAttr = 'data-qtip="' + result + '"';
                        return result;
                    }
                },
                {
                    dataIndex: 'shipRemark',
                    text: i18n.getKey('发货备注'),
                    width: 200,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return JSAutoWordWrapStr(value);
                    }
                },
                {
                    dataIndex: 'customsClearanceRemark',
                    text: i18n.getKey('清关备注'),
                    width: 200,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return JSAutoWordWrapStr(value);
                    }
                },
            ]
        },
        filterCfg: {
            layout: {
                type: 'table',
                columns: 4,
            },
            items: [
                {
                    name: 'id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    name: 'orderNumber',
                    enforceMaxLength: true,
                    isLike: false,
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('orderNumber'),
                    itemId: 'orderNumber',
                    listeners: {
                        render: function (comp) {
                            var orderNumber = JSGetQueryString('orderNumber');
                            if (orderNumber) {
                                comp.setValue(orderNumber);
                            }
                        }
                    },
                },
                {
                    name: 'items.orderItem._id',
                    enforceMaxLength: true,
                    isLike: false,
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('orderLineItem') + i18n.getKey('id'),
                    itemId: 'oderLineItemId',
                    listeners: {
                        render: function (comp) {
                            var oderLineItemId = JSGetQueryString('oderLineItemId');
                            if (oderLineItemId) {
                                comp.setValue(oderLineItemId);
                            }
                        }
                    },
                },
                {
                    name: 'address.mobile',
                    //isLike: false,
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('telephone'),
                    itemId: 'telephone'
                },
                {
                    fieldLabel: i18n.getKey('是否锁定'),
                    name: 'isLock',
                    //isLike: false,
                    xtype: 'booleancombo',
                    haveReset: true,
                    itemId: 'isLock'
                },
                {
                    xtype: 'textfield',
                    name: 'address.emailAddress',
                    itemId: 'address.emailAddress',
                    enforceMaxLength: true,
                    fieldLabel: i18n.getKey('收件人邮箱'),
                    listeners: {
                        render: function (comp) {
                            var emailAddress = JSGetQueryString('emailAddress');
                            if (emailAddress) {
                                comp.setValue(emailAddress);
                            }
                        }
                    },
                },
                {
                    xtype: 'textfield',
                    name: 'customerProperty',
                    itemId: 'customerProperty',
                    enforceMaxLength: true,
                    fieldLabel: i18n.getKey('收件人信息'),
                },
                {
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('生产基地'),
                    name: 'finalManufactureCenter',
                    itemId: 'finalManufactureCenter',
                    isLike: false,
                    editable: false,
                    haveReset: true,
                    displayField: 'key',
                    valueField: 'value',
                    store: {
                        fields: ['key', 'value'],
                        data: [
                            {
                                'key': '东莞生产基地',
                                'value': "PL0001"
                            },
                            {
                                'key': '越南生产基地',
                                'value': "PL0003"
                            }
                        ]
                    }
                },
                {
                    xtype: 'combo',
                    name: 'paibanStatus',
                    itemId: 'paibanStatus',
                    hidden: true,
                    disabled: true,
                    isLike: false,
                    editable: false,
                    haveReset: true,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['value', 'display'],
                        data: [
                            {
                                value: 4,
                                display: i18n.getKey('排版成功')
                            },
                            {
                                value: 3,
                                display: i18n.getKey('排版失败')
                            },
                            {
                                value: 2,
                                display: i18n.getKey('正在排版')
                            },
                            {
                                value: 1,
                                display: i18n.getKey('等待排版')
                            }
                        ]
                    }),
                    valueField: 'value',
                    displayField: 'display',
                    fieldLabel: i18n.getKey('排版状态'),
                },
                {
                    xtype: 'combo',
                    name: 'manufactureStatus',
                    itemId: 'manufactureStatus',
                    hidden: true,
                    disabled: true,
                    isLike: false,
                    editable: false,
                    haveReset: true,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['value', 'display'],
                        data: [
                            {
                                value: 'PRODUCTION_COMPLETE',
                                display: i18n.getKey('生产完成')
                            },
                            {
                                value: 'PRODUCTION_ING',
                                display: i18n.getKey('生产中')
                            },
                            {
                                value: 'PUSH_COMPLETE',
                                display: i18n.getKey('已推送')
                            },
                            {
                                value: 'WAITING_PUSH',
                                display: i18n.getKey('等待推送')
                            }
                        ]
                    }),
                    valueField: 'value',
                    displayField: 'display',
                    fieldLabel: i18n.getKey('生产状态'),
                },
                {
                    xtype: 'textfield',
                    name: 'itemSeqNos',
                    itemId: 'itemSeqNos',
                    isLike: true,
                    isMultiSelect: true, //是否开启多选查询
                    enforceMaxLength: true,
                    valueType: 'number',
                    tipInfo: '该字段可通过(,)实现多数据查询,例如: 327486849,327486852',
                    fieldLabel: i18n.getKey('订单项序号'),
                },
            ]
        },
    });
});
