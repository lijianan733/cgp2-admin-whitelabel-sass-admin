Ext.define('CGP.deliveryorder.view.shipment.CustomsProductInfoForm', {
    extend: 'Ext.form.FieldContainer',
    layout: 'column',
    columns: 3,
    //border: false,
    width: 320,
    minHeight: 24,
    //bodyStyle: 'border:none',
    record: null,
    customsProductInfo: null,
    shipmentBoxGrid: null,
    /**
     * 获取到未装箱的数量
     * @param record
     * @returns {*}
     */
    addCls: function () {

    },
    readOnly: false,
    qtyChangeOverCount: function (field, value, oldValue) {//数量/箱，改变时的数量校验
        var customsOrderLineItemStore = field.shipmentBoxGrid.customsOrderLineItemStore;
        var record = field.record;
        var isValid = true;
        var localBoxStore = record.store;
        var recordIndex = localBoxStore.indexOf(record);
        var itemIndex = field.index;
        var noPackCount = 0;
        var shipmentBoxGrid = field.shipmentBoxGrid;
        var boxQty = record.get('boxQty');
        var neetValidProductIds = {};//这个选项中包含的产品，每个产品对应一个单独的orderItemId，不要问为啥是这个名称，我也不知道
        for (var i = 0; i < record.get('productItems').length; i++) {
            var orderItemId = record.get('productItems')[i].orderItemId;
            if (i == itemIndex) {
                neetValidProductIds[orderItemId] = {
                    totalCount: 0,//该需装箱产品总数，
                    packCount: 0,//已装箱产品数量,
                    changedPackCount: boxQty * value//当前改变后的装箱数量
                };
            } else {
                neetValidProductIds[orderItemId] = {
                    totalCount: 0,//该需装箱产品总数，
                    packCount: 0,//已装箱产品数量,
                    changedPackCount: boxQty * record.get('productItems')[i].qty//当前改变后的装箱数量
                };
            }
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
                for (var j = 0; j < item.get('productItems').length; j++) {
                    var data = item.get('productItems')[j];
                    if (neetValidProductIds[data.orderItemId]) {//该记录有这产品
                        neetValidProductIds[data.orderItemId].packCount += item.get('boxQty') * data.qty;
                    }
                }
            }
        }
        for (var i in neetValidProductIds) {
            if (neetValidProductIds[i].totalCount < neetValidProductIds[i].packCount + neetValidProductIds[i].changedPackCount) {
                isValid = false;
                noPackCount = Math.floor((neetValidProductIds[i].totalCount - neetValidProductIds[i].packCount) / boxQty);

            }
        }
        if (isValid == false) {

            /*       field.setValue(noPackCount);

                        shipmentBoxGrid.fireEvent('productqtychange', shipmentBoxGrid, shipmentBoxGrid.getPackageQty());
            */
        }
        return isValid;

    },
    initComponent: function () {
        var me = this;

        var record = me.record;
        var itemId = record.get('id');

        var boxDetails = record.get('productItems');
        var detailItems = [];
        var index = 0;
        me.boxQty = record.get('boxQty');
        Ext.Array.each(boxDetails, function (item) {
            var boxDetailProduct = {
                xtype: 'textfield',
                //fieldStyle: 'background-color: silver',
                name: item.outName,
                readOnly: true,
                value: !Ext.isEmpty(item.outName) ? item.outName : item.productName,
                width: 130,
                fieldLabel: false
            };
            var boxDetailQty = {
                name: 'qty',
                xtype: 'numberfield',
                width: 60,
                //allowExponential: false,
                minValue: 1,
                allowDecimals: false,
                allowBlank: false,
                record: me.record,
                readOnly: me.readOnly,
                //fieldStyle: 'background-color:silver',
                margin: '0 0 0 10',
                value: item.qty,
                index: index,
                shipmentBoxGrid: me.shipmentBoxGrid,
                hideTrigger: false,
                fieldLabel: false,
                addCls: function (cls) {
                    var me = this,
                        el = me.rendered ? me.el : me.protoEl;
                    if (el) {
                        el.addCls.apply(el, arguments);
                        return me;
                    }
                },
                removeCls: function (cls) {
                    var me = this,
                        el = me.rendered ? me.el : me.protoEl;
                    if (el) {
                        el.removeCls.apply(el, arguments);
                        return me;
                    }
                },
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var isValid = field.ownerCt.qtyChangeOverCount(field, newValue, oldValue);
                        if (isValid == false) {
                            field.setValue(oldValue)
                            return;
                        }
                        console.log(record);
                        var index = field.index;
                        var boxQty = record.get('boxQty');
                        var shipmentBoxGrid = field.ownerCt.shipmentBoxGrid;
                        var productItems = record.get('productItems');
                        var totalWeight = 0;
                        var productQty = 0;
                        for (var i = 0; i < productItems.length; i++) {
                            productItems[i].clazz = 'com.qpp.cgp.domain.shipment.ShipmentBoxProductItem';
                            if (productItems[i].weight) {
                            } else {
                                productItems[i]['weight'] = productItems[i].netWeight / productItems[i].qty;
                            }
                            if (i == index) {
                                productItems[i].qty = newValue;
                                productItems[i].netWeight = newValue * productItems[i].weight;
                            }
                            totalWeight += productItems[i].netWeight * me.boxQty;
                            productQty += boxQty * productItems[i].qty;
                        }
                        record.set('totalWeight', totalWeight);
                        record.set('productQty', productQty);
                        record.set('productItems', productItems);
                        record.commit();
                        shipmentBoxGrid.fireEvent('productqtychange', shipmentBoxGrid, shipmentBoxGrid.getPackageQty());

                    }
                }
            };
            var boxDetailNetWeight = {
                xtype: 'displayfield',
                name: 'weight',
                margin: '0 0 0 10',
                value: item.netWeight * me.boxQty,
                //fieldStyle: 'background-color:silver',
                readOnly: true,
                width: 60,
                fieldLabel: false
            };
            detailItems.push(boxDetailProduct, boxDetailQty, boxDetailNetWeight);
            index++;
        });

        var tbarItems = [];
        me.items = detailItems;
        me.callParent(arguments);
    }
});
