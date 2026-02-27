Ext.syncRequire(['CGP.rtoption.model.RtOption', 'CGP.material.override.Filter',
    'CGP.material.override.NodeInterface', 'CGP.material.override.Model',
    'CGP.material.override.TreeStore', 'CGP.rtoption.model.RtOptionTag']);
Ext.define("CGP.rtoption.view.TreePanel", {
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
        loadMask: true,
        enableTextSelection: true,
        stripeRows: true,
    },
    autoScroll: true,
    children: null,
    itemId: 'rtOptionTagTree',
    id: 'rtOptionTagTree',
    selModel: {
        selType: 'rowmodel'
    },
    /**
     * 创建节点
     * @param data
     * @returns {{children: [], name: *, icon: string, description: *, text: *, id: *, leaf: boolean, parentId: null}}
     */
    createNode: function (data, parentId, isLeaf) {
        return {
            text: data['name'],
            id: data['id'],
            name: data['name'],
            description: data['description'],
            leaf: Ext.isEmpty(isLeaf) ? false : isLeaf,
            parentId: parentId,
            icon: '../rtoption/category.png',
            children: []
        };
    },
    /**
     * 查询tag
     * @param treePanel
     * @param store
     * @param tagId
     */
    searchTag: function (treePanel, store, tagId, noPrompt) {
        var params = [];
        if (tagId) {
            params.push({
                name: 'id',
                type: 'number',
                value: Number(tagId)
            });
        }
        store.proxy.extraParams = {
            filter: Ext.JSON.encode(params)
        };
        store.load({
            scope: this,
            callback: function (records, operation, success) {
                if (success) {
                    if (records.length < 1) {
                        var controller = Ext.create('CGP.rtoption.controller.Controller');
                        var record = Ext.create('CGP.rtoption.model.RtOptionTag', {
                            data: {}
                        });
                        record.set('id', -1);
                        controller.refreshRtOptionGrid(record, treePanel.ownerCt.getComponent('centerPanel'), treePanel.searchRtOptionId);
                        if (!noPrompt)
                            Ext.Msg.alert('提示', '查询不到tag数据！');
                    }
                } else {
                    Ext.Msg.alert('提示', '查询异常！');
                }
            }
        });
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
        me.title = i18n.getKey('rtoption') + i18n.getKey('tag');
        var controller = Ext.create('CGP.rtoption.controller.Controller');

        me.root = {
            text: "",
            expanded: true,
            children: []
        }
        var store = Ext.create('CGP.rtoption.store.RtOptionTag', {
            storeId: 'RtOptionTag',
            listeners: {
                load: function (store, record, success) {
                    if (success) {
                        store.each(function (rec) {
                            me.store.getRootNode().appendChild(me.createNode(rec.data, 'root', false));
                        });
                        me.getSelectionModel().select(0);
                    }
                },
                beforeload: function () {
                    me.store.load();
                }
            }
        });


        me.store = Ext.create('Ext.data.TreeStore', {
            fields: ['name', 'id', 'children', 'description', 'leaf', 'parentId', 'text'],
            root: {
                expanded: true,
                children: []
            }
        });

        me.tbar = [
            {
                xtype: 'button',
                flex: 2,
                text: i18n.getKey('add') + i18n.getKey('tag'),
                iconCls: 'icon_create',
                //hidden:
                handler: function () {
                    controller.editTag(me, null);
                }
            },
            {
                xtype: 'trigger',
                vtype: 'number',
                minLength: 6,
                minLengthText: '必须大于六个字符',
                flex: 3,
                defaultValue: null,
                itemId: 'rtoptionCategorySearch',
                trigger1Cls: 'x-form-clear-trigger',
                trigger2Cls: 'x-form-search-trigger',
                checkChangeBuffer: 600,//延迟600毫秒
                emptyText: '按Id查询分类',
                onTrigger2Click: function () {//按钮操作
                    var that = this;
                    var treePanel = that.ownerCt.ownerCt;
                    var tagId = that.getValue();
                    if (!Ext.isEmpty(tagId)) {
                        me.searchTag(treePanel, store, tagId);
                    }
                },
                onTrigger1Click: function () {//按钮操作
                    var me = this;
                    if (me.isValid()) {
                        var treePanel = me.ownerCt.ownerCt;
                        me.reset();
                        delete store.proxy.extraParams.filter;
                        treePanel.searchRtOptionId = null;
                        store.load();
                    }
                }
            },
            {
                xtype: 'trigger',
                vtype: 'number',
                flex: 3,
                defaultValue: null,
                itemId: 'rtoptionSearch',
                trigger1Cls: 'x-form-clear-trigger',
                trigger2Cls: 'x-form-search-trigger',
                minLength: 6,
                minLengthText: '必须大于六个字符',
                checkChangeBuffer: 600,//延迟600毫秒
                emptyText: '按Id查询option',
                onTrigger1Click: function () {//按钮操作
                    var me = this;
                    var treePanel = me.ownerCt.ownerCt;
                    me.reset();
                    delete store.proxy.extraParams.filter;
                    store.load();
                },
                onTrigger2Click: function () {//按钮操作
                    var that = this;
                    if (that.isValid()) {
                        var treePanel = that.ownerCt.ownerCt;
                        var rtoptionId = that.getValue();
                        Ext.Ajax.request({
                            url: adminPath + 'api/rtoptions/' + parseInt(rtoptionId),
                            thatthod: 'GET',
                            async: false,
                            headers: {
                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                            },
                            success: function (response) {
                                var resp = Ext.JSON.decode(response.responseText);
                                if (resp.success) {
                                    var tag = resp.data.tag;
                                    treePanel.searchRtOptionId = parseInt(rtoptionId);
                                    me.searchTag(treePanel, store, tag?.id ?? -1, true);
                                } else {
                                    Ext.Msg.alert(i18n.getKey('prompt'), resp.data.message);
                                    me.searchTag(treePanel, store, -1, true);
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
                width: 200,
                dataIndex: 'name',
                //locked: true,
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="' + value + '<' + record.get('id') + '>' + '"';
                    return value + '<font color="green"><' + record.get('id') + '></font>';
                }
            },
            {
                xtype: 'treecolumn',
                text: i18n.getKey('description'),
                flex: 1,
                dataIndex: 'description',
                tdCls: 'vertical-middle',
                iconCls: null,
                //locked: true,
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    metadata.icon
                    return value;
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
                var centerPanel = rowModel.view.ownerCt.ownerCt.getComponent('centerPanel');
                controller.refreshRtOptionGrid(record, centerPanel, me.searchRtOptionId);
                me.searchRtOptionId = null;
            },
            itemcontextmenu: function (view, record, item, index, e, eOpts) {
                controller.categoryEventMenu(view, record, e);
            },
            beforeitemexpand: function (node) {
                for (var i = 0, len = node.childNodes.length; i < len; i++) {
                    var curChild = node.childNodes[i];
                    curChild.set('icon', '../rtoption/category.png');
                }
            }
        }
        me.callParent(arguments);

    }
});
