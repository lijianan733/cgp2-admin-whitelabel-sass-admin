/**
 * Created by nan on 2020/4/22.
 * 管理一个SMT的MappingDTO,
 * 增删改查的DTO操作，和对应doMain的处理
 * 只有在ubi的smt才能配置多个
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.ManageMaterialMappingLeftGrid', {
    extend: 'Ext.grid.Panel',
    region: 'west',
    width: 320,
    hidden: true,
    autoScroll: true,
    collapsible: true,
    header: false,
    split: true,
    itemId: 'manageMaterialMappingLeftGrid',
    productConfigDesignId: null,
    materialPath: null,
    MMTDetail: null,
    viewConfig: {
        loadMask: true
    },
    controller: Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.controller.Controller'),
    listeners: {
        beforeselect: function (rowModel, record) {
            var leftBomTree = rowModel.view.ownerCt;
            var centerContainer = leftBomTree.ownerCt.getComponent('centerContainer');
            if (centerContainer && centerContainer.isDirty == true) {
                var saveBtn = centerContainer.getDockedItems('toolbar[dock="top"]')[0].getComponent('saveBtn');
                Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('是否保存当前的修改?'), function (selector) {
                    if (selector == 'yes') {
                        saveBtn.handler(saveBtn);
                        rowModel.select(record);

                    } else {
                        rowModel.select(record);
                        centerContainer.isDirty = false;
                    }
                })
                return false;
            } else {
                return true;
            }

        },
        select: function (rowModel, record) {
            var gridPanel = this;
            var centerContainer = gridPanel.ownerCt.getComponent('centerContainer');
            var materialPath = gridPanel.materialPath;
            var MMTDetail = gridPanel.MMTDetail;
            var materialMappingDTOConfig = record.raw;
            centerContainer.refreshData(materialPath, MMTDetail, materialMappingDTOConfig);

        }
    },
    refreshData: function (materialPath, MMTDetail) {
        var me = this;
        var leftBomTree = Ext.getCmp('leftBomTree');
        me.materialPath = materialPath;
        me.MMTDetail = MMTDetail;
        me.getSelectionModel().deselectAll();
        var mappingDTOs = me.controller.getMaterialMappingDTOConfig(materialPath, me.productConfigDesignId, false, me.configType);
        me.store.proxy.extraParams = {
            filter: Ext.JSON.encode([{
                "name": "materialPath",
                "type": "string",
                "value": materialPath
            }, {
                "name": me.configType == 'mappingConfig' ? 'productConfigMappingId' : 'productConfigDesignId',
                "type": "number",
                "value": me.productConfigDesignId
            }])
        };
        me.store.load({//加载后选中第一个记录
                callback: function (records) {
                    if (leftBomTree.selectedMappingId) {//选择指定的记录
                        for (var i = 0; i < records.length; i++) {
                            if (records[i].raw.materialMappingConfigDomain._id == leftBomTree.selectedMappingId) {
                                me.getSelectionModel().select(records[i]);
                                leftBomTree.selectedMappingId = null;
                                break;
                            }
                        }
                    } else if (records && records.length >= 1) {//默认选择第一条记录
                        me.getSelectionModel().select(records[0]);
                    }
                }
            }
        );
    },

    initComponent: function () {
        var me = this;
        me.store = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.store.MaterialMappingDTOConfigStore', {});
        me.columns = [
            {
                xtype: 'actioncolumn',
                width: 50,
                items: [
                    {
                        iconCls: 'icon_edit icon_margin',  // Use a URL in the icon config
                        tooltip: '修改描述',
                        handler: function (gridview, rowIndex, colIndex, a, b, record) {
                            var gridPanel = gridview.ownerCt;
                            var win = Ext.create('Ext.window.Window', {
                                title: i18n.getKey('修改描述'),
                                modal: true,
                                constrain: true,
                                width: 350,
                                height: 150,
                                layout: {
                                    type: 'vbox',
                                    align: 'center',
                                    pack: 'center'

                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: i18n.getKey('description'),
                                        allowBlank: false,
                                        itemId: 'description',
                                        name: 'description',
                                        value: record.get('description')
                                    }
                                ],
                                bbar: [
                                    '->',
                                    {
                                        xtype: 'button',
                                        text: i18n.getKey('confirm'),
                                        iconCls: 'icon_agree',
                                        handler: function (btn) {
                                            var win = btn.ownerCt.ownerCt;
                                            var description = win.getComponent('description');
                                            var materialMappingDTOConfig = record.raw;
                                            var materialPath = materialMappingDTOConfig.materialMappingConfigDomain.materialPath;
                                            var materialId = materialPath.replace(/,/g, '-');
                                            if (description.isValid()) {
                                                materialMappingDTOConfig.description = description.getValue();
                                                var url = adminPath + 'api/materialMappingDTOConfigs/' + materialMappingDTOConfig._id;
                                                var method = 'PUT';
                                                Ext.Ajax.request({
                                                    url: url,
                                                    async: false,
                                                    method: method,
                                                    jsonData: materialMappingDTOConfig,
                                                    headers: {
                                                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                                    },
                                                    success: function (response) {
                                                        var responseMessage = Ext.JSON.decode(response.responseText);
                                                        if (responseMessage.success) {
                                                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                                                                gridPanel.store.load();
                                                                var leftBomTree = Ext.getCmp('leftBomTree');
                                                                var treeNode = leftBomTree.getStore().getNodeById(materialId);
                                                                leftBomTree.getStore().load({
                                                                    node: treeNode,
                                                                    callback: function () {
                                                                       ;
                                                                    }
                                                                });
                                                            });

                                                        } else {
                                                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                                        }
                                                    },
                                                    failure: function (response) {
                                                        var responseMessage = Ext.JSON.decode(response.responseText);
                                                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                                    }
                                                });

                                            }

                                            win.close();
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        text: i18n.getKey('cancel'),
                                        iconCls: 'icon_cancel',
                                        handler: function (btn) {
                                            btn.ownerCt.ownerCt.close();

                                        }
                                    }
                                ]
                            });
                            win.show();
                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        tooltip: 'Delete',
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var store = view.getStore();
                            var gridPanel = view.ownerCt;
                            var constraintId = record.getId();
                            Ext.Msg.confirm('提示', '确定删除？', callback);
                            var materialPath = record.raw.materialMappingConfigDomain.materialPath;
                            var materialId = materialPath.replace(/,/g, '-');

                            function callback(id) {
                                if (id === 'yes') {
                                    var url = adminPath + 'api/materialMappingDTOConfigs/' + constraintId;
                                    var method = 'DELETE';
                                    Ext.Ajax.request({
                                        url: url,
                                        method: method,
                                        headers: {
                                            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                        },
                                        success: function (response) {
                                            var responseMessage = Ext.JSON.decode(response.responseText);
                                            if (responseMessage.success) {
                                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('删除成功！'), function () {
                                                    store.load();
                                                    gridPanel.getSelectionModel().deselectAll();
                                                    var centerContainer = gridPanel.ownerCt.getComponent('centerContainer');
                                                    centerContainer.refreshData();
                                                    var leftBomTree = Ext.getCmp('leftBomTree');
                                                    var treeNode = leftBomTree.getStore().getNodeById(materialId);
                                                    leftBomTree.getStore().load({
                                                        node: treeNode,
                                                        callback: function () {
                                                           ;
                                                        }
                                                    });
                                                });

                                            } else {
                                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                            }
                                        },
                                        failure: function (response) {
                                            var responseMessage = Ext.JSON.decode(response.responseText);
                                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                        }
                                    });

                                }
                            }
                        }
                    }
                ]
            },
            {
                dataIndex: '_id',
                width: 100,
                text: i18n.getKey('id')
            },
            {
                dataIndex: 'description',
                flex: 1,
                text: i18n.getKey('description'),
                renderer: function (value, mateData, record) {
                    return value;
                }
            }
        ];
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('add'),
                iconCls: 'icon_add',
                handler: function (btn) {
                    var gridPanel = btn.ownerCt.ownerCt;
                    var materialPath = gridPanel.materialPath;
                    var productConfigDesignId = gridPanel.productConfigDesignId;
                    var controller = me.controller;
                    var win = Ext.create('Ext.window.Window', {
                        title: i18n.getKey('create') + '空白的' + i18n.getKey('materialMapping'),
                        width: 350,
                        height: 150,
                        modal: true,
                        constrain: true,
                        layout: {
                            type: 'vbox',
                            align: 'center',
                            pack: 'center'

                        },
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('description'),
                                allowBlank: false,
                                itemId: 'description',
                                name: 'description'
                            }
                        ],
                        bbar: [
                            '->',
                            {
                                xtype: 'button',
                                text: i18n.getKey('confirm'),
                                iconCls: 'icon_agree',
                                handler: function (btn) {
                                    var win = btn.ownerCt.ownerCt;
                                    var description = win.getComponent('description');
                                    if (description.isValid()) {
                                        var url = adminPath + 'api/materialMappingDTOConfigs';
                                        var method = 'POST';
                                        var jsonData = {
                                            clazz: "com.qpp.cgp.domain.product.config.material.mapping2dto.MaterialMappingDTOConfig",
                                            materialPath: materialPath,
                                            productConfigDesignId: productConfigDesignId,
                                            spuRtObjectMappings: [],
                                            bomItemMappings: [],
                                            description: description.getValue()
                                        };
                                        if(me.configType == 'mappingConfig'){
                                            delete jsonData.productConfigDesignId;
                                            jsonData.productConfigMappingId = me.productConfigDesignId;
                                        }
                                        jsonData.materialMappingConfigDomain = controller.createMaterialMappingConfigDomain(jsonData);
                                        var nodeId = materialPath.replace(/,/g, '-');
                                        Ext.Ajax.request({
                                            url: url,
                                            async: false,
                                            method: method,
                                            jsonData: jsonData,
                                            headers: {
                                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                            },
                                            success: function (response) {
                                                var responseMessage = Ext.JSON.decode(response.responseText);
                                                if (responseMessage.success) {
                                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                                                        gridPanel.store.load();
                                                        var leftBomTree = Ext.getCmp('leftBomTree');
                                                        var treeNode = leftBomTree.getStore().getNodeById(nodeId);
                                                        leftBomTree.getStore().load({
                                                            node: treeNode,
                                                            callback: function () {
                                                               ;
                                                            }
                                                        });
                                                    });

                                                } else {
                                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                                }
                                            },
                                            failure: function (response) {
                                                var responseMessage = Ext.JSON.decode(response.responseText);
                                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                            }
                                        });

                                    }
                                    win.close();
                                }
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('cancel'),
                                iconCls: 'icon_cancel',
                                handler: function (btn) {
                                    btn.ownerCt.ownerCt.close();

                                }
                            }
                        ]
                    });
                    win.show();

                }
            }
        ];
        me.bbar = Ext.create('Ext.PagingToolbar', {
            store: me.store,
            //displayInfo : true,  是否显示，分页信息
            //displayMsg : 'Displaying {0} - {1} of {2}', //显示的分页信息
            emptyMsg: i18n.getKey('noData')
        })
        me.callParent();
    }

})
