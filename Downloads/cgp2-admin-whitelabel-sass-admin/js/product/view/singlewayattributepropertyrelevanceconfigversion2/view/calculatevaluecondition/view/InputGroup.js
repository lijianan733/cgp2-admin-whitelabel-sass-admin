/**
 * Created by admin on 2020/8/20.
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.view.InputGroup', {
    extend: 'Ext.ux.form.GridField',
    alias: 'widget.inputgrid',
    width: '100%',
    skuAttributeStore:null,
    data:null,
    requires : ['CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.model.InputGroup'],
    initComponent: function () {
        var me = this;
        var controller=Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.Controller');
        //var inputGroupModel=Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.model.InputGroup');
        var inputStore=Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.store.InputGroup');
        me.gridConfig={
            renderTo:'inputGrid',
            store: inputStore,
            maxHeight: 300,
            tbar: [
                '<strong style="color: green;font-size: 110%">' + i18n.getKey('inputGroup') + '</strong>',
                //'->',
                {
                    text: i18n.getKey('add'),
                    iconCls: 'icon_add',
                    handler: function (btn) {

                        controller.inputWind(me.gridConfig,null);
                    }
                }
            ],
            columns: [
                {
                    xtype: 'rownumberer'
                },
                {
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    dataIndex:'inputKeys',
                    width: 60,
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    items: [
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actionremove',
                            tooltip: 'Remove',
                            handler: function (view, rowIndex, colIndex) {
                                Ext.Msg.confirm(i18n.getKey('info'),i18n.getKey('deleteConfirm'), function (select) {
                                    if (select == 'yes') {
                                        var store = view.getStore();
                                        store.removeAt(rowIndex);
                                    }
                                });
                            }
                        },
                        {
                            iconCls: 'icon_edit icon_margin',
                            itemId: 'actionedit',
                            tooltip: 'Edit',
                            handler: function (view, rowIndex, colIndex) {

                                var store = view.getStore();
                                var record = store.getAt(rowIndex);
                                controller.inputWind(view,record);
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('inputKeys'),
                    dataIndex: 'inputKeys',
                    xtype: 'gridcolumn',
                    itemId: 'inputKeys',
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        var val=Ext.Array.map(value,function(el){
                            return el.name;
                        });
                        metadata.tdAttr = 'data-qtip="' + val.join(',') + '"';
                        return val.join(',');
                    }
                }
            ]
        };
        me.callParent(arguments);
    },
    setAttrValue: function (data) {
        var me = this;
        if(Ext.isEmpty(data)){
            return ;
        }
        var skuAttributeStore = me.skuAttributeStore;
        var grid = me.gridConfig;
        var dataArr = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i]["conditionInputs"]) {
                Ext.Array.each(data[i]["conditionInputs"],function(arr){
                    if( arr.condition && arr.condition.operation && arr.condition.conditionType != 'else') {
                        var operations = arr.condition.operation.operations;
                        for (var j = 0; j < operations.length; j++) {
                            var operator = operations[j].operator;
                            if (operations[j].operationType == 'simple') {
                                if (Ext.Array.contains(['[min,max]', '[min,max)', '(min,max)', '(min,max]'], operator)) {//区间类型
                                    var skuAttributeData = skuAttributeStore.findRecord('id', operations[j].midValue.skuAttributeId).getData();
                                    operations[j].midValue.skuAttribute = skuAttributeData;
                                } else {//普通比较类型
                                    var skuAttributeData = skuAttributeStore.findRecord('id', operations[j].operations[0].skuAttributeId).getData();
                                    operations[j].operations[0].skuAttribute = skuAttributeData;
                                }
                            }
                        }
                    }
                });
                dataArr.push({
                    conditionInputs:data[i]["conditionInputs"],
                    inputKeys:data[i]["inputKeys"]
                })
            }

        }
        grid.store.proxy.data = dataArr;
        grid.store.load();
    }
})