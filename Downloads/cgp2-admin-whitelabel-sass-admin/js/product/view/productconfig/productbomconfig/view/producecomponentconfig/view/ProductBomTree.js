/**
 * Created by nan on 2018/10/24.
 */
Ext.define('CGP.product.view.productconfig.productbomconfig.view.producecomponentconfig.view.ProductBomTree', {
    extend: "Ext.tree.Panel",
    width: 400,
    collapsible: true,
    region: 'west',
    header: false,
    split: true,
    config: {
        rootVisible: true,
        useArrows: true,
        viewConfig: {
            stripeRows: true
        }
    },
    viewConfig: {
        markDirty: false//标识修改的字段
    },
    autoScroll: true,
    children: null,
    itemId: 'productBomTree',
    selModel: {
        selType: 'rowmodel'
    },
    productConfigBomId: null,
    productId: null,
    produceComponentConfigStore: null,
    productType: null,
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.material.controller.Controller');
        var name = me.getQueryString('materialName');
        var id = me.materialId;
        var store = null;
        Ext.Ajax.request({
            url: adminPath + 'api/materials/' + id,
            async: false,
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);

                if (responseMessage.data) {
                    rootType = responseMessage.data.childItems.length == 0

                    if (responseMessage.data.clazz == "com.qpp.cgp.domain.bom.MaterialType") {
                        store = Ext.create('CGP.product.view.productconfig.productbomconfig.view.producecomponentconfig.store.BomTree', {
                            root: {
                                _id: id,
                                name: responseMessage.data.name,
                                type: 'MaterialType',
                                leaf: responseMessage.data.childItems.length == 0,
                                icon: path + "ClientLibs/extjs/resources/themes/images/ux/T.png"
                            }
                        });
                    } else {
                        store = Ext.create('CGP.product.view.productconfig.productbomconfig.view.producecomponentconfig.store.BomTree', {
                            root: {
                                _id: id,
                                name: responseMessage.data.name,
                                type: 'MaterialSpu',
                                leaf: responseMessage.data.childItems.length == 0,
                                icon: path + "ClientLibs/extjs/resources/themes/images/ux/S.png"
                            }
                        });
                    }
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });

        me.store = store;
        store.on('load', function (store, node, records) {
            Ext.Array.each(records, function (item) {
                var type = item.get('type');
                if (type == 'MaterialType') {
                    item.set('icon', path + 'ClientLibs/extjs/resources/themes/images/ux/T.png');
                } else if (type == 'MaterialSpu') {
                    item.set('icon', path + 'ClientLibs/extjs/resources/themes/images/ux/S.png');
                } else {
                    item.set('icon', path + 'ClientLibs/extjs/resources/themes/images/ux/B.png');
                }
            });
            Ext.each(records, function (item) {
                if ('root' != item.data._id) {
                    item.setId(item.data._id);
                    item.commit();
                }
            });
        });
        me.tbar = [
            /*   {
             xtype: 'trigger',
             vtype: 'number',
             minLength: 6,
             flex: 4,
             itemId: 'materialCategorySearch',
             trigger1Cls: 'x-form-search-trigger',
             checkChangeBuffer: 600,//延迟600毫秒
             emptyText: '按物料Id',
             onTrigger1Click: function () {//按钮操作
             var me = this;
             if (me.isValid()) {
             var treePanel = me.ownerCt.ownerCt;
             var id = me.getValue();
             }
             }
             },*/
            {
                xtype: 'button',
                text: i18n.getKey('collapseAll'),
                iconCls: 'icon_expandAll',
                /*flex: 2,*/
                width: 150,
                count: 0,
                handler: function (btn) {
                    var treepanel = btn.ownerCt.ownerCt;
                    if (btn.count % 2 == 0) {
                        treepanel.collapseAll();
                        btn.setText(i18n.getKey('expandAll'));
                        btn.setIconCls('icon_expandAll');
                    } else {
                        treepanel.expandAll();
                        btn.setText(i18n.getKey('collapseAll'));
                        btn.setIconCls('icon_collapseAll');
                    }
                    btn.count++;
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('syncSkuProduceComponentConfig'),
                iconCls: 'icon_config',
                hidden: me.productType == 'SKU',//SKU产品无该功能
                /*flex: 2,*/
                width: 200,
                handler: function (btn) {
                    var treepanel = btn.ownerCt.ownerCt;
                    var myMask = new Ext.LoadMask(treepanel.ownerCt, {
                        msg: "运行中..."
                    });
                    Ext.Msg.confirm(i18n.getKey('prompt'), '是否同步该生产组件配置到该可配置产品的所有SKU产品？', function (select) {
                        if (select == 'yes') {
                            myMask.show();
                            Ext.Ajax.request({
                                url: adminPath + 'api/productConfigBoms/' + me.productConfigBomId + '/productComponentConfigs/sync',
                                method: 'PUT',
                                headers: {
                                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                },
                                success: function (response) {
                                    myMask.hide();
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    if (responseMessage.success) {
                                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('同步成功！'));
                                    } else {
                                        myMask.hide();
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                    }
                                },
                                failure: function (response) {
                                    myMask.hide();
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                }
                            })
                        }
                    })
                }
            }
        ];
        me.columns = [
            {
                xtype: 'treecolumn',
                text: i18n.getKey('name'),
                width: '50%',
                dataIndex: 'name',
                //locked: true,
                renderer: function (value, metadata, record) {
                    var id = record.get('_id').split('-').pop();
                    if (Ext.isEmpty(record.get('type')) && !record.isRoot()) {
                        if (record.get('clazz') == 'com.qpp.cgp.domain.bom.bomitem.FixedBOMItem') {
                            return record.get("name") + '(' + i18n.getKey('FixedBOMItem') + ')' + '<' + id + '>';
                        } else if (record.get('clazz') == 'com.qpp.cgp.domain.bom.bomitem.OptionalBOMItem') {
                            return record.get("name") + '(' + i18n.getKey('OptionalBomItem') + ')' + '<' + id + '>';
                        } else if (record.get('clazz') == 'com.qpp.cgp.domain.bom.bomitem.UnassignBOMItem') {
                            return record.get("name") + '(' + i18n.getKey('UnassignBOMItem') + ')' + '<' + id + '>';
                        }
                    } else if (!Ext.isEmpty(record.get('type')) || record.isRoot()) {
                        return record.get("name") + '<' + id + '>';
                    }
                }
            },
            {
                text: i18n.getKey(''),
                width: '50%',
                dataIndex: 'type',
                xtype: 'componentcolumn',
                renderer: function (value) {
                    var recordData = arguments[1].record.getData();
                    var treeRecord = arguments[2];
                    var materialPath = arguments[2].getPath().replace(/\//g, ',');
                    materialPath = materialPath.slice(materialPath.indexOf(',') + 1);
                    var materialId = arguments[2].getId().split('-').pop();
                    var treePanel = arguments[6].ownerCt;
                    var materialName = arguments[2].get('name');
                    var produceComponentConfigStore = treePanel.produceComponentConfigStore;
                    var productConfigBomId = treePanel.productConfigBomId;
                    var result = {
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        fieldDefaults: {
                            margin: '0 0 0 10'
                        },
                        items: []
                    };
                    if (recordData.isLeaf == true) {
                        var recordIndex = produceComponentConfigStore.findBy(function (record, id) {
                            if (record.get('materialPath') == materialPath) {
                                treeRecord.gridRecord = record;//把找到的对应的记录，保存到treeStore中对应记录的一个字段中
                                return true
                            } else {
                                return false
                            }
                        });
                        if (recordIndex != -1) {//有匹配记录
                            result.items.push({
                                xtype: 'displayfield',
                                value:  i18n.getKey('hadConfig')
                            })
                        } else {//无匹配记录
                            result.items.push({
                                xtype: 'displayfield',
                                value: i18n.getKey('hadnotConfig')
                            })
                            result.items.push({
                                    xtype: 'displayfield',
                                    value: '<a href="#" style="color: blue" )>' + i18n.getKey('config') + '</a>',
                                    materialId: materialId,
                                    materialPath: materialPath,
                                    productConfigBomId: productConfigBomId,
                                    treePanel: treePanel,
                                    materialName: materialName,
                                    listeners: {
                                        render: function (display) {
                                            var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                            var ela = Ext.fly(a); //获取到a元素的element封装对象
                                            var gridPanel = display.treePanel.ownerCt.getComponent('produceComponentConfigGrid');
                                            ela.on("click", function () {
                                                var win = Ext.create('CGP.product.view.productconfig.productbomconfig.view.producecomponentconfig.view.EditProduceComponentConfigWindow', {
                                                    title: i18n.getKey('create') + i18n.getKey('productComponentConfig'),
                                                    materialPath: display.materialPath,
                                                    productConfigBomId: display.productConfigBomId,
                                                    createOrEdit: 'create',
                                                    treePanel: display.treePanel,
                                                    gridPanel: gridPanel,
                                                    materialName: display.materialName
                                                });
                                                win.show();
                                            });
                                        }
                                    }
                                }
                            )
                        }
                        return  result;
                    } else {
                        return null;
                    }
                }

            }
        ]
        me.listeners = {
            select: function (rowModel, record) {
                var isLeaf = record.get('isLeaf');
                var produceComponentConfigGridPanel = rowModel.view.ownerCt.ownerCt.getComponent('produceComponentConfigGrid');
                var path = record.getPath().replace(/\//g, ',');
                path = path.slice(path.indexOf(',') + 1);
                var produceComponentConfigGrid = produceComponentConfigGridPanel.items.items[0].grid;

                if (isLeaf == true) {//点击叶子节点时
                    //查找相同路径的记录
                    if (record.gridRecord) {
                        produceComponentConfigGrid.getSelectionModel().deselectAll();
                        produceComponentConfigGrid.getSelectionModel().select(record.gridRecord);

                    } else {
                        produceComponentConfigGrid.getSelectionModel().deselectAll();
                    }
                } else {
                    produceComponentConfigGrid.getSelectionModel().deselectAll();

                }
            },
            itemexpand: function (node) {
                if (node.childNodes.length > 0) {//展开节点时，更改父节点图标样式
                    //node.getUI().getIconEl().src="../themes/images/default/editor/edit-word-text.png";
                }
                //更改当前节点下的所有子节点的图标
                for (var i = 0, len = node.childNodes.length; i < len; i++) {
                    var curChild = node.childNodes[i];
                    var type = curChild.get('type');
                    var isLeaf = curChild.get('isLeaf');
                    if (type == 'MaterialType') {
                        curChild.set('icon', path + 'ClientLibs/extjs/resources/themes/images/ux/T.png');
                    } else if (type == 'MaterialSpu') {
                        curChild.set('icon', path + 'ClientLibs/extjs/resources/themes/images/ux/S.png');
                    } else {
                        curChild.set('icon', path + 'ClientLibs/extjs/resources/themes/images/ux/B.png');
                    }
                }
            },
            beforeload: function (sto, operation, e) {
                var type = operation.node.get('type');
                var clazz;
                if (operation.node.raw) {
                    clazz = operation.node.raw.clazz;
                }
                var parentNode = operation.node.parentNode;
                if (Ext.isEmpty(type) && !operation.node.isRoot()) {
                    var idRealArray = parentNode.get('_id').split('-');
                    var realId = idRealArray[idRealArray.length - 1];
                    sto.proxy.url = adminPath + 'api/materials/bomTree/{id}/children?type=bomitem&materialId=' + realId;
                    delete sto.proxy.extraParams;
                } else {
                    sto.proxy.url = adminPath + 'api/materials/bomTree/{id}/children?type=material';
                }
            },
            afterrender: function (view) {
                view.expandAll();
            }
        };
        me.callParent(arguments);
    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    }
})
