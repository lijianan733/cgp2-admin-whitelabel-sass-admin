Ext.syncRequire(['CGP.material.view.information.views.UxFieldContainer', 'CGP.material.model.MaterialDetail']);
Ext.define("CGP.material.controller.Controller", {
    statics: {
        rtAttributeArray: []
    },
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
     * 类目下的所有物料，并赋值与展示页面，进行数据展示
     * @param {Node} record 物料Id
     * @param {Ext.tab.Panel} infoTab 展示页面的容器组件
     * @param {Boolean} isLeaf 是否叶子节点
     * @param {Node} parentId 父节点ID
     */
    refreshMaterialGrid: function (record, infoTab, isLeaf, parentId, searchMaterialId) {
        infoTab.refreshData(record, isLeaf, parentId, searchMaterialId);
    },
    /**
     * 取得物料详细信息，并赋值与展示页面，进行数据展示
     * @param {Node} record 物料Id
     * @param {Ext.tab.Panel} infoTab 展示页面的容器组件
     * @param {Boolean} isLeaf 是否叶子节点
     * @param {Node} parentId 父节点ID
     */
    refreshData: function (record, infoTab, isLeaf, parentId) {
        if (infoTab) {
            var myMask = new Ext.LoadMask(infoTab, {msg: "正在加载..."});
            myMask.show();
        }
        var materialId = record.getId();
        var arr = materialId.split('-');
        var recordId = arr[arr.length - 1];
        Ext.Ajax.request({
            url: adminPath + 'api/materials/' + recordId,
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                var data = responseMessage.data;
                if (responseMessage.success) {
                    if (myMask != undefined) {
                        myMask.hide();
                    }
                    var isLeaf = data.leaf;
                    infoTab.bomTreeRecord = record;
                    infoTab.refreshData(data, isLeaf, parentId);
                } else {
                    if (myMask != undefined) {
                        myMask.hide();
                    }
                    Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                }
            },
            failure: function (resp) {
                if (myMask != undefined) {
                    myMask.hide();
                }
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },
    /**
     * 右键点击节点时显示菜单操作
     * @param {Ext.tree.Panel} view 树结构
     * @param {Node} record 选中的节点
     * @param {Event} e 事件对象
     * @param {String} parentId 父节点ID
     * @param {Boolean} isLeaf 是否叶子节点
     */
    itemEventMenu: function (view, record, e, parentId, isLeaf) {
        var me = this;
        var infoTab = view.ownerCt.ownerCt.getComponent('infoTab');
        var tree = view.ownerCt;
        var materialId = record.get('_id');
        var isSpu = record.get('type') === 'MaterialSpu';
        me.refreshData(record, infoTab, isLeaf, parentId);
        e.stopEvent();

        var menu = Ext.create('Ext.menu.Menu', {
            items: [
                {
                    text: i18n.getKey('add'),
                    itemId: 'add',
                    hidden: isSpu,
                    handler: function () {
                        me.selectMaterialType(tree, record);
                    }
                },
                {
                    text: i18n.getKey('delete'),
                    itemId: 'delete',
                    hidden: !record.get('isLeaf'),
                    handler: function () {
                        var treeStore = tree.getStore();
                        var parentNode = record.parentNode;
                        me.deleteMaterial(materialId, parentNode, treeStore, record, infoTab, null);

                    }
                },
                {
                    text: i18n.getKey('check') + i18n.getKey('bomStructure'),
                    itemId: 'checkBomtree',
                    hidden: record.get('type') == 'category',
                    handler: function () {
                        var id = record.get('id');
                        var name = record.get('name');
                        var type = record.get('type');
                        var leaf = Ext.isEmpty(record.raw.childItems) ? true : false;
                        JSOpen({
                            id: 'bomtree',
                            url: path + "partials/material/bomtree.html?materialId=" + id + '&materialName=' + name + '&type=' + type + '&leaf=' + leaf,
                            title: i18n.getKey('sell') + i18n.getKey('bomTree'),
                            refresh: true
                        });
                        //me.checkBomTree(record);
                    }
                },
                {
                    text: i18n.getKey('modify') + i18n.getKey('catalog'),
                    itemId: 'modifyCategory',
                    handler: function () {
                        var id = record.get('id');
                        var name = record.get('name');
                        var type = record.get('type');
                        me.modifyCategory(id, null);
                        //me.checkBomTree(record);
                    }
                }
            ]
        });

        menu.showAt(e.getXY());


    },
    /**
     * 在非根节点上添加物料时进行物料类型选择
     * @param {Ext.tree.Panel} tree
     * @param {Node} record
     */
    selectMaterialType: function (tree, record) {
        var me = this;
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('selectMaterialType'),
            layout: 'fit',
            modal: true,
            items: [
                {
                    xtype: 'form',
                    border: false,
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center'
                    },
                    items: [
                        {
                            xtype: 'combo',
                            fieldLabel: i18n.getKey('materialType'),
                            name: 'materialType',
                            width: 300,
                            margin: '15 25 15 25',
                            editable: false,
                            store: Ext.create('Ext.data.Store', {
                                fields: ['name', 'value'],
                                data: [
                                    {name: 'SMU', value: 'MaterialSpu'}
                                    ,
                                    {name: 'SMT', value: 'MaterialType'}
                                ]
                            }),
                            queryMode: 'local',
                            displayField: 'name',
                            valueField: 'value',
                            allowBlank: false,
                            itemId: 'materialType'
                        }
                    ]
                }
            ],
            bbar: ['->', {
                xtype: 'button',
                text: i18n.getKey('nextStep'),
                iconCls: 'icon_next_step',
                handler: function (comp) {
                    var selectTypeWin = this.ownerCt.ownerCt;
                    var form = selectTypeWin.down('form');
                    if (form.isValid()) {
                        var materialType = form.getComponent('materialType').getValue();
                        me.newMaterial(materialType, tree, record, selectTypeWin);
                    }
                }
            }, {
                xtype: 'button',
                iconCls: 'icon_cancel',
                text: i18n.getKey('cancel'),
                handler: function (comp) {
                    comp.ownerCt.ownerCt.close();
                }
            }]
        }).show();
    },
    /**
     * 新建一个物料填写信息窗口
     * @param {Ext.tree.Panel} tree 物料树结构
     * @param {String} materialType 物料类型
     * @param {Object} record 该节点上添加新物料
     * @param {Ext.window.Window} selectTypeWin 选择物料类型的窗口
     */
    newMaterial: function (materialType, tree, record, selectTypeWin) {
        if (Ext.isEmpty(materialType)) {
            materialType = 'MaterialType'
        }
        if (record && record.getId() != 'root') {
            //不为根节点
            var parentID = record.getId();
            Ext.Ajax.request({
                url: adminPath + 'api/materials/' + parentID,
                method: 'GET',
                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                success: function (res) {
                    var responseMessage = Ext.JSON.decode(res.responseText);
                    var data = responseMessage.data;
                    if (responseMessage.success) {
                        var winConfig = {
                            materialType: materialType,
                            treeView: tree,
                            parentData: data,
                            parentNode: record,
                            selectTypeWin: selectTypeWin
                        };
                        /*       if (Ext.isEmpty(data.spuRtType) && materialType == 'MaterialSpu') {
                                   Ext.Msg.alert('提示', "已选的父物料中没有定义spuRtType,不能新建SMU。请重选父物料或为该物料添加SpuRtType");
                                   return;
                               }*/
                        var rtTypeNode;
                        if (data.rtType) {
                            Ext.Ajax.request({
                                url: adminPath + 'api/rtTypes/' + data.rtType['_id'],
                                method: 'GET',
                                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                success: function (res) {
                                    var responseMessage = Ext.JSON.decode(res.responseText);
                                    var rtTypeData = responseMessage.data;
                                    if (responseMessage.success) {
                                        rtTypeNode = {
                                            _id: data.rtType['_id'],
                                            name: rtTypeData.name
                                        };
                                        winConfig.rtTypeNode = rtTypeNode;
                                        spuRtType();

                                    } else {
                                        Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                                    }
                                },
                                failure: function (resp) {
                                    var response = Ext.JSON.decode(resp.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                }
                            });
                        } else {
                            rtTypeNode = null;
                            winConfig.rtTypeNode = rtTypeNode;
                            spuRtType();
                        }

                        function spuRtType() {
                            var spuRtTypeNode;
                            if (data.spuRtType) {
                                Ext.Ajax.request({
                                    url: adminPath + 'api/rtTypes/' + data.spuRtType['_id'],
                                    method: 'GET',
                                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                    success: function (res) {
                                        var responseMessage = Ext.JSON.decode(res.responseText);
                                        var spuRtTypeData = responseMessage.data;
                                        if (responseMessage.success) {
                                            spuRtTypeNode = {
                                                _id: data.spuRtType['_id'],
                                                name: spuRtTypeData.name
                                            };
                                            winConfig.spuRtTypeNode = spuRtTypeNode;
                                            Ext.create('CGP.material.view.CreateMaterialWin', winConfig).show();
                                        } else {
                                            Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                                        }
                                    },
                                    failure: function (resp) {
                                        var response = Ext.JSON.decode(resp.responseText);
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                    }
                                });
                            } else {
                                spuRtTypeNode = null;
                                winConfig.spuRtTypeNode = spuRtTypeNode;
                                Ext.create('CGP.material.view.CreateMaterialWin', winConfig).show();
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
        } else {
            var parentNode = tree.getStore().getRootNode();
            Ext.create('CGP.material.view.CreateMaterialWin', {
                materialType: materialType,
                treeView: tree,
                parentData: null,
                parentNode: parentNode,
                selectTypeWin: selectTypeWin
            }).show();
        }
    },
    /**
     * 添加一个新的物料
     * @param {Object} materialData 父节点数据
     * @param {Ext.window.Window} win 添加物料的窗口
     * @param {Node} parentNode 父节点
     * @param {Ext.window.Window} selectTypeWin 添加物料时选择物料类型的窗口
     * @param {Ext.data.Store} gridStore 在物料类目视图添加物料时的MaterialGridStore
     */
    addMaterial: function (materialData, win, parentNode, selectTypeWin, gridStore) {
        var type = parentNode.get('type');
        if (type == 'category') {
            materialData.category = parentNode.get('id');
        }

        var request = {
            url: adminPath + 'api/materials',
            method: 'POST',
            jsonData: materialData,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                var data = responseMessage.data;
                if (responseMessage.success) {
                    if (Ext.isEmpty(gridStore)) {
                        if (parentNode.getId() == 'root') {//根节点下添加，不知道物料在哪，故直接跳转到详情页
                            Ext.Msg.confirm('提示', '添加成功！是否查看该物料？', function (selector) {
                                if (selector == 'yes') {
                                    JSOpen({
                                        id: 'material' + '_edit',
                                        url: path + "partials/material/edit.html?materialId=" + data._id + '&isLeaf=' + false + '&parentId= &isOnly=true',
                                        title: i18n.getKey('materialInfo') + '(' + i18n.getKey('id') + ':' + data._id + ')',
                                        refresh: true
                                    });
                                }
                            });
                        } else {//有treePanel导航结构结构
                            Ext.Msg.alert('提示', '添加成功!');
                        }
                        var treeStore = win.treeView.getStore();
                        var refreshNode = parentNode.parentNode;
                        if (Ext.isEmpty(refreshNode)) {
                            refreshNode = parentNode;
                        }
                        if (win.treeView.itemId == 'materialTree') {
                            treeStore.load({
                                node: parentNode,
                                callback: function (records) {
                                    parentNode.set('isLeaf', false);
                                    parentNode.set('leaf', false);
                                    parentNode.expand();

                                    var newNode = treeStore.getNodeById(data._id);
                                    Ext.Array.each(records, function (item) {
                                        if (item.get('type') == 'MaterialSpu') {
                                            item.set('icon', '../material/S.png');
                                        } else {
                                            item.set('icon', '../material/T.png');
                                        }
                                    });
                                    win.treeView.getSelectionModel().select(newNode);
                                }
                            });

                        } else {
                            treeStore.load({
                                node: parentNode,
                                callback: function (records) {
                                    parentNode.expand();
                                    var newNode = treeStore.getNodeById(data._id);
                                    Ext.Array.each(records, function (item) {
                                        if (item.get('type') == 'MaterialSpu') {
                                            item.set('icon', '../material/S.png');
                                        } else {
                                            item.set('icon', '../material/T.png');
                                        }
                                    });
                                    win.treeView.getSelectionModel().select(newNode);
                                }
                            });
                        }
                    } else {
                        Ext.Msg.alert('提示', '添加成功！');
                        gridStore.load();
                    }

                    win.close();
                    if (selectTypeWin) {
                        selectTypeWin.close();
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
        if (materialData.childItems) {
            var itemLength = materialData.childItems.length;
            if (itemLength > 0) {
                for (var i = 0; i < itemLength; i++) {
                    (function (j) {
                        Ext.Ajax.request({
                            url: adminPath + 'common/key',
                            method: 'GET',
                            success: function (res) {
                                var responseMessage = Ext.JSON.decode(res.responseText);
                                var bomItemId = responseMessage.data;
                                var bomItemIdStr = bomItemId.toString();
                                materialData.childItems[j]._id = bomItemIdStr;
                                if (j == itemLength - 1) {
                                    Ext.Ajax.request(request);
                                }
                            },
                            failure: function (resp) {
                                var response = Ext.JSON.decode(resp.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                            }
                        })
                    })(i);
                }
            } else {
                Ext.Ajax.request(request);
            }
        } else {
            Ext.Ajax.request(request);
        }

    },
    /**
     * 删除物料
     * @param {string} materialId 物料ID
     * @param {Object} parentNode 删除物料的父节点
     * @param {Ext.data.TreeStore}treeStore
     * @param {Object} record 是否叶子节点
     * @param {component} infoTab 是否叶子节点
     * @param {Store} gridStore 分页物料store
     */
    deleteMaterial: function (materialId, parentNode, treeStore, record, infoTab, gridStore) {
        if (record.get('isLeaf')) {
            Ext.Msg.confirm('提示', '是否删除该物料？', callback);

            function callback(id) {
                if (id === 'yes') {
                    Ext.Ajax.request({
                        url: adminPath + 'api/materials/' + materialId,
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
                                treeStore.load({
                                    node: parentNode,
                                    callback: function (records) {
                                        Ext.Array.each(records, function (item) {
                                            if (item.get('type') == 'MaterialSpu') {
                                                item.set('icon', '../material/S.png');
                                            } else {
                                                item.set('icon', '../material/T.png');
                                            }
                                        });
                                    }
                                });
                                if (gridStore) {
                                    gridStore.load();
                                }
                            } else {
                                Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                            }
                        },
                        failure: function (resp) {
                            var response = Ext.JSON.decode(resp.responseText);
                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                        }
                    })
                }
            }
        } else {
            Ext.Msg.alert('警告', '该物料下存在子物料，不允许删除！');
        }
    },
    createBomItemWin: function (store, record, editOrNew, materialData, bomItemType, isCanSave, rootVisible, rootNode) {
        return Ext.create('CGP.material.view.information.views.AddBomItemWin', {
            store: store,
            record: record,
            rootVisible: rootVisible,
            bomItemType: bomItemType,
            editOrNew: editOrNew,
            materialData: materialData,
            isCanSave: isCanSave || false,
            rootNode: rootNode
        });
    },
    /**
     * 修改和添加bomitem的窗口
     * @param {Ext.data.Store} store bomItem的Store
     * @param {Ext.data.Model} record 编辑的bomItem
     * @param {Boolean} editOrNew 当前操作bomItem的状态
     * @param {Object} materialData 物料的数据
     * @param {String} bomItemType bomItem的类型
     * @param  isCanSave是否可以保存修改
     */
    editBomItem: function (store, record, editOrNew, materialData, bomItemType, isCanSave) {
        var me = this;
        var selectMaterialStore = Ext.create('CGP.material.store.Material');
        if (editOrNew == 'modify') {
            if (materialData.parentId == 'root' || Ext.isEmpty(materialData.parentId)) {
                me.createBomItemWin(store, record, editOrNew, materialData, bomItemType, isCanSave, false, {
                    _id: 'root',
                    name: 'root'
                }).show();
            } else {
                Ext.Ajax.request({
                    url: adminPath + 'api/admin/materials/' + materialData.parentId,
                    method: 'GET',
                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                    success: function (res) {
                        var responseMessage = Ext.JSON.decode(res.responseText);
                        var data = responseMessage.data;
                        if (responseMessage.success) {
                            Ext.Array.each(data.childItems, function (item) {
                                if (item.name == record.get('name')) {
                                    me.createBomItemWin(store, record, editOrNew, materialData, bomItemType, isCanSave, materialData.type == 'MaterialType', {
                                        _id: item.itemMaterial._id,
                                        name: item.itemMaterial.name,
                                        type: item.itemMaterial.type
                                    }).show();
                                } else {
                                    me.createBomItemWin(store, record, editOrNew, materialData, bomItemType, isCanSave, materialData.type == 'MaterialType', {
                                        _id: 'root',
                                        name: 'root'
                                    }).show();
                                }
                            });
                        } else {

                            Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                        }
                    },
                    failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                });
            }
        } else {//这边为新建
            me.createBomItemWin(store, record, editOrNew, materialData, bomItemType, false, false, {
                _id: 'root',
                name: 'root'
            }).show();
        }
    },
    /**
     *操作单条constraints
     * @param {Ext.grid.Panel} grid 约束界面表格
     * @param {Ext.data.Model} record 单条constraint
     * @param {String} createOrEdit 对单条约束的操作状态
     */
    openConstraints: function (grid, record, createOrEdit) {
        var record = record;
        if (createOrEdit == 'create') {
            record = Ext.create("CGP.material.model.Constraint", {
                quantity: null,
                clazz: ''
            })
            Ext.create('Ext.window.Window', {
                title: i18n.getKey('selectType'),
                layout: 'fit',
                modal: true,
                items: [
                    {
                        xtype: 'form',
                        border: false,
                        padding: 10,
                        width: 450,
                        height: 80,
                        items: [
                            {
                                xtype: 'combo',
                                width: 350,
                                fieldLabel: i18n.getKey('type'),
                                store: Ext.create('Ext.data.Store', {
                                    fields: [
                                        'name', 'value'
                                    ],
                                    data: [
                                        {
                                            name: i18n.getKey('FixedQuantityConstraint'),
                                            value: domainObj['FixedQuantityConstraint']
                                        },
                                        {
                                            name: i18n.getKey('InsertRatioConstraint'),
                                            value: domainObj['InsertRatioConstraint']
                                        },
                                        {
                                            name: i18n.getKey('RangeQuantityConstraint'),
                                            value: domainObj['RangeQuantityConstraint']
                                        },
                                        {
                                            name: i18n.getKey('CalculatedQuantityConstraint'),
                                            value: domainObj['CalculatedQuantityConstraint']
                                        },
                                        {
                                            name: i18n.getKey('FillQuantityConstraint'),
                                            value: domainObj['FillQuantityConstraint']
                                        }
                                    ]
                                }),
                                itemId: 'constraint',
                                editable: false,
                                queryMode: 'local',
                                name: 'constraint',
                                displayField: 'name',
                                valueField: 'value'
                            }
                        ]
                    }
                ],
                bbar: ['->', {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    handler: function () {
                        var win = this.ownerCt.ownerCt;
                        var clazz = this.ownerCt.ownerCt.down('form').getComponent('constraint').getValue();
                        Ext.create("CGP.material.view.information.views.AddConstraint", {
                            grid: grid,
                            clazz: clazz,
                            win: win,
                            record: record,
                            createOrEdit: createOrEdit
                        }).show();
                    }
                }]
            }).show();
        } else {
            Ext.create("CGP.material.view.information.views.AddConstraint", {
                grid: grid,
                record: record,
                clazz: record.get('clazz'),
                createOrEdit: createOrEdit
            }).show();
        }
    },
    /**
     *添加materialViewType的窗口
     * @param {Ext.data.Store} store 物料已拥有的materialView
     * @param {Array} filterData 需要过滤的materialView的ID集合
     */
    addMtViews: function (store, filterData) {
        Ext.create('CGP.material.view.information.views.AddMtViews', {
            existStore: store,
            filterData: filterData
        }).show();
    },
    /**
     * 修改物料信息
     * @param {Object} data 最新的物料数据
     * @param {Ext.tree.Panel} treePanel 物料树结构视图
     */
    updateMaterial: function (data, treePanel, bomTreeRecord) {
        var me = this;
        var request = {
            url: adminPath + 'api/materials/' + data._id,
            method: 'PUT',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert('提示', '修改成功！', function () {
                        if (treePanel) {
                            if (bomTreeRecord.parentNode) {
                                treePanel.store.load({
                                    node: bomTreeRecord.parentNode,
                                    callback: function (records) {
                                        var selectedRecord = null;
                                        for (var i = 0; i < records.length; i++) {
                                            if (records[i].get('id') == data._id) {
                                                selectedRecord = records[i];
                                                break;
                                            }
                                        }
                                        treePanel.getSelectionModel().select(selectedRecord);
                                    }
                                })
                            } else {
                                //更改根节点
                                treePanel.getRootNode().set('name', data.name);
                            }
                        }
                    });
                } else {
                    Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        };
        if (data.childItems) {
            var itemLength = data.childItems.length;
            if (itemLength > 0) {
                for (var i = 0; i < itemLength; i++) {

                    (function (j) {
                        if (Ext.isEmpty(data.childItems[j]._id)) {
                            Ext.Ajax.request({
                                url: adminPath + 'common/key',
                                method: 'GET',
                                success: function (res) {
                                    var responseMessage = Ext.JSON.decode(res.responseText);
                                    var bomItemId = responseMessage.data;
                                    var bomItemIdStr = bomItemId.toString();
                                    data.childItems[j]._id = bomItemIdStr;
                                    if (j == itemLength - 1) {
                                        Ext.Ajax.request(request);
                                    }
                                },
                                failure: function (resp) {
                                    var response = Ext.JSON.decode(resp.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                }
                            })
                        } else {
                            if (j == itemLength - 1) {
                                Ext.Ajax.request(request);
                            }
                        }

                    })(i);
                }
            } else {
                Ext.Ajax.request(request);
            }
        } else {
            Ext.Ajax.request(request);
        }
    },
    /**
     * 可选件配置成固定件
     * @param {Ext.data.Store} store bomitem的store
     * @param {Ext.data.Model} record 当前操作的bomItem
     * @param {Number} rowIndex 当前操作的record的位置
     * @param {String} materialType bomitem所属物料类型
     */
    deployFixed: function (store, record, rowIndex, materialType) {
        Ext.create('CGP.material.view.information.views.DeployFixedWin', {
            store: store,
            record: record,
            rowIndex: rowIndex,
            materialType: materialType
        }).show();
    },
    /**
     * 待定件生成固定件
     * @param {Ext.data.Store} store bomitem的store
     * @param {Ext.data.Model} record 当前操作的bomItem
     * @param {Number} rowIndex 当前操作的record的位置
     * @param {String} materialType bomitem所属物料类型
     */
    createFixed: function (store, record, rowIndex, materialType) {
        var min = record.get('range').min;
        var max = record.get('range').max;
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('confirmNewNum'),
            modal: true,
            width: 350,
            height: 150,
            layout: 'fit',
            items: [
                {
                    xtype: 'form',
                    border: false,
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center'
                    },
                    items: [
                        {
                            name: 'fixedCount',
                            xtype: 'numberfield',
                            itemId: 'fixedCount',
                            id: 'fixedCount',
                            minValue: min,
                            maxValue: max,
                            fieldLabel: i18n.getKey('quantity') + '(' + min + '~' + max + ')',
                            allowBlank: false
                        }
                    ]
                }
            ],
            bbar: ['->', {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                handler: function (comp) {
                    var form = comp.ownerCt.ownerCt.down('form');
                    var fixedCount = form.getComponent('fixedCount').getValue();
                    if (form.isValid()) {
                        if (fixedCount == 0) {
                            store.remove(record);
                            comp.ownerCt.ownerCt.close();
                        } else {
                            Ext.create('CGP.material.view.information.views.CreateFixedWin', {
                                fixedCount: fixedCount,
                                numberWin: comp.ownerCt.ownerCt,
                                store: store,
                                record: record,
                                rowIndex: rowIndex,
                                materialType: materialType
                            }).show();
                        }
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
     *固定件重新关联物料
     * @param {Ext.data.Store} store bomitem的store
     * @param {Ext.data.Model} record 当前操作的bomItem
     * @param {Number} rowIndex 当前操作的record的位置
     * @param {String} materialType bomitem所属物料类型
     */
    anewRelatedMaterial: function (store, record, rowIndex, parentData) {
        Ext.create('CGP.material.view.information.views.anewRelatedMaterial', {
            store: store,
            record: record,
            rowIndex: rowIndex,
            parentData: parentData
        }).show();
    },
    /**
     * 右键点击节点时显示菜单操作
     * @param {Ext.tree.Panel} view 树结构
     * @param {Node} record 选中的节点
     * @param {Event} e 事件对象
     * @param {String} parentId 父节点ID
     * @param {Boolean} isLeaf 是否叶子节点
     * @param {String} treeType 物料视图类型
     */
    categoryEventMenu: function (view, record, e, parentId, isLeaf, treeType) {
        var me = this;
        var centerPanel = view.ownerCt.ownerCt.getComponent('centerPanel');
        var grid = null;
        if (centerPanel.getComponent('materialGrid')) {
            grid = centerPanel.getComponent('materialGrid').down('grid');
        }
        var tree = view.ownerCt;
        var categoryId = record.get('_id');
        var type = record.get('type');
        e.stopEvent();

        var menu = Ext.create('Ext.menu.Menu', {
            items: [
                {
                    text: i18n.getKey('add') + i18n.getKey('catalog'),
                    itemId: 'add',
                    handler: function () {
                        me.addCategory(tree, record);
                    }
                },
                {
                    text: i18n.getKey('move') + i18n.getKey('catalog'),
                    disabledCls: 'menu-item-display-none',
                    handler: function () {
                        me.moveCategoryWin(tree)
                    }
                }
                ,
                {
                    text: i18n.getKey('delete'),
                    disabledCls: 'menu-item-display-none',
                    hidden: !record.get('isLeaf'),
                    itemId: 'delete',
                    handler: function () {
                        me.deleteCategory(tree, record)
                    }
                },
                {
                    text: i18n.getKey('modify') + i18n.getKey('name'),
                    disabledCls: 'menu-item-display-none',
                    itemId: 'modifyName',
                    handler: function () {
                        me.modifyCatagoryName(tree, record)
                    }
                }
            ]
        });

        menu.showAt(e.getXY());
    },
    /**
     * 查看BOM树结构视图
     * @param {Ext.data.Model} record 操作的当前物料
     */
    checkBomTree: function (record) {
        var bomTree = Ext.create('CGP.material.view.information.views.BomTree', {
            record: record
        });
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('bomStructure'),
            modal: true,
            layout: 'fit',
            width: 600,
            height: 500,
            items: [bomTree]
        }).show();
    },
    /**
     * 修改物料的类目
     * @param {String} materialId 物料ID
     * @param {Ext.grid.Panel} grid 物料表格视图
     * @param {Ext.tree.Panel} treePanel categoryTree
     * *@param {String} categoryId 类目ID
     */
    modifyCategory: function (materialId, grid, treePanel, categoryId) {
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('modify') + i18n.getKey('catalog'),
            modal: true,
            layout: 'fit',
            autoShow: true,
            items: [
                {
                    xtype: 'form',
                    border: false,
                    width: 500,
                    padding: 10,
                    height: 70,
                    items: [
                        {
                            value: categoryId,
                            width: 450,
                            allowBlank: false,
                            itemId: 'category',
                            fieldLabel: i18n.getKey('catalog'),
                            name: 'category',
                            xtype: 'uxtreecombohaspaging',
                            store: Ext.create('CGP.material.store.MaterialCategory'),
                            displayField: 'name',
                            valueField: '_id',
                            haveReset: true,
                            treeWidth: 450,
                            editable: false,
                            selType: 'rowmodel',
                            rootVisible: false,
                            selectChildren: false,
                            canSelectFolders: true,
                            multiselect: false,
                            defaultColumnConfig: {
                                renderer: function (value, metadata, record) {
                                    return record.get("name") + '<font color="green"><' + record.get('_id') + '></font>';
                                }
                            },
                            showSelectColumns: [
                                {
                                    dataIndex: '_id',
                                    flex: 1,
                                    text: i18n.getKey('id')
                                },
                                {
                                    dataIndex: 'name',
                                    text: i18n.getKey('name'),
                                    flex: 2
                                }
                            ],
                            listeners: {
                                //展开时显示选中状态
                                /*   expand: function (field) {
                                 var recursiveRecords = [];

                                 function recursivePush(node, setIds) {
                                 addRecRecord(node);
                                 node.eachChild(function (nodesingle) {
                                 if (nodesingle.hasChildNodes() == true) {
                                 recursivePush(nodesingle, setIds);
                                 } else {
                                 addRecRecord(nodesingle);
                                 }
                                 });
                                 }

                                 function addRecRecord(record) {
                                 for (var i = 0, j = recursiveRecords.length; i < j; i++) {
                                 var item = recursiveRecords[i];
                                 if (item) {
                                 if (item.getId() == record.getId()) return;
                                 }
                                 }
                                 if (record.getId() <= 0) return;
                                 recursiveRecords.push(record);
                                 }

                                 var node = field.tree.getRootNode();
                                 recursivePush(node, false);
                                 Ext.each(recursiveRecords, function (record) {
                                 var id = record.get(field.valueField);
                                 if (field.getValue() == id && !Ext.isEmpty(field.getValue())) {
                                 field.tree.getSelectionModel().select(record);
                                 }
                                 });
                                 },*/
                                afterrender: function (comp) {
                                    // comp.tree.expandAll();
                                }
                            }

                        }
                    ]
                }
            ],
            bbar: ['->', {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_agree',
                handler: function (comp) {
                    var form = comp.ownerCt.ownerCt.down('form');
                    var category = form.getComponent('category').getValue();
                    if (form.isValid()) {
                        //修改物料类目
                        Ext.Ajax.request({
                            url: adminPath + 'api/materials/' + materialId + '/category?categoryId=' + category,
                            method: 'PUT',
                            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                            success: function (res) {
                                var responseMessage = Ext.JSON.decode(res.responseText);
                                if (responseMessage.success) {
                                    Ext.Msg.alert('提示', '修改成功！');
                                    var categoryTree = Ext.getCmp('categoryMaterialTree');
                                    var treeStore = categoryTree.getStore();
                                    treeStore.load({
                                        callback: function (records) {
                                            categoryTree.expandAll();
                                        }
                                    });
                                    treeStore.on('load', function (store, node, records) {
                                        var moveNode = treeStore.getNodeById(category);
                                        categoryTree.getSelectionModel().select(moveNode);
                                    });
                                    if (!Ext.isEmpty(grid)) {
                                        var gridStore = grid.getStore();
                                        gridStore.load();
                                    }
                                    comp.ownerCt.ownerCt.close();
                                } else {
                                    Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                                }
                            },
                            failure: function (resp) {
                                var response = Ext.JSON.decode(resp.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                            }
                        })
                    }
                }
            }]
        });
    },
    deleteCategory: function (tree, record) {
        var categoryId = record.get('_id');
        var parentNode = record.parentNode;
        var request = {
            url: adminPath + 'api/materialCategories/' + categoryId,
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
                    treeStore.load({
                        node: parentNode,
                        callback: function (records) {
                            Ext.Array.each(records, function (item) {
                                item.set('icon', '../material/category.png');
                            });
                        }
                    });
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
            url: adminPath + 'api/materialCategories/' + categoryId + '/materials?page=1&limit=20',
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                if (responseMessage.success) {
                    var content = responseMessage.data.content;
                    if (!Ext.isEmpty(content)) {
                        Ext.Msg.alert('提示', '此类目下存在物料，不允许删除！')
                    } else {
                        Ext.Msg.confirm('提示', '是否删除该类目？', callback);

                        function callback(id) {
                            if (id === 'yes') {
                                Ext.Ajax.request(request)
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
    addCategory: function (tree, record) {
        var categoryId;
        if (Ext.isEmpty(record)) {
            categoryId = 'root'
        } else {
            categoryId = record.get('_id');
        }
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('add') + i18n.getKey('catalog'),
            layout: 'fit',
            modal: true,
            items: [
                {
                    xtype: 'form',
                    border: false,
                    width: 450,
                    height: 80,
                    header: false,
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center'

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
                        var categoryName = win.down('form').getComponent('name').getValue();
                        var parentId = categoryId == 'root' ? null : record.get('_id');
                        var jsonData = {name: categoryName, parentId: parentId};
                        jsonData.clazz = "com.qpp.cgp.domain.bom.MaterialCategory";
                        var request = {
                            url: adminPath + 'api/materialCategories',
                            method: 'POST',
                            jsonData: jsonData,
                            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                            success: function (res) {
                                var responseMessage = Ext.JSON.decode(res.responseText);
                                var data = responseMessage.data;
                                var parentNode = record;
                                if (Ext.isEmpty(record)) {
                                    parentNode = tree.getRootNode()
                                }
                                if (responseMessage.success) {
                                    Ext.Msg.alert('提示', '添加成功！');
                                    var treeStore = tree.getStore();

                                    var refreshNode = parentNode.parentNode;
                                    if (Ext.isEmpty(refreshNode)) {
                                        refreshNode = parentNode;
                                    }
                                    treeStore.load({
                                        node: parentNode,
                                        callback: function (records) {
                                            parentNode.set('isLeaf', false);
                                            parentNode.set('leaf', false);
                                            parentNode.expand();

                                            var newNode = treeStore.getNodeById(data['_id']);
                                            Ext.Array.each(records, function (item) {
                                                item.set('icon', '../material/category.png');
                                            });
                                            tree.getSelectionModel().select(newNode);
                                        }
                                    });
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
    modifyBelongCategory: function () {
        var me = this;
        var request = {
            url: adminPath + 'api/admin/materialCategories/{categoryId}',
            method: 'PUT',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert('提示', '修改成功！');
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
     * 当在物料类目视图添加物料
     * @param {Node} category 在该类目下添加物料
     * @param {Ext.data.Store} gridStore 类目下的materialgrid store
     * @param {Ext.tree.Panel} treePanel 类目下的materialgrid store
     *
     */
    categoryAddMaterial: function (category, gridStore, treePanel, type) {
        var me = this;
        me.categorySelectWin(category, gridStore, treePanel, type);


    },
    /**
     * 当在物料类目视图添加物料时，选择父物料和物料类型的窗口
     * @param {Node} category 在该类目下添加物料
     * @param {Ext.data.Store} gridStore 类目下的materialgrid store
     * @param {Ext.tree.Panel} treePanel categoryTree
     */
    categorySelectWin: function (category, gridStore, treePanel, type) {
        var me = this;
        var material;
        Ext.create('Ext.window.Window', {
            width: 400,
            height: 200,
            layout: 'fit',
            title: i18n.getKey('selectMaterialType') + '·' + i18n.getKey('parentMaterial'),
            modal: true,
            items: [
                {
                    xtype: 'form',
                    border: false,
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center'
                    },
                    defaults: {
                        width: 300,
                        margin: '5 25 5 25'
                    },
                    items: [
                        {
                            xtype: 'combo',
                            fieldLabel: i18n.getKey('materialType'),
                            name: 'materialType',
                            editable: false,
                            value: type,
                            readOnly: true,
                            fieldStyle: 'background-color:silver',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['name', 'value'],
                                data: [
                                    {name: 'SMU', value: 'MaterialSpu'},
                                    {name: 'SMT', value: 'MaterialType'}
                                ]
                            }),
                            queryMode: 'local',
                            displayField: 'name',
                            valueField: 'value',
                            allowBlank: false,
                            itemId: 'materialType'
                        },
                        {
                            xtype: 'materialselectfield',
                            fieldLabel: i18n.getKey('parentMaterial'),
                            vtype: 'onlySMT',
                            store: Ext.create('CGP.material.store.MaterialOnlyType'),
                            id: 'displayMaterial',
                            itemId: 'displayMaterial',
                            name: 'material',
                            tipInfo: '子物料将继承父物料的Bom结构,描述属性,spu属性',
                            baseFilter: [
                                {
                                    "name": "clazz",
                                    "type": "string",
                                    "value": "com.qpp.cgp.domain.bom.MaterialType"
                                }
                            ],
                        }
                    ]
                }
            ],
            bbar: ['->', {
                xtype: 'button',
                text: i18n.getKey('nextStep'),
                iconCls: 'icon_next_step',
                handler: function (comp) {
                    var selectTypeWin = this.ownerCt.ownerCt;
                    var form = selectTypeWin.down('form');
                    if (form.isValid()) {
                        var materialType = form.getComponent('materialType').getValue();
                        var materialId = form.getComponent('displayMaterial').getValue();
                        me.categoryNewMaterial(materialType, materialId, category, gridStore, selectTypeWin, treePanel);
                    }
                }
            }, {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function (comp) {
                    comp.ownerCt.ownerCt.close();
                }
            }]
        }).show();
    },
    categoryNewMaterial: function (materialType, partnerMaterialId, category, gridStore, selectTypeWin, treePanel) {
        if (!Ext.isEmpty(partnerMaterialId)) {
            Ext.Ajax.request({
                url: adminPath + 'api/materials/' + partnerMaterialId,
                method: 'GET',
                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                success: function (res) {
                    var responseMessage = Ext.JSON.decode(res.responseText);
                    var data = responseMessage.data;
                    if (responseMessage.success) {
                        /*    if (Ext.isEmpty(data.spuRtType) && materialType == 'MaterialSpu') {
                                Ext.Msg.alert('提示', "已选的父物料中没有定义spuRtType,不能新建SMU。请重选父物料或为该物料添加SpuRtType");
                                return;
                            }*/
                        //根据父物料的RtType,决定子物料可选RtType的继承结构
                        var winConfig = {
                            materialType: materialType,
                            treeView: treePanel,
                            parentData: data,
                            parentNode: category,
                            category: category,
                            selectTypeWin: selectTypeWin,
                            gridStore: gridStore
                        };
                        var rtTypeNode;
                        if (data.rtType) {
                            Ext.Ajax.request({
                                url: adminPath + 'api/rtTypes/' + data.rtType['_id'],
                                method: 'GET',
                                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                success: function (res) {
                                    var responseMessage = Ext.JSON.decode(res.responseText);
                                    var rtTypeData = responseMessage.data;
                                    if (responseMessage.success) {
                                        rtTypeNode = {
                                            _id: data.rtType['_id'],
                                            name: rtTypeData.name
                                        };
                                        winConfig.rtTypeNode = rtTypeNode;
                                        spuRtType();

                                    } else {
                                        Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                                    }
                                },
                                failure: function (resp) {
                                    var response = Ext.JSON.decode(resp.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                }
                            });
                        } else {
                            rtTypeNode = null;
                            winConfig.rtTypeNode = rtTypeNode;
                            spuRtType();
                        }

                        function spuRtType() {
                            var spuRtTypeNode;
                            if (data.spuRtType) {
                                Ext.Ajax.request({
                                    url: adminPath + 'api/rtTypes/' + data.spuRtType['_id'],
                                    method: 'GET',
                                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                    success: function (res) {
                                        var responseMessage = Ext.JSON.decode(res.responseText);
                                        var spuRtTypeData = responseMessage.data;
                                        if (responseMessage.success) {
                                            spuRtTypeNode = {
                                                _id: data.spuRtType['_id'],
                                                name: spuRtTypeData.name
                                            };
                                            winConfig.spuRtTypeNode = spuRtTypeNode;
                                            Ext.create('CGP.material.view.CreateMaterialWin', winConfig).show();
                                        } else {
                                            Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                                        }
                                    },
                                    failure: function (resp) {
                                        var response = Ext.JSON.decode(resp.responseText);
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                    }
                                });
                            } else {
                                spuRtTypeNode = null;
                                winConfig.spuRtTypeNode = spuRtTypeNode;
                                Ext.create('CGP.material.view.CreateMaterialWin', winConfig).show();
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
        } else {
            Ext.create('CGP.material.view.CreateMaterialWin', {
                materialType: materialType,
                treeView: treePanel,
                parentData: null,
                category: category,
                parentNode: category,
                selectTypeWin: selectTypeWin,
                gridStore: gridStore
            }).show();
        }
    },
    /**
     * 移动的
     * @param tree
     */
    moveCategoryWin: function (tree) {
        Ext.create('CGP.material.view.information.views.MoveCategoryWin', {
            tree: tree
        }).show();
    },
    /**
     * 移动category
     * @param {String} targetNodeId 将移动至的目标节点ID
     * @param {Ext.tree.Panel} tree categoryTree
     * @param {Node} moveNode 移动的category
     * @param {Ext.window.Window} win 选择移动目标节点的窗口
     */
    moveCategory: function (targetNodeId, tree, moveNode, win) {
        var moveNodeId = moveNode.getId();
        var jsonData = {
            name: moveNode.get('name'),
            parentId: targetNodeId,
            code: moveNode.get('code'),
            clazz: moveNode.get('clazz')
        };
        var request = {
            url: adminPath + 'api/materialCategories/' + moveNode.getId(),
            method: 'PUT',
            jsonData: jsonData,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                var data = responseMessage.data;
                if (responseMessage.success) {
                    var treeStore = tree.getStore();
                    treeStore.load({
                        callback: function () {
                            tree.expandAll();
                        }
                    });
                    win.close();
                    treeStore.on('load', function (store, node, records) {
                        var moveNodeYet = store.getNodeById(moveNodeId);
                        tree.getSelectionModel().select(moveNodeYet);
                    });
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
     * 修改category名称
     * @param {Ext.tree.Panel} tree categoryTree
     * @param {Node} record 要修改的category
     */
    modifyCatagoryName: function (tree, record) {
        var me = this;
        Ext.create('Ext.window.Window', {
            width: 400,
            height: 150,
            title: i18n.getKey('modify') + i18n.getKey('name'),
            modal: true,
            items: [
                {
                    xtype: 'form',
                    border: false,
                    padding: '20 20 0 20',
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('name'),
                            name: 'name',
                            itemId: 'categoryName',
                            allowBlank: false,
                            width: 300
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
                        var categoryName = form.getComponent('categoryName').getValue();
                        modify(tree, record, categoryName, win);
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

        function modify(tree, node, categoryName, win) {
            var jsonData = {
                _id: node.getId(),
                name: categoryName,
                parentId: node.get('parentId'),
                clazz: node.get('clazz')
            };
            if (Ext.isEmpty(node.get('parentId')) || node.get('parentId') == 'root') {
                delete jsonData.parentId;
            }
            var request = {
                url: adminPath + 'api/materialCategories/' + node.getId(),
                method: 'PUT',
                jsonData: jsonData,
                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                success: function (res) {
                    var responseMessage = Ext.JSON.decode(res.responseText);
                    var data = responseMessage.data;
                    if (responseMessage.success) {
                        var treeStore = tree.getStore();
                        treeStore.load({
                            node: node.parentNode,
                            callback: function (records) {
                                var refreshNode = treeStore.getNodeById(node.getId());
                                tree.getSelectionModel().select(refreshNode);
                            }
                        });
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
        }

    },
    /**
     * 批量修改物料的类目
     * @param {Array} materialIdArr 需要修改类目的物料Id数组
     * @param {Ext.grid.Panel} grid 物料表格视图
     * @param {Ext.tree.Panel} treePanel categoryTree
     * @param {String} categoryId 物料原类目Id
     */
    batchModifyCategory: function (materialIdArr, grid, treePanel, categoryId) {
        var length = materialIdArr.length;
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('modify') + i18n.getKey('catalog'),
            modal: true,
            layout: 'fit',
            id: 'batchModifyCategory',
            autoShow: true,
            items: [
                {
                    xtype: 'form',
                    border: false,
                    width: 500,
                    padding: 10,
                    height: 70,
                    items: [
                        {
                            value: categoryId,
                            width: 450,
                            allowBlank: false,
                            itemId: 'category',
                            fieldLabel: i18n.getKey('catalog'),
                            name: 'category',
                            xtype: 'uxtreecombohaspaging',
                            store: Ext.create('CGP.material.store.MaterialCategory'),
                            displayField: 'name',
                            valueField: '_id',
                            haveReset: true,
                            treeWidth: 450,
                            editable: false,
                            selType: 'rowmodel',
                            rootVisible: false,
                            selectChildren: false,
                            canSelectFolders: true,
                            multiselect: false,
                            showSelectColumns: [
                                {
                                    dataIndex: '_id',
                                    flex: 1,
                                    text: i18n.getKey('id')
                                },
                                {
                                    dataIndex: 'name',
                                    text: i18n.getKey('name'),
                                    flex: 2
                                }
                            ],
                            defaultColumnConfig: {
                                renderer: function (value, metadata, record) {
                                    return record.get("name") + '<font color="green"><' + record.get('_id') + '></font>';
                                }
                            }/*,
                         listeners: {
                         //展开时显示选中状态
                         expand: function (field) {
                         var recursiveRecords = [];

                         function recursivePush(node, setIds) {
                         addRecRecord(node);
                         node.eachChild(function (nodesingle) {
                         if (nodesingle.hasChildNodes() == true) {
                         recursivePush(nodesingle, setIds);
                         } else {
                         addRecRecord(nodesingle);
                         }
                         });
                         };
                         function addRecRecord(record) {
                         for (var i = 0, j = recursiveRecords.length; i < j; i++) {
                         var item = recursiveRecords[i];
                         if (item) {
                         if (item.getId() == record.getId()) return;
                         }
                         }
                         if (record.getId() <= 0) return;
                         recursiveRecords.push(record);
                         };
                         var node = field.tree.getRootNode();
                         recursivePush(node, false);
                         Ext.each(recursiveRecords, function (record) {
                         var id = record.get(field.valueField);
                         if (field.getValue() == id && !Ext.isEmpty(field.getValue())) {
                         field.tree.getSelectionModel().select(record);
                         }
                         });
                         },
                         afterrender: function (comp) {
                         comp.tree.expandAll();
                         }
                         }*/

                        }
                    ]
                }
            ],
            bbar: ['->', {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_agree',
                handler: function (comp) {
                    var form = comp.ownerCt.ownerCt.down('form');
                    if (form.isValid()) {
                        var mask = comp.ownerCt.ownerCt.setLoading();
                        var category = form.getComponent('category').getValue();
                        for (var h = 0; h < length; h++) {
                            (function (g) {
                                Ext.Ajax.request({
                                    url: adminPath + 'api/materials/' + materialIdArr[g] + '/category?categoryId=' + category,
                                    method: 'PUT',
                                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                    success: function (res) {
                                        var responseMessage = Ext.JSON.decode(res.responseText);
                                        if (responseMessage.success) {
                                            if (g == length - 1) {
                                                mask.hide();
                                                Ext.Msg.alert('提示', '修改成功！');
                                                var categoryTree = Ext.getCmp('categoryMaterialTree');
                                                var treeStore = categoryTree.getStore();
                                                treeStore.load({
                                                    callback: function (records) {
                                                        categoryTree.expandAll();
                                                    }
                                                });
                                                treeStore.on('load', function (store, node, records) {
                                                    var moveNode = treeStore.getNodeById(category);
                                                    categoryTree.getSelectionModel().select(moveNode);
                                                });
                                                /*if(!Ext.isEmpty(grid)){
                                                 var gridStore = grid.getStore();
                                                 gridStore.load();
                                                 }*/
                                                Ext.getCmp('batchModifyCategory').close();
                                            }
                                        } else {
                                            mask.hide();
                                            Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message);
                                            return;
                                        }
                                    },
                                    failure: function (resp) {
                                        mask.hide();
                                        var response = Ext.JSON.decode(resp.responseText);
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                        return;
                                    }
                                })
                            })(h)
                        }
                    }
                }
            }]
        });
    },
    /**
     * 查看物料详情
     * @param id
     * @param isLeaf
     * @param parentId
     */
    checkMaterial: function (id, isLeaf, parentId) {
        JSOpen({
            id: 'material' + '_edit' + '1',
            url: path + "partials/material/edit.html?materialId=" + id + '&isLeaf=' + isLeaf + '&parentId=' + parentId + '&isOnly=true',
            title: i18n.getKey('sell') + i18n.getKey('materialInfo') + '(' + i18n.getKey('id') + ':' + id + ')',
            refresh: true
        })
    },
    editQuantityDsc: function (data) {

    },
    searchMaterialCategory: function (id, treePanel) {
        //旧的物料查询方式，查找对应的路径
        Ext.Ajax.request({
            url: adminPath + 'api/materialCategories/' + parseInt(id) + '/path',
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    treePanel.getSelectionModel().deselectAll();
                    var path = '/root' + responseMessage.data;
                    treePanel.selectPath(path);
                } else {
                    Ext.Msg.alert(i18n.getKey('prompt'), '没有该类目')
                }
            },
            failure: function (response) {
                Ext.Msg.alert(i18n.getKey('prompt'), '请求失败')
            }
        })

    },
    /**
     * 快速新建bomItem,获取完整的物料信息后才进行修改
     */
    quickCreateBomItem: function (clazz, materialData, grid) {
        var controller = this;
        JSAjaxRequest(adminPath + 'api/materials/' + materialData._id, 'GET', false, null, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                materialData = responseText.data;
                for (var i = 0; i < materialData.childItems.length; i++) {
                    var bomItem = materialData.childItems[i];
                    delete bomItem.allOptionalMaterials;
                }
            }
        })
        if (materialData) {
            var win = Ext.create('CGP.material.view.information.views.AddBomItemWin', {
                store: null,
                record: null,
                rootVisible: null,
                bomItemType: clazz,
                editOrNew: 'add',
                materialData: materialData,
                isCanSave: true,
                rootNode: {
                    _id: 'root',
                    name: 'root'
                },
                bbar: {
                    xtype: 'bottomtoolbar',
                    saveBtnCfg: {
                        handler: function (btn) {
                            var win = btn.ownerCt.ownerCt;
                            var materialData = win.materialData;
                            if (win.form.isValid()) {
                                var lm = win.setLoading();
                                var data = win.getValue();
                                var model = new CGP.material.model.BomItem(data);
                                if (Ext.isEmpty(data)) {
                                    return;
                                } else {
                                    if (materialData.childItems) {
                                        materialData.childItems.push(model.getData());
                                    } else {
                                        materialData.childItems = [];
                                        materialData.childItems.push(model.getData());
                                    }
                                    console.log(data);
                                    controller.updateMaterial(materialData);
                                    lm.hide();
                                    win.close();
                                    grid.store.load();
                                }
                            }
                        }
                    }
                }
            });
            win.show();
        }
    }
});
