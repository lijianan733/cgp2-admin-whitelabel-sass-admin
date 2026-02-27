/**
 * Created by nan on 2021/4/15
 * 这里管理的PMVT,是sbom节点中使用的
 *
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.salematerialbommvtmanage.view.PmvtGrid'
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.view.PmvtGrid', {
    extend: 'CGP.common.commoncomp.QueryGrid',
    itemId: 'pmvtGrid',
    data: null,
    topTab: null,
    productConfigDesignId: null,
    productBomConfigId: null,
    simplifyBomConfigId: null,
    materialId: null,
    builderConfigTab: null,
    materialPath: null,
    initComponent: function () {
        var me = this;
        var store = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.store.SimplifyPMVTStore', {
            autoLoad: false,
            bomConfigId: me.simplifyBomConfigId,
        });
        me.controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.controller.Controller');
        var columns = [
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
        ];
        var filterfig = {
            hidden: true,
            items: [
                {
                    name: 'materialPath',
                    xtype: 'textfield',
                    hidden: true,
                    isLike: false,
                    itemId: 'materialPath'
                },
                /*    {
                        name: 'excludeIds',
                        xtype: 'textfield',
                        hidden: true,
                        isLike: false,
                        itemId: 'excludeIds',
                    },*/
                {
                    name: 'productConfigDesignId',
                    xtype: 'numberfield',
                    hidden: true,
                    fieldLabel: i18n.getKey('productConfigDesignId'),
                    itemId: 'productConfigDesignId'
                },
            ]
        };
        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.controller.Controller');
        me.title = 'pmvt';
        me.gridCfg = {
            selType: 'checkboxmodel',
            store: store,
            editAction: false,
            deleteAction: true,
            deleteActionHandler: function (view, rowIndex, colIndex, action, event, record) {
                Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                    if (selector == 'yes') {
                        var grid = view.ownerCt;
                        grid.store.remove(record);
                        var pmvtGrid = grid.ownerCt;
                        var pmvtIds = grid.store.data.keys;
                        pmvtGrid.controller.savePMVT(pmvtGrid.simplifyBomConfigId, pmvtGrid.sbomNode.getId(), pmvtIds, grid, i18n.getKey('deleteSuccess'));
                    }
                })
            },
            tbar: [
                {
                    xtype: 'button',
                    iconCls: 'icon_create',
                    text: i18n.getKey('add'),
                    handler: function (btn) {
                        var outGrid = btn.ownerCt.ownerCt;
                        var pmvtGrid = outGrid.ownerCt;
                        var grid = Ext.create('CGP.common.commoncomp.QueryGrid', {
                            gridCfg: {
                                editAction: false,
                                deleteAction: false,
                                columns: columns,
                                store: Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.store.ProductMaterialViewTypeVersionFiveStore', {
                                    autoLoad: false
                                }),
                            },
                            filterCfg: filterfig,
                            refreshData: function (data) {
                                var me = this;
                                var store = me.down('grid').getStore();
                                me.filter.getComponent('productConfigDesignId').setValue(data.productConfigDesignId);
                                me.filter.getComponent('materialPath').setValue(data.materialPath);
                                /*
                                                                me.filter.getComponent('excludeIds').setValue(data.excludeIds);
                                */
                                store.loadPage(1);
                            }
                        })
                        var win = Ext.create('Ext.window.Window', {
                            title: i18n.getKey('PMVT'),
                            width: 1000,
                            modal: true,
                            constrain: true,
                            layout: {
                                type: 'fit'
                            },
                            items: [
                                grid
                            ],
                            bbar: [
                                '->',
                                {
                                    xtype: 'button',
                                    iconCls: 'icon_save',
                                    text: i18n.getKey('confirm'),
                                    handler: function (btn) {
                                        var win = btn.ownerCt.ownerCt;
                                        var gird = win.items.items[0];
                                        var selections = gird.grid.getSelectionModel().getSelection();
                                        var pmvtIds = [];
                                        pmvtIds = pmvtIds.concat(outGrid.store.data.keys);
                                        for (var i = 0; i < selections.length; i++) {
                                            var id = selections[i].getId();
                                            if (pmvtIds.indexOf(id) == -1) {
                                                //不存在该记录
                                                pmvtIds.push(id);
                                            }
                                        }
                                        if (selections.length > 0) {
                                            pmvtGrid.controller.savePMVT(pmvtGrid.simplifyBomConfigId, pmvtGrid.sbomNode.getId(), pmvtIds, outGrid, 'addsuccessful');
                                            win.close();
                                        }
                                    }
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'icon_cancel',
                                    text: i18n.getKey('cancel'),
                                    handler: function (btn) {
                                        var win = btn.ownerCt.ownerCt;
                                        win.close();
                                    }
                                }
                            ]
                        });
                        win.show();
                        grid.refreshData({
                            /*
                                                        excludeIds: outGrid.store.data.keys,
                            */
                            materialPath: me.materialPath,
                            productConfigDesignId: me.productConfigDesignId
                        });
                    }
                },
                {
                    xtype: 'button',
                    iconCls: 'icon_delete',
                    text: i18n.getKey('delete'),
                    handler: function (btn) {
                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                            if (selector == 'yes') {
                                var outGrid = btn.ownerCt.ownerCt;
                                var pmvtGrid = outGrid.ownerCt;
                                var selections = outGrid.getSelectionModel().getSelection();
                                outGrid.store.remove(selections);
                                var pmvtIds = outGrid.store.data.keys;
                                pmvtGrid.controller.savePMVT(pmvtGrid.simplifyBomConfigId, pmvtGrid.sbomNode.getId(), pmvtIds, outGrid, i18n.getKey('deleteSuccess'));
                            }
                        })
                    }
                }, {
                    xtype: 'displayfield',
                    fieldStyle: {
                        color: 'red'
                    },
                    iconCls: 'icon_delete',
                    value: '用来简化smvt配置'
                }

            ],
            multiSelect: true,
            defaults: {
                width: 200
            },
            columns: columns
        };
        me.filterCfg = filterfig;
        me.callParent();
        me.on('afterrender', function () {
            var page = this;
            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
            var productId = builderConfigTab.productId;
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
        me.sbomNodeId = data.getId();
        me.materialPath = data.get('materialPath');
        me.productConfigDesignId = me.productConfigDesignId;
        me.filter.getComponent('materialPath').setValue(data.get('materialPath'));
        store.proxy.extraParams = {
            nodeId: data.getId()
        };
        store.loadPage(1);

    }
});