/**
 * @author xiu
 * @date 2023/2/20
 */
Ext.Loader.syncRequire([
    'Ext.ux.form.GridFieldWithCRUDV2',
    'partner.productSupplier.view.MVTSelector'
])
Ext.define('partner.productSupplier.view.EditProductPMVTMapping', {
    extend: 'Ext.window.Window',
    alias: 'widget.edit_prodcuct_PMVT_mapping',
    width: 1000,
    height: 700,
    layout: 'fit',
    modal: true,
    isEdit: false,
    rowIndex: null,
    productId: null,
    parentGrid: null,
    parentStore: null,
    productConfigBomId: null,
    productConfigDesignId: null,
    version: 'v1',
    title: i18n.getKey('add') + '_' + i18n.getKey('定制面映射'),
    diyGetValue: function () {
        var result = {};
        var me = this;
        var items = me.items.items;
        items.forEach(item => {
            var name = item.name;
            !item.hidden && (result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue());
        });
        return result;
    },
    diySetValue: function (data) {
        var me = this;
        var items = me.items.items;
        items.forEach(item => {
            item.diySetValue ? item.diySetValue(data) : item.setValue(data)
        })
    },
    initComponent: function () {
        var me = this;
        var controller = Ext.create('partner.productSupplier.controller.Controller');
        var store = Ext.create('Ext.data.Store', {
            fields: ['sortOrder', 'operator', 'selector', 'fieldName', 'fieldValue', 'isAppend'],
            data: []
        });
        var allMVTData = controller.getMVTData(me.version, me.productId, me.productConfigDesignId);
        me.items = [
            {
                xtype: 'form',
                itemId: 'form',
                layout: 'vbox',
                defaults: {
                    xtype: 'textfield',
                    margin: '10 0 0 10',
                    labelWidth: 130,
                    width: 450,
                },
                diyGetValue: function () {
                    var result = {};
                    var me = this;
                    var items = me.items.items;
                    items.forEach(item => {
                        var name = item.name;
                        result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
                    })
                    return result;
                },
                diySetValue: function (data) {
                    var me = this;
                    var items = me.items.items;
                    items.forEach(item => {
                        var name = item.name;
                        if (item.itemId == 'mvtCode') {
                            item.diySetValue({
                                materialViewTypeCode: data.mvtCode,
                                productMaterialViewTypeId: data.pmvtId,
                                mvtType: data.mvtType
                            });
                        } else {
                            item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name])
                        }
                    })
                },
                items: [
                    {
                        fieldLabel: i18n.getKey('clazz'), //供应商属性
                        name: 'clazz',
                        getValue: function () {
                            return 'com.qpp.cgp.domain.partner.cooperation.manufacture.MaterialPathMapping'
                        },
                        hidden: true
                    },
                    {
                        fieldLabel: i18n.getKey('供应商定制面名称'), //供应商定制面名称
                        name: 'customKey',
                        allowBlank: false,
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('赋值策略'), //赋值策略
                        itemId: 'strategyType',
                        name: 'strategyType',
                        displayField: 'value',
                        valueField: 'name',
                        allowBlank: false,
                        editable: false,
                        value: 'DIRECTLY',
                        store: {
                            xtype: 'store',
                            fields: ['name', 'value'],
                            data: [
                                {
                                    name: 'DIRECTLY',
                                    value: '直接赋值'
                                },
                                {
                                    name: 'INDIRECT',
                                    value: 'pvmt映射赋值'
                                },
                            ]
                        },
                        listeners: {
                            change: function (comp, newValue, oldValue) {
                                var form = comp.ownerCt;
                                var mvtCode = form.getComponent('mvtCode');
                                var defaultPrint = form.getComponent('staticPreviewFile');
                                var defaultPrintv1 = form.getComponent('staticPreviewFilev1');
                                var virtualContainerPlaceholders = form.getComponent('virtualContainerPlaceholders');
                                [mvtCode, virtualContainerPlaceholders].forEach(item => {
                                    item.setVisible(newValue !== 'DIRECTLY');
                                    item.setDisabled(newValue === 'DIRECTLY');
                                });
                                newValue === 'DIRECTLY' && virtualContainerPlaceholders.setVisible(false);
                                defaultPrint.setVisible(newValue === 'DIRECTLY');
                                defaultPrint.setDisabled(newValue !== 'DIRECTLY');
                                defaultPrintv1.setVisible(newValue !== 'DIRECTLY');
                                defaultPrintv1.setDisabled(newValue === 'DIRECTLY');
                            }
                        }
                    },
                    {
                        xtype: 'mvt_selector',
                        name: 'mvtCode',
                        itemId: 'mvtCode',
                        fieldLabel: i18n.getKey('PMVT/MMVT'),
                        displayField: 'code',
                        valueField: me.version == 'v1' ? 'productMaterialViewTypeId' : 'code',
                        editable: false,
                        disabled: true,
                        hidden: true,
                        allowBlank: false,
                        version: me.version,
                        productId: me.productId,
                        allMVTData: allMVTData,
                        matchFieldWidth: false,
                        productConfigDesignId: me.productConfigDesignId,
                        tipInfo: '若产品未配置pmvt,请选择直接赋值策略',
                        gotoConfigHandler: null,
                        enableClazz: [
                            'com.qpp.cgp.domain.bom.ProductMaterialViewType',
                            'com.qpp.cgp.domain.bom.MaterialMvt'
                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                var me = this;
                                var data = me.getArrayValue();
                                var pmvtId = me.ownerCt.getComponent('pmvtId');
                                var mvtType = me.ownerCt.getComponent('mvtType');
                                var virtualContainerPlaceholders = me.ownerCt.getComponent('virtualContainerPlaceholders');
                                if (Ext.isEmpty(data)) {
                                    pmvtId.setValue();
                                    mvtType.setValue();
                                    virtualContainerPlaceholders.mvtData = null;
                                } else {
                                    virtualContainerPlaceholders.mvtData = Ext.clone(data);
                                    pmvtId.setValue(data.productMaterialViewTypeId);
                                    mvtType.setValue(data.clazz == 'com.qpp.cgp.domain.bom.ProductMaterialViewType' ? 'PMVT' : 'MMVT');
                                }
                            }
                        }
                    },
                    {
                        xtype: "hiddenfield",
                        name: 'pmvtId',
                        itemId: 'pmvtId',
                        diyGetValue: function () {
                            var data = this.getValue();
                            if (data) {
                                return data;
                            } else {
                                return null;
                            }
                        }
                    },
                    {
                        xtype: 'hiddenfield',
                        name: "mvtType",
                        itemId: 'mvtType',
                        diyGetValue: function () {
                            var data = this.getValue();
                            if (data) {
                                return data;
                            } else {
                                return null;
                            }
                        }
                    },
                    {
                        xtype: 'combo',
                        editable: false,
                        allowBlank: false,
                        name: 'format',
                        displayField: 'name',
                        valueField: 'value',
                        value: 'IMAGE',
                        fieldLabel: i18n.getKey('格式化类型'),
                        store: {
                            xtype: 'store',
                            fields: ['name', 'value'],
                            data: [
                                {
                                    name: 'image',
                                    value: 'IMAGE'
                                },
                            ]
                        },
                    },
                    {
                        xtype: 'fileuploadv2',
                        width: 400,
                        hiddenDown: true,
                        hideTrigger: true,
                        isFormField: true,
                        isShowImage: true,
                        editable: false,
                        filePathCfg: {
                            hidden: true
                        },
                        margin: '10 0 10 10',
                        imageSize: 100,
                        valueUrlType: 'part',
                        allowFileType: ['image/*'],
                        msgTarget: 'none',
                        fieldLabel: i18n.getKey('预览图'),
                        UpFieldLabel: i18n.getKey('image'),
                        name: 'defaultPreview',
                        itemId: 'staticPreviewFilev2',
                    },
                    {
                        xtype: 'fileuploadv2',
                        width: 400,
                        msgTarget: 'side',
                        hiddenDown: true,
                        hideTrigger: true,
                        isFormField: true,
                        allowBlank: false,
                        isShowImage: true,
                        editable: false,
                        filePathCfg: {
                            hidden: true,
                        },
                        imageSize: 100,
                        valueUrlType: 'part',
                        allowFileType: ['image/*'],
                        fieldLabel: i18n.getKey('定制图'),
                        UpFieldLabel: i18n.getKey('image'),
                        name: 'defaultPrint',
                        itemId: 'staticPreviewFile',
                    },
                    {
                        xtype: 'fileuploadv2',
                        width: 400,
                        hidden: true,
                        msgTarget: 'side',
                        hiddenDown: true,
                        hideTrigger: true,
                        isFormField: true,
                        allowBlank: true,
                        isShowImage: true,
                        editable: false,
                        filePathCfg: {
                            hidden: true,
                        },
                        imageSize: 100,
                        valueUrlType: 'part',
                        allowFileType: ['image/*'],
                        fieldLabel: i18n.getKey('定制图'),
                        UpFieldLabel: i18n.getKey('image'),
                        name: 'defaultPrint',
                        itemId: 'staticPreviewFilev1',
                    },
                    {
                        xtype: 'fileuploadv2',
                        width: 400,
                        diyGetValue: function () {
                            var me = this;
                            var form = me.ownerCt;
                            var strategyType = form.getComponent('strategyType');
                            var staticPreviewFile = form.getComponent('staticPreviewFile');
                            var staticPreviewFilev1 = form.getComponent('staticPreviewFilev1');
                            var type = strategyType.getValue();
                            return type === 'DIRECTLY' ? staticPreviewFile.getValue() : staticPreviewFilev1.getValue();
                        },
                        msgTarget: 'side',
                        hiddenDown: true,
                        hideTrigger: true,
                        isFormField: true,
                        allowBlank: true,
                        isShowImage: true,
                        editable: false,
                        hidden: true,
                        filePathCfg: {
                            hidden: true,
                        },
                        imageSize: 100,
                        valueUrlType: 'part',
                        allowFileType: ['image/*'],
                        fieldLabel: i18n.getKey('定制图'),
                        UpFieldLabel: i18n.getKey('image'),
                        name: 'defaultPrint',
                        itemId: 'staticPreviewFilev3',
                    },
                    {
                        margin: '0 0 10 10',
                        xtype: 'gridfieldwithcrudv2',
                        name: 'jsonFilters',
                        itemId: 'virtualContainerPlaceholders',
                        fieldLabel: i18n.getKey('PC数据过滤'),
                        minHeight: 200,
                        maxHeight: 400,
                        width: 900,
                        hidden: true,
                        autoScroll: true,
                        mvtData: null,//记录当前选中的mvt数据
                        gridConfig: {
                            store: store,
                            columns: [
                                {
                                    dataIndex: 'selector',
                                    width: 150,
                                    text: i18n.getKey('选择器'),
                                },
                                {
                                    dataIndex: 'operator',
                                    width: 120,
                                    text: i18n.getKey('操作'),
                                    renderer: function (value) {
                                        var selector = {
                                            D: 'D(删除)',
                                            U: 'U(修改或者创建)',
                                            UM: 'UM(修改)',
                                            C: 'C(创建)',
                                        };
                                        return selector[value];
                                    }
                                },
                                {
                                    dataIndex: 'sortOrder',
                                    width: 80,
                                    text: i18n.getKey('排序次序'),
                                },
                                {
                                    dataIndex: 'fieldName',
                                    width: 120,
                                    text: i18n.getKey('属性名称'),
                                },
                                {
                                    dataIndex: 'fieldValue',
                                    flex: 1,
                                    text: i18n.getKey('属性值'),
                                },
                            ],
                        },
                        winConfig: {
                            winTitle: i18n.getKey('placeHolder'),
                            formConfig: {
                                items: [
                                    {
                                        name: 'sortOrder',
                                        itemId: 'sortOrder',
                                        allowBlank: false,
                                        xtype: 'numberfield',
                                        minValue: 0,
                                        value: 0,
                                        fieldLabel: i18n.getKey('sortOrder')
                                    },
                                    {
                                        name: 'operator',
                                        itemId: 'operator',
                                        allowBlank: false,
                                        xtype: 'combo',
                                        editable: false,
                                        store: Ext.create('Ext.data.Store', {
                                            fields: ['value', 'display'],
                                            data: [{
                                                value: 'D',
                                                display: 'D(删除)'
                                            }, {
                                                value: 'U',
                                                display: 'U(修改或者创建)'
                                            }, {
                                                value: 'UM',
                                                display: 'UM(修改)'
                                            }, {
                                                value: 'C',
                                                display: 'C(创建)'
                                            }]
                                        }),
                                        displayField: 'display',
                                        value: 'D',
                                        valueField: 'value',
                                        fieldLabel: i18n.getKey('operator'),
                                        listeners: {
                                            change: function (combo, newValue, oldValue) {
                                                var form = combo.ownerCt;
                                                var isAppend = form.getComponent('isAppend');
                                                var fieldValue = form.getComponent('fieldValue');
                                                var fieldName = form.getComponent('fieldName');
                                                fieldName.show();
                                                fieldName.setDisabled(false);
                                                if (newValue == 'U') {
                                                    isAppend.setValue(true);
                                                } else {
                                                    isAppend.setValue(false);
                                                }
                                                if (newValue == 'D') {
                                                    fieldValue.hide();
                                                    fieldValue.setDisabled(true);
                                                    fieldName.hide();
                                                    fieldName.setDisabled(true);
                                                } else {
                                                    fieldValue.show();
                                                    fieldValue.setDisabled(false);
                                                    if (newValue == 'U') {

                                                    } else if (newValue == 'UM') {
                                                    } else if (newValue == 'C') {

                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'jsonpathselector',
                                        name: 'selector',
                                        itemId: 'selector',
                                        editable: false,
                                        fieldLabel: i18n.getKey('selector'),
                                        listeners: {
                                            afterrender: function (comp) {
                                                var me = this;
                                                var data = me.ownerCt.ownerCt.gridField.mvtData;
                                                var jsonPath = this.getComponent('jsonPath');
                                                var queryData = {};
                                                var pmvtId = data._id;
                                                var url = adminPath + 'api/pagecontentpreprocess/' + pmvtId + '/pageContentSchema';
                                                jsonPath.setHeight(60);
                                                JSSetLoading(true);
                                                JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
                                                    JSSetLoading(false);
                                                    if (success) {
                                                        var responseText = Ext.JSON.decode(response.responseText);
                                                        if (responseText.success) {
                                                            queryData = responseText.data;
                                                        }
                                                    }
                                                })
                                                var treeData = JSJsonToTree(queryData);//转换成tree的源数据
                                                this.store = Ext.create('Ext.data.TreeStore', {
                                                    autoLoad: true,
                                                    fields: [
                                                        'text', 'value'
                                                    ],
                                                    proxy: {
                                                        type: 'memory'
                                                    },
                                                    root: treeData
                                                });
                                            }
                                        }
                                    },
                                    {
                                        name: 'fieldName',
                                        itemId: 'fieldName',
                                        allowBlank: true,
                                        hidden: true,
                                        disabled: true,
                                        xtype: 'textfield',
                                        fieldLabel: i18n.getKey('attributeName')
                                    },
                                    {
                                        name: 'fieldValue',
                                        itemId: 'fieldValue',
                                        allowBlank: false,
                                        xtype: 'textarea',
                                        hidden: true,
                                        disabled: true,
                                        fieldLabel: i18n.getKey('attributeValue')
                                    },
                                    {
                                        name: 'isAppend',
                                        itemId: 'isAppend',
                                        allowBlank: false,
                                        xtype: 'combo',
                                        hidden: true,
                                        disabled: true,
                                        editable: false,
                                        value: false,
                                        store: Ext.create('Ext.data.Store', {
                                            fields: ['value', 'display'],
                                            data: [{
                                                value: true,
                                                display: 'true'
                                            }, {
                                                value: 'false',
                                                display: 'false'
                                            }]
                                        }),
                                        displayField: 'display',
                                        valueField: 'value',
                                        fieldLabel: i18n.getKey('isAppend')
                                    }
                                ],
                                listeners: {
                                    afterrender: function () {
                                        var me = this;
                                        if (Ext.isEmpty(me.ownerCt.record)) {
                                            var sortOrder = 0;
                                            me.ownerCt.outGrid.store.data.items.forEach(function (item) {
                                                if (item.raw.sortOrder >= sortOrder) {
                                                    sortOrder = item.raw.sortOrder + 1;
                                                }
                                            });
                                            me.setValue({
                                                sortOrder: sortOrder,
                                                operator: 'D'
                                            });
                                        }
                                    }
                                }
                            }
                        },
                    },
                ],
                bbar: ['->',
                    {
                        xtype: 'button',
                        iconCls: "icon_save",
                        text: i18n.getKey('confirm'),
                        handler: function (btn) {
                            var form = btn.ownerCt.ownerCt;
                            var win = form.ownerCt;
                            var formValue = form.diyGetValue();
                            var storeData = me.parentStore.getProxy().data;
                            if (form.isValid()) {
                                me.isEdit ? storeData.splice(me.rowIndex, 1, formValue) : storeData.push(formValue);
                                !me.isEdit && me.parentGrid.setBodyStyle('borderColor', 'silver');
                                me.parentStore.load();
                                win.close();
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        iconCls: "icon_cancel",
                        text: i18n.getKey('cancel'),
                        handler: function (btn) {
                            var win = btn.ownerCt.ownerCt.ownerCt;
                            win.close();
                        }
                    },
                ]
            }
        ];
        me.callParent();
    }
})
