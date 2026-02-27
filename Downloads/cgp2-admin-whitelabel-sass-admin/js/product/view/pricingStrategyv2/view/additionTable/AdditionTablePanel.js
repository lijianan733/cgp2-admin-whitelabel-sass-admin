Ext.Loader.syncRequire(['Ext.ux.form.GridField']);
Ext.define("CGP.product.view.pricingStrategyv2.view.additionTable.AdditionTablePanel", {
    extend: 'Ext.ux.form.GridField',
    layout: 'fit',
    margin: '10 50 10 10',
    autoScroll: false,
    initComponent: function () {
        var me = this;
        me.componentUUId = JSGetUUID();
        me.gridConfig = {
            renderTo: me.gridContainer,
            store: Ext.create("CGP.product.view.pricingStrategyv2.store.LocalAdditionTable"),
            header: false,
            disableSelection: true,
            hideHeaders: true,
            autoScroll: false,
            border: 0,
            tbar: [
                '->',
                {
                    text: i18n.getKey('add') + i18n.getKey('addition') + i18n.getKey('priceTable'),
                    iconCls: 'icon_add',
                    handler: function () {
                        var maxIndex = me.gridConfig.store.max('index');

                        var additionModel = Ext.create('CGP.product.view.pricingStrategyv2.model.LocalAdditionTable');
                        additionModel.set('_id', JSGetCommonKey());
                        additionModel.set('table', []);
                        additionModel.set('index', maxIndex ? (maxIndex + 1) : 1);
                        me.gridConfig.store.add(additionModel);
                    }
                }
            ],
            columns: [
                {
                    //header: i18n.getKey('value'),
                    xtype: 'componentcolumn',
                    dataIndex: 'table',
                    width: 1050,
                    sortable: false,
                    renderer: function (value, metadata, record, rowIndex) {
                        //return value;
                        var index = rowIndex;
                        var recordId = record.getId();
                        var additionItem = Ext.create('CGP.product.view.pricingStrategyv2.view.additionTable.AdditionTableItem', {
                            itemId: 'additionTableItem_' + +recordId + '_' + index,
                            additionItemData: record.data,
                            productId: me.productId,
                            allowBlank: false,
                            gridContainer: 'additionItemGrid' + recordId
                        });
                        return Ext.create('CGP.product.view.pricingStrategyv2.view.FieldSetForm', {
                            itemId: 'additionFieldSet_' + recordId + '_' + index,
                            title: i18n.getKey('price') + i18n.getKey('table') + index,
                            minHeight: 200,
                            margin: '10 10 10 10',
                            padding: '5',
                            defaultType: 'displayfield',
                            items: [
                                additionItem
                            ]
                        })
                    }
                },
                {
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    dataIndex: '_id',
                    flex: 1,
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    items: [

                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actionremove',
                            tooltip: 'Remove',
                            handler: function (view, rowIndex, colIndex) {
                                var store = view.getStore();
                                store.removeAt(rowIndex);
                            }
                        }
                    ]
                }
            ]
        };
        me.callParent(arguments);
    },
//    setValue: function (data) {
//        var me = this;
//        if(data){
//            me.setSubmitValue(data[me.name]);
//        }
//    },
    getValue: function () {
        var me = this;
        var value = [];
        var additionStore = me.gridConfig.store;
        for (var i = 0; i < additionStore.count(); i++) {
            var recordId = additionStore.getAt(i).getId();
            //多次进入同一条配置，会导致多个同样的组件
            var item = Ext.ComponentQuery.query('[itemId=additionTableItem_' + recordId + '_' + i + ']').pop();
            value.push(item.getValue());
        }
        return value;
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        if (me.disabled) {
            isValid = true;
        }
        var addtionStore = me.gridConfig.store;
        if ((!Ext.isEmpty(me.allowBlank) && !me.allowBlank) && addtionStore.getCount() < 1) {
            me.setActiveError('该输入项为必输项');
            me.renderActiveError();
            isValid = false;
        } else {
            addtionStore.each(function (item, i) {
                var recordId = item.getId();
                //多次进入同一条配置，会导致多个同样的组件
                var recordEl = Ext.ComponentQuery.query('[itemId=additionTableItem_' + recordId + '_' + i + ']').pop();
                if (!recordEl.isValid()) {
                    isValid = false;
                }
            });
        }
        return isValid;
    }
})
