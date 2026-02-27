/**
 * Created by nan on 2021/4/27
 */
Ext.Loader.syncRequire([
    'CGP.common.condition.ConditionFieldV3'
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.BatchCreatePMVTWindow', {
    extend: 'Ext.window.Window',
    modal: true,
    constrain: true,
    maximizable: true,
    width: 1200,
    height: 500,
    layout: {
        type: 'fit'
    },
    configType: 'PMVT',//PMVT或者SMVT
    productConfigDesignId: null,
    productBomConfigId: null,
    materialPath: null,//确定了物料的节点路径
    rowIndexArr: null,//记录那些行号的列添加了，处理删除了某列后的逻辑
    bomConfigVersion: '4',//记录bom配置的版本信息
    productId: null,
    bbar: [
        '->',
        {
            xtype: 'button',
            text: i18n.getKey('confirm'),
            iconCls: 'icon_agree',
            handler: function (btn) {
                var win = btn.ownerCt.ownerCt;
                if (win.isValid() == true) {
                    var data = win.getValue();
                    win.bathCreate(data);
                }
            }
        },
        {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            iconCls: 'icon_cancel',
            handler: function (btn) {
                var win = btn.ownerCt.ownerCt;
                win.close();
            }
        }
    ],
    isValid: function () {
        var me = this;
        var grid = me.items.items[0];
        var colCount = grid.columns.length;
        var isValid = true;
        if (me.rowIndexArr.length == 0) {
            isValid = false;
        } else {
            for (var i = 0; i < me.rowIndexArr.length; i++) {
                var rowIndex = me.rowIndexArr[i];
                for (var j = 0; j < colCount; j++) {
                    var editor = Ext.ComponentQuery.query('[itemId=' + (rowIndex + '_' + j) + ']')[0];
                    if (editor && editor.isValid() == false) {
                        isValid = false;
                    }
                }
            }
        }
        return isValid;
    },
    bathCreate: function (data,) {
        var me = this;
        me.setLoading(true);
        setTimeout(function () {
            var url = adminPath + 'api/productMaterialViewTypes/batch';
            if (me.configType == 'SMVT') {
                url = adminPath + 'api/simplifyMaterialViewType/batch';
            }
            JSAjaxRequest(url, "POST", false, data, i18n.getKey('addsuccessful'), function (request, success, response) {
                me.setLoading(false);
                if (success) {
                    var responseText = Ext.JSON.decode(response.responseText);
                    if (responseText.success) {
                        me.close();
                    }
                }
            })
        }, 100);

    },
    getValue: function () {
        var me = this;
        var grid = me.items.items[0];
        var colCount = grid.columns.length;
        var result = [];
        var clazz = '';
        if (me.configType == 'PMVT') {
            clazz = 'com.qpp.cgp.domain.bom.ProductMaterialViewType'
        } else {
            clazz = 'com.qpp.cgp.domain.simplifyBom.SimplifyMaterialViewType'
        }
        for (var i = 0; i < me.rowIndexArr.length; i++) {
            var rowIndex = me.rowIndexArr[i];
            var item = {
                clazz: clazz,
                productConfigDesignId: me.productConfigDesignId
            };
            for (var j = 0; j < colCount; j++) {
                var editor = Ext.ComponentQuery.query('[itemId=' + (rowIndex + '_' + j) + ']')[0];
                if (editor) {
                    //处理特殊的字段
                    if (editor.xtype == 'conditionfieldv3') {
                        var conditionDTO = editor.getValue();
                        if (conditionDTO) {
                            item[editor.name] = conditionDTO;
                            item['condition'] = editor.getExpression();
                        }
                    } else {
                        if (editor.diyGetValue) {
                            item[editor.name] = editor.diyGetValue();
                        } else {
                            item[editor.name] = editor.getValue();
                        }
                    }
                }
            }
            if (me.bomConfigVersion == '5') {
                item.materialSelector = {
                    clazz: "com.qpp.cgp.domain.bom.material.IdPathSelector",
                    idPath: item.materialPath
                }
            }
            result.push(item);
        }
        return result;
    },
    constructor: function () {
        var me = this;
        me.rowIndexArr = [];
        me.callParent(arguments);
        //定义同上功能按钮
        Ext.define('sameUpBtn', {
            extend: 'Ext.button.Button',
            alias: 'widget.sameupbtn',
            tooltip: '同上',
            text: '同上',
            width: 24,
            margin: '0 2 0 2',
            win: me,
            componentCls: 'btnOnlyIconV2',
            iconCls: 'icon_copyCmpTitleInfo',
            handler: function (btn) {
                var win = btn.win;
                var editor = btn.ownerCt.items.items[0];
                var rowIndex = Number(editor.itemId.split('_')[0]);
                var colIndex = Number(editor.itemId.split('_')[1]);
                var upRowIndex;//上一条记录的编号
                var currentRowIndex = win.rowIndexArr.indexOf(rowIndex);
                upRowIndex = win.rowIndexArr[currentRowIndex - 1];
                var upEditor = Ext.ComponentQuery.query('[itemId=' + (upRowIndex + '_' + colIndex) + ']')[0];
                if (upEditor) {
                    var data = '';
                    if (upEditor.diyGetValue) {
                        data = upEditor.diyGetValue()
                    } else {
                        data = upEditor.getValue()
                    }
                    data = Ext.clone(data);
                    if (editor.diySetValue) {
                        editor.diySetValue(data);
                    } else {
                        editor.setValue(data);
                    }
                }
            }
        })
    },
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('batch') + i18n.getKey('create') + i18n.getKey(me.configType);
        var productController = Ext.create('CGP.product.view.productconfig.controller.Controller');
        var contentData = productController.buildPMVTContentData(me.productId);
        var localStore = Ext.create('Ext.data.Store', {
            autoSync: false,
            data: [],
            proxy: {
                type: 'memory'
            },
            fields: [
                {
                    name: '_id',
                    type: 'string',
                    useNull: true
                },
                {
                    name: 'rawRowNumber',
                    type: 'number'
                },
                {
                    name: 'name',
                    type: 'string'
                },
                {
                    name: 'clazz',
                    type: 'string',
                    defaultValue: "com.qpp.cgp.domain.bom.ProductMaterialViewType"
                }, {
                    name: 'materialPath',
                    type: 'string'
                }, {
                    name: 'materialViewType',
                    type: 'object'
                }, {
                    name: 'productConfigDesignId',
                    type: 'int'
                }, {
                    name: 'productMaterialViewTypeId',
                    type: 'string'
                },
                {
                    name: 'pageContentQty',
                    type: 'object'
                }, {
                    name: 'condition',
                    type: 'object'
                }
            ],
        });
        me.items = [
            {
                xtype: 'grid',
                viewConfig: {
                    markDirty: false,
                },
                store: localStore,
                tbar: [
                    {
                        xtype: 'button',
                        text: i18n.getKey('add'),
                        iconCls: 'icon_add',
                        count: 0,
                        handler: function (btn) {
                            var grid = btn.ownerCt.ownerCt;
                            grid.store.add({
                                rawRowNumber: btn.count
                            });
                            grid.ownerCt.rowIndexArr.push(btn.count);
                            btn.count++;
                        }
                    }
                ],
                columns: [
                    {
                        xtype: 'actioncolumn',
                        width: 35,
                        items: [
                            {
                                iconCls: 'icon_remove icon_margin',  // Use a URL in the icon config
                                tooltip: 'remove',
                                handler: function (gridView, rowIndex, colIndex, a, b, record) {
                                    var store = gridView.ownerCt.store;
                                    var win = gridView.ownerCt.ownerCt;
                                    var rawRowNumber = record.raw.rawRowNumber;
                                    Ext.Msg.confirm('提示', '确定删除？', callback);

                                    function callback(id) {
                                        if (id === 'yes') {
                                            store.remove(record);
                                            win.rowIndexArr.remove(win.rowIndexArr.indexOf(rawRowNumber));
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {
                        dataIndex: 'name',
                        text: 'name',
                        width: 200,
                        sortable: false,
                        xtype: 'componentcolumn',
                        renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                            var rawRowNumber = record.get('rawRowNumber');
                            return {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        name: 'name',
                                        itemId: rawRowNumber + '_' + colIndex,
                                        allowBlank: false,
                                        flex: 1,
                                    },
                                    {
                                        xtype: 'sameupbtn',
                                    }
                                ]
                            }
                        }
                    },
                    {
                        xtype: 'componentcolumn',
                        dataIndex: 'productMaterialViewTypeId',
                        text: i18n.getKey('productMaterialViewTypeId'),
                        width: 200,
                        hidden: me.configType == 'SMVT',
                        renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                            var rawRowNumber = record.get('rawRowNumber');
                            return {
                                xtype: 'uxfieldcontainer',
                                name: 'productMaterialViewTypeId',
                                flex: 1,
                                itemId: rawRowNumber + '_' + colIndex,
                                layout: {
                                    type: 'hbox'
                                },
                                defaults: {},
                                items: [
                                    {
                                        xtype: 'numberfield',
                                        name: 'productMaterialViewTypeId',
                                        fieldLabel: false,
                                        flex: 1,
                                        minValue: 0,
                                        margin: '0 5 0 0',
                                        hideTrigger: true,
                                        allowBlank: false,
                                        itemId: 'productMaterialViewTypeId',
                                    },
                                    {
                                        xtype: 'button',
                                        text: i18n.getKey('selfCreate'),
                                        width: 65,
                                        handler: function (button) {
                                            var numberField = button.ownerCt.getComponent('productMaterialViewTypeId');
                                            numberField.setValue(JSGetCommonKey(false));
                                        }
                                    }
                                ],
                                isValid: function () {
                                    var me = this;
                                    me.Errors[me.getFieldLabel()] = '该输入项为必输项';
                                    return me.getComponent('productMaterialViewTypeId').isValid();
                                },
                                diySetValue: function (data) {
                                    var me = this;
                                    me.getComponent('productMaterialViewTypeId').setValue(data);
                                },
                                diyGetValue: function () {
                                    var me = this;
                                    return me.getComponent('productMaterialViewTypeId').getValue();
                                },
                            }
                        }
                    },
                    {
                        xtype: 'componentcolumn',
                        dataIndex: 'materialViewType',
                        text: i18n.getKey('materialViewType'),
                        width: 200,
                        tdCls: 'vertical-middle',
                        itemId: 'materialViewType',
                        renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                            var rawRowNumber = record.get('rawRowNumber');
                            var materialViewTypeStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.store.MaterialViewType', {});
                            return {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                items: [
                                    {
                                        xtype: 'gridcombo',
                                        name: "materialViewType",
                                        itemId: rawRowNumber + '_' + colIndex,
                                        allowBlank: false,
                                        displayField: '_id',
                                        valueField: '_id',
                                        editable: false,
                                        flex: 1,
                                        store: materialViewTypeStore,
                                        matchFieldWidth: false,
                                        multiSelect: false,
                                        autoScroll: true,
                                        gridCfg: {
                                            height: 400,
                                            width: 550,
                                            autoScroll: true,
                                            columns: [
                                                {
                                                    text: i18n.getKey('id'),
                                                    width: 80,
                                                    dataIndex: '_id',
                                                    renderer: function (value, metaData) {
                                                        metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                                        return value;
                                                    }
                                                },
                                                {
                                                    text: i18n.getKey('name'),
                                                    width: 180,
                                                    dataIndex: 'name',
                                                    renderer: function (value, metaData, record, rowIndex) {
                                                        metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                                        return value
                                                    }
                                                },
                                                {
                                                    text: i18n.getKey('description'),
                                                    flex: 1,
                                                    dataIndex: 'description',
                                                    renderer: function (value, metaData, record, rowIndex) {
                                                        metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                                        return value
                                                    }
                                                }
                                            ],
                                            bbar: {
                                                xtype: 'pagingtoolbar',
                                                store: materialViewTypeStore,
                                                displayInfo: true, // 是否 ? 示， 分 ? 信息
                                                displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                                                emptyMsg: i18n.getKey('noData')
                                            }
                                        },
                                        filterCfg: {
                                            layout: {
                                                type: 'column'
                                            },
                                            defaults: {
                                                width: 170,
                                                isLike: false,
                                                padding: 2
                                            },
                                            items: [
                                                {
                                                    xtype: 'textfield',
                                                    fieldLabel: i18n.getKey('id'),
                                                    name: '_id',
                                                    isLike: false,
                                                    itemId: '_id',
                                                    labelWidth: 40
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    fieldLabel: i18n.getKey('name'),
                                                    name: 'name',
                                                    itemId: 'name',
                                                    labelWidth: 40
                                                }
                                            ]
                                        },
                                        diyGetValue: function () {
                                            var me = this;
                                            var data = me.getArrayValue();
                                            return {
                                                _id: data._id,
                                                clazz: data.clazz
                                            };
                                        },
                                        diySetValue: function (data) {
                                            var me = this;
                                            me.setSubmitValue(data._id);
                                        }
                                    },
                                    {
                                        xtype: 'sameupbtn',
                                    }
                                ]
                            }
                        }
                    },
                    {
                        xtype: 'componentcolumn',
                        dataIndex: 'materialPath',
                        text: i18n.getKey('materialPath'),
                        itemId: 'materialPath',
                        minWidth: 200,
                        flex: 1,
                        tdCls: 'vertical-middle',
                        renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                            var rawRowNumber = record.get('rawRowNumber');
                            if (me.materialPath) {
                                return {
                                    xtype: 'displayfield',
                                    itemId: rawRowNumber + '_' + colIndex,
                                    name: 'materialPath',
                                    flex: 1,
                                    value: me.materialPath
                                }

                            } else {
                                return {
                                    xtype: 'fieldcontainer',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'uxfieldcontainer',
                                            itemId: rawRowNumber + '_' + colIndex,
                                            name: 'materialPath',
                                            layout: 'hbox',
                                            flex: 1,
                                            labelAlign: 'left',
                                            defaults: {},
                                            allowBlank: false,
                                            items: [
                                                {
                                                    xtype: 'textfield',
                                                    itemId: 'materialPath',
                                                    name: 'materialPath',
                                                    margin: '0 5 0 0',
                                                    flex: 1,
                                                    value: me.materialPath,
                                                    readOnly: true,
                                                    allowBlank: false,
                                                    fieldLabel: false,
                                                },
                                                {
                                                    xtype: 'button',
                                                    text: i18n.getKey('choice'),
                                                    width: 65,
                                                    handler: function (btn) {
                                                        var component = btn.ownerCt.getComponent('materialPath');
                                                        var materialPath = component.getValue();
                                                        var controller = Ext.create('CGP.product.view.productconfig.controller.Controller');
                                                        controller.getMaterialPath(me.productBomConfigId, materialPath, component);
                                                    }
                                                }
                                            ],
                                            isValid: function () {
                                                var me = this;
                                                var materialPath = me.getComponent('materialPath')
                                                if (me.disabled == true) {
                                                    return true
                                                } else {
                                                    if (materialPath.isValid()) {
                                                        return true;
                                                    } else {
                                                        me.Errors[me.getFieldLabel()] = '该输入项为必输项';
                                                        return me.getComponent('materialPath').isValid();
                                                    }
                                                }
                                            },
                                            diySetValue: function (data) {
                                                var me = this;
                                                me.getComponent('materialPath').setValue(data);
                                            },
                                            diyGetValue: function () {
                                                var me = this;
                                                return me.getComponent('materialPath').getValue();
                                            }
                                        },
                                        {
                                            xtype: 'sameupbtn',
                                        }
                                    ]
                                }

                            }
                        }
                    },
                    {
                        xtype: 'componentcolumn',
                        dataIndex: 'pageContentQty',
                        text: i18n.getKey('pageContentQty'),
                        itemId: 'pageContentQty',
                        width: 250,
                        tdCls: 'vertical-middle',
                        renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                            var rawRowNumber = record.get('rawRowNumber');
                            return {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                items: [
                                    {
                                        xtype: 'valueexfield',
                                        allowBlank: true,
                                        flex: 1,
                                        name: 'pageContentQty',
                                        itemId: rawRowNumber + '_' + colIndex,
                                        commonPartFieldConfig: {
                                            uxTextareaContextData: true,
                                            defaultValueConfig: {
                                                type: 'Number',
                                                clazz: 'com.qpp.cgp.value.ConstantValue',
                                                typeSetReadOnly: true,
                                                clazzSetReadOnly: false
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'sameupbtn',
                                    }
                                ]
                            }
                        }
                    },
                    {
                        xtype: 'componentcolumn',
                        dataIndex: 'condition',
                        text: i18n.getKey('condition'),
                        itemId: 'condition',
                        width: 250,
                        tdCls: 'vertical-middle',
                        renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                            var rawRowNumber = record.get('rawRowNumber');
                            return {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                items: [
                                    /*       {
                                               xtype: 'valueexfield',
                                               allowBlank: false,
                                               flex: 1,
                                               name: 'condition',
                                               itemId: rawRowNumber + '_' + colIndex,
                                               commonPartFieldConfig: {
                                                   uxTextareaContextData: true,
                                                   defaultValueConfig: {
                                                       type: 'Boolean',
                                                       clazz: 'com.qpp.cgp.value.ConstantValue',
                                                       typeSetReadOnly: true,
                                                       clazzSetReadOnly: false
                                                   }
                                               },
                                           },*/
                                    {
                                        xtype: 'conditionfieldv3',
                                        name: 'conditionDTO',
                                        itemId: rawRowNumber + '_' + colIndex,
                                        allowBlank: true,
                                        flex: 1,
                                        contentData: contentData,
                                    },
                                    {
                                        xtype: 'sameupbtn',
                                    }
                                ]
                            }
                        }
                    }
                ],
            }
        ];
        me.callParent();
    },
})