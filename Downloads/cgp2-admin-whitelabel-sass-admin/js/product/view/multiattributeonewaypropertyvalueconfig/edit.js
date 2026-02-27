Ext.Loader.syncRequire('CGP.product.view.productattributeprofile.model.ProfileModel');
Ext.onReady(function () {


    var page = Ext.widget({
        block: 'productcompositemodels',
        xtype: 'uxeditpage',
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.product.view.productattributeprofile.model.ProfileModel',
            remoteCfg: false,
            columnCount: 1,
            items: [
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name',
                    allowBlank: false
                },
                {
                    name: 'code',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('code'),
                    itemId: 'code'
                },
                {
                    name: 'inAttribute',
                    xtype: 'multicombobox',
                    fieldLabel: i18n.getKey('inAttribute'),
                    store: Ext.create('Ext.data.Store',{

                    }),
                    valueField: 'id',
                    displayField: 'name'
                },
                {
                    name: 'groups',
                    xtype: 'gridfield',
                    colspan: 2,
                    gridConfig: {
                        selModel: new Ext.selection.RowModel({
                            mode: 'MULTI'
                        }),
                        store: Ext.create("CGP.product.view.productattributeprofile.store.AttributeGroupStore"),
                        height: 200,
                        width: 900,
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
                                    controller.openOptionWindow(page,record);
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
                        },{
                            text: i18n.getKey('id'),
                            sortable : false,
                            dataIndex: '_id',
                            width: 80
                        },{
                            text: i18n.getKey('sort'),
                            dataIndex: 'sort',
                            width: 80
                        },{
                            text: i18n.getKey('name'),
                            sortable : false,
                            dataIndex: 'name',
                            width: 180,
                            renderer: function(value, metadata){
                                metadata.tdAttr = 'data-qtip ="'+ value +'"';
                                return value;
                            }
                        }],
                        tbar: [{
                            text: i18n.getKey('add'),
                            iconCls: 'icon_create',
                            handler: function () {
                                controller.openOptionWindow( page,null );
                            }
                        }]

                    },
                    fieldLabel: i18n.getKey('options'),
                    itemId: 'options',
                    id: 'options'
                }
            ]
        }
    });
});