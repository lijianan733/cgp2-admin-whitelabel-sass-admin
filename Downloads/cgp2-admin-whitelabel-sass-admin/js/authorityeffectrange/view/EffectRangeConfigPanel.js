/**
 * Created by nan on 2018/8/14.
 * 添加编辑功能，可以通过tree和textarea进行编辑
 */
Ext.define('CGP.authorityeffectrange.view.EffectRangeConfigPanel', {
    extend: 'Ext.tree.Panel',
    layout: 'fit',
    rawData: null,//源数据
    width: 600,
    height: 600,
    showValue: false,//默认只显示key
    editable: false,//字段是否可以编辑
    rootVisible: false,
    useArrows: true,
    jsonData: null,//保存最终的json数据
    selModel: Ext.create("Ext.selection.RowModel", {
        mode: "multi",
        allowDeselect: true,
        enableKeyNav: true
    }),
    lines: false,
    viewConfig: {
        enableTextSelection: true
    },
    getValue: function () {
        var me = this;
        return me.jsonData;
    },
    searchData: function (view) {
        var treePanel = view.ownerCt.ownerCt;
        var research = view.ownerCt.getComponent('research').getValue().trim();
        if (research) {
            var store = treePanel.store;
            var rootRecord = store.getRootNode();
            var selectRecordArray = [];
            var selectMode = treePanel.getSelectionModel();
            rootRecord.cascadeBy(function (node) {
                if (node.get('text').match(research)) {//模糊查找出所有匹配项
                    selectRecordArray.push((node))
                    treePanel.expandPath(node.getPath());
                }
            });
            selectMode.select(selectRecordArray);
        }
    },
    showRightClickMenu: function (node, record, item, index, e, eOpts) {
        e.stopEvent();
        var isRoot = record.parentNode.isRoot();
        var isMapValue = record.get('type') == 'map' || record.get('text') == 'constraints' || record.get('text') == 'value';
        var nodemenu = new Ext.menu.Menu({
            items: [
                {
                    text: "转换为属性名子叶节点",
                    hidden: isMapValue || isRoot,
                    handler: function () {
                        record.removeAll()
                        record.appendChild([
                            {
                                text: 'property',
                                leaf: true,
                                children: [],
                                type: 'map',
                                depth: record.getDepth() + 1,
                                partnerId: record.getId(),
                                value: null,
                                id: JSGetUUID()
                            }
                        ]);
                    }
                },
                {

                    text: "转换为值子叶节点",
                    hidden: isMapValue || isRoot,
                    handler: function () {
                        record.removeAll();
                        var partnerId = JSGetUUID();
                        record.appendChild([
                            {
                                text: 'value',
                                leaf: false,
                                children: [
                                    {
                                        text: 'type',
                                        leaf: true,
                                        children: [],
                                        type: 'map',
                                        depth: record.getDepth() + 2,
                                        partnerId: partnerId,
                                        value: 'String',
                                        id: JSGetUUID()
                                    },
                                    {
                                        text: 'value',
                                        leaf: true,
                                        children: [],
                                        type: 'map',
                                        depth: record.getDepth() + 2,
                                        partnerId: partnerId,
                                        value: null,
                                        id: JSGetUUID()
                                    }
                                ],
                                type: 'object',
                                depth: record.getDepth() + 1,
                                partnerId: record.getId(),
                                value: null,
                                id: partnerId
                            }

                        ]);
                    }
                },
                {
                    text: "转换为二元节点",
                    hidden: isMapValue,
                    cls: 'x-btn-text-icon',
                    handler: function () {
                        Ext.MessageBox.confirm("提示", "是否确定转换？", function (e) {
                            if (e == "yes") {
                                record.removeAll()
                                var leftPartnerId = JSGetUUID();
                                var rightPartnerId = JSGetUUID();
                                var valueNodeId = JSGetUUID();
                                record.appendChild([
                                    {
                                        text: 'tokenName',
                                        leaf: true,
                                        children: [],
                                        type: 'map',
                                        depth: record.getDepth() + 1,
                                        partnerId: record.getId(),
                                        value: null,
                                        id: JSGetUUID()
                                    },
                                    {
                                        text: 'left',
                                        leaf: false,
                                        children: [
                                            {
                                                text: 'property',
                                                leaf: true,
                                                children: [],
                                                type: 'map',
                                                depth: record.getDepth() + 1,
                                                partnerId: leftPartnerId,
                                                value: null,
                                                id: JSGetUUID()
                                            }

                                        ],
                                        type: 'object',
                                        depth: record.getDepth() + 1,
                                        partnerId: record.getId(),
                                        value: null,
                                        id: leftPartnerId,
                                        icon: path + 'ClientLibs/extjs/resources/themes/images/ux/object.gif'
                                    },
                                    {
                                        text: 'right',
                                        leaf: false,
                                        children: [
                                            {
                                                text: 'value',
                                                leaf: false,
                                                children: [
                                                    {
                                                        text: 'type',
                                                        leaf: true,
                                                        children: [],
                                                        type: 'map',
                                                        depth: record.getDepth() + 3,
                                                        partnerId: valueNodeId,
                                                        value: 'String',
                                                        id: JSGetUUID()
                                                    },
                                                    {
                                                        text: 'value',
                                                        leaf: true,
                                                        children: [],
                                                        type: 'map',
                                                        depth: record.getDepth() + 3,
                                                        partnerId: valueNodeId,
                                                        value: null,
                                                        id: JSGetUUID()
                                                    }
                                                ],
                                                type: 'object',
                                                depth: record.getDepth() + 2,
                                                partnerId: valueNodeId,
                                                value: null,
                                                id: valueNodeId
                                            }
                                        ],
                                        type: 'object',
                                        depth: record.getDepth() + 1,
                                        partnerId: record.getId(),
                                        value: null,
                                        id: rightPartnerId,
                                        icon: path + 'ClientLibs/extjs/resources/themes/images/ux/object.gif'
                                    }
                                ]);
                            }
                        });
                    }
                },
                {
                    text: "转换为三元节点",
                    hidden: isMapValue,
                    cls: 'x-btn-text-icon',
                    handler: function () {
                        Ext.MessageBox.confirm("提示", "是否确定转换？", function (e) {
                            if (e == "yes") {
                                var leftPartnerId = JSGetUUID();
                                var downPartnerId = JSGetUUID();
                                var rightPartnerId = JSGetUUID();
                                var valueNodeId = JSGetUUID();
                                var downValueNodeId = JSGetUUID();
                                record.removeAll()
                                record.appendChild([
                                    {
                                        text: 'tokenName',
                                        leaf: true,
                                        children: [],
                                        type: 'map',
                                        depth: record.getDepth() + 1,
                                        partnerId: record.getId(),
                                        value: null,
                                        id: JSGetUUID()
                                    },
                                    {
                                        text: 'left',
                                        leaf: false,
                                        children: [
                                            {
                                                text: 'property',
                                                leaf: true,
                                                children: [],
                                                type: 'map',
                                                depth: record.getDepth() + 1,
                                                partnerId: leftPartnerId,
                                                value: null,
                                                id: JSGetUUID()
                                            }

                                        ],
                                        type: 'object',
                                        depth: record.getDepth() + 1,
                                        partnerId: record.getId(),
                                        value: null,
                                        id: leftPartnerId,
                                        icon: path + 'ClientLibs/extjs/resources/themes/images/ux/object.gif'
                                    },
                                    {
                                        text: 'down',
                                        leaf: false,
                                        children: [
                                            {
                                                text: 'value',
                                                leaf: false,
                                                children: [
                                                    {
                                                        text: 'type',
                                                        leaf: true,
                                                        children: [],
                                                        type: 'map',
                                                        depth: record.getDepth() + 3,
                                                        partnerId: downValueNodeId,
                                                        value: 'String',
                                                        id: JSGetUUID()
                                                    },
                                                    {
                                                        text: 'value',
                                                        leaf: true,
                                                        children: [],
                                                        type: 'map',
                                                        depth: record.getDepth() + 3,
                                                        partnerId: downValueNodeId,
                                                        value: null,
                                                        id: JSGetUUID()
                                                    }
                                                ],
                                                type: 'object',
                                                depth: record.getDepth() + 2,
                                                partnerId: downPartnerId,
                                                value: null,
                                                id: downValueNodeId
                                            }
                                        ],
                                        type: 'object',
                                        depth: record.getDepth() + 1,
                                        partnerId: record.getId(),
                                        value: null,
                                        id: downPartnerId,
                                        icon: path + 'ClientLibs/extjs/resources/themes/images/ux/object.gif'
                                    },
                                    {
                                        text: 'right',
                                        leaf: false,
                                        children: [
                                            {
                                                text: 'value',
                                                leaf: false,
                                                children: [
                                                    {
                                                        text: 'type',
                                                        leaf: true,
                                                        children: [],
                                                        type: 'map',
                                                        depth: record.getDepth() + 3,
                                                        partnerId: valueNodeId,
                                                        value: 'String',
                                                        id: JSGetUUID()
                                                    },
                                                    {
                                                        text: 'value',
                                                        leaf: true,
                                                        children: [],
                                                        type: 'map',
                                                        depth: record.getDepth() + 3,
                                                        partnerId: valueNodeId,
                                                        value: null,
                                                        id: JSGetUUID()
                                                    }
                                                ],
                                                type: 'object',
                                                depth: record.getDepth() + 2,
                                                partnerId: rightPartnerId,
                                                value: null,
                                                id: valueNodeId
                                            }
                                        ],
                                        type: 'object',
                                        depth: record.getDepth() + 1,
                                        partnerId: record.getId(),
                                        value: null,
                                        id: rightPartnerId,
                                        icon: path + 'ClientLibs/extjs/resources/themes/images/ux/object.gif'
                                    }
                                ]);
                            }
                        });
                    }
                }
            ]
        });
        if (!isMapValue) {
            nodemenu.showAt(e.getPoint());
        }
    },
    //设置动态的editor实例类型
    beforeEdit: function () {
        var field = arguments[1].grid;
        arguments[1].grid.ownerCt.getName()
        var type = arguments[1].record.get('type');
        var text = arguments[1].record.get('text')
        if (type == 'object' || type == 'array') {
            return false
        }
        if (text == 'clazz' || text == 'constraints' || text == 'scope') {
            return false
        }
        if (arguments[1].record.get('text') == 'tokenName') {
            arguments[1].column.setEditor(field.tokenNameComboxField)
        } else if (arguments[1].record.get('text') == 'type') {
            arguments[1].column.setEditor(field.typeComboField)
        } else {
            arguments[1].column.setEditor(field.textField)

        }

    },
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.authorityeffectrange.controller.Controller');
        Ext.define('promptWindown', {
            extend: 'Ext.window.Window',
            layout: 'fit',
            width: 200,
            modal: true,
            height: 120,
            initComponent: function () {
                var me = this;
                me.items = [
                    {
                        xtype: 'form',
                        layout: {
                            type: 'vbox',
                            align: 'center',
                            pack: 'center'

                        },
                        items: [
                            {
                                xtype: 'textfield',
                                itemId: 'value',
                                margin: " 1 1 1 1",
                                width: '100%'
                            }
                        ],
                        bbar: {
                            layout: {
                                type: 'hbox',
                                align: 'center',
                                pack: 'center'
                            },
                            items: [
                                {
                                    text: i18n.getKey('ok'),
                                    width: 60,
                                    handler: me.okHandler

                                },
                                {
                                    text: i18n.getKey('cancel'),
                                    width: 60,
                                    handler: function (view) {
                                        view.ownerCt.ownerCt.ownerCt.close();
                                    }
                                }
                            ]
                        }
                    }
                ]
                me.callParent(arguments);
            }
        });
        var rawData = me.rawData || {
            "tokenName": null,
            "left": {
                "property": null,
                "clazz": "com.qpp.security.domain.ast.IdentNode"
            },
            "right": {
                "value": {
                    "type": "String",
                    "constraints": [],
                    "value": null,
                    "clazz": "com.qpp.cgp.value.ConstantValue"
                },
                "clazz": "com.qpp.security.domain.ast.ValueNode"
            },
            "clazz": "com.qpp.security.domain.ast.BinaryOperatorNode"
        };//源数据
        title = me.title || null;
        var tokenNameComboxStore = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'name',
                    type: 'string'
                }
            ],
            proxy: {
                type: 'uxrest',
                reader: {
                    type: 'json',
                    root: 'data',
                    readRecords: function (data) {
                        var me = this,
                            success,
                            recordCount,
                            records,
                            root,
                            total,
                            value,
                            message;
                        if (me.lastFieldGeneration !== me.model.prototype.fields.generation) {
                            me.buildExtractors(true);
                        }
                        me.rawData = data;
                        var array = [];
                        for (var i = 0; i < data.data.length; i++) {
                            array[i] = {name: data.data[i]}
                        }
                        data.data = array;
                        success = true;
                        recordCount = 0;
                        records = [];
                        if (me.successProperty) {
                            value = me.getSuccess(data);
                            if (value === false || value === 'false') {
                                success = false;
                            }
                        }
                        if (me.messageProperty) {
                            message = me.getMessage(data);
                        }
                        if (me.readRecordsOnFailure || success) {
                            root = Ext.isArray(data) ? data : data.data;//强制使root节点指定data.content
                            if (Ext.isEmpty(total)) {
                                total = me.rawData.data.totalCount;
                            }
                            if (root) {
                                records = me.extractData(root);
                                recordCount = records.length;
                            }
                        }
                        return new Ext.data.ResultSet({
                            total: total || recordCount,
                            count: recordCount,
                            records: records,
                            success: success,
                            message: message
                        });
                    }
                },
                url: adminPath + 'api/security/acp/findAllTokenName'
            }
        });
        var typeComboxStore = Ext.create('Ext.data.Store', {
            fields: [
                'name', 'value'
            ],
            data: [
                {
                    name: 'String',
                    value: 'String'
                },
                {
                    name: 'Number',
                    value: 'Number'
                },
                {
                    name: 'Array',
                    value: 'Array'
                }
            ]
        });
        me.tokenNameComboxField = {
            xtype: 'combo',
            store: tokenNameComboxStore,
            matchFieldWidth: true,
            valueField: 'name',
            editable: false,
            displayField: 'name'

        };
        me.typeComboField = {
            xtype: 'combo',
            editable: false,
            store: typeComboxStore,
            matchFieldWidth: true,
            valueField: 'value',
            displayField: 'name'
        };
        me.textField = {
            xtype: 'textfield',
            matchFieldWidth: true
        };
        var treeData = controller.diyJsonToTree(rawData, 'scope');//转换成tree的源数据
        me.store = Ext.create('Ext.data.TreeStore', {
            autoLoad: true,
            autoSync: true,
            fields: [
                'text', 'value', 'type', 'id', 'valueType'
            ],
            root: {
                expanded: true,
                children: treeData
            }
        });
        me.store.on('datachanged', function () {
            me.jsonData = controller.recoverJson(JSTreeNodeToJson(me.store.getRootNode().childNodes[0]));
            me.getDockedItems('toolbar[dock="bottom"]')[0].items.items[0].setValue(controller.toExpression(me.jsonData));
        }, this, {
            buffer: 1000
        });
        me.plugins = [
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 2,
                listeners: {
                    'beforeedit': function (editor, e, eOpts) {
                        return me.editable;//是否启用编辑
                    }
                }
            })
        ];
        me.tbar = [
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
        ];
        me.columns = {
            items: [
                {
                    xtype: 'treecolumn',
                    text: 'key',
                    flex: 2,
                    dataIndex: 'text',
                    sortable: true
                },
                {
                    text: 'value',
                    flex: 5,
                    hidden: !me.showValue,
                    dataIndex: 'value',
                    sortable: true,
                    editor: {
                        xtype: 'textfield',
                        defaultValue: null
                    }
                }
            ]
        };
        me.bbar = {
            layout: 'fit',
            items: [
                {
                    xtype: 'textfield',
                    itemId: 'expression'
                }
            ]
        }
        me.listeners = {
            'itemcontextmenu': me.showRightClickMenu,
            'beforeedit': me.beforeEdit
        };
        me.callParent(arguments);
    }
})


