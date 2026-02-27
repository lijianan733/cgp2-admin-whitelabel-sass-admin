Ext.define('Order.status.view.productmaterialbomgrid.OrderProduceComponentList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.orderproducecomp',
    requires: [
        'Order.status.model.ShipmentBox',
        'Order.status.store.ShipmentBox'
    ],


    dataKeyName: 'internalId',
    //需打印组件是否已全部填写机器号，默认为true
    isDeployMachineAll: true,


    initComponent: function () {

        var me = this,
            record = this.record;


        me.data = {};

        me.store = Ext.create('Order.status.store.OrderProduceComponent', {
            params: {
                orderId: record.get('id')
            }
        });
        //init data
        //data[me.store.getAt(0)[dataKey]] = me.store.getAt(0).data;

        me.addEvents(['productqtychange']);
        me.columns = {
            defaults: {
                sortable: false,
                menuDisabled: true,
                tdCls: 'vertical-middle'
            },
            items: [
                {
                    autoSizeColumn: false,
                    dataIndex: 'seqNo',
                    text: i18n.getKey('seqNo'),
                    itemId: 'rownumberer',
                    width: 50,
                    tdCls: 'vertical-middle'
                },
                {
                    autoSizeColumn: false,
                    dataIndex: 'productName',
                    text: i18n.getKey('product'),
                    itemId: 'product',
                    width: 150,
                    tdCls: 'vertical-middle',
                    renderer : function(value,metadata){
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: '&nbsp;'+i18n.getKey('material')+i18n.getKey('id') + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + i18n.getKey('material')  + i18n.getKey('name') + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
                        i18n.getKey('isNeedPrint') + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+i18n.getKey('impositionType')+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
                    i18n.getKey('machine')+i18n.getKey('model'),
                    dataIndex: 'produceComponentInfos',
                    xtype: 'componentcolumn',
                    width: 620,
                    tdCls: 'vertical-middle',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        var qty = record.get('qty');
                        var produceComponentInfos = Ext.create('Order.status.view.productmaterialbomgrid.ProduceComponentList', {
                            record: record,
                            id: record.get('orderItemId'),
                            produceComponentInfos: value

                        });
                        if(Ext.isEmpty(value)){
                            return '';
                        }else{
                            return produceComponentInfos;
                        }

                    }
                }
            ]
        };

        me.callParent(arguments);
    },

    getValue: function () {
        var me = this;
        var data = [];
        me.store.data.items.forEach(function (item) {
            var attributeData = item.data;
            data.push(attributeData);
        });
        return data;
    },

    getPackageQty: function () {
        var me = this,
            i = 0;
        var packageQty = 0;
        var items = me.getStore().data.items;
        Ext.Array.each(items,function(item){
            packageQty += item.get('productQty');
        });
        return packageQty;
    },
    isValid: function () {
        var me = this;
        var dataList = me.store.data.items;
        me.isDeployMachineAll = true;
        Ext.Array.each(dataList,function(item){
            if(!Ext.getCmp(item.get('orderItemId')).isValid()){
                me.isDeployMachineAll = false;
                return false;
            }
        });
        return me.isDeployMachineAll;
    }
})