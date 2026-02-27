Ext.define("CGP.bommaterial.edit.module.customerattribute.OptionGrid",{
    extend: 'Ext.ux.form.GridField',
    selModel: new Ext.selection.RowModel({
        mode: 'MULTI'
    }),

    initComponent: function(){
        var me = this;
        var controller = Ext.create("CGP.bommaterial.edit.controller.Controller");
        var data = [];
        if(me.data){
            data = me.data
        };
        var store = Ext.create("CGP.bommaterial.store.LocalAttributeOption",{
                data: data
            });
        store.on('datachanged',function(){
            var valueDefaultStore = Ext.getCmp('valueDefaultCombo').getStore();
            valueDefaultStore.removeAll();
            valueDefaultStore.add(store.data.items);
            Ext.getCmp('valueDefaultCombo').setValue();
        });
        me.gridConfig = {
            store: store,
            minHeight: 200,
            width: 400,
            selModel: new Ext.selection.RowModel({
                mode: 'MULTI'
            }),
            columns: [{
                xtype: 'actioncolumn',
                itemId: 'actioncolumn',
                width : 60,
                sortable: false,
                resizable: false,
                menuDisabled: true,
                items: [{
                    iconCls : 'icon_edit icon_margin',
                    itemId : 'actionedit',
                    tooltip : 'Edit',
                    handler : function(view, rowIndex, colIndex){
                        var store = view.getStore();
                        var record = store.getAt(rowIndex);
                        var createOrEdit = 'edit';
                       var valueType = Ext.getCmp('valueType').getValue();
                        if(valueType == 'Boolean' && store.getCount()>2){

                        }
                        controller.openOptionWindow(me,record,createOrEdit,valueType);
                    }
                },{
                    iconCls: 'icon_remove icon_margin',
                    itemId: 'actionremove',
                    tooltip: 'Remove',
                    handler: function (view, rowIndex, colIndex) {
                        var store = view.getStore();
                        store.removeAt(rowIndex);
                    }
                }]
            }, {
                text: i18n.getKey('sortOrder'),
                dataIndex: 'sortOrder',
                sortable : false,
                editor: {
                    xtype: 'numberfield'
                }
            }, {
                text: i18n.getKey('name'),
                sortable : false,
                dataIndex: 'name'
            },{
                text: i18n.getKey('value'),
                dataIndex: 'value'
            }],
            tbar: [{
                text: i18n.getKey('addOption'),
                handler: function () {
                    var createOrEdit = 'create';
                    var valueType = Ext.getCmp('valueType').getValue();
                    var store = me.getStore();
                    if(valueType == 'Boolean' && store.getCount() >= 2){
                        Ext.Msg.alert('提示','值类型为布尔类型时，选项最多只能有两条记录。')
                    }else{
                        controller.openOptionWindow( me,null ,createOrEdit,valueType);
                    }
                }
            }]
        };
        me.callParent(arguments);

    }
})