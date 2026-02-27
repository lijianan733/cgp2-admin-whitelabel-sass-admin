/**
 * @Description:装箱操作的gridField,
 * readonly时不能修改，不能添加
 * @author nan
 * @date 2022/1/14
 */
Ext.Loader.setPath('Order.status', path + 'js/order/actions/status');
Ext.Loader.syncRequire([
    'Order.status.view.shipment.CustomsProductInfoForm',
    'Order.status.store.ShipmentBox',
    'Order.status.model.ShipmentBox'
])
Ext.define('CGP.orderstatusmodify.view.PackageGridField', {
    extend: 'Ext.ux.form.field.GridFieldExtendContainer',
    alias: 'widget.packagegridfield',
    fieldLabel: i18n.getKey('packageInfo'),
    infoBar: null,
    record: null,
    totalQty: null,//需装箱总数
    notPackageQty: null,//未装箱数量
    readOnly: false,
    initComponent: function () {
        var me = this;
        var dataKey = this.dataKeyName;
        me.data = {};
        /**
         * 报关信息
         * @type {Order.status.store.CustomsOrderLineItem}
         */
        me.customsOrderLineItemStore = Ext.create('Order.status.store.CustomsOrderLineItem', {
            params: {
                id: me.record.getId(),
                pageSize: 50,
                pageNumber: 1
            }
        });
        me.store = Ext.create('Order.status.store.ShipmentBox', {
            data: []
        });
        var infoBar = me.infoBar = Ext.create('Ext.toolbar.Toolbar', {
            defaults: {
                labelAlign: 'right',
            },
            items: [
                {
                    xtype: 'button',
                    itemId: 'addButton',
                    hidden: me.readOnly,
                    text: i18n.getKey('产品混合') + i18n.getKey('装箱'),
                    handler: function (btn) {
                        var boxGrid = btn.ownerCt.ownerCt;
                        var gridStore = boxGrid.getStore();
                        var sortNo = 0;
                        if (gridStore.getCount() != 0) {
                            sortNo = gridStore.getAt(gridStore.getCount() - 1).get('sortNo');
                        }
                        var boxModel = Order.status.model.ShipmentBox.create({
                            sortNo: sortNo + 1,
                            boxQty: 1
                        });
                        var boxQty = boxModel.get('boxQty');
                        gridStore.add(boxModel);
                        console.log(me.store.data);
                        Ext.create('Order.status.view.shipment.AllOrderLineItem', {
                            orderId: me.record.get('id'),
                            record: boxModel,
                            grid: me,
                            boxQty: boxQty,
                            customsOrderLineItemStore: me.customsOrderLineItemStore,
                            operationType: 'editBox',
                            allShipmentData: me.store.data
                        }).show();
                    },
                },
                {
                    xtype: 'button',
                    itemId: 'productBinning',
                    text: i18n.getKey('产品单独装一箱'),
                    handler: function (btn) {
                        var boxGrid = btn.ownerCt.ownerCt;
                        var gridStore = boxGrid.getStore();
                        var sortNo = 0;
                        if (gridStore.getCount() != 0) {
                            sortNo = gridStore.getAt(gridStore.getCount() - 1).get('sortNo');
                        }
                        var boxModel = Order.status.model.ShipmentBox.create({
                            sortNo: sortNo + 1,
                            boxQty: 1
                        });
                        Ext.create('Order.status.view.shipment.AllOrderLineItem', {
                            orderId: me.record.get('id'),
                            record: boxModel,
                            grid: boxGrid,
                            boxQty: 1,
                            operationType: 'productOneCarton',
                            allShipmentData: gridStore.data
                        }).show();
                    },
                },
                '->',
                {
                    xtype: 'displayfield',
                    fieldLabel: i18n.getKey('productQty'),
                    value: 0,
                    itemId: 'productQty',
                    width: 150,
                    renderer: function (v) {
                        return '<font color="red" style="font-weight:bold;font-size:17px">' + v + '</font>'
                    }
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: i18n.getKey('已') + i18n.getKey('packageQty'),
                    value: 0,
                    width: 150,
                    itemId: 'packageQty',
                    renderer: function (v) {
                        return '<font color="red" style="font-weight:bold;font-size:17px">' + v + '</font>'
                    }
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: i18n.getKey('notPackageQty'),
                    value: 0,
                    width: 150,
                    itemId: 'notPackageQty',
                    renderer: function (v) {
                        return '<font color="red" style="font-weight:bold;font-size:17px">' + v + '</font>'
                    }
                },
            ]
        });
        me.gridConfig = {
            store: me.store,
            tbar: infoBar,
            columns: {
                defaults: {
                    sortable: false,
                    menuDisabled: true,
                    tdCls: 'vertical-middle'
                },
                items: [
                    {
                        xtype: 'actioncolumn',
                        menuDisabled: true,
                        sortable: false,
                        width: 50,
                        hidden: me.readOnly,
                        items: [
                            {
                                iconCls: 'icon_edit icon_margin',
                                itemId: 'actionedit',
                                tooltip: i18n.getKey('edit'),
                                handler: function (view, rowIndex, colIndex, item, e, record) {
                                    var sortNo = record.get('sortNo');
                                    var boxQty = Ext.getCmp('boxQty' + sortNo).getValue();
                                    console.log(me.store.data);
                                    Ext.create('Order.status.view.shipment.AllOrderLineItem', {
                                        orderId: me.record.get('id'),
                                        record: record,
                                        grid: me,
                                        boxQty: boxQty,
                                        customsOrderLineItemStore: me.customsOrderLineItemStore,
                                        operationType: 'editBox',
                                        allShipmentData: me.store.data
                                    }).show();
                                }
                            },
                            {
                                iconCls: 'icon_remove icon_margin',
                                itemId: 'actiondelete',
                                tooltip: i18n.getKey('destroy'),
                                handler: function (view, rowIndex, colIndex, item, e, record) {
                                    var store = me.getStore();
                                    store.remove(record);
                                },
                                isDisabled: function (view, rowIndex, colIndex, item, record) {
                                    return !Ext.isEmpty(record.get('storageId'));
                                }
                            }
                        ]
                    },
                    {
                        autoSizeColumn: false,
                        dataIndex: 'sortNo',
                        text: '',
                        itemId: 'rownumberer',
                        width: 20,
                    },
                    {
                        text: i18n.getKey('boxSize') + '(CM)',
                        xtype: 'componentcolumn',
                        width: 180,
                        renderer: function (v, m, r) {
                            return {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                fieldDefaults: {
                                    readOnly: me.readOnly,
                                    labelSeparator: ''
                                },
                                items: [
                                    {
                                        xtype: 'numberfield',
                                        name: 'boxLength',
                                        hideTrigger: true,
                                        value: r.get('boxLength'),
                                        flex: 1,
                                        checkChangeBuffer: 1000,
                                        minValue: 1,
                                        allowDecimals: false,
                                        allowExponential: false,//这个有bug只有该配置为false才能生效
                                        listeners: {
                                            blur: function (me) {
                                                r.set('boxLength', me.getValue());
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'displayfield',
                                        value: 'X',
                                        width: 15
                                    },
                                    {
                                        xtype: 'numberfield',
                                        minValue: 1,
                                        allowDecimals: false,
                                        allowExponential: false,//这个有bug只有该配置为false才能生效
                                        name: 'boxWidth',
                                        hideTrigger: true,
                                        value: r.get('boxWidth'),
                                        flex: 1,
                                        listeners: {
                                            blur: function (me) {
                                                r.set('boxWidth', me.getValue());
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'displayfield',
                                        value: 'X',
                                        width: 15
                                    },
                                    {
                                        xtype: 'numberfield',
                                        minValue: 1,
                                        allowDecimals: false,
                                        allowExponential: false,//这个有bug只有该配置为false才能生效
                                        name: 'boxHeight',
                                        hideTrigger: true,
                                        value: r.get('boxHeight'),
                                        flex: 1,
                                        listeners: {
                                            blur: function (me) {
                                                r.set('boxHeight', me.getValue());
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    {
                        dataIndex: 'boxQty',
                        xtype: 'componentcolumn',
                        text: i18n.getKey('boxQty'),
                        width: 70,
                        renderer: function (v, m, r) {
                            var sortNo = r.get('sortNo');
                            return {
                                name: 'boxQty',
                                xtype: 'numberfield',
                                //allowExponential: false,
                                id: 'boxQty' + sortNo,
                                checkChangeBuffer: 1000,
                                minValue: 1,
                                readOnly: me.readOnly,
                                allowDecimals: false,
                                allowExponential: false,//这个有bug只有该配置为false才能生效
                                allowBlank: false,
                                value: v,
                                record: r,
                                boxQtyChangeOverCount: function (value, field) {
                                    var customsOrderLineItemStore = field.customsOrderLineItemStore;
                                    var record = field.record;
                                    var isValid = true;
                                    var maxBoxCount = 1;
                                    var localBoxStore = record.store;
                                    var recordIndex = localBoxStore.indexOf(record);
                                    var neetValidProductIds = {};//这个选项中包含的产品，每个产品对应一个单独的orderItemId，不要问为啥是这个名称，我也不知道
                                    for (var i = 0; i < record.get('boxProductItems').length; i++) {
                                        var orderItemId = record.get('boxProductItems')[i].orderItemId;
                                        neetValidProductIds[orderItemId] = {
                                            totalCount: 0,//该需装箱产品总数，
                                            packCount: 0,//已装箱产品数量,
                                            qty: record.get('boxProductItems')[i].qty,//数量/箱
                                            changedPackCount: value * record.get('boxProductItems')[i].qty//当前改变后的装箱数量
                                        };
                                        for (var j = 0; j < customsOrderLineItemStore.data.items.length; j++) {
                                            var item = customsOrderLineItemStore.data.items[j]
                                            if (orderItemId == item.get('orderLineItemId')) {
                                                neetValidProductIds[orderItemId].totalCount = item.get('qty');
                                            }
                                        }
                                    }
                                    for (var i = 0; i < localBoxStore.data.items.length; i++) {
                                        var item = localBoxStore.data.items[i];
                                        if (recordIndex != i) {//其他记录
                                            for (var j = 0; j < item.get('boxProductItems').length; j++) {
                                                var data = item.get('boxProductItems')[j];
                                                if (neetValidProductIds[data.orderItemId]) {//该记录有这产品
                                                    neetValidProductIds[data.orderItemId].packCount += item.get('boxQty') * data.qty;
                                                }
                                            }
                                        }
                                    }
                                    for (var i in neetValidProductIds) {
                                        if (neetValidProductIds[i].totalCount < neetValidProductIds[i].packCount + neetValidProductIds[i].changedPackCount) {
                                            isValid = false;
                                        }
                                    }
                                    if (isValid == false) {
                                        field.setValue(maxBoxCount);
                                    }
                                    return isValid;
                                },
                                customsOrderLineItemStore: me.customsOrderLineItemStore,
                                listeners: {
                                    change: function (field, newValue, oldValue) {
                                        var isValid = field.boxQtyChangeOverCount(newValue, field);
                                        if (isValid == false) {
                                            return;
                                        }
                                        var boxProductItems = r.get('boxProductItems');
                                        var totalWeight = 0;
                                        var productQty = 0;
                                        for (var i = 0; i < boxProductItems.length; i++) {
                                            if (boxProductItems[i].weight) {

                                            } else {
                                                boxProductItems[i]['weight'] = boxProductItems[i].netWeight / boxProductItems[i].qty;
                                            }
                                            var item = boxProductItems[i];
                                            item.netWeight = item.qty * item.weight;
                                            totalWeight += item.netWeight * newValue;
                                            productQty += newValue * item.qty;
                                        }
                                        r.set('boxQty', newValue);
                                        r.set('totalWeight', totalWeight);
                                        r.set('productQty', productQty);
                                        r.commit();
                                    }
                                }
                            }
                        }
                    },
                    {
                        text: '<div style="display: inline-block; width: 150px;text-align: center">' + i18n.getKey('tradeName') + '</div>' +
                            '<div style="display: inline-block;width: 80px">' + i18n.getKey('qty') + '/' + i18n.getKey('boxful') + '</div>' +
                            '<div style="display: inline-block;width: 80px">' + i18n.getKey('totalNetWeight') + '(G)</div>',
                        dataIndex: 'boxProductItems',
                        xtype: 'componentcolumn',
                        width: 350,
                        tdCls: 'vertical-middle',
                        sortable: false,
                        renderer: function (value, metadata, record) {
                            var customsProductInfos = Ext.create('Order.status.view.shipment.CustomsProductInfoForm', {
                                defaults: {
                                    checkChangeBuffer: 150,
                                    readOnly: me.readOnly,
                                },
                                record: record,
                                shipmentBoxGrid: me,
                                customsProductInfo: value
                            });
                            if (Ext.isEmpty(value)) {
                                return '';
                            } else {
                                return customsProductInfos;
                            }
                        }
                    },
                    {
                        dataIndex: 'totalWeight',
                        xtype: 'componentcolumn',
                        tdCls: 'vertical-middle',
                        flex: 1,
                        text: i18n.getKey('totalGrossWeight') + '(G)',
                        renderer: function (value, m, r) {
                            return {
                                name: 'totalWeight',
                                xtype: 'numberfield',
                                allowExponential: false,
                                allowBlank: false,
                                width: 45,
                                value: value,
                                readOnly: me.readOnly,
                                hideTrigger: true,
                                listeners: {
                                    blur: function (me) {
                                        r.set('totalWeight', me.getValue());
                                    }
                                }
                            }
                        }
                    }
                ]
            },
            /**
             * 获取装箱数量
             * @returns {number}
             */
            getPackageQty: Ext.emptyFn
        };
        me.callParent();
        var fun = function (store) {
            me.updatePackageInfo(me.getPackageQty());
        };
        me.store.on('update', fun);
        me.store.on('remove', fun);
        me.store.on('add', fun);
        me.store.on('datachanged', fun);
        //初始化装箱信息
        me.updatePackageInfo(me.getPackageQty());
    },
    /**
     * 更新装箱统计信息
     */
    updatePackageInfo: function (packageQty) {
        var me = this;
        var record = me.record;
        me.totalQty = record.get('needPackingQty');
        me.notPackageQty = record.get('needPackingQty') - packageQty;
        var productQty = me.infoBar.getComponent('productQty');
        var packageQtyField = me.infoBar.getComponent('packageQty');
        var notPackageQtyField = me.infoBar.getComponent('notPackageQty');
        productQty.setValue(me.totalQty);
        packageQtyField.setValue(packageQty);
        notPackageQtyField.setValue(me.notPackageQty);
    },
    /**
     *
     * @returns {*[]}
     */
    getValue: function () {
        var me = this;
        var data = [];
        me.store.data.items.forEach(function (item) {
            var itemData = item.data;
            itemData.productWeight = 0;
            Ext.Array.each(itemData.boxProductItems, function (boxProductItem) {
                itemData.productWeight += itemData.boxQty * boxProductItem.netWeight;
            })
            data.push(itemData);
        });
        return data;
    },
    isValid: function () {
        var me = this;
        if (me.notPackageQty != 0) {
            me.setActiveError('所有产品必须完成装箱');
            me.renderActiveError();
            return false;
        } else {
            me.clearError();
            return true;
        }
    },
    getErrors: function () {
        return '所有产品必须完成装箱';
    },
    getPackageQty: function () {
        var me = this,
            i = 0;
        var packageQty = 0;
        var items = me.store.data.items;
        Ext.Array.each(items, function (item) {
            packageQty += item.get('productQty');
        });
        return packageQty;
    },
    //根据需要装箱产品的数量来判断是否需要填写快递信息,全外派的订单就没需要装箱产品
    setVisible: function () {
        var me = this;
        if (me.record.get('needPackingQty') == 0) {
            me.hide();
        } else {
            me.callParent(arguments)
        }
    }
})
