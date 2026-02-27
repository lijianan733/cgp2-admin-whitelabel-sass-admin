Ext.define("CGP.shipmentrequirement.view.DeliveryItemGridV2", {
        extend: 'CGP.common.commoncomp.QueryGrid',
        alias: 'widget.delivery_item_grid_v2',
        isValid: function () {
            return this.store.getCount() > 0
        },
        rawData: null,//初始的store数据源
        getValue: function () {
            var me = this;
            var dataArray = [];
            me.store.data.items.forEach(function (item) {
                var data = {};
                data.orderItem = {};
                data.orderItem._id = item.data.orderItem.id || item.data.orderItem._id
                data.orderItem.clazz = 'com.qpp.cgp.domain.order.OrderLineItem';
                data.qty = item.data.qty;
                data.maxValue = item.data.maxValue;
                data.clazz = 'com.qpp.cgp.domain.shipment.ShipmentRequirementItem';
                dataArray.push(data);
            });
            return dataArray;
        },
        diyIsValid: function (dataArray) {
            var isValid = true,
                params = {};
            dataArray.forEach((item, index) => {
                const {maxValue, qty, orderItem} = item;
                if (maxValue < qty) {

                    isValid = false;
                    params['maxValue'] = maxValue;
                    params['index'] = index + 1;
                }
            });
            if (!isValid) {
                Ext.Msg.alert('提示', `发货项第${params['index']}项的最大数量为${params['maxValue']}，请重新填写数量`);
            }
            return isValid;
        },
        setValue: function (data) {
            var me = this;
            me.suspendLayouts();
            var store = me.store;
            // 设置最大值
            data.forEach(item => {
                item.maxValue = item.orderItem.qty;
            });
            //排序
            data = data.sort(function name(one, two) {
                return one.orderItem.seqNo - two.orderItem.seqNo;
            });
            me.rawData = data;
            store.proxy.data = Ext.clone(data);
            store.load();
            me.resumeLayouts();
        },
        initComponent: function () {
            var me = this;
            var store = me.store = Ext.create('Ext.data.Store', {
                pageSize: 50,
                "fields": [
                    {"name": 'orderItem', "type": 'object'},
                    {"name": 'orderBaseDTO', "type": 'object'},
                    {
                        "name": 'qty',
                        "type": 'int'
                    },
                    {
                        "name": 'maxValue',
                        "type": 'int'
                    }
                ],
                "proxy": 'pagingmemory',
                "data": [],
            });
            me.filterCfg = {
                header: false,
                searchActionHandler: function () { //重写搜索按钮方法
                    var me = this,
                        form = me.ownerCt.ownerCt,
                        searchContainer = form.ownerCt,
                        store = searchContainer.grid.store,
                        filterData = form.getQuery();
                    var storeData = Ext.clone(searchContainer.rawData);
                    searchContainer.mask(true);
                    setTimeout(function () {
                        if (filterData.length) {
                            store.proxy.data = JSGetFilteredValues(filterData, storeData);
                        } else {
                            store.proxy.data = storeData;
                        }
                        store.load();
                        searchContainer.unmask();
                    }, 250);
                },
                items: [
                    {
                        xtype: 'textfield',
                        name: 'orderItem._id',
                        isLike: true,
                        fieldLabel: i18n.getKey('orderLineItem') + i18n.getKey('id'),
                        itemId: 'oderLineItemId',
                    },
                    {
                        xtype: 'textfield',
                        name: 'orderBaseDTO.orderNumber',
                        isLike: true,
                        fieldLabel: '订单号',
                        itemId: 'orderId',

                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '产品名称',
                        itemId: 'productName',
                        name: 'orderItem.productName',
                        isLike: true,
                    }
                ]
            };
            me.gridCfg = {
                store: store,
                editAction: false,
                deleteAction: false,
                /*      tbar: {
                          xtype: 'toolbar',
                          hidden: me.hideItemBar,
                          disabled: me.readOnly,
                          items: [
                              {
                                  xtype: 'button',
                                  itemId: 'button',
                                  iconCls: 'icon_add',
                                  text: i18n.getKey('add'),
                                  handler: function () {
                                      Ext.create('CGP.shipmentrequirement.view.OrderLineItemWin', {
                                          deliveryItemGrid: me
                                      }).show();
                                  }
                              }]
                      },*/
                columns: [
                    {
                        xtype: 'actioncolumn',
                        width: 30,
                        items: [
                            {
                                iconCls: 'icon_remove icon_margin',
                                itemId: 'actionremove',
                                tooltip: 'Remove',
                                isDisabled: function () {
                                    return me.readOnly;
                                },
                                handler: function (view, rowIndex, colIndex, a, b, record) {
                                    var store = view.getStore();
                                    var rawData = view.ownerCt.ownerCt.rawData;
                                    Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('确定删除？'), function (select) {
                                        var orderLineItemId = record.get('orderItem')._id;
                                        if (select == 'yes') {
                                            for (var i = 0; i < rawData.length; i++) {
                                                var item = rawData[i];
                                                if (item.orderItem._id == orderLineItemId) {
                                                    rawData.splice(i, 1);
                                                    break;
                                                }
                                            }
                                            store.proxy.data = rawData;
                                            store.load();
                                        }
                                    });
                                }
                            }]
                    },
                    {
                        dataIndex: 'orderItem',
                        width: 120,
                        text: i18n.getKey('orderLineItem'),
                        renderer: function (value) {
                            return value._id;
                        }
                    },
                    {
                        dataIndex: 'orderItem',
                        width: 120,
                        text: i18n.getKey('orderNumber'),
                        renderer: function (value, metadata, record) {
                            const orderBaseDTO = record.get('orderBaseDTO');
                            return value?.orderNumber || orderBaseDTO?.orderNumber;
                        }
                    },
                    {
                        dataIndex: 'orderItem',
                        width: 100,
                        text: i18n.getKey('orderLineItem') + i18n.getKey('seqNo'),
                        renderer: function (value, metadata, record) {
                            return value.seqNo;
                        }
                    },
                    {
                        sortable: false,
                        text: i18n.getKey('operation'),
                        width: 100,
                        xtype: 'componentcolumn',
                        renderer: function (value, metadata, record, row, col, store) {
                            var orderItem = record.get('orderItem'),
                                orderBaseDTO = record.get('orderBaseDTO');
                            return {
                                text: i18n.getKey('options'),
                                width: '100%',
                                xtype: 'button',
                                ui: 'default-toolbar-small',
                                flex: 1,
                                menu: [
                                    {
                                        text: i18n.getKey('check') + i18n.getKey('相关') + i18n.getKey('order'),
                                        disabledCls: 'menu-item-display-none',
                                        handler: function () {
                                            JSOpen({
                                                id: 'page',
                                                url: path + 'partials/order/order.html?orderNumber=' + orderBaseDTO.orderNumber,
                                                title: '订单 所有订单',
                                                refresh: true
                                            });
                                        }
                                    },
                                    {
                                        text: i18n.getKey('check') + i18n.getKey('相关') + i18n.getKey('orderItem'),
                                        disabledCls: 'menu-item-display-none',
                                        handler: function () {
                                            JSOpen({
                                                id: 'orderlineitempage',
                                                url: path + 'partials/orderlineitem/orderlineitem.html' +
                                                    '?id=' + orderItem._id +
                                                    '&isTest2=' + record.get('isTest'),
                                                title: '订单项管理 所有状态',
                                                refresh: true
                                            });
                                        }
                                    },
                                ]
                            }
                        }
                    },
                    {
                        xtype: 'auto_bread_word_column',
                        dataIndex: 'orderItem',
                        flex: 1,
                        text: i18n.getKey('product') + i18n.getKey('name'),
                        renderer: function (value) {
                            return value.productName;
                        }
                    },
                    {
                        dataIndex: 'qty',
                        menuDisabled: true,
                        xtype: 'componentcolumn',
                        tdCls: 'columns_td_vcenter',
                        itemId: me.itemId + 'qty',
                        text: i18n.getKey('qty'),
                        width: 100,
                        renderer: function (v, m, r, rowIndex) {
                            var maxValue = r.get('maxValue');
                            return {
                                name: 'qty',
                                xtype: 'numberfield',
                                id: 'qty' + rowIndex + me.itemId,
                                minValue: 1,
                                allowDecimals: false,
                                readOnly: me.readOnly,
                                allowBlank: false,
                                value: v,
                                record: r,
                                maxValue: maxValue,
                                listeners: {
                                    blur: function (field) {
                                        r.set('qty', field.getValue());
                                        field.isValid()
                                    },
                                }
                            }
                        }
                    }
                ],
            };
            me.callParent();
        }
    }
);
