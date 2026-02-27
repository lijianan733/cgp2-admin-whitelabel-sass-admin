/**
 * Created by nan on 2019/1/21.
 */
Ext.define('CGP.product.view.bothwayattributepropertyrelevanceconfig.view.AttributeTreePanel', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.attributetreepanel',
    store: null,
    title: null,
    header: false,
    rootVisible: false,
    hideHeaders: true,
    columnLines: true,
    useArrows: true,
    lines: false,
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },
    selType: 'checkboxmodel',
    addNewRecord: null,//自定义的加入新记录的方法
    deleteRecord: null,//自定义删除记录的方法
    localSkuAttributes: null,//记录当前该组件使用中的SkuAttributeId
    constructor: function () {
        var me = this;
        me.localSkuAttributes = [];
        me.callParent(arguments);
    },
    setValue: function (data) {
        var me = this;
        me.localSkuAttributes = [];
        me.store.getRootNode().removeAll();
        var result = {}
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var name = item.skuAttribute.attribute.name + '(' + item.skuAttribute.id + ')'
            result[name] = result[name] || [];
            result[name].push({
                propertyName: item.propertyName,
                propertyValue: item.propertyValue,
                skuAttribute: item.skuAttribute
            });
            if (me.localSkuAttributes.indexOf(item.skuAttribute.id) == -1) {
                me.localSkuAttributes.push(item.skuAttribute.id);
            }
        }
        var items = [];
        for (var i in result) {
            item = {
                text: i,
                children: [],
                id: i,
                leaf: false,
                skuAttribute: result[i][0].skuAttribute,
                icon: '../../../ClientLibs/extjs/resources/themes/images/ux/attribute.png'
            };
            for (var j = 0; j < result[i].length; j++) {
                item.children.push({
                    text: result[i][j].propertyName,
                    propertyValue: result[i][j].propertyValue,
                    leaf: true,
                    id: JSGetUUID(),
                    propertyName: result[i][j].propertyName,
                    skuAttribute: result[i][j].skuAttribute,
                    icon: '../../../ClientLibs/extjs/resources/themes/images/ux/property.png'
                });
            }
            items.push(item);
        }
        me.store.getRootNode().appendChild(items);
        me.expandAll();
    },
    getValue: function () {
        var me = this;
        var value = [];
        me.localSkuAttributes = [];
        var rootNode = me.getRootNode();
        rootNode.cascadeBy(function (node) {//遍历所有子叶节点，取出值
            if (node.isLeaf()) {
                value.push(
                    {
                        skuAttribute: node.get('skuAttribute'),
                        propertyName: node.get('propertyName'),
                        propertyValue: node.get('propertyValue')
                    }
                );
            }
        });
        return value;
    },
    initComponent: function () {
        var me = this;
        me.store = Ext.create('Ext.data.TreeStore', {
            fields: ['text', 'children', 'propertyValue', 'skuAttribute', 'propertyName'],
            root: {
                expanded: true,
                children: []
            }
        });
        me.columns = [
            {
                xtype: 'treecolumn',
                flex: 1,
                dataIndex: 'text',
                text: 'attribute',
                itemId: 'attribute',
                tdCls: 'vertical-middle',
                renderer: function (value, metadata, record) {
                    var leaf = record.get('leaf');
                    if (!leaf) {
                        return '<strong>' + value + '</strong>';
                    }
                    return value;
                }
            },
            {
                flex: 1,
                dataIndex: 'propertyValue',
                xtype: 'componentcolumn',
                text: 'propertyValue',
                itemId: 'propertyValue',
                tdCls: 'vertical-middle',
                renderer: function (value, metadata, record) {
                    var disPlayStr = null;
                    if (value.clazz == 'com.qpp.cgp.value.ConstantValue') {
                        disPlayStr = value.value;

                    } else if (value.clazz == 'com.qpp.cgp.value.ExpressionValueEx') {
                        disPlayStr = '查看表达式';
                    } else if (value.clazz == 'com.qpp.cgp.value.JsonPathValue') {
                        disPlayStr = '查看JSON路径';
                    } else {
                        return null;
                    }
                    return {
                        xtype: 'displayfield',
                        value: '<a href="#")>' + disPlayStr + '</a>',
                        listeners: {
                            render: function (display) {
                                var a = display.el.dom.getElementsByTagName('a')[0];
                                var ela = Ext.fly(a);
                                ela.on("click", function () {
                                    var title = null;
                                    var anotherPanelSelectedSkuAttributes = null;//互补的panel中选择了的skuAttribute
                                    if (me.id == 'left') {
                                        anotherPanelSelectedSkuAttributes = me.ownerCt.getComponent('right').localSkuAttributes;
                                        title = 'leftSkuAttribute'
                                    } else {
                                        anotherPanelSelectedSkuAttributes = me.ownerCt.getComponent('left').localSkuAttributes;
                                        title = 'rightSkuAttribute'
                                    }
                                    var win = Ext.create('CGP.product.view.bothwayattributepropertyrelevanceconfig.view.AddAttributePropertyWindow', {
                                        title: i18n.getKey('edit') + i18n.getKey(title),
                                        attributeTreePanel: me,
                                        localSkuAttributes: me.localSkuAttributes,
                                        anotherPanelSelectedSkuAttributes: anotherPanelSelectedSkuAttributes,
                                        productId: me.ownerCt.ownerCt.ownerCt.productId,
                                        createOrEdit: 'edit',
                                        record: record
                                    })
                                    win.show();
                                    win.setValue(record.getData());
                                    var form = win.items.items[0]
                                    /*  var skuAttribute = form.getComponent('skuAttribute');
                                      var propertyName = form.getComponent('propertyName');
                                      skuAttribute.setDisabled(true);*/
                                    //propertyName.setDisabled(true);
                                });
                            }
                        }
                    };

                }
            }
        ];
        me.tbar = [
            '<strong style="color: green;font-size: 110%">' + i18n.getKey(me.title) + '</strong>', '->',
            {
                xtype: 'button',
                text: i18n.getKey('add'),
                iconCls: 'icon_add',
                handler: me.addNewRecord || function (btn) {
                    var title = null;
                    var anotherPanelSelectedSkuAttributes = null;//互补的panel中选择了的skuAttribute
                    if (me.id == 'left') {
                        anotherPanelSelectedSkuAttributes = me.ownerCt.getComponent('right').localSkuAttributes;
                        title = 'leftSkuAttribute';
                    } else {
                        anotherPanelSelectedSkuAttributes = me.ownerCt.getComponent('left').localSkuAttributes;
                        title = 'rightSkuAttribute';
                    }
                    var win = Ext.create('CGP.product.view.bothwayattributepropertyrelevanceconfig.view.AddAttributePropertyWindow', {
                        attributeTreePanel: this.ownerCt.ownerCt,
                        title: i18n.getKey('create') + i18n.getKey(title),
                        localSkuAttributes: me.localSkuAttributes,
                        anotherPanelSelectedSkuAttributes: anotherPanelSelectedSkuAttributes,
                        productId: me.ownerCt.ownerCt.ownerCt.productId
                    });
                    win.show();
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('delete'),
                iconCls: 'icon_bullet_delete',
                handler: me.deleteRecord || function (btn) {
                    var selectedRecords = me.getSelectionModel().getSelection();
                    var rootNode = me.getRootNode();
                    if (selectedRecords.length > 0) {
                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (select) {
                            if (select == 'yes') {
                                for (var i = 0; i < selectedRecords.length; i++) {
                                    if (selectedRecords[i].isLeaf()) {//叶子节点
                                        var node = rootNode.findChild('propertyName', selectedRecords[i].get('propertyName'), true);//担心该节点已经被删掉了
                                        if (node) {
                                            var partnerNode = node.parentNode;
                                            partnerNode.removeChild(node);
                                            if (partnerNode.childNodes.length == 0) {
                                                rootNode.removeChild(partnerNode);//无子节点时删除
                                                var skuAttributeId = partnerNode.get('skuAttribute').id;
                                                var index = me.localSkuAttributes.indexOf(skuAttributeId);
                                                me.localSkuAttributes.splice(index, 1);
                                            }
                                        }
                                    } else {
                                        rootNode.removeChild(selectedRecords[i]);
                                        var skuAttributeId = selectedRecords[i].get('skuAttribute').id;
                                        var index = me.localSkuAttributes.indexOf(skuAttributeId);
                                        me.localSkuAttributes.splice(index, 1);
                                    }
                                }
                            }
                        })
                    }
                }
            }
        ];
        me.callParent(arguments);
    }
})
