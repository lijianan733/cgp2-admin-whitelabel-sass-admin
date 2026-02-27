/**
 * Created by nan on 2021/3/19
 * 可以选择SMVT,PMVT,SbomTree的节点，
 * 支持以上三种的id选择
 */

Ext.define('CGP.product.view.productconfig.productviewconfig.view.navigationV3.view.IdTargetSelectorWindow', {
    extend: 'Ext.window.Window',
    modal: true,
    width: 650,
    height: 600,
    constrain: true,
    title: i18n.getKey('IdTargetSelector'),
    idTextField: null,//外围的id输入框
    layout: 'fit',
    productViewConfigId: null,
    selectorType: 'idSelector',//idSelector or jsonPathSelector
    initComponent: function () {
        var me = this;
        //jsonPathSelector这种类型的才需要多选
        var multiselect = (me.selectorType == 'jsonPathSelector');
        me.items = [
            {
                xtype: 'container',
                layout: 'fit',
                getSelection: function () {
                    var me = this;
                    for (var i = 0; i < me.items.items.length; i++) {
                        var item = me.items.items[i];
                        if (item.hidden == false) {
                            var selection = item.getSelectionModel().getSelection();
                            return selection;
                        }
                    }
                },
                items: [
                    {
                        xtype: 'treepanel',
                        store: Ext.create('CGP.product.view.productconfig.productviewconfig.view.navigationV2.store.SimplifyBomNodeTreeStore', {
                            productViewConfigId: me.productViewConfigId,
                            root: 'root',//root表示要查询哪个节点下的数据
                            listeners: {
                                load: function (store, partnerNode, nodes) {
                                   
                                    if (multiselect) {
                                        for (var i = 0; i < nodes.length; i++) {
                                            nodes[i].set('checked', false);
                                        }
                                    }
                                },
                            }
                        }),
                        collapsible: true,
                        useArrows: true,
                        config: {
                            rootVisible: false,
                            viewConfig: {
                                stripeRows: true
                            }
                        },
                        autoScroll: true,
                        header: false,
                        children: null,
                        rootVisible: false,
                        itemId: 'SBomTree',
                        selModel: Ext.create('Ext.selection.RowModel', {
                            injectCheckbox: 0,//checkbox位于哪一列，默认值为0
                            mode: multiselect ? "simple" : 'multi',//multi,simple,single；默认为多选multi
                            checkOnly: multiselect,//如果值为true，则只用点击checkbox列才能选中此条记录
                            allowDeselect: true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
                            enableKeyNav: true,//开启/关闭在网格内的键盘导航。
                            showHeaderCheckbox: true
                        }),
                        listeners: {
                            afterrender: function (treePanel) {
                                treePanel.expandAll();
                            },
                            select: function (selectModel, record, index, obj) {
                               ;
                                if (multiselect) {
                                    record.set('checked', true);
                                }

                            },
                            deselect: function (selectModel, record, index, obj) {
                               
                                if (multiselect) {
                                    record.set('checked', false);
                                }
                            }
                        },
                        multiselect: multiselect,
                        columns: [
                            {
                                xtype: 'treecolumn',
                                text: i18n.getKey('simplifyBomNode'),
                                flex: 1,
                                sortable: false,
                                dataIndex: '_id',
                                renderer: function (value, metadata, record) {
                                    var result = record.get('description') + '(' + value + ')';
                                    return result
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'grid',
                        hidden: true,
                        itemId: 'PMVTGrid',
                        header: false,
                        selModel: Ext.create((multiselect ? "Ext.selection.CheckboxModel" : 'Ext.selection.RowModel'), {
                            injectCheckbox: 0,//checkbox位于哪一列，默认值为0
                            mode: multiselect ? 'multi' : "single",//multi,simple,single；默认为多选multi
                            checkOnly: false,//如果值为true，则只用点击checkbox列才能选中此条记录
                            allowDeselect: true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
                            enableKeyNav: true,//开启/关闭在网格内的键盘导航。
                            showHeaderCheckbox: true
                        }),
                        store: Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.store.ProductMaterialViewTypeVersionFiveStore', {
                            proxy: {
                                type: 'uxrest',
                                url: adminPath + 'api/productConfigViews/' + me.productViewConfigId + '/productMaterialViewTypes',
                                reader: {
                                    type: 'json',
                                    root: 'data'
                                }
                            },
                        }),
                        multiselect: multiselect,
                        columns: {
                            defaults: {
                                tdCls: 'vertical-middle',
                                sortable: false,
                            },
                            items: [
                                {
                                    dataIndex: '_id',
                                    text: i18n.getKey('id'),
                                    renderer: function (value, metadata) {
                                        metadata.tdAttr = 'data-qtip="' + value + '"';
                                        return value;
                                    }
                                },
                                {
                                    dataIndex: 'name',
                                    text: i18n.getKey('name'),
                                    renderer: function (value, metadata) {
                                        metadata.tdAttr = 'data-qtip="' + value + '"';
                                        return value;
                                    }
                                },
                                {
                                    dataIndex: 'productMaterialViewTypeId',
                                    text: i18n.getKey('productMaterialViewTypeId'),
                                    width: 200,
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
                                    renderer: function (value, metadata) {
                                        metadata.tdAttr = 'data-qtip="' + value + '"';
                                        return value;
                                    }
                                }
                            ]
                        }
                    },
                    {
                        xtype: 'grid',
                        hidden: true,
                        itemId: 'SMVTGrid',
                        header: false,
                        store: Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.store.SimplifySBOMMaterialViewType', {
                                proxy: {
                                    type: 'uxrest',
                                    url: adminPath + 'api/productConfigViews/' + me.productViewConfigId + '/simplifyMaterialViewTypes',
                                    reader: {
                                        type: 'json',
                                        root: 'data'
                                    }
                                },
                            }
                        ),
                        multiselect: multiselect,
                        selModel: Ext.create((multiselect ? "Ext.selection.CheckboxModel" : 'Ext.selection.RowModel'), {
                            injectCheckbox: 0,//checkbox位于哪一列，默认值为0
                            mode: multiselect ? 'multi' : "single",//multi,simple,single；默认为多选multi
                            checkOnly: false,//如果值为true，则只用点击checkbox列才能选中此条记录
                            allowDeselect: true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
                            enableKeyNav: true,//开启/关闭在网格内的键盘导航。
                            showHeaderCheckbox: true
                        }),
                        columns: {
                            defaults: {
                                tdCls: 'vertical-middle',
                                sortable: false,
                            },
                            items: [
                                {
                                    dataIndex: '_id',
                                    text: i18n.getKey('id'),
                                    renderer: function (value, metadata) {
                                        return value;
                                    }
                                },
                                {
                                    dataIndex: 'name',
                                    text: i18n.getKey('name'),
                                    renderer: function (value, metadata) {
                                        return value;
                                    }
                                },
                                {
                                    dataIndex: 'productMaterialViewTypeId',
                                    text: i18n.getKey('productMaterialViewTypeId'),
                                    width: 200,
                                    renderer: function (value, metadata) {
                                        return value;
                                    }
                                },
                                {
                                    dataIndex: 'materialPath',
                                    text: i18n.getKey('materialPath'),
                                    flex: 1,
                                    renderer: function (value, metadata) {
                                        return value;
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        ];
        me.tbar = [
            {
                xtype: 'combo',
                fieldLabel: i18n.getKey('类型'),
                valueField: 'value',
                displayField: 'display',
                editable: false,
                value: 'SBomNode',
                flex: 1,
                itemId: 'type',
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
                            display: 'SMVT',
                            value: 'SMVT'
                        },
                        {
                            display: 'PMVT',
                            value: 'PMVT'
                        },
                        {
                            display: 'SBomNode',
                            value: 'SBomNode'
                        },
                    ]
                }),
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var win = field.ownerCt.ownerCt;
                        var container = win.items.items[0];
                        var PMVTGrid = container.getComponent('PMVTGrid');
                        var SBomTree = container.getComponent('SBomTree');
                        var SMVTGrid = container.getComponent('SMVTGrid');
                        if (newValue == 'PMVT') {
                            PMVTGrid.show();
                            SMVTGrid.hide();
                            SBomTree.hide();
                        } else if (newValue == 'SMVT') {
                            PMVTGrid.hide();
                            SMVTGrid.show();
                            SBomTree.hide();
                        } else {
                            PMVTGrid.hide();
                            SMVTGrid.hide();
                            SBomTree.show();
                        }
                    }
                }
            }
        ];
        me.bbar = ['->', {
            xtype: 'button',
            text: i18n.getKey('confirm'),
            iconCls: 'icon_agree',
            handler: function () {
                var win = this.ownerCt.ownerCt;
                var container = win.items.items[0];
                var selection = container.getSelection();
                var tbar = win.getDockedItems('toolbar[dock="top"]')[0];
                var type = tbar.getComponent('type').getValue();
                if (selection.length > 0) {
                    if (win.selectorType == 'jsonPathSelector') {
                        //组成特定的表达式 simplifyMaterialViews
                        //$..simplifyMaterialViews[?((@.simplifySBOMMaterialViewTypeId== 17227192)|| (@.simplifySBOMMaterialViewTypeId == 454545454))]
                        //$..simplifyMaterialViews[?((@.productMaterialViewTypeId== 17227192)|| (@.productMaterialViewTypeId == 454545454))]
                        /*  var nodeTypeMapping = {
                              'SMVT': 'simplifySBOMMaterialViewTypeId',
                              'PMVT': 'productMaterialViewTypeId',
                              'SBomNode': ''
                          };*/
                        var result = '';
                        if (type == 'PMVT' || type == 'SMVT') {
                            var arr = [];
                            for (var i = 0; i < selection.length; i++) {
                                var id = selection[i].get('id') || selection[i].get('_id');
                                if (type == 'SMVT') {
                                    arr.push('(@.simplifySBOMMaterialViewTypeId == ' + id + ')')
                                } else {
                                    arr.push('(@.productMaterialViewTypeId == ' + id + ')')
                                }
                            }
                            result = '$..simplifyMaterialViews[?(' + arr.join('||') + ')]';
                        } else {
                            var arr = [];
                            for (var i = 0; i < selection.length; i++) {
                                //v3中的id换成了configId
                                arr.push('(@.configId== ' + selection[i].getId() + ')');
                            }
                            result = '$..child[?(' + arr.join('||') + ')]'
                        }
                        win.idTextField.setValue(result);
                    } else if (win.selectorType == 'idSelector') {
                        var selectedId = selection[0].get('id') || selection[0].get('_id');
                        win.idTextField.setValue(selectedId);
                    }
                    win.close();
                } else {
                    Ext.Msg.alert('提示', '请选择一个节点');
                }
            }
        }, {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            iconCls: 'icon_cancel',
            handler: function () {
                var win = this.ownerCt.ownerCt;
                win.close();
            }
        }];
        me.callParent();
    }
})