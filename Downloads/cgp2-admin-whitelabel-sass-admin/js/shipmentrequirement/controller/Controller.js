Ext.define('CGP.shipmentrequirement.controller.Controller', {
    //编辑地址window的save方法
    saveAddress: function (editWindow, userrecord, store, record) {
        var me = this;
        var form = editWindow.form;
        if (form.form.isValid()) {
            var data = {};
            Ext.each(form.items.items, function (item) {
                var name = item.name.split('.').pop();
                data[name] = item.getValue();
            });
            data.userId = userrecord.getId();
            var currentMode = form.getCurrentMode();
            if (currentMode == 'creating') {
                Ext.Ajax.request({
                    url: adminPath + 'api/addressBooks',
                    method: 'POST',
                    jsonData: data,
                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                    success: function (response) {
                        var responseMessage = Ext.JSON.decode(response.responseText);
                        if (responseMessage.success) {
                            var addressBookId = responseMessage.data.id;
                            if (store.getCount() == 0) {
                                Ext.getCmp('AddressBooksGrid').defaultAddress = addressBookId;
                                me.setDefaultAddress(addressBookId, userrecord);
                                editWindow.close();
                                store.load();
                            } else {
                                editWindow.close();
                                store.load();
                            }
                        } else {
                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                        }
                    },
                    failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                })

            } else if (currentMode == 'editing') {
                var addressBookId = record.getId();
                data.id = addressBookId;
                Ext.Ajax.request({
                    url: adminPath + 'api/addressBooks/' + addressBookId,
                    method: 'PUT',
                    jsonData: data,
                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                    success: function (response) {
                        var responseMessage = Ext.JSON.decode(response.responseText);
                        if (responseMessage.success) {
                            editWindow.close();
                            store.load();
                        } else {
                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                        }
                    },
                    failure: function (resp) {
                        var responseMessage = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                })
            }

        }
    },
    saveRecord: function (data, configModelId, editOrNew, panel) {
        var me = this;
        data.clazz = 'com.qpp.cgp.domain.shipment.ShipmentRequirement';
        var httpMethod = 'POST';
        var url = adminPath + 'api/shipmentRequirements'
        if (editOrNew == 'edit') {
            data.id = configModelId;
            httpMethod = 'PUT';
            url += '/' + configModelId;
        }
        JSAjaxRequest(url, httpMethod, true, data, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    var configModelId = responseText.data.id;
                    panel.editOrNew = 'edit';
                    panel.configModelId = configModelId;
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'));
                }
            }
        }, true);
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

    asyncEditQuery: function (url, jsonData, isEdit, callFn, Msg, attributeVersionId) {
        var method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess',
            newMsg = Msg || successMsg;

        JSAjaxRequest(url, method, true, jsonData, newMsg, callFn, true, attributeVersionId);
    },

    //获取url
    getUrl: function (author) {
        var urlGather = {
            mainUrl: adminPath + 'api/colors',

        }
        return urlGather[author];
    },

    createPaymentSubtotalItemWindow: function (items, shipmentRequirementId) {
        var controller = this;
        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('创建拆单项'),
            width: 1000,
            height: 450,
            items: [
                {
                    xtype: 'gridfieldwithcrudv2',
                    itemId: 'grid',
                    actionEditHidden: true,
                    gridConfig: {
                        tbar: {
                            hiddenButtons: ['read', 'clear', 'config', 'help', 'export', 'import'],
                            btnCreate: {
                                handler: function (btn) {
                                    var grid = btn.ownerCt.ownerCt,
                                        storeData = grid.store.proxy.data,
                                        filterData = storeData.map(item => item['paymentSubtotalItem']);

                                    controller.createOrderItemWindow(items, shipmentRequirementId, filterData, function (data) {
                                        console.log(data);
                                        grid.store.proxy.data.push(data);
                                        grid.store.load();
                                    });
                                }
                            },
                            btnDelete: {
                                text: JSCreateFont('red', true, '剩余订单项将自动集合为一个拆单项'),
                                componentCls: "btnOnlyIcon",
                                width: 250,
                                iconCls: false,
                                handler: function (btn) {
                                }
                            },
                        },
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                {
                                    name: 'id',
                                    type: 'string'
                                },
                                {
                                    name: 'description',
                                    type: 'string'
                                },
                                {
                                    name: 'paymentSubtotalItem',
                                    type: 'array'
                                },
                            ],
                            proxy: 'memory',
                            data: []
                        }),
                        columns: [
                            {
                                xtype: 'rownumberer',
                                tdCls: 'vertical-middle',
                                align: 'center',
                                width: 60
                            },
                            {
                                flex: 1,
                                dataIndex: 'paymentSubtotalItem',
                                text: i18n.getKey('拆单项'),
                                align: 'center',
                                renderer: function (value, metaData, record, rowIndex, colIndex) {
                                    var result = '';

                                    value?.forEach(item => {
                                        var {itemId, qty} = item;
                                        result += `订单项编号: ${itemId}, 数量: ${qty};<br>`
                                    })

                                    return result;
                                }
                            },
                        ]
                    }
                }
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            grid = win.getComponent('grid'),
                            storeData = grid._grid.store.proxy.data,
                            url = adminPath + `api/shipmentOrders/split/v2?shipmentRequirementId=${shipmentRequirementId}`,
                            result = storeData.map(item => item['paymentSubtotalItem']);


                        if (storeData.length) {
                            console.log(result);
                            controller.asyncEditQuery(url, result, false, function (require, success, response) {
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    if (responseText.success) {
                                        win.close();
                                    }
                                }
                            }, '拆单成功!');
                        } else {
                            Ext.Msg.alert('提示', '请创建拆单项!')
                        }
                    }
                }
            },
        }).show();
    },

    createOrderItemWindow: function (items, shipmentRequirementId, filterData, callBack) {
        var controller = this;
        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('选择拆单项'),
            width: 1000,
            height: 450,
            items: [
                {
                    xtype: 'grid',
                    itemId: 'grid',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {
                                name: 'orderItem',
                                type: 'object'
                            },
                            {
                                name: 'orderBaseDTO',
                                type: 'object'
                            },
                            {
                                name: 'qty',
                                type: 'int'
                            },
                            {
                                name: 'maxValue',
                                type: 'int'
                            },
                            {
                                name: 'seqNo',
                                type: 'int',
                                convert: function (value, record) {
                                    var orderItem = record.get('orderItem');
                                    return orderItem['seqNo'];
                                }
                            },
                            {
                                name: 'orderItemId',
                                type: 'string',
                                convert: function (value, record) {
                                    var orderItem = record.get('orderItem');
                                    return orderItem['_id'];
                                }
                            }
                        ],
                        sorters: [{   //应用于当前Store的排序器集合
                            property: 'seqNo',
                            direction: 'ASC'
                        }],
                        pageSize: 10000,
                        proxy: 'pagingmemory',
                        pageSize: 10000,
                        data: controller.getFilterSelectDataQty(items, filterData)
                    }),
                    viewConfig: {
                        enableTextSelection: true,//设置grid中的文本可以选择
                        stripeRows: true//列用颜色区分
                    },
                    selModel: Ext.create("Ext.selection.CheckboxModel", {
                        injectCheckbox: 0,//checkbox位于哪一列，默认值为0
                        mode: "simple",//multi,simple,single；默认为多选multi
                        checkOnly: false,//如果值为true，则只用点击checkbox列才能选中此条记录
                    }),
                    columns: [
                        {
                            dataIndex: 'orderItem',
                            menuDisabled: true,
                            width: 160,
                            tdCls: 'vertical-middle',
                            text: i18n.getKey('orderLineItem'),
                            renderer: function (value) {
                                return value._id;
                            }
                        },
                        {
                            xtype: 'atagcolumn',
                            dataIndex: 'orderItem',
                            text: i18n.getKey("orderNumber"),
                            width: 120,
                            getDisplayName: function (value, metaData, record) {
                                const orderBaseDTO = record.get('orderBaseDTO');
                                return JSCreateHyperLink(value?.orderNumber || orderBaseDTO?.orderNumber);
                            },
                            clickHandler: function (value, metaData, record) {
                                const orderBaseDTO = record.get('orderBaseDTO'),
                                    orderNumber = value?.orderNumber || orderBaseDTO?.orderNumber;
                                JSOpen({
                                    id: 'page',
                                    url: path + 'partials/order/order.html?orderNumber=' + orderNumber,
                                    title: '订单 所有订单',
                                    refresh: true
                                });
                            }
                        },
                        {
                            dataIndex: 'seqNo',
                            menuDisabled: true,
                            width: 160,
                            tdCls: 'vertical-middle',
                            text: i18n.getKey('orderLineItem') + i18n.getKey('seqNo'),
                        },
                        {
                            dataIndex: 'orderItem',
                            menuDisabled: true,
                            width: 320,
                            tdCls: 'vertical-middle',
                            text: i18n.getKey('product') + i18n.getKey('name'),
                            renderer: function (value) {
                                return value.productName;
                            }
                        },
                        {
                            xtype: 'componentcolumn',
                            text: i18n.getKey('qty'),
                            dataIndex: 'qty',
                            flex: 1,
                            renderer: function (value, metadata, record, rowIndex, colIndex, store, view) {
                                var currentRecord = store.getAt(rowIndex);

                                return {
                                    xtype: 'numberfield',
                                    itemId: 'qty',
                                    name: 'qty',
                                    minValue: 1,
                                    maxValue: value,
                                    value: value,
                                    allowBlank: false,
                                    listeners: {
                                        change: function (comp, newValue) {
                                            store.proxy.data.forEach((item, index) => {
                                                var {orderItem} = item;
                                                if (orderItem['seqNo'] === currentRecord.get('seqNo')) {
                                                    item['qty'] = newValue;
                                                }
                                            })
                                        }
                                    }
                                };
                            }
                        },
                    ]
                }
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    getSelectResult: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            grid = win.getComponent('grid'),
                            selectRecord = grid.getSelectionModel().getSelection(),
                            storeData = grid.store.proxy.data,
                            selectedIds = selectRecord.map(item => {
                                return item.get('orderItem')['_id'];
                            }),
                            // 被选中的id
                            selectedData = [],
                            // 未选中的id
                            unselectedData = [];

                        storeData.forEach((item, index) => {
                            var itemId = item['orderItem']['_id'],
                                qty = item['qty'],
                                result = {
                                    itemId: +itemId,
                                    qty: +qty
                                }

                            if (selectedIds.includes(itemId)) {
                                selectedData.push(result);
                            } else {
                                unselectedData.push(result);
                            }
                        });

                        var result = [];
                        if (selectedData.length) {
                            result.push(selectedData);
                        }
                        if (unselectedData.length) {
                            result.push(unselectedData);
                        }
                        return {
                            id: JSGetUUID(),
                            paymentSubtotalItem: selectedData
                        };
                    },
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            grid = win.getComponent('grid'),
                            isValid = true,
                            numberfield = grid.query('numberfield'),
                            result = btn.getSelectResult(btn),
                            isNoEmpty = result['paymentSubtotalItem'].length

                        numberfield.forEach(item => {
                            !item.isValid() && (isValid = item.isValid());
                        })

                        if (isValid && isNoEmpty) {
                            win.close();
                            callBack && callBack(result);
                        } else {
                            !isValid && Ext.Msg.alert('提示', '请输入合法值!');
                            !isNoEmpty && Ext.Msg.alert('提示', '请选择拆单项!');
                        }
                    }
                }
            },
        }).show();
    },

    getFilteredValues: function (filters, data) {
        var result = new Set(); // 使用 Set 来存储唯一值

        data.forEach(item => {
            filters.forEach(filterItem => {
                var {name, value, type, operator} = filterItem,
                    isExactMatch = operator === 'exactMatch',
                    keys = name.split('.'), // 处理嵌套字段
                    itemValue = keys.reduce((acc, key) => acc && acc[key], item), // 获取嵌套值
                    isType = (typeof itemValue) === type;

                // 根据是否开启精确匹配或模糊匹配来判断
                var isValue;
                if (isExactMatch) {
                    isValue = itemValue === value; // 精确匹配
                } else {
                    isValue = typeof itemValue === 'string' && itemValue.includes(value); // 模糊匹配
                }

                if (isValue && isType) {
                    result.add(JSON.stringify(item)); // 使用 JSON.stringify 保证对象唯一性
                }
            });
        });

        // 将 Set 转换回数组并解析 JSON 字符串
        return Array.from(result).map(item => JSON.parse(item));
    },

    getFilterSelectDataQty: function (storeData, filterData) {
        var controller = this,
            result = Ext.clone(storeData);

        if (filterData) {
            /*  var filterArray = [];
              filterData.forEach(item => {
                  item.forEach(item => {
                      filterArray.push(item)
                  })
              });*/
            // 简化
            var filterArray = filterData.flatMap(item => item);

            filterArray.forEach(item => {
                var {itemId, qty} = item;
                result.forEach(dataItem => {
                    var {orderItem} = dataItem,
                        {_id} = orderItem;
                    if (+_id === +itemId) {
                        dataItem['qty'] -= qty;
                    }
                })
            })
        }

        return result.filter(item => item['qty']); //过滤掉数量为0的项
    },

    getManufactureCenterText: function (code) {
        var result = {
                text: '',
                color: '',
                btnBackgroundColor: []
            },
            newCode = code || 'PL0001';
        if (newCode) {
            var manufactureCenterGather = {
                PL0003: {
                    text: '越南',
                    color: 'green',
                    btnBackgroundColor: ['#4caf50', '#43a047', '#388e3c', '#43a047'],
                },
                PL0002: {
                    text: '美国',
                    color: 'orange',
                    btnBackgroundColor: ['#4b9cd7', '#3892d3', '#358ac8', '#3892d3'],
                },
                PL0001: {
                    text: '东莞',
                    color: '#358ac8',
                    btnBackgroundColor: ['#4b9cd7', '#3892d3', '#358ac8', '#3892d3'],
                }
            }

            result = manufactureCenterGather[newCode];
        }
        return result;
    },
});