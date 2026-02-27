/**
 * Created by nan on 2018/8/16.
 */
Ext.define("CGP.acprole.view.SelectAcpRoleWin", {
    extend: 'Ext.window.Window',
    modal: true,
    width: 800,
    height: 700,
    constrain: true,//限制在父容器内
    layout: 'fit',
    showValue: true,
    title: i18n.getKey('check') + i18n.getKey('authorityEffectRange'),
    searchData: function (view) {
        var treePanel = view.ownerCt.ownerCt;
        var research = view.ownerCt.getComponent('research').getValue().trim();
        if (research) {
            var store = treePanel.store;
            var rootRecord = store.getRootNode();
            var selectRecordArray = [];
            var selectMode = treePanel.getSelectionModel();
            rootRecord.cascadeBy(function (node) {
                if (node.get('_id').match(research)) {//模糊查找出所有匹配项
                    selectRecordArray.push((node))
                    treePanel.expandPath(node.getPath());
                }
            });
            selectMode.select(selectRecordArray);
        }
    },
    initComponent: function () {
        var me = this;
        var JSJsonToTree = Ext.ux.util.jsonToTree = function (data, rootName) {
            var root = {
                text: rootName || 'context',
                leaf: false,
                children: [],
                depth: 1,
                id: 'root'
            };
            var createChildNode = function (data, returnRoot) {
                for (var i = 0; i < data.length; i++) {
                    var itemId = JSGetUUID();
                    var root = {};
                    root = Ext.Object.merge({
                        type: 'object',
                        leaf: true,
                        depth: returnRoot.depth + 1,
                        partnerId: returnRoot.id,
                        id: itemId
                    }, {
                        text: i,
                        _id: data[i]._id,
                        clazz: data[i].clazz,
                        code: data[i].code,
                        name: data[i].name,
                        description: data[i].description
                    });
                    if (data[i].clazz == 'com.qpp.security.domain.acp.Role') {
                        root.children = [];
                        root.leaf = false;
                        createChildNode(data[i].abstractACPDTOS, root);
                    }
                    returnRoot.children.push(root)
                }
                return returnRoot;
            }
            return createChildNode(data, root);
        };
        var store = Ext.create('Ext.data.TreeStore', {
            autoLoad: true,
            autoSync: true,
            fields: [
                'id', 'text', 'value', 'type', '_id', 'clazz', {name: 'abstractACPDTOS', type: 'array'}, 'code', 'name', 'description'
            ],
            root: {
                expanded: true,
                children: JSJsonToTree(me.data, 'data').children
            }
        });
        var controller = Ext.create('CGP.acprole.controller.Controller');
        var grid = me.grid = Ext.create('Ext.tree.Panel', {
            height: 500,
            width: 900,
            store: store,
            rootVisible: false,
            useArrows: true,
            layout: 'fit',
            lines: false,
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true
            },
            tbar: [
                {
                    xtype: 'button',
                    text: '全部展开',
                    handler: function (view) {
                        view.ownerCt.ownerCt.expandAll()
                    }
                },
                {
                    xtype: 'button',
                    text: '全部收缩',
                    handler: function (view) {
                        view.ownerCt.ownerCt.collapseAll()
                    }
                },
                '->',
                {
                    xtype: 'textfield',
                    itemId: 'research',
                    emptyText: '根据编号查找',
                    handler: function (view) {
                        view.ownerCt.ownerCt.collapseAll()
                    }
                },
                {
                    //该查找只能查找出第一个匹配数据
                    xtype: 'button',
                    text: '查找',
                    handler: function (view) {
                        me.searchData(view);
                    }
                }
            ],
            columns: {
                items: [
                    {
                        text: i18n.getKey('id'),
                        flex: 1,
                        xtype: 'treecolumn',
                        hidden: !me.showValue,
                        dataIndex: '_id',
                        iconCls: '../material/category.png',
                        sortable: true,
                        renderer: function (value, metadata, record) {
                            if (record.getData().leaf) {
                                var returnStr = record.getData().name + '<a  style="text-decoration:none;color:green" href="#" onclick="openPanel(' + value + ')"> <' + value + '></a>';
                                return returnStr;
                            } else {
                                return record.getData().name;
                            }
                        }
                    },
                    /*   {
                     text: i18n.getKey('name'),
                     flex: 1,
                     iconCls: null,
                     expanderCls: null,
                     xtype: 'treecolumn',
                     hidden: !me.showValue,
                     dataIndex: 'name',
                     sortable: true
                     },*/
                    {
                        text: i18n.getKey('description'),
                        flex: 1,
                        iconCls: null,
                        expanderCls: null,
                        xtype: 'treecolumn',
                        hidden: !me.showValue,
                        dataIndex: 'description',
                        sortable: true
                    }
                ]
            }
        });
        me.items = [grid];
        me.grid = grid;
        me.callParent(arguments);
    }
});
