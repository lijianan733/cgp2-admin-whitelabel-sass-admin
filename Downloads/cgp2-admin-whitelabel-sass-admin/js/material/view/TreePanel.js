Ext.syncRequire(['CGP.material.model.Material',
    'CGP.material.override.Filter',
    'CGP.material.override.NodeInterface',
    'CGP.material.override.Model',
    'CGP.material.override.TreeStore',
    'CGP.material.model.MaterialCategory']);
Ext.define("CGP.material.view.TreePanel", {
    extend: "Ext.tree.Panel",
    region: 'west',
    mixins: {
        Filter: 'CGP.material.override.Filter'
    },
    width: 390,
    collapsible: true,

    rootVisible: false,
    useArrows: true,
    viewConfig: {
        enableTextSelection: true,
        stripeRows: true,
        loadMask: true
    },
    autoScroll: true,
    children: null,
    itemId: 'categoryMaterialTree',
    id: 'categoryMaterialTree',
    selModel: {
        selType: 'rowmodel'
    },
    initComponent: function () {
        var me = this;
        Ext.apply(Ext.form.field.VTypes, {
            number: function (val, field) {
                return Ext.isNumber(parseInt(val));
            },
            numberText: '请输入正确的id',
            numberMask: /^\d$/
        });
        me.title = i18n.getKey('sell') + i18n.getKey('material') + i18n.getKey('catalog') + i18n.getKey('view');
        var controller = Ext.create('CGP.material.controller.Controller');
        var store = Ext.create('CGP.material.store.MaterialCategory');
        //Ext.create('CGP.material.store.MaterialCategory');
        me.store = store;
        //me.store.filter('type', 'MaterialSpu', true, false);
        store.on('load', function (store, node, records) {
            Ext.Array.each(records, function (item) {
                item.set('icon', '../material/category.png');

            });

        });

        me.tbar = [
            {
                xtype: 'button',
                flex: 2,
                text: i18n.getKey('add') + i18n.getKey('catalog'),
                iconCls: 'icon_create',
                //hidden:
                handler: function () {
                    controller.addCategory(me, null);
                }
            },
            {
                xtype: 'trigger',
                vtype: 'number',
                minLength: 6,
                flex: 3,
                defaultValue: null,
                itemId: 'materialCategorySearch',
                trigger1Cls: 'x-form-clear-trigger',
                trigger2Cls: 'x-form-search-trigger',
                checkChangeBuffer: 600,//延迟600毫秒
                emptyText: '按Id查询类目',
                onTrigger2Click: function () {//按钮操作
                    var me = this;
                    var treePanel = me.ownerCt.ownerCt;
                    var materialId = me.getValue();
                    var store = treePanel.store;
                    if (!Ext.isEmpty(materialId)) {
                        var oldUrl = store.proxy.url;
                        store.proxy.url = store.proxy.url.replace(/[{][a-zA-z]+[}]/, materialId);
                        store.load({
                            params: {
                                filter: '[{"name":"isQueryChildren","value":false,"type":"boolean"}]'
                            }
                        });
                        store.proxy.url = oldUrl;
                    }

                },
                onTrigger1Click: function () {//按钮操作
                    var me = this;
                    if (me.isValid()) {
                        var treePanel = me.ownerCt.ownerCt;
                        me.reset();
                        treePanel.searchMaterialId = null;
                        treePanel.store.load();
                    }
                }
            },
            {
                xtype: 'trigger',
                vtype: 'number',
                flex: 3,
                defaultValue: null,
                itemId: 'materialSearch',
                trigger1Cls: 'x-form-clear-trigger',
                trigger2Cls: 'x-form-search-trigger',
                minLength: 6,
                checkChangeBuffer: 600,//延迟600毫秒
                emptyText: '按Id查询物料',
                onTrigger1Click: function () {//按钮操作
                    var me = this;
                    var treePanel = me.ownerCt.ownerCt;
                    me.reset();
                    treePanel.store.load();
                },
                onTrigger2Click: function () {//按钮操作
                    var me = this;
                    if (me.isValid()) {
                        var treePanel = me.ownerCt.ownerCt;
                        var materialId = me.getValue();
                        Ext.Ajax.request({
                            url: adminPath + 'api/materials/' + parseInt(materialId),
                            method: 'GET',
                            async: false,
                            headers: {
                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                            },
                            success: function (response) {
                                var responseMessage = Ext.JSON.decode(response.responseText);
                                if (responseMessage.success) {
                                    var category = responseMessage.data.category;
                                    treePanel.searchMaterialId = materialId;
                                    if (!Ext.isEmpty(materialId)) {
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
                                    Ext.Msg.alert(i18n.getKey('prompt'), '没有该物料')
                                }
                            },
                            failure: function (response) {
                            }
                        });
                    }
                }
            }
        ];
        me.columns = [
            {
                xtype: 'treecolumn',
                text: i18n.getKey('name'),
                flex: 1,
                dataIndex: 'name',
                //locked: true,
                renderer: function (value, metadata, record) {
                    return record.get("name") + '<font color="green"><' + record.get('_id') + '></font>';
                }
            }
        ];
        me.bbar = Ext.create('Ext.PagingToolbar', {//底端的分页栏
            store: store,
            displayInfo: false, // 是否 ? 示， 分 ? 信息
            displayMsg: false, //?示的分?信息
            emptyMsg: i18n.getKey('noData')
        });
        me.listeners = {
            select: function (rowModel, record, index, eOpts) {
                var isLeaf = record.get('isLeaf');
                var parentId = record.get('parentId');
                var centerPanel = rowModel.view.ownerCt.ownerCt.getComponent('centerPanel');
                var treeStore = me.getStore();
                var type = record.get('type');
                var view = rowModel.view;
                var treeType = 'categoryTree';
                var searchMaterialId = me.searchMaterialId;
                controller.refreshMaterialGrid(record, centerPanel, isLeaf, parentId, searchMaterialId);
                me.searchMaterialId = null;
            },
            itemcontextmenu: function (view, record, item, index, e, eOpts) {
                var centerPanel = view.ownerCt.ownerCt.getComponent('centerPanel');
                var parentId = record.get('parentId');
                var isLeaf = record.get('isLeaf');
                var treeType = 'categoryTree';
                controller.categoryEventMenu(view, record, e, parentId, isLeaf, treeType);
            },
            itemexpand: function (node) {
                for (var i = 0, len = node.childNodes.length; i < len; i++) {
                    var curChild = node.childNodes[i];
                    curChild.set('icon', '../material/category.png');
                }
            },
            afterrender: function (view) {
                //插入切换视图功能
                view.getHeader().insert(1, {
                    xtype: 'displayfield',
                    value: '<a  style="color:#eef6fb" href="#")>' + i18n.getKey('switch') + i18n.getKey('view') + '</a>',
                    listeners: {
                        render: function (display) {
                            var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                            var ela = Ext.fly(a); //获取到a元素的element封装对象
                            ela.on("click", function () {
                                console.log(view);
                                var id = 'root';
                                var isLeaf = 'false';
                                var name = 'root';
                                JSOpen({
                                    id: 'materialpage',
                                    url: path + "partials/material/materialtree.html?materialId=" + id + '&materialName=' + name + '&isLeaf=' + isLeaf,
                                    title: i18n.getKey('produce') + i18n.getKey('materialTree'),
                                    refresh: true
                                });
                            });
                        }
                    }
                });

                //对传入的categoryId 和materialId进行查询
                var categoryId = JSGetQueryString('categoryId');
                var material = JSGetQueryString('materialId');
                if (categoryId) {
                    var materialCategorySearch = view.query('trigger[itemId=materialCategorySearch]')[0];
                    setTimeout(function () {
                        materialCategorySearch.setValue(categoryId);
                        materialCategorySearch.onTrigger2Click();
                        console.log(materialCategorySearch)
                    }, 500);

                }
                if (material) {
                    var materialSearch = view.query('trigger[itemId=materialSearch]')[0];
                    setTimeout(function () {
                        materialSearch.setValue(material);
                        materialSearch.onTrigger2Click();
                        console.log(materialSearch)
                    }, 500);
                }

            }
        }
        me.callParent(arguments);

    }
});
