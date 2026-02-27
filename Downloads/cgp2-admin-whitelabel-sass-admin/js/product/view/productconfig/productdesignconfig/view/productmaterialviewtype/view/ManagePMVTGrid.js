/**
 * Created by nan on 2021/4/26
 * 管理pmvt的表格
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.ManagePMVTGrid', {
    extend: 'CGP.common.commoncomp.QueryGrid',
    itemId: 'pmvtGrid',
    schemaVersion: null,
    productMaterialViewTypeId: null,
    productConfigDesignId: null,
    productId: null,
    createHandler: null,
    batchHandler: null,
    editActionHandler: null,
    deleteActionHandler: null,
    materialPath: null,//bom结构下使用该属性
    topTab: null,//bom结构下使用该属性
    initComponent: function () {
        var me = this;
        var store = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.store.ProductMaterialViewTypeVersionFiveStore');
        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.controller.Controller');
        var designController = Ext.create('CGP.product.view.productconfig.productdesignconfig.controller.Controller');
        me.title = 'pmvt';
        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
        me.gridCfg = {
            listeners: {
                'viewready': function (view, e) {
                    var toolbar = view.down();
                    //现在v5的其他类型materialSelector类型未使用过，故结构跟v4是一样的
                    var productBomConfigModelrecord = CGP.product.view.productconfig.productbomconfig.model.ProductBomConfigModel.load(me.productBomConfigId, {
                        scope: this,
                        success: function (record, operation) {
                            me.schemaVersion = record.get('schemaVersion');
                            var tipString = '<font color=red>当前的bom结构版本为' + me.schemaVersion + '</font>';
                            var DisplayView = Ext.widget('displayfield', {
                                value: tipString
                            });
                            toolbar.add(DisplayView)
                            var columns = view.columnManager.headerCt.items.items;
                            console.log(view.columnManager.headerCt);
                            if (me.schemaVersion == '5') {
                                for (var i = 0; i < columns.length; i++) {
                                    var item = columns[i];
                                    if (item.itemId == 'materialPath') {
                                        item.hide();

                                    }
                                    if (item.itemId == 'MaterialSelector') {
                                        item.show();
                                    }
                                }

                            } else {
                                for (var i = 0; i < columns.length; i++) {
                                    var item = columns[i];
                                    if (item.itemId == 'materialPath') {
                                        item.show();
                                    }
                                    if (item.itemId == 'MaterialSelector') {
                                        item.hide();
                                    }
                                }
                            }

                        }
                    });
                }
            },
            editAction: false,
            deleteAction: false,
            selType: 'rowmodel',
            store: store,
            tbar: [
                {
                    xtype: 'button',
                    iconCls: 'icon_create',
                    text: i18n.getKey('create'),
                    handler: me.createHandler || function (btn) {
                        controller.addProductMaterialViewTypeWin(null, me.productConfigDesignId, me.productBomConfigId, me.schemaVersion, me.productId);

                    }
                },
                {
                    xtype: 'button',
                    iconCls: 'icon_create',
                    text: i18n.getKey('batch') + i18n.getKey('create'),
                    handler: me.batchHandler || function (btn) {
                        var win = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.BatchCreatePMVTWindow', {
                            configType: 'PMVT',
                            productConfigDesignId: me.productConfigDesignId,
                            productBomConfigId: me.productBomConfigId,
                            productId: me.productId,
                            materialPath: me.materialPath,
                            bomConfigVersion: me.schemaVersion

                        })
                        win.show();
                    }
                }
            ],
            multiSelect: true,
            defaults: {
                width: 200
            },
            columns: [
                {
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    sortable: false,
                    resizable: false,
                    tdCls: 'vertical-middle',
                    width: 70,
                    menuDisabled: true,
                    items: [
                        {
                            iconCls: 'icon_edit icon_margin',
                            itemId: 'actionedit',
                            tooltip: i18n.getKey('edit') + i18n.getKey('productMaterialViewType'),
                            handler: me.editActionHandler || function (view, rowIndex, colIndex, a, b, record) {
                                controller.addProductMaterialViewTypeWin(record, me.productConfigDesignId, me.productBomConfigId, me.schemaVersion, me.productId);
                            }
                        },
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actionedit',
                            tooltip: i18n.getKey('delete') + i18n.getKey('productMaterialViewType'),
                            handler: me.deleteActionHandler || function (view, rowIndex, colIndex, a, b, record) {
                                controller.deleteProductMaterialViewType(record.getId(), store);
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('operation'),
                    sortable: false,
                    width: 105,
                    tdCls: 'vertical-middle',
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        return {
                            xtype: 'toolbar',
                            layout: 'column',
                            style: 'padding:0',
                            items: [
                                {
                                    text: i18n.getKey('options'),
                                    width: '100%',
                                    flex: 1,
                                    menu: {
                                        xtype: 'menu',
                                        items: [
                                            {
                                                text: i18n.getKey('manager') + i18n.getKey('template') + i18n.getKey('config'),
                                                handler: function () {
                                                    builderConfigTab.managerProductMaterialViewTypeTemplateConfig(record.getId(), 'pmvt', me.productConfigDesignId);
                                                }
                                            },
                                            {
                                                text: i18n.getKey('pcs') + i18n.getKey('preprocess'),
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    var mask = me.setLoading();
                                                    designController.judgeHavePcsConfig(me.productConfigDesignId, record.getId(), builderConfigTab, mask)
                                                }
                                            },
                                            {
                                                text: i18n.getKey('delete') + i18n.getKey('pcs') + i18n.getKey('preprocess'),
                                                handler: function () {
                                                    var pcsConfig = designController.getPcsConfig(me.productConfigDesignId, record.getId());
                                                    if (pcsConfig) {
                                                        designController.deletePcsConfig(pcsConfig._id);
                                                    } else {
                                                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('当前该配置无关联的PCS预处理'));
                                                    }
                                                }
                                            },
                                            {
                                                text: i18n.getKey('PC预设'),

                                                menu: {
                                                    items: [
                                                        {
                                                            text: i18n.getKey('PCPreSetTheme'),
                                                            handler: function () {
                                                                var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');//最外面的tabs
                                                                builderConfigTab.addNewTab({
                                                                    id: 'PCPreSetTheme',
                                                                    url: path + 'partials/product/productconfig/productdesignconfig/productmaterialviewtype/pcpretheme/main.html' +
                                                                        '?mvtId=' + record.getId() +
                                                                        '&mvtType=com.qpp.cgp.domain.bom.ProductMaterialViewType',
                                                                    title: i18n.getKey('manager') + '_' + i18n.getKey('PCPreSetTheme'),
                                                                    refresh: true
                                                                });

                                                            }
                                                        },
                                                        {
                                                            text: i18n.getKey('PCPreSet'),
                                                            handler: function () {
                                                                var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');//最外面的tabs
                                                                builderConfigTab.addNewTab({
                                                                    id: 'PCPreSet',
                                                                    url: path + 'partials/product/productconfig/productdesignconfig/productmaterialviewtype/pcpreset/main.html' +
                                                                        '?mvtId=' + record.getId() +
                                                                        '&mvtType=com.qpp.cgp.domain.bom.ProductMaterialViewType',
                                                                    title: i18n.getKey('manager') + '_' + i18n.getKey('PCPreSet'),
                                                                    refresh: true
                                                                });

                                                            }
                                                        },
                                                    ]
                                                }
                                            },
                                            {
                                                text: i18n.getKey('pcResourceLibrary'),
                                                handler: function () {
                                                    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');//最外面的tabs
                                                    builderConfigTab.addNewTab({
                                                        id: 'MVTPCResourceLibrary',
                                                        url: path + 'partials/product/productconfig/productdesignconfig/productmaterialviewtype/pcresource/main.html' +
                                                            '?MVTId=' + record.getId() +
                                                            '&clazz=com.qpp.cgp.domain.bom.ProductMaterialViewType',
                                                        title: i18n.getKey('pcResourceLibrary'),
                                                        refresh: true
                                                    });
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        };
                    }
                },
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
                    tdCls: 'vertical-middle',
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    dataIndex: 'materialSelector',
                    text: i18n.getKey('materialSelector'),
                    itemId: 'MaterialSelector',
                    width: 350,
                    xtype: 'componentcolumn',
                    tdCls: 'vertical-middle',
                    renderer: function (value, metadata) {
                        if (Ext.isEmpty(value) || Ext.isEmpty(value.clazz)) {
                            return null;
                        }
                        var returnStr = null
                        switch (value.clazz) {
                            case 'com.qpp.cgp.domain.bom.material.IdPathSelector': {
                                returnStr = 'idPath: ' + value.idPath;
                                return returnStr;
                            }
                            case 'com.qpp.cgp.domain.bom.material.MaterialIdSelector': {
                                returnStr = 'materialId: ' + value.materialId;
                                return returnStr;
                            }
                            case 'com.qpp.cgp.domain.bom.material.JsonPathSelector': {
                                returnStr = 'jsonPath: ' + value.jsonPath;
                                return returnStr;
                            }
                            case 'com.qpp.cgp.domain.bom.material.ExpressionSelector': {
                                var id = JSGetUUID();
                                var expression = value.expression;
                                return {
                                    //displayfield无click事件，故无法直接添加监听
                                    xtype: 'displayfield',
                                    value: '<a href="#" id=' + id + '>' + '查看表达式' + '</a>',
                                    listeners: {
                                        render: function (display) {
                                            var clickElement = document.getElementById(id);
                                            if (!Ext.isEmpty(clickElement)) {
                                                clickElement.addEventListener('click', function () {
                                                    controller.showExpression(expression);
                                                }, false);
                                            }
                                        }
                                    }
                                };
                            }
                        }
                    }
                },
                {
                    dataIndex: 'materialViewType',
                    text: i18n.getKey('materialViewType'),
                    flex: 1,
                    minWidth: 200,
                    tdCls: 'vertical-middle',
                    xtype: 'componentcolumn',
                    itemId: 'materialViewType',
                    renderer: function (value, metadata) {
                        var name = '';
                        if (!Ext.isEmpty(value['name'])) {
                            name = value['name'];
                        }
                        var description = '';
                        if (!Ext.isEmpty(value['description'])) {
                            description = value['description'];
                        }
                        var result = i18n.getKey('id') + '：' + '(' + value['_id'] + ')' + '<br>' + i18n.getKey('name') + '：' + name + '<br>'
                            + i18n.getKey('description') + '：' + description;
                        metadata.tdAttr = 'data-qtip="' + result + '"';
                        return {
                            xtype: 'displayfield',
                            value: i18n.getKey('id') + '：' + '<a href="#" id="click-materialViewType">' + '(' + value['_id'] + ')' + '</a>' + '<br>' + i18n.getKey('name') + '：' + name + '<br>'
                                + i18n.getKey('description') + '：' + description,
                            listeners: {
                                render: function (display) {
                                    var clickElement = document.getElementById('click-materialViewType');
                                    clickElement.addEventListener('click', function () {
                                        JSOpen({
                                            id: 'materialviewtypepage',
                                            url: path + 'partials/materialviewtype/main.html?materialViewTypeId=' + value['_id'],
                                            title: i18n.getKey('materialViewType'),
                                            refresh: true
                                        })
                                    }, false);

                                }
                            }
                        }
                    }
                }
            ]
        };
        me.filterCfg = {
            height: 150,
            defaults: {
                width: 280
            },
            items: [
                {
                    name: '_id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id',
                    value: me._id || null,
                    isLike: false
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    name: 'productMaterialViewTypeId',
                    xtype: 'textfield',
                    value: me.productMaterialViewTypeId || null,
                    fieldLabel: i18n.getKey('productMaterialViewTypeId'),
                    itemId: 'productMaterialViewTypeId'
                },
                {
                    name: 'materialPath',
                    xtype: 'textfield',
                    hidden: true,
                    isLike: false,
                    itemId: 'materialPath'
                },
                {
                    name: 'productConfigDesignId',
                    xtype: 'numberfield',
                    hidden: true,
                    value: me.productConfigDesignId,
                    fieldLabel: i18n.getKey('productConfigDesignId'),
                    itemId: 'productConfigDesignId'
                }
            ]
        };
        me.callParent(arguments);
        me.on('afterrender', function () {
            var page = this;
            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
            var productId = builderConfigTab.productId;
            me.productId = productId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        });
    },
    refreshData: function (data) {
        var me = this;
        var store = me.down('grid').getStore();
        me.sbomNode = data;
        me.data = data;
        var valueArr = data.getPath('id').split("/");
        valueArr.splice(0, 1);
        var materialPath = valueArr.join(',');
        me.materialPath = materialPath;
        me.filter.getComponent('materialPath').setValue(materialPath);
        store.loadPage(1);

    }
});