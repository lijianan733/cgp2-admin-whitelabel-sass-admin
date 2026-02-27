/**
 * Created by miao on 2021/8/12
 * 可以选择SMVT,PMVT，
 * 支持以上2种的id选择
 */

Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.DesignMVT', {
    extend: 'Ext.window.Window',
    modal: true,
    width: 650,
    height: 600,
    constrain: true,
    title: i18n.getKey('MVTSelector'),
    idTextField: null,//外围的id输入框
    layout: 'fit',
    designId: null,
    targetId: null,
    selectedData: null,
    multiSelect: false,
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'container',
                layout: 'fit',
                getValue: function () {
                    var me = this;
                    var result = null;
                    for (var i = 0; i < me.items.items.length; i++) {
                        var item = me.items.items[i];
                        if (item.hidden == false) {
                            result = item.getSelectionModel().getSelection();
                            break;
                        }
                    }
                    return result;
                },
                items: [
                    // {
                    //     xtype: 'treepanel',
                    //     store: Ext.create('CGP.product.view.productconfig.productviewconfig.view.navigationV2.store.SimplifyBomNodeTreeStore', {
                    //         designId: me.designId,
                    //         root: 'root'//root表示要查询哪个节点下的数据
                    //     }),
                    //     collapsible: true,
                    //     useArrows: true,
                    //     config: {
                    //         rootVisible: false,
                    //         viewConfig: {
                    //             stripeRows: true
                    //         }
                    //     },
                    //     autoScroll: true,
                    //     header: false,
                    //     children: null,
                    //     rootVisible: false,
                    //     itemId: 'SBomTree',
                    //     selModel: Ext.create("Ext.selection.CheckboxModel", {
                    //         injectCheckbox: 0,//checkbox位于哪一列，默认值为0
                    //         mode: "single",//multi,simple,single；默认为多选multi
                    //         checkOnly: false,//如果值为true，则只用点击checkbox列才能选中此条记录
                    //         allowDeselect: true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
                    //         enableKeyNav: true,//开启/关闭在网格内的键盘导航。
                    //         showHeaderCheckbox: true
                    //     }),
                    //     listeners: {
                    //         afterrender: function (treePanel) {
                    //             treePanel.expandAll();
                    //         }
                    //     },
                    //     columns: [
                    //         {
                    //             xtype: 'treecolumn',
                    //             text: i18n.getKey('simplifyBomNode'),
                    //             flex: 1,
                    //             dataIndex: '_id',
                    //             renderer: function (value, metadata, record) {
                    //                 var result = record.get('description') + '(' + value + ')';
                    //                 return result
                    //             }
                    //         }
                    //     ]
                    // },
                    {
                        xtype: 'grid',
                        hidden: true,
                        itemId: 'PMVTGrid',
                        header: false,
                        selModel: Ext.create("Ext.selection.CheckboxModel", {
                            injectCheckbox: 0,//checkbox位于哪一列，默认值为0
                            mode: me.multiSelect ? 'multi' : "single",//multi,simple,single；默认为多选multi
                            checkOnly: false,//如果值为true，则只用点击checkbox列才能选中此条记录
                            allowDeselect: true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
                            enableKeyNav: true,//开启/关闭在网格内的键盘导航。
                            showHeaderCheckbox: true
                        }),
                        store: Ext.create('CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.store.ProductMaterialViewCfgStore', {
                            params: {
                                filter: Ext.JSON.encode([{
                                    name: 'productConfigDesignId',
                                    type: 'number',
                                    value: parseInt(me.designId)
                                }])
                            }
                        }),
                        columns: [
                            {
                                dataIndex: '_id',
                                text: i18n.getKey('id'),
                                itemId: '_id',
                                tdCls: 'vertical-middle',
                                renderer: function (value, metadata) {
                                    metadata.tdAttr = 'data-qtip="' + value + '"';
                                    return value;
                                }
                            },
                            {
                                dataIndex: 'name',
                                text: i18n.getKey('name'),
                                itemId: 'name',
                                tdCls: 'vertical-middle',
                                renderer: function (value, metadata) {
                                    metadata.tdAttr = 'data-qtip="' + value + '"';
                                    return value;
                                }
                            },
                            {
                                dataIndex: 'productMaterialViewTypeId',
                                text: i18n.getKey('productMaterialViewTypeId'),
                                width: 200,
                                tdCls: 'vertical-middle',
                                itemId: 'productMaterialViewTypeId',
                                renderer: function (value, metadata) {
                                    metadata.tdAttr = 'data-qtip="' + value + '"';
                                    return value;
                                }
                            },
                            {
                                dataIndex: 'materialPath',
                                text: i18n.getKey('materialPath'),
                                itemId: 'materialPath',
                                width: 200,
                                flex: 1,
                                tdCls: 'vertical-middle',
                                renderer: function (value, metadata) {
                                    metadata.tdAttr = 'data-qtip="' + value + '"';
                                    return value;
                                }
                            }
                        ],
                        listeners: {
                            afterrender: function (comp) {
                                var win = comp.ownerCt.ownerCt;
                                var container = win.items.items[0];
                                win.showGrid(container, comp);
                                if (win.selectedData && win.selectedData.length > 0) {
                                    win.setGridSelected(comp, win.selectedData);
                                }
                            }
                        },
                    },
                    {
                        xtype: 'grid',
                        hidden: true,
                        itemId: 'SMVTGrid',
                        header: false,
                        store: Ext.create('CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.store.SimplifySBOMMaterialViewTypeStore', {
                            params: {
                                filter: Ext.JSON.encode([{
                                    name: 'productConfigDesignId',
                                    type: 'number',
                                    value: parseInt(me.designId)
                                }])
                            },
                            // listeners: {
                            //     load: function (comp) {
                            //         var win = comp.ownerCt.ownerCt;
                            //         if(win.selectedData&&win.selectedData.length>0){
                            //             win.setGridSelected(comp,win.selectedData);
                            //         }
                            //     }
                            // }
                        }),
                        selModel: Ext.create("Ext.selection.CheckboxModel", {
                            injectCheckbox: 0,//checkbox位于哪一列，默认值为0
                            mode: me.multiSelect ? 'multi' : "single",//multi,simple,single；默认为多选multi
                            checkOnly: false,//如果值为true，则只用点击checkbox列才能选中此条记录
                            allowDeselect: true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
                            enableKeyNav: true,//开启/关闭在网格内的键盘导航。
                            showHeaderCheckbox: true
                        }),
                        columns: [
                            {
                                dataIndex: '_id',
                                text: i18n.getKey('id'),
                                itemId: '_id',
                                tdCls: 'vertical-middle',
                                renderer: function (value, metadata) {
                                    metadata.tdAttr = 'data-qtip="' + value + '"';
                                    return value;
                                }
                            },
                            {
                                dataIndex: 'name',
                                text: i18n.getKey('name'),
                                itemId: 'name',
                                tdCls: 'vertical-middle',
                                renderer: function (value, metadata) {
                                    metadata.tdAttr = 'data-qtip="' + value + '"';
                                    return value;
                                }
                            },
                            {
                                dataIndex: 'productMaterialViewTypeId',
                                text: i18n.getKey('productMaterialViewTypeId'),
                                width: 200,
                                tdCls: 'vertical-middle',
                                itemId: 'productMaterialViewTypeId',
                                renderer: function (value, metadata) {
                                    metadata.tdAttr = 'data-qtip="' + value + '"';
                                    return value;
                                }
                            },
                            {
                                dataIndex: 'materialPath',
                                text: i18n.getKey('materialPath'),
                                itemId: 'materialPath',
                                flex: 1,
                                tdCls: 'vertical-middle',
                                renderer: function (value, metadata) {
                                    metadata.tdAttr = 'data-qtip="' + value + '"';
                                    return value;
                                }
                            }
                        ],
                        listeners: {
                            afterrender: function (comp) {
                                var win = comp.ownerCt.ownerCt;
                                if (win.selectedData && win.selectedData.length > 0) {
                                    win.setGridSelected(comp, win.selectedData);
                                }
                            }
                        }
                    }
                ]
            }
        ];
        me.tbar = [
            {
                xtype: 'combo',
                itemId: 'mvtType',
                fieldLabel: i18n.getKey('id类型'),
                valueField: 'value',
                displayField: 'display',
                editable: false,
                value: 'PMVT',
                flex: 1,
                store: Ext.create('Ext.data.Store', {
                    fields: [{
                        name: 'value',
                        type: 'string'
                    }, {
                        name: 'display',
                        type: 'string'
                    }],
                    data: [
                        {
                            display: 'PMVT',
                            value: 'PMVT'
                        },
                        {
                            display: 'SMVT',
                            value: 'SMVT'
                        },

                        // {
                        //     display: 'SBomNode',
                        //     value: 'SBomNode'
                        // },
                    ]
                }),
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var win = field.ownerCt.ownerCt;
                        var container = win.items.items[0];
                        win.showGrid(container, container.getComponent(newValue + 'Grid'));
                    }
                }
            }
        ];
        me.bbar = ['->',
            {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_agree',
                handler: function () {
                    var win = this.ownerCt.ownerCt;
                    var container = win.items.items[0];
                    var selected = container.getValue();
                    if (selected) {
                        if (win.idTextField.store) {
                            win.idTextField.store.loadData(selected, true);
                        } else {
                            var values = [], ids = [];
                            selected.forEach(function (item) {
                                values.push(item.data);
                            });
                            win.idTextField.setValue(
                                values.map(function (v) {
                                    return v.id || v._id;
                                }).join(',')
                            );
                            win.idTextField.ownerCt.data = values;
                        }
                        win.close();
                    } else {
                        Ext.Msg.alert('提示', '请选择一个节点');
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function () {
                    var win = this.ownerCt.ownerCt;
                    win.close();
                }
            }];
        me.callParent();
        me.on('afterrender', function (comp) {
            if (comp.selectedData && comp.selectedData.length > 0) {
                comp.setMVTType(comp.selectedData[0]);
            }
        })
    },
    setMVTType: function (data) {
        var me = this;
        var mvtType = me.down("toolbar[@dock='top']").getComponent('mvtType');
        data.clazz.indexOf('ProductMaterialViewType') > 0 ? mvtType.setValue('PMVT') : mvtType.setValue('SMVT');
    },
    setGridSelected: function (comp, selectedData) {
        var recSelected = [];
        comp.store.each(function (item) {
            selectedData.forEach(function (sel) {
                if (item.get('_id') == sel._id) {
                    recSelected.push(item);
                }
            })
        });
        comp.getSelectionModel().select(recSelected);
    },
    showGrid: function (container, currGrid) {
        var items = container.items.items;
        items.forEach(function (item) {
            item.hide();
            item.disable();
        })
        currGrid.enable();
        currGrid.show();
    }
})