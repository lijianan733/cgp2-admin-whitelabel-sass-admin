Ext.Loader.syncRequire([
    "CGP.productcatalog.model.ProductCatalogModel",
    'CGP.cmsconfig.store.productAttributeStore',
    'CGP.productcatalog.store.StoreConfigStore'
]);
Ext.define("CGP.productcatalog.controller.Controller", {
    /**
     * 查看物料详情
     * @param {Ext.tab.Panel} infoTab 物料详情TabPanel
     * @param {String} materialId 物料ID
     * @param {Boolean} isLeaf 是否为子节点
     * @param {String} parentId 父物料ID
     */
    showMaterialInfo: function (infoTab, materialId, isLeaf, parentId) {


        Ext.Ajax.request({
            url: adminPath + 'api/materials/' + materialId,
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                var data = responseMessage.data;
                if (responseMessage.success) {
                    infoTab.refreshData(data, isLeaf, parentId);
                } else {

                    Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },
    /**
     * 移动category
     * @param {Node} targetNode 将移动至的目标节点
     * @param {Ext.tree.Panel} tree categoryTree 外围导航树
     * @param {Node} moveNode 移动的category  外围导航树上选中需要移动的节点
     * @param {Ext.window.Window} win 选择移动目标节点的窗口
     */
    moveCategory: function (targetNode, tree, moveNode, win) {
        var me = this;
        var targetNodeId = targetNode.getId();
        var parentNode = moveNode.parentNode;
        moveNode.set('parentId', targetNodeId)
        var jsonData = {
            "id": moveNode.getId(),
            "name": moveNode.get('name'),
            "parentId": targetNodeId,
            "clazz": moveNode.get('clazz'),
            "showAsProductCatalog": moveNode.get('showAsProductCatalog') ?? true,
            "sortOrder": moveNode.get('sortOrder'),
            "invisible": moveNode.get('invisible'),
            "leaf": moveNode.get('leaf'),
            "isMain": moveNode.get('isMain'),
            "website": moveNode.get('website'),
            "status": 1
        };
        var url = adminPath + 'api/productCategories/' + moveNode.getId();
        JSAjaxRequest(url, 'PUT', true, jsonData, null, function (require, success, response) {
            var responseMessage = Ext.JSON.decode(response.responseText);
            if (responseMessage.success) {

                //分两种情况,移动到root节点，和移动到其他节点下
                //原位置移除,新位置添加
                if (targetNode.isRoot() == true) {
                    parentNode.removeChild(moveNode);
                    tree.getRootNode().appendChild(moveNode);
                    /*
                                        targetNode.updateInfo();
                    */
                } else {
                    var realTargetNode = tree.getRootNode().findChild('id', targetNodeId, true);
                    //可能该节点没加载
                    parentNode.removeChild(moveNode);
                    if (realTargetNode) {
                        realTargetNode.set('leaf', false);
                        realTargetNode.appendChild(moveNode);
                        realTargetNode.expand();
                    }

                    /*
                                        targetNode.updateInfo();
                    */

                }

                /*         treeStore.load({
                             callback: function () {
                                 tree.expandAll();
                             }
                         });*/
                win.close();
            }
        }, true);
    },
    batchMoveOutCatalog: function () {

    },
    batchAddToCatalog: function () {

    },

    buildAttributeStoreData: function (publishProfilesStore, productAttributeStore, profiles) {
        var attributes = new Map();
        productAttributeStore.removeAll();
        productAttributeStore.proxy.data = [];
        for (var i = 0; i < profiles.length; i++) {
            //找到对应的profile取出其对应的属性列表
            var record = publishProfilesStore.findRecord('_id', profiles[i]);
            if (record) {
                var groups = record.raw.groups;
                var profileId = record.raw._id;
                var profileName = record.raw.name;
                groups.map(function (item) {
                    item.attributes.map(function (skuAttribute) {
                        var attributeId = skuAttribute.attribute.id,
                            attributeOptions = skuAttribute?.attributeOptions,
                            attribute = attributes.get(attributeId) || Ext.clone(skuAttribute.attribute);

                        attribute.profiles = attribute.profiles || [];
                        attribute.profiles.push({
                            _id: profileId,
                            profileName: profileName
                        });

                        if (attributeOptions) {
                            attribute['attributeOptions'] = attributeOptions;
                        }
                        attributes.set(attributeId, attribute);
                    })
                });
            }

        }
        return [...attributes.values()];
    },

    /**
     * 右键点击节点时显示菜单操作
     * @param {Ext.tree.Panel} view 树结构
     * @param {Node} record 选中的节点
     * @param {Event} e 事件对象
     * @param {String} parentId 父节点ID
     * @param {Boolean} isLeaf 是否叶子节
     * @param {String} treeType 物料视图类型
     */
    categoryEventMenu: function (view, record, e, parentId, isLeaf, treeType) {
        var me = this;
        var tree = view.ownerCt;
        e.stopEvent();
        var menu = Ext.create('Ext.menu.Menu', {
            items: [
                {
                    text: i18n.getKey('add') + i18n.getKey('sameLevel') + i18n.getKey('catalog'),
                    itemId: 'add',
                    handler: function () {
                        me.addCategory(tree, record, record.parentNode);
                    }
                },
                {
                    text: i18n.getKey('add') + i18n.getKey('child') + i18n.getKey('catalog'),
                    itemId: 'addChild',
                    handler: function () {
                        me.addCategory(tree, record, record);
                    }
                },
                {
                    text: i18n.getKey('modify') + i18n.getKey('catalog') + i18n.getKey('info'),
                    disabledCls: 'menu-item-display-none',
                    itemId: 'modifyName',
                    handler: function () {
                        me.modifyCatagoryName(tree, record);
                    }
                },
                {
                    text: i18n.getKey('modify') + i18n.getKey('status'),
                    disabledCls: 'menu-item-display-none',
                    itemId: 'modifyStatus',
                    handler: function () {
                        me.modifyCatagoryStatusWin(tree, record);
                    }
                },
                {
                    text: i18n.getKey('修改模式'),
                    disabledCls: 'menu-item-display-none',
                    itemId: 'modifyMode',
                    handler: function () {
                        me.modifyCatalogModeWin(tree, record);
                    }
                },
                {
                    text: i18n.getKey('delete'),
                    disabledCls: 'menu-item-display-none',
                    itemId: 'delete',
                    handler: function () {
                        me.deleteCategory(tree, record);
                    }
                },
                {
                    text: i18n.getKey('move') + i18n.getKey('catalog'),
                    disabledCls: 'menu-item-display-none',
                    itemId: 'move',
                    handler: function () {
                        me.moveCategoryWin(tree, record);
                    }
                },
                {
                    text: i18n.getKey('属性组件配置'),
                    handler: function () {
                        var catalogId = record.get('id')
                        me.createAttributeCompConfigFormWindow(catalogId, null, function (data) {
                            console.log(data);
                        });
                    }
                },
            ]
        });
        menu.showAt(e.getXY());
    },
    /**
     * 类目下的所有产品，并赋值与展示页面，进行数据展示
     * @param {Node} record
     * @param {Ext.tab.Panel} infoTab 展示页面的容器组件
     * @param {Boolean} isLeaf 是否叶子节点
     * @param {Node} parentId 父节点ID
     */
    refreshMaterialGrid: function (record, infoTab, isLeaf, parentId, searchProductId) {
        infoTab.refreshData(record, isLeaf, parentId, searchProductId);
    },
    addCategory: function (tree, record, parentNode) {
        var parentId = parentNode.getId();
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('add') + i18n.getKey('catalog'),
            layout: 'fit',
            modal: true,
            items: [
                {
                    xtype: 'form',
                    border: false,
                    header: false,
                    defaults: {
                        margin: '10 25',
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            itemId: 'name',
                            fieldLabel: i18n.getKey('name'),
                            width: 350,
                            allowBlank: false,
                            name: 'name'
                        }
                    ]
                }
            ],
            bbar: [
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    handler: function () {
                        var win = this.ownerCt.ownerCt;
                        var categoryNameField = win.down('form').getComponent('name');
                        if (categoryNameField.isValid()) {
                            var categoryName = categoryNameField.getValue();
                            var categoryModel = new CGP.productcatalog.model.ProductCatalogModel({
                                name: categoryName,
                                parentId: parentId,
                                showAsProductCatalog: tree.showAsProductCatalog ?? true,
                                "sortOrder": 1,
                                "invisible": false,
                                "leaf": true,
                                "isMain": false,
                                "website": 11,
                                "status": 1
                            })
                            categoryModel.save({
                                callback: function (res, operation, success) {

                                    if (success) {
                                        var data = res.data;
                                        Ext.Msg.alert('提示', '添加成功！');
                                        if (record && parentId == record.getId() && record.get("leaf")) { //在当前节点下添加子节点，需更新当前节点leaf为false
                                            record.set("leaf", false);
                                            var parentCategoryModel = new CGP.productcatalog.model.ProductCatalogModel(record.data);
                                            parentCategoryModel.save({});
                                        }
                                        var treeStore = tree.getStore();

                                        var refreshNode = parentNode.parentNode;
                                        if (Ext.isEmpty(refreshNode)) {
                                            refreshNode = parentNode;
                                        }
                                        treeStore.load({
                                            node: parentNode,
                                            callback: function (records) {
                                                parentNode.expand();
                                                var newNode = treeStore.getNodeById(data['_id']);
                                                tree.getSelectionModel().select(newNode);
                                            }
                                        });
                                        win.close();
                                    } else {
                                        Ext.Msg.alert('提示', '请求错误')
                                    }
                                }
                            });
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    handler: function () {
                        this.ownerCt.ownerCt.close();
                    }
                }
            ]

        }).show();

    },
    /**
     * 移动的
     * @param tree
     */
    moveCategoryWin: function (tree, moveNode) {
        var me = this;
        var wind = Ext.create('CGP.productcatalog.view.MoveCategoryWin', {
            modal: true,
            selectedId: (tree.getSelectionModel().getSelection()[0])?.getId(),
            confirmHandler: function (btn) {
                var treePanel = btn.ownerCt.ownerCt.down('treepanel');
                var targetNode = treePanel.getSelectionModel().getSelection()[0];
                if (targetNode) {
                    /*
                                        var moveNode = tree.getSelectionModel().getSelection()[0];
                    */
                    me.moveCategory(targetNode, tree, moveNode, wind);
                } else {
                    Ext.Msg.alert('提示', '请先选择目标类目!');
                    return false;
                }
            }
        });
        wind.show();
    },
    deleteCategory: function (tree, record) {
        var categoryId = record.get('id');
        var parentNode = record.parentNode;
        var request = {
            url: adminPath + 'api/productCategories/' + categoryId,
            method: 'DELETE',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                var data = responseMessage.data;
                if (responseMessage.success) {
                    Ext.Msg.alert('提示', "删除成功！");
                    //var rootNode = treeStore.getRootNode();
                    var refreshNode = parentNode.parentNode;
                    if (Ext.isEmpty(refreshNode)) {
                        refreshNode = parentNode;
                    }
                    var treeStore = tree.getStore();
                    parentNode.removeChild(record)
                    /*      treeStore.load({
                              node: parentNode,
                              callback: function (records) {
                                  tree.getSelectionModel().select(0);
                              }
                          });*/
                } else {
                    Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        };
        Ext.Ajax.request({
            url: adminPath + 'api/product-of-catalog/catalogs/' + categoryId + '?page=1&limit=20',
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                if (responseMessage.success) {
                    var content = responseMessage.data.content;
                    if (!Ext.isEmpty(content)) {
                        Ext.Msg.alert('提示', '此类目下存在产品，不允许删除！')
                    } else {
                        Ext.Msg.confirm('提示', '是否删除该类目？', callback);

                        function callback(id) {
                            if (id === 'yes') {
                                Ext.Ajax.request(request);
                            }
                        }
                    }
                } else {
                    Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });

    },
    /**
     * 修改category名称
     * @param {Ext.tree.Panel} tree categoryTree
     * @param {Node} record 要修改的category
     */
    modifyCatagoryName: function (tree, record) {
        var me = this;
        Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: i18n.getKey('modify') + i18n.getKey('info'),
            modal: true,
            items: [
                {
                    xtype: 'form',
                    border: false,
                    defaults: {
                        margin: '10 25',
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('name'),
                            name: 'name',
                            itemId: 'categoryName',
                            allowBlank: false,
                            width: 300,
                            listeners: {
                                afterRender: function (comp) {
                                    comp.setValue(record.get("name"));
                                }
                            }
                        },
                        {
                            xtype: 'numberfield',
                            fieldLabel: i18n.getKey('priority'),
                            name: 'sortOrder',
                            itemId: 'sortOrder',
                            minValue: 1,
                            allowDecimals: false,
                            allowBlank: false,
                            width: 300,
                            listeners: {
                                afterRender: function (comp) {
                                    comp.setValue(record.get("sortOrder"));
                                }
                            }
                        }
                    ]
                }
            ],
            bbar: ['->', {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                handler: function (comp) {
                    var win = this.ownerCt.ownerCt;
                    var form = win.down('form');
                    if (form.isValid()) {
                        var data = form.getValues();
                        me.modify(tree, record, data, win);
                    }
                }
            }, {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                handler: function (comp) {
                    comp.ownerCt.ownerCt.close();
                }
            }]
        }).show();
    },
    /**
     * 修改category名称
     * @param {Ext.tree.Panel} tree categoryTree
     * @param {Node} record 要修改的category
     */
    modifyCatagoryStatusWin: function (tree, record) {
        var me = this;
        Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: i18n.getKey('modify') + i18n.getKey('status'),
            modal: true,
            items: [
                {
                    xtype: 'form',
                    border: false,
                    defaults: {
                        margin: '10 25',
                    },
                    items: [
                        {
                            xtype: 'combo',
                            fieldLabel: i18n.getKey('状态'),
                            name: 'publishStatus',
                            itemId: 'status',
                            allowBlank: false,
                            width: 300,
                            defaultValue: null,
                            displayField: 'name',
                            valueField: 'value',
                            editable: false,
                            store: Ext.create('Ext.data.Store', {
                                fields: ['name', 'value'],
                                data: [{name: '启用', value: 1}, {name: '弃用', value: 2}]
                            }),
                            listeners: {
                                afterRender: function (comp) {
                                    comp.setValue(record.get("status"));
                                }
                            }
                        }
                    ]
                }
            ],
            bbar: ['->', {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                handler: function (comp) {
                    var win = this.ownerCt.ownerCt;
                    var form = win.down('form');
                    if (form.isValid()) {
                        var data = form.getValues();
                        var status = data.publishStatus;
                        me.modifyCatagoryStatus(tree, record, status, win);
                    }
                }
            }, {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                handler: function (comp) {
                    comp.ownerCt.ownerCt.close();
                }
            }]
        }).show();
    },
    modifyCatagoryStatus: function (tree, node, status, win, targetNode) {
        var request = {
            url: adminPath + 'api/productCategories/status/' + node.getId() + '?publishStatus=' + status,
            method: 'PUT',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                if (responseMessage.success) {
                    node.set('publishStatus', status);
                    if (targetNode && targetNode.get('leaf')) {
                        targetNode.set('leaf', false);
                        me.modify(null, targetNode);
                    }
                    if (tree) {
                        var treeStore = tree.getStore();
                        treeStore.load({
                            node: node,
                            callback: function (records) {
                                var refreshNode = treeStore.getNodeById(node.getId());
                                tree.getSelectionModel().select(refreshNode);
                            }
                        });
                    }
                    if (win) {
                        win.close();
                    }
                } else {
                    Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        };
        Ext.Ajax.request(request);
    },

    /**
     * 修改category 模式
     * @param {Ext.tree.Panel} tree categoryTree
     * @param {Node} record 要修改的category
     */
    modifyCatalogModeWin: function (tree, record) {
        var me = this;
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('修改模式'),
            modal: true,
            constrain: true,
            layout: 'fit',
            items: [
                {
                    xtype: 'errorstrickform',
                    border: false,
                    defaults: {
                        margin: '10 25',
                    },
                    items: [
                        {
                            xtype: 'combo',
                            fieldLabel: i18n.getKey('模式'),
                            name: 'mode',
                            itemId: 'mode',
                            allowBlank: false,
                            width: 300,
                            displayField: 'display',
                            valueField: 'value',
                            editable: false,
                            value: record.get("isRelease"),
                            store: {
                                xtype: 'store',
                                fields: ['display', 'value'],
                                data: [
                                    {display: 'Release', value: true},
                                    {display: 'Stage', value: false}
                                ]
                            },
                        }
                    ]
                }
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (comp) {
                        var win = comp.ownerCt.ownerCt;
                        var form = win.down('form');
                        if (form.isValid()) {
                            var data = form.getValue();
                            // http://localhost/cgp-rest/api/productCategories/27858804/isRelease?isRelease=false
                            var url = adminPath + `api/productCategories/${record.get('id')}/isRelease?isRelease=${data.mode}`;
                            JSAjaxRequest(url, 'PUT', true, null, '修改模式成功', function (require, success, response) {
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    if (responseText.success) {
                                        record.set('isRelease', data.mode);
                                        if (tree) {
                                            var treeStore = tree.getStore();
                                            treeStore.load({
                                                node: record,
                                                callback: function (records) {
                                                    var refreshNode = treeStore.getNodeById(record.getId());
                                                    tree.getSelectionModel().select(refreshNode);
                                                }
                                            });
                                        }
                                        if (win) {
                                            win.close();
                                        }
                                    }
                                }
                            }, true);
                        }
                    }
                }
            }
        }).show();
    },
    /**
     *
     * @param tree
     * @param node
     * @param categoryName
     * @param win
     * @param targetNode 移动的目标节点
     */
    modify: function (tree, node, newData, win, targetNode) {
        var me = this;
        var jsonData = Ext.Object.merge({
            "id": node.getId(),
            "name": node.get('name'),
            "parentId": node.get('parentId'),
            "clazz": node.get('clazz'),
            "showAsProductCatalog": node.get('showAsProductCatalog') ?? true,
            "sortOrder": node.get('sortOrder'),
            "invisible": node.get('invisible'),
            "leaf": node.get('leaf'),
            "isMain": node.get('isMain'),
            "website": node.get('website'),
            "status": 1
        }, newData);
        if (Ext.isEmpty(node.get('parentId')) || node.get('parentId') == 'root') {
            delete jsonData.parentId;
        }
        var request = {
            url: adminPath + 'api/productCategories/' + node.getId(),
            method: 'PUT',
            jsonData: jsonData,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                var data = responseMessage.data;
                if (responseMessage.success) {
                    node.set('name', newData.name);
                    node.set('sortOrder', newData.sortOrder);
                    if (targetNode && targetNode.get('leaf')) {
                        targetNode.set('leaf', false);
                        me.modify(null, targetNode);
                    }
                    if (tree) {
                        var treeStore = tree.getStore();
                        treeStore.load({
                            node: node,
                            callback: function (records) {
                                var refreshNode = treeStore.getNodeById(node.getId());
                                tree.getSelectionModel().select(refreshNode);
                            }
                        });
                    }
                    if (win) {
                        win.close();
                    }
                } else {
                    Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        };
        Ext.Ajax.request(request);
    },
    /**
     * 产品转移到指定类目
     * @param catalogId
     * @param store
     * @param productOfCatalogIds
     */
    categoryMoveProducts: function (catalogId, store, productOfCatalogIds, win) {
        var request = {
            url: adminPath + 'api/product-of-catalog/batchMoveCatalog?catalogId=' + catalogId,
            method: 'PUT',
            jsonData: productOfCatalogIds,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                var data = responseMessage.data;
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('move') + i18n.getKey('success') + '!');
                    store.load();
                    win.close();
                } else {
                    Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        };
        Ext.Ajax.request(request);
    },
    /**
     * 批量删除产品
     * @param store
     * @param ProductCatalogIds
     */
    batchDeleteProducts: function (store, ProductCatalogIds) {
        var request = {
            url: adminPath + 'api/product-of-catalog',
            method: 'DELETE',
            jsonData: ProductCatalogIds,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                var data = responseMessage.data;
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('delete') + i18n.getKey('success') + '!');
                    store.load();
                } else {
                    Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        };
        Ext.Ajax.request(request);
    },

    getCatalogProduct: function (productId, treePanel) {

        var store = treePanel.store;
        ///todo:set real url
        Ext.Ajax.request({
            url: adminPath + 'api/materials/' + parseInt(productId),
            method: 'GET',
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    var category = responseMessage.data.category;
                    if (!Ext.isEmpty(category)) {
                        var oldUrl = store.proxy.url;
                        store.proxy.url = store.proxy.url.replace(/[{][a-zA-z]+[}]/, category);
                        store.load({
                            params: {
                                filter: '[{"name":"isQueryChildren","value":false,"type":"boolean"}]'
                            },
                            callback: function () {
                                treePanel.getSelectionModel().select(arguments[0][0]);
                            }
                        });
                        store.proxy.url = oldUrl;
                    }
                } else {
                    Ext.Msg.alert(i18n.getKey('prompt'), '没有该产品')
                }
            },
            failure: function (response) {
                var response = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },

    editProductCatalog: function (store, rowIndex) {
        var me = this;
        var record = store.getAt(rowIndex);
        var rawData = record.data;
        Ext.create('Ext.window.Window', {
            modal: true,
            constrain: true,
            title: i18n.getKey('edit') + Ext.String.format("({0})", record.get('_id')),
            layout: "fit",
            items: [
                Ext.create("CGP.productcatalog.view.ProductCatalogForm", {
                    itemId: 'wform',
                    data: record.data
                })
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var formComp = win.getComponent('wform');
                        if (formComp.isValid()) {
                            var data = formComp.getValue();
                            data = Ext.Object.merge(rawData, data);
                            me.saveProductCatalog(data, store, win);
                        }
                    }
                }
            },
        }).show();
    },

    saveProductCatalog: function (data, store, wind) {
        var url = adminPath + 'api/product-of-catalog/' + data._id;
        JSAjaxRequest(url, "PUT", true, data, null, function (require, success, response) {
            var responseText = Ext.JSON.decode(response.responseText);
            if (responseText.success) {
                wind.close();
                store.load();
            }
        }, true);
    },
    /**
     * 显示下一步处理的弹窗
     * @param data
     * @param store
     * @param wind
     */
    showNextStepWin: function (result, selectedRecord, catalogId, win) {
        var storeData = [];
        for (var i = 0; i < selectedRecord.length; i++) {
            var product = selectedRecord.items[i]
            var priority = 0;
            var productImage = null;
            result.map(function (item) {
                if (item.product.id == product.id) {
                    priority = item.globalPriority;
                    productImage = item.defaultImageInCatalog;
                }
            })
            storeData.push({
                productImage: productImage,
                priority: priority,
                clazz: 'com.qpp.cgp.domain.cms.ProductOfCatalog',
                product: product,
                catalog: {
                    _id: catalogId,
                    clazz: "com.qpp.cgp.domain.product.category.SubProductCategory"
                }
            })
        }
        var nextWin = Ext.create('Ext.window.Window', {
            modal: true,
            constrain: true,
            title: i18n.getKey('配置分类页中产品信息'),
            layout: 'fit',
            lastStepWin: win,
            items: [
                {
                    xtype: 'grid',
                    width: 1200,
                    minHeight: 300,
                    maxHeight: 600,
                    store: {
                        fields: [
                            {
                                name: 'productImage',
                                type: 'object'
                            },
                            {
                                name: 'hoverImage',
                                type: 'object'
                            },
                            {
                                name: 'priority',
                                type: 'number'
                            }, {
                                name: 'product',
                                type: 'object'
                            }, {
                                name: 'catalog',
                                type: 'object'
                            }, {
                                name: 'clazz',
                                type: 'string'
                            }
                        ],
                        data: storeData
                    },
                    columns: [
                        {
                            text: i18n.getKey('product') + i18n.getKey('id'),
                            width: 100,
                            dataIndex: 'product',
                            renderer: function (value, metadata, record) {
                                var product = record.raw.product;
                                return product.id;
                            }
                        },
                        {
                            text: i18n.getKey('product') + i18n.getKey('info'),
                            dataIndex: 'product',
                            width: 300,
                            renderer: function (value, metadata, record) {
                                var product = record.raw.product;
                                var items = [{
                                    title: i18n.getKey('productMode'),
                                    value: product.mode
                                }, {
                                    title: i18n.getKey('model'),
                                    value: product.model
                                }, {
                                    title: i18n.getKey('name'),
                                    value: product.name
                                }, {
                                    title: i18n.getKey('type'),
                                    value: product.type
                                }];
                                return JSCreateHTMLTable(items);
                            }
                        },
                        {
                            text: i18n.getKey('priority'),
                            width: 120,
                            dataIndex: 'priority',
                            xtype: 'componentcolumn',
                            renderer: function (value, metadata, record) {
                                return {
                                    xtype: 'numberfield',
                                    value: value,
                                    name: 'priority',
                                    itemId: 'priority',
                                    allowBlank: true,
                                    listeners: {
                                        change: function (field, newValue, oldValue) {
                                            record.beginEdit();
                                            record.set('priority', newValue);
                                            record.endEdit(true);
                                        }
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'componentcolumn',
                            text: i18n.getKey('分类页中的产品图'),
                            dataIndex: 'productImage',
                            flex: 1,
                            renderer: function (value, metadata, record) {
                                var product = record.get('product'),
                                    productId = product?.id;
                                return {
                                    xtype: 'fileuploadv2',
                                    name: 'productImage',
                                    itemId: 'productImage',
                                    allowBlank: false,
                                    fieldLabel: null,
                                    allowFileType: ['image/*'],
                                    valueUrlType: 'object',
                                    diyGetValue: function () {
                                        var me = this;
                                        var filePath = me.getComponent('filePath');
                                        var fileName = filePath.getValue();
                                        if (fileName) {
                                            return me.rawData;
                                        } else {
                                            return null;
                                        }
                                    },
                                    diySetValue: function (data) {
                                        var me = this;
                                        if (data) {
                                            me.rawData = data;
                                            me.setValue(data);
                                        }
                                    },
                                    extraButton: [
                                        {
                                            xtype: 'button',
                                            margin: '0 0 5 5',
                                            width: 60,
                                            itemId: 'selProductImage',
                                            text: i18n.getKey('选产品图'),
                                            handler: function (btn) {
                                                var controller = Ext.create('CGP.cmsconfig.controller.Controller'),
                                                    fileuploadv2 = btn.ownerCt.ownerCt,
                                                    queryData = controller.getCmsConfigsProductImage(productId),
                                                    store = Ext.create('Ext.data.Store', {
                                                        fields: [
                                                            {
                                                                name: '_id',
                                                                type: 'string',
                                                            },
                                                            {
                                                                name: 'pageTitle',
                                                                type: 'string',
                                                            },
                                                            {
                                                                name: 'small',
                                                                type: 'object'
                                                            },
                                                            {
                                                                name: 'large',
                                                                type: 'object'
                                                            },
                                                            {
                                                                name: 'title',
                                                                type: 'string'
                                                            },
                                                            {
                                                                name: 'alt',
                                                                type: 'string'
                                                            },
                                                        ],
                                                        pageSize: 10000,
                                                        autoLoad: true,
                                                        proxy: {
                                                            type: 'memory'
                                                        },
                                                        groupField: '_id',
                                                        data: queryData || []
                                                    });

                                                controller.createSelProductImageWin(true, store, function (record) {
                                                    fileuploadv2.diySetValue(record.get('large'));
                                                });
                                            }
                                        },
                                    ],
                                    listeners: {
                                        afterrender: function (field) {
                                            field.setValue(value);
                                        },
                                        change: function (field, newValue, oldValue) {
                                            record.beginEdit();
                                            record.set('productImage', field.ownerCt.rawData);
                                            record.endEdit(true);
                                        },
                                    },
                                }
                            }
                        },
                        {
                            xtype: 'componentcolumn',
                            text: i18n.getKey('产品hover图'),
                            dataIndex: 'hoverImage',
                            flex: 1,
                            renderer: function (value, metadata, record) {
                                var product = record.get('product'),
                                    productId = product?.id;
                                return {
                                    xtype: 'fileuploadv2',
                                    name: 'hoverImage',
                                    itemId: 'hoverImage',
                                    fieldLabel: null,
                                    allowFileType: ['image/*'],
                                    allowBlank: true,
                                    editable: true,
                                    isShowImage: true,        //是否显示预览图
                                    height: 90,
                                    valueUrlType: 'object',   //完整路径 full, 部分路径 part, 文件信息 object
                                    diyGetValue: function () {
                                        var me = this;
                                        var filePath = me.getComponent('filePath');
                                        var fileName = filePath.getValue();
                                        if (fileName) {
                                            return me.rawData;
                                        } else {
                                            return null;
                                        }
                                    },
                                    diySetValue: function (data) {
                                        var me = this;
                                        if (data) {
                                            me.rawData = data;
                                            me.setValue(data);
                                        }
                                    },
                                    extraButton: [
                                        {
                                            xtype: 'button',
                                            margin: '0 0 5 5',
                                            width: 60,
                                            itemId: 'selProductImage',
                                            text: i18n.getKey('选产品图'),
                                            handler: function (btn) {
                                                var controller = Ext.create('CGP.cmsconfig.controller.Controller'),
                                                    fileuploadv2 = btn.ownerCt.ownerCt,
                                                    queryData = controller.getCmsConfigsProductImage(productId),
                                                    store = Ext.create('Ext.data.Store', {
                                                        fields: [
                                                            {
                                                                name: '_id',
                                                                type: 'string',
                                                            },
                                                            {
                                                                name: 'pageTitle',
                                                                type: 'string',
                                                            },
                                                            {
                                                                name: 'small',
                                                                type: 'object'
                                                            },
                                                            {
                                                                name: 'large',
                                                                type: 'object'
                                                            },
                                                            {
                                                                name: 'title',
                                                                type: 'string'
                                                            },
                                                            {
                                                                name: 'alt',
                                                                type: 'string'
                                                            },
                                                        ],
                                                        pageSize: 10000,
                                                        autoLoad: true,
                                                        proxy: {
                                                            type: 'memory'
                                                        },
                                                        groupField: '_id',
                                                        data: queryData || []
                                                    });

                                                controller.createSelProductImageWin(true, store, function (record) {
                                                    fileuploadv2.diySetValue(record.get('large'));
                                                });
                                            }
                                        },
                                    ],
                                    listeners: {
                                        afterrender: function (field) {
                                            field.setValue(value);
                                        },
                                        change: function (field, newValue, oldValue) {
                                            record.beginEdit();
                                            record.set('hoverImage', field.ownerCt.rawData);
                                            record.endEdit(true);
                                        },
                                    },
                                }
                            }
                        },
                    ],
                    isValid: function () {
                        var me = this;
                        var isValid = true;
                        var fileUploadFieldArr = me.query('[xtype=fileuploadv2]') || [];
                        fileUploadFieldArr.map(function (item) {
                            if (item.isValid() == false) {
                                isValid = false;
                            }
                        });
                        return isValid;
                    }
                }
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                lastStepBtnCfg: {
                    hidden: false,
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        win.lastStepWin.show();
                        win.close();
                    }
                },
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var grid = win.items.items[0];
                        if (grid.isValid()) {
                            var store = grid.store;
                            console.log(store.items);
                            var jsonData = store.data.items.map(function (item) {
                                var data = item.getData();
                                data.product = {
                                    id: data.product.id,
                                    type: data.product.type.toLowerCase(),
                                }
                                return data;
                            });
                            var url = adminPath + 'api/product-of-catalog/' + win.lastStepWin.catalogId + '/batchCatalogs';
                            JSAjaxRequest(url, "POST", true, jsonData, null, function (require, success, response) {
                                var responseText = Ext.JSON.decode(response.responseText)
                                win.lastStepWin.productStore.load();
                                win.lastStepWin.close();
                                win.close();
                            }, true);
                        }
                    }
                }
            }
        });
        nextWin.show();
    },


    //查询
    getQuery: function (url, otherConfig) {
        var data = [];

        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        }, false, otherConfig);
        return data;
    },

    //删除
    deleteQuery: function (url, callBack, otherConfig) {
        JSAjaxRequest(url, 'DELETE', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    callBack && callBack();
                }
            }
        }, true, otherConfig)
    },

    //异步修改存在加载动画
    asyncEditQuery: function (url, jsonData, isEdit, callFn, hideMsg, otherConfig) {
        var method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';

        JSAjaxRequest(url, method, true, jsonData, !hideMsg && successMsg, callFn, true, otherConfig);
    },

    getAttributeProfileData: function (productId, versionedAttributeId) {
        var controller = this,
            filterParams = [
                {
                    name: 'productId',
                    value: productId,
                    type: 'number'
                }
            ];

        if (versionedAttributeId) {
            filterParams.push({
                "value": versionedAttributeId,
                "type": "number",
                "name": "versionedAttribute._id"
            })
        }

        var url = adminPath + 'api/attributeProfile?page=1&limit=10000&filter=' + Ext.JSON.encode(filterParams),
            queryData = controller.getQuery(url);

        return queryData;
    },

    extractUniqueAttributes: function (data) {
        const attributeMap = new Map();

        data.forEach(item => {
            const {name: profileName, _id: profileId} = item;

            item?.groups?.forEach(group => {
                const {name: groupName, _id: groupId} = group;

                group?.attributes?.forEach(attr => {
                    if (!attr?.attribute) return;

                    const attrId = attr.id;
                    const attribute = attr.attribute;

                    if (!attributeMap.has(attrId)) {
                        attribute.profiles = [{
                            _id: profileId,
                            profileName: profileName,
                            groups: [{
                                _id: groupId,
                                groupName: `${groupName}(${groupId})`
                            }]
                        }];
                        attributeMap.set(attrId, attribute);
                    } else {
                        const existingAttr = attributeMap.get(attrId);
                        const profileIndex = existingAttr.profiles.findIndex(
                            p => p._id === profileId
                        );

                        if (profileIndex === -1) {
                            existingAttr.profiles.push({
                                _id: profileId,
                                profileName: profileName,
                                groups: [{
                                    _id: groupId,
                                    groupName: `${groupName}(${groupId})`
                                }]
                            });
                        } else {
                            const groupExists = existingAttr.profiles[profileIndex]
                                .groups.some(g => g._id === groupId);

                            if (!groupExists) {
                                existingAttr.profiles[profileIndex].groups.push({
                                    _id: groupId,
                                    groupName: `${groupName}(${groupId})`
                                });
                            }
                        }
                    }
                });
            });
        });

        return Array.from(attributeMap.values());
    },

    // 获取产品类目的所有产品
    getProductCatalogProductGather: function (catalogId) {
        var controller = this,
            url = adminPath + `api/product-of-catalog/catalogs/${catalogId}?page=1&start=0&limit=10000`,
            queryData = controller.getQuery(url),
            productIdGather = queryData.map(item => {
                var {product} = item;
                return product['id']
            })

        return productIdGather;
    },

    //获取所有产品的产品属性分组
    getProductProfileGather: function (catalogId) {
        var controller = this,
            productIdGather = controller.getProductCatalogProductGather(catalogId),
            result = [];

        productIdGather?.forEach(item => {
            result = Ext.Array.merge(result, controller.getAttributeProfileData(+item));
        })

        return result;
    },

    // 更新配置数据
    upDataStoreConfigDataHandler: function (catalogId, id, postData, callBack) {
        var controller = this,
            isEdit = !!id,
            serverAim = `api/cms/product-catalogs/property-configs`,
            suffix = isEdit ? `/${id}` : '',
            url = adminPath + `${serverAim}${suffix}`;

        postData['clazz'] = 'com.qpp.cgp.domain.cms.CMSProductPropertyOfCatalog';
        postData['catalog'] = {
            id: catalogId,
            clazz: 'com.qpp.cgp.domain.product.category.SubProductCategory'
        };
        controller.asyncEditQuery(url, postData, isEdit, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    const data = responseText.data;
                    callBack && callBack(data);
                }
            }
        })
    },

    // 删除配置数据
    deleteStoreConfigDataHandler: function (id, callBack) {
        var controller = this,
            url = adminPath + `api/cms/product-catalogs/property-configs/${id}`;

        Ext.Msg.confirm('提示', '确定删除？', function (selector) {
            if (selector === 'yes') {
                controller.deleteQuery(url, callBack);
            }
        });
    },

    getFilterOptionsArr: function (data, needFilterId) {
        var result = [];

        data.forEach(item => {
            if (!needFilterId.includes(item['id'])) {
                result.push(item)
            }
        })

        return result;
    },

    getFilteredValues: function (filters, data) {
        return data.filter(item => {
            return filters.every(filter => {
                const {name, value, type, operator = 'exactMatch'} = filter;

                // 获取嵌套属性值
                const props = name.split('.');
                let current = item;
                for (const prop of props) {
                    if (!current || typeof current !== 'object') return false;
                    current = current[prop];
                    if (current === undefined) return false;
                }

                // 类型检查
                if (type && typeof current !== type) return false;

                // 处理模糊查询语法
                if (typeof value === 'string' && value.startsWith('%') && value.endsWith('%')) {
                    const searchText = value.slice(1, -1);
                    return String(current).includes(searchText);
                }

                // 值匹配逻辑
                switch (operator) {
                    case 'exactMatch':
                        return current === value;
                    case 'contains':
                        return String(current).includes(String(value));
                    case 'startsWith':
                        return String(current).startsWith(String(value));
                    case 'endsWith':
                        return String(current).endsWith(String(value));
                    default:
                        return current == value;
                }
            });
        });
    },


    // 属性组件配置
    createAttributeCompConfigFormWindow: function (catalogId, data, callBack) {
        var controller = this,
            productAttributeStoreMemory = Ext.create('CGP.productcatalog.store.StoreConfigStore', {
                params: {
                    filter: Ext.JSON.encode([
                        {
                            "name": "catalog.id",
                            "type": "number",
                            "value": catalogId
                        },
                    ])
                }
            }),
            optionsStore = Ext.create('Ext.data.Store', {
                fields: [
                    {
                        name: 'optionId',
                        type: 'string'
                    },
                    {
                        name: 'displayName',
                        type: 'string'
                    },
                    {
                        name: 'imageUrl',
                        type: 'string'
                    },
                    {
                        name: 'shortDesc',
                        type: 'string'
                    },
                    {
                        name: 'sortOrder',
                        type: 'number'
                    }
                ],
                proxy: {
                    type: 'memory'
                },
                autoLoad: true,
                data: []
            }),
            attributeProfile = controller.getProductProfileGather(catalogId),
            attributeGatherArr = controller.extractUniqueAttributes(attributeProfile),
            attributeOptionsStore = Ext.create('Ext.data.Store', {
                fields: [
                    {
                        name: 'id',
                        type: 'number'
                    },
                    {
                        name: 'name',
                        type: 'string'
                    },
                    {
                        name: 'value',
                        type: 'string'
                    },
                    {
                        name: 'displayValue',
                        type: 'string'
                    },
                    {
                        name: 'sortOrder',
                        type: 'number'
                    }
                ],
                sorters: [{
                    property: 'sortOrder',
                    direction: 'ASC'
                }],
                pageSize: 10000,
                proxy: {
                    type: 'pagingmemory'
                },
                autoLoad: true,
                data: []
            }),
            productAttributeStore = Ext.create('CGP.cmsconfig.store.productAttributeStore', {
                productId: null,
                pageSize: 10000,
                data: attributeGatherArr || []
            });

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('属性组件配置'),
            width: 1200,
            height: 500,
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    defaults: {
                        allowBlank: true
                    },
                    layout: 'fit',
                    diyGetValue: function () {
                        var me = this,
                            result = null,
                            items = me.items.items;
                        items.forEach(item => {
                            result = item.diyGetValue ? item.diyGetValue() : item.getValue()
                        })
                        return result;
                    },
                    diySetValue: function (data) {
                        var me = this,
                            items = me.items.items;
                        items.forEach(item => {
                            var {name} = item;
                            item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name])
                        })
                    },
                    items: [
                        {
                            xtype: 'gridfieldwithcrudv2',
                            name: 'properties',
                            itemId: 'properties',
                            allowBlank: true,
                            productAttributeStore: productAttributeStore,
                            gridConfig: {
                                store: productAttributeStoreMemory,
                                layout: 'fit',
                                deleteHandler: function (view, rowIndex, colIndex, icon, event, record) {
                                    var id = record.get('_id'),
                                        grid = view.ownerCt;

                                    controller.deleteStoreConfigDataHandler(id, function () {
                                        grid.store.load();
                                    })
                                },
                                columns: [
                                    {
                                        xtype: 'rownumberer',
                                        tdCls: 'vertical-middle',
                                        width: 50
                                    },
                                    {
                                        text: i18n.getKey('attribute'),
                                        width: 150,
                                        dataIndex: 'attribute',
                                        isLike: false,
                                        xtype: 'atagcolumn',
                                        getDisplayName: function (value, mateData, record) {
                                            var me = this;
                                            var items = [
                                                {
                                                    title: i18n.getKey('id'),
                                                    value: '<a href="#">' + value.id + '</a>'
                                                },
                                                {
                                                    title: i18n.getKey('name'),
                                                    value: value.name
                                                },
                                                {
                                                    title: i18n.getKey('值输入方式'),
                                                    value: value.selectType === 'MULTI' ? '多选' : '单选'
                                                }
                                            ]
                                            return JSCreateHTMLTable(items);
                                        },
                                        clickHandler: function (value) {
                                            JSOpen({
                                                id: 'attributepage',
                                                url: path + 'partials/attribute/attribute.html?attributeId=' + value.id,
                                                title: i18n.getKey('attribute'),
                                                refresh: true
                                            });
                                        }
                                    },
                                    {
                                        text: i18n.getKey('所属profile'),
                                        dataIndex: 'componentType',
                                        width: 100,
                                        renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                                            var attributeId = record.get('attribute')?.id;
                                            var attributeRecord = productAttributeStore?.findRecord('id', attributeId);
                                            var profiles = attributeRecord?.raw?.profiles;
                                            var data = profiles?.map(function (item) {
                                                return item.profileName;
                                            })
                                            return data ? JSAutoWordWrapStr(data?.toString()) : ''
                                        }
                                    },
                                    {
                                        text: i18n.getKey('component') + i18n.getKey('type'),
                                        dataIndex: 'componentType',
                                        width: 70
                                    },
                                    {
                                        text: i18n.getKey('属性简述'),
                                        dataIndex: 'shortDesc',
                                        width: 150,
                                        renderer: function (value, metaData, record) {
                                            metaData.tdAttr = 'data-qtip="' + value + '"';
                                            return value;
                                        }
                                    },
                                    {
                                        text: i18n.getKey('属性名称别名'),
                                        dataIndex: 'nickName',
                                        width: 120,
                                        renderer: function (value, metaData, record) {
                                            metaData.tdAttr = 'data-qtip="' + value + '"';
                                            return value;
                                        }
                                    },
                                    {
                                        text: i18n.getKey('提示信息'),
                                        dataIndex: 'guideUrl',
                                        flex: 1,
                                        renderer: function (value, metaData, record) {
                                            var items = [];
                                            var guidName = record.get('guideName');
                                            if (guidName) {
                                                items.push({
                                                    title: i18n.getKey('提示按钮名称'),
                                                    value: guidName
                                                })
                                            }
                                            if (value) {
                                                items.push({
                                                    title: i18n.getKey('提示信息跳转地址'),
                                                    value: value
                                                })
                                            }
                                            return JSAutoWordWrapStr(JSCreateHTMLTable(items));
                                        }
                                    },
                                ]
                            },
                            winConfig: {
                                // 这里管编辑
                                setValueHandler: function (data) {
                                    var win = this,
                                        form = win.getComponent('form'),
                                        createOrEdit = win.createOrEdit,
                                        productAttributeStoreMemoryData = controller.getProductAttributeStoreMemoryData(catalogId),
                                        selectAttributeId = data?.attribute?.id,
                                        needFilterId = productAttributeStoreMemoryData?.map(item => {
                                            if (selectAttributeId !== item?.attribute?.id) {
                                                return item?.attribute?.id;
                                            }
                                        }),
                                        storeData = JSON.parse(JSON.stringify(attributeGatherArr)),
                                        result = controller.getFilterAttributeData(storeData, needFilterId)

                                    productAttributeStore.proxy.data = result;
                                    productAttributeStore.load();
                                    form.setValue(data);
                                },
                                formConfig: {
                                    saveHandler: function (btn) {
                                        var form = btn.ownerCt.ownerCt,
                                            win = form.ownerCt;
                                        if (form.isValid()) {
                                            var data = form.getValue(),
                                                id = data?._id;

                                            controller.upDataStoreConfigDataHandler(catalogId, id, data, function (result) {
                                                win.outGrid.store.load();
                                                win.close();
                                            })
                                        }
                                    },
                                    defaults: {
                                        msgTarget: 'none',
                                        margin: '10 25',
                                        width: 450,
                                        labelWidth: 120,
                                    },
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            hidden: true,
                                            name: '_id',
                                            itemId: '_id',
                                            allowBlank: true,
                                            fieldLabel: i18n.getKey('id'),
                                        },
                                        {
                                            xtype: 'gridcombo',
                                            itemId: 'attribute',
                                            name: 'attribute',
                                            fieldLabel: i18n.getKey('属性名称'),
                                            tipInfo: '属性选择范围是对应产品下的profile分组内的所有可配置属性,取并集!',
                                            allowBlank: false,
                                            editable: false,
                                            matchFieldWidth: false,
                                            multiSelect: false,
                                            displayField: 'name',
                                            valueField: 'id',
                                            lastQuery: '',
                                            gotoConfigHandler: function (event) {
                                                var me = this;
                                                var attributeId = this.getSubmitValue()[0];
                                                if (attributeId) {
                                                    JSOpen({
                                                        id: 'attributepage',
                                                        url: path + 'partials/attribute/attribute.html?attributeId=' + attributeId,
                                                        title: i18n.getKey('attribute'),
                                                        refresh: true
                                                    });
                                                }
                                            },
                                            setOptionsConfigVisible: function (isVisible) {
                                                var me = this,
                                                    form = me.ownerCt,
                                                    optionsComp = form.getComponent('options'),
                                                    grid = optionsComp?._grid;

                                                if (grid) {
                                                    grid.store.proxy.data = [];
                                                    grid.store.load();
                                                }

                                                optionsComp.setVisible(isVisible);
                                            },
                                            diySetValue: function (data) {
                                                if (data) {
                                                    var me = this,
                                                        storeData = me.store.proxy.data;

                                                    storeData?.forEach(item => {
                                                        if (+item['id'] === +data['id']) {
                                                            me.setValue(item);
                                                        }
                                                    })
                                                }
                                            },
                                            store: productAttributeStore,
                                            filterCfg: {
                                                mixHeight: 60,
                                                searchActionHandler: function (btn) { //重写本地查询
                                                    var me = this,
                                                        form = me.ownerCt.ownerCt,
                                                        grid = form.ownerCt,
                                                        store = grid.store,
                                                        filterData = form.getQuery()

                                                    if (filterData.length) {
                                                        store.proxy.data = controller.getFilteredValues(filterData, attributeGatherArr);
                                                    } else {
                                                        store.proxy.data = attributeGatherArr;
                                                    }
                                                    store.load();
                                                },
                                                layout: {
                                                    type: 'table',
                                                    columns: 3
                                                },
                                                defaults: {
                                                    isLike: false
                                                },
                                                items: [
                                                    {
                                                        xtype: 'numberfield',
                                                        name: 'id',
                                                        itemId: 'id',
                                                        hideTrigger: true,
                                                        fieldLabel: i18n.getKey('id'),
                                                    },
                                                    {
                                                        xtype: 'textfield',
                                                        name: 'name',
                                                        itemId: 'name',
                                                        fieldLabel: i18n.getKey('name'),
                                                    },
                                                    {
                                                        xtype: 'combo',
                                                        name: 'valueType',
                                                        itemId: 'valueType',
                                                        fieldLabel: i18n.getKey('值类型'),
                                                        editable: false,
                                                        haveReset: true,
                                                        valueField: 'value',
                                                        displayField: 'display',
                                                        store: Ext.create('Ext.data.Store', {
                                                            fields: [
                                                                'value', 'display'
                                                            ],
                                                            data: [
                                                                {
                                                                    value: 'String',
                                                                    display: 'String'
                                                                }, {
                                                                    value: 'Number',
                                                                    display: 'Number'
                                                                }, {
                                                                    value: 'Boolean',
                                                                    display: 'Boolean'
                                                                }
                                                            ]
                                                        }),
                                                    },
                                                ]
                                            },

                                            gridCfg: {
                                                store: productAttributeStore,
                                                height: 400,
                                                width: 1000,
                                                autoScroll: true,
                                                selType: 'rowmodel',
                                                columns: [
                                                    {
                                                        text: i18n.getKey('id'),
                                                        width: 100,
                                                        dataIndex: 'id',
                                                        itemId: 'id',
                                                        sortable: true
                                                    },
                                                    {
                                                        text: i18n.getKey('name'),
                                                        dataIndex: 'name',
                                                        width: 165,
                                                        itemId: 'name',
                                                        sortable: true
                                                    },
                                                    {
                                                        text: i18n.getKey('所属profile'),
                                                        dataIndex: 'componentType',
                                                        renderer: function (value, metaData, record) {
                                                            var profiles = record.raw.profiles;
                                                            var data = profiles.map(function (item) {
                                                                return item.profileName;
                                                            })
                                                            return JSAutoWordWrapStr(data.toString())
                                                        }
                                                    },
                                                    {
                                                        text: i18n.getKey('valueType'),
                                                        dataIndex: 'valueType',
                                                        width: 120,
                                                        itemId: 'valueType',
                                                        sortable: true
                                                    },
                                                    {
                                                        text: i18n.getKey('值输入方式'),
                                                        dataIndex: 'selectType',
                                                        width: 120,
                                                        itemId: 'selectType',
                                                        sortable: true,
                                                        renderer: function (value, mate, record) {
                                                            if (value == 'NON') {
                                                                return '手动输入';
                                                            } else if (value == 'MULTI') {
                                                                return '多选';
                                                            } else {
                                                                return '单选';
                                                            }
                                                        }
                                                    },
                                                    {
                                                        text: i18n.getKey('options'),
                                                        dataIndex: 'options',
                                                        flex: 1,
                                                        xtype: 'uxarraycolumnv2',
                                                        itemId: 'options',
                                                        sortable: false,
                                                        maxLineCount: 5,
                                                        lineNumber: 2,
                                                        minWidth: 200,
                                                        showContext: function (id, title) {//自定义展示多数据时的方式
                                                            var store = window.store;
                                                            var record = store.findRecord('id', id);
                                                            var data = [];
                                                            for (var i = 0; i < record.get('options').length; i++) {
                                                                data.push({
                                                                    option: record.get('options')[i].name
                                                                });
                                                            }
                                                            var win = Ext.create('Ext.window.Window', {
                                                                title: i18n.getKey('check') + i18n.getKey('options'),
                                                                height: 250,
                                                                width: 350,
                                                                layout: 'fit',
                                                                model: true,
                                                                items: {
                                                                    xtype: 'grid',
                                                                    border: false,
                                                                    autoScroll: true,
                                                                    columns: [
                                                                        {
                                                                            width: 50,
                                                                            sortable: false,
                                                                            xtype: 'rownumberer'
                                                                        },
                                                                        {
                                                                            flex: 1,
                                                                            text: i18n.getKey('options'),
                                                                            dataIndex: 'option',
                                                                            sortable: false,
                                                                            menuDisabled: true,
                                                                            renderer: function (value) {
                                                                                return value;
                                                                            }
                                                                        }

                                                                    ],
                                                                    store: Ext.create('Ext.data.Store', {
                                                                        fields: [
                                                                            {name: 'option', type: 'string'}
                                                                        ],
                                                                        data: data
                                                                    })
                                                                }
                                                            }).show();
                                                        },
                                                        renderer: function (v, record) {
                                                            if (record.get('valueType') == 'Color') {
                                                                var colorName = v['name'];
                                                                var color = v['value'];
                                                                var colorBlock = new Ext.Template('<a class=colorpick style="background-color:{color}"></a>').apply({
                                                                    color: color
                                                                });
                                                                return colorName + colorBlock;
                                                            }
                                                            return v['name'];
                                                        }
                                                    }
                                                ],
                                            },
                                            listeners: {
                                                change: function (field, newValue, oldValue) {
                                                    var componentType = field.ownerCt.getComponent('componentType');
                                                    var data = field.getArrayValue();

                                                    if (newValue && data) {
                                                        var recordId = data.id,
                                                            selectType = data.selectType,
                                                            isVisible = ['SINGLE', 'MULTI'].includes(selectType),
                                                            rawData = field.store.proxy.reader.rawData,
                                                            completeData = null;

                                                        rawData.map(function (item) {
                                                            if (item.id == recordId) {
                                                                completeData = item;
                                                            }
                                                        });
                                                        if (completeData) {
                                                            var selectType = completeData.selectType;
                                                            componentType.setDisabled(false);
                                                            var componentTypeArr = componentType.valueTypeMap[selectType]?.map(function (item) {
                                                                return {
                                                                    value: item,
                                                                    display: item
                                                                };
                                                            });
                                                            componentType.store.proxy.data = componentTypeArr;
                                                            componentType.store.load();
                                                            componentType.setValue();
                                                        } else {
                                                            console.log('找不到改属性')
                                                        }
                                                    } else {
                                                        componentType.setDisabled(true);
                                                    }
                                                    console.log(data)
                                                    field.setOptionsConfigVisible(isVisible);
                                                },
                                                expand: function () {
                                                    //已经添加了的属性列表
                                                    var excludeIds = [];
                                                    var win = this.ownerCt.ownerCt;
                                                    var data = win.outGrid.store.proxy.data;
                                                    data?.map(function (item) {
                                                        excludeIds.push(item.attribute.id);
                                                    });
                                                    if (win.record) {
                                                        var currentId = win.record.raw.attribute.id;
                                                        excludeIds.splice(excludeIds.indexOf(currentId), 1);
                                                    }
                                                    this.store.clearFilter();
                                                    this.store.load();
                                                    this.store.filter(function (item) {
                                                        return !Ext.Array.contains(excludeIds, item.getId());
                                                    });

                                                }
                                            }
                                        },
                                        {
                                            xtype: 'combo',
                                            name: 'componentType',
                                            editable: false,
                                            fieldLabel: i18n.getKey('component') + i18n.getKey('type'),
                                            tipInfo: '选择产品页展示属性内容的组件框架类型!',
                                            itemId: 'componentType',
                                            displayField: 'display',
                                            disabled: true,
                                            valueField: 'value',
                                            valueTypeMap: {
                                                "SINGLE": [
                                                    'Chip', 'Select', 'Radio'
                                                ],
                                                'MULTI': [
                                                    'Chip', 'Select', 'CheckBox'
                                                ],
                                                'NON': [
                                                    'Input', 'Slider'
                                                ]
                                            },
                                            store: {
                                                xtype: 'store',
                                                fields: ['display', 'value'],
                                                data: [],
                                                proxy: {
                                                    type: 'memory'
                                                }
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: i18n.getKey('提示按钮名称'),
                                            itemId: 'guideName',
                                            name: 'guideName',
                                            allowBlank: true,
                                        },
                                        {
                                            xtype: 'fileuploadv2',
                                            fieldLabel: i18n.getKey('提示信息跳转地址'),
                                            itemId: 'guideUrl',
                                            name: 'guideUrl',
                                            valueVtype: 'filePath',
                                            UpFieldLabel: i18n.getKey('image'),
                                            allowBlank: true,
                                            isShowImage: true,        //是否显示预览图
                                            imageSize: 50,            //预览图大小 width and height 也控制输入框大小
                                            valueUrlType: 'part',   //完整路径 full, 部分路径 part, 文件信息 object
                                        },
                                        {
                                            xtype: 'textarea',
                                            fieldLabel: i18n.getKey('属性简述'),
                                            allowBlank: true,
                                            itemId: 'shortDesc',
                                            name: 'shortDesc',
                                            height: 50,
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: i18n.getKey('属性名称别名'),
                                            allowBlank: true,
                                            itemId: 'nickName',
                                            name: 'nickName',
                                            tipInfo: '在产品页中,将默认使用属性名称,若配置别名将优先使用别名!',
                                        },
                                        {
                                            xtype: 'gridfieldwithcrudv2',
                                            name: 'options',
                                            itemId: 'options',
                                            fieldLabel: i18n.getKey('属性选项值配置'),
                                            allowBlank: true,
                                            width: 800,
                                            hidden: true,
                                            gridConfig: {
                                                tbar: {
                                                    hiddenButtons: ['read', 'clear', 'config', 'help', 'export', 'import'],
                                                    btnDelete: {
                                                        xtype: 'displayfield',
                                                        width: 200,
                                                        value: '选中行号拖拽调整选项顺序',
                                                        fieldStyle: {
                                                            color: 'red'
                                                        },
                                                    }
                                                },
                                                store: optionsStore,
                                                maxHeight: 300,
                                                layout: 'fit',
                                                viewConfig: {
                                                    enableTextSelection: true,
                                                    listeners: {
                                                        drop: function (node, Object, overModel, dropPosition, eOpts) {
                                                            var view = this;
                                                            this.store.suspendAutoSync();//挂起数据同步
                                                            view.ownerCt.suspendLayouts();
                                                            view.store.suspendEvents(true);//挂起事件粗触发，false表示丢弃事件，true表示阻塞事件队列*/
                                                            var data = this.store.data.items;
                                                            for (var i = 0; i < data.length; i++) {
                                                                data[i].index = i;
                                                                data[i].set('sortOrder', i);
                                                            }
                                                            this.store.sync({
                                                                callback: function () {
                                                                    view.store.resumeEvents();//恢复事件触发
                                                                    view.ownerCt.resumeLayouts();
                                                                }
                                                            });//同步数据
                                                        }
                                                    },
                                                    plugins: {
                                                        ptype: 'gridviewdragdrop',
                                                        dragText: 'Drag and drop to reorganize',
                                                    }
                                                },
                                                columns: [
                                                    {
                                                        xtype: 'rownumberer',
                                                        tdCls: 'vertical-middle',
                                                        align: 'center',
                                                        width: 60
                                                    },
                                                    {
                                                        text: i18n.getKey('选项编号'),
                                                        dataIndex: 'optionId',
                                                        width: 150,
                                                        renderer: function (value, metaData, record) {
                                                            metaData.tdAttr = 'data-qtip="' + value + '"';
                                                            return value;
                                                        }
                                                    },
                                                    {
                                                        xtype: 'imagecolumn',
                                                        text: i18n.getKey('图片'),
                                                        dataIndex: 'imageUrl',
                                                        width: 150,
                                                        buildUrl: function (value) {
                                                            var imgSize = '/100/100/png?' + Math.random();
                                                            return (imageServer + value + imgSize);
                                                        },
                                                        buildPreUrl: function (value) {
                                                            return (imageServer + value);
                                                        },
                                                        buildTitle: function (value, metadata, record) {
                                                            return `预览图`;
                                                        },
                                                    },
                                                    {
                                                        text: i18n.getKey('选项简述'),
                                                        dataIndex: 'shortDesc',
                                                        width: 150,
                                                        renderer: function (value, metaData, record) {
                                                            metaData.tdAttr = 'data-qtip="' + value + '"';
                                                            return value;
                                                        }
                                                    },
                                                    {
                                                        text: i18n.getKey('显示名称'),
                                                        dataIndex: 'displayName',
                                                        flex: 1,
                                                        renderer: function (value, metaData, record) {
                                                            metaData.tdAttr = 'data-qtip="' + value + '"';
                                                            return value;
                                                        }
                                                    },
                                                ]
                                            },
                                            winConfig: {
                                                formConfig: {
                                                    height: 300,
                                                    width: 600,
                                                    defaults: {
                                                        msgTarget: 'none',
                                                        margin: '10 25',
                                                        width: 450,
                                                        labelWidth: 120,
                                                        allowBlank: true
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'gridcombo',
                                                            fieldLabel: i18n.getKey('选项名称'),
                                                            name: 'optionId',
                                                            itemId: 'optionId',
                                                            valueField: 'id',
                                                            displayField: 'name',
                                                            allowBlank: false,
                                                            editable: false,
                                                            matchFieldWidth: false,
                                                            multiSelect: false,
                                                            store: attributeOptionsStore,
                                                            diyGetValue: function () {
                                                                var me = this,
                                                                    data = me.getArrayValue();

                                                                return data['id'];
                                                            },
                                                            diySetValue: function (data) {
                                                                JSSetLoading(true);
                                                                setTimeout(() => {
                                                                    if (data) {
                                                                        var me = this,
                                                                            storeData = me.store.proxy.data;

                                                                        storeData.forEach(item => {
                                                                            if (item['id'] === +data) {
                                                                                me.setValue(item);
                                                                            }
                                                                        })
                                                                    }
                                                                    JSSetLoading(false);
                                                                }, 1000)
                                                            },
                                                            gridCfg: {
                                                                store: attributeOptionsStore,
                                                                height: 300,
                                                                width: 600,
                                                                autoScroll: true,
                                                                selType: 'rowmodel',
                                                                columns: [
                                                                    {
                                                                        text: i18n.getKey('id'),
                                                                        dataIndex: 'id',
                                                                        itemId: 'id',
                                                                        sortable: true,
                                                                        width: 120
                                                                    },
                                                                    {
                                                                        text: i18n.getKey('name'),
                                                                        dataIndex: 'name',
                                                                        itemId: 'name',
                                                                        sortable: true,
                                                                        flex: 1,
                                                                    },
                                                                    {
                                                                        text: i18n.getKey('value'),
                                                                        dataIndex: 'value',
                                                                        itemId: 'value',
                                                                        sortable: true,
                                                                        flex: 1,
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            xtype: 'numberfield',
                                                            name: 'sortOrder',
                                                            itemId: 'sortOrder',
                                                            hidden: true,
                                                            fieldLabel: i18n.getKey('排序'),
                                                            value: 999
                                                        },
                                                        {
                                                            xtype: 'textarea',
                                                            name: 'displayName',
                                                            itemId: 'displayName',
                                                            allowBlank: false,
                                                            fieldLabel: i18n.getKey('显示值'),
                                                            height: 50
                                                        },
                                                        {
                                                            xtype: 'textarea',
                                                            name: 'shortDesc',
                                                            itemId: 'shortDesc',
                                                            fieldLabel: i18n.getKey('选项简述'),
                                                            height: 50
                                                        },
                                                        {
                                                            xtype: 'fileuploadv2',
                                                            width: 450,
                                                            hideTrigger: false,
                                                            isFormField: true,
                                                            isShowImage: true,
                                                            imageSize: 50,
                                                            valueUrlType: 'part',
                                                            allowFileType: ['image/*'],
                                                            msgTarget: 'none',
                                                            fieldLabel: i18n.getKey('图片'),
                                                            emptyText: '可自行输入 例: aa/bb/cc',
                                                            name: 'imageUrl',
                                                            itemId: 'imageUrl',
                                                            tipInfo: '产品页展示建议使用宽高比例为 3:4 的图片!',
                                                        },
                                                    ],
                                                    listeners: {
                                                        afterrender: function (form) {
                                                            var win = form.ownerCt,
                                                                record = win.record,
                                                                recordOptionId = record?.get('optionId'),
                                                                createOrEdit = win.createOrEdit,
                                                                isEdit = createOrEdit !== 'create',
                                                                optionIdComp = form.getComponent('optionId'),
                                                                optionsComp = win.outGrid,
                                                                ownerCtForm = optionsComp.ownerCt.ownerCt,
                                                                attributeComp = ownerCtForm.getComponent('attribute'),
                                                                attribute = attributeComp.getArrayValue(),
                                                                options = attribute['options'], //因为无法分辨选项是否被启用 所以更换
                                                                attributeOptions = attribute['attributeOptions'],
                                                                newOptions = (attributeOptions?.length) ? attributeOptions : options,
                                                                needFilterId = [];

                                                            optionsComp.store.proxy.data.forEach(item => {
                                                                if (isEdit) {
                                                                    if (item['optionId'] !== +recordOptionId) { //编辑排除本身optionId
                                                                        needFilterId.push(item['optionId'])
                                                                    }
                                                                } else {
                                                                    needFilterId.push(item['optionId'])
                                                                }
                                                            })

                                                            optionIdComp.store.proxy.data = controller.getFilterOptionsArr(newOptions, needFilterId);
                                                            optionIdComp.store.load();
                                                        }
                                                    }
                                                },
                                            },
                                        },
                                    ],
                                    listeners: {
                                        // 这里管新建
                                        afterrender: function (form) {
                                            var win = form.ownerCt,
                                                createOrEdit = win.createOrEdit,
                                                data = controller.getProductAttributeStoreMemoryData(catalogId),
                                                needFilterId = data?.map(item => {
                                                    return item?.attribute?.id;
                                                }),
                                                storeData = JSON.parse(JSON.stringify(attributeGatherArr)),
                                                result = controller.getFilterAttributeData(storeData, needFilterId)

                                            if (createOrEdit === 'create') {
                                                productAttributeStore.proxy.data = result;
                                                productAttributeStore.load();
                                            }

                                        }
                                    }
                                }
                            },
                        },
                    ],
                    listeners: {
                        afterrender: function (comp) {
                            data && comp.diySetValue(data);
                        }
                    }
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            form = win.getComponent('form'),
                            result = {};

                        callBack && callBack();
                        win.close();
                    }
                }
            },
        }).show();
    },

    // 获取产品属性本地库数据
    getProductAttributeStoreMemoryData: function (catalogId) {
        var controller = this,
            url = adminPath + 'api/cms/product-catalogs/property-configs?page=1&limit=25&filter=' + Ext.JSON.encode([
                {
                    "name": "catalog.id",
                    "type": "number",
                    "value": catalogId
                },
            ]),
            queryData = controller.getQuery(url);

        return queryData
    },

    // 获取过滤数据
    getFilterAttributeData: function (data, needFilterId) {
        var result = [];

        data.forEach(item => {
            if (!needFilterId.includes(item['id'])) {
                result.push(item)
            }
        })

        return result;
    },
})
