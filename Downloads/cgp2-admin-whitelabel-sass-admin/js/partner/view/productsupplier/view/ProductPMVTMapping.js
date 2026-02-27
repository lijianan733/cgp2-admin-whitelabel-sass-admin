/**
 * @author xiu
 * @date 2023/2/20
 */
Ext.Loader.syncRequire([
    'partner.productSupplier.view.EditProductPMVTMapping',
])
Ext.define('partner.productSupplier.view.ProductPMVTMapping', {
    extend: 'Ext.container.Container',
    alias: 'widget.product_PMVT_mapping',
    attributeVersionId: '',
    version: 'v1',
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
            item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name])
        })
    },
    initComponent: function () {
        var me = this;
        var store = Ext.create('Ext.data.Store', {
            fields: [{
                name: 'clazz',
                type: 'string',
                defaultValue: 'com.qpp.cgp.domain.partner.cooperation.manufacture.MaterialPathMapping'
            }, 'customKey', {
                name: 'jsonFilters',
                type: 'array'
            }, 'pmvtId', {
                name: 'productMaterialViewType',
                type: 'object'
            }, 'strategyType', 'format', 'defaultPreview', 'defaultPrint', {
                name: 'customKey',
                type: 'string',
            }],
            data: []
        });
        var productBomStore = Ext.create('CGP.product.view.productconfig.productbomconfig.store.ProductBomConfigStore', {
            proxy: {
                type: 'uxrest',
                url: adminPath + 'api/productConfigBoms/productId',
                reader: {
                    type: 'json',
                    root: 'data.content'
                },
            },
            autoLoad: false,
        });
        me.items = [
            {
                xtype: 'optionalconfigcontainerv3',
                allowBlank: false,
                title: me.title,
                name: me.version == 'v1' ? 'pmvtMapping' : 'pmvtMappingV2',
                itemId: 'pmvtMapping',
                width: '100%',
                status: 'FINISHED',
                titleFn: Ext.emptyFn,
                diyGetValue: function () {
                    var me = this;
                    var result = {};
                    var container = me.getComponent('container');
                    var items = container.items.items;
                    items.forEach(item => {
                        var name = item.name;
                        result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue()
                    })
                    return result;
                },
                diySetValue: function (data) {
                    var me = this;
                    var container = me.getComponent('container');
                    var items = container.items.items;
                    items.forEach(item => {
                        var name = item.name;
                        item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name])
                    })
                },
                isValid: function () {
                    var me = this;
                    var isValid = true;
                    var container = me.getComponent('container');
                    var items = container.items.items;
                    items.forEach(item => isValid = item.isValid && item.isValid());
                    return isValid;
                },
                containerConfig: {
                    defaults: {
                        width: 500,
                        margin: '0 0 0 10',
                        allowBlank: true,
                    },
                },
                toolbarItems: [
                    {
                        xtype: 'button',
                        iconCls: 'icon_add',
                        text: i18n.getKey('添加定制面映射'),
                        handler: function (btn) {
                            var container = me.ownerCt.getComponent('container');
                            var pmvtMapping = me.getComponent('pmvtMapping');
                            var containerItem = pmvtMapping.getComponent('container');
                            var productConfigBomValue = null;
                            var productConfigDesignValue = null;
                            //如果是V2则必须有bom和design的配置值
                            if (me.version == 'v2') {
                                var productConfigBom = containerItem.getComponent('productConfigBom');
                                var productConfigDesign = containerItem.getComponent('productConfigDesign');
                                if (productConfigBom.isValid() && productConfigDesign.isValid()) {
                                    productConfigBomValue = productConfigBom.getArrayValue()?.id;
                                    productConfigDesignValue = productConfigDesign.getArrayValue()?.id;
                                } else {
                                    Ext.Msg.alert('提示', '请先确定产品Bom配置和Design配置');
                                    return;
                                }
                            }
                            var productScope = container.getComponent('productScope');
                            var productId = productScope.getValue();
                            var materialPathMapping = containerItem.getComponent('materialPathMapping');
                            Ext.create('partner.productSupplier.view.EditProductPMVTMapping', {
                                isEdit: false,
                                parentStore: store,
                                productId: productId,
                                productConfigBomId: productConfigBomValue,
                                productConfigDesignId: productConfigDesignValue,
                                attributeVersionId: me.attributeVersionId,
                                parentGrid: materialPathMapping,
                                version: me.version,
                                title: i18n.getKey('添加定制面映射'),
                            }).show();
                        }
                    },

                ],
                containerItems: [
                    {
                        xtype: 'textfield',
                        name: 'customKey',
                        hidden: true,
                    },
                    {
                        xtype: 'textfield',
                        name: 'clazz',
                        hidden: true,
                        diyGetValue: function (clazz) {
                            return 'com.qpp.cgp.domain.partner.cooperation.manufacture.SimplePMVTMapping'
                        },
                        value: 'com.qpp.cgp.domain.partner.cooperation.manufacture.SimplePMVTMapping',
                    },
                    {
                        xtype: 'gridcombo',
                        itemId: 'productConfigBom',
                        name: 'productConfigBom',
                        allowBlank: false,
                        margin: '5 25',
                        fieldLabel: i18n.getKey('Bom配置'),
                        displayField: 'id',
                        valueField: 'id',
                        store: productBomStore,
                        editable: false,
                        matchFieldWidth: false,
                        hidden: me.version == 'v1',
                        disabled: me.version == 'v1',
                        valueType: 'idReference',//recordData,idReference,id为可选的值类型
                        filterCfg: {
                            minHeight: 80,
                            layout: {
                                type: 'column',
                                columns: 2
                            },
                            items: [
                                {
                                    name: '_id',
                                    xtype: 'numberfield',
                                    hideTrigger: true,
                                    fieldLabel: i18n.getKey('id'),
                                    itemId: 'id'
                                },
                                {
                                    name: 'pageType',
                                    xtype: 'textfield',
                                    hideTrigger: true,
                                    fieldLabel: i18n.getKey('pageType'),
                                    itemId: 'pageType'
                                },
                                {
                                    name: 'productId',
                                    xtype: 'hiddenfield',
                                    fieldLabel: i18n.getKey('productId'),
                                    itemId: 'productId',
                                    isLike: false,
                                    value: me.productId

                                },
                                {
                                    xtype: 'hiddenfield',
                                    name: 'versionedAttribute._id',
                                    fieldLabel: i18n.getKey('属性版本编号'),
                                    itemId: 'versionedAttribute._id',
                                    isLike: false,
                                    value: me.attributeVersionId
                                }
                            ]
                        },
                        gridCfg: {
                            store: productBomStore,
                            height: 350,
                            width: 800,
                            columns: [
                                {
                                    text: i18n.getKey('id'),
                                    dataIndex: 'id',
                                    itemId: 'id',
                                    sortable: true,
                                    width: 100
                                },
                                {
                                    text: i18n.getKey('status'),
                                    dataIndex: 'status',
                                    itemId: 'status',
                                    renderer: function (value, metaData, record) {
                                        var status = {'0': '删除', '1': '草稿', '2': '测试', '3': '上线'};
                                        return status[value];
                                    }
                                },
                                {
                                    text: i18n.getKey('type'),
                                    dataIndex: 'type',
                                    itemId: 'type'
                                },
                                {
                                    text: i18n.getKey('configVersion'),
                                    dataIndex: 'configVersion',
                                    itemId: 'configVersion',
                                    renderer: function (value) {
                                        return '<font color="green">' + value + '</font>'
                                    }
                                }, {
                                    text: i18n.getKey('属性版本Id'),
                                    dataIndex: 'versionedProductAttributeId',
                                    flex: 1,
                                    itemId: 'versionedProductAttributeId'
                                },
                            ],
                            bbar: {
                                xtype: 'pagingtoolbar',
                                store: productBomStore,
                            }
                        },
                        listeners: {
                            expand: function () {
                                var me = this;
                                me.store.load();
                            },
                            change: function (field, newValue, oldValue) {
                                var value = field.getArrayValue();
                                var designConfigId = field.ownerCt.getComponent('productConfigDesign');
                                if (value) {
                                    designConfigId.setDisabled(false);
                                    designConfigId.show();
                                    var designUrl = adminPath + 'api/productConfigDesigns/bomConfigIds' + `?bomConfigIds=${value.id}`;
                                    JSAjaxRequest(designUrl, 'GET', true, false, false, function (require, success, response) {
                                        if (success) {
                                            var responseText = Ext.JSON.decode(response.responseText);
                                            if (responseText) {
                                                designConfigId.store.proxy.data = responseText.data;
                                                designConfigId.store.load();
                                            }
                                        }
                                    });
                                } else {
                                    designConfigId.setDisabled(true);
                                    designConfigId.hide();
                                    designConfigId.setValue();
                                }
                            }
                        },
                        diyGetValue: function () {
                            return this.getArrayValue();
                        }
                    },
                    {
                        xtype: 'gridcombo',
                        itemId: 'productConfigDesign',
                        name: 'productConfigDesign',
                        allowBlank: false,
                        fieldLabel: i18n.getKey('designConfigId'),
                        displayField: 'id',
                        valueField: 'id',
                        editable: false,
                        disabled: true,
                        margin: '5 25',
                        hidden: true,
                        store: {
                            xtype: 'store',
                            proxy: {
                                type: 'memory'
                            },
                            data: [],
                            fields: [
                                'id', 'status', 'configVersion', 'mappingVersion', 'description', 'bomVersions'
                            ]
                        },
                        matchFieldWidth: false,
                        gridCfg: {
                            height: 350,
                            width: 800,
                            columns: [
                                {
                                    text: i18n.getKey('id'),
                                    dataIndex: 'id',
                                    width: 100
                                },
                                {
                                    text: i18n.getKey('status'),
                                    dataIndex: 'status',
                                    renderer: function (value, metaData, record) {
                                        var status = {'0': '删除', '1': '草稿', '2': '测试', '3': '上线'};
                                        return status[value];
                                    }
                                },
                                {
                                    text: i18n.getKey('configVersion'),
                                    dataIndex: 'configVersion',
                                    renderer: function (value) {
                                        return '<font color="green">' + value + '</font>'
                                    }
                                },
                                {
                                    text: i18n.getKey('material') + i18n.getKey('mappingVersion'),
                                    dataIndex: 'mappingVersion',
                                    width: 200,
                                },
                                {
                                    text: i18n.getKey('description'),
                                    width: 200,
                                    dataIndex: 'description',
                                },
                            ],
                        },
                        valueType: 'idReference',//recordData,idReference,id为可选的值类型,
                        diyGetValue: function () {
                            return this.getArrayValue();
                        }
                    },
                    {
                        xtype: 'grid',
                        name: 'materialPathMapping',
                        itemId: 'materialPathMapping',
                        store: store,
                        width: 1000,
                        maxHeight: 450,
                        allowScroll: true,
                        isValid: function () {
                            var me = this;
                            var isValid = true;
                            var data = me.store.getProxy().data;
                            if (!data.length > 0) {
                                isValid = false;
                                me.setBodyStyle('borderColor', '#cf4c35');
                            }
                            return isValid;
                        },
                        diyGetValue: function () {
                            var me = this;
                            return me.store.getProxy().data;
                        },
                        diySetValue: function (data) {
                            var me = this;
                            console.log(data)
                            me.store.getProxy().data = data || [];
                            me.store.load();
                        },
                        columns: [
                            {
                                xtype: 'actioncolumn',
                                width: 50,
                                items: [
                                    {
                                        iconCls: 'icon_edit icon_margin',  // Use a URL in the icon config
                                        tooltip: 'Edit',
                                        handler: function (gridView, rowIndex, colIndex, a, b, record) {
                                            var gridOwnerCt = gridView.ownerCt.ownerCt;
                                            var storeData = store.getProxy().data;
                                            var container = me.ownerCt.getComponent('container');
                                            var productScope = container.getComponent('productScope');
                                            var productId = productScope.getValue();
                                            var productConfigBom = gridOwnerCt.getComponent('productConfigBom');
                                            var productConfigDesign = gridOwnerCt.getComponent('productConfigDesign');
                                            var productConfigBomValue = productConfigBom.getArrayValue();
                                            var productConfigDesignValue = productConfigDesign.getArrayValue();
                                            var win = Ext.create('partner.productSupplier.view.EditProductPMVTMapping', {
                                                title: i18n.getKey('edit') + '_' + i18n.getKey('定制面映射'),
                                                parentStore: store,
                                                productId: productId,
                                                isEdit: true,
                                                productConfigBomId: productConfigBomValue?.id,
                                                productConfigDesignId: productConfigDesignValue?.id,
                                                attributeVersionId: me.attributeVersionId,
                                                version: me.version,
                                                rowIndex: rowIndex
                                            }).show();
                                            win.diySetValue(storeData[rowIndex]);
                                        }
                                    },
                                    {
                                        iconCls: 'icon_remove icon_margin',
                                        tooltip: 'Delete',
                                        handler: function (view, rowIndex, colIndex, a, b, record) {
                                            Ext.Msg.confirm('提示', '确定删除？', callback);

                                            function callback(id) {
                                                if (id === 'yes') {
                                                    store.proxy.data.splice(rowIndex, 1);
                                                    store.load();
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                flex: 1,
                                dataIndex: 'customKey',
                                text: i18n.getKey('供应商定制面名称'),
                            },
                            {
                                flex: 1,
                                dataIndex: 'strategyType',
                                text: i18n.getKey('映射策略'),
                                renderer: function (value) {
                                    var group = {
                                        DIRECTLY: '直接赋值',
                                        INDIRECT: 'pvmt映射赋值'
                                    }
                                    return group[value];
                                }
                            },
                            {
                                flex: 1,
                                dataIndex: 'format',
                                text: i18n.getKey('格式化类型'),
                                renderer: function (value) {
                                    return value === 'IMAGE' ? 'image' : value
                                }
                            },
                            {
                                xtype: 'imagecolumn',
                                tdCls: 'vertical-middle',
                                width: 150,
                                dataIndex: 'defaultPreview',
                                text: i18n.getKey('预览图'),
                                buildUrl: function (value, metadata, record) {
                                    return imageServer + value;
                                },
                                buildPreUrl: function (value, metadata, record) {
                                    return imageServer + value;
                                },
                                buildTitle: function (value, metadata, record) {
                                    return i18n.getKey('check') + '_' + i18n.getKey('预览图');
                                },
                            },
                            {
                                xtype: 'imagecolumn',
                                tdCls: 'vertical-middle',
                                width: 150,
                                dataIndex: 'defaultPrint',
                                text: i18n.getKey('定制图'),
                                buildUrl: function (value, metadata, record) {
                                    return imageServer + value;
                                },
                                buildPreUrl: function (value, metadata, record) {
                                    return imageServer + value;
                                },
                                buildTitle: function (value, metadata, record) {
                                    return i18n.getKey('check') + '_' + i18n.getKey('定制图');
                                },
                            },
                        ]
                    }
                ]
            }
        ];
        me.callParent();
    }
})