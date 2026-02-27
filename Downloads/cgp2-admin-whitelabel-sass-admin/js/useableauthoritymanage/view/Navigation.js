/**
 * Created by nan on 2018/8/27.
 */
Ext.define("CGP.useableauthoritymanage.view.Navigation", {
    extend: "Ext.tree.Panel",
    region: 'west',
    header: false,
    width: '20%',
    collapsible: false,
    config: {
        rootVisible: false,
        useArrows: true,
        viewConfig: {
            stripeRows: true
        }
    },
    autoScroll: true,
    children: null,
    itemId: 'navigation',
    selModel: {
        selType: 'rowmodel'
    },
    viewConfig: {
        enableTextSelection: true
    },
    initComponent: function () {
        var me = this;
        var mask = new Ext.LoadMask(me, {
            msg: "加载中..."
        });
        Ext.apply(Ext.form.field.VTypes, {
            number: function (val, field) {
                return Ext.isNumber(parseInt(val));
            },
            numberText: '请输入正确的id',
            numberMask: /^\d$/
        });
        me.title = i18n.getKey('permission');
        var controller = Ext.create('CGP.useableauthoritymanage.controller.Controller');
        me.treeStore = Ext.create('Ext.data.TreeStore', {//显示用的treestore
            autoLoad: true,
            autoSync: true,
            fields: [
                'id', 'text', 'value', 'type', '_id', 'clazz', {name: 'privileges', type: 'array'}, 'code', 'name', 'description', {name: 'operation', type: 'object'}, {name: 'resource', type: 'object'}
            ],
            root: {
                expanded: true,
                children: []
            }
        });
        me.store = me.treeStore;
        me.dataStore.on('load', function (store, records) {
            var children = [];
            var recordData = [];
            Ext.Array.each(records, function (item) {
                recordData.push(item.getData());
            });
            children = controller.JSJsonToTree(recordData);
            me.getRootNode().removeAll();
            me.getRootNode().appendChild(children.children);

        });
        me.bbar = Ext.create('Ext.PagingToolbar', {
            store: me.dataStore,
            displayInfo: true,
            displayMsg: '',
            emptyMsg: i18n.getKey('noData')
        });
        me.tbar = [
            {
                xtype: 'button',
                flex: 2,
                text: i18n.getKey('add') + i18n.getKey('permission'),
                iconCls: 'icon_create',
                //hidden:
                handler: function () {
                    controller.showSelctTypeWin(me);
                }
            },
            {
                xtype: 'trigger',
                vtype: 'number',
                minLength: 6,
                flex: 3,
                itemId: 'materialCategorySearch',
                trigger1Cls: 'x-form-search-trigger',
                checkChangeBuffer: 600,//延迟600毫秒
                emptyText: '按Id查权限',
                onTrigger1Click: function () {//按钮操作
                    var me = this;
                    if (me.isValid()) {
                        var treePanel = me.ownerCt.ownerCt;
                        var id = me.getValue();
                        controller.searchData(id, treePanel)
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
                controller.loadRecord(record, centerPanel, searchMaterialId);
                me.searchMaterialId = null;
            },
            itemcontextmenu: function (view, record, item, index, e, eOpts) {
                var centerPanel = view.ownerCt.ownerCt.getComponent('centerPanel');
                var parentId = record.get('parentId');
                var isLeaf = record.get('isLeaf');
                var treeType = 'categoryTree';
                controller.categoryEventMenu(view, record, e, parentId, isLeaf, treeType);
            }
        }
        me.callParent(arguments);

    }
});