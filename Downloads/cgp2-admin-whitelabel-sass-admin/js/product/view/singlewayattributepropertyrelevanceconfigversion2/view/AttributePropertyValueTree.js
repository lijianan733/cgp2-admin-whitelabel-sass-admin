/**
 * Created by admin on 2019/10/29.
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.AttributePropertyValueTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.attributeProfileTree',
    store: null,
    title: null,
    header: false,
    rootVisible: false,
    columnLines: true,
    useArrows: true,
    lines: false,
    resizable: false,
    allowValueBlank: true,//是否允许值为空
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true,
        overCls: '',
        overItemCls: ''
    },
    //selType: 'checkboxmodel',
    selModel: {
        checkModel: 'multiple',
        mode: 'MULTI',
        selType: 'rowmodel'
    },
    localSkuAttributes: null,//记录当前该组件使用中的SkuAttributeId
    tipInfoCalculation :null,
    emptyTextCalculation :null,

    constructor: function () {
        var me = this;
        me.localSkuAttributes = [];
        me.callParent(arguments);
    },
    isValid:function(){
        var me = this;
        var isValid = true;
        if(!me.allowBlank && Ext.isEmpty(me.getValue())){
            isValid=false;
        }
        return isValid;
    },
    setValue: function (data) {
        var me = this;
        me.localSkuAttributes = [];
        Ext.Array.each(data, function (result) {
            if (result.value) {
                result.propertyValue = result.value.value ? result.value.value : result.value.calculationExpression;
            }
            var propertyPath = result.propertyPath;
            var node = me.store.getRootNode().findChild('nodeDataId', propertyPath.attributeProfile._id);
            if (Ext.isEmpty(node)) {
                var root = me.store.getRootNode();
                node = me.nodeAddChild(root, result, false, '../../../ClientLibs/extjs/resources/themes/images/ux/property.png');
            }
            if (propertyPath.skuAttribute && JSON.stringify(propertyPath.skuAttribute) != '{}') {
                var childrenNode = node.findChild('nodeDataId', propertyPath.skuAttributeId);
                if (Ext.isEmpty(childrenNode)) {
                    me.nodeAddChild(node, result, true, '../../../ClientLibs/extjs/resources/themes/images/ux/attribute.png');
                    if (propertyPath.skuAttributeId) {
                        me.localSkuAttributes.push(propertyPath.skuAttributeId);
                    }
                } else {
                    Ext.Msg.confirm(i18n.getKey('prompt'), '该property已经存在,是否覆盖其值?', function (select) {
                        if (select == 'yes') {
                            node.removeChild(childrenNode);
                            me.nodeAddChild(node, result, true, '../../../ClientLibs/extjs/resources/themes/images/ux/attribute.png');
                        }
                    })
                }
            }

        });
        me.expandAll();
    },
    getValue: function () {
        var me = this;
        var value = [];
        var rootNode = me.getRootNode();
        rootNode.cascadeBy(function (node) {//遍历所有子叶节点，取出值
            if (node.isLeaf()) {
                value.push(
                    node.get('recordData')
                );
            }
        });
        return value;
    },

    nodeAddChild: function (node, result, leaf, image) {
        var nodeDataId = leaf ? result.propertyPath.skuAttribute._id : result.propertyPath.attributeProfile._id;
        var child = {
            text: leaf ? result.propertyPath.skuAttribute.attribute.name : result.propertyPath.attributeProfile.name,//+'<'+result.propertyPath.attributeProfile._id+'>',
            nodeDataId: nodeDataId,
            profileId: result.propertyPath.attributeProfile._id,
            propertyValue: leaf ? result.propertyValue : '',
            leaf: leaf,
            parentId: leaf ? result.propertyPath.attributeProfile._id : null,
            children: [],
            icon: image,
            id: JSGetUUID(),
            skuAttribute: result.propertyPath.skuAttribute,
            propertyName: result.propertyPath.propertyName,
            recordData: result,
            checked: leaf ? null : false
        };
        node.appendChild(child);
        return node.findChild('nodeDataId', nodeDataId);
    },
    initComponent: function () {
        var me = this;

        me.tbar = [
            '<strong style="color: green;font-size: 110%">' + i18n.getKey(me.mappingType) + '</strong>',
            //'->',
            {
                xtype: 'button',
                text: i18n.getKey('add') + i18n.getKey('profile'),
                iconCls: 'icon_add',
                handler: me.addNewRecord || function (btn) {
                    var title = null;
                    var window = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.ProfileSelectWindow', {
                        treeGrid: me
                    });
                    window.show();
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
        me.store = Ext.create('Ext.data.TreeStore', {
            fields: ['text', 'nodeDataId', 'profileId', 'children', 'propertyValue', 'skuAttribute', 'propertyName', 'recordData'],
            root: {
                expanded: true,
                children: []
            }
        });
        me.columns = [
            {
                xtype: 'treecolumn',
                dataIndex: 'text',
                text: i18n.getKey('profile') + '/' + i18n.getKey('attribute'),
                itemId: 'text',
                resizable: true,
                width: 180,
                tdCls: 'vertical-middle',
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            },
            {
                xtype: 'componentcolumn',
                itemId: 'skuAttribute',
                text: i18n.getKey('value'),
                dataIndex: 'skuAttribute',
                resizable: true,
                flex: 1,
                tdCls: 'vertical-middle',
                renderer: function (value, metadata, record) {
                    if (record.data.leaf) {
                        if (Ext.isEmpty(record.data.value)) {
                            if (me.valueType == 'FixValue') {
                                record.data.value = {
                                    clazz: "com.qpp.cgp.domain.executecondition.operation.value.FixValue",
                                    value: ''
                                };
                            } else if (me.valueType == 'Calculation') {
                                record.data.value = {
                                    clazz: "com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue",
                                    calculationExpression: ''
                                };
                            }
                        }
                        return me.createFieldByAttribute(record.get('recordData'), null, null, me.allowValueBlank);
                    }
                    else {//profile显示添加属性按钮
                        //metadata.style ='width:60px;';
                        return {
                            xtype: 'toolbar',
                            width: 82,
                            border: 0,
                            items: [{
                                xtype: 'button',
                                itemId: 'addAttribute',
                                text: i18n.getKey('add') + i18n.getKey('attribute'),
                                iconCls: 'icon_add',
                                width: 80,
                                handler: me.addNewRecord || function (btn) {
                                    var selectedSkuAttr = [];
                                    var items = me.ownerCt.items.items;
                                    Ext.Array.each(items, function (item) {
                                        if (item.xtype == 'gridcombo') {
                                            selectedSkuAttr = Ext.Array.merge(selectedSkuAttr, item.getSubmitValue());
                                        } else if (item.xtype == 'attributeProfileTree') {
                                            Ext.Array.each(item.getValue(), function (item) {
                                                selectedSkuAttr.push(item.propertyPath.skuAttributeId);
                                            });
                                        }
                                    });

                                    var window = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.ProfileAttributeSelectWindow', {
                                        treeGrid: me,
                                        recordData: record.data.recordData,
                                        selectedSkuAttr: selectedSkuAttr
                                    });
                                    window.show();
                                }
                            }]
                        };
                    }
                }
            },
            {
                xtype: 'actioncolumn',
                itemId: 'actioncolumn',
                width: 30,
                sortable: false,
                resizable: false,
                menuDisabled: true,
                align: 'center',
                tdCls: 'vertical-middle',
                renderer: function (value, metaData, record) {
                    if (!record.get('leaf')) {
                        metaData.style = 'display:none;';
                    }
                    var me = this;
                    return me;
                },
                items: [
                    {
                        text: i18n.getKey('delete'),
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actionremove',
                        tooltip: 'Remove',
                        handler: function (view, rowIndex, colIndex, item, e, record) {
                            Ext.Msg.confirm(i18n.getKey('info'), i18n.getKey('deleteConfirm'), function (select) {
                                if (select == 'yes') {
                                    var rootNode = me.getRootNode();
                                    var profileNode = rootNode.findChild('profileId', record.get('profileId'));
                                    profileNode.removeChild(profileNode.findChild('nodeDataId', record.get('nodeDataId')));
                                    //store.removeAt(rowIndex);
                                }
                            });
                        }
                    }
                ]
            }
        ];
        me.callParent(arguments);
        if (!Ext.isEmpty(me.valueData)) {
            me.setValue(me.valueData);
        }
    },
    createFieldByAttribute: function (record, defaultMulti, value, allowValueBlank) {
        var me = this;
        var data = {};
        if (record && record.propertyPath && record.propertyPath.skuAttribute) {
            data = record.propertyPath.skuAttribute.attribute;
        }
        if (Ext.isEmpty(data) || !data['inputType']) {
            throw Error('data should be a CGP.Model.Attribute instance!');
        }
        if (record.value) {
            var valueObj = record.value;
            value = valueObj.value ? valueObj.value : valueObj.calculationExpression;
        }
        var inputType = data['inputType'];
        var selectType = data['selectType'];
        var options = data['options'];
        var item = {};
        item.name = 'value';
        item.hideLabel = true;
        item.flex = 1;
        item.fieldLabel = record.propertyPath.skuAttribute.displayName;
        item.allowBlank = allowValueBlank;
        item.value = value;
        item.itemId = 'propertyValue';
        item.labelAlign = 'top';
        item.reset = function () {
            var me = this;
            me.beforeReset();
            me.setValue();
            me.clearInvalid();
            delete me.wasValid;
        };
        item.cls = 'propertyValue';
        item.listeners = {
            change: Ext.Function.createBuffered(function (field, newValue, oldValue, eOpts) {
                if (Ext.isArray(newValue)) {
                    newValue = newValue.join(',');
                }
                if (field.xtype == 'datetimefield' && !Ext.isEmpty(newValue)) {
                    var dateValue = new Date(newValue);
                    newValue = dateValue.getTime();
                }
                if (me.valueType == 'FixValue') {
                    record.value = {
                        clazz: "com.qpp.cgp.domain.executecondition.operation.value.FixValue",
                        value: newValue
                    };
                } else if (me.valueType == 'Calculation') {
                    record.value = {
                        clazz: "com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue",
                        calculationExpression: newValue
                    };
                }
            }, 500)
        };
        if (me.valueType == 'Calculation') {
            item.xtype = 'textfield';
            item.tipInfo = me.tipInfoCalculation?me.tipInfoCalculation:"属性取值:profiles['profileId']['skuAttributeId']['propertyName']+n 示例：profiles['123']['124']['Value']*0.5+profiles['123']['120']['Value']+5; 属性取option的值: profiles['profileId']['skuAttributeId']['Options'][0]['value']-n  示例：profiles['123']['125']['Options'][0]['value']+2";
            item.emptyText = me.emptyTextCalculation?me.emptyTextCalculation:"profiles['profileId']['skuAttributeId']['propertyName']+n";

            return item;
        }
        if (options.length > 0) {//选项类型
            item.xtype = 'combo';
            item.haveReset = true;
            item.multiSelect = defaultMulti ? defaultMulti : (selectType == 'MULTI' ? true : false);
            if (item.multiSelect) {
                value = value ? value.split(',') : [];
                item.listConfig = {
                    itemTpl: Ext.create('Ext.XTemplate', '<input type=checkbox>{[values.name]}'),
                    onItemSelect: function (record) {
                        var node = this.getNode(record);
                        if (node) {
                            Ext.fly(node).addCls(this.selectedItemCls);
                            var checkboxs = node.getElementsByTagName("input");
                            if (checkboxs != null)
                                var checkbox = checkboxs[0];
                            checkbox.checked = true;
                        }
                    },
                    listeners: {
                        itemclick: function (view, record, item, index, e, eOpts) {
                            var isSelected = view.isSelected(item);
                            var checkboxs = item.getElementsByTagName("input");
                            if (checkboxs != null) {
                                var checkbox = checkboxs[0];
                                if (!isSelected) {
                                    checkbox.checked = true;
                                } else {
                                    checkbox.checked = false;
                                }
                            }
                        }
                    }
                };
            }
            item.displayField = 'name';
            item.valueField = 'id';//不需要id
            item.editable = false;
            item.store = new Ext.data.Store({
                fields: ['id', 'name'],
                data: options
            });
            if (value) {
                if (Ext.isArray(value)) {
                    item.value = value.map(function (item) {
                        return Ext.Number.from(item);
                    });
                } else if (Ext.isNumber(value)) {
                    item.value = value;
                } else if (Ext.isString(value)) {
                    item.value = Ext.Number.from(value);
                }
            }
        } else if (inputType == 'Date') {//输入类型
            item.xtype = 'datetimefield';
            item.editable = false;
            item.format = "Y-m-d H:i:s";
            var newDate = new Date();
            newDate.setTime(value);
            item.value = Ext.Date.format(newDate, item.format);
        } else if (inputType == 'YesOrNo') {
            item.xtype = 'radiogroup';
            var yesItem = {
                name: item.name,
                inputValue: 'YES',
                boxLabel: 'YES'
            }
            var noItem = {
                name: item.name,
                inputValue: 'NO',
                boxLabel: 'NO'
            }
            if (value) {
                if (value == 'YES') {
                    yesItem.checked = true;
                } else if (value == 'NO') {
                    noItem.checked = true;
                }
            }
            item.items = [yesItem, noItem];
            item.columns = 2;
        } else if (me.valueType != 'Calculation' && data.valueType == 'Number') {
            item.xtype = 'numberfield';
        } else {
            item.xtype = 'textfield';
        }
        return item;
    }
})
