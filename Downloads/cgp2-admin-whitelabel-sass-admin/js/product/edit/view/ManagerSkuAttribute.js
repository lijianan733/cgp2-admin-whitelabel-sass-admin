Ext.Loader.syncRequire('CGP.product.edit.model.Attribute');
Ext.define("CGP.product.edit.view.ManagerSkuAttribute", {
    extend: "Ext.panel.Panel",

    region: 'center',
    layout: {
        type: 'hbox',
        align: 'stretch',
        padding: 5
    },
    defaults: {
        flex: 1
    },
    initComponent: function () {
        var me = this;

        me.title = i18n.getKey('managerSkuAttr');
        var controller = me.controller;
        var skuGrid = Ext.create("Ext.grid.Panel", {
            id: 'Sku Attribute',
            title: i18n.getKey('skuAttribute'),
            multiSelect: true,
            selType: 'checkboxmodel',
            columns: [
                {
                    xtype: 'actioncolumn',
                    width: 40,
                    tdCls: 'vertical-middle',
                    items: [
                        {
                            iconCls: 'icon_edit icon_margin',  // Use a URL in the icon config
                            tooltip: 'Edit',
                            handler: function (grid, rowIndex, colIndex, a, b, record) {

                                var win = Ext.create('CGP.product.edit.view.EditSkuAttributeWindow', {
                                    record: record
                                });
                                win.show();
                            }
                        }
                    ]
                },
                {
                    dataIndex: 'name',
                    sortable: false,
                    menuDisabled: true,
                    tdCls: 'vertical-middle',
                    text: i18n.getKey('displayName')
                },
                {
                    dataIndex: 'sortOrder',
                    sortable: false,
                    menuDisabled: true,
                    tdCls: 'vertical-middle',
                    width: 85,
                    text: i18n.getKey('sortOrder')
                },
                {
                    dataIndex: 'value',
                    text: i18n.getKey('value'),
                    tdCls: 'vertical-middle',
                    sortable: false,
                    menuDisabled: true,
                    renderer: function (value, metadata, record) {
                        var returnStr = '';
                        var selectType = record.get('selectType');
                        if (selectType == 'MULTI' || selectType == 'SINGLE') {
                            var options = null;
                            value = value + '';//value可能是数值
                            var optionIds = value.split(',');
                            options = record.get('options');
                            var displayName = [];
                            Ext.Array.each(options, function (data) {
                                for (var i = 0; i < optionIds.length; i++) {
                                    if (data.id + '' == optionIds[i]) {
                                        displayName.push(data.name);
                                    }
                                }
                            })
                            //是颜色option 展示颜色块
                            if (record.get('inputType') == 'Color') {//现在inputType没得配置
                                var color = [];
                                Ext.Array.each(displayName, function (c) {
                                    color.push(c.split(':')[0] + '<a class=colorpick style="background-color:' + c.split(':')[0] + '"></a>');
                                })
                                displayName = color;
                            }
                            returnStr = displayName.join(',');
                        } else {
                            returnStr = value;
                        }
                        return returnStr;
                    }
                },
                {
                    text: i18n.getKey('defaultValue'),
                    dataIndex: 'defaultValue',
                    itemId: 'defaultValue',
                    tdCls: 'vertical-middle',
                    renderer: function (value, metadata, record) {
                        var returnStr = '';
                        var selectType = record.get('selectType');
                        if (selectType == 'MULTI' || selectType == 'SINGLE') {
                            var options = null;
                            value = value + '';//value可能是数值
                            var optionIds = value.split(',');
                            options = record.get('options');
                            var displayName = [];
                            Ext.Array.each(options, function (data) {
                                for (var i = 0; i < optionIds.length; i++) {
                                    if (data.id + '' == optionIds[i]) {
                                        displayName.push(data.name);
                                    }
                                }
                            })
                            //是颜色option 展示颜色块
                            if (record.get('inputType') == 'Color') {//现在inputType没得配置
                                var color = [];
                                Ext.Array.each(displayName, function (c) {
                                    color.push(c.split(':')[0] + '<a class=colorpick style="background-color:' + c.split(':')[0] + '"></a>');
                                })
                                displayName = color;
                            }
                            returnStr = displayName.join(',');
                        } else {
                            returnStr = value;
                        }
                        return returnStr;
                    }
                },
                {
                    text: i18n.getKey('selectType'),
                    dataIndex: 'selectType',
                    width: 120,
                    itemId: 'selectType',
                    sortable: false,
                    tdCls: 'vertical-middle',
                    menuDisabled: true,
                    renderer: function (value, mate, record) {
                        if (value == 'NON') {
                            return '输入型';
                        } else if (value == 'SINGLE') {
                            return '单选型';
                        } else {
                            return '多选型';
                        }
                    }
                },
                {
                    dataIndex: 'readOnly',
                    text: i18n.getKey('readOnly')
                },
                {
                    dataIndex: 'required',
                    text: i18n.getKey('required'),
                    sortable: true,
                    menuDisabled: true,
                    tdCls: 'vertical-middle',
                    width: 85
                }, {
                    dataIndex: 'enable',
                    sortable: true,
                    menuDisabled: true,
                    tdCls: 'vertical-middle',
                    width: 85,
                    text: i18n.getKey('enable')
                }, {
                    dataIndex: 'hidden',
                    text: i18n.getKey('是否隐藏'),
                    tdCls: 'vertical-middle',
                    sortable: true,
                    menuDisabled: true,
                    width: 85
                }
            ],
            store: controller.sku,
            viewConfig: {
                enableTextSelection: true,
                stripeRows: true,
                plugins: {
                    ptype: 'gridviewdragdrop',
                    ddGroup: 'selDD',
                    enableDrag: true,
                    enableDrop: true
                }
            }
        });
        var allGrid = Ext.create("Ext.grid.Panel", {
            id: 'General Attribute',
            title: i18n.getKey('generalAttribute'),
            multiSelect: true,
            selType: 'checkboxmodel',
            columns: [
                {
                    dataIndex: 'name',
                    text: i18n.getKey('name')
                },
                {
                    dataIndex: 'value',
                    text: i18n.getKey('value')
                },
                {
                    text: i18n.getKey('selectType'),
                    dataIndex: 'selectType',
                    width: 120,
                    itemId: 'selectType',
                    sortable: true,
                    renderer: function (value, mate, record) {
                        if (value == 'NON') {
                            return '输入型';
                        } else if (value == 'MULTI') {
                            return '多选型';
                        } else {
                            return '单选型';
                        }

                    }
                },
                {
                    dataIndex: 'valueType',
                    text: i18n.getKey('valueType'),
                }, {
                    dataIndex: 'readOnly',
                    text: i18n.getKey('readOnly')
                }, {
                    dataIndex: 'required',
                    text: i18n.getKey('required')
                }, {
                    dataIndex: 'enable',
                    text: i18n.getKey('enable')

                }, {
                    dataIndex: 'hidden',
                    text: i18n.getKey('是否隐藏'),
                    flex: 1
                }
            ],
            store: new Ext.data.Store({
                model: 'CGP.product.edit.model.Attribute',
                remoteSort: false,
                pageSize: 25,
                proxy: {
                    type: 'uxrest',
                    url: adminPath + 'api/productCategories/' + controller.data.mainCategory.id + '/attribute',
                    reader: {
                        type: 'json',
                        root: 'data'
                    }
                },
                autoLoad: true
            }),
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    ddGroup: 'selDD',
                    enableDrag: true,
                    enableDrop: true
                }
            }
        });
        var buttonPanel = Ext.create("Ext.panel.Panel", {
            layout: 'column',
            bodyStyle: 'margin-top:200px',
            border: false,
            width: 60,
            defaults: {
                columnWidth: 1
            },
            flex: 0.05,
            items: [
                {
                    xtype: 'button',
                    text: " ",
                    iconCls: 'icon_ux_left',
                    handler: function (button) {
                        var attributes = allGrid.getSelectionModel().getSelection();
                        //对required属性进行处理，现在默认为true,不再考虑属性原有的required
                        attributes.forEach(function (record, index, array) {
                            record.set('required', true);
                        });
                        skuGrid.getStore().loadData(attributes, true);
                        allGrid.getStore().remove(attributes);
                    }
                },
                {
                    style: 'margin-top:20px',
                    xtype: 'button',
                    text: " ",
                    iconCls: 'icon_ux_right',
                    handler: function (button) {
                        var attributes = skuGrid.getSelectionModel().getSelection();
                        allGrid.getStore().loadData(attributes, true);
                        skuGrid.getStore().remove(attributes);
                    }
                }
            ]
        });
        me.items = [skuGrid, buttonPanel, allGrid];
        me.bbar = [
            {
                xtype: 'button',
                iconCls: 'icon_previous_step',
                text: i18n.getKey('lastStep'),
                handler: function () {
                    //配置完sku属性存入 skuAttributes中
                    controller.page.removeAll();
                    controller.sku.removeAll();
                    controller.createInitPanel();

                }
            },
            '->', {
                xtype: 'button',
                iconCls: 'icon_next_step',
                text: i18n.getKey('nextStep'),
                handler: function () {

                    //配置完sku属性存入 skuAttributes中
                    var skuAttributes = [];
                    controller.sku.each(function (record) {
                        skuAttribute = {
                            displayName: record.get('name'),
                            sortOrder: record.get('sortOrder'),
                            attributeId: record.get('id'),
                            required: record.get('required'),
                            hidden: record.get('hidden'),
                            enable: record.get('enable'),
                            value: record.get('value'),
                            defaultValue: Ext.isEmpty(record.get('defaultValue')) ? null : record.get('defaultValue'),
                            readOnly: Ext.isEmpty(record.get('readOnly')) ? false : record.get('readOnly'),
                            isSku: true
                        }
                        skuAttributes.push(skuAttribute);
                    })
                    controller.data.skuAttributes = skuAttributes;
                    //进入信息配置面板
                    controller.configGeneralAttribute();
                }
            }
        ];
        me.callParent(arguments);
    }
})
