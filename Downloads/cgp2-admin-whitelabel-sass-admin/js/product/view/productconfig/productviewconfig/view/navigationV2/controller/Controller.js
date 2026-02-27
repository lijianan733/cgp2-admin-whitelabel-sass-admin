Ext.define('CGP.product.view.productconfig.productviewconfig.view.navigationV2.controller.Controller', {

    domainToDTOMapping: {
        'com.qpp.cgp.domain.product.config.view.navigation.dto.FixedNavItemDto': 'com.qpp.cgp.domain.product.config.view.navigation.config.FixedNavItemConfig',
        'com.qpp.cgp.domain.product.config.view.navigation.dto.FixedNavBarDto': 'com.qpp.cgp.domain.product.config.view.navigation.config.FixedNavBar',
        'com.qpp.cgp.domain.product.config.view.navigation.dto.DynamicNavBarDto': 'com.qpp.cgp.domain.product.config.view.navigation.config.DynamicNavBar',
        'com.qpp.cgp.domain.product.config.view.navigation.dto.DynamicNavItemDto': 'com.qpp.cgp.domain.product.config.view.navigation.config.DynamicNavItemConfig',
        'com.qpp.cgp.domain.product.config.view.navigation.config.FixedNavItemConfig': 'com.qpp.cgp.domain.product.config.view.navigation.dto.FixedNavItemDto',
        'com.qpp.cgp.domain.product.config.view.navigation.config.FixedNavBar': 'com.qpp.cgp.domain.product.config.view.navigation.dto.FixedNavBarDto',
        'com.qpp.cgp.domain.product.config.view.navigation.config.DynamicNavBar': 'com.qpp.cgp.domain.product.config.view.navigation.dto.DynamicNavBarDto',
        'com.qpp.cgp.domain.product.config.view.navigation.config.DynamicNavItemConfig': 'com.qpp.cgp.domain.product.config.view.navigation.dto.DynamicNavItemDto'


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
        var infoTab = view.ownerCt.ownerCt.getComponent('infoForm');
        var tree = view.ownerCt;
        var id = record.getId();
        var navigationId = JSGetQueryString('navigationId');
        me.refreshData(record, infoTab, isLeaf, parentId, navigationId);
        e.stopEvent();
        var types = {
            'com.qpp.cgp.domain.product.config.view.navigation.dto.FixedNavItemDto': 'naviItem',
            'com.qpp.cgp.domain.product.config.view.navigation.dto.DynamicNavItemDto': 'naviItem',
            'com.qpp.cgp.domain.product.config.view.navigation.dto.FixedNavBarDto': 'naviBar',
            'com.qpp.cgp.domain.product.config.view.navigation.dto.DynamicNavBarDto': 'naviBar'
        };
        console.log(record);
        var addBtnDisabled = false;
        if (record.isLeaf() == false && record.get('clazz') == 'com.qpp.cgp.domain.product.config.view.navigation.dto.DynamicNavBarDto') {
            //可变尺寸的导航下面只能有一个导航项
            addBtnDisabled = true;
        }
        var menu = Ext.create('Ext.menu.Menu', {
            items: [
                {
                    text: i18n.getKey('add') + types[record.get('clazz')],
                    itemId: 'add',
                    disabled: addBtnDisabled,
                    handler: function () {

                        var type = types[record.get('clazz')];
                        me.checkNaviItemType(type, record, tree, false, null);
                    }
                },
                {
                    text: i18n.getKey('delete'),
                    itemId: 'delete',
                    disabled: !record.isLeaf(),
                    handler: function () {
                        var treeStore = tree.getStore();
                        var parentNode = record.parentNode;
                        me.deleteNode(treeStore, infoTab, parentNode, navigationId, id);

                    }
                }
            ]
        });

        menu.showAt(e.getXY());


    }
    ,
    refreshData: function (record, infoTab, isLeaf, parentId, navigationId, tree) {
        Ext.Ajax.request({
            url: adminPath + 'api/navigationConfigs/' + navigationId + '/navigations/' + record.get('id'),
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                if (responseMessage.success) {
                    infoTab.refreshData(responseMessage.data, record, tree)
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
    ,
    checkNaviItemType: function (type, parentNode, tree, isRoot, addRootBar) {
        var me = this;
        var partnerNodeClazz = '';
        //加item时不能选类型
        var item = [];
        var clazz = parentNode.get('clazz');
        if (clazz == 'com.qpp.cgp.domain.product.config.view.navigation.dto.DynamicNavBarDto') {
            item.push(
                {
                    width: 120,
                    boxLabel: i18n.getKey('dynamicNaviItem'),
                    name: 'navigationType',
                    inputValue: 'dynamicNaviItem',
                    checked: true
                }
            );
        } else if (clazz == 'com.qpp.cgp.domain.product.config.view.navigation.dto.FixedNavBarDto') {
            item.push(
                {
                    width: 120,
                    boxLabel: i18n.getKey('fixNaviItem'),
                    name: 'navigationType',
                    inputValue: 'fixNaviItem',
                    checked: true
                }
            );
        } else {
            item.push({
                    width: 120,
                    boxLabel: i18n.getKey('fixNaviBar'),
                    name: 'navigationType',
                    inputValue: 'fixNaviBar',
                    checked: true
                }
            )
            item.push({
                    width: 120,
                    boxLabel: i18n.getKey('dynamicNaviBar'),
                    name: 'navigationType',
                    inputValue: 'dynamicNaviBar'
                }
            )
        }
        Ext.create('Ext.window.Window', {
            modal: true,
            defaultType: 'radio', // each item will be a radio button
            width: 450,
            height: 150,
            title: i18n.getKey('choice') + i18n.getKey('type'),
            items: [
                {
                    xtype: 'radiogroup',
                    fieldLabel: i18n.getKey('navigation') + i18n.getKey('node') + i18n.getKey('type'),
                    padding: 15,
                    // Arrange radio buttons into two columns, distributed vertically
                    columns: 2,
                    columnWidth: 80,
                    itemId: 'navigationType',
                    vertical: true,
                    items: item
                }
            ],
            bbar: ['->', {
                text: i18n.getKey('confirm'),
                iconCls: 'icon_agree',
                handler: function () {
                    var win = this.ownerCt.ownerCt;
                    var navigationType = win.getComponent('navigationType').getValue().navigationType;
                    var store = tree.getStore();
                    win.close();
                    me.addNode(parentNode, tree, store, addRootBar, navigationType, isRoot)

                }
            }, {
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function () {
                    var win = this.ownerCt.ownerCt;
                    win.close();
                }
            }]
        }).show();
    }
    ,
    addNode: function (parentNode, treeView, treeStore, addRootBar, navigationType, isRoot) {
        var me = this;
        var navigationClazzs = {
            'fixNaviItem': 'com.qpp.cgp.domain.product.config.view.navigation.dto.FixedNavItemDto',
            'fixNaviBar': 'com.qpp.cgp.domain.product.config.view.navigation.dto.FixedNavBarDto',
            'dynamicNaviBar': 'com.qpp.cgp.domain.product.config.view.navigation.dto.DynamicNavBarDto',
            'dynamicNaviItem': 'com.qpp.cgp.domain.product.config.view.navigation.dto.DynamicNavItemDto'
        };
        var resultData = {};
        resultData.clazz == navigationClazzs[navigationType];
        if (!parentNode.isRoot()) {
            resultData.parent = parentNode.data;
        }
        resultData.clazz = navigationClazzs[navigationType];
        var containerBody = treeView.ownerCt;
        var mask = containerBody.setLoading();
        var navigationId = JSGetQueryString('navigationId');
        Ext.Ajax.request({
            url: adminPath + 'api/navigationConfigs/' + navigationId + '/navigations',
            method: 'POST',
            jsonData: resultData,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                var data = responseMessage.data;
                if (responseMessage.success) {
                    treeStore.load({
                        node: parentNode,
                        callback: function (records) {
                            parentNode.set('isLeaf', false);
                            parentNode.set('leaf', false);
                            parentNode.expand();

                            var newNode = treeStore.getNodeById(data.id);
                            Ext.Array.each(records, function (item) {
                                var type = item.get('clazz');
                                if (type.split('.').pop() == 'FixedNavItemDto' || type.split('.').pop() == 'DynamicNavItemDTO') {
                                    item.set('icon', path + 'ClientLibs/extjs/resources/themes/images/ux/node.png');
                                } else {
                                    item.set('icon', path + 'ClientLibs/extjs/resources/themes/images/ux/category.png');
                                }
                            });
                            treeView.getSelectionModel().select(newNode);
                            if (isRoot) {
                                addRootBar.setDisabled(true)
                            }
                        }
                    });
                    me.updateNavigationConfig(navigationId, mask);
                } else {
                    mask.hide();
                    Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                }
            },
            failure: function (resp) {
                mask.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    }
    ,
    deleteNode: function (treeStore, infoForm, parentNode, navigationId, navigationNodeId) {
        var me = this;
        Ext.Msg.confirm('提示', '是否删除该节点？', callback);
        var mask = infoForm.ownerCt.setLoading();
        console.log('adfasdf')

        function callback(id) {
            if (id === 'yes') {
                Ext.Ajax.request({
                    url: adminPath + 'api/navigationConfigs/' + navigationId + '/navigations/' + navigationNodeId,
                    method: 'DELETE',
                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                    success: function (res) {
                        var responseMessage = Ext.JSON.decode(res.responseText);
                        var data = responseMessage.data;
                        if (responseMessage.success) {
                            Ext.Msg.alert('提示', "删除成功！");
                            //var rootNode = treeStore.getRootNode();
                            treeStore.load({
                                node: parentNode,
                                callback: function (records) {
                                    console.log('are')
                                    parentNode.isLeaf();
                                    if (records.length == 0) {
                                        parentNode.data.leaf = true;
                                        if (parentNode.isRoot() == true) {
                                            var navigationTree = infoForm.ownerCt.items.items[0];
                                            var addRootNodeBtn = navigationTree.getDockedItems('toolbar[dock="top"]')[0].getComponent('addRootNodeBtn');
                                            addRootNodeBtn.setDisabled(false);
                                        }
                                    }
                                    Ext.Array.each(records, function (item) {
                                        var type = item.get('clazz');
                                        if (type.split('.').pop() == 'FixedNavItemDto' || type.split('.').pop() == 'DynamicNavItemDTO') {
                                            item.set('icon', path + 'ClientLibs/extjs/resources/themes/images/ux/node.png');
                                        } else {
                                            item.set('icon', path + 'ClientLibs/extjs/resources/themes/images/ux/category.png');
                                        }
                                    });
                                }
                            });
                            infoForm.removeAll();
                            infoForm.down('toolbar').getComponent('btnSave').setDisabled(true);
                            me.updateNavigationConfig(navigationId, mask);
                        } else {
                            mask.hide();
                            Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                        }
                    },
                    failure: function (resp) {
                        mask.hide();
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                })
            }
        }
    }
    ,
    updateNode: function (record, treeView, treeStore, navigationId, navigationNodeId, updateData) {
        var me = this;
        var mask = treeView.ownerCt.setLoading();
        Ext.Ajax.request({
            url: adminPath + 'api/navigationConfigs/' + navigationId + '/navigations/' + navigationNodeId,
            method: 'PUT',
            jsonData: updateData,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                var data = responseMessage.data;
                if (responseMessage.success) {
                    var parentNode = record.parentNode;
                    treeStore.load({
                        node: parentNode,
                        callback: function (records) {
                            parentNode.set('isLeaf', false);
                            parentNode.set('leaf', false);
                            parentNode.expand();

                            var newNode = treeStore.getNodeById(navigationNodeId);
                            Ext.Array.each(records, function (item) {
                                var type = item.get('clazz');
                                if (type.split('.').pop() == 'FixedNavItemDto' || type.split('.').pop() == 'DynamicNavItemDTO') {
                                    item.set('icon', path + 'ClientLibs/extjs/resources/themes/images/ux/node.png');
                                } else {
                                    item.set('icon', path + 'ClientLibs/extjs/resources/themes/images/ux/category.png');
                                }
                            });
                            treeView.tree.getSelectionModel().select(newNode);
                            me.updateNavigationConfig(navigationId, mask);
                        }
                    });
                } else {
                    mask.hide();
                    Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                }
            },
            failure: function (resp) {
                mask.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    }
    ,
    updateNavigationConfig: function (navigationDTOId, mask) {
        var me = this;
        Ext.Ajax.request({
            url: adminPath + 'api/navigationConfigs/' + JSGetQueryString('navigationId'),
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                var navigationDTO = responseMessage.data;
                if (responseMessage.success) {
                    me.dataTransform(navigationDTO, mask);
                } else {
                    mask.hide();
                    Ext.Msg.alert('提示', '保存失败，DTO转换失败！')
                }
            },
            failure: function (resp) {
                mask.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    }
    ,
    dataTransform: function (navigationDTO, mask) {
        var me = this;
        var navigationDomain = navigationDTO.navigationConfigDomain;
        var navigations = [];
        Ext.each(navigationDTO.navigations, function (navigation) {
            navigations.push(JSON.parse(JSON.stringify(navigation)));
        });
        var navBarList = [];
        if (!Ext.isEmpty(navigations)) {
            navBarList = me.dataStructureCreate(navigations);
        }
        navigationDomain.navBarList = navBarList;
        navigationDTO.navigationConfigDomain = navigationDomain;
        Ext.Ajax.request({
            url: adminPath + 'api/navigationConfigs/' + JSGetQueryString('navigationId'),
            method: 'PUT',
            jsonData: navigationDTO,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                var navigationDTO = responseMessage.data;
                if (responseMessage.success) {
                    Ext.Msg.alert('提示', '保存成功！');
                    mask.hide();
                } else {
                    mask.hide();
                    Ext.Msg.alert('提示', '保存失败！')
                }
            },
            failure: function (resp) {
                mask.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });

    }
    ,
    /**
     * 处理导航节点数组的转换
     * @param navigations
     * @returns {any[]}
     */
    dataStructureCreate: function (navigations) {
        function DecisionTree(data) {
            this.data = data;
        }

        var navigationDomainClazzs = {
            'com.qpp.cgp.domain.product.config.view.navigation.dto.FixedNavItemDto': 'com.qpp.cgp.domain.product.config.view.navigation.config.FixedNavItemConfig',
            'com.qpp.cgp.domain.product.config.view.navigation.dto.FixedNavBarDto': 'com.qpp.cgp.domain.product.config.view.navigation.config.FixedNavBar',
            'com.qpp.cgp.domain.product.config.view.navigation.dto.DynamicNavBarDto': 'com.qpp.cgp.domain.product.config.view.navigation.config.DynamicNavBar',
            'com.qpp.cgp.domain.product.config.view.navigation.dto.DynamicNavItemDto': 'com.qpp.cgp.domain.product.config.view.navigation.config.DynamicNavItemConfig'
        };

        DecisionTree.prototype.allPaths = function () {
            var self = this;

            function depthFirstPreOrder(node, paths, position) {
                var i, count, path;
                var children = self.children(node);
                node.clazz = navigationDomainClazzs[node.clazz];
                if (node.clazz == 'com.qpp.cgp.domain.product.config.view.navigation.config.FixedNavItemConfig' || node.clazz == 'com.qpp.cgp.domain.product.config.view.navigation.config.DynamicNavItemConfig') {
                    if (!Ext.isEmpty(node.sortOrder)) {
                        node.index = node.sortOrder;
                    }
                } else {
                    //导航栏类型
                    if (node.parent != null) {
                        node.parentId = node.parent.id;
                    } else {
                        node.parentId = 0;
                    }
                }
                delete node.parent;
                if (children.length > 0) {
                    for (i = 0, count = children.length; i < count; i++) {
                        child = children[i];

                        if (i > 0) {
                            position.pop();
                        }
                        position.push(child);

                        depthFirstPreOrder(child, paths, position);

                        if (i == count - 1) {
                            position.pop();
                        }
                    }
                    path = children.map(function (current) {
                        var record = current;
                        return record;
                    });
                    if (node.clazz == 'com.qpp.cgp.domain.product.config.view.navigation.config.FixedNavBar') {
                        node.navItemList = path;
                        paths.push(node);
                    } else if (node.clazz == 'com.qpp.cgp.domain.product.config.view.navigation.config.DynamicNavBar') {
                        node.navItemConfig = path[0];
                        paths.push(node);
                    }
                } else {
                    if (node.clazz == 'com.qpp.cgp.domain.product.config.view.navigation.config.FixedNavBar' || node.clazz == 'com.qpp.cgp.domain.product.config.view.navigation.config.DynamicNavBar') {
                        paths.push(node);
                    } else {
                    }

                }
            }

            var root = this.root();

            var paths = new Array(), position = new Array();

            depthFirstPreOrder(root, paths, position);

            return paths;
        };

        DecisionTree.prototype.children = function (node) {
            return this.data.filter(function (currentValue) {
                var parentId;
                if (currentValue.parent != null) {
                    parentId = currentValue.parent.id;
                }
                var isOK = (parentId === node.id);
                return isOK;
            });
        };

        DecisionTree.prototype.root = function () {
            var arrRoot = this.data.filter(function (currentValue) {
                var isOK = (Ext.isEmpty(currentValue.parent) || currentValue.parent.id == 0);
                return isOK;
            });
            return arrRoot[0];
        };

        var tree = new DecisionTree(navigations);

        var paths = tree.allPaths();
        console.log(paths);
        return paths;
    }
    ,
    getSimplifyBom: function (productViewConfigId, component, selectorType) {
        var win = Ext.create('CGP.product.view.productconfig.productviewconfig.view.navigationV2.view.IdTargetSelectorWindow', {
            productViewConfigId: productViewConfigId,
            idTextField: component,
            selectorType:selectorType
        });
        win.show();
    }
    ,
    /**
     * JSON配置转DTO
     * @constructor
     */
    navigationJSONToDTO: function (JSONData, DTO) {
        var controller = this;
        var DTO = {
            clazz: "com.qpp.cgp.domain.product.config.view.navigation.dto.NavigationConfigDto",
            navigationConfigDomain: JSONData,
            navigations: [],
            productConfigViewId: JSONData.productConfigViewId,
            _id: DTO ? DTO._id : null
        }
        var navigations = [];
        if (JSONData.navBarList) {
            for (var i = 0; i < JSONData.navBarList.length; i++) {
                var navBar = JSONData.navBarList[i];
                //在他们的子中找到对应的id,的clazz
                var parentClazz = '';
                if (navBar.parentId) {
                    for (var j = 0; j < JSONData.navBarList.length; j++) {
                        if (JSONData.navBarList[j].clazz == 'com.qpp.cgp.domain.product.config.view.navigation.config.FixedNavBar') {
                            if (JSONData.navBarList[j].navItemList) {
                                for (var k = 0; k < JSONData.navBarList[j].navItemList.length; k++) {
                                    if (navBar.parentId == JSONData.navBarList[j].navItemList[k].id) {
                                        parentClazz = controller.domainToDTOMapping[JSONData.navBarList[j].navItemList[k].clazz];
                                        break;
                                    }
                                }
                            }
                        } else {
                            if (JSONData.navBarList[j].navItemConfig && navBar.parentId == JSONData.navBarList[j].navItemConfig.id) {
                                parentClazz = controller.domainToDTOMapping[JSONData.navBarList[j].navItemConfig.clazz]
                                break;
                            }
                        }
                    }
                } else {
                    //处理根节点
                    if (navBar.clazz == 'com.qpp.cgp.domain.product.config.view.navigation.config.DynamicNavBar') {
                        parentClazz = 'com.qpp.cgp.domain.product.config.view.navigation.dto.DynamicNavBarDto'
                    } else {
                        parentClazz = 'com.qpp.cgp.domain.product.config.view.navigation.dto.FixedNavBarDto'
                    }
                }
                navigations.push({
                    clazz: controller.domainToDTOMapping[navBar.clazz],
                    description: navBar.description || ('导航栏_' + navBar.id),
                    id: navBar.id,
                    isOrderly: navBar.isOrderly || false,
                    useHistory: navBar.useHistory || false,
                    parent: {//处理parentId为0和改字段不存在的情况
                        clazz: parentClazz,
                        id: navBar.parentId || 0
                    },
                });
                //固定的可以有多个
                if (navBar.navItemList) {
                    for (var j = 0; j < navBar.navItemList.length; j++) {
                        var navItem = navBar.navItemList[j];
                        navigations.push({
                            id: navItem.id,
                            clazz: "com.qpp.cgp.domain.product.config.view.navigation.dto.FixedNavItemDto",
                            displayName: navItem.displayName,
                            displayTitle: navItem.displayTitle,
                            parent: {
                                id: navBar.id,
                                clazz: "com.qpp.cgp.domain.product.config.view.navigation.dto.FixedNavBarDto"
                            },
                            sortOrder: navItem.index,
                            previewItem: navItem.previewItem,
                            showWhenPreview: navItem.showWhenPreview,
                            targetSelector: navItem.targetSelector,
                            verifyType: navItem.verifyType || 'None',
                        });
                    }
                }
                //可变尺寸的仅有一个
                if (navBar.navItemConfig) {
                    navigations.push({
                        id: navBar.navItemConfig.id,
                        clazz: controller.domainToDTOMapping[navBar.navItemConfig.clazz],
                        parent: {
                            clazz: "com.qpp.cgp.domain.product.config.view.navigation.dto.DynamicNavBarDto",
                            id: navBar.id
                        },
                        navItemIndexExpression: navBar.navItemConfig.navItemIndexExpression,
                        displayNameExpression: navBar.navItemConfig.displayNameExpression,
                        displayTitleExpression: navBar.navItemConfig.displayTitleExpression,
                        previewItem: navBar.navItemConfig.previewItem,
                        showWhenPreview: navBar.navItemConfig.showWhenPreview,
                        targetSelector: navBar.navItemConfig.targetSelector,
                        verifyType: navBar.navItemConfig.verifyType || 'None',
                    });
                }
            }
        }
        DTO.navigations = navigations;
        console.log(DTO);
        return DTO;
    }
    ,
    /**
     *根据productViewId获取导航数据
     */
    getNavigationConfig: function (productConfigViewId) {
        var result = null;
        var filter = [{"name": "productConfigViewId", "value": productConfigViewId, "type": "number"}];
        var url = encodeURI(adminPath + 'api/navigations?page=1&limit=23&filter=' + Ext.JSON.encode(filter));
        Ext.Ajax.request({
            url: url,
            method: 'GET',
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    result = responseMessage.data.content[0];
                } else {
                }
            }
        })
        return result;
    }
    ,
    /**
     *直接操作DTO数据进行修改
     * @param data
     * @param win
     * @param productConfigViewId
     */
    saveNavigationDTOConfig: function (data, productConfigViewId, win) {
        var id = data._id;
        var method = 'POST';
        var url = adminPath + 'api/navigationConfigs';
        if (id) {
            method = 'PUT';
            url = adminPath + 'api/navigationConfigs/' + id;
        }
        data.productConfigViewId = productConfigViewId;
        JSAjaxRequest(url, method, false, data, i18n.getKey('saveSuccess'), function (require, success, response) {
            win.close();
           ;
        })
    }
    ,

    /**
     * 直接通过json数据进修改Navigation
     * @param productViewConfigId
     */
    editNavigationConfigByJSON: function (productViewConfigId, isLock) {
        var controller = this;
        var navigation = '';
        navigation = controller.getNavigationConfig(productViewConfigId);
        if (Ext.isEmpty(navigation)) {
            navigation = {
                "clazz": "com.qpp.cgp.domain.product.config.view.navigation.config.NavigationConfig",
                "productConfigViewId": productViewConfigId,
            }
        }
        JSShowJsonDataV2(navigation, i18n.getKey('compile') + '_' + i18n.getKey('navigation') + '(无法添加视图界面中没有的配置项)', null, {
            editable: isLock ? false : true,
            showValue: true,
            readOnly: isLock ? true : false,
            bbar: {
                hidden: isLock ? true : false,
                items: ['->', {
                    xtype: 'button',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var JSONData = win.getValue();
                        try {
                            var DTOData = controller.navigationJSONToDTO(JSONData, controller.getNavigationDTOConfig(productViewConfigId, false));
                            controller.saveNavigationDTOConfig(DTOData, productViewConfigId, win);
                        } catch (e) {
                            Ext.Msg.alert(i18n.getKey('prompt'), e.message);
                        }
                    }
                }, {
                    xtype: 'button',
                    iconCls: "icon_cancel",
                    text: i18n.getKey('cancel'),
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        win.close();
                    }
                }]
            }

        });
    },

    checkHaveNavigation: function (productViewConfigId, builderConfigTab) {
        Ext.Ajax.request({
            url: encodeURI(adminPath + 'api/navigationConfigs?page=1&limit=25&filter=[{"name":"productConfigViewId","value":"' + productViewConfigId + '","type":"number"}]'),
            method: 'GET',
            //async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    var data = responseMessage.data.content[0];
                    if (data) {
                        var navigationId = data._id;
                        var haveRootNode = !Ext.isEmpty(data.navigations);
                        builderConfigTab.managerNavigationTree(productViewConfigId, navigationId, haveRootNode)
                    } else {
                        Ext.Msg.confirm(i18n.getKey('prompt'), '当前的导航配置为空，是否新建该配置？', function (select) {
                            if (select == 'yes') {
                                Ext.Ajax.request({
                                    url: adminPath + 'api/navigationConfigs',
                                    method: 'POST',
                                    async: false,
                                    headers: {
                                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                    },
                                    jsonData: {
                                        "navigationConfigDomain": {
                                            "productConfigViewId": productViewConfigId,
                                            "navBarList": [],
                                            "clazz": "com.qpp.cgp.domain.product.config.view.navigation.config.NavigationConfig"
                                        },
                                        "productConfigViewId": productViewConfigId,
                                        "navigations": [],
                                        "clazz": "com.qpp.cgp.domain.product.config.view.navigation.dto.NavigationConfigDto"
                                    },
                                    success: function (response) {
                                        var responseMessage = Ext.JSON.decode(response.responseText);
                                        if (responseMessage.success) {
                                            var data = responseMessage.data;
                                            var navigationId = data._id;
                                            var haveRootNode = false;
                                            builderConfigTab.managerNavigationTree(productViewConfigId, navigationId, haveRootNode)
                                        } else {
                                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                        }
                                    },
                                    failure: function (response) {
                                        var responseMessage = Ext.JSON.decode(response.responseText);
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                    }
                                })
                            } else {
                                return;
                            }
                        })
                    }
                } else {
                    // Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }

            }
        });
    }
    ,
    /**
     * 获取到导航DTO配置
     * @param productConfigViewId
     * @returns {*}
     */
    getNavigationDTOConfig: function (productConfigViewId, async) {
        var result = null;
        var filter = [{"name": "productConfigViewId", "value": productConfigViewId, "type": "number"}];
        var url = encodeURI(adminPath + 'api/navigationConfigs?page=1&limit=23&filter=' + Ext.JSON.encode(filter));
        Ext.Ajax.request({
            url: url,
            method: 'GET',
            async: async,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    result = responseMessage.data.content[0];
                } else {
                }
            }
        })
        return result;
    }

})
;