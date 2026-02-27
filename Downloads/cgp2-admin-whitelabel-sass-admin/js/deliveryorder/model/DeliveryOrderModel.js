Ext.define('CGP.deliveryorder.model.DeliveryOrderModel', {
    extend: 'Ext.data.Model',
    /**
     * @cfg {Object[]} fields
     * field配置
     */
    fields: [
        {
            name: 'id',
            type: 'number'
        },
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'shipmentCost',
            type: 'float'
        },
        {
            name: 'address',
            type: 'object'
        },
        {
            name: 'date',
            type: 'date',
            dateWriteFormat: 'Uu',
            convert: function (value) {
                return new Date(value);
            }
        },
        {
            name: 'shipmentMethod',
            type: 'string'
        },
        {
            name: 'selectedShipmentMethod',
            type: 'string'
        },
        {
            name: 'trackingNo',
            type: 'string'
        },
        {
            name: 'boxes',
            type: 'array'
        },
        {
            name: 'items',
            type: 'array'
        },
        {
            name: 'status',
            type: 'object'
        },
        {
            name: 'orderDeliveryMethod',
            type: 'string'
        },
        {
            name: 'weight',
            type: 'int'
        },
        {
            name: 'firstTrackingNo',
            type: 'string'
        },
        {
            name: 'shipmentNo',
            type: 'string'
        },
        {
            name: 'deliveredDate',
            type: 'date',
            dateWriteFormat: 'Uu',
            convert: function (value) {
                if (!Ext.isEmpty(value)) {
                    return new Date(value);
                }
            }
        },
        {
            name: 'statusHistories',
            type: 'array'
        },
        {
            name: 'totalQty',
            type: 'int',
            convert: function (value, record) {
                var resultNum = 0;
                var items = record.get('items');
                Ext.Array.each(items, function (item) {
                    resultNum += item.qty;
                })
                return resultNum;
            }
        },
        {
            name: 'shipmentInfo',
            type: 'object',
            convert: function (value, record) {
                return {
                    weight: record.get('weight'),
                    shipmentCost: record.get('shipmentCost'),
                    shipmentMethod: record.get('shipmentMethod'),
                    trackingNo: record.get('trackingNo'),
                    deliveryDate: record.get('deliveredDate')
                }
            }
        },
        //需要装箱的产品数量,改数量排除了外派订单项
        {
            name: 'needPackingQty',
            type: 'number',
            convert: function (value, record) {
                var needPackingQty = 0;
                var lineItems = record.raw.items || [];
                lineItems.map(function (item) {
                    //没有第三方生产商
                    if (Ext.isEmpty(item.thirdManufactureProduction)) {
                        needPackingQty += item.qty;
                    }
                });
                return needPackingQty
            }
        },
        {
            name: 'manufactureCenter',
            type: 'string'
        },
        {
            name: 'finalManufactureCenter',
            type: 'string'
        },
        {
            name: 'isShip',
            type: 'boolean'
        }
    ],
    /**
     * @cfg {Ext.data.Proxy} proxy
     * model proxy
     */
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/shipmentOrders',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
