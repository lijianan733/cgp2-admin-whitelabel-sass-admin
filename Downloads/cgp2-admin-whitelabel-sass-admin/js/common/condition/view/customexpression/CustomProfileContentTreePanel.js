/**
 * @Description:使用
 * @author nan
 * @date 2023/12/27
 * profileValues[profileCode][sku属性code]['Enable']
 */

Ext.define('CGP.common.condition.view.customexpression.CustomProfileContentTreePanel', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.custom_profile_content_treepanel',
    store: null,
    autoScroll: false,
    header: {
        style: {
            background: '#f5f5f5'
        },
        hidden: true,
        title: '上下文',
    },
    viewConfig: {
        stripeRows: true,
    },
    hideHeaders: true,
    rootVisible: false,
    profileStore: null,
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.common.condition.controller.Controller');
        var treeData = controller.buildProfileContext(me.profileStore);
        me.store = Ext.create('Ext.data.TreeStore', {
            fields: [
                '_id', 'text', 'children', 'type', 'attribute'
            ],
            proxy: {
                type: 'memory'
            },
            root: {
                expanded: true,
                children: treeData
            }
        });
        me.tbar = {
            enableOverflow: true,
            items: [
                {
                    xtype: 'button',
                    text: i18n.getKey('expandAll'),
                    iconCls: 'icon_expandAll',
                    count: 0,
                    handler: function (btn) {
                        var treepanel = btn.up('[xtype=custom_profile_content_treepanel]');
                        if (btn.count % 2 == 0) {
                            treepanel.expandAll();
                            btn.setText(i18n.getKey('collapseAll'));
                            btn.setIconCls('icon_collapseAll');

                        } else {
                            treepanel.collapseAll();
                            btn.setText(i18n.getKey('expandAll'));
                            btn.setIconCls('icon_expandAll');
                        }
                        btn.count++;
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('展开') + i18n.getKey('下一层'),
                    handler: function (btn) {
                        var treepanel = btn.up('[xtype=custom_profile_content_treepanel]');
                        var rootNode = treepanel.getRootNode();
                        var nodes = [];
                        rootNode.cascadeBy(function (node) {//遍历节点
                            if (node.isRoot() == true) {
                                if (node.isExpanded() == false && node.isLeaf() == false) {//未张开的根
                                    nodes.push(node);
                                }
                            } else {
                                if (node.isExpanded() == false && node.isLeaf() == false && node.parentNode.isExpanded() == true) {//未张开的节点
                                    nodes.push(node);
                                }
                            }

                        });
                        nodes.forEach(function (node) {
                            node.expand()
                        });
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('收起') + i18n.getKey('一层'),
                    handler: function (btn) {
                        var treePanel = btn.up('[xtype=custom_profile_content_treepanel]');
                        var rootNode = treePanel.getRootNode();
                        var maxDepth = 0;
                        rootNode.cascadeBy(function (node) {
                            if (node.isRoot() == true) {

                            } else {
                                if (node.parentNode.isExpanded() == true && node.getDepth() > maxDepth) {
                                    maxDepth = node.getDepth();
                                }
                            }

                        })
                        rootNode.cascadeBy(function (node) {
                            if ((node.isExpanded() == true && node.isLeaf() == false) && node.getDepth() == (maxDepth - 1)) {
                                node.collapse();
                            }
                        })
                    }
                }],
        };
        me.columns = [
            {
                xtype: 'atagcolumn',
                width: 30,
                dataIndex: 'text',
                align: 'right;padding:0px;',
                getDisplayName: function (value, metaData, record) {
                    console.log(arguments)
                    if (record.isLeaf()) {
                        return '<a><img role="button" alt="" ' +
                            'src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="' +
                            'class="x-action-col-icon x-action-col-0 icon_ux_left" data-qtip="插入到表达式"></a>';
                    } else {
                        return '';
                    }
                },
                clickHandler: function (value, metaData, record, rowIndex, colIndex, store, view) {
                    var grid = view.ownerCt;
                    var path = record.getId();
                    var win = grid.up('[xtype=custom_condition_window]')
                    win.insertAtCursor(path);
                    grid.getSelectionModel().select(record);
                }
            },
            {
                xtype: 'treecolumn',
                dataIndex: 'text',
                flex: 1,
                text: 'text',
                renderer: function (value, metaData, record) {
                    var nodeType = record.get('type');
                    if (nodeType == 'profile') {
                        var id = record.getId();
                        var arr = id.split('_');
                        var code = arr[1];
                        if (Ext.isEmpty(code)) {
                            return `<font color="red">profile中code字段缺失</font>(${arr[0]})`
                        }
                    }
                    return value;
                }
            }];
        me.callParent();
        me.on('afterrender', function () {
            var treeCombo = this;
            if (treeCombo.rawData) {
                treeCombo.diySetValue(treeCombo.rawData);
            }
        });
        me.on('select', function (selectionModel, record) {
            var me = this;
            var data = {};
            var newRecord = null;
            if (record.isLeaf()) {
                var attribute = record.raw.attribute;
                data = {
                    key: record.getId(),
                    type: 'skuAttribute',
                    valueType: attribute.valueType,
                    selectType: attribute.selectType,
                    attrOptions: attribute.options,
                    required: false,
                    isSku: false,//boolean
                    displayName: attribute.displayName + '(属性Id:' + attribute.id + ')',//显示的是属性id，sku属性显示名称
                    path: record.getId(),//该属性在上下文中的路径
                    keyType: 'skuCode',
                    id: attribute.id,
                    code: attribute.code,
                    attributeInfo: record.raw.skuAttribute,
                    name: attribute.name
                }
                newRecord = new CGP.common.condition.model.ContentAttributeModel(data)
            } else {
                newRecord = null;
            }
            var extraFeature = me.ownerCt.ownerCt.getComponent('extraFeature');
            //操作符
            var operator = extraFeature.getComponent('operator');
            operator.refreshData(newRecord);

            //选项
            var option = extraFeature.getComponent('option');
            option.refreshData(newRecord);
            //详情
            var detail = extraFeature.getComponent('detail');
            detail.refreshData(newRecord);

            //模板
            var template = extraFeature.getComponent('template');
            template.refreshData(newRecord);
        })
    },
})