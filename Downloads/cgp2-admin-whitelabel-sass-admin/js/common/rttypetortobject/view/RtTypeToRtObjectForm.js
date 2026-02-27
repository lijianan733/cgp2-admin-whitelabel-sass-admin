/**
 * Created by nan on 2020/8/31.
 * 选择一个rtType，填写所拥有的属性的值，生成rtObject
 */
Ext.Loader.syncRequire([
    'CGP.common.field.RtTypeSelectField'
])
Ext.define("CGP.common.rttypetortobject.view.RtTypeToRtObjectForm", {
    extend: 'Ext.tree.Panel',
    alias: 'widget.rttypetortobjectform',
    rootVisible: false,
    rtTypeRootNode: {
        _id: 'root',
        name: null,
        id: 'root'
    },
    viewConfig: {
        stripeRows: true,
    },
    rtTypeId: null,
    useArrows: true,
    autoScroll: true,
    rtTypeTreeStore: null,
    hideRtType: false,
    fieldLabel: null,
    readOnly: false,
    rtType: null,
    allowBlank: true,
    rtTypeName: null,
    diyColumns: null,//自定义的列配置
    error: null,
    getName: function () {
        var me = this;
        return me.name;
    },
    getFieldLabel: function () {
        var me = this;
        return me.fieldLabel;
    },
    getErrors: function () {
        var me = this;
        return me.error;
    },
    listeners: {
        beforeload: function (sto, operation, e) {
            var type = operation.node.get('valueType');
            var rtTypeId;
            var customType = operation.node.get('customType');
            if (customType) {
                rtTypeId = customType['_id'];
            }
            if (type == 'CustomType') {
                sto.proxy.url = adminPath + 'api/rtTypes/' + rtTypeId + '/rtAttributeDefs';
            }
        },
        load: function (store, node, records) {
            Ext.Array.each(records, function (item) {
                item.set('icon', path + 'ClientLibs/extjs/resources/themes/images/ux/category.png');
                if (!node.isRoot()) {//不为根节点
                    item.set('path', node.get('path') + ',' + item.get('name'))
                } else {
                    item.set('path', item.get('name'));
                    node.set('path', '');
                }
            });

        }
    },
    isValid: function () {
        var me = this;
        var treePanel = this;
        var isValid = true;

        var tbar = me.getDockedItems('toolbar[dock="top"]')[0];
        var rtTypeTreeCombo = tbar.getComponent('rtType');
        if (rtTypeTreeCombo.isValid() == false) {
            isValid = false;
            me.error = 'rtType不能为空';
        } else {
            var valueExFields = treePanel.query('[tag=nan]');
            for (var i = 0; i < valueExFields.length; i++) {
                if (valueExFields[i].isValid() == false) {
                    isValid = false;
                    me.error = '所有属性值不能为空';
                }
            }
        }
        return isValid;
    },
    getValue: function () {
        var treePanel = this;
        var valueExFields = treePanel.query('[tag=nan]');
        var result = {};
        for (var i = 0; i < valueExFields.length; i++) {
            valueExFields[i].isValid();
        }
        for (var i = 0; i < valueExFields.length; i++) {
            var nodePath = valueExFields[i].nodePath.split(',');
            var node = result;
            for (var j = 0; j < nodePath.length; j++) {
                if (node[nodePath[j]]) {//已有该属性

                } else {//未有该属性
                    node[nodePath[j]] = {};
                }
                if (j != nodePath.length - 1) {//不是最后一个
                    node = node[nodePath[j]];//指向下一层
                } else {//最后一个了
                    if (valueExFields[i].diyGetValue) {
                        node[nodePath[j]] = valueExFields[i].diyGetValue();
                    } else {
                        node[nodePath[j]] = valueExFields[i].getValue();
                    }
                }
            }
        }
        console.log(result);
        return result;
    },
    setValue: function (rtType, rtObject) {
        var me = this;
        var rtTypeId = rtType._id || 'root';
        var tbar = me.getDockedItems('toolbar[dock="top"]')[0];
        var rtTypeTreeCombo = tbar.getComponent('rtType');
        me.rtObject = rtObject;
        if (rtTypeId == 'root') {
            me.getRootNode().removeAll();
        } else {
            rtTypeTreeCombo.setInitialValue([rtTypeId]);
        }
    },

    initComponent: function () {
        var me = this;
        me.store = Ext.create('CGP.material.store.RtAttributeTree', {
            autoLoad: false,
            root: {
                _id: "root"
            }
        });
        me.rtTypeTreeStore = me.rtTypeTreeStore || Ext.create('CGP.rtattribute.store.RtType', {
            autoLoad: true,
            storeId: 'rtTypeTreeStore',
            root: me.rtTypeRootNode
        });
        me.columns = me.diyColumns || [
            {
                xtype: 'treecolumn',
                text: i18n.getKey('name'),
                flex: 6,
                dataIndex: 'name',
                tdCls: 'vertical-middle',
                renderer: function (value, metadata, record) {
                    return record.get("name") + '<font color="green"><' + record.get('_id') + '></font>';
                }
            },
            {
                text: i18n.getKey('value'),
                xtype: 'componentcolumn',
                flex: 7,
                dataIndex: 'value',
                tdCls: 'vertical-middle',
                sortable: false,
                hidden: me.hiddenValue,
                listeners: {},
                renderer: function (value, metadata, record, a, b, c, view) {
                    var valueType = record.get('valueType');
                    var comp;
                    var treePanel = view.ownerCt;
                    var nodePath = record.get('path');
                    var nodeObject = treePanel.rtObject;
                    if (!Ext.Object.isEmpty(treePanel.rtObject)) {
                        //在object中取出对应的数据
                        var nodePathArr = nodePath.split(',');
                        for (var i = 0; i < nodePathArr.length; i++) {
                            nodeObject = nodeObject[nodePathArr[i]];
                        }
                    } else {
                        nodeObject = null;
                    }
                    if (valueType != 'CustomType') {
                        comp = Qpp.CGP.util.createFieldByAttributeV2(record.raw, {
                            msgTarget: 'side',
                            valueField: 'value',
                            validateOnChange: false,
                            fieldLabel: null,
                            allowBlank: me.allowBlank,
                            tag: 'nan',//自定义的属性，仅标识作用,
                            nodePath: nodePath
                        });
                        if (!Ext.isEmpty(nodeObject)) {
                            comp.readOnly = me.readOnly;
                            comp.value = nodeObject;

                        }
                        //特殊逻辑，clazz的值为对应的rtType的name字段
                        if (record.raw.code == 'clazz') {
                            comp.value = me.rtTypeName;
                            comp.readOnly = true;
                        }
                    } else {
                        comp = null;
                    }

                    return comp;
                }

            }
        ];
        me.tbar = {
            hidden: me.hideRtType,
            items: [
                {
                    xtype: 'rttypeselectfield',
                    name: 'rtType',
                    itemId: 'rtType',
                    fieldLabel: i18n.getKey('rtType'),
                    readOnly: false,
                    flex: 1,
                    allowBlank: false,
                    multiselect: false,
                    store: me.rtTypeTreeStore,
                    listeners: {
                        change: function (comp, newValue, oldValue) {
                            if (!Ext.isEmpty(newValue)) {
                                me.rtTypeName = this.getRawValue();
                                me.getStore().proxy.url = adminPath + 'api/rtTypes/' + newValue + '/rtAttributeDefs';
                                me.rtType = {
                                    _id: newValue,
                                    clazz: 'com.qpp.cgp.domain.bom.attribute.RtType'
                                };
                                me.rtTypeId = newValue;
                            } else {
                                me.rtTypeName = '';
                                me.getStore().proxy.url = adminPath + 'api/rtTypes/root/rtAttributeDefs';
                            }
                            me.getStore().load({
                                callback: function (records) {
                                    me.expandAll();
                                }
                            });
                        },
                        afterrender: function (comp) {
                            if (me.rtType) {
                                comp.setInitialValue([me.rtType._id]);
                            }
                        }
                    }
                },
            ]
        };
        me.callParent();
    }
})
