/**
 * Created by miao on 2021/6/09.
 */
Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.view.ParameterGrid', {
    extend: "Ext.ux.form.GridField",
    valueSource: 'storeProxy',//从proxy中取值需配置该属性
    //minHeight: 150,
    initComponent: function () {
        var me = this;
        var controller=Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.controller.Controller');
        var gridStore=Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.store.InnerParameter',{

            listeners:{
                load:function (){
                    me.getGrid().getSelectionModel().select(0);
                }
            }
        });
        me.gridConfig = {
            renderTo: JSGetUUID(),
            plugins: [],
            tbar: [
//                        '->',
                {
                    xtype:'displayfield',
                    value: i18n.getKey('inner') + i18n.getKey('param'),
                    fieldStyle: 'color:green;font-weight: bold'
                },
                {
                    text: i18n.getKey('add'),
                    itemId: 'add',
                    iconCls: 'icon_add',
                    handler: function (el) {
                        var grid = el.ownerCt.ownerCt;
                        controller.showParameterEdit(grid);
                    }
                }
            ],
            // multiSelect: false,
            selModel:{
                mode:'SINGLE'
            },
            selType: 'checkboxmodel',
            store: gridStore,
            width: '100%',
            defaults: {
                width: 60
            },
            columns: [
                {
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    width: 60,
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    items: [
                        {
                            iconCls: 'icon_edit icon_margin',
                            itemId: 'actionedit',
                            tooltip: 'Edit',
                            handler: function (view, rowIndex, colIndex) {
                                var store = view.getStore();
                                var record = store.getAt(rowIndex);
                                var index = store.pageSize * (store.currentPage - 1) + rowIndex;
                                controller.showParameterEdit(view, record.raw,index);
                            }
                        },
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actionremove',
                            tooltip: 'Remove',
                            handler: function (view, rowIndex, colIndex) {
                                var store = view.getStore();
                                var index = store.pageSize * (store.currentPage - 1) + rowIndex
                                Ext.Array.splice(store.proxy.data, index, 1);
                                //store.removeAt(rowIndex);
                                store.load();
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    flex: 1,
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('valueType'),
                    dataIndex: 'valueType',
                    width: 100,
                    renderer: function (value, metadata, record) {
                        return value;
                    }
                }

            ],
            listeners:me.listeners
        };
        me.callParent(arguments);
    },

})