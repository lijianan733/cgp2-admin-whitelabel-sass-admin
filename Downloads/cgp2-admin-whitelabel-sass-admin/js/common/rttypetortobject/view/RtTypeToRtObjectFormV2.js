/**
 * Created by nan on 2020/8/31.
 * 特例化处理
 * 使用tags:RuntimeModelEditor来筛选特定的rtType
 * 选择一个rtType，填写所拥有的属性的值，生成rtObject
 * 该组件对特殊的数据结构{attributeId:"",groupId:'',skuAttributeId:''}进行特例化处理，使用树的结构来输入
 */
Ext.Loader.syncRequire([
    'CGP.common.rttypetortobject.view.RtTypeToRtObjectForm'
])
Ext.define("CGP.common.rttypetortobject.view.RtTypeToRtObjectFormV2", {
    extend: 'CGP.common.rttypetortobject.view.RtTypeToRtObjectForm',
    alias: 'widget.rttypetortobjectformv2',
    specialType: ['tempTreeRtType'],
    initComponent: function () {
        var me = this;
        var specialType = me.specialType;
        me.diyColumns = [
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
                        var nodePathArr = nodePath?.split(',') || [];
                        for (var i = 0; i < nodePathArr.length; i++) {
                            nodeObject = nodeObject[nodePathArr[i]];
                        }
                    } else {
                        nodeObject = null;
                    }
                    //有些特殊的rtType的属性需要特殊的组件来进行设置值处理
                    if (valueType != 'CustomType') {
                        if (Ext.Array.contains(specialType, valueType)) {
                            comp = {
                                name: 'attributeEditors',
                                xtype: 'attributetreecombo',
                                tag: 'nan',//自定义的属性，仅标识作用,
                                profileStore: Ext.data.StoreManager.get('profileStore'),
                                nodePath: nodePath,
                                rawData: nodeObject,
                                itemId: 'attributeEditors',
                            };
                        } else {
                            comp = Qpp.CGP.util.createFieldByAttributeV2(record.raw, {
                                msgTarget: 'side',
                                valueField: 'value',
                                validateOnChange: false,
                                fieldLabel: null,
                                allowBlank: true,
                                tag: 'nan',//自定义的属性，仅标识作用,
                                nodePath: nodePath,
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
                        }

                    } else {
                        comp = null;
                    }

                    return comp;
                }
            }
        ];
        me.rtTypeTreeStore = me.rtTypeTreeStore || Ext.create('CGP.rtattribute.store.RtType', {
            autoLoad: true,
            storeId: 'rtTypeTreeStore',
            root: me.rtTypeRootNode,
            params: {
                filter: Ext.JSON.encode([{
                    name: 'tags',
                    type: 'string',
                    value: 'RuntimeModelEditor'
                }])
            }
        });
        me.callParent(arguments);
        me.store.on('load', function (store, currentNode, childNodes) {
            //现在只能通过rtType中的tags字段来标识，当tags的值为PokerImageTextRtType，EasyAdvanceRtType，PokeSameDifferentRtType
            Ext.Array.each(childNodes, function (item) {
                if (/*Ext.Array.contains(me.specialType, item.get('code')) && */item.get('valueType') == "CustomType") {
                    item.set('valueType', 'tempTreeRtType');
                    item.set('leaf', true);
                }
            })
        })
    }
})
